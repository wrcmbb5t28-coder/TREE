/**
 * Hand-drawn-looking illustrations for the sample books: pencil outlines over soft watercolour
 * washes, one scene per story (a village street, a factory gate, a station, a harbour, a kitchen…).
 * Pure SVG, seeded so a picture never changes. Older years are drawn in sepia, newer ones in colour.
 */
import type { ReactNode } from "react";
import Face from "./Face";

export type BookScene =
  | "village" | "snowvillage" | "farm" | "whitevillage" | "church" | "factory" | "mine" | "station" | "wintertrain"
  | "harbour" | "steamship" | "docks" | "apartments" | "garden" | "market" | "citystreet" | "alley" | "ruins"
  | "shop" | "classroom" | "choir" | "dance" | "beach" | "carsea" | "carlake" | "celebration" | "wallnight"
  | "letters" | "orchard" | "lemons" | "fair" | "stadium" | "moving" | "room" | "kitchen" | "portrait" | "dish";

type R = () => number;
function rng(seed: string): R {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
const pick = <T,>(r: R, xs: T[]) => xs[Math.floor(r() * xs.length) % xs.length];

const INK = "#3B2F25";
const LINE = { stroke: INK, strokeWidth: 0.9, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const SKIN = ["#E9C4A4", "#DDB08C", "#D19C78", "#C58A64"];
const CLOTH = ["#5E6F8C", "#7C4F3E", "#4E6B57", "#8C6F4A", "#6B5A7A", "#9A5148", "#475C6B", "#7A7350", "#A0785A"];

/* ---------- small building blocks ---------- */

function Sky({ id, top = "#CFDDE6", bottom = "#F4EBDA" }: { id: string; top?: string; bottom?: string }) {
  return (
    <>
      <defs><linearGradient id={`${id}-sky`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient></defs>
      <rect width="320" height="200" fill={`url(#${id}-sky)`} />
    </>
  );
}
function Clouds({ r, n = 3, y = 30 }: { r: R; n?: number; y?: number }) {
  return <g fill="#FFFFFF" opacity=".55">{Array.from({ length: n }, (_, i) => {
    const x = 30 + r() * 260, yy = y + r() * 22, s = 0.7 + r() * 0.6;
    return <g key={i} transform={`translate(${x} ${yy}) scale(${s})`}><ellipse cx="0" cy="0" rx="22" ry="7" /><ellipse cx="12" cy="-5" rx="13" ry="7" /><ellipse cx="-10" cy="-3" rx="10" ry="6" /></g>;
  })}</g>;
}
function Birds({ r, n = 3 }: { r: R; n?: number }) {
  return <g fill="none" stroke={INK} strokeWidth=".8" opacity=".7">{Array.from({ length: n }, (_, i) => {
    const x = 40 + r() * 240, y = 18 + r() * 30, s = 3 + r() * 2;
    return <path key={i} d={`M${x - s} ${y} q${s / 2} -${s / 2} ${s} 0 q${s / 2} -${s / 2} ${s} 0`} />;
  })}</g>;
}
function Ground({ y = 150, color = "#B9AE7E", far = "#A9B58C" }: { y?: number; color?: string; far?: string }) {
  return (
    <>
      <path d={`M0 ${y - 14} C70 ${y - 26} 150 ${y - 10} 220 ${y - 20} C270 ${y - 26} 300 ${y - 18} 320 ${y - 20} V${y + 4} H0 Z`} fill={far} opacity=".75" />
      <rect y={y} width="320" height={200 - y} fill={color} />
    </>
  );
}

/** A standing person, feet at (x, y), h tall. */
function Person({ x, y, h = 34, r, skirt, hat, child, coat, carry, facing = 1 }: {
  x: number; y: number; h?: number; r: R; skirt?: boolean; hat?: "cap" | "scarf" | "hat" | "bun" | "none"; child?: boolean; coat?: string; carry?: boolean; facing?: 1 | -1;
}) {
  const s = (child ? 0.62 : 1) * (h / 34);
  const c = coat ?? pick(r, CLOTH), skin = pick(r, SKIN), hair = pick(r, ["#3B2A20", "#5C3D27", "#7E5A3A", "#8D8379"]);
  const hh = hat ?? (skirt ? pick(r, ["scarf", "bun", "none"] as const) : pick(r, ["cap", "hat", "none"] as const));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      {/* legs */}
      {!skirt && <path d="M-3.5 0 L-2.5 -13 M3.5 0 L2.5 -13" stroke="#3D3530" strokeWidth="3.2" strokeLinecap="round" />}
      {/* body */}
      {skirt
        ? <path d="M-9 0 C-8 -8 -6 -14 -5 -20 L5 -20 C6 -14 8 -8 9 0 Z" fill={c} {...LINE} />
        : <path d="M-6 -12 L-6.5 -24 C-6.5 -27 -4 -28 0 -28 C4 -28 6.5 -27 6.5 -24 L6 -12 Z" fill={c} {...LINE} />}
      {skirt && <path d="M-5 -20 L-5.5 -26 C-5 -28 -3 -28.5 0 -28.5 C3 -28.5 5 -28 5.5 -26 L5 -20 Z" fill={shade(c, 1.15)} {...LINE} />}
      {/* arms */}
      {carry
        ? <path d="M-5.5 -25 L-7 -18 L-1 -17 M5.5 -25 L7 -18 L1 -17" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" />
        : <path d="M-6 -25 L-7.5 -15 M6 -25 L7.5 -15" fill="none" stroke={shade(c, 0.85)} strokeWidth="2.6" strokeLinecap="round" />}
      {carry && <rect x="-5" y="-21" width="10" height="7" rx="1" fill="#A8885E" {...LINE} />}
      {/* head */}
      <circle cx="0" cy="-32.5" r="4.4" fill={skin} {...LINE} />
      {hh === "cap" && <path d="M-4.6 -34 C-4 -38.5 4 -38.5 4.6 -34 L6.5 -33.5 Z" fill="#4A4038" {...LINE} />}
      {hh === "hat" && <><ellipse cx="0" cy="-35.4" rx="7" ry="1.6" fill="#3E342C" /><path d="M-4 -35.5 C-4 -40 4 -40 4 -35.5 Z" fill="#3E342C" /></>}
      {hh === "scarf" && <path d="M-5.5 -31 C-6.5 -40 6.5 -40 5.5 -31 L4.5 -29 C3 -33 -3 -33 -4.5 -29 Z" fill={pick(r, ["#C9B79C", "#A85A4A", "#6E7F92", "#E3D6BC"])} {...LINE} />}
      {hh === "bun" && <><path d="M-4.4 -33 C-4.6 -38 4.6 -38 4.4 -33 C3 -35.5 -3 -35.5 -4.4 -33 Z" fill={hair} /><circle cx="0" cy="-37.6" r="2" fill={hair} /></>}
      {hh === "none" && <path d="M-4.4 -33 C-4.6 -38 4.6 -38 4.4 -33 C2 -35 -2 -35 -4.4 -33 Z" fill={hair} />}
      {h * (child ? 0.62 : 1) >= 50 && (
        <g>
          <circle cx="-1.6" cy="-32.6" r=".45" fill={INK} /><circle cx="1.6" cy="-32.6" r=".45" fill={INK} />
          <path d="M-1.3 -30.6 Q0 -29.8 1.3 -30.6" stroke="#8E4E40" strokeWidth=".45" fill="none" />
          <circle cx="-2.6" cy="-31.4" r=".9" fill="#E38E7E" opacity=".35" /><circle cx="2.6" cy="-31.4" r=".9" fill="#E38E7E" opacity=".35" />
        </g>
      )}
    </g>
  );
}
function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
function Crowd({ r, x0, x1, y, n, h = 26, women = 0.5 }: { r: R; x0: number; x1: number; y: number; n: number; h?: number; women?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const x = x0 + ((x1 - x0) * (i + r() * 0.6)) / n, yy = y + r() * 6;
    return <Person key={i} r={r} x={x} y={yy} h={h * (0.85 + r() * 0.25)} skirt={r() < women} facing={r() < 0.5 ? 1 : -1} />;
  })}</g>;
}

function Birch({ x, y = 150, h = 90, lean = 0 }: { x: number; y?: number; h?: number; lean?: number }) {
  return (
    <g>
      <path d={`M${x} ${y} C${x + lean / 2} ${y - h / 2} ${x + lean} ${y - h * 0.8} ${x + lean} ${y - h}`} stroke="#EFE8DA" strokeWidth="4.5" fill="none" />
      <path d={`M${x} ${y} C${x + lean / 2} ${y - h / 2} ${x + lean} ${y - h * 0.8} ${x + lean} ${y - h}`} stroke={INK} strokeWidth=".7" fill="none" opacity=".6" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x + (lean * i) / 7 - 2} ${y - 6 - (i * h) / 7} h3.5`} stroke={INK} strokeWidth="1.1" />)}
      <g fill="#93A86A" opacity=".85">{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={x + lean + ((i % 3) - 1) * 10} cy={y - h + 6 + Math.floor(i / 3) * 9} rx="11" ry="8" />)}</g>
    </g>
  );
}
function RoundTree({ x, y = 150, s = 1, c = "#7F9A5E", fruit }: { x: number; y?: number; s?: number; c?: string; fruit?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2 0 L-1.5 -22 L1.5 -22 L2 0 Z" fill="#6E5238" {...LINE} />
      <g fill={c} {...LINE}><circle cx="0" cy="-34" r="14" /><circle cx="-11" cy="-26" r="10" /><circle cx="11" cy="-26" r="10" /></g>
      {fruit && <g fill={fruit}>{[[-6, -32], [5, -38], [8, -26], [-10, -24], [1, -28]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="1.8" />)}</g>}
    </g>
  );
}
function Olive({ x, y = 150, s = 1 }: { x: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-3 0 C-5 -8 2 -10 -2 -18 M1 0 C4 -8 -1 -12 3 -18" stroke="#6E5A44" strokeWidth="3" fill="none" />
      <g fill="#8E9A6B" opacity=".9" {...LINE}><ellipse cx="0" cy="-26" rx="16" ry="9" /><ellipse cx="-9" cy="-20" rx="9" ry="6" /><ellipse cx="10" cy="-20" rx="9" ry="6" /></g>
    </g>
  );
}
function Pine({ x, y = 150, h = 50 }: { x: number; y?: number; h?: number }) {
  return <g><path d={`M${x} ${y} V${y - h * 0.3}`} stroke="#6E5238" strokeWidth="3" /><path d={`M${x} ${y - h} L${x + h * 0.25} ${y - h * 0.35} H${x - h * 0.25} Z`} fill="#5E7A55" {...LINE} /></g>;
}
function Window({ x, y, w = 10, h = 12, lit }: { x: number; y: number; w?: number; h?: number; lit?: boolean }) {
  return <g><rect x={x} y={y} width={w} height={h} fill={lit ? "#F2D58A" : "#C9D6DC"} {...LINE} /><path d={`M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}`} stroke={INK} strokeWidth=".6" /></g>;
}
function Izba({ x, y = 150, w = 70, snow }: { x: number; y?: number; w?: number; snow?: boolean }) {
  const h = w * 0.55;
  return (
    <g>
      <path d={`M${x - 4} ${y - h} L${x + w / 2} ${y - h - w * 0.42} L${x + w + 4} ${y - h} Z`} fill={snow ? "#F4F3EE" : "#8B7A60"} {...LINE} />
      <rect x={x} y={y - h} width={w} height={h} fill="#A27C55" {...LINE} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${x} ${y - h + 3 + i * (h / 7)} H${x + w}`} stroke={INK} strokeWidth=".5" opacity=".6" />)}
      {[0.2, 0.62].map((f) => <g key={f}><rect x={x + w * f} y={y - h * 0.72} width={w * 0.18} height={h * 0.36} fill="#C9D6DC" {...LINE} /><path d={`M${x + w * f - 2} ${y - h * 0.75} h${w * 0.18 + 4} l-${w * 0.09 + 2} -5 z`} fill="#E8DCC4" {...LINE} /></g>)}
      <path d={`M${x + w / 2 - 4} ${y - h - 4} l4 -4 l4 4`} stroke={INK} strokeWidth=".7" fill="none" />
    </g>
  );
}
function Steam({ x, y, c = "#D9D4CB" }: { x: number; y: number; c?: string }) {
  return <path d={`M${x} ${y} C${x + 6} ${y - 10} ${x - 4} ${y - 18} ${x + 8} ${y - 26} C${x + 16} ${y - 32} ${x + 10} ${y - 40} ${x + 22} ${y - 46}`} stroke={c} strokeWidth="7" strokeLinecap="round" fill="none" opacity=".75" />;
}
function Train({ x, y, wagons = 3, color = "#5A4A3E", snow }: { x: number; y: number; wagons?: number; color?: string; snow?: boolean }) {
  return (
    <g>
      {Array.from({ length: wagons }, (_, i) => (
        <g key={i} transform={`translate(${x + 56 + i * 54} 0)`}>
          <rect y={y - 26} width="50" height="22" fill={shade(color, 1.1 + (i % 2) * 0.08)} {...LINE} />
          {snow && <path d={`M0 ${y - 26} h50 v-2 h-50 z`} fill="#F4F3EE" />}
          <path d={`M18 ${y - 22} h14 v14 h-14 z`} fill={shade(color, 0.8)} {...LINE} />
          <circle cx="10" cy={y - 2} r="3.5" fill="#2E2925" /><circle cx="40" cy={y - 2} r="3.5" fill="#2E2925" />
        </g>
      ))}
      <g transform={`translate(${x} 0)`}>
        <rect x="0" y={y - 24} width="40" height="20" rx="3" fill="#2F2B28" {...LINE} />
        <rect x="26" y={y - 36} width="22" height="32" fill="#3A332E" {...LINE} />
        <rect x="6" y={y - 34} width="7" height="10" fill="#2F2B28" />
        <circle cx="10" cy={y - 2} r="5" fill="#26221F" /><circle cx="24" cy={y - 2} r="5" fill="#26221F" /><circle cx="38" cy={y - 2} r="5" fill="#26221F" />
        <Steam x={9} y={y - 36} />
      </g>
    </g>
  );
}
function Car({ x, y, c = "#E9E4D8", beetle }: { x: number; y: number; c?: string; beetle?: boolean }) {
  return beetle ? (
    <g>
      <path d={`M${x} ${y - 6} C${x} ${y - 30} ${x + 64} ${y - 30} ${x + 70} ${y - 6} Z`} fill={c} {...LINE} />
      <path d={`M${x + 18} ${y - 20} C${x + 22} ${y - 27} ${x + 44} ${y - 27} ${x + 50} ${y - 20} Z`} fill="#C9D6DC" {...LINE} />
      <circle cx={x + 15} cy={y - 4} r="6" fill="#2E2925" /><circle cx={x + 56} cy={y - 4} r="6" fill="#2E2925" />
    </g>
  ) : (
    <g>
      <path d={`M${x} ${y - 6} V${y - 16} C${x + 2} ${y - 20} ${x + 10} ${y - 21} ${x + 14} ${y - 22} C${x + 18} ${y - 32} ${x + 44} ${y - 32} ${x + 50} ${y - 22} C${x + 56} ${y - 21} ${x + 62} ${y - 18} ${x + 62} ${y - 12} V${y - 6} Z`} fill={c} {...LINE} />
      <path d={`M${x + 18} ${y - 22} C${x + 21} ${y - 28} ${x + 42} ${y - 28} ${x + 46} ${y - 22} Z`} fill="#C9D6DC" {...LINE} />
      <circle cx={x + 14} cy={y - 5} r="5.5" fill="#2E2925" /><circle cx={x + 50} cy={y - 5} r="5.5" fill="#2E2925" />
    </g>
  );
}
function Sea({ y = 120, c = "#8FB0BC" }: { y?: number; c?: string }) {
  return <g><rect y={y} width="320" height={200 - y} fill={c} /><g stroke="#FFFFFF" strokeWidth=".9" opacity=".6">{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${(i * 53) % 300} ${y + 8 + i * 9} q8 -3 16 0 t16 0`} fill="none" />)}</g></g>;
}
function SailBoat({ x, y, s = 1, sail = "#B5653E" }: { x: number; y: number; s?: number; sail?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-20 0 H20 L14 8 H-14 Z" fill="#5A4636" {...LINE} />
      <path d="M-2 0 V-44" stroke={INK} strokeWidth="1.4" />
      <path d="M-2 -42 C10 -30 14 -14 14 -2 H-1 Z" fill={sail} {...LINE} />
      <path d="M-3 -36 C-12 -24 -16 -12 -17 -2 H-3 Z" fill={shade(sail, 1.15)} {...LINE} />
    </g>
  );
}
function Steamship({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 H170 L156 22 H12 Z" fill="#2F2B28" {...LINE} />
      <rect x="20" y="-14" width="120" height="14" fill="#E9E1CF" {...LINE} />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={28 + i * 9.5} cy="-7" r="1.8" fill="#4A4038" />)}
      <rect x="40" y="-26" width="74" height="12" fill="#E9E1CF" {...LINE} />
      {[56, 92].map((fx) => <g key={fx}><rect x={fx} y="-52" width="12" height="26" fill="#A44A3A" {...LINE} /><rect x={fx} y="-52" width="12" height="5" fill="#2F2B28" /><Steam x={fx + 6} y={-52} c="#CFC9BF" /></g>)}
      <path d="M8 -4 L2 -40 M162 -4 L168 -40" stroke={INK} strokeWidth=".8" />
    </g>
  );
}
function Crane({ x, y }: { x: number; y: number }) {
  return <g {...LINE} fill="none" strokeWidth="1.4"><path d={`M${x} ${y} V${y - 70} L${x + 46} ${y - 62} M${x} ${y - 60} L${x + 40} ${y - 62} M${x + 40} ${y - 62} V${y - 34}`} /><rect x={x + 34} y={y - 34} width="12" height="8" fill="#8C6F4A" /></g>;
}
function Brick({ x, y, w, h, c = "#A35D45", windows = true, cols = 5, rows = 2 }: { x: number; y: number; w: number; h: number; c?: string; windows?: boolean; cols?: number; rows?: number }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={c} {...LINE} />
      <g stroke={shade(c, 0.8)} strokeWidth=".4" opacity=".7">{Array.from({ length: Math.floor(h / 4) }, (_, i) => <path key={i} d={`M${x} ${y - h + 4 + i * 4} h${w}`} />)}</g>
      {windows && Array.from({ length: rows }, (_, rr) => Array.from({ length: cols }, (_, cc) => (
        <path key={`${rr}-${cc}`} d={`M${x + 6 + cc * ((w - 12) / cols)} ${y - h + 10 + rr * ((h - 14) / rows) + 8} v-6 a${(w - 12) / cols / 2 - 2} 4 0 0 1 ${(w - 12) / cols - 4} 0 v6 z`} fill="#3E3A38" opacity=".85" />
      )))}
    </g>
  );
}
function Interior({ id, wall = "#E7D7B8", floor = "#B08B62", night }: { id: string; wall?: string; floor?: string; night?: boolean }) {
  return (
    <>
      <rect width="320" height="200" fill={wall} />
      <rect y="150" width="320" height="50" fill={floor} />
      <g stroke={shade(floor, 0.8)} strokeWidth=".6">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${i * 46 - 20} 200 L${i * 40 + 10} 150`} />)}</g>
      <defs><radialGradient id={`${id}-lamp`} cx=".5" cy=".3" r=".7"><stop offset="0" stopColor="#FFE9B0" stopOpacity={night ? 0.55 : 0.2} /><stop offset="1" stopColor="#FFE9B0" stopOpacity="0" /></radialGradient></defs>
      <rect width="320" height="200" fill={`url(#${id}-lamp)`} />
    </>
  );
}

/* ---------- the scenes ---------- */

function Scene({ k, r, id }: { k: BookScene; r: R; id: string }): ReactNode {
  switch (k) {
    case "village":
    case "snowvillage": {
      const snow = k === "snowvillage";
      return (
        <g>
          <Sky id={id} top={snow ? "#D9DEE2" : "#C9DAE3"} bottom={snow ? "#F2F1EC" : "#F4EBD6"} />
          {!snow && <Clouds r={r} />}<Birds r={r} />
          <Ground y={150} color={snow ? "#F1F0EB" : "#B6A876"} far={snow ? "#E3E4E0" : "#9FB083"} />
          <path d="M0 176 C90 160 170 166 320 156" stroke={snow ? "#D8D5CC" : "#9C8B66"} strokeWidth="18" fill="none" opacity=".7" />
          <Izba x={20} y={150} w={74} snow={snow} /><Izba x={118} y={146} w={60} snow={snow} /><Izba x={206} y={144} w={52} snow={snow} />
          <Birch x={104} y={150} h={88} lean={-4} /><Birch x={286} y={148} h={100} lean={-6} />
          <g {...LINE} fill="none" strokeWidth="1.3"><path d="M268 150 V118 M258 108 L292 128" /><rect x="262" y="140" width="12" height="10" fill="#8C6F4A" /></g>
          <Person r={r} x={190} y={174} h={30} skirt hat="scarf" carry />
          <Person r={r} x={150} y={170} h={30} hat="cap" />
          <g transform="translate(40 178)"><path d="M0 0 H34 L30 -10 H4 Z" fill="#7A5E40" {...LINE} /><circle cx="8" cy="2" r="5" fill="none" {...LINE} /><circle cx="28" cy="2" r="5" fill="none" {...LINE} /><path d="M34 -6 L52 -12" {...LINE} /><path d="M52 -20 C58 -26 70 -26 74 -18 L74 -6 M56 -6 V-16 M70 -6 V-16" fill="#6B5240" {...LINE} /></g>
        </g>
      );
    }
    case "farm":
      return (
        <g>
          <Sky id={id} /><Clouds r={r} /><Birds r={r} />
          <Ground y={150} color="#B4A878" far="#94A97C" />
          <g>
            <path d="M80 104 L130 70 L180 104 Z" fill="#8F5B45" {...LINE} />
            <rect x="86" y="104" width="88" height="46" fill="#EFE6D2" {...LINE} />
            <g stroke="#5A4030" strokeWidth="2.4" fill="none"><path d="M86 104 V150 M174 104 V150 M130 104 V150 M86 127 H174 M86 104 L108 127 M152 104 L174 127 M108 127 L86 150 M152 127 L174 150" /></g>
            <Window x={96} y={110} lit={false} /><Window x={150} y={110} /><rect x="120" y="128" width="16" height="22" fill="#6E5238" {...LINE} />
          </g>
          <path d="M230 150 V60 L236 50 L242 60 V150 Z" fill="#E8DCC4" {...LINE} /><path d="M226 62 L236 40 L246 62 Z" fill="#6E4A3A" {...LINE} />
          <RoundTree x={40} y={152} s={1.2} /><RoundTree x={290} y={150} />
          <path d="M190 150 C194 140 212 140 216 150 Z" fill="#8C7A50" {...LINE} />
          {[200, 212, 222].map((x, i) => <g key={x}><ellipse cx={x} cy={170 + i * 3} rx="4" ry="3" fill="#F3EDE0" {...LINE} /><path d={`M${x + 3} ${168 + i * 3} l2 -2`} stroke="#B5653E" strokeWidth="1.2" /></g>)}
          <Person r={r} x={60} y={176} h={34} hat="hat" />
          <path d="M66 148 L80 176 M66 148 C72 146 76 140 80 142" stroke={INK} strokeWidth="1" fill="none" />
        </g>
      );
    case "whitevillage":
      return (
        <g>
          <Sky id={id} top="#BCD3E2" bottom="#F6EEDC" /><Birds r={r} />
          <Ground y={156} color="#C9B38A" far="#B9B184" />
          {[[20, 156, 62, 40], [78, 150, 56, 50], [130, 156, 70, 38], [196, 150, 58, 46], [250, 156, 66, 40]].map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y - h} width={w} height={h} fill="#F7F3EA" {...LINE} />
              <path d={`M${x - 2} ${y - h} L${x + w / 2} ${y - h - 12} L${x + w + 2} ${y - h} Z`} fill="#B86B4B" {...LINE} />
              <rect x={x + w * 0.4} y={y - 18} width="10" height="18" fill="#7C5A3C" {...LINE} />
              <Window x={x + 8} y={y - h + 10} w={9} h={10} />
              <circle cx={x + w - 10} cy={y - h + 16} r="3.5" fill="#B5453A" />
            </g>
          ))}
          <path d="M150 104 V60 L160 52 L170 60 V104 Z" fill="#F7F3EA" {...LINE} /><path d="M160 46 V36 M156 40 h8" stroke={INK} strokeWidth="1" />
          <Person r={r} x={110} y={182} skirt hat="none" /><Person r={r} x={124} y={182} hat="hat" /><Person r={r} x={232} y={180} skirt hat="bun" />
        </g>
      );
    case "church":
      return (
        <g>
          <Sky id={id} top="#D7DDE0" bottom="#F3E9D6" /><Birds r={r} />
          <Ground y={154} color="#C2AE7C" far="#B5AB76" />
          <Birch x={30} y={156} h={110} lean={6} /><Birch x={296} y={154} h={104} lean={-6} />
          <g>
            <rect x="110" y="70" width="100" height="84" fill="#F1ECE2" {...LINE} />
            <path d="M104 72 H216 L206 60 H114 Z" fill="#8FA69A" {...LINE} />
            <rect x="142" y="36" width="36" height="34" fill="#F1ECE2" {...LINE} />
            <path d="M140 38 C140 14 180 14 180 38 Z" fill="#6F947F" {...LINE} />
            <path d="M160 14 V2 M155 7 h10" stroke="#C49A3C" strokeWidth="1.6" />
            <path d="M148 154 V124 C148 114 172 114 172 124 V154 Z" fill="#7C5A3C" {...LINE} />
            {[122, 192].map((x) => <path key={x} d={`M${x} 118 V98 C${x} 92 ${x + 10} 92 ${x + 10} 98 V118 Z`} fill="#C9D6DC" {...LINE} />)}
          </g>
          <g fill="#D9A23A" opacity=".8">{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={20 + r() * 280} cy={160 + r() * 36} r="1.6" />)}</g>
          <Crowd r={r} x0={60} x1={110} y={184} n={4} h={28} women={0.6} />
          <Crowd r={r} x0={214} x1={262} y={184} n={4} h={28} women={0.5} />
          <Person r={r} x={150} y={186} h={32} hat="cap" coat="#3E3A36" />
          <Person r={r} x={166} y={186} h={31} skirt hat="scarf" coat="#EFE9DC" />
        </g>
      );
    case "factory":
      return (
        <g>
          <Sky id={id} top="#C5C8C6" bottom="#EDE6D8" />
          {[70, 110, 250].map((x, i) => <g key={x}><rect x={x} y={20 + i * 8} width="10" height="100" fill="#8D5A48" {...LINE} /><Steam x={x + 5} y={22 + i * 8} c="#BDB8B0" /></g>)}
          <Brick x={0} y={150} w={150} h={70} cols={6} />
          <Brick x={170} y={150} w={150} h={80} c="#9A5A44" cols={6} />
          <path d="M150 150 V90 H170 V150" fill="#7C4F3E" {...LINE} />
          <path d="M138 150 V100 C138 88 182 88 182 100 V150" fill="none" stroke="#3B3530" strokeWidth="3" />
          <rect y="150" width="320" height="50" fill="#9D9282" />
          <g stroke="#7E7466" strokeWidth=".6">{Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 11} 150 L${i * 11 - 8} 200`} />)}</g>
          <Crowd r={r} x0={70} x1={250} y={176} n={11} h={30} women={0.15} />
          <path d="M0 192 H320" stroke="#5A5248" strokeWidth="1.5" />
        </g>
      );
    case "mine":
      return (
        <g>
          <Sky id={id} top="#C9CBC8" bottom="#EEE6D6" /><Birds r={r} />
          <path d="M0 110 C60 70 120 80 160 96 C210 70 270 60 320 86 V200 H0 Z" fill="#8E9A78" />
          <path d="M200 150 C220 110 260 100 300 120 L320 150 Z" fill="#4A4542" {...LINE} />
          <g {...LINE} fill="none" strokeWidth="1.6"><path d="M70 150 L90 50 L110 150 M80 100 H100 M76 124 H104 M90 50 L130 150" /><circle cx="90" cy="48" r="10" /><path d="M80 48 h20 M90 38 v20" strokeWidth=".8" /></g>
          {Array.from({ length: 7 }, (_, i) => <g key={i}><rect x={130 + i * 22} y={124 - (i % 2) * 2} width="22" height="26" fill="#9B8F80" {...LINE} /><path d={`M${130 + i * 22} ${124 - (i % 2) * 2} l11 -8 l11 8`} fill="#5A5654" {...LINE} /><Window x={136 + i * 22} y={130} w={8} h={8} lit={i % 3 === 0} /></g>)}
          <rect y="150" width="320" height="50" fill="#7D7466" />
          <Crowd r={r} x0={30} x1={150} y={180} n={6} h={30} women={0} />
          <g fill="#F2D58A">{[42, 64, 86, 108].map((x) => <circle key={x} cx={x + 6} cy="166" r="1.6" />)}</g>
        </g>
      );
    case "station":
    case "wintertrain": {
      const snow = k === "wintertrain";
      return (
        <g>
          <Sky id={id} top={snow ? "#CFD4D8" : "#C9CFCF"} bottom={snow ? "#ECEDEA" : "#EDE5D5"} />
          {snow ? <Ground y={150} color="#EEEDE8" far="#DCDCD6" /> : <>
            <path d="M0 40 L160 6 L320 40 V60 H0 Z" fill="#6E655C" {...LINE} />
            {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 40} 60 V140`} stroke="#5A524A" strokeWidth="3" />)}
            <rect y="140" width="320" height="60" fill="#A59A88" /></>}
          <Train x={14} y={150} wagons={5} snow={snow} />
          <rect y="150" width="320" height="6" fill="#5A5248" />
          <Crowd r={r} x0={20} x1={300} y={186} n={10} h={30} women={0.45} />
          {Array.from({ length: 4 }, (_, i) => <rect key={i} x={40 + i * 70 + r() * 20} y={180} width="14" height="9" fill="#9C7B52" {...LINE} />)}
          {!snow && <g><circle cx="160" cy="24" r="8" fill="#F3EEE2" {...LINE} /><path d="M160 24 V19 M160 24 L164 26" stroke={INK} strokeWidth=".8" /></g>}
          {snow && <g fill="#FFFFFF">{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={r() * 320} cy={r() * 150} r={0.8 + r()} opacity=".8" />)}</g>}
        </g>
      );
    }
    case "harbour":
      return (
        <g>
          <Sky id={id} top="#BFD3DD" bottom="#F2EAD8" /><Clouds r={r} /><Birds r={r} n={5} />
          <Sea y={112} />
          <SailBoat x={70} y={122} s={1.1} /><SailBoat x={150} y={118} s={0.8} sail="#A9563A" /><SailBoat x={230} y={124} s={1} sail="#C48A4A" />
          <path d="M0 150 H320 V200 H0 Z" fill="#A79A82" /><path d="M0 150 H320" stroke={INK} strokeWidth="1" />
          <g>{[[230, 150, 40, 36], [272, 150, 48, 46]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y - h} width={w} height={h} fill="#D8CDB8" {...LINE} /><path d={`M${x - 2} ${y - h} L${x + w / 2} ${y - h - 12} L${x + w + 2} ${y - h} Z`} fill="#5A6470" {...LINE} /><Window x={x + 8} y={y - h + 8} /></g>)}</g>
          {[40, 66, 92].map((x) => <g key={x}><path d={`M${x} 180 h16 l-2 8 h-12 z`} fill="#A8885E" {...LINE} /><g fill="#B9C3C7">{[3, 7, 11].map((d) => <ellipse key={d} cx={x + d + 1} cy="179" rx="2.5" ry="1" />)}</g></g>)}
          <Person r={r} x={130} y={184} h={32} skirt hat="scarf" coat="#2E2B2A" />
          <Person r={r} x={150} y={186} h={33} hat="cap" coat="#4A5E73" />
          <Person r={r} x={176} y={184} h={31} skirt hat="scarf" coat="#2E2B2A" carry />
        </g>
      );
    case "steamship":
      return (
        <g>
          <Sky id={id} top="#C7CFD2" bottom="#EFE7D6" /><Birds r={r} n={4} />
          <Sea y={120} c="#90A8AE" />
          <path d="M210 120 C230 90 260 70 300 64 L320 70 V120 Z" fill="#9AA28C" opacity=".8" />
          <Steamship x={40} y={118} s={1.1} />
          <rect y="146" width="320" height="54" fill="#A59A88" /><path d="M0 146 H320" stroke={INK} strokeWidth="1" />
          <path d="M150 146 L176 124" stroke={INK} strokeWidth="2" />
          <Crowd r={r} x0={10} x1={310} y={182} n={14} h={30} women={0.45} />
          {Array.from({ length: 5 }, (_, i) => <rect key={i} x={24 + i * 62 + r() * 10} y={178} width="16" height="10" fill="#8C6A44" {...LINE} />)}
        </g>
      );
    case "docks":
      return (
        <g>
          <Sky id={id} top="#C2C8C8" bottom="#ECE4D4" />
          <Sea y={126} c="#8E9EA0" />
          <Steamship x={120} y={124} s={0.95} />
          <Crane x={40} y={150} /><Crane x={280} y={150} />
          <rect y="150" width="320" height="50" fill="#8C8070" /><path d="M0 150 H320" stroke={INK} strokeWidth="1" />
          <path d="M20 150 L60 120 H100 L110 150 Z" fill="#3A3633" {...LINE} />
          <Crowd r={r} x0={140} x1={300} y={182} n={7} h={30} women={0} />
          {[30, 60].map((x) => <g key={x}><rect x={x} y={168} width="24" height="16" fill="#7C6448" {...LINE} /><path d={`M${x} ${176} h24`} stroke={INK} strokeWidth=".5" /></g>)}
        </g>
      );
    case "apartments":
      return (
        <g>
          <Sky id={id} top="#C9DCE4" bottom="#F3ECDD" /><Clouds r={r} />
          <rect x="40" y="56" width="240" height="98" fill="#D9D3C6" {...LINE} />
          {Array.from({ length: 5 }, (_, rr) => Array.from({ length: 12 }, (_, cc) => <Window key={`${rr}-${cc}`} x={50 + cc * 19.5} y={62 + rr * 18} w={11} h={12} lit={r() < 0.12} />))}
          {[110, 210].map((x) => <rect key={x} x={x} y="134" width="16" height="20" fill="#6E5238" {...LINE} />)}
          <Ground y={154} color="#B8B18A" far="#A9B58C" />
          <Birch x={20} y={156} h={70} lean={2} /><Birch x={300} y={154} h={64} lean={-3} />
          <g stroke={INK} strokeWidth=".6"><path d="M230 176 H300 M236 170 V180 M294 170 V180" /></g>
          <g fill="#E9E1CF">{[244, 256, 270, 282].map((x) => <rect key={x} x={x} y="176" width="8" height="10" />)}</g>
          <Person r={r} x={140} y={186} h={32} hat="none" carry /><Person r={r} x={158} y={186} h={30} skirt hat="bun" />
          <g transform="translate(176 188)"><path d="M0 0 h10 l-1 -8 h-8 z" fill="#B86B4B" {...LINE} /><path d="M5 -8 C2 -18 -4 -20 -6 -24 M5 -8 C8 -18 14 -20 15 -26 M5 -8 V-26" stroke="#5E7A3A" strokeWidth="2" fill="none" /></g>
          <rect x="40" y="168" width="54" height="22" fill="#6F7F66" {...LINE} /><rect x="70" y="160" width="24" height="12" fill="#7C8F72" {...LINE} />
        </g>
      );
    case "garden":
      return (
        <g>
          <Sky id={id} top="#BFD8E2" bottom="#F5EED9" /><Clouds r={r} /><Birds r={r} />
          <Ground y={146} color="#A4955F" far="#93A86A" />
          <g><path d="M200 112 L230 88 L260 112 Z" fill="#7C4F3E" {...LINE} /><rect x="206" y="112" width="48" height="36" fill="#7E9B70" {...LINE} /><Window x={214} y={120} /><rect x="238" y="122" width="10" height="26" fill="#5A4030" {...LINE} /></g>
          <RoundTree x={290} y={148} s={1.1} fruit="#C8463A" /><RoundTree x={170} y={146} s={0.9} fruit="#C8463A" />
          <g stroke="#6E5A3A" strokeWidth="2.4">{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M0 ${160 + i * 9} C80 ${156 + i * 9} 140 ${158 + i * 9} 190 ${156 + i * 9}`} fill="none" />)}</g>
          <g fill="#7FA05E">{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={10 + (i % 10) * 18} cy={158 + Math.floor(i / 10) * 18} r="4" />)}</g>
          <Person r={r} x={60} y={184} h={32} hat="scarf" skirt /><Person r={r} x={100} y={182} h={34} hat="cap" />
          <Person r={r} x={130} y={186} child hat="none" />
          {[80, 116].map((x) => <path key={x} d={`M${x} 188 h10 l-1.5 -9 h-7 z`} fill="#8F9A9F" {...LINE} />)}
          <g transform="translate(150 188)"><ellipse cx="0" cy="-5" rx="7" ry="4" fill="#B08B62" {...LINE} /><circle cx="7" cy="-9" r="3" fill="#B08B62" {...LINE} /><path d="M-7 -5 l-4 -3" {...LINE} /></g>
        </g>
      );
    case "market":
      return (
        <g>
          <Sky id={id} top="#C3C9CC" bottom="#ECE6DA" />
          <rect x="0" y="40" width="110" height="110" fill="#B6AC9C" {...LINE} /><rect x="210" y="30" width="110" height="120" fill="#A99F90" {...LINE} />
          {Array.from({ length: 12 }, (_, i) => <Window key={i} x={(i % 2 ? 230 : 12) + (i % 4 > 1 ? 40 : 0)} y={50 + Math.floor(i / 4) * 30} w={14} h={16} lit={r() < 0.2} />)}
          <rect y="150" width="320" height="50" fill="#D9D7D0" />
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`translate(${8 + i * 52} 0)`}>
              <rect x="0" y="112" width="46" height="40" fill={pick(r, ["#CFC4AE", "#B8C2C0", "#D6C29A", "#C7B3A6"])} {...LINE} />
              <rect x="4" y="118" width="38" height="16" fill="#9FB4BC" {...LINE} />
              <path d="M-2 112 H48 L44 106 H2 Z" fill={pick(r, ["#A5483A", "#4F6E8C", "#6F8C5E"])} {...LINE} />
            </g>
          ))}
          <g transform="translate(110 96)"><rect width="100" height="36" rx="6" fill="#C9A444" {...LINE} />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={6 + i * 15} y="6" width="10" height="12" fill="#B9C6CC" />)}<path d="M30 0 L22 -18 M70 0 L62 -18 M14 -18 H78" stroke={INK} strokeWidth="1" /></g>
          <Crowd r={r} x0={10} x1={310} y={186} n={12} h={30} women={0.5} />
          <g fill="#FFFFFF" opacity=".8">{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={r() * 320} cy={r() * 150} r=".9" />)}</g>
        </g>
      );
    case "citystreet":
      return (
        <g>
          <Sky id={id} top="#C7D3DA" bottom="#F0E8DA" />
          {[[0, 60, 70, "#C9B79C"], [70, 40, 60, "#B9A88F"], [210, 50, 56, "#CDBFA8"], [266, 34, 54, "#B5A48A"]].map(([x, y, w, c], i) => (
            <g key={i}><rect x={x as number} y={y as number} width={w as number} height={150 - (y as number)} fill={c as string} {...LINE} />
              {Array.from({ length: 6 }, (_, j) => <Window key={j} x={(x as number) + 8 + (j % 2) * ((w as number) / 2)} y={(y as number) + 10 + Math.floor(j / 2) * 26} w={12} h={16} lit={r() < 0.15} />)}
            </g>
          ))}
          <rect x="130" y="70" width="80" height="80" fill="#D6CDBB" {...LINE} />
          <rect x="136" y="118" width="68" height="32" fill="#3F5E4E" {...LINE} /><path d="M132 118 H208 L204 110 H136 Z" fill="#A5483A" {...LINE} />
          <rect y="150" width="320" height="50" fill="#9C9486" /><path d="M0 162 H320" stroke="#EDE6D6" strokeWidth="1" strokeDasharray="10 8" />
          <g transform="translate(20 152)"><rect x="0" y="-44" width="96" height="44" rx="5" fill="#B7372E" {...LINE} /><path d="M0 -24 H96" stroke={INK} strokeWidth=".8" />{Array.from({ length: 5 }, (_, i) => <rect key={i} x={8 + i * 17} y="-40" width="12" height="12" fill="#C9D6DC" />)}{Array.from({ length: 5 }, (_, i) => <rect key={`b${i}`} x={8 + i * 17} y="-20" width="12" height="11" fill="#C9D6DC" />)}<circle cx="20" cy="2" r="6" fill="#2E2925" /><circle cx="78" cy="2" r="6" fill="#2E2925" /></g>
          <Crowd r={r} x0={140} x1={310} y={192} n={6} h={30} women={0.5} />
        </g>
      );
    case "alley":
      return (
        <g>
          <rect width="320" height="200" fill="#E8DCC2" />
          <path d="M0 0 H110 L140 160 V200 H0 Z" fill="#C9A98A" {...LINE} />
          <path d="M320 0 H210 L180 160 V200 H320 Z" fill="#D4B796" {...LINE} />
          <path d="M140 160 L180 160 L188 200 H132 Z" fill="#A79A82" />
          {Array.from({ length: 4 }, (_, i) => <g key={i}><Window x={30 + (i % 2) * 40} y={20 + Math.floor(i / 2) * 60} w={16} h={22} /><path d={`M${26 + (i % 2) * 40} ${44 + Math.floor(i / 2) * 60} h24`} stroke={INK} strokeWidth="1.2" /></g>)}
          {Array.from({ length: 4 }, (_, i) => <Window key={`r${i}`} x={234 + (i % 2) * 40} y={20 + Math.floor(i / 2) * 60} w={16} h={22} />)}
          {[50, 100].map((y, j) => <g key={y}><path d={`M100 ${y} Q160 ${y + 16} 220 ${y}`} stroke={INK} strokeWidth=".6" fill="none" />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={110 + i * 17} y={y + 6 + Math.sin(i) * 3} width="10" height="14" fill={pick(r, ["#F3F0E8", "#C9D6DC", "#E3B9A6", "#EAD9A2"])} {...LINE} transform={`rotate(${(i - 2) * 2} ${115 + i * 17} ${y + 8})`} />)}{j === 0 && <path d="M200 70 v30" stroke={INK} strokeWidth=".6" />}</g>)}
          <g transform="translate(200 100)"><path d="M0 0 v12 h-12" stroke={INK} strokeWidth=".6" fill="none" /><path d="M-18 12 h12 l-2 8 h-8 z" fill="#B08B62" {...LINE} /></g>
          <Person r={r} x={150} y={190} child hat="none" /><Person r={r} x={170} y={188} child hat="none" facing={-1} />
          <path d="M60 140 h20 v-24 h-20 z" fill="#E9E1CF" {...LINE} /><circle cx="70" cy="126" r="5" fill="#D9A23A" />
        </g>
      );
    case "ruins":
      return (
        <g>
          <Sky id={id} top="#C2C3BF" bottom="#E7DFCF" />
          <path d="M240 20 C250 0 280 4 300 20" stroke="#A9A49B" strokeWidth="18" fill="none" opacity=".5" />
          <path d="M0 150 V70 L20 60 L28 80 L46 64 L60 90 V150 Z" fill="#A9978A" {...LINE} />
          <path d="M200 150 V50 L230 46 L236 70 L250 56 L270 64 V150 Z" fill="#9C8B7C" {...LINE} />
          {[[212, 70], [240, 76], [212, 104], [240, 108]].map(([x, y], i) => <rect key={i} x={x} y={y} width="14" height="18" fill="#3E3A38" opacity=".8" />)}
          <path d="M60 150 C80 120 120 116 150 130 C170 122 190 126 200 150 Z" fill="#B9AA98" {...LINE} />
          {Array.from({ length: 18 }, (_, i) => <rect key={i} x={70 + r() * 120} y={126 + r() * 22} width="7" height="4" fill="#A35D45" transform={`rotate(${r() * 60 - 30} ${74 + i * 6} 136)`} />)}
          <rect y="150" width="320" height="50" fill="#9A9184" />
          <Crowd r={r} x0={60} x1={180} y={186} n={5} h={30} women={0.8} />
          <g transform="translate(240 186)"><path d="M0 0 H28 V-10 H0 Z" fill="#7A5E40" {...LINE} /><circle cx="4" cy="2" r="4" fill="none" {...LINE} /><circle cx="24" cy="2" r="4" fill="none" {...LINE} /><path d="M28 -6 L40 -12" {...LINE} /></g>
          <Person r={r} x={286} y={186} child hat="cap" />
        </g>
      );
    case "shop":
      return (
        <g>
          <Interior id={id} wall="#E2CFAE" floor="#A3805A" />
          <rect x="0" y="40" width="320" height="10" fill="#8C6A44" />
          {[60, 92].map((y) => <g key={y}><rect x="20" y={y} width="280" height="4" fill="#7C5A3C" />{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={34 + i * 23} cy={y - 7} rx="10" ry="7" fill={pick(r, ["#C58E55", "#B57A45", "#D4A26A"])} {...LINE} />)}</g>)}
          <rect x="30" y="120" width="260" height="40" fill="#8C6A44" {...LINE} />
          <Person r={r} x={160} y={122} h={34} hat="none" coat="#F3EFE6" />
          <Crowd r={r} x0={30} x1={300} y={196} n={6} h={34} women={0.6} />
          <g fill="#D8D2BD">{[60, 110, 220, 270].map((x) => <rect key={x} x={x} y={162} width="14" height="9" {...LINE} />)}</g>
        </g>
      );
    case "classroom":
      return (
        <g>
          <Interior id={id} wall="#D9D0B8" floor="#9C7B55" />
          <rect x="70" y="30" width="180" height="70" fill="#2F3F37" {...LINE} />
          <g stroke="#E9E4D8" strokeWidth="1.2" fill="none"><path d="M86 50 h20 M92 44 v12 M114 50 h10 M130 46 h14 M130 54 h14 M150 50 l6 0 M170 46 c8 0 8 10 0 10 M190 50 h24 M86 76 h40 M140 76 h50" /></g>
          <rect x="262" y="30" width="44" height="34" fill="#C9C29C" {...LINE} /><path d="M268 38 c8 4 14 -4 24 0 M270 50 c10 -4 20 6 30 0" stroke="#7C8F72" strokeWidth="2" fill="none" />
          <Person r={r} x={50} y={150} h={40} hat="none" coat="#7C6650" />
          {Array.from({ length: 3 }, (_, row) => Array.from({ length: 4 }, (_, i) => (
            <g key={`${row}-${i}`} transform={`translate(${90 + i * 56 - row * 6} ${140 + row * 22})`}>
              <Person r={r} x={10} y={6} child hat="none" coat="#7E7E78" />
              <rect x="-6" y="0" width="40" height="8" fill="#8C6A44" {...LINE} />
              <circle cx="28" cy="2" r="1.4" fill="#2E2925" />
            </g>
          )))}
        </g>
      );
    case "choir":
      return (
        <g>
          <Sky id={id} top="#D3D8D6" bottom="#EEE6D4" />
          <rect x="40" y="30" width="240" height="120" fill="#B8AB97" {...LINE} />
          <path d="M30 32 L160 6 L290 32 Z" fill="#7E756A" {...LINE} />
          {[70, 130, 190, 250].map((x) => <path key={x} d={`M${x - 10} 110 V64 C${x - 10} 52 ${x + 10} 52 ${x + 10} 64 V110 Z`} fill="#C9D6DC" {...LINE} />)}
          <rect y="150" width="320" height="50" fill="#A59A88" />
          {[0, 1, 2].map((row) => <Crowd key={row} r={r} x0={30 + row * 8} x1={290 - row * 8} y={154 + row * 14} n={12 - row} h={28} women={0} />)}
          <Person r={r} x={160} y={196} h={34} hat="none" coat="#2E2B2A" />
          <path d="M166 162 L176 150" stroke={INK} strokeWidth="1" />
        </g>
      );
    case "dance":
      return (
        <g>
          <Interior id={id} wall="#C9B08E" floor="#8C6A44" night />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 40} 0 q20 18 40 0`} stroke={pick(r, ["#B5453A", "#D9A23A", "#4F6E8C"])} strokeWidth="1.5" fill="none" />)}
          <rect x="200" y="70" width="110" height="20" fill="#7C5A3C" {...LINE} />
          <g transform="translate(212 70)"><rect x="0" y="-26" width="30" height="20" fill="#2E2B2A" {...LINE} /><Person r={r} x={50} y={0} h={26} hat="none" coat="#2E2B2A" /><Person r={r} x={74} y={0} h={26} hat="none" coat="#2E2B2A" /><path d="M78 -16 l10 10" stroke="#C49A3C" strokeWidth="2" /></g>
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <Person r={r} x={30 + i * 56} y={176 + (i % 2) * 8} h={34} hat="none" coat={pick(r, ["#3E3A36", "#4A5468"])} />
              <Person r={r} x={42 + i * 56} y={176 + (i % 2) * 8} h={32} skirt hat="bun" coat={pick(r, ["#B5453A", "#6E7F92", "#C9A444", "#7A5C8E"])} facing={-1} />
            </g>
          ))}
        </g>
      );
    case "beach":
      return (
        <g>
          <Sky id={id} top="#B5D3E3" bottom="#F5EEDC" /><Clouds r={r} /><Birds r={r} n={5} />
          <Sea y={100} c="#86AFC0" />
          <path d="M0 96 C30 70 70 66 100 98 Z" fill="#C8BBA0" {...LINE} />
          <path d="M0 140 C80 128 200 134 320 124 V200 H0 Z" fill="#E6D3A6" />
          {[[60, 150], [230, 146]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y} L${x + 20} ${y - 26} L${x + 40} ${y} Z`} fill={i ? "#B5453A" : "#4F6E8C"} {...LINE} /><path d={`M${x + 10} ${y} L${x + 20} ${y - 26} L${x + 30} ${y}`} fill="#F3EFE6" {...LINE} /></g>)}
          <Crowd r={r} x0={100} x1={220} y={178} n={6} h={30} women={0.5} />
          <Person r={r} x={260} y={186} child hat="none" /><Person r={r} x={276} y={184} child hat="none" />
          <g transform="translate(30 186)"><circle cx="0" cy="0" r="6" fill="none" {...LINE} /><circle cx="34" cy="0" r="6" fill="none" {...LINE} /><path d="M0 0 L12 -10 L24 0 L34 0 M12 -10 H28 M6 -14 h8 M28 -10 l2 -6 h4" {...LINE} fill="none" /></g>
        </g>
      );
    case "carsea":
    case "carlake": {
      const lake = k === "carlake";
      return (
        <g>
          <Sky id={id} top="#B3D0E0" bottom="#F5EDD9" /><Clouds r={r} />
          {lake && <path d="M0 110 L60 50 L110 92 L170 40 L240 96 L290 60 L320 80 V118 H0 Z" fill="#9AA6A8" {...LINE} />}
          {lake && <path d="M160 46 l10 -6 l10 8 Z" fill="#F4F3EE" />}
          <Sea y={lake ? 112 : 104} c={lake ? "#7FA6B0" : "#7DAAC0"} />
          <path d="M0 150 C100 132 220 140 320 130 V200 H0 Z" fill={lake ? "#A9A06A" : "#C9B88C"} />
          <Pine x={30} y={152} h={70} /><Pine x={56} y={150} h={56} />
          {lake ? <><Olive x={290} y={150} s={1.2} /><Olive x={262} y={146} /></> : <RoundTree x={290} y={148} c="#6F8C5E" />}
          <Car x={110} y={170} c={lake ? "#A9C6D6" : "#F1EEE6"} beetle={lake} />
          <Person r={r} x={196} y={176} h={32} hat="none" /><Person r={r} x={212} y={176} h={30} skirt hat="bun" />
          {!lake && <Person r={r} x={228} y={178} child hat="none" />}
          <rect x="236" y="170" width="18" height="8" fill="#B5453A" {...LINE} /><path d="M80 186 h30" stroke="#E9E1CF" strokeWidth="4" />
        </g>
      );
    }
    case "celebration":
    case "wallnight": {
      const wall = k === "wallnight";
      return (
        <g>
          <rect width="320" height="200" fill="#2A3240" />
          <g fill="#F2D58A">{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={r() * 320} cy={r() * 90} r={0.5 + r() * 0.8} opacity=".8" />)}</g>
          {!wall && Array.from({ length: 4 }, (_, i) => { const x = 40 + r() * 240, y = 30 + r() * 40; return <g key={i} stroke={pick(r, ["#F2D58A", "#E07A5F", "#9CC3D5"])} strokeWidth="1.2">{Array.from({ length: 10 }, (_, j) => <path key={j} d={`M${x} ${y} l${Math.cos(j) * 14} ${Math.sin(j) * 14}`} />)}</g>; })}
          {wall ? <>
            <rect x="0" y="110" width="320" height="40" fill="#B9B4AA" {...LINE} />
            {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 34} 110 v40`} stroke="#8F8A80" strokeWidth=".8" />)}
            <Crowd r={r} x0={20} x1={300} y={110} n={14} h={26} women={0.4} />
            <path d="M0 150 H320 V200 H0 Z" fill="#454C58" />
            <Crowd r={r} x0={10} x1={310} y={192} n={16} h={32} women={0.4} />
            <g fill="#FFF3C4" opacity=".7">{[60, 180, 260].map((x) => <path key={x} d={`M${x} 60 L${x - 30} 150 H${x + 30} Z`} opacity=".25" />)}</g>
          </> : <>
            <rect x="0" y="80" width="80" height="80" fill="#3A4252" {...LINE} /><rect x="240" y="70" width="80" height="90" fill="#3A4252" {...LINE} />
            {Array.from({ length: 8 }, (_, i) => <Window key={i} x={(i < 4 ? 10 : 250) + (i % 2) * 34} y={90 + Math.floor((i % 4) / 2) * 30} w={14} h={16} lit />)}
            <path d="M0 160 H320 V200 H0 Z" fill="#4A4F57" />
            <Crowd r={r} x0={10} x1={310} y={194} n={18} h={34} women={0.45} />
            {Array.from({ length: 5 }, (_, i) => { const x = 30 + i * 62 + r() * 10; return <g key={i}><path d={`M${x} 166 V140`} stroke={INK} strokeWidth="1" /><rect x={x} y={140} width="8" height="10" fill="#2D4E9A" /><rect x={x + 8} y={140} width="8" height="10" fill="#F3EFE6" /><rect x={x + 16} y={140} width="8" height="10" fill="#C0392B" /></g>; })}
          </>}
        </g>
      );
    }
    case "letters":
      return (
        <g>
          <rect width="320" height="200" fill="#E9DDC4" />
          <rect x="230" y="10" width="70" height="80" fill="#C9D6DC" {...LINE} /><path d="M265 10 v80 M230 50 h70" stroke={INK} strokeWidth="1.2" />
          <rect y="110" width="320" height="90" fill="#9C7650" />
          <g stroke="#7C5A3C" strokeWidth=".6">{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0 ${120 + i * 14} H320`} />)}</g>
          {[[70, 132, -8], [110, 140, 6], [150, 128, -3]].map(([x, y, a], i) => (
            <g key={i} transform={`rotate(${a} ${x} ${y})`}><rect x={x - 40} y={y - 24} width="80" height="52" fill={i === 1 ? "#F2EBDC" : "#EDE2C8"} {...LINE} />{Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${x - 32} ${y - 14 + j * 7} h${50 + (j % 3) * 6}`} stroke="#5A6A8A" strokeWidth=".7" opacity=".7" />)}</g>
          ))}
          <path d="M40 150 C80 160 140 160 180 150" stroke="#A5483A" strokeWidth="3" fill="none" />
          <g transform="translate(220 150) rotate(-6)"><rect x="-22" y="-28" width="44" height="56" fill="#F3EFE6" {...LINE} /><rect x="-18" y="-24" width="36" height="40" fill="#A99C88" /><circle cx="0" cy="-10" r="7" fill="#8A7B68" /><path d="M-12 14 C-10 2 10 2 12 14 Z" fill="#8A7B68" /></g>
          <g transform="translate(270 168)"><circle r="12" fill="#D9C27A" {...LINE} /><circle r="9" fill="#F3EFE6" {...LINE} /><path d="M0 0 V-6 M0 0 L4 2" stroke={INK} strokeWidth=".8" /><path d="M0 -12 V-18" stroke={INK} strokeWidth="1.5" /></g>
          <g transform="translate(100 182)" fill="none" {...LINE}><circle cx="-8" cy="0" r="6" /><circle cx="8" cy="0" r="6" /><path d="M-2 0 h4" /></g>
        </g>
      );
    case "orchard":
    case "lemons": {
      const lemon = k === "lemons";
      return (
        <g>
          <Sky id={id} top={lemon ? "#B8D4E2" : "#C3D6DF"} bottom="#F6EEDA" /><Birds r={r} />
          {lemon ? <Sea y={92} c="#7FA9C0" /> : null}
          {lemon && <path d="M220 92 C240 60 270 50 300 70 L320 92 Z" fill="#9A9AA0" opacity=".7" />}
          {[0, 1, 2].map((t) => (
            <g key={t}>
              <path d={`M0 ${120 + t * 28} C100 ${112 + t * 28} 220 ${118 + t * 28} 320 ${110 + t * 28} V200 H0 Z`} fill={lemon ? ["#A99C6E", "#9C8F62", "#8F8358"][t] : ["#BFA978", "#B39C6C", "#A68F62"][t]} {...LINE} />
              {Array.from({ length: 6 }, (_, i) => lemon
                ? <RoundTree key={i} x={20 + i * 56 + t * 10} y={124 + t * 28} s={0.7 + t * 0.12} c="#5E7A44" fruit="#E8C33A" />
                : <Olive key={i} x={24 + i * 56 + t * 12} y={124 + t * 28} s={0.75 + t * 0.15} />)}
            </g>
          ))}
          {!lemon && <path d="M220 60 L240 40 L260 50 L280 36 L300 48 V70 H220 Z" fill="#F3EFE6" {...LINE} />}
          <Person r={r} x={70} y={190} h={34} hat="hat" />
          <Person r={r} x={140} y={192} h={32} skirt hat="scarf" carry />
          {!lemon && <><path d="M76 160 L66 190" stroke="#6E5238" strokeWidth="1.6" /><path d="M150 196 C170 190 200 190 220 196" stroke="#E9E1CF" strokeWidth="6" /></>}
          <g transform="translate(240 192)"><ellipse cx="0" cy="-10" rx="14" ry="8" fill="#8C7A68" {...LINE} /><path d="M10 -14 C16 -22 22 -20 22 -14" fill="#8C7A68" {...LINE} /><path d="M-8 -4 V4 M8 -4 V4" {...LINE} /><rect x="-8" y="-22" width="16" height="8" fill={lemon ? "#E8C33A" : "#6E7A4A"} {...LINE} /></g>
        </g>
      );
    }
    case "fair":
      return (
        <g>
          <rect width="320" height="200" fill="#36405A" />
          <g fill="#F2D58A">{Array.from({ length: 20 }, (_, i) => <circle key={i} cx={r() * 320} cy={r() * 60} r=".7" />)}</g>
          {[[0, 70, 90], [230, 60, 90]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height={90} fill="#E9E1CF" {...LINE} /><Window x={x + 14} y={y + 20} lit /><Window x={x + 54} y={y + 20} lit /></g>)}
          {[30, 70, 110].map((y, j) => <path key={y} d={`M0 ${y} Q160 ${y + 30} 320 ${y}`} stroke="#3B2F25" strokeWidth=".6" fill="none" />)}
          {[30, 70, 110].flatMap((y, j) => Array.from({ length: 9 }, (_, i) => <circle key={`${j}-${i}`} cx={20 + i * 35} cy={y + 30 * (1 - Math.pow((20 + i * 35 - 160) / 160, 2)) * 0.9} r="5" fill={pick(r, ["#F2C14E", "#E07A5F", "#F3EFE6"])} {...LINE} />))}
          <rect y="160" width="320" height="40" fill="#B6A27E" />
          <Crowd r={r} x0={20} x1={300} y={190} n={12} h={32} women={0.55} />
          <g transform="translate(160 188)"><Person r={r} x={0} y={0} h={34} hat="hat" coat="#2E2B2A" /><ellipse cx="9" cy="-16" rx="6" ry="4" fill="#B57A45" {...LINE} /></g>
        </g>
      );
    case "stadium":
      return (
        <g>
          <Sky id={id} top="#9DC4E0" bottom="#F4EBD5" /><Clouds r={r} />
          <path d="M20 150 C40 70 280 70 300 150 Z" fill="#D9D3C6" {...LINE} />
          <path d="M40 150 C60 92 260 92 280 150 Z" fill="#B8C2C8" {...LINE} />
          {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${50 + i * 4} ${140 - i * 10} C${80 + i * 4} ${100 - i * 4} ${240 - i * 4} ${100 - i * 4} ${270 - i * 4} ${140 - i * 10}`} stroke="#8F9AA2" strokeWidth=".6" fill="none" />)}
          <path d="M160 72 V40" stroke={INK} strokeWidth="1" /><path d="M150 40 C156 30 164 30 170 40 Z" fill="#E07A5F" {...LINE} />
          <rect y="150" width="320" height="50" fill="#C9B88C" />
          <Crowd r={r} x0={10} x1={310} y={188} n={13} h={32} women={0.5} />
          {Array.from({ length: 4 }, (_, i) => { const x = 40 + i * 76; return <g key={i}><path d={`M${x} 166 V146`} stroke={INK} strokeWidth="1" /><rect x={x} y={146} width="20" height="12" fill={pick(r, ["#C0392B", "#F2C14E", "#2D4E9A", "#3E8E5E"])} {...LINE} /></g>; })}
        </g>
      );
    case "moving":
      return (
        <g>
          <Sky id={id} top="#C9D2D8" bottom="#EEE8DC" />
          <Brick x={20} y={150} w={200} h={110} c="#9C5A44" cols={6} rows={3} />
          <rect x="100" y="110" width="30" height="40" fill="#3E4A42" {...LINE} />
          <g {...LINE} fill="none" strokeWidth="1.4"><path d="M270 150 V40 L300 46 M270 50 L298 52 M296 52 V80" /></g>
          <rect y="150" width="320" height="50" fill="#9C9486" />
          {[[150, 176], [168, 176], [159, 162]].map(([x, y], i) => <rect key={i} x={x} y={y} width="18" height="14" fill="#C7A06A" {...LINE} />)}
          <Person r={r} x={80} y={186} h={32} hat="none" carry /><Person r={r} x={210} y={186} h={30} skirt hat="bun" carry />
          <g transform="translate(240 188)" fill="none" {...LINE}><circle cx="0" cy="-6" r="6" /><circle cx="24" cy="-6" r="6" /><path d="M0 -6 L8 -16 L18 -16 L24 -6 M8 -16 L6 -20 M18 -16 l2 -4 h4" /></g>
        </g>
      );
    case "room":
      return (
        <g>
          <Interior id={id} wall="#EFE4CC" floor="#B08B62" />
          <rect x="190" y="30" width="80" height="100" fill="#CFE0E8" {...LINE} /><path d="M230 30 v100 M190 80 h80" stroke={INK} strokeWidth="1.2" />
          <rect width="320" height="200" fill="#FFF3CF" opacity=".15" />
          <path d="M0 0 H140 V150 H0 Z" fill="#E6D2B0" opacity=".5" />
          <g transform="translate(60 150)"><path d="M0 0 L16 -80 M40 0 L24 -80 M8 -40 H32 M4 -20 H36 M12 -60 H28" stroke="#7C5A3C" strokeWidth="2.2" fill="none" /></g>
          <Person r={r} x={112} y={190} h={84} hat="none" coat="#E9E1CF" /><path d="M126 128 L146 76" stroke="#7C5A3C" strokeWidth="3" /><rect x="141" y="64" width="12" height="14" fill="#E1C9A0" {...LINE} />
          <Person r={r} x={250} y={192} h={80} skirt hat="bun" coat="#C9A444" />
          <rect x="140" y="178" width="70" height="8" fill="#E9E1CF" {...LINE} />
          <Person r={r} x={186} y={194} h={70} child hat="none" />
          <rect x="268" y="160" width="14" height="16" fill="#8F9A9F" {...LINE} />
        </g>
      );
    case "kitchen":
      return (
        <g>
          <Interior id={id} wall="#E6D6B8" floor="#9C7B55" night />
          <rect x="40" y="26" width="70" height="70" fill="#3E4A5A" {...LINE} /><path d="M75 26 v70 M40 61 h70" stroke={INK} strokeWidth="1.2" /><circle cx="94" cy="44" r="6" fill="#F3EEE2" />
          <path d="M210 0 V30" stroke={INK} strokeWidth=".8" /><path d="M192 44 C192 28 228 28 228 44 Z" fill="#C9A444" {...LINE} />
          <Person r={r} x={100} y={176} h={96} hat="none" coat="#5E6F8C" />
          <Person r={r} x={160} y={170} h={90} child hat="none" coat="#C0392B" />
          <Person r={r} x={206} y={172} h={84} child skirt hat="bun" coat="#3E8E5E" />
          <path d="M40 130 H280 L292 150 H28 Z" fill="#9C7650" {...LINE} /><path d="M44 150 V196 M276 150 V196" stroke="#6E5238" strokeWidth="5" />
          <g transform="translate(150 134)"><rect x="-26" y="-6" width="52" height="10" fill="#7C4F3E" {...LINE} /><rect x="-22" y="-4" width="20" height="7" fill="#E9DCC0" {...LINE} /><rect x="2" y="-4" width="20" height="7" fill="#D9C7A0" {...LINE} /></g>
          <rect x="236" y="122" width="10" height="16" rx="2" fill="#2E2B2A" /><rect x="238" y="124" width="6" height="11" fill="#9CC3D5" />
          <ellipse cx="88" cy="128" rx="12" ry="3" fill="#E9E1CF" {...LINE} /><path d="M80 126 C82 120 94 120 96 126 Z" fill="#C58E55" />
          <path d="M240 126 h8 v6 h-8 z" fill="#F3EFE6" {...LINE} />
        </g>
      );
    case "portrait": {
      // a studio card of the family: drawn portraits in oval frames, like an old family montage
      const y0 = 1912;
      const who: { x: number; y: number; s: number; g: "m" | "f"; b: number }[] = [
        { x: 112, y: 56, s: 0.78, g: "m", b: y0 - 38 }, { x: 208, y: 56, s: 0.78, g: "f", b: y0 - 34 },
        { x: 78, y: 140, s: 0.56, g: "m", b: y0 - 12 }, { x: 160, y: 146, s: 0.56, g: "f", b: y0 - 7 }, { x: 242, y: 140, s: 0.56, g: "m", b: y0 - 4 },
      ];
      return (
        <g>
          <defs><radialGradient id={`${id}-bg`} cx=".5" cy=".45" r=".7"><stop offset="0" stopColor="#E9DEC6" /><stop offset="1" stopColor="#B9A684" /></radialGradient></defs>
          <rect width="320" height="200" fill={`url(#${id}-bg)`} />
          <rect x="10" y="8" width="300" height="184" fill="none" stroke="#8C7350" strokeWidth="1.2" />
          <rect x="16" y="14" width="288" height="172" fill="none" stroke="#8C7350" strokeWidth=".6" />
          <path d="M160 18 c-14 0 -20 8 -32 8 M160 18 c14 0 20 8 32 8" stroke="#8C7350" strokeWidth=".8" fill="none" />
          {who.map((w, i) => (
            <g key={i} transform={`translate(${w.x} ${w.y})`}>
              <ellipse cx="0" cy="0" rx={46 * w.s + 5} ry={56 * w.s + 5} fill="#7C5E3E" />
              <ellipse cx="0" cy="0" rx={46 * w.s + 2} ry={56 * w.s + 2} fill="#D9C79F" />
              <g transform={`translate(${-50 * w.s * 1.04} ${-50 * w.s * 1.04}) scale(${w.s * 1.04})`}>
                <Face p={{ id: `${id}-p${i}-${r().toFixed(4)}`, firstName: w.g === "f" ? "Anna" : "Ivan", gender: w.g, birthYear: w.b }} now={y0} clipId={`${id}-f${i}`} />
              </g>
            </g>
          ))}
        </g>
      );
    }
    case "dish":
      return (
        <g>
          <rect width="320" height="200" fill="#E9DCC0" />
          <rect x="230" y="0" width="90" height="90" fill="#CFE0E8" {...LINE} /><path d="M275 0 v90 M230 45 h90" stroke={INK} strokeWidth="1.2" />
          <rect y="110" width="320" height="90" fill="#9C7650" />
          <path d="M20 120 H300 L310 200 H10 Z" fill="#F1E8D6" opacity=".9" {...LINE} />
          <g stroke="#B5453A" strokeWidth="1" opacity=".5">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${30 + i * 36} 122 l-4 78`} />)}</g>
          <ellipse cx="130" cy="156" rx="76" ry="22" fill="#F3EFE6" {...LINE} />
          <ellipse cx="130" cy="150" rx="62" ry="16" fill="#C58E55" {...LINE} />
          <g stroke="#8C5A30" strokeWidth="1.6" fill="none">{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${82 + i * 22} 140 l12 18`} />)}{Array.from({ length: 5 }, (_, i) => <path key={`b${i}`} d={`M${86 + i * 22} 158 l12 -18`} />)}</g>
          <g transform="translate(240 150)"><path d="M-12 -24 h24 l-3 30 h-18 z" fill="#E9F0F2" opacity=".8" {...LINE} /><rect x="-10" y="-14" width="20" height="18" fill="#B5652A" opacity=".7" /><path d="M12 -20 c8 0 8 12 0 12" fill="none" {...LINE} /></g>
          <g transform="translate(60 182) rotate(-8)"><rect x="-30" y="-12" width="60" height="22" fill="#E2D2A8" {...LINE} />{Array.from({ length: 3 }, (_, i) => <path key={i} d={`M-24 ${-6 + i * 6} h${40 + i * 4}`} stroke="#5A6A8A" strokeWidth=".7" />)}</g>
          <path d="M190 182 l40 -6" stroke="#8C8C8C" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
  }
}

/** The illustration, 16:10, with a watercolour-and-pencil finish. */
export default function BookArt({ scene, year, seed, title }: { scene: BookScene; year: number; seed: string; title?: string }) {
  const r = rng(seed + scene);
  const id = `ba-${seed.replace(/[^a-zA-Z0-9]/g, "").slice(-14)}`;
  const old = year < 1945, mid = year >= 1945 && year < 1975;
  const sat = old ? 0.5 : mid ? 0.7 : 0.95;
  return (
    <svg viewBox="0 0 320 200" width="100%" role="img" aria-label={title} preserveAspectRatio="xMidYMid slice" style={{ display: "block", aspectRatio: "16 / 10", height: "auto" }}>
      <defs>
        {/* a pencil wobble and soft colour, like ink and watercolour on paper */}
        <filter id={`${id}-wc`} x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={Math.floor(r() * 50)} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="d" type="saturate" values={String(sat)} />
        </filter>
        <filter id={`${id}-paper`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 .42  0 0 0 0 .33  0 0 0 0 .22  0 0 0 .22 0" />
        </filter>
        <radialGradient id={`${id}-vig`} cx=".5" cy=".5" r=".75"><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#4A3A26" stopOpacity={old ? 0.35 : 0.2} /></radialGradient>
      </defs>
      <g filter={`url(#${id}-wc)`}><g transform="translate(-5 -4) scale(1.032)"><Scene k={scene} r={r} id={id} /></g></g>
      {old && <rect width="320" height="200" fill="#9A7448" opacity=".22" style={{ mixBlendMode: "multiply" }} />}
      {mid && <rect width="320" height="200" fill="#C9A86A" opacity=".12" style={{ mixBlendMode: "multiply" }} />}
      <rect width="320" height="200" filter={`url(#${id}-paper)`} />
      <rect width="320" height="200" fill={`url(#${id}-vig)`} />
    </svg>
  );
}
