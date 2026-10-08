import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireFamily } from "@/lib/auth";
import { appUrl } from "@/lib/util";

/** Data portability: everything as JSON, or the tree as GEDCOM 5.5.1 for other genealogy tools. */
export async function GET(req: Request) {
  const { family } = await requireFamily();
  const format = new URL(req.url).searchParams.get("format") ?? "json";
  const people = await db.person.findMany({ where: { familyId: family.id } });
  const links = await db.relationship.findMany({ where: { parentId: { in: people.map((p) => p.id) } } });
  const safeName = family.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  if (format === "gedcom") {
    const ged = toGedcom(people, links, family.name);
    return new NextResponse(ged, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename="${safeName}.ged"` },
    });
  }

  const [stories, events, questions, photos] = await Promise.all([
    db.story.findMany({ where: { familyId: family.id }, include: { facts: true, answer: true } }),
    db.lifeEvent.findMany({ where: { familyId: family.id } }),
    db.question.findMany({ where: { familyId: family.id }, select: { id: true, text: true, storytellerId: true, status: true, createdAt: true, answeredAt: true, lang: true } }),
    db.photo.findMany({ where: { familyId: family.id } }),
  ]);
  const data = {
    exportedAt: new Date().toISOString(),
    family: { name: family.name, lang: family.lang, createdAt: family.createdAt },
    people, relationships: links, events, questions,
    stories: stories.map((s) => ({ ...s, audioUrl: s.answer?.audioPath ? appUrl(`/api/files/${s.answer.audioPath}`) : null })),
    photos: photos.map((p) => ({ ...p, url: appUrl(`/api/files/${p.path}`) })),
  };
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="${safeName}.json"` },
  });
}

type P = { id: string; firstName: string; lastName: string | null; birthYear: number | null; birthPlace: string | null; deathYear: number | null };
type L = { parentId: string; childId: string };

function toGedcom(people: P[], links: L[], familyName: string): string {
  const ref = new Map(people.map((p, i) => [p.id, `@I${i + 1}@`]));
  const lines = ["0 HEAD", "1 SOUR TREENAME", "1 GEDC", "2 VERS 5.5.1", "2 FORM LINEAGE-LINKED", "1 CHAR UTF-8", `1 NOTE ${familyName}`];
  // Group children by their set of parents to build FAM records.
  const parentsOf = new Map<string, string[]>();
  for (const l of links) parentsOf.set(l.childId, [...(parentsOf.get(l.childId) ?? []), l.parentId]);
  const fams = new Map<string, { parents: string[]; children: string[] }>();
  for (const [child, parents] of parentsOf) {
    const key = [...parents].sort().join("+");
    if (!fams.has(key)) fams.set(key, { parents: [...parents].sort(), children: [] });
    fams.get(key)!.children.push(child);
  }
  const famRef = new Map([...fams.keys()].map((k, i) => [k, `@F${i + 1}@`]));
  for (const p of people) {
    lines.push(`0 ${ref.get(p.id)} INDI`, `1 NAME ${p.firstName} /${p.lastName ?? ""}/`);
    if (p.birthYear || p.birthPlace) {
      lines.push("1 BIRT");
      if (p.birthYear) lines.push(`2 DATE ${p.birthYear}`);
      if (p.birthPlace) lines.push(`2 PLAC ${p.birthPlace}`);
    }
    if (p.deathYear) lines.push("1 DEAT", `2 DATE ${p.deathYear}`);
    for (const [k, f] of fams) {
      if (f.parents.includes(p.id)) lines.push(`1 FAMS ${famRef.get(k)}`);
      if (f.children.includes(p.id)) lines.push(`1 FAMC ${famRef.get(k)}`);
    }
  }
  for (const [k, f] of fams) {
    lines.push(`0 ${famRef.get(k)} FAM`);
    f.parents.forEach((pid, i) => lines.push(`1 ${i === 0 ? "HUSB" : "WIFE"} ${ref.get(pid)}`));
    f.children.forEach((c) => lines.push(`1 CHIL ${ref.get(c)}`));
  }
  lines.push("0 TRLR");
  return lines.join("\n") + "\n";
}
