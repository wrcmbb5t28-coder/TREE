"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import { isDemoFamily } from "@/lib/demo";
import { proofread, diffItems, saveUndo, type FieldKind } from "@/lib/proofread";

export type BatchFix = { label: string; items: { field: string; from: string; to: string }[]; undo: string };
export type BatchResult = { total: number; next: number; done: boolean; fixes: BatchFix[] };

type Fields = Record<string, { kind: FieldKind; value: string | null }>;
type Target = { model: "person" | "event" | "story"; id: string; label: string; fields: Fields };

const BATCH = 4;

/** Everything the family has typed, in a fixed order, so the check can go through it in small steps. */
async function targets(familyId: string): Promise<Target[]> {
  const [people, events, stories] = await Promise.all([
    db.person.findMany({ where: { familyId }, orderBy: { createdAt: "asc" } }),
    db.lifeEvent.findMany({ where: { familyId }, include: { person: true }, orderBy: { createdAt: "asc" } }),
    db.story.findMany({ where: { familyId }, orderBy: { createdAt: "asc" } }),
  ]);
  const name = (p: { firstName: string; lastName: string | null }) => [p.firstName, p.lastName].filter(Boolean).join(" ");
  return [
    ...people.filter((p) => p.firstName !== "?").map((p): Target => ({
      model: "person", id: p.id, label: name(p),
      fields: { firstName: { kind: "name", value: p.firstName }, lastName: { kind: "name", value: p.lastName }, birthPlace: { kind: "place", value: p.birthPlace }, bio: { kind: "text", value: p.bio }, lifePath: { kind: "text", value: p.lifePath } },
    })),
    ...events.map((e): Target => ({
      model: "event", id: e.id, label: [e.year, e.person?.firstName].filter(Boolean).join(" · ") || e.description.slice(0, 30),
      // birth events are written by the app ("X is born"): only their place is the family's own words
      fields: e.description.endsWith(" is born") ? { place: { kind: "place", value: e.place } } : { description: { kind: "text", value: e.description }, place: { kind: "place", value: e.place } },
    })),
    ...stories.map((s): Target => ({ model: "story", id: s.id, label: s.title, fields: { title: { kind: "text", value: s.title }, body: { kind: "text", value: s.body } } })),
  ];
}

/** Checks the next few records, saves the corrections and keeps the originals for undo. */
export async function proofreadBatch(offset: number): Promise<BatchResult> {
  const { family, role } = await requireFamily();
  if (isDemoFamily(family.id) || !canEdit(role)) redirect("/app?readonly=1");
  const all = await targets(family.id);
  const slice = all.slice(offset, offset + BATCH);
  const fixes = (await Promise.all(slice.map(async (t): Promise<BatchFix | null> => {
    const pr = await proofread(family.lang, t.fields);
    if (!pr.changes.length) return null;
    const data = Object.fromEntries(pr.changes.map((c) => [c.field, c.from]));
    const fixed = Object.fromEntries(pr.changes.map((c) => [c.field, c.to]));
    const where = { id: t.id, familyId: family.id };
    if (t.model === "person") await db.person.updateMany({ where, data: fixed });
    if (t.model === "event") await db.lifeEvent.updateMany({ where, data: fixed });
    if (t.model === "story") await db.story.updateMany({ where, data: fixed });
    const undo = await saveUndo({ model: t.model, id: t.id, familyId: family.id, data, fixed });
    return { label: t.label, items: diffItems(pr.changes).slice(0, 8).map((x) => ({ field: x.field, from: x.from.slice(0, 80), to: x.to.slice(0, 80) })), undo };
  }))).filter((x): x is BatchFix => !!x);
  const next = offset + slice.length;
  if (next >= all.length) revalidatePath("/app", "layout");
  return { total: all.length, next, done: next >= all.length, fixes };
}
