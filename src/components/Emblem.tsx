/**
 * Simple symbolic emblem drawn from family data (deterministic, no AI):
 * mountains for alpine countries, waves for coastal ones, a sun for southern ones,
 * plus the initial of the first place. Phase 2 replaces this with AI-generated
 * variants built from the family's own symbols (professions, values, objects).
 */
const ALPINE = new Set(["CH", "AT"]);
const SOUTH = new Set(["IT", "ES", "PT", "AR", "BR"]);
const SEA = new Set(["IT", "ES", "PT", "GB", "US", "AR", "BR", "FR"]);

export default function Emblem({ seed, countries, places, size = 160 }: { seed: string; countries: string[]; places: string[]; size?: number }) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rot = h % 12;
  const hasAlps = countries.some((c) => ALPINE.has(c));
  const hasSouth = countries.some((c) => SOUTH.has(c));
  const hasSea = countries.some((c) => SEA.has(c));
  const initial = (places[0] || "T").trim().charAt(0).toUpperCase();
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" role="img" aria-label="Family emblem">
      <circle cx="75" cy="75" r="66" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <circle cx="75" cy="75" r="58" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray={rot % 2 ? "2 3" : undefined} />
      {hasSouth && <circle cx="75" cy="44" r="12" fill="var(--warm)" />}
      {hasAlps && <path d="M28 100 L58 62 L72 78 L90 52 L122 100 Z" fill="var(--accent)" opacity=".85" />}
      {!hasAlps && <path d="M30 100 Q75 60 120 100 Z" fill="var(--accent)" opacity=".75" />}
      {hasSea && <path d="M34 112 q10 -8 20 0 t20 0 t20 0 t20 0" fill="none" stroke="var(--accent)" strokeWidth="2.5" />}
      <text x="75" y="134" textAnchor="middle" fontSize="13" fontFamily="var(--display)" fill="var(--ink)">{initial}</text>
    </svg>
  );
}
