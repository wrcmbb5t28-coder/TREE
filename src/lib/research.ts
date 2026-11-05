import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { isPaid } from "@/lib/plans";

/**
 * Archive research for one ancestor, powered by the treename-roots skill (skills/treename-roots).
 * The model searches the web (Anthropic web search tool), grades what it finds and returns a JSON
 * report. Rules that protect families are enforced here in code, not only in the prompt:
 *  - only people who have died or were born more than 100 years ago;
 *  - only names of relatives who meet the same rule are sent to the model;
 *  - links in the report must come from the search results or the skill's own portal list.
 */

export const RESEARCH_LIMITS = {
  // Free families get one search to see what it is; paid families a monthly allowance.
  freeTotal: 1,
  paidPerMonth: 20,
  maxSearchesPerRun: 10,
  // A run that has not finished after this long is treated as failed.
  staleAfterMs: 6 * 60 * 1000,
};

export type FindingStatus = "documented" | "corroborated" | "possible" | "lead" | "contradicted";
export type ResearchReport = {
  summary: string;
  findings: { title: string; detail: string; status: FindingStatus; source: string; url: string | null }[];
  notFound: string[];
  nextSteps: { title: string; detail: string; url: string | null }[];
  letter: { to: string; language: string; text: string } | null;
  caveats: string | null;
};

const STATUSES: FindingStatus[] = ["documented", "corroborated", "possible", "lead", "contradicted"];
const LANG_NAMES: Record<string, string> = { en: "English", de: "German", fr: "French", it: "Italian", es: "Spanish", ru: "Russian" };

// ---------- Who may be researched ----------

export function canResearch(p: { isLiving: boolean; birthYear: number | null }): boolean {
  if (!p.isLiving) return true;
  return p.birthYear != null && p.birthYear <= new Date().getFullYear() - 100;
}

function isAdmin(email: string | null | undefined): boolean {
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return !!email && admins.includes(email.toLowerCase());
}

/** How many more searches this family can start now. null = unlimited. */
export async function researchesLeft(
  family: { id: string; plan: string; planExpiresAt: Date | null },
  user: { email?: string | null },
): Promise<number | null> {
  if (isAdmin(user.email)) return null;
  if (isPaid(family)) {
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const used = await db.research.count({ where: { familyId: family.id, createdAt: { gte: since }, status: { not: "failed" } } });
    return Math.max(0, RESEARCH_LIMITS.paidPerMonth - used);
  }
  const used = await db.research.count({ where: { familyId: family.id, status: { not: "failed" } } });
  return Math.max(0, RESEARCH_LIMITS.freeTotal - used);
}

// ---------- The skill ----------

const SKILL_DIR = path.join(process.cwd(), "skills", "treename-roots");

const REGION_OF: Record<string, string[]> = {
  "ex-ussr": ["RU", "UA", "BY", "MD", "GE", "AM", "AZ", "KZ", "UZ", "KG", "TJ", "TM", "SU"],
  "poland-baltics": ["PL", "LT", "LV", "EE", "BY", "UA"],
  "german-speaking": ["DE", "AT", "LI"],
  switzerland: ["CH"],
  "france-benelux": ["FR", "BE", "LU", "MC"],
  italy: ["IT", "SM", "VA", "MT"],
  "spain-latam": ["ES", "PT", "AD", "MX", "AR", "CL", "PE", "CO", "VE", "CU", "UY", "PY", "BO", "EC", "GT", "HN", "SV", "NI", "CR", "PA", "DO", "PR", "BR"],
  "czech-slovak": ["CZ", "SK", "HU"],
  "english-speaking": ["GB", "IE", "US", "CA", "AU", "NZ"],
};
const ALL_REGIONS = Object.keys(REGION_OF);

/** Region references that match the countries in a person's life. Unknown → all of them. */
export function pickRegions(countries: (string | null | undefined)[]): string[] {
  const codes = new Set(countries.filter(Boolean).map((c) => String(c).toUpperCase()));
  const out = ALL_REGIONS.filter((r) => REGION_OF[r].some((c) => codes.has(c)));
  // A Ukrainian or Belarusian birth place is usually Russian Empire or Polish records: keep both.
  return out.length ? out : ALL_REGIONS;
}

function readSkill(file: string): string {
  try {
    return readFileSync(path.join(SKILL_DIR, file), "utf8");
  } catch (e) {
    console.error("[research] missing skill file", file, e);
    return "";
  }
}

function skillPrompt(regions: string[]): string {
  const core = readSkill("SKILL.md").replace(/^---[\s\S]*?---\s*/, "");
  const refs = ["general", ...regions].map((r) => `\n\n<reference name="${r}">\n${readSkill(`references/${r}.md`)}\n</reference>`).join("");
  return core + refs;
}

const OUTPUT_RULES = `

# Output for the Treename website
You are running inside Treename, not in a chat. The family cannot answer questions during the search, so take the most reasonable reading and go ahead.
Use the web_search tool for real searches (up to about ${RESEARCH_LIMITS.maxSearchesPerRun}). Search in the language of the sources. Never put the names of living people into a search.
When you are done, reply with ONE JSON object and nothing else, in this exact shape:
{"summary": string,
 "findings": [{"title": string, "detail": string, "status": "documented"|"corroborated"|"possible"|"lead"|"contradicted", "source": string, "url": string|null}],
 "notFound": [string],
 "nextSteps": [{"title": string, "detail": string, "url": string|null}],
 "letter": {"to": string, "language": string, "text": string} | null,
 "caveats": string|null}
Rules for the JSON:
- Write every text field in the reader's language given in the request, except quotes from sources and the letter, which is written in the archive's language.
- summary: 2-4 sentences, the most useful thing first. If nothing was found, say so and name the most promising next step.
- findings: at most 6. "possible" = possible match, identity not settled. url = the exact page you saw in the search results; null if you did not see one. Do not list a finding without a real search result behind it.
- notFound: short items "where you searched and what that coverage means" (at most 5).
- nextSteps: at most 5 concrete steps the family can take themselves (archive, what to ask for, who may ask). url only for an official portal or a page you saw.
- letter: a short request to the single most promising archive or registry, or null if none is clear. Use placeholders like [your name], [your address] for the sender's details.
- caveats: one or two sentences on name variants, calendar or border issues that matter, or null.`;

// ---------- Building the request ----------

function personLine(p: { firstName: string; lastName: string | null; birthYear: number | null; deathYear: number | null; birthPlace: string | null; birthCountry: string | null }) {
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
  const years = p.birthYear || p.deathYear ? ` (${p.birthYear ?? "?"}–${p.deathYear ?? "?"})` : "";
  const place = [p.birthPlace, p.birthCountry].filter(Boolean).join(", ");
  return `${name}${years}${place ? `, born in ${place}` : ""}`;
}

async function buildRequest(personId: string, familyId: string, lang: string) {
  const p = await db.person.findFirst({
    where: { id: personId, familyId },
    include: {
      parentLinks: { include: { parent: true } },
      childLinks: { include: { child: true } },
      events: { orderBy: [{ year: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!p) throw new Error("Person not found");
  if (!canResearch(p)) throw new Error("This person may be living");

  // Spouses are not modelled directly: co-parents of this person's children.
  const childIds = p.childLinks.map((l) => l.childId);
  const coParents = childIds.length
    ? await db.relationship.findMany({ where: { childId: { in: childIds }, parentId: { not: p.id } }, include: { parent: true } })
    : [];
  const safe = <T extends { isLiving: boolean; birthYear: number | null }>(x: T) => canResearch(x);
  const parents = p.parentLinks.map((l) => l.parent).filter(safe);
  const children = p.childLinks.map((l) => l.child).filter(safe);
  const partners = [...new Map(coParents.map((r) => [r.parent.id, r.parent])).values()].filter(safe);
  const hiddenRelatives = p.parentLinks.length + p.childLinks.length - parents.length - children.length;

  const stories = await db.story.findMany({
    where: { familyId, visibility: { not: "private" }, OR: [{ personId: p.id }, { personId: null, answer: { question: { storytellerId: p.id } } }] },
    select: { title: true, body: true },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  const lines = [
    `Reader's language: ${LANG_NAMES[lang] ?? "English"}`,
    "",
    `Person to research: ${personLine(p)}`,
    p.isLiving ? "Living status: born more than 100 years ago, marked as living in the tree (probably unknown)." : `Died${p.deathYear ? ` in ${p.deathYear}` : ""}.`,
    p.gender ? `Gender: ${p.gender === "f" ? "female" : "male"}` : "",
    p.relation ? `Relation to the tree owner: ${p.relation}` : "",
    p.bio ? `Short description by the family: ${p.bio}` : "",
    p.lifePath ? `Life story written by the family (family memory, not documented):\n"""${p.lifePath.slice(0, 2500)}"""` : "",
    parents.length ? `Parents: ${parents.map(personLine).join("; ")}` : "",
    partners.length ? `Spouse / co-parent: ${partners.map(personLine).join("; ")}` : "",
    children.length ? `Children (deceased or born over 100 years ago): ${children.map(personLine).join("; ")}` : "",
    hiddenRelatives > 0 ? `${hiddenRelatives} living relative(s) are in the tree and are deliberately not named.` : "",
    p.events.length
      ? `Life events from the family:\n${p.events.map((e) => `- ${e.year ?? "?"}: ${e.description}${e.place || e.country ? ` (${[e.place, e.country].filter(Boolean).join(", ")})` : ""}`).join("\n")}`
      : "",
    stories.length ? `Family stories that mention this person (family memory):\n${stories.map((s) => `- ${s.title}: ${s.body.slice(0, 600)}`).join("\n")}` : "",
  ].filter(Boolean);

  const regions = pickRegions([p.birthCountry, ...p.events.map((e) => e.country), ...parents.map((x) => x.birthCountry)]);
  return { user: lines.join("\n"), regions };
}

// ---------- Running it ----------

function parseJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("No JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

function hostOf(u: string): string | null {
  try {
    return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

const str = (x: unknown, max: number) => (typeof x === "string" ? x.trim().slice(0, max) : "");

/** Keep only links whose site appeared in the search results or in the skill's portal list. */
export function cleanReport(raw: unknown, allowedHosts: Set<string>): ResearchReport {
  const j = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const url = (x: unknown) => {
    const u = str(x, 500);
    if (!/^https?:\/\//i.test(u)) return null;
    const h = hostOf(u);
    return h && [...allowedHosts].some((a) => h === a || h.endsWith(`.${a}`)) ? u : null;
  };
  const arr = (x: unknown) => (Array.isArray(x) ? x : []);
  const findings = arr(j.findings)
    .map((f: Record<string, unknown>) => ({
      title: str(f?.title, 160),
      detail: str(f?.detail, 1200),
      status: (STATUSES.includes(f?.status as FindingStatus) ? f.status : "lead") as FindingStatus,
      source: str(f?.source, 200),
      url: url(f?.url),
    }))
    .filter((f) => f.title)
    // A "documented" record we cannot link to is reported as a lead.
    .map((f) => (f.url || f.status === "lead" || f.status === "possible" ? f : { ...f, status: "lead" as FindingStatus }))
    .slice(0, 6);
  const letter = j.letter && typeof j.letter === "object" ? (j.letter as Record<string, unknown>) : null;
  return {
    summary: str(j.summary, 1500),
    findings,
    notFound: arr(j.notFound).map((x) => str(x, 300)).filter(Boolean).slice(0, 5),
    nextSteps: arr(j.nextSteps)
      .map((s: Record<string, unknown>) => ({ title: str(s?.title, 160), detail: str(s?.detail, 900), url: url(s?.url) }))
      .filter((s) => s.title)
      .slice(0, 5),
    letter: letter && str(letter.text, 20) ? { to: str(letter.to, 200), language: str(letter.language, 40), text: str(letter.text, 4000) } : null,
    caveats: str(j.caveats, 600) || null,
  };
}

/** Runs one research job to the end and stores the result. Never throws. */
export async function runResearch(researchId: string): Promise<void> {
  const job = await db.research.findUnique({ where: { id: researchId } });
  if (!job || job.status !== "running") return;
  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");
    const { user, regions } = await buildRequest(job.personId, job.familyId, job.lang);
    await db.research.update({ where: { id: job.id }, data: { regions: regions.join(",") } });

    const system = skillPrompt(regions) + OUTPUT_RULES;
    const allowedHosts = new Set<string>();
    for (const m of system.matchAll(/\b([a-z0-9-]+(?:\.[a-z0-9-]+)+\.(?:[a-z]{2,}))\b/gi)) {
      const h = m[1].toLowerCase().replace(/^www\./, "");
      if (!/\.(md|ts|json|csv)$/.test(h)) allowedHosts.add(h);
    }

    const client = new Anthropic();
    const messages: Anthropic.MessageParam[] = [{ role: "user", content: user }];
    let searches = 0;
    let text = "";
    // The server pauses long tool turns ("pause_turn"); continue a few times.
    for (let turn = 0; turn < 4; turn++) {
      const msg = await client.messages.create({
        model: process.env.RESEARCH_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 8000,
        system,
        messages,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: RESEARCH_LIMITS.maxSearchesPerRun }],
      });
      for (const b of msg.content) {
        if (b.type === "server_tool_use") searches++;
        if (b.type === "web_search_tool_result" && Array.isArray(b.content)) {
          for (const r of b.content) {
            const h = r.type === "web_search_result" ? hostOf(r.url) : null;
            if (h) allowedHosts.add(h);
          }
        }
      }
      text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
      if (msg.stop_reason !== "pause_turn") break;
      messages.push({ role: "assistant", content: msg.content });
    }

    const report = cleanReport(parseJson(text), allowedHosts);
    if (!report.summary && !report.findings.length && !report.nextSteps.length) throw new Error("Empty report");
    await db.research.update({
      where: { id: job.id },
      data: { status: "done", result: JSON.stringify(report), searches, finishedAt: new Date() },
    });
  } catch (e) {
    console.error("[research] failed", researchId, e);
    await db.research
      .update({ where: { id: researchId }, data: { status: "failed", error: String(e instanceof Error ? e.message : e).slice(0, 500), finishedAt: new Date() } })
      .catch(() => {});
  }
}

export function readReport(result: string | null): ResearchReport | null {
  if (!result) return null;
  try {
    return JSON.parse(result) as ResearchReport;
  } catch {
    return null;
  }
}
