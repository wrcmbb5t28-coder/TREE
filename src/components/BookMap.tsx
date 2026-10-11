/** The family's road on a small drawn map: towns joined by a dashed route, labels placed so they don't collide. */
export type MapStop = { name: string; label: string; lon: number; lat: number; year: number };
export type MapData = { mapTitle: string; stops: MapStop[]; side?: { label: string; dir: "w" | "e"; from: number } };

export default function BookMap({ b }: { b: MapData }) {
  const W = 400, H = 230, pad = 34;
  const lat0 = b.stops.reduce((a, s) => a + s.lat, 0) / b.stops.length;
  const k = Math.cos((lat0 * Math.PI) / 180);
  const xs = b.stops.map((s) => s.lon * k), ys = b.stops.map((s) => -s.lat);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const sc = Math.min((W - pad * 2) / Math.max(x1 - x0, 0.01), (H - pad * 2) / Math.max(y1 - y0, 0.01));
  const ox = (W - (x1 - x0) * sc) / 2, oy = (H - (y1 - y0) * sc) / 2;
  const pts = b.stops.map((s, i) => ({ x: ox + (xs[i] - x0) * sc, y: oy + (ys[i] - y0) * sc, s }));
  // towns a few kilometres apart would sit on one dot: push them apart a little
  for (let it = 0; it < 30; it++) for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y, d = Math.hypot(dx, dy) || 0.01;
    if (d < 22) { const m = (22 - d) / 2, ux = dx / d || 1, uy = dy / d; pts[i].x -= ux * m; pts[i].y -= uy * m; pts[j].x += ux * m; pts[j].y += uy * m; }
  }
  // labels: the first of above / below / right / left that hits no other label or dot
  type Box = [number, number, number, number];
  const hit = (a: Box, c: Box) => a[0] < c[2] && c[0] < a[2] && a[1] < c[3] && c[1] < a[3];
  const taken: Box[] = [...pts.map((p): Box => [p.x - 6, p.y - 6, p.x + 6, p.y + 6]), [W - 40, 2, W - 2, 40]];
  const labels = pts.map((p) => {
    const w = (p.s.name.length + 5) * 5.4, h = 11;
    const opts: [number, number, "start" | "middle" | "end"][] = [[0, -9, "middle"], [0, 16, "middle"], [9, 4, "start"], [-9, 4, "end"]];
    for (const [dx, dy, an] of opts) {
      const x = p.x + dx, y = p.y + dy;
      const bx: Box = an === "middle" ? [x - w / 2, y - h, x + w / 2, y + 2] : an === "start" ? [x, y - h, x + w, y + 2] : [x - w, y - h, x, y + 2];
      if (bx[0] < 2 || bx[2] > W - 2 || bx[1] < 2 || bx[3] > H - 2) continue;
      if (!taken.some((t) => hit(t, bx))) { taken.push(bx); return { x, y, an }; }
    }
    return { x: p.x, y: p.y - 9, an: "middle" as const };
  });
  const seg = (a: { x: number; y: number }, c: { x: number; y: number }, i: number) => {
    const bend = i % 2 ? 0.16 : -0.16;
    const mx = (a.x + c.x) / 2 - (c.y - a.y) * bend, my = (a.y + c.y) / 2 + (c.x - a.x) * bend;
    return `Q${mx.toFixed(1)} ${my.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  };
  const route = pts.map((p, i) => (i ? seg(pts[i - 1], p, i) : `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`)).join(" ");
  const side = b.side ? pts[b.side.from] : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sb-map" role="img" aria-label={b.mapTitle}>
      {Array.from({ length: 9 }, (_, i) => <path key={`v${i}`} d={`M${i * 50} 0 V${H}`} className="sb-grid" />)}
      {Array.from({ length: 5 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 57} H${W}`} className="sb-grid" />)}
      <path d={route} className="sb-route" />
      {side && b.side && (
        <>
          <path d={`M${side.x} ${side.y} Q ${b.side.dir === "w" ? side.x - 60 : side.x + 60} ${H - 6} ${b.side.dir === "w" ? 6 : W - 6} ${H - 16}`} className="sb-route sb-side" />
          <text x={b.side.dir === "w" ? 8 : W - 8} y={H - 22} textAnchor={b.side.dir === "w" ? "start" : "end"} className="sb-side-t">{b.side.label}</text>
        </>
      )}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.6" className="sb-dot" />
          <text x={labels[i].x} y={labels[i].y} textAnchor={labels[i].an} className="sb-place">{p.s.name} <tspan className="sb-year">{p.s.year}</tspan></text>
        </g>
      ))}
      <g transform={`translate(${W - 22} 22)`} className="sb-compass"><circle r="12" /><path d="M0 -10 L3 0 L0 10 L-3 0 Z" /><text y="-15" textAnchor="middle">N</text></g>
    </svg>
  );
}
