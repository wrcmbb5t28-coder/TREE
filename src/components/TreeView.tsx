import type { Person, Relationship } from "@prisma/client";
import { layoutTree, type TreeNode } from "@/lib/tree";
import { avatarById } from "@/lib/avatars";
import { lineName, surnameKey } from "@/lib/crest";
import TreeAutoScroll from "./TreeAutoScroll";
import Face from "./Face";

/**
 * The family tree as an illustration: round portrait medallions with names underneath,
 * fine ink lines between generations, painted over a soft watercolour tree.
 * Ancestors sit in the crown, the youngest generation grows out of the trunk.
 */

const BOX_W = 136; // room per person
const BOX_H = 132;
const R = 34; // portrait radius
const MED_Y = 40; // portrait centre from the top of a person's box
const GROUND = 150; // room for the trunk under the youngest row
const PAD = 34; // painted margin around the layout

const INK = "#6E5238";
const WASH = ["#C9D9B8", "#B7CDA3", "#D7E3C6", "#AFC79B", "#C3D5B0"];
const INK_SOFT = "#9C8164";
const GOLD = "#B8924A";

type Props = { people: Person[]; links: Relationship[]; label?: string; fit?: boolean };

export default function TreeView(props: Props) {
  if (props.people.length === 0) return null;
  try {
    return drawTree(props);
  } catch (e) {
    console.error("[tree] drawing failed, showing a plain list", e);
    return (
      <div className="tree-wrap">
        <ul className="row" style={{ gap: 8, flexWrap: "wrap", listStyle: "none", padding: 0, margin: 0 }}>
          {props.people.map((p) => <li key={p.id}><a className="chip-btn" href={`/app/family/${p.id}`}>{[p.firstName, p.lastName].filter(Boolean).join(" ")}</a></li>)}
        </ul>
      </div>
    );
  }
}

/** Seeded random, so the painting is the same on every render. */
function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}

function drawTree({ people, links, label = "Family tree", fit = false }: Props) {
  const { nodes, couples, families, width, height: h0 } = layoutTree(people, links, { boxW: BOX_W, boxH: BOX_H, coupleGap: 30, unitGap: 34, rowGap: 46 });
  const height = h0 + GROUND;
  const seed = people.map((p) => p.id).join();
  const id = `tv${Math.floor(rng(seed)() * 1e9).toString(36)}`;
  const rand = rng(id);
  const med = (y: number) => y - BOX_H / 2 + MED_Y; // portrait centre for a row whose box centre is y

  const ys = [...new Set(nodes.map((n) => n.y))].sort((a, b) => a - b);
  const lastY = ys[ys.length - 1];
  const bottom = nodes.filter((n) => n.y === lastY);
  const bx = (Math.min(...bottom.map((n) => n.x)) + Math.max(...bottom.map((n) => n.x))) / 2;
  const groundY = height - 34;
  // The trunk rises behind the youngest row and opens into the crown just under the row above.
  const trunkTop = ys.length > 1 ? med(ys[ys.length - 2]) + R + 70 : med(lastY) + R + 66;

  // ---- Ink lines: from the knot between the parents down to each child's portrait ----
  type Line = { d: string; leaves: { x: number; y: number; r: number }[] };
  const lines: Line[] = [];
  const curve = (a0: { x: number; y: number }, b: { x: number; y: number }, drop = 0): Line => {
    // drop: go straight down first (between the partners' names), then curve to the child
    const a = { x: a0.x, y: a0.y + drop };
    const dy = b.y - a.y;
    const p1 = { x: a.x, y: a.y + dy * 0.55 }, p2 = { x: b.x, y: b.y - dy * 0.55 };
    const at = (t: number) => {
      const u = 1 - t;
      return { x: u * u * u * a.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * b.y };
    };
    const leaves = [0.32, 0.68].map((t) => { const q = at(t + (rand() - 0.5) * 0.12); return { ...q, r: (rand() > 0.5 ? -40 : 220) + rand() * 30 }; });
    return { d: `M${a0.x} ${a0.y} V${a.y} C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${b.x} ${b.y}`, leaves };
  };
  for (const f of families) {
    // Couples: the line starts between the two portraits. A single parent: under the portrait.
    const isCouple = nodes.some((n) => Math.abs(n.y - f.from.y) < 1);
    const below = (isCouple ? med(f.from.y) : med(f.from.y - BOX_H / 2)) + R + 64;
    const from = isCouple ? { x: f.from.x, y: med(f.from.y) + 8 } : { x: f.from.x, y: below };
    for (const c of f.children) lines.push(curve(from, { x: c.x, y: med(c.y) - R - 6 }, below - from.y));
  }

  // ---- Watercolour crown: overlapping washes behind everyone above the youngest row ----
  const crownPeople = nodes.filter((n) => n.y !== lastY || ys.length === 1);
  const washes: { x: number; y: number; r: number; c: string }[] = crownPeople.flatMap((n) => [0, 1, 2].map(() => ({
    x: n.x + (rand() - 0.5) * BOX_W * 0.9, y: med(n.y) + 8 + (rand() - 0.5) * 50, r: 58 + rand() * 40,
    c: ["#C9D9B8", "#B7CDA3", "#D7E3C6", "#AFC79B"][Math.floor(rand() * 4)],
  }))).map((w) => ({ ...w, r: Math.max(30, Math.min(w.r, w.x + PAD - 6, width + PAD - 6 - w.x, w.y + PAD - 6)) }));
  const trunkW = Math.min(46, 22 + bottom.length * 5);
  const w0 = trunkW / 2, w1 = trunkW / 3, tt = trunkTop;
  const trunk = `M${bx - w0 - 26} ${groundY + 4} Q${bx - w0} ${groundY - 2} ${bx - w0 + 2} ${groundY - 22}
    C${bx - w0 + 4} ${groundY - 60} ${bx - w1} ${tt + 90} ${bx - w1} ${tt + 40}
    C${bx - w1 - 10} ${tt + 20} ${bx - 60} ${tt} ${bx - 84} ${tt - 36} L${bx - 70} ${tt - 42}
    C${bx - 46} ${tt - 12} ${bx - 14} ${tt + 4} ${bx} ${tt - 8}
    C${bx + 14} ${tt + 4} ${bx + 46} ${tt - 12} ${bx + 70} ${tt - 42} L${bx + 84} ${tt - 36}
    C${bx + 60} ${tt} ${bx + w1 + 10} ${tt + 20} ${bx + w1} ${tt + 40}
    C${bx + w1} ${tt + 90} ${bx + w0 - 4} ${groundY - 60} ${bx + w0 - 2} ${groundY - 22}
    Q${bx + w0} ${groundY - 2} ${bx + w0 + 26} ${groundY + 4} Z`;
  // foliage over the ends of the limbs
  if (ys.length > 1) for (const dx of [-78, 0, 78]) washes.push({ x: bx + dx, y: tt - 40, r: 46 + rand() * 14, c: "#C3D5B0" });

  const self = nodes.find((n) => n.self);
  const familyName = self?.last
    ? lineName(people.filter((p) => p.lastName && surnameKey(p.lastName) === surnameKey(self.last)).map((p) => p.lastName!))
    : "";

  return (
    <div className="tree-wrap tree-art">
      {!fit && <TreeAutoScroll />}
      <svg viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD}`} role="img" aria-label={label}
        style={{ width: "100%", minWidth: fit ? 0 : Math.min(width, 620), maxWidth: Math.max(width, 520), margin: "0 auto", display: "block" }}>
        <defs>
          {WASH.map((c, i) => (
            <radialGradient key={c} id={`${id}-w${i}`}>
              <stop offset="0" stopColor={c} stopOpacity=".75" />
              <stop offset=".62" stopColor={c} stopOpacity=".5" />
              <stop offset="1" stopColor={c} stopOpacity="0" />
            </radialGradient>
          ))}
          <linearGradient id={`${id}-bark`} x1="0" x2="1">
            <stop offset="0" stopColor="#B39573" />
            <stop offset=".5" stopColor="#CDB497" />
            <stop offset="1" stopColor="#A88866" />
          </linearGradient>
        </defs>

        {/* Painted background */}
        <g aria-hidden="true">
          <ellipse cx={bx} cy={groundY + 6} rx={Math.min(width * 0.36, 220)} ry={12} fill="#D9E2C8" opacity=".85" />
          {washes.map((w, i) => <circle key={i} cx={w.x} cy={w.y} r={w.r * 1.15} fill={`url(#${id}-w${Math.max(0, WASH.indexOf(w.c))})`} />)}
        </g>
        <g aria-hidden="true">
          <path d={trunk} fill={`url(#${id}-bark)`} opacity=".8" />
          <path d={`M${bx - 2} ${groundY - 8} C${bx - 4} ${groundY - 50} ${bx + 3} ${trunkTop + 30} ${bx - 1} ${trunkTop - 20} M${bx + 6} ${groundY - 20} C${bx + 7} ${groundY - 60} ${bx + 2} ${trunkTop + 40} ${bx + 4} ${trunkTop}`}
            fill="none" stroke="#8F7254" strokeOpacity=".45" strokeWidth={1.2} />
        </g>

        {/* Ink lines between generations */}
        <g aria-hidden="true">
          {lines.map((l, i) => <path key={`l${i}`} d={l.d} fill="none" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />)}
          {lines.flatMap((l) => l.leaves).map((q, i) => (
            <path key={`f${i}`} d="M0 0 C3 -4.2 9 -4.2 12 0 C9 4.2 3 4.2 0 0 Z M0 0 L10 0" fill="#9DBA88" stroke={INK} strokeWidth={0.9}
              transform={`translate(${q.x} ${q.y}) rotate(${q.r})`} />
          ))}
        </g>

        {/* Partners: a fine line and two linked rings */}
        {couples.map((c, i) => {
          const y = med(c.a.y), x1 = c.a.x + R + 6, x2 = c.b.x - R - 6, mid = (x1 + x2) / 2;
          return (
            <g key={`c${i}`} aria-hidden="true">
              <path d={`M${x1} ${y} Q${mid} ${y + 7} ${x2} ${y}`} fill="none" stroke={INK} strokeWidth={1.5} />
              <circle cx={mid - 3} cy={y + 3.5} r={4.2} fill="#FFFDF8" stroke={GOLD} strokeWidth={1.8} />
              <circle cx={mid + 3} cy={y + 3.5} r={4.2} fill="none" stroke={GOLD} strokeWidth={1.8} />
            </g>
          );
        })}

        {nodes.map((n) => <Portrait key={n.id} n={n} cy={med(n.y)} top={n.y - BOX_H / 2} />)}

        {/* Family name on a ribbon across the trunk */}
        {familyName && (
          <g aria-hidden="true">
            <path d={`M${bx - 92} ${groundY - 46} l 12 -10 l -12 -10 h 26 v 20 z M${bx + 92} ${groundY - 46} l -12 -10 l 12 -10 h -26 v 20 z`} fill="#E9DCC6" stroke={INK_SOFT} strokeWidth={1} />
            <path d={`M${bx - 70} ${groundY - 60} h 140 v 22 h -140 z`} fill="#F6EFE2" stroke={INK_SOFT} strokeWidth={1} />
            <text x={bx} y={groundY - 44.5} textAnchor="middle" fontSize={14} fontStyle="italic" fill={INK} fontFamily="var(--display, Georgia, serif)">{familyName.slice(0, 20)}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function Portrait({ n, cy, top }: { n: TreeNode; cy: number; top: number }) {
  const trim = (s: string, k: number) => (s.length > k ? s.slice(0, k - 1) + "…" : s);
  const cx = n.x;
  const clip = `pt-${n.id}`;
  const ring = n.self ? "var(--accent)" : n.living ? INK_SOFT : "#B9A88F";
  let face;
  if (n.photoPath) {
    face = (
      <>
        <clipPath id={clip}><circle cx={cx} cy={cy} r={R} /></clipPath>
        <circle cx={cx} cy={cy} r={R} fill="var(--tint)" />
        <image href={`/api/files/${n.photoPath}`} x={cx - R} y={cy - R} width={R * 2} height={R * 2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`}
          />
        {!n.living && <circle cx={cx} cy={cy} r={R} fill="#B8935F" opacity=".22" />}
      </>
    );
  } else {
    const preset = avatarById(n.avatar);
    face = preset ? (
      <>
        <circle cx={cx} cy={cy} r={R} fill={preset.bg} />
        <g transform={`translate(${cx - 15} ${cy - 15}) scale(1.25)`}><path d={preset.d} fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></g>
      </>
    ) : (
      <g transform={`translate(${cx - R} ${cy - R}) scale(${(2 * R) / 100})`}>
        <Face p={{ id: n.id, firstName: n.first, lastName: n.last, gender: n.gender, relation: n.relation, birthYear: n.birthYear, deathYear: n.deathYear }} clipId={`fc-${n.id}`} />
        {!n.living && <circle cx="50" cy="50" r="50" fill="#B8935F" opacity=".2" />}
      </g>
    );
  }
  return (
    <a href={`/app/family/${n.id}`} className="tn-person" data-self={n.self ? "" : undefined}>
      <title>{[n.first, n.last].filter(Boolean).join(" ")}</title>
      {/* generous hit area: portrait and name */}
      <rect x={cx - BOX_W / 2 + 4} y={top} width={BOX_W - 8} height={BOX_H} fill="transparent" />
      <circle cx={cx} cy={cy} r={R + 5} fill="#FFFDF8" />
      {face}
      <circle className="tn-ring" cx={cx} cy={cy} r={R + 4.5} fill="none" stroke={ring} strokeWidth={n.self ? 2.6 : 1.4}
        strokeDasharray={n.living ? undefined : "2.5 3"} />
      <text x={cx} y={top + MED_Y + R + 25} textAnchor="middle" fontSize={15.5} fontWeight={600} fill={n.self ? "var(--accent)" : "var(--ink)"} fontFamily="var(--display, Georgia, serif)">{trim(n.first, 15)}</text>
      {n.last && <text x={cx} y={top + MED_Y + R + 41} textAnchor="middle" fontSize={12.5} fill="var(--ink)" fontFamily="var(--body)">{trim(n.last, 18)}</text>}
      {n.sub && <text x={cx} y={top + MED_Y + R + (n.last ? 56 : 41)} textAnchor="middle" fontSize={11} fill="var(--muted)" fontFamily="var(--body)" style={{ fontVariantNumeric: "tabular-nums" }}>{trim(n.sub, 22)}</text>}
    </a>
  );
}
