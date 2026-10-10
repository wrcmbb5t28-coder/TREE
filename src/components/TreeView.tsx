import type { Person, Relationship } from "@prisma/client";
import { layoutTree, type TreeNode } from "@/lib/tree";
import { avatarById } from "@/lib/avatars";
import { lineName } from "@/lib/crest";

const AV = 42; // medallion size inside a name tag
const TRUNK = 120; // room under the youngest row for the trunk and roots

const BARK = "#6B4E33";
const BARK_LIGHT = "#9A7550";
const LEAVES = ["#4F7D5C", "#6F9A63", "#3F6B55", "#8BB174", "#5E8C4A"];
const LEAF = "M0 0 C3 -4.5 9 -4.5 13 0 C9 4.5 3 4.5 0 0 Z";

/** Small seeded random, so the leaves are the same on every render. */
function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}

type Pt = { x: number; y: number };
const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
};

/** A branch that narrows from w0 to w1 along a cubic curve, as a filled outline. */
function taper(p: Pt[], w0: number, w1: number): string {
  const N = 18, l: Pt[] = [], r: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = bez(p[0], p[1], p[2], p[3], Math.max(0, t - 0.01)), b = bez(p[0], p[1], p[2], p[3], Math.min(1, t + 0.01));
    const q = bez(p[0], p[1], p[2], p[3], t);
    let nx = -(b.y - a.y), ny = b.x - a.x; const len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
    const w = (w0 + (w1 - w0) * t) / 2;
    l.push({ x: q.x + nx * w, y: q.y + ny * w }); r.push({ x: q.x - nx * w, y: q.y - ny * w });
  }
  const f = (v: number) => v.toFixed(1);
  return `M${l.map((q) => `${f(q.x)} ${f(q.y)}`).join(" L")} L${r.reverse().map((q) => `${f(q.x)} ${f(q.y)}`).join(" L")} Z`;
}

export default function TreeView({ people, links, label = "Family tree", fit = false }: { people: Person[]; links: Relationship[]; label?: string; fit?: boolean }) {
  if (people.length === 0) return null;
  const { nodes, couples, families, width, height: h0, boxW, boxH } = layoutTree(people, links);
  const height = h0 + TRUNK;
  const id = `tv${Math.floor(rng(people.map((p) => p.id).join())() * 1e9).toString(36)}`;
  const rand = rng(id);
  const trim = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

  const ys = [...new Set(nodes.map((n) => n.y))].sort((a, b) => a - b);
  const rowOf = (y: number) => ys.indexOf(y);
  const rows = ys.length;
  // Branches get thicker towards the trunk.
  const thick = (row: number) => 4 + (row / Math.max(1, rows - 1)) * 7;

  // Branches: from the top of each child up to the knot between the parents.
  type Branch = { d: string; line: string; leaves: { x: number; y: number; r: number; s: number; c: string }[] };
  const branches: Branch[] = [];
  const addLeaves = (p: Pt[], n: number, out: Branch["leaves"]) => {
    for (let i = 0; i < n; i++) {
      const t = 0.18 + rand() * 0.64;
      const q = bez(p[0], p[1], p[2], p[3], t);
      const side = rand() > 0.5 ? 1 : -1;
      out.push({ x: q.x + side * 2, y: q.y, r: side > 0 ? -30 - rand() * 50 : 210 + rand() * 50, s: 1 + rand() * 0.7, c: LEAVES[Math.floor(rand() * LEAVES.length)] });
    }
  };
  for (const f of families) {
    for (const c of f.children) {
      const start = { x: c.x, y: c.y - boxH / 2 + 2 };
      const end = { x: f.from.x, y: f.from.y + (f.from.y === c.y ? 0 : 6) };
      const midY = (start.y + end.y) / 2;
      const p = [start, { x: start.x, y: midY + 6 }, { x: end.x, y: midY + 18 }, end];
      const leaves: Branch["leaves"] = [];
      addLeaves(p, 5 + Math.floor(rand() * 3), leaves);
      const w = thick(rowOf(c.y));
      branches.push({ d: taper(p, w + 3, Math.max(2.5, w * 0.45)), line: `M${p[0].x} ${p[0].y} C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`, leaves });
    }
  }

  // Trunk under the youngest row; every person in that row grows out of it.
  const bottom = nodes.filter((n) => n.y === ys[rows - 1]);
  const bx = (Math.min(...bottom.map((n) => n.x)) + Math.max(...bottom.map((n) => n.x))) / 2;
  const trunkTop = { x: bx, y: ys[rows - 1] + boxH / 2 + 46 };
  const ground = height - 26;
  const tw = Math.min(30, 14 + bottom.length * 4);
  const trunk = `M${bx - tw / 2} ${trunkTop.y} C${bx - tw / 2 - 2} ${ground - 40} ${bx - tw / 2 - 6} ${ground - 14} ${bx - tw - 22} ${ground + 2}
    L${bx + tw + 22} ${ground + 2} C${bx + tw / 2 + 6} ${ground - 14} ${bx + tw / 2 + 2} ${ground - 40} ${bx + tw / 2} ${trunkTop.y} Z`;
  const toTrunk = bottom.map((n) => {
    const s = { x: n.x, y: n.y + boxH / 2 - 2 };
    const p = [s, { x: s.x, y: s.y + 28 }, { x: bx + (n.x - bx) * 0.15, y: trunkTop.y - 22 }, { x: bx + (n.x - bx) * 0.08, y: trunkTop.y + 2 }];
    const leaves: Branch["leaves"] = [];
    addLeaves(p, 3, leaves);
    return { d: taper(p, 6, Math.max(9, tw * 0.62)), line: `M${p[0].x} ${p[0].y} C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`, leaves };
  });
  const allBranches = [...branches, ...toTrunk];

  // Crown: soft foliage behind everyone except the youngest row.
  const crown = nodes.filter((n) => n.y !== ys[rows - 1] || rows === 1).map((n) => ({ x: n.x, y: n.y - 6, r: boxW * 0.62 + rand() * 18 }));
  // A few loose leaves around the oldest generation.
  const tufts = nodes.filter((n) => n.y === ys[0]).flatMap((n) =>
    Array.from({ length: 7 }, () => ({ x: n.x + (rand() - 0.5) * boxW * 1.05, y: n.y - boxH / 2 - 4 - rand() * 14, r: rand() * 360, s: 0.7 + rand() * 0.5, c: LEAVES[Math.floor(rand() * LEAVES.length)] })));

  const self = nodes.find((n) => n.self);
  const familyName = self?.last ? lineName([self.last]) : "";

  return (
    <div className="tree-wrap tree-art">
      <svg viewBox={`0 -26 ${width} ${height + 26}`} role="img" aria-label={label}
        style={{ width: "100%", minWidth: fit ? 0 : Math.min(width, 640), maxWidth: width, margin: "0 auto", display: "block" }}>
        <defs>
          <radialGradient id={`${id}-crown`}>
            <stop offset="0" stopColor="#B9D1A8" stopOpacity=".55" />
            <stop offset=".7" stopColor="#CFE0C3" stopOpacity=".25" />
            <stop offset="1" stopColor="#CFE0C3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-bark`} x1="0" x2="1">
            <stop offset="0" stopColor={BARK} />
            <stop offset=".45" stopColor={BARK_LIGHT} />
            <stop offset="1" stopColor={BARK} />
          </linearGradient>
          <filter id={`${id}-sh`} x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#5B4630" floodOpacity=".16" />
          </filter>
        </defs>

        {/* Crown and ground */}
        {crown.map((c, i) => <circle key={`cr${i}`} cx={c.x} cy={c.y} r={c.r} fill={`url(#${id}-crown)`} />)}
        <ellipse cx={bx} cy={ground + 6} rx={Math.min(width * 0.42, 260)} ry={16} fill="#DCE6CC" opacity=".7" />
        <path d={`M${bx - 120} ${ground + 4} q 6 -10 12 0 q 8 -14 14 0 M${bx + 90} ${ground + 4} q 6 -12 12 0 q 6 -9 12 0`} fill="none" stroke="#7E9F6A" strokeWidth={1.6} strokeLinecap="round" />

        {/* Trunk with a little bark texture */}
        <path d={trunk} fill={`url(#${id}-bark)`} />
        <path d={`M${bx - 3} ${trunkTop.y + 14} q 4 ${(ground - trunkTop.y) * 0.3} -2 ${(ground - trunkTop.y) * 0.62} M${bx + 5} ${trunkTop.y + 30} q -3 ${(ground - trunkTop.y) * 0.25} 2 ${(ground - trunkTop.y) * 0.48}`}
          fill="none" stroke="#4E3824" strokeOpacity=".45" strokeWidth={1.4} strokeLinecap="round" />

        {/* Branches */}
        {allBranches.map((b, i) => (
          <g key={`b${i}`}>
            <path d={b.d} fill={BARK} stroke={BARK} strokeWidth={0.8} strokeLinejoin="round" />
            <path d={b.line} fill="none" stroke={BARK_LIGHT} strokeWidth={1.1} strokeOpacity=".55" strokeLinecap="round" strokeDasharray="14 9" transform="translate(-1 0)" />
          </g>
        ))}
        {[...allBranches.flatMap((b) => b.leaves), ...tufts].map((l, i) => (
          <path key={`l${i}`} d={LEAF} fill={l.c} opacity=".92" transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`} />
        ))}

        {/* Partners: a small vine with a heart where the branch meets them */}
        {couples.map((c, i) => {
          const x1 = c.a.x + boxW / 2 - 4, x2 = c.b.x - boxW / 2 + 4, mid = (x1 + x2) / 2, y = c.a.y;
          return (
            <g key={`c${i}`}>
              <path d={`M${x1} ${y} Q${mid} ${y + 9} ${x2} ${y}`} fill="none" stroke={BARK} strokeWidth={2.6} strokeLinecap="round" />
              <path d={`M${mid} ${y + 9} c -1.2 -1.6 -5.6 -4.2 -5.6 -7 a 2.9 2.9 0 0 1 5.6 -1.2 a 2.9 2.9 0 0 1 5.6 1.2 c 0 2.8 -4.4 5.4 -5.6 7 z`}
                fill="#B4613A" stroke="#FAF6EE" strokeWidth={1.2} />
            </g>
          );
        })}

        {/* People */}
        {nodes.map((n) => <NameTag key={n.id} n={n} boxW={boxW} boxH={boxH} id={id} trim={trim} />)}

        {/* Family name on a ribbon across the trunk */}
        {familyName && (
          <g>
            <path d={`M${bx - 78} ${ground - 46} l 10 -9 h 136 l 10 9 l -10 9 h -136 z`} fill="#F3EBDD" stroke={BARK} strokeWidth={1.2} />
            <text x={bx} y={ground - 41.5} textAnchor="middle" fontSize={13} fontStyle="italic" fill="#4E3824" fontFamily="var(--display, Georgia, serif)">{trim(familyName, 20)}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function NameTag({ n, boxW, boxH, id, trim }: { n: TreeNode; boxW: number; boxH: number; id: string; trim: (s: string, n: number) => string }) {
  const left = n.x - boxW / 2, top = n.y - boxH / 2;
  const tx = left + AV + 20;
  const ink = n.self ? "#FFFFFF" : "var(--ink)";
  const mute = n.self ? "rgba(255,255,255,.82)" : "var(--muted)";
  return (
    <a href={`/app/family/${n.id}`}>
      <title>{[n.first, n.last].filter(Boolean).join(" ")}</title>
      <rect x={left} y={top} width={boxW} height={boxH} rx={boxH / 2}
        fill={n.self ? "var(--accent)" : "#FFFDF8"} stroke={n.self ? "var(--accent)" : n.living ? "#B79B78" : "#CDBFAE"} strokeWidth={1.2}
        filter={`url(#${id}-sh)`} />
      <Medallion n={n} x={left + 8} y={n.y - AV / 2} />
      <text x={tx} y={n.last ? top + 24 : top + 30} fontSize={14.5} fontWeight={600} fill={ink} fontFamily="var(--display, Georgia, serif)">{trim(n.first, 14)}</text>
      {n.last && <text x={tx} y={top + 40} fontSize={12.5} fill={ink} fontFamily="var(--body)">{trim(n.last, 16)}</text>}
      {n.sub && <text x={tx} y={n.last ? top + 55 : top + 47} fontSize={10.5} fill={mute} fontFamily="var(--body)">{trim(n.sub, 19)}</text>}
    </a>
  );
}

/** Round portrait in a ring: green for the living, a soft sepia ring for those who have passed. */
function Medallion({ n, x, y }: { n: TreeNode; x: number; y: number }) {
  const r = AV / 2, cx = x + r, cy = y + r;
  const ring = n.self ? "#FAF6EE" : n.living ? "var(--accent)" : "#A88D6E";
  let inner;
  if (n.photoPath) {
    const clip = `av-${n.id}`;
    inner = (
      <g>
        <clipPath id={clip}><circle cx={cx} cy={cy} r={r - 2} /></clipPath>
        <circle cx={cx} cy={cy} r={r - 2} fill="var(--tint)" />
        <image href={`/api/files/${n.photoPath}`} x={x + 2} y={y + 2} width={AV - 4} height={AV - 4} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`}
          style={n.living ? undefined : { filter: "sepia(.45)" }} />
      </g>
    );
  } else {
    const preset = avatarById(n.avatar);
    inner = preset ? (
      <svg x={x + 2} y={y + 2} width={AV - 4} height={AV - 4} viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill={preset.bg} />
        <g transform="translate(12 12)"><path d={preset.d} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></g>
      </svg>
    ) : (
      <g>
        <circle cx={cx} cy={cy} r={r - 2} fill={n.self ? "#FAF6EE" : "var(--tint)"} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--accent)" fontFamily="var(--display)">{n.initials || "?"}</text>
      </g>
    );
  }
  return (
    <g>
      {inner}
      <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke={ring} strokeWidth={2.2} strokeDasharray={n.living ? undefined : "3 2.2"} />
    </g>
  );
}
