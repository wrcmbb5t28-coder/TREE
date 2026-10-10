/**
 * Drawn portraits for people without a photo. Every person gets their own face,
 * always the same (seeded by their id), fitting their gender and age:
 * children look like children, grandparents get grey hair, lines and sometimes glasses.
 * Pure SVG in a 100×100 box: works in the tree, in avatars and in print.
 */

export type FacePerson = {
  id?: string;
  firstName: string;
  lastName?: string | null;
  gender?: string | null;
  relation?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
};

const FEMALE_REL = /^(mother|grandmother|greatGrandmother|wife|daughter|granddaughter|sister|aunt|niece|sisterInLaw|motherInLaw|cousinF|stepmother|stepdaughter)$/;
const MALE_REL = /^(father|grandfather|greatGrandfather|husband|son|grandson|brother|uncle|nephew|brotherInLaw|fatherInLaw|cousinM|stepfather|stepson)$/;
// Russian/Ukrainian male names that end like female ones
const MALE_A = /^(никита|илья|фома|лука|кузьма|савва|данила|гаврила|миша|саша|паша|ваня|петя|коля|вася|дима|лёша|леша|серёжа|сережа|женя|юра|толя|гоша|костя|слава|вова|боря|гриша|лёва|лева|федя|стёпа|степа|ilya|nikita|luca|luka|andrea|mattia|joshua|elia)$/i;

export function guessGender(p: FacePerson): "f" | "m" {
  if (p.gender === "f" || p.gender === "m") return p.gender;
  if (p.relation && FEMALE_REL.test(p.relation)) return "f";
  if (p.relation && MALE_REL.test(p.relation)) return "m";
  const n = p.firstName.trim().toLowerCase();
  if (MALE_A.test(n)) return "m";
  if (/[аяa]$/.test(n) || /(ine|elle|ette|ie|ly|iya)$/.test(n)) return "f";
  if (p.lastName && /(ова|ева|ина|ая|ская)$/i.test(p.lastName.trim())) return "f";
  return "m";
}

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length) % xs.length];

const SKIN = ["#F3D7C2", "#EDC9AE", "#E6BB98", "#DCA984", "#C99169"];
const HAIR = ["#3B2A20", "#4A3426", "#5C3D27", "#6E4527", "#8F6235", "#2A211C", "#7E3F28", "#A57A45"];
const CLOTHES = ["#2F5D4E", "#4F6D8F", "#8A5A44", "#7A5C8E", "#B4774A", "#5E7A3A", "#9C4F5A", "#3F5E6B", "#6B6B4F"];
const BG = ["#E7EEDF", "#F1E7D6", "#E5EAF0", "#F2E2DE", "#EAE4EF", "#E9EDE0"];

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Face drawn into a 0..100 box. Wrap it in <svg viewBox="0 0 100 100"> or a scaled <g>. */
export default function Face({ p, clipId, now = 2026, square = false }: { p: FacePerson; clipId: string; now?: number; square?: boolean }) {
  const r = rng(p.id ?? `${p.firstName} ${p.lastName ?? ""}`);
  const g = guessGender(p);
  const age = p.birthYear ? (p.deathYear ?? now) - p.birthYear : 40;
  const stage = age < 12 ? "child" : age < 20 ? "teen" : age < 45 ? "adult" : age < 65 ? "middle" : "elder";
  const old = stage === "elder";

  const skin = pick(r, SKIN.slice(0, 4));
  const skinDark = shade(skin, 0.86);
  let hair = pick(r, HAIR);
  if (stage === "middle" && r() < 0.5) hair = pick(r, ["#8D8379", "#7D6E62", "#9A8E80"]);
  if (old) hair = pick(r, ["#D9D6D0", "#C9C4BC", "#E8E5DF", "#B8B1A7"]);
  const hairDark = shade(hair, 0.82);
  const cloth = pick(r, CLOTHES);
  const bg = pick(r, BG);
  const glasses = old ? r() < 0.55 : stage === "middle" ? r() < 0.3 : stage === "adult" ? r() < 0.12 : false;
  const small = stage === "child";

  // Head geometry
  const hy = small ? 50 : 47, rx = small ? 21 : 19.5, ry = small ? 21.5 : 24;
  const eyeY = hy + (small ? 3 : 2), eyeDx = small ? 8 : 7.5;

  const styleF = old ? pick(r, ["bun", "curly", "short"]) : small ? pick(r, ["pigtails", "bob", "long"]) : pick(r, ["long", "bob", "bun", "long", "wavy"]);
  const styleM = old ? pick(r, ["bald", "short", "side"]) : small ? pick(r, ["short", "curly"]) : pick(r, ["short", "side", "curly", "side"]);
  const style = g === "f" ? styleF : styleM;
  const beard = g === "m" && (stage === "adult" || stage === "middle") && r() < 0.28;
  const moustache = g === "m" && !beard && (stage === "middle" || old) && r() < 0.35;

  const top = hy - ry; // top of the head
  const sideL = 50 - rx - 1, sideR = 50 + rx + 1;

  const back: React.ReactNode[] = [];
  const front: React.ReactNode[] = [];
  const H = { fill: hair, stroke: hairDark, strokeWidth: 0.8, strokeLinejoin: "round" as const };

  // hair behind the head
  if (g === "f" && (style === "long" || style === "wavy")) {
    back.push(<path key="b" {...H} d={`M${sideL - 2} ${hy} C${sideL - 5} ${top - 4} ${sideR + 5} ${top - 4} ${sideR + 2} ${hy} L${sideR + 5} ${hy + 34} C${sideR - 2} ${hy + 40} ${sideL + 2} ${hy + 40} ${sideL - 5} ${hy + 34} Z`} />);
  }
  if (g === "f" && style === "bob") {
    back.push(<path key="b" {...H} d={`M${sideL - 2} ${hy} C${sideL - 5} ${top - 4} ${sideR + 5} ${top - 4} ${sideR + 2} ${hy} L${sideR + 3} ${hy + 18} C${sideR - 3} ${hy + 22} ${sideL + 3} ${hy + 22} ${sideL - 3} ${hy + 18} Z`} />);
  }
  if (g === "f" && style === "pigtails") {
    back.push(<circle key="p1" cx={sideL - 4} cy={hy + 4} r={7} {...H} />, <circle key="p2" cx={sideR + 4} cy={hy + 4} r={7} {...H} />);
  }
  if (style === "bun") back.push(<circle key="bun" cx={50} cy={top + 1} r={8.5} {...H} />);

  // hair in front
  const capTop = top - 7;
  if (style === "long" || style === "bob" || style === "pigtails") {
    front.push(<path key="f" {...H} d={`M${sideL} ${hy + 2} C${sideL - 3} ${capTop} ${sideR + 3} ${capTop} ${sideR} ${hy + 2} C${sideR - 3} ${hy - 12} ${56} ${top + 9} ${46} ${top + 8} C${40} ${top + 12} ${sideL + 4} ${hy - 12} ${sideL} ${hy + 2} Z`} />);
  } else if (style === "wavy") {
    front.push(<path key="f" {...H} d={`M${sideL} ${hy + 4} C${sideL - 4} ${capTop} ${sideR + 4} ${capTop} ${sideR} ${hy + 4} C${sideR - 1} ${hy - 8} ${sideR - 8} ${top + 8} ${54} ${top + 10} C${48} ${top + 6} ${44} ${top + 13} ${38} ${top + 11} C${sideL + 3} ${top + 14} ${sideL + 1} ${hy - 6} ${sideL} ${hy + 4} Z`} />);
  } else if (style === "bun") {
    front.push(<path key="f" {...H} d={`M${sideL + 1} ${hy - 1} C${sideL} ${capTop + 2} ${sideR} ${capTop + 2} ${sideR - 1} ${hy - 1} C${sideR - 4} ${top + 10} ${56} ${top + 6} ${50} ${top + 6} C${44} ${top + 6} ${sideL + 4} ${top + 10} ${sideL + 1} ${hy - 1} Z`} />);
  } else if (style === "curly") {
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (1.05 + (0.9 * i) / (n - 1));
      front.push(<circle key={`c${i}`} cx={50 + Math.cos(a) * (rx + 1)} cy={hy - 4 + Math.sin(a) * (ry - 2)} r={g === "f" ? 6.5 : 5.5} {...H} />);
    }
  } else if (style === "short") {
    front.push(<path key="f" {...H} d={`M${sideL + 0.5} ${hy - 1} C${sideL - 1} ${capTop + 1} ${sideR + 1} ${capTop + 1} ${sideR - 0.5} ${hy - 1} C${sideR - 3} ${hy - 9} ${sideR - 6} ${top + 9} ${60} ${top + 11} C${53} ${top + 13} ${44} ${top + 12} ${38} ${top + 12} C${sideL + 3} ${top + 15} ${sideL + 1.5} ${hy - 8} ${sideL + 0.5} ${hy - 1} Z`} />);
  } else if (style === "side") {
    front.push(<path key="f" {...H} d={`M${sideL + 0.5} ${hy} C${sideL - 2} ${capTop} ${sideR + 2} ${capTop} ${sideR - 0.5} ${hy} C${sideR - 2} ${hy - 10} ${sideR - 5} ${top + 10} ${62} ${top + 11} C${54} ${top + 9} ${44} ${top + 8} ${36} ${top + 15} C${sideL + 2} ${top + 18} ${sideL + 1} ${hy - 7} ${sideL + 0.5} ${hy} Z`} />);
  } else if (style === "bald") {
    front.push(
      <path key="l" {...H} d={`M${sideL} ${hy + 6} C${sideL - 1} ${hy - 6} ${sideL + 2} ${hy - 12} ${sideL + 6} ${hy - 14} C${sideL + 5} ${hy - 6} ${sideL + 5} ${hy} ${sideL + 3} ${hy + 6} Z`} />,
      <path key="r" {...H} d={`M${sideR} ${hy + 6} C${sideR + 1} ${hy - 6} ${sideR - 2} ${hy - 12} ${sideR - 6} ${hy - 14} C${sideR - 5} ${hy - 6} ${sideR - 5} ${hy} ${sideR - 3} ${hy + 6} Z`} />,
    );
  }

  const ink = "#3A2C24";
  return (
    <g>
      <defs><clipPath id={clipId}>{square ? <rect width="100" height="100" /> : <circle cx="50" cy="50" r="50" />}</clipPath></defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="100" height="100" fill={bg} />
        <g transform="translate(50 59) scale(1.22) translate(-50 -54)">
        {back}
        {/* shoulders and neck */}
        <path d={`M${small ? 18 : 12} 104 C${small ? 20 : 14} ${hy + 34} ${small ? 34 : 30} ${hy + 28} 50 ${hy + 28} C${small ? 66 : 70} ${hy + 28} ${small ? 80 : 86} ${hy + 34} ${small ? 82 : 88} 104 Z`} fill={cloth} />
        <path d={`M43 ${hy + 16} h14 v${small ? 10 : 13} c-4 4 -10 4 -14 0 Z`} fill={skinDark} />
        {g === "f" ? <path d={`M40 ${hy + 28} Q50 ${hy + 38} 60 ${hy + 28}`} fill="none" stroke={shade(cloth, 0.75)} strokeWidth={1.4} />
          : <path d={`M42 ${hy + 27} L50 ${hy + 35} L58 ${hy + 27}`} fill="none" stroke={shade(cloth, 0.7)} strokeWidth={1.4} strokeLinejoin="round" />}
        {/* ears and head */}
        <ellipse cx={50 - rx} cy={eyeY + 2} rx={3.4} ry={4.5} fill={skinDark} />
        <ellipse cx={50 + rx} cy={eyeY + 2} rx={3.4} ry={4.5} fill={skinDark} />
        <ellipse cx="50" cy={hy} rx={rx} ry={ry} fill={skin} />
        {beard && <path d={`M${50 - rx + 1} ${hy + 2} C${50 - rx + 2} ${hy + ry + 4} ${50 + rx - 2} ${hy + ry + 4} ${50 + rx - 1} ${hy + 2} C${58} ${hy + 14} ${42} ${hy + 14} ${50 - rx + 1} ${hy + 2} Z`} fill={hair} stroke={hairDark} strokeWidth={0.6} />}
        {front}
        {/* cheeks */}
        <circle cx={50 - eyeDx - 2} cy={eyeY + 8} r={3.6} fill="#E38E7E" opacity={stage === "child" || g === "f" ? 0.32 : 0.18} />
        <circle cx={50 + eyeDx + 2} cy={eyeY + 8} r={3.6} fill="#E38E7E" opacity={stage === "child" || g === "f" ? 0.32 : 0.18} />
        {/* brows, eyes */}
        <path d={`M${50 - eyeDx - 4} ${eyeY - 5} Q${50 - eyeDx} ${eyeY - 7} ${50 - eyeDx + 3.5} ${eyeY - 5.5} M${50 + eyeDx + 4} ${eyeY - 5} Q${50 + eyeDx} ${eyeY - 7} ${50 + eyeDx - 3.5} ${eyeY - 5.5}`}
          fill="none" stroke={old ? "#9A9087" : hairDark} strokeWidth={1.5} strokeLinecap="round" />
        {old ? (
          <path d={`M${50 - eyeDx - 2} ${eyeY} q2 1.6 4 0 M${50 + eyeDx - 2} ${eyeY} q2 1.6 4 0`} fill="none" stroke={ink} strokeWidth={1.5} strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx={50 - eyeDx} cy={eyeY} rx={small ? 2.1 : 1.7} ry={small ? 2.6 : 2.1} fill={ink} />
            <ellipse cx={50 + eyeDx} cy={eyeY} rx={small ? 2.1 : 1.7} ry={small ? 2.6 : 2.1} fill={ink} />
            <circle cx={50 - eyeDx + 0.6} cy={eyeY - 0.8} r={0.6} fill="#fff" />
            <circle cx={50 + eyeDx + 0.6} cy={eyeY - 0.8} r={0.6} fill="#fff" />
          </>
        )}
        {glasses && (
          <g fill="none" stroke="#5A4636" strokeWidth={1.3}>
            <circle cx={50 - eyeDx} cy={eyeY} r={5.4} />
            <circle cx={50 + eyeDx} cy={eyeY} r={5.4} />
            <path d={`M${50 - eyeDx + 5.4} ${eyeY - 0.5} q${eyeDx - 5.4} -2 ${2 * (eyeDx - 5.4)} 0`} />
          </g>
        )}
        {/* nose, lines, mouth */}
        <path d={`M50 ${eyeY + 3} q-2.2 5 0.6 6`} fill="none" stroke={shade(skin, 0.74)} strokeWidth={1.3} strokeLinecap="round" />
        {(old || stage === "middle") && (
          <path d={`M${50 - 7} ${eyeY + 9} q-1.5 3 0 6 M${50 + 7} ${eyeY + 9} q1.5 3 0 6`} fill="none" stroke={shade(skin, 0.8)} strokeWidth={0.9} strokeLinecap="round" opacity={old ? 0.9 : 0.5} />
        )}
        {old && <path d={`M${50 - eyeDx - 6} ${eyeY + 2} l-2 1.2 M${50 + eyeDx + 6} ${eyeY + 2} l2 1.2`} stroke={shade(skin, 0.78)} strokeWidth={0.8} strokeLinecap="round" />}
        {moustache && <path d={`M43 ${eyeY + 11.5} Q50 ${eyeY + 8} 57 ${eyeY + 11.5} Q50 ${eyeY + 13} 43 ${eyeY + 11.5} Z`} fill={hair} stroke={hairDark} strokeWidth={0.5} />}
        {g === "f" && !small ? (
          <path d={`M45 ${eyeY + 14} Q50 ${eyeY + 18} 55 ${eyeY + 14} Q50 ${eyeY + 15.5} 45 ${eyeY + 14} Z`} fill="#C66B5E" />
        ) : (
          <path d={`M45.5 ${eyeY + 14} Q50 ${eyeY + 17.5} 54.5 ${eyeY + 14}`} fill="none" stroke="#8E4E40" strokeWidth={1.5} strokeLinecap="round" />
        )}
        </g>
      </g>
    </g>
  );
}

/** Standalone round portrait for HTML (lists, chips, profile header). */
export function FaceSvg({ p, size = 48, idSuffix = "" }: { p: FacePerson; size?: number; idSuffix?: string }) {
  const clip = `fc-${(p.id ?? p.firstName).replace(/[^a-zA-Z0-9_-]/g, "")}${idSuffix}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ flex: "none", borderRadius: "50%", display: "block" }}>
      <Face p={p} clipId={clip} />
    </svg>
  );
}
