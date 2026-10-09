import type { Person, Relationship } from "@prisma/client";
import { layoutTree, type TreeNode } from "@/lib/tree";
import { avatarById } from "@/lib/avatars";

const AV = 34; // avatar size inside a box

export default function TreeView({ people, links, label = "Family tree" }: { people: Person[]; links: Relationship[]; label?: string }) {
  const { nodes, edges, width, height, boxW } = layoutTree(people, links);
  const trim = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  return (
    <div className="tree-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} style={{ minWidth: Math.min(width, 560), maxWidth: Math.max(width, 560), margin: "0 auto" }}>
        {edges.map((e, i) => (
          <path key={i} d={`M${e.from.x} ${e.from.y + 24} V${(e.from.y + e.to.y) / 2} H${e.to.x} V${e.to.y - 24}`} fill="none" stroke="var(--line)" strokeWidth={1.5} />
        ))}
        {nodes.map((n) => {
          const left = n.x - boxW / 2;
          const tx = left + AV + 14;
          return (
            <a key={n.id} href={`/app/family/${n.id}`}>
              <rect x={left} y={n.y - 24} width={boxW} height={48} rx={10}
                fill={n.self ? "var(--accent)" : "var(--surface)"} stroke="var(--accent)" strokeWidth={1.5}
                strokeDasharray={n.living ? undefined : "4 3"} />
              <NodeAvatar n={n} x={left + 7} y={n.y - AV / 2} />
              <text x={tx} y={n.sub ? n.y - 2 : n.y + 5} fontSize={13.5} fontWeight={600}
                fill={n.self ? "var(--accent-ink)" : "var(--ink)"} fontFamily="var(--body)">{trim(n.label, 13)}</text>
              {n.sub && (
                <text x={tx} y={n.y + 14} fontSize={11}
                  fill={n.self ? "var(--accent-ink)" : "var(--muted)"} fontFamily="var(--body)">{trim(n.sub, 16)}</text>
              )}
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
      <text x={x + r} y={y + r + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--accent)" fontFamily="var(--display)">{n.initials || "?"}</text>
    </g>
  );
}
