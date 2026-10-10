import { CHARGES, DIVISIONS, SHAPES, TINCTURES, type CrestConfig } from "@/lib/crest";

/** Renders a family-line emblem. Pure SVG: works on the server, in the editor and in print. */
export default function CrestSvg({ c, size = 120, title, idSuffix = "" }: { c: CrestConfig; size?: number; title?: string; idSuffix?: string }) {
  const clip = `crest-${c.shape}-${idSuffix}`;
  const charge = CHARGES[c.charge] ?? CHARGES.tree;
  const col = TINCTURES[c.chargeColor].hex;
  const hasMotto = c.motto.trim().length > 0;
  const h = hasMotto ? 150 : 122;
  return (
    <svg width={size} height={(size * h) / 100} viewBox={`0 0 100 ${h}`} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <defs><clipPath id={clip}><path d={SHAPES[c.shape]} /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="100" height="120" fill={TINCTURES[c.field].hex} />
        {DIVISIONS[c.division] && <path d={DIVISIONS[c.division]} fill={TINCTURES[c.field2].hex} />}
        {/* Dark contour keeps the symbol readable on any field, also across a division line. */}
        <g transform="translate(18 21) scale(0.64)">
          {charge.stroke ? (
            <>
              <path d={charge.d} fill="none" stroke="#2B2F2C" strokeWidth={charge.stroke + 4} strokeLinecap="round" strokeLinejoin="round" />
              <path d={charge.d} fill="none" stroke={col} strokeWidth={charge.stroke} strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <path d={charge.d} fill={col} stroke="#2B2F2C" strokeWidth={2.6} strokeLinejoin="round" paintOrder="stroke" />
          )}
        </g>
      </g>
      <path d={SHAPES[c.shape]} fill="none" stroke="#2B2F2C" strokeWidth={2.4} strokeLinejoin="round" />
      {hasMotto && (
        <g>
          <path d="M4 128 Q8 122 14 126 L86 126 Q92 122 96 128 L92 140 Q88 146 84 142 L16 142 Q12 146 8 140 Z" fill="#F3F1EA" stroke="#2B2F2C" strokeWidth={1.4} />
          <text x="50" y="137.5" textAnchor="middle" fontSize={c.motto.length > 24 ? 6 : 7.5} fontFamily="Georgia, 'Spectral', serif" fontStyle="italic" fill="#2B2F2C">
            {c.motto.slice(0, 40)}
          </text>
        </g>
      )}
    </svg>
  );
}
