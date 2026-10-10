/**
 * A drawn "old photograph" for a story that has no photo yet: a vintage scene chosen
 * from the story's words (a river and a steamboat, a pier, a house, a school, a village,
 * a city street, a field of birches). Seeded, so a story always gets the same picture.
 * Pure SVG: works on the server, in cards, on the story page and in print.
 */

export type Scene = "river" | "pier" | "house" | "school" | "village" | "city" | "field";

const RULES: [Scene, RegExp][] = [
  ["pier", /пристан|набережн|познаком|свидан|свадьб|любов|влюб|pier|wedding|met |love|hochzeit|kennengelernt|mariage|rencontr|matrimonio|innamor|boda|enamor/i],
  ["river", /волг|река|реке|реки|пароход|судн|корабл|капитан|матрос|мор[еяю]|флот|лодк|river|ship|boat|sea|captain|sailor|fluss|schiff|meer|fleuve|bateau|navire|fiume|nave|barca|río|barco/i],
  ["school", /школ|учител|класс|урок|институт|университет|учил|school|teacher|class|lesson|schule|lehrer|école|professeur|scuola|maestr|escuela|maestr/i],
  ["village", /деревн|(?<![\p{L}])сел[оае](?![\p{L}])|огород|(?<![\p{L}])сад|дач[аеиу]|колхоз|урожай|сено|коров|хутор|землянк|масло|пашн|village|farm|garden|harvest|dorf|bauernhof|garten|ferme|jardin|fattoria|giardino|granja|huerto/iu],
  ["city", /город|москв|улиц|трамва|метро|завод|шахт|площад|вокзал|общежит|city|street|tram|factory|stadt|straße|ville|rue|città|strada|ciudad|calle/i],
  ["house", /дом|изб|квартир|двор|крыльц|печ[ьи]|house|home|yard|haus|wohnung|maison|casa|cortile|patio/i],
];

export function sceneFor(text: string): Scene {
  for (const [s, re] of RULES) if (re.test(text)) return s;
  return "field";
}

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}

const INK = "#4E3E2C", MID = "#7A6548", SOFT = "#A08A68", PALE = "#C9B48F", LIGHT = "#E6D7B8", SKY = "#EADFC6";

function Birds({ r }: { r: () => number }) {
  const n = 2 + Math.floor(r() * 3);
  return <g fill="none" stroke={MID} strokeWidth="1.2" strokeLinecap="round">{Array.from({ length: n }, (_, i) => {
    const x = 40 + r() * 200, y = 22 + r() * 40, s = 4 + r() * 3;
    return <path key={i} d={`M${x - s} ${y} q${s / 2} -${s / 2} ${s} 0 q${s / 2} -${s / 2} ${s} 0`} />;
  })}</g>;
}

function Birch({ x, h, lean = 0 }: { x: number; h: number; lean?: number }) {
  return (
    <g>
      <path d={`M${x} 200 C${x + lean / 2} ${200 - h / 2} ${x + lean} ${200 - h * .8} ${x + lean} ${200 - h}`} stroke="#EDE4D0" strokeWidth="5" fill="none" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x + lean * (i / 7) - 2} ${196 - i * h / 7} h4`} stroke={INK} strokeWidth="1.4" />)}
      <g fill={SOFT} opacity=".75">{Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={x + lean + (i % 3 - 1) * 12} cy={200 - h + 6 + Math.floor(i / 3) * 12} rx="14" ry="10" />)}</g>
    </g>
  );
}

function SceneBody({ scene, r }: { scene: Scene; r: () => number }) {
  const sunX = 60 + r() * 200;
  switch (scene) {
    case "river":
      return (
        <g>
          <circle cx={sunX} cy="48" r="18" fill="#F3EAD6" />
          <path d="M0 112 C40 96 70 102 110 108 C150 92 200 96 240 106 C270 98 300 100 320 106 V122 H0 Z" fill={PALE} />
          <rect y="120" width="320" height="80" fill="#D2C19F" />
          <g transform={`translate(${70 + r() * 60} 0)`}>
            <path d="M8 132 H176 L160 152 H26 Z" fill={INK} />
            <rect x="34" y="112" width="120" height="20" fill={MID} />
            <rect x="58" y="96" width="70" height="16" fill={SOFT} />
            {Array.from({ length: 8 }, (_, i) => <rect key={i} x={40 + i * 14} y="118" width="8" height="7" fill={LIGHT} />)}
            <rect x="108" y="66" width="10" height="30" fill={INK} />
            <path d="M113 64 C118 50 130 44 142 38 C156 30 170 30 182 22" stroke={PALE} strokeWidth="8" strokeLinecap="round" fill="none" opacity=".8" />
            <circle cx="30" cy="140" r="12" fill="none" stroke={LIGHT} strokeWidth="2" />
          </g>
          <g stroke={SOFT} strokeWidth="1.5" fill="none">{[160, 172, 186].map((y) => <path key={y} d={`M0 ${y} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} />)}</g>
          <g stroke={MID} strokeWidth="2">{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${4 + i * 6} 200 q${2 - (i % 3)} -${18 + (i % 4) * 6} ${4 - (i % 2) * 6} -${28 + (i % 3) * 8}`} fill="none" />)}</g>
        </g>
      );
    case "pier":
      return (
        <g>
          <circle cx={240} cy="78" r="22" fill="#F3EAD6" />
          <rect y="104" width="320" height="96" fill="#D2C19F" />
          <path d="M0 104 H320" stroke={PALE} strokeWidth="2" />
          <g stroke="#E8DCC2" strokeWidth="2" opacity=".8">{[120, 132, 148].map((y, i) => <path key={y} d={`M${200 + i * 6} ${y} h${60 - i * 10}`} />)}</g>
          <path d="M0 150 L230 136 L320 140 V200 H0 Z" fill={MID} />
          <path d="M0 150 L230 136" stroke={INK} strokeWidth="2" />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${14 + i * 26} ${149 - i * 1.5} v-18`} stroke={INK} strokeWidth="2" />)}
          <path d="M10 132 L236 118" stroke={INK} strokeWidth="2" />
          <g fill={INK}>
            <circle cx="112" cy="104" r="9" /><path d="M100 140 C100 120 104 112 112 112 C120 112 124 120 124 140 Z" />
            <path d="M104 100 C106 92 118 92 120 100 Z" />
            <circle cx="140" cy="102" r="10" /><path d="M126 140 C126 118 132 112 140 112 C148 112 154 118 154 140 Z" />
            <path d="M129 98 h22 v-4 c-2 -6 -18 -6 -20 0 Z" />
          </g>
          <path d="M276 140 V60 M270 60 h12 v10 h-12 z" stroke={INK} strokeWidth="2" fill={LIGHT} />
        </g>
      );
    case "house":
      return (
        <g>
          <circle cx={sunX} cy="40" r="14" fill="#F3EAD6" />
          <path d="M0 150 C80 140 160 146 320 138 V200 H0 Z" fill={PALE} />
          <g transform="translate(96 0)">
            <path d="M0 96 L64 50 L128 96 Z" fill={INK} />
            <path d="M8 96 H120 V160 H8 Z" fill={MID} />
            {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M8 ${104 + i * 10} H120`} stroke={INK} strokeWidth="1" opacity=".5" />)}
            <rect x="26" y="110" width="22" height="24" fill={LIGHT} stroke={INK} strokeWidth="2" /><path d="M37 110 v24 M26 122 h22" stroke={INK} strokeWidth="1.4" />
            <rect x="80" y="110" width="22" height="24" fill={LIGHT} stroke={INK} strokeWidth="2" /><path d="M91 110 v24 M80 122 h22" stroke={INK} strokeWidth="1.4" />
            <path d="M22 108 l15 -8 l15 8 M76 108 l15 -8 l15 8" stroke={SOFT} strokeWidth="2" fill="none" />
            <circle cx="64" cy="78" r="7" fill={LIGHT} stroke={INK} strokeWidth="1.5" />
            <rect x="96" y="58" width="9" height="20" fill={INK} />
            <path d="M100 56 C104 44 114 40 120 30 C126 22 134 20 142 14" stroke={PALE} strokeWidth="6" fill="none" strokeLinecap="round" opacity=".8" />
          </g>
          <g stroke={INK} strokeWidth="2">{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${6 + i * 10} 176 v-20`} />)}<path d="M0 162 H160 M0 170 H160" /></g>
          <Birch x={270} h={130} lean={-6} />
        </g>
      );
    case "school":
      return (
        <g>
          <path d="M0 160 H320 V200 H0 Z" fill={PALE} />
          <rect x="56" y="62" width="208" height="98" fill={MID} />
          <path d="M48 62 H272 L262 50 H58 Z" fill={INK} />
          {Array.from({ length: 2 }, (_, row) => Array.from({ length: 7 }, (_, i) => <rect key={`${row}-${i}`} x={70 + i * 28} y={74 + row * 36} width="16" height="22" fill={LIGHT} stroke={INK} strokeWidth="1.5" />))}
          <rect x="146" y="128" width="28" height="32" fill={INK} />
          <path d="M136 160 h48 v6 h-48 z" fill={SOFT} />
          <g fill={INK}>{[90, 112, 214, 236].map((x, i) => <g key={x}><circle cx={x} cy={i % 2 ? 160 : 158} r="5" /><path d={`M${x - 5} ${180} v-14 q5 -4 10 0 v14 z`} /><rect x={x + 5} y="168" width="6" height="7" fill={SOFT} /></g>)}</g>
          <Birch x={22} h={150} lean={4} />
          <Birch x={300} h={140} lean={-4} />
        </g>
      );
    case "village":
      return (
        <g>
          <circle cx={sunX} cy="44" r="16" fill="#F3EAD6" />
          <path d="M0 116 C60 106 120 112 180 104 C240 98 280 104 320 102 V200 H0 Z" fill="#D2C19F" />
          <g stroke={SOFT} strokeWidth="1.6">{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-40 + i * 50} 200 L${120 + i * 14} 116`} />)}</g>
          {[[200, 128, 1], [244, 122, .8], [276, 126, .7]].map(([x, y, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><path d="M-22 22 C-22 -6 22 -6 22 22 Z" fill={MID} /><path d="M-18 8 Q0 2 18 8" stroke={INK} strokeWidth="1" fill="none" /></g>)}
          <g><path d="M70 200 V138" stroke={INK} strokeWidth="6" /><g fill={MID}><circle cx="70" cy="120" r="26" /><circle cx="50" cy="132" r="18" /><circle cx="90" cy="132" r="18" /></g><g fill="#B98A62">{[[62, 116], [80, 126], [56, 134], [86, 112]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" />)}</g></g>
          <g stroke={INK} strokeWidth="2">{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${140 + i * 18} 200 l4 -26`} />)}<path d="M136 186 L320 176" /></g>
        </g>
      );
    case "city":
      return (
        <g>
          <rect x="0" y="40" width="70" height="130" fill={MID} /><rect x="70" y="64" width="60" height="106" fill={SOFT} />
          <rect x="190" y="52" width="66" height="118" fill={SOFT} /><rect x="256" y="30" width="64" height="140" fill={MID} />
          {[[0, 70], [70, 60], [190, 66], [256, 64]].flatMap(([bx, w], b) => Array.from({ length: 8 }, (_, i) => <rect key={`${b}-${i}`} x={bx + 10 + (i % 2) * (w / 2)} y={60 + Math.floor(i / 2) * 26 + (b % 2) * 6} width="12" height="14" fill={LIGHT} opacity=".9" />))}
          <path d="M0 170 H320 V200 H0 Z" fill={PALE} />
          <path d="M0 186 H320 M0 192 H320" stroke={INK} strokeWidth="1.5" />
          <g transform="translate(118 132)"><rect width="96" height="44" rx="8" fill={INK} />{Array.from({ length: 5 }, (_, i) => <rect key={i} x={8 + i * 17} y="8" width="12" height="14" fill={LIGHT} />)}<path d="M48 0 L56 -24 M40 -24 H72" stroke={INK} strokeWidth="2" /></g>
          <path d="M0 108 H320" stroke={INK} strokeWidth="1" opacity=".6" />
          {[30, 290].map((x) => <g key={x}><path d={`M${x} 172 V118`} stroke={INK} strokeWidth="2.5" /><path d={`M${x - 6} 118 h12 l-3 -8 h-6 z`} fill={INK} /></g>)}
        </g>
      );
    default:
      return (
        <g>
          <circle cx={sunX} cy="50" r="16" fill="#F3EAD6" />
          <path d="M0 132 C60 116 120 124 170 118 C230 110 280 118 320 114 V200 H0 Z" fill="#D2C19F" />
          <path d="M150 200 C160 170 172 146 186 120" stroke={LIGHT} strokeWidth="16" fill="none" />
          <Birch x={46} h={150} lean={6} /><Birch x={80} h={120} lean={-4} /><Birch x={268} h={140} lean={-8} />
          <g fill={SOFT}>{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={10 + i * 18} cy={186 + (i % 3) * 4} r="2" />)}</g>
        </g>
      );
  }
}

/** The picture itself (an <svg>), 16:10. */
export default function StoryArt({ seed, text, scene, title, idSuffix = "" }: { seed: string; text?: string; scene?: Scene; title?: string; idSuffix?: string }) {
  const s = scene ?? sceneFor(text ?? "");
  const r = rng(seed + s);
  const id = `sa-${seed.replace(/[^a-zA-Z0-9]/g, "").slice(-12)}${idSuffix}`;
  return (
    <svg viewBox="0 0 320 200" width="100%" role="img" aria-label={title} style={{ display: "block", aspectRatio: "16 / 10", height: "auto" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#E3D5B7" /><stop offset="1" stopColor={SKY} /></linearGradient>
        <radialGradient id={`${id}-vig`} cx=".5" cy=".5" r=".75"><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#3A2A18" stopOpacity=".38" /></radialGradient>
        <pattern id={`${id}-grain`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#5A4630" opacity=".16" /><circle cx="4" cy="4" r=".5" fill="#5A4630" opacity=".12" /></pattern>
      </defs>
      <rect width="320" height="200" fill={`url(#${id}-sky)`} />
      {s !== "city" && <Birds r={r} />}
      <SceneBody scene={s} r={r} />
      <rect width="320" height="200" fill="#8A6A3E" opacity=".1" />
      <rect width="320" height="200" fill={`url(#${id}-grain)`} />
      <rect width="320" height="200" fill={`url(#${id}-vig)`} />
    </svg>
  );
}

/** The picture as a taped photograph with a handwritten caption. */
export function StoryPhoto({ seed, text, caption, tilt = -2, idSuffix }: { seed: string; text: string; caption?: string; tilt?: number; idSuffix?: string }) {
  return (
    <figure className="story-photo" style={{ transform: `rotate(${tilt}deg)` }}>
      <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
      <StoryArt seed={seed} text={text} title={caption} idSuffix={idSuffix} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export const SCENES: Scene[] = ["river", "pier", "house", "school", "village", "city", "field"];

type CoverPhoto = { id: string; path: string; caption?: string | null };
type Resolved = { photo: CoverPhoto; scene?: undefined } | { photo?: undefined; scene: Scene; auto: boolean };

/** What a story shows as its picture: the chosen photo or drawing, else its first photo, else a drawing from its words. */
export function resolveCover(cover: string | null | undefined, photos: CoverPhoto[], text: string): Resolved {
  if (cover?.startsWith("photo:")) { const p = photos.find((x) => x.id === cover.slice(6)); if (p) return { photo: p }; }
  if (cover?.startsWith("scene:") && (SCENES as string[]).includes(cover.slice(6))) return { scene: cover.slice(6) as Scene, auto: false };
  if (photos[0]) return { photo: photos[0] };
  return { scene: sceneFor(text), auto: true };
}

/** The story's picture: in a card (`card`) or as a taped photograph (`photo`). */
export function StoryCover({ seed, text, cover, photos, variant = "card", tilt = -2, idSuffix }: {
  seed: string; text: string; cover?: string | null; photos: CoverPhoto[]; variant?: "card" | "photo"; tilt?: number; idSuffix?: string;
}) {
  const r = resolveCover(cover, photos, text);
  const pic = r.photo
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={`/api/files/${r.photo.path}`} alt={r.photo.caption ?? ""} loading="lazy" width={320} height={200} style={{ display: "block", width: "100%", height: "auto", aspectRatio: "16 / 10", objectFit: "cover" }} />
    : <StoryArt seed={seed} scene={r.scene} idSuffix={idSuffix} />;
  if (variant === "card") return pic;
  return (
    <figure className="story-photo" style={{ transform: `rotate(${tilt}deg)` }}>
      <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
      {pic}
    </figure>
  );
}
