import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";
import { db } from "./db";

/**
 * A professional proofreader for everything the family types by hand (names, places, descriptions,
 * life stories, events, written memories). It fixes spelling, grammar, punctuation and obvious typos
 * in names ("Алесандр" → "Александр"), and nothing else: no rewording, no new content, the family's
 * voice stays. If the AI is unavailable or slow, the text is saved exactly as typed.
 */

const LANG: Record<string, string> = { en: "English", de: "German", fr: "French", it: "Italian", es: "Spanish", ru: "Russian" };

export type FieldKind = "name" | "place" | "text";
export type Change = { field: string; from: string; to: string };

const SYSTEM = `You are a meticulous professional proofreader (корректор) for a family-history book.
You receive JSON: {"lang": "...", "fields": {"key": {"kind": "name|place|text", "value": "..."}}}.
Return ONLY JSON: {"fields": {"key": "corrected value", ...}} with exactly the same keys.

Correct:
- spelling, grammar, agreement, punctuation, capitalisation, spacing, obvious typos;
- for kind "name": a clear misspelling of a common first name or surname in that language (e.g. "Алесандр" → "Александр", "Нтаалья" → "Наталья", "алексей" → "Алексей", "Micheal" → "Michael");
- for kind "place": a clear misspelling of a real town or country ("Масква" → "Москва").

Never:
- rephrase, shorten, expand, reorder, "improve" the style or change words that are spelled correctly;
- change rare, foreign, old-fashioned or dialect names and words that are real (Ефросинья, Агафон, Siobhan stay);
- change facts, dates, numbers, quotes of speech or the storyteller's colloquial voice;
- translate anything; change ё/е as written; add or remove line breaks.
If you are not sure something is a mistake, leave it as it is. If a value is already correct, return it unchanged.`;

function lev(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 40) return Math.abs(m - n);
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

/** A proofreader must not rewrite: drop corrections that change too much. */
function plausible(kind: FieldKind, from: string, to: string): boolean {
  if (!to.trim()) return false;
  if (kind !== "text") return lev(from.toLowerCase(), to.toLowerCase()) <= Math.max(2, Math.ceil(from.length / 4));
  const lenOk = Math.abs(to.length - from.length) <= Math.max(12, from.length * 0.08);
  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
  return lenOk && Math.abs(words(to) - words(from)) <= Math.max(2, words(from) * 0.05);
}

export async function proofread(lang: string, fields: Record<string, { kind: FieldKind; value: string | null | undefined }>): Promise<{ values: Record<string, string>; changes: Change[] }> {
  const input: Record<string, { kind: FieldKind; value: string }> = {};
  for (const [k, f] of Object.entries(fields)) if (f.value && f.value.trim() && /\p{L}/u.test(f.value)) input[k] = { kind: f.kind, value: f.value };
  const values: Record<string, string> = Object.fromEntries(Object.entries(input).map(([k, f]) => [k, f.value]));
  if (!Object.keys(input).length || !process.env.ANTHROPIC_API_KEY) return { values, changes: [] };

  const size = Object.values(input).reduce((n, f) => n + f.value.length, 0);
  const client = new Anthropic();
  try {
    const msg = await client.messages.create(
      {
        model: process.env.PROOFREAD_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: Math.min(16000, Math.ceil(size / 2) + 400),
        system: SYSTEM,
        messages: [{ role: "user", content: JSON.stringify({ lang: LANG[lang] ?? lang, fields: input }) }],
      },
      { timeout: size > 4000 ? 20000 : 9000, maxRetries: 0 },
    );
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as { fields?: Record<string, unknown> };
    const changes: Change[] = [];
    for (const [k, f] of Object.entries(input)) {
      const to = json.fields?.[k];
      if (typeof to !== "string" || to === f.value) continue;
      if (!plausible(f.kind, f.value, to)) continue;
      values[k] = to;
      changes.push({ field: k, from: f.value, to });
    }
    return { values, changes };
  } catch (e) {
    console.error("[proofread] skipped, saving as typed", e);
    return { values, changes: [] };
  }
}

// ---------- Telling the person what was fixed (and letting them undo it) ----------

export type FixNotice = {
  items: { field: string; from: string; to: string }[]; // short word-level diffs to show
  more: number;
  undo?: string; // id of the saved record with the text as typed
};
export type Undo = { model: "person" | "story" | "event" | "user"; id: string; familyId: string; data: Record<string, string>; fixed: Record<string, string> };

/** Words that changed between two versions of a text (a few, for the notice). */
function wordDiffs(a: string, b: string): { from: string; to: string }[] {
  const A = a.split(/(\s+)/), B = b.split(/(\s+)/);
  if (A.length > 3000 || B.length > 3000) return [{ from: "…", to: "…" }];
  const n = A.length, m = B.length;
  const L: Uint16Array[] = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out: { from: string; to: string }[] = [];
  let i = 0, j = 0, fa: string[] = [], fb: string[] = [];
  const flush = () => { const f = fa.join("").trim(), t = fb.join("").trim(); if (f || t) out.push({ from: f, to: t }); fa = []; fb = []; };
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { flush(); i++; j++; }
    else if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) fb.push(B[j++]);
    else fa.push(A[i++]);
  }
  flush();
  return out;
}

export async function noteFixes(changes: Change[], undo?: Undo) {
  if (!changes.length) return;
  const all = changes.flatMap((c) => (c.from.length <= 60 && c.to.length <= 60 ? [{ field: c.field, from: c.from, to: c.to }] : wordDiffs(c.from, c.to).map((d) => ({ field: c.field, ...d }))));
  const items = all.slice(0, 6).map((x) => ({ field: x.field, from: x.from.slice(0, 60), to: x.to.slice(0, 60) }));
  const notice: FixNotice = { items, more: Math.max(0, all.length - items.length) };
  if (undo) {
    // the text as typed is kept, so "undo" works for long texts too
    const ev = await db.analyticsEvent.create({ data: { name: "proofread_fix", familyId: undo.familyId, props: JSON.stringify(undo) } });
    notice.undo = ev.id;
  }
  (await cookies()).set("tn_fixed", encodeURIComponent(JSON.stringify(notice)), { path: "/", maxAge: 120, sameSite: "lax", httpOnly: false });
}
