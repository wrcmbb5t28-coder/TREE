import type { Person, Relationship } from "@prisma/client";
import { layoutTree } from "@/lib/tree";

export default function TreeView({ people, links }: { people: Person[]; links: Relationship[] }) {
  const { nodes, edges, width, height, boxW } = layoutTree(people, links);
  const trim = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  return (
    <div className="tree-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Family tree" style={{ minWidth: Math.min(width, 560), maxWidth: Math.max(width, 560), margin: "0 auto" }}>
        {edges.map((e, i) => (
          <path key={i} d={`M${e.from.x} ${e.from.y + 24} V${(e.from.y + e.to.y) / 2} H${e.to.x} V${e.to.y - 24}`} fill="none" stroke="var(--line)" strokeWidth={1.5} />
        ))}
        {nodes.map((n) => (
          <a key={n.id} href={`/app/family/${n.id}`}>
            <rect x={n.x - boxW / 2} y={n.y - 24} width={boxW} height={48} rx={10}
              fill={n.self ? "var(--accent)" : "var(--surface)"} stroke="var(--accent)" strokeWidth={1.5}
              strokeDasharray={n.living ? undefined : "4 3"} />
            <text x={n.x} y={n.sub ? n.y - 2 : n.y + 5} textAnchor="middle" fontSize={14} fontWeight={600}
              fill={n.self ? "var(--accent-ink)" : "var(--ink)"} fontFamily="var(--body)">{trim(n.label, 18)}</text>
            {n.sub && (
              <text x={n.x} y={n.y + 15} textAnchor="middle" fontSize={11.5}
                fill={n.self ? "var(--accent-ink)" : "var(--muted)"} fontFamily="var(--body)">{trim(n.sub, 22)}</text>
            )}
          </a>
        ))}
      </svg>
    </div>
  );
}
