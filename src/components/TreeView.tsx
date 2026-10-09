import type { Person, Relationship } from "@prisma/client";
import { layoutTree, type TreeNode } from "@/lib/tree";
import { avatarById } from "@/lib/avatars";

const AV = 38; // avatar size inside a box

export default function TreeView({ people, links, label = "Family tree" }: { people: Person[]; links: Relationship[]; label?: string }) {
  if (people.length === 0) return null;
  const { nodes, couples, families, width, height, boxW, boxH } = layoutTree(people, links);
  const trim = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  const line = { fill: "none", stroke: "var(--tree-line, #9fb3aa)", strokeWidth: 1.6 } as const;

  return (
    <div className="tree-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}
        style={{ width: "100%", minWidth: Math.min(width, 640), maxWidth: width, margin: "0 auto", display: "block" }}>
        {/* Family connectors: parents → bar → each child */}
        {families.map((f, i) => {
          const xs = [f.from.x, ...f.children.map((c) => c.x)];
          const top = f.children[0].y - boxH / 2;
          return (
            <g key={`f${i}`}>
              <path d={`M${f.from.x} ${f.from.y} V${f.busY}`} {...line} />
              <path d={`M${Math.min(...xs)} ${f.busY} H${Math.max(...xs)}`} {...line} />
              {f.children.map((c, j) => <path key={j} d={`M${c.x} ${f.busY} V${top}`} {...line} />)}
            </g>
          );
        })}
        {/* Partners */}
        {couples.map((c, i) => {
          const x1 = c.a.x + boxW / 2, x2 = c.b.x - boxW / 2, mid = (x1 + x2) / 2;
          return (
            <g key={`c${i}`}>
              <path d={`M${x1} ${c.a.y} H${x2}`} {...line} strokeWidth={2.2} />
              <circle cx={mid} cy={c.a.y} r={4.5} fill="var(--accent)" />
            </g>
          );
        })}
        {nodes.map((n) => {
          const left = n.x - boxW / 2, top = n.y - boxH / 2;
          const tx = left + AV + 18;
          const ink = n.self ? "var(--accent-ink)" : "var(--ink)";
          const mute = n.self ? "var(--accent-ink)" : "var(--muted)";
          return (
            <a key={n.id} href={`/app/family/${n.id}`}>
              <title>{[n.first, n.last].filter(Boolean).join(" ")}</title>
              <rect x={left} y={top} width={boxW} height={boxH} rx={12}
                fill={n.self ? "var(--accent)" : "var(--surface)"} stroke="var(--accent)" strokeWidth={1.5}
                strokeDasharray={n.living ? undefined : "5 4"} />
              <NodeAvatar n={n} x={left + 9} y={n.y - AV / 2} />
              <text x={tx} y={n.last ? top + 22 : top + 28} fontSize={14} fontWeight={600} fill={ink} fontFamily="var(--body)">{trim(n.first, 15)}</text>
              {n.last && <text x={tx} y={top + 38} fontSize={12.5} fill={ink} fontFamily="var(--body)">{trim(n.last, 17)}</text>}
              {n.sub && <text x={tx} y={n.last ? top + 55 : top + 46} fontSize={11} fill={mute} fontFamily="var(--body)">{trim(n.sub, 20)}</text>}
            </a>
          );
        })}
      </svg>
    </div>
  );
}

function NodeAvatar({ n, x, y }: { n: TreeNode; x: number; y: number }) {
  const r = AV / 2;
  if (n.photoPath) {
    const clip = `av-${n.id}`;
    return (
      <g>
        <clipPath id={clip}><circle cx={x + r} cy={y + r} r={r} /></clipPath>
        <circle cx={x + r} cy={y + r} r={r} fill="var(--tint)" />
        <image href={`/api/files/${n.photoPath}`} x={x} y={y} width={AV} height={AV} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
      </g>
    );
  }
  const preset = avatarById(n.avatar);
  if (preset) {
    return (
      <svg x={x} y={y} width={AV} height={AV} viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill={preset.bg} />
        <g transform="translate(12 12)"><path d={preset.d} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></g>
      </svg>
    );
  }
  return (
    <g>
      <circle cx={x + r} cy={y + r} r={r} fill="var(--tint)" />
      <text x={x + r} y={y + r + 4.5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--accent)" fontFamily="var(--display)">{n.initials || "?"}</text>
    </g>
  );
}
