/** Family lines (surnames) of a family with their emblem: saved, or a first draft built from the family's data. */
import { db } from "./db";
import { placeKey } from "./geo";
import { defaultCrest, normalizeCrest, lineName, suggestCharges, surnameKey, type CrestConfig, type Suggestion } from "./crest";

export type FamilyLine = {
  key: string;
  name: string;
  people: { id: string; firstName: string; lastName: string | null; photoPath: string | null; avatar: string | null }[];
  suggestions: Suggestion[];
  draft: CrestConfig;
  config: CrestConfig;
  saved: boolean;
};

export async function familyLines(familyId: string): Promise<FamilyLine[]> {
  const people = await db.person.findMany({ where: { familyId, lastName: { not: null } }, orderBy: [{ generation: "asc" }, { createdAt: "asc" }] });
  const groups = new Map<string, typeof people>();
  for (const p of people) {
    if (!p.lastName?.trim()) continue;
    const k = surnameKey(p.lastName);
    groups.set(k, [...(groups.get(k) ?? []), p]);
  }
  if (!groups.size) return [];
  const ids = people.map((p) => p.id);
  const [events, stories, crests] = await Promise.all([
    db.lifeEvent.findMany({ where: { familyId, personId: { in: ids } }, select: { personId: true, description: true, place: true, country: true } }),
    db.story.findMany({ where: { familyId, personId: { in: ids }, visibility: { not: "private" } }, select: { personId: true, body: true } }),
    db.crest.findMany({ where: { familyId } }),
  ]);
  const placeRows = await db.place.findMany({ where: { key: { in: events.map((e) => placeKey(e.place, e.country)) } } });
  const placeCountry = new Map(placeRows.map((r) => [r.key, r.country]));

  return [...groups.entries()]
    .map(([key, list]) => {
      const pid = new Set(list.map((p) => p.id));
      const text = [
        ...list.flatMap((p) => [p.bio ?? "", p.lifePath ?? "", p.birthPlace ?? ""]),
        ...events.filter((e) => e.personId && pid.has(e.personId)).map((e) => `${e.description} ${e.place ?? ""}`),
        ...stories.filter((s) => s.personId && pid.has(s.personId)).map((s) => s.body),
      ].join(" \n ");
      const countries = [
        ...list.map((p) => p.birthCountry),
        ...events.filter((e) => e.personId && pid.has(e.personId)).map((e) => e.country ?? placeCountry.get(placeKey(e.place, e.country)) ?? null),
      ].filter(Boolean) as string[];
      const suggestions = suggestCharges(text, countries);
      const draft = defaultCrest(key, suggestions);
      const row = crests.find((c) => c.key === key);
      let config = draft;
      if (row) {
        try { config = normalizeCrest(JSON.parse(row.config)) ?? draft; } catch {}
      }
      return {
        key,
        name: lineName(list.map((p) => p.lastName!)),
        people: list.map((p) => ({ id: p.id, firstName: p.firstName, lastName: p.lastName, photoPath: p.photoPath, avatar: p.avatar })),
        suggestions, draft, config, saved: !!row,
      };
    })
    .sort((a, b) => b.people.length - a.people.length);
}

/** Emblem for one person's line (for the profile header). */
export async function crestForPerson(familyId: string, lastName: string | null | undefined): Promise<{ name: string; config: CrestConfig; key: string } | null> {
  if (!lastName?.trim()) return null;
  const key = surnameKey(lastName);
  const lines = await familyLines(familyId);
  const l = lines.find((x) => x.key === key);
  return l ? { name: l.name, config: l.config, key } : null;
}
