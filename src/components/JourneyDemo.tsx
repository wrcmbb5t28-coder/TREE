type Stop = { year: number; place: string };

const DEMO: Stop[] = [
  { year: 1931, place: "Cosenza" },
  { year: 1956, place: "Cosenza" },
  { year: 1962, place: "Zürich" },
  { year: 1968, place: "Basel" },
  { year: 1994, place: "Buenos Aires" },
  { year: 2024, place: "Zug" },
];

/** Horizontal family timeline drawn to scale. Used on the homepage (demo) and in the app. */
export default function Journey({ stops = DEMO, label }: { stops?: Stop[]; label: string }) {
  if (stops.length === 0) return null;
  const sorted = [...stops].sort((a, b) => a.year - b.year);
  const lo = Math.floor((sorted[0].year - 5) / 10) * 10;
  const hi = Math.ceil((sorted[sorted.length - 1].year + 5) / 10) * 10;
  const x = (y: number) => 40 + ((y - lo) / Math.max(1, hi - lo)) * 680;
  const ticks: number[] = [];
  const step = hi - lo > 80 ? 20 : 10;
  for (let t = lo; t <= hi; t += step) ticks.push(t);

  // Alternate labels above/below; push a label to a deeper row when it would collide with the previous one on its side.
  const lastX: Record<string, number> = { up: -999, down: -999 };
  const placed = sorted.map((s, i) => {
    const side = i % 2 === 0 ? "up" : "down";
    const cx = x(s.year);
    const deep = cx - lastX[side] < 150;
    lastX[side] = cx;
    return { ...s, side, cx, deep, last: i === sorted.length - 1 };
  });

  return (
    <svg viewBox="0 0 760 250" role="img" aria-label={label} style={{ display: "block", width: "100%", minWidth: 640, height: "auto" }}>
      <line x1={x(lo)} x2={x(hi)} y1={125} y2={125} stroke="var(--line)" strokeWidth={2} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={119} y2={131} stroke="var(--muted)" />
          <text x={x(t)} y={150} textAnchor="middle" fontSize={12} fill="var(--muted)" fontFamily="var(--body)">{t}</text>
        </g>
      ))}
      {placed.map((p, i) => {
        const dy = p.deep ? 34 : 0;
        const ly = p.side === "up" ? 52 - dy : 190 + dy;
        const anchor = p.last ? "end" : "start";
        const tx = p.last ? p.cx + 4 : p.cx - 4;
        return (
          <g key={i}>
            <line x1={p.cx} x2={p.cx} y1={125} y2={p.side === "up" ? ly + 8 : ly - 16} stroke="var(--warm)" strokeWidth={1.2} strokeDasharray="3 3" />
            <circle cx={p.cx} cy={125} r={7} fill="var(--surface)" stroke="var(--accent)" strokeWidth={3} />
            <text x={tx} y={ly} textAnchor={anchor} fontSize={14} fontWeight={600} fill="var(--ink)" fontFamily="var(--body)">{p.place} · {p.year}</text>
          </g>
        );
      })}
    </svg>
  );
}
