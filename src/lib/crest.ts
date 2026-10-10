/**
 * Family-line emblems ("crests") per surname: shield shape, field division, heraldic colours,
 * one symbol and a motto. These are artistic family emblems, not historical coats of arms.
 * Pure data + helpers, safe for both server and client components.
 */

export const SHAPES = {
  heater: "M6 6 H94 V52 C94 86 70 106 50 116 C30 106 6 86 6 52 Z",
  french: "M6 6 H94 V90 Q94 100 84 102 L60 106 Q50 108 50 116 Q50 108 40 106 L16 102 Q6 100 6 90 Z",
  swiss: "M6 6 H94 V70 A44 44 0 0 1 6 70 Z",
  oval: "M50 4 C79 4 95 30 95 60 C95 90 79 116 50 116 C21 116 5 90 5 60 C5 30 21 4 50 4 Z",
} as const;
export type Shape = keyof typeof SHAPES;

/** Second-colour area for each division (shield box is 100×120). Empty = plain field. */
export const DIVISIONS = {
  plain: "",
  pale: "M50 0 H100 V120 H50 Z",
  fess: "M0 60 H100 V120 H0 Z",
  bend: "M0 0 L100 120 H100 V0 Z",
  quarterly: "M50 0 H100 V60 H50 Z M0 60 H50 V120 H0 Z",
  chevron: "M0 120 L50 54 L100 120 Z",
} as const;
export type Division = keyof typeof DIVISIONS;

/** Heraldic tinctures. Metals: or, argent. Rule of tincture: put a metal on a colour or the other way round. */
export const TINCTURES = {
  or: { hex: "#D9A82E", metal: true },
  argent: { hex: "#F3F1EA", metal: true },
  gules: { hex: "#B0302F", metal: false },
  azure: { hex: "#2D5DA1", metal: false },
  vert: { hex: "#2E7350", metal: false },
  purpure: { hex: "#6E3F8A", metal: false },
  sable: { hex: "#26282B", metal: false },
} as const;
export type Tincture = keyof typeof TINCTURES;

type Charge = { d: string; stroke?: number };
const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const sun = () => {
  let d = circle(50, 50, 17);
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6, b = a + 0.16, c = a - 0.16;
    const p = (r: number, t: number) => `${(50 + r * Math.cos(t)).toFixed(1)} ${(50 + r * Math.sin(t)).toFixed(1)}`;
    d += ` M${p(23, c)} L${p(40, a)} L${p(23, b)} Z`;
  }
  return d;
};
const wheat = () => {
  let d = "M48 30 h4 v58 h-4 z";
  for (let i = 0; i < 4; i++) {
    const y = 26 + i * 13;
    d += ` M50 ${y + 8} q-14 -2 -16 -14 q12 0 16 14 z M50 ${y + 8} q14 -2 16 -14 q-12 0 -16 14 z`;
  }
  return d + " M50 8 q-6 10 0 20 q6 -10 0 -20 z";
};
const rose = () => {
  let d = "";
  for (let i = 0; i < 5; i++) {
    const t = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    d += circle(+(50 + 18 * Math.cos(t)).toFixed(1), +(50 + 18 * Math.sin(t)).toFixed(1), 15) + " ";
  }
  return d;
};

const circleRev = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 1 ${2 * r} 0 a${r} ${r} 0 1 1 ${-2 * r} 0`;
const gear = () => {
  let d = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, w = 0.2;
    const p = (r: number, t: number) => `${(50 + r * Math.cos(t)).toFixed(1)} ${(50 + r * Math.sin(t)).toFixed(1)}`;
    d += `${i ? "L" : "M"}${p(30, a - 0.39 + w)} L${p(42, a - w)} L${p(42, a + w)} L${p(30, a + 0.39 - w)} `;
  }
  return d + "Z " + circleRev(50, 50, 12);
};
const grapes = () =>
  [[36, 42], [50, 42], [64, 42], [43, 56], [57, 56], [50, 70], [36, 56], [64, 56], [50, 84]].map(([x, y]) => circle(x, y, 8)).join(" ") +
  " M48 14 h4 v22 h-4 z M52 22 q18 -14 32 0 q-16 12 -32 0 z";

export const CHARGES: Record<string, Charge> = {
  tree: { d: `${circle(50, 36, 20)} ${circle(32, 50, 15)} ${circle(68, 50, 15)} M45 52 h10 v36 h-10 z M28 88 h44 v5 h-44 z` },
  wheat: { d: wheat() },
  star: { d: "M50 10 L61 38 L91 38 L67 56 L76 86 L50 68 L24 86 L33 56 L9 38 L39 38 Z" },
  sun: { d: sun() },
  mountain: { d: "M6 82 L34 34 L48 56 L64 24 L94 82 Z" },
  waves: { d: "M10 34 q10 -10 20 0 t20 0 t20 0 t20 0 M10 54 q10 -10 20 0 t20 0 t20 0 t20 0 M10 74 q10 -10 20 0 t20 0 t20 0 t20 0", stroke: 7 },
  anchor: { d: `M50 22 V84 M32 36 H68 M20 60 a30 30 0 0 0 60 0 ${circle(50, 15, 7)}`, stroke: 7 },
  ship: { d: "M10 62 H90 L76 82 H24 Z M48 12 h4 v48 h-4 z M46 16 V56 H20 Z M54 22 V56 H76 Z" },
  book: { d: "M10 26 q20 -9 38 3 v56 q-18 -11 -38 -3 z M90 26 q-20 -9 -38 3 v56 q18 -11 38 -3 z" },
  key: { d: `${circle(30, 50, 13)} M43 50 H90 M78 50 v14 M88 50 v10`, stroke: 7 },
  tower: { d: "M24 90 V40 h9 V28 h9 v12 h16 V28 h9 v12 h9 V90 H58 V68 a8 8 0 0 0 -16 0 V90 Z" },
  rose: { d: rose() + circle(50, 50, 8) },
  music: { d: `${circle(30, 74, 12)} ${circle(70, 66, 12)} M39 74 V22 L82 14 V66 h-3 V24 L42 31 V74 Z` },
  fish: { d: "M12 50 Q40 20 72 50 Q40 80 12 50 Z M70 50 L92 32 V68 Z" },
  horseshoe: { d: "M28 18 V52 a22 22 0 0 0 44 0 V18", stroke: 12 },
  heart: { d: "M50 86 C20 64 8 48 8 32 a20 20 0 0 1 42 -6 a20 20 0 0 1 42 6 C92 48 80 64 50 86 Z" },
  crescent: { d: "M62 12 A38 38 0 1 0 62 88 A44 44 0 0 1 62 12 Z" },
  bird: { d: "M8 56 C22 46 36 44 48 50 C56 30 72 18 94 16 C82 28 74 40 70 52 C80 54 88 60 92 70 C78 66 64 66 54 72 C42 78 28 76 18 66 L6 72 Z" },
  leaf: { d: "M50 6 C78 24 86 54 52 88 L52 96 H48 L48 88 C14 54 22 24 50 6 Z" },
  fir: { d: "M50 6 L70 34 H60 L78 58 H64 L86 84 H14 L36 58 H22 L40 34 H30 Z M45 84 h10 v12 h-10 z" },
  grapes: { d: grapes() },
  feather: { d: "M80 10 C52 20 34 44 28 76 L22 94 L30 92 C42 68 60 46 84 16 Z" },
  gear: { d: gear() },
  hammer: { d: "M20 18 H66 Q74 18 76 28 L78 38 H66 V40 H20 Z M38 40 H50 V94 H38 Z" },
  bell: { d: "M50 10 a6 6 0 0 1 6 7 C74 22 74 52 78 68 L86 78 H14 L22 68 C26 52 26 22 44 17 a6 6 0 0 1 6 -7 Z M42 82 a8 8 0 0 0 16 0 Z" },
  bridge: { d: "M4 44 H96 V56 H88 V86 H76 A26 26 0 0 0 24 86 H12 V56 H4 Z" },
};

/** Heraldic ordinaries (bands and borders) in the 100×120 shield box. "bordure" is drawn as a border along the shield. */
export const ORDINARIES = {
  none: "",
  chief: "M0 0 H100 V34 H0 Z",
  bordure: "",
  fess: "M0 46 H100 V74 H0 Z",
  pale: "M36 0 H64 V120 H36 Z",
  bend: "M-12 10 L10 -12 L112 110 L90 132 Z",
  chevron: "M0 94 L50 42 L100 94 V118 L50 66 L0 118 Z",
  cross: "M40 0 H60 V120 H40 Z M0 44 H100 V64 H0 Z",
} as const;
export type Ordinary = keyof typeof ORDINARIES;
export type ChargeId = keyof typeof CHARGES;

export type CrestConfig = {
  shape: Shape;
  division: Division;
  field: Tincture;
  field2: Tincture;
  ordinary: Ordinary;
  ordinaryColor: Tincture;
  /** 1–3 symbols; the first is the main one. */
  charges: ChargeId[];
  chargeColor: Tincture;
  motto: string;
};

const pick = <T extends string>(v: unknown, allowed: Record<string, unknown>, fallback: T): T => (typeof v === "string" && v in allowed ? (v as T) : fallback);

/** Accepts saved, AI-generated or older one-symbol configs and returns a valid crest (or null). */
export function normalizeCrest(x: unknown): CrestConfig | null {
  if (!x || typeof x !== "object") return null;
  const c = x as Record<string, unknown>;
  const raw = Array.isArray(c.charges) ? c.charges : c.charge ? [c.charge] : [];
  const charges = raw.filter((k): k is string => typeof k === "string" && k in CHARGES).slice(0, 3);
  if (!charges.length || !(typeof c.shape === "string" && c.shape in SHAPES)) return null;
  return {
    shape: c.shape as Shape,
    division: pick(c.division, DIVISIONS, "plain"),
    field: pick(c.field, TINCTURES, "azure"),
    field2: pick(c.field2, TINCTURES, "argent"),
    ordinary: pick(c.ordinary, ORDINARIES, "none"),
    ordinaryColor: pick(c.ordinaryColor, TINCTURES, "or"),
    charges,
    chargeColor: pick(c.chargeColor, TINCTURES, "or"),
    motto: typeof c.motto === "string" ? c.motto.slice(0, 40) : "",
  };
}

/** Where the symbols go: [centre x, centre y, scale] for each charge. */
export function chargeLayout(c: CrestConfig): [number, number, number][] {
  const n = c.charges.length;
  if (c.ordinary === "chief") {
    const main: [number, number, number] = [50, 72, n === 1 ? 0.5 : 0.46];
    if (n === 1) return [main];
    if (n === 2) return [main, [50, 17, 0.24]];
    return [main, [30, 17, 0.22], [70, 17, 0.22]];
  }
  if (c.ordinary === "fess") {
    if (n === 1) return [[50, 60, 0.3]];
    if (n === 2) return [[50, 25, 0.3], [50, 92, 0.26]];
    return [[30, 25, 0.26], [70, 25, 0.26], [50, 92, 0.26]];
  }
  if (c.ordinary === "pale" || c.ordinary === "cross") {
    if (n === 1) return [[50, 54, 0.3]];
    if (n === 2) return [[22, 54, 0.28], [78, 54, 0.28]];
    return [[22, 30, 0.24], [78, 30, 0.24], [50, 54, 0.24]];
  }
  const sz = c.ordinary === "bordure" ? 0.9 : 1;
  if (n === 1) return [[50, 56, 0.62 * sz]];
  if (n === 2) return [[30, 56, 0.38 * sz], [70, 56, 0.38 * sz]];
  // "An anchor and two stars": the main symbol large in the middle, the pair small above it.
  const [a, b, d] = c.charges;
  if (b === d && a !== b) return [[50, 64, 0.46 * sz], [25, 27, 0.22 * sz], [75, 27, 0.22 * sz]];
  return [[30, 42, 0.32 * sz], [70, 42, 0.32 * sz], [50, 80, 0.32 * sz]];
}

// ---------- Surnames ----------

/** One family line for male and female forms: Лимонова → Лимонов, Лавская → Лавский. */
export function surnameKey(lastName: string): string {
  let s = lastName.trim().toLowerCase().replace(/ё/g, "е");
  const rules: [RegExp, string][] = [[/(ов|ев|ёв|ин|ын)а$/, "$1"], [/ская$/, "ский"], [/цкая$/, "цкий"], [/ая$/, "ий"]];
  for (const [re, to] of rules) if (re.test(s)) { s = s.replace(re, to); break; }
  return s;
}

/** Display name of the family line: Лимонов → Лимоновы, Лавский → Лавские; other surnames stay as they are. */
export function lineName(forms: string[]): string {
  const male = forms.find((f) => surnameKey(f) === f.trim().toLowerCase().replace(/ё/g, "е")) ?? forms[0];
  const m = male.trim();
  if (/(ов|ев|ёв|ин|ын)$/i.test(m)) return m + "ы";
  if (/(ский|цкий)$/i.test(m)) return m.replace(/ий$/i, "ие");
  return m;
}

// ---------- Defaults and suggestions ----------

const KEYWORDS: [ChargeId, RegExp][] = [
  ["book", /учит|препода|профессор|учён|учен|библиот|teacher|professor|lehrer|enseign|insegn|profesor|maestr/i],
  ["anchor", /моряк|флот|капитан|порт|sailor|navy|captain|seemann|marin|marinai|marinero/i],
  ["ship", /корабл|судно|ship|schiff|navire|nave|barco/i],
  ["wheat", /крестья|ферм|колхоз|агроном|хлеб|пекар|farmer|bauer|agricul|contadin|campesin|baker|bäcker/i],
  ["tower", /инженер|строит|архитект|engineer|builder|architect|ingenieur|ingénieur|ingegner|ingenier/i],
  ["music", /музык|пел[аи]? |хор|пианист|скрипк|music|musik|musique|musica|música/i],
  ["rose", /врач|медсестр|медик|doctor|nurse|arzt|ärzt|médecin|medic|médic/i],
  ["fish", /рыбак|рыболов|fisher|fischer|pêcheur|pescator|pescador/i],
  ["horseshoe", /кузнец|конюх|кони|лошад|smith|schmied|forgeron|fabbro|herrero/i],
  ["mountain", /гор[ыа]|альп|mountain|berg|alp|montagn|montañ/i],
  ["waves", /мор[еяю]|река|волга|днепр|sea|river|meer|fluss|mer |mare|mar /i],
];
const MOUNTAIN_COUNTRIES = new Set(["CH", "AT", "GE", "AM", "NP", "AD", "LI"]);
const SUN_COUNTRIES = new Set(["IT", "ES", "PT", "GR", "AZ", "UZ", "KZ", "TR", "IL", "CY"]);

export type Suggestion = { charge: ChargeId; reason: string };

/** Symbols that fit a family line, with the word or country that suggested them. */
export function suggestCharges(text: string, countries: string[]): Suggestion[] {
  const out: Suggestion[] = [];
  for (const [charge, re] of KEYWORDS) {
    const m = re.exec(text);
    if (m && !out.some((s) => s.charge === charge)) {
      // Show the whole word that matched ("учительницей", not "учит").
      let a = m.index, b = m.index + m[0].length;
      while (a > 0 && /[\p{L}-]/u.test(text[a - 1])) a--;
      while (b < text.length && /[\p{L}-]/u.test(text[b])) b++;
      out.push({ charge, reason: text.slice(a, b).trim().toLowerCase() });
    }
  }
  const mc = countries.find((c) => MOUNTAIN_COUNTRIES.has(c));
  if (mc && !out.some((s) => s.charge === "mountain")) out.push({ charge: "mountain", reason: mc });
  const sc = countries.find((c) => SUN_COUNTRIES.has(c));
  if (sc && !out.some((s) => s.charge === "sun")) out.push({ charge: "sun", reason: sc });
  return out;
}

const hash = (s: string) => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h; };

/** A ready-made first draft for every family line, so each one has an emblem before anyone edits it. */
export function defaultCrest(key: string, suggestions: Suggestion[]): CrestConfig {
  const h = hash(key);
  const colours: Tincture[] = ["gules", "azure", "vert", "purpure", "sable"];
  const metals: Tincture[] = ["or", "argent"];
  const colour = colours[h % colours.length];
  const metal = metals[(h >> 3) % 2];
  const divisions: Division[] = ["plain", "pale", "fess", "bend", "chevron", "plain"];
  const division = divisions[(h >> 5) % divisions.length];
  return {
    shape: "heater",
    division,
    field: colour,
    field2: metal,
    ordinary: "none",
    ordinaryColor: metal,
    charges: [suggestions[0]?.charge ?? "tree"],
    chargeColor: division === "plain" ? metal : metal === "or" ? "argent" : "or",
    motto: "",
  };
}
