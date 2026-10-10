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
};
export type ChargeId = keyof typeof CHARGES;

export type CrestConfig = {
  shape: Shape;
  division: Division;
  field: Tincture;
  field2: Tincture;
  charge: ChargeId;
  chargeColor: Tincture;
  motto: string;
};

export function isCrestConfig(x: unknown): x is CrestConfig {
  const c = x as CrestConfig;
  return !!c && c.shape in SHAPES && c.division in DIVISIONS && c.field in TINCTURES && c.field2 in TINCTURES
    && c.charge in CHARGES && c.chargeColor in TINCTURES && typeof c.motto === "string" && c.motto.length <= 60;
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
    charge: suggestions[0]?.charge ?? "tree",
    chargeColor: division === "plain" ? metal : metal === "or" ? "argent" : "or",
    motto: "",
  };
}
