/** The family's name as people see it (book cover, home page): its surname lines, or the name the family chose. */
import { db } from "./db";
import { familyLines, type FamilyLine } from "./lines";
import { surnameKey, type CrestConfig } from "./crest";
import { ownBook } from "@/i18n/app/ownbook";
import type { Lang } from "@/i18n/config";

export type FamilyTitle = {
  title: string;
  crests: CrestConfig[];
  /** Names the family can choose for the cover: each line, and the couple's two lines together. */
  options: string[];
  auto: boolean;
  lines: FamilyLine[];
};

export const isAutoName = (name: string) => /'s family$/i.test(name.trim());

export async function familyTitle(family: { id: string; name: string }, lang: Lang): Promise<FamilyTitle> {
  const o = ownBook[lang];
  const [lines, people, links] = await Promise.all([
    familyLines(family.id),
    db.person.findMany({ where: { familyId: family.id }, select: { id: true, isSelf: true, lastName: true, gender: true, relation: true } }),
    db.relationship.findMany({ where: { parent: { familyId: family.id } }, select: { parentId: true, childId: true } }),
  ]);
  const self = people.find((p) => p.isSelf);
  const keyOf = (p?: { lastName: string | null } | null) => (p?.lastName?.trim() ? surnameKey(p.lastName) : null);

  // The keeper's line: their own surname, else their father's.
  let ownKey = keyOf(self);
  if (!ownKey && self) {
    const parents = people.filter((p) => links.some((l) => l.childId === self.id && l.parentId === p.id) && p.lastName?.trim());
    ownKey = keyOf(parents.find((p) => p.gender === "m" || p.relation === "father") ?? parents[0]);
  }
  // Their spouse: marked as wife/husband, else the other parent of their children.
  let spouse = people.find((p) => p.relation === "wife" || p.relation === "husband") ?? null;
  if (!spouse && self) {
    const kids = links.filter((l) => l.parentId === self.id).map((l) => l.childId);
    const other = links.find((l) => kids.includes(l.childId) && l.parentId !== self.id);
    spouse = other ? people.find((p) => p.id === other.parentId) ?? null : null;
  }
  const spouseKey = keyOf(spouse);

  const own = lines.find((l) => l.key === ownKey) ?? null;
  const theirs = spouseKey && spouseKey !== ownKey ? lines.find((l) => l.key === spouseKey) ?? null : null;
  const couple = own && theirs ? o.titleOfPair(own.name, theirs.name) : null;
  const options = [...(couple ? [couple] : []), ...lines.map((l) => o.titleOf(l.name))];

  const auto = isAutoName(family.name);
  if (!auto) {
    // A chosen name: show the crests of the lines it names.
    const chosen = family.name.trim();
    const named = chosen === couple ? [own!, theirs!] : lines.filter((l) => chosen === o.titleOf(l.name) || chosen.toLowerCase().includes(l.name.toLowerCase()));
    return { title: chosen, crests: named.slice(0, 2).map((l) => l.config), options, auto, lines };
  }
  if (couple) return { title: couple, crests: [own!.config, theirs!.config], options, auto, lines };
  const main = own ?? lines[0] ?? null;
  return { title: main ? o.titleOf(main.name) : o.fallbackTitle, crests: main ? [main.config] : [], options, auto, lines };
}
