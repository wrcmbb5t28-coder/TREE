import type { Person, Relationship } from "@prisma/client";

/**
 * Family-tree layout that reads like a real family tree:
 * - partners (two people who share a child) stand side by side, joined by a marriage line;
 * - each family has its own connector: from the middle of the parents down to a short bar over their children;
 * - rows are generations; the order inside a row is chosen so that children sit under their parents
 *   (barycentre sweeps), then x positions are relaxed so parents are centred over their children.
 */

export type TreeNode = {
  id: string; first: string; last: string; sub: string; x: number; y: number;
  self: boolean; living: boolean; photoPath: string | null; avatar: string | null; initials: string;
};
export type Couple = { a: { x: number; y: number }; b: { x: number; y: number } };
export type Family = { from: { x: number; y: number }; busY: number; children: { x: number; y: number }[] };

export const BOX_W = 176;
export const BOX_H = 66;
const MARGIN = 24;

export type TreeDims = { boxW: number; boxH: number; coupleGap: number; unitGap: number; rowGap: number };
const DEFAULT_DIMS: TreeDims = { boxW: BOX_W, boxH: BOX_H, coupleGap: 22, unitGap: 40, rowGap: 78 };

type Unit = { id: string; members: string[]; gen: number; x: number };

export function layoutTree(people: Person[], links: Relationship[], dims: Partial<TreeDims> = {}) {
  const { boxW: BW, boxH: BH, coupleGap: COUPLE_GAP, unitGap: UNIT_GAP, rowGap } = { ...DEFAULT_DIMS, ...dims };
  const ROW_H = BH + rowGap;
  const byId = new Map(people.map((p) => [p.id, p]));
  const valid = links.filter((l) => byId.has(l.parentId) && byId.has(l.childId));
  const parentsOf = new Map<string, string[]>();
  const childrenOf = new Map<string, string[]>();
  for (const l of valid) {
    parentsOf.set(l.childId, [...(parentsOf.get(l.childId) ?? []), l.parentId]);
    childrenOf.set(l.parentId, [...(childrenOf.get(l.parentId) ?? []), l.childId]);
  }

  // 1. Couples: two people with a shared child; each person in at most one couple.
  const pairCount = new Map<string, number>();
  for (const [, ps] of parentsOf) {
    if (ps.length < 2) continue;
    const [a, b] = [...ps].sort();
    pairCount.set(`${a}|${b}`, (pairCount.get(`${a}|${b}`) ?? 0) + 1);
  }
  const unitOf = new Map<string, Unit>();
  const units: Unit[] = [];
  for (const [key] of [...pairCount.entries()].sort((x, y) => y[1] - x[1])) {
    const [a, b] = key.split("|");
    if (unitOf.has(a) || unitOf.has(b)) continue;
    const u: Unit = { id: key, members: [a, b], gen: Math.min(byId.get(a)!.generation, byId.get(b)!.generation), x: 0 };
    units.push(u); unitOf.set(a, u); unitOf.set(b, u);
  }
  for (const p of [...people].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())) {
    if (unitOf.has(p.id)) continue;
    const u: Unit = { id: p.id, members: [p.id], gen: p.generation, x: 0 };
    units.push(u); unitOf.set(p.id, u);
  }

  // 2. Rows by generation.
  const gens = [...new Set(units.map((u) => u.gen))].sort((a, b) => a - b);
  const rows = gens.map((g) => units.filter((u) => u.gen === g));
  const idx = new Map<Unit, number>();
  const reindex = () => rows.forEach((r) => r.forEach((u, i) => idx.set(u, i)));
  reindex();

  const parentUnits = (u: Unit) => u.members.flatMap((m) => (parentsOf.get(m) ?? []).map((p) => unitOf.get(p)!));
  const childUnits = (u: Unit) => u.members.flatMap((m) => (childrenOf.get(m) ?? []).map((c) => unitOf.get(c)!));
  const avg = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / xs.length;

  // 3. Order within rows: barycentre sweeps down and up.
  for (let it = 0; it < 8; it++) {
    for (let r = 1; r < rows.length; r++) {
      const key = new Map(rows[r].map((u) => { const ps = parentUnits(u); return [u, ps.length ? avg(ps.map((p) => idx.get(p)!)) : idx.get(u)!] as const; }));
      rows[r].sort((a, b) => key.get(a)! - key.get(b)!); reindex();
    }
    for (let r = rows.length - 2; r >= 0; r--) {
      const key = new Map(rows[r].map((u) => { const cs = childUnits(u); return [u, cs.length ? avg(cs.map((c) => idx.get(c)!)) : idx.get(u)!] as const; }));
      rows[r].sort((a, b) => key.get(a)! - key.get(b)!); reindex();
    }
  }
  // Inside a couple: the partner whose parents stand further left goes left; "You" first on ties.
  for (const u of units) {
    if (u.members.length !== 2) continue;
    const side = (m: string) => {
      const ps = (parentsOf.get(m) ?? []).map((p) => idx.get(unitOf.get(p)!)!);
      return ps.length ? avg(ps) : byId.get(m)!.isSelf ? -0.5 : Number.POSITIVE_INFINITY;
    };
    u.members.sort((a, b) => side(a) - side(b));
  }

  // 4. Horizontal positions.
  const width = (u: Unit) => u.members.length * BW + (u.members.length - 1) * COUPLE_GAP;
  const offset = (u: Unit, m: string) => {
    const i = u.members.indexOf(m);
    return -width(u) / 2 + BW / 2 + i * (BW + COUPLE_GAP);
  };
  const personX = (m: string) => { const u = unitOf.get(m)!; return u.x + offset(u, m); };
  rows.forEach((row) => { let x = 0; for (const u of row) { u.x = x + width(u) / 2; x += width(u) + UNIT_GAP; } });

  /** Closest positions to `want` keeping order and spacing (isotonic regression, pool-adjacent-violators). */
  const place = (row: Unit[], want: number[]) => {
    const c: number[] = [0];
    for (let i = 1; i < row.length; i++) c[i] = c[i - 1] + (width(row[i - 1]) + width(row[i])) / 2 + UNIT_GAP;
    const blocks: { sum: number; n: number }[] = [];
    for (let i = 0; i < row.length; i++) {
      blocks.push({ sum: want[i] - c[i], n: 1 });
      while (blocks.length > 1 && blocks[blocks.length - 2].sum / blocks[blocks.length - 2].n > blocks[blocks.length - 1].sum / blocks[blocks.length - 1].n) {
        const b = blocks.pop()!; blocks[blocks.length - 1].sum += b.sum; blocks[blocks.length - 1].n += b.n;
      }
    }
    let i = 0;
    for (const b of blocks) for (let k = 0; k < b.n; k++, i++) row[i].x = b.sum / b.n + c[i];
  };
  const fromParents = (u: Unit) => {
    const ws = u.members.flatMap((m) => {
      const ps = parentsOf.get(m) ?? [];
      return ps.length ? [avg(ps.map(personX)) - offset(u, m)] : [];
    });
    return ws.length ? avg(ws) : u.x;
  };
  const fromChildren = (u: Unit) => {
    const kids = u.members.flatMap((m) => childrenOf.get(m) ?? []);
    return kids.length ? avg([...new Set(kids)].map(personX)) : u.x;
  };
  for (let it = 0; it < 30; it++) {
    for (let r = 1; r < rows.length; r++) place(rows[r], rows[r].map(fromParents));
    for (let r = rows.length - 2; r >= 0; r--) place(rows[r], rows[r].map(fromChildren));
  }
  for (let r = 1; r < rows.length; r++) place(rows[r], rows[r].map(fromParents));

  // 5. Normalise and build drawing primitives.
  const minX = Math.min(...units.map((u) => u.x - width(u) / 2));
  const maxX = Math.max(...units.map((u) => u.x + width(u) / 2));
  const shift = MARGIN - minX;
  const rowY = new Map(gens.map((g, i) => [g, MARGIN + BH / 2 + i * ROW_H]));
  const pos = new Map<string, { x: number; y: number }>();
  for (const u of units) for (const m of u.members) pos.set(m, { x: u.x + shift + offset(u, m), y: rowY.get(u.gen)! });

  const nodes: TreeNode[] = people.map((p) => {
    const years = p.birthYear ? `${p.birthYear}${p.deathYear ? `–${p.deathYear}` : ""}` : p.deathYear ? `–${p.deathYear}` : "";
    return {
      id: p.id, first: p.firstName, last: p.lastName ?? "",
      sub: [years, p.birthPlace].filter(Boolean).join(" · "),
      ...pos.get(p.id)!,
      self: p.isSelf, living: p.isLiving, photoPath: p.photoPath ?? null, avatar: p.avatar ?? null,
      initials: ((p.firstName?.[0] ?? "") + (p.lastName?.[0] ?? "")).toUpperCase(),
    };
  });

  const couples: Couple[] = units.filter((u) => u.members.length === 2).map((u) => ({ a: pos.get(u.members[0])!, b: pos.get(u.members[1])! }));

  // One connector per set of parents.
  const famMap = new Map<string, { parents: string[]; kids: string[] }>();
  for (const [child, ps] of parentsOf) {
    const key = [...ps].sort().join("|");
    const f = famMap.get(key) ?? { parents: ps, kids: [] };
    f.kids.push(child);
    famMap.set(key, f);
  }
  const families: Family[] = [];
  const busUsed = new Map<number, number>();
  for (const f of famMap.values()) {
    const pp = f.parents.map((p) => pos.get(p)!);
    const isCouple = pp.length === 2 && unitOf.get(f.parents[0]) === unitOf.get(f.parents[1]);
    const from = isCouple ? { x: avg(pp.map((p) => p.x)), y: pp[0].y } : { x: pp[0].x, y: pp[0].y + BH / 2 };
    const y0 = pp[0].y;
    const n = busUsed.get(y0) ?? 0;
    busUsed.set(y0, n + 1);
    const busY = y0 + BH / 2 + (ROW_H - BH) / 2 + ((n % 3) - 1) * 8;
    families.push({ from, busY, children: f.kids.map((k) => pos.get(k)!) });
  }

  return {
    nodes, couples, families,
    width: maxX - minX + MARGIN * 2,
    height: MARGIN * 2 + BH + (gens.length - 1) * ROW_H,
    boxW: BW, boxH: BH,
  };
}
