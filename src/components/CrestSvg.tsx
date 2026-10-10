import { CHARGES, DIVISIONS, ORDINARIES, SHAPES, TINCTURES, chargeLayout, type CrestConfig } from "@/lib/crest";

/** Renders a family-line emblem. Pure SVG: works on the server, in the editor and in print. */
export default function CrestSvg({ c, size = 120, title, idSuffix = "" }: { c: CrestConfig; size?: number; title?: string; idSuffix?: string }) {
  const clip = `crest-${c.shape}-${idSuffix}`;
  const col = TINCTURES[c.chargeColor].hex;
  const ord = TINCTURES[c.ordinaryColor].hex;
  const hasMotto = c.motto.trim().length > 0;
  const h = hasMotto ? 150 : 122;
  const layout = chargeLayout(c);
  return (
    <svg width={size} height={(size * h) / 100} viewBox={`0 0 100 ${h}`} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <defs><clipPath id={clip}><path d={SHAPES[c.shape]} /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="100" height="120" fill={TINCTURES[c.field].hex} />
        {DIVISIONS[c.division] && <path d={DIVISIONS[c.division]} fill={TINCTURES[c.field2].hex} />}
        {c.ordinary === "bordure" && <path d={SHAPES[c.shape]} fill="none" stroke={ord} strokeWidth={16} />}
        {ORDINARIES[c.ordinary] && <path d={ORDINARIES[c.ordinary]} fill={ord} stroke="#2B2F2C" strokeWidth={1.2} />}
        {/* Dark contour keeps each symbol readable on any field, also across lines and bands. */}
        {c.charges.map((id, i) => {
          const ch = CHARGES[id] ?? CHARGES.tree;
          const [cx, cy, s] = layout[i] ?? layout[0];
          return (
            <g key={i} transform={`translate(${cx - 50 * s} ${cy - 50 * s}) scale(${s})`}>
              {ch.stroke ? (
                <>
                  <path d={ch.d} fill="none" stroke="#2B2F2C" strokeWidth={ch.stroke + 4} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={ch.d} fill="none" stroke={col} strokeWidth={ch.stroke} strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <path d={ch.d} fill={col} stroke="#2B2F2C" strokeWidth={1.6 / s} strokeLinejoin="round" paintOrder="stroke" />
              )}
            </g>
          );
        })}
      </g>
      <path d={SHAPES[c.shape]} fill="none" stroke="#2B2F2C" strokeWidth={2.4} strokeLinejoin="round" />
      {hasMotto && (
        <g>
          <path d="M4 128 Q8 122 14 126 L86 126 Q92 122 96 128 L92 140 Q88 146 84 142 L16 142 Q12 146 8 140 Z" fill="#F3F1EA" stroke="#2B2F2C" strokeWidth={1.4} />
          <text x="50" y="137.5" textAnchor="middle" fontSize={Math.min(7.5, 150 / Math.max(1, c.motto.length))} fontFamily="Georgia, 'Spectral', serif" fontStyle="italic" fill="#2B2F2C">
            {c.motto.slice(0, 40)}
          </text>
        </g>
      )}
    </svg>
  );
}
