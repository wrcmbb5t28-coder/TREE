import type { Person, Relationship } from "@prisma/client";

export type TreeNode = { id: string; label: string; sub: string; x: number; y: number; self: boolean; living: boolean; photoPath: string | null; avatar: string | null; initials: string };
export type TreeEdge = { from: { x: number; y: number }; to: { x: number; y: number } };

const BOX_W = 150;
const GAP_X = 24;
const ROW_H = 110;

/**
 * Lays the family out by generation: oldest at the top, "You" in the middle.
 * Within a row, people are ordered so that parents sit roughly above their children.
 */
export function layoutTree(people: Person[], links: Relationship[]) {
  const gens = [...new Set(people.map((p) => p.generation))].sort((a, b) => a - b);
  const rows = new Map<number, Person[]>();
  for (const g of gens) rows.set(g, people.filter((p) => p.generation === g));

  // Order rows bottom-up from "You": parents ordered by their child's position.
  const order = new Map<string, number>();
  const selfGen = people.find((p) => p.isSelf)?.generation ?? 0;
  const sortRow = (g: number, ref: (p: Person) => number) => {
    const row = rows.get(g)!;
    row.sort((a, b) => ref(a) - ref(b) || a.createdAt.getTime() - b.createdAt.getTime());
    row.forEach((p, i) => order.set(p.id, i));
  };
  if (rows.has(selfGen)) sortRow(selfGen, (p) => (p.isSelf ? 0 : 1));
  for (const g of [...gens].filter((g) => g < selfGen).reverse()) {
    sortRow(g, (p) => {
      const kids = links.filter((l) => l.parentId === p.id).map((l) => order.get(l.childId) ?? 99);
      return kids.length ? Math.min(...kids) : 99;
    });
  }
  for (const g of gens.filter((g) => g > selfGen)) {
    sortRow(g, (p) => {
      const pars = links.filter((l) => l.childId === p.id).map((l) => order.get(l.parentId) ?? 99);
      return pars.length ? Math.min(...pars) : 99;
    });
  }

  const widest = Math.max(1, ...[...rows.values()].map((r) => r.length));
  const width = widest * (BOX_W + GAP_X) + GAP_X;
  const pos = new Map<string, { x: number; y: number }>();
  const nodes: TreeNode[] = [];
  gens.forEach((g, gi) => {
    const row = rows.get(g)!;
    const rowW = row.length * (BOX_W + GAP_X) - GAP_X;
    const x0 = (width - rowW) / 2 + BOX_W / 2;
    row.forEach((p, i) => {
      const x = x0 + i * (BOX_W + GAP_X);
      const y = 40 + gi * ROW_H;
      pos.set(p.id, { x, y });
      const years = p.birthYear ? `${p.birthYear}${p.deathYear ? `–${p.deathYear}` : ""}` : "";
      nodes.push({
        id: p.id,
        label: [p.firstName, p.lastName].filter(Boolean).join(" "),
        sub: [years, p.birthPlace].filter(Boolean).join(" · "),
        photoPath: p.photoPath ?? null,
        avatar: p.avatar ?? null,
        initials: ((p.firstName?.[0] ?? "") + (p.lastName?.[0] ?? "")).toUpperCase(),
        x, y, self: p.isSelf, living: p.isLiving,
      });
    });
  });
  const edges: TreeEdge[] = links
    .filter((l) => pos.has(l.parentId) && pos.has(l.childId))
    .map((l) => ({ from: pos.get(l.parentId)!, to: pos.get(l.childId)! }));
  return { nodes, edges, width, height: Math.max(1, gens.length - 1) * ROW_H + 80, boxW: BOX_W };
}
