import Anthropic from "@anthropic-ai/sdk";
import { CHARGES, DIVISIONS, ORDINARIES, SHAPES, TINCTURES, normalizeCrest, type ChargeId, type CrestConfig, type Division, type Ordinary, type Shape, type Tincture } from "./crest";
import { crestsT } from "@/i18n/app/crests";

/**
 * Turns a free-text description ("blue field, gold anchor and two stars, silver border")
 * into a crest. Uses Claude when a key is set, otherwise a keyword reader that knows
 * the six interface languages. Both start from the current crest, so "make it red" works.
 */
export async function crestFromText(prompt: string, base: CrestConfig, lineName: string): Promise<CrestConfig | null> {
  const text = prompt.trim().slice(0, 600);
  if (!text) return null;
  if (process.env.ANTHROPIC_API_KEY) {
    const ai = await viaClaude(text, base, lineName);
    if (ai) return ai;
  }
  return parseText(text, base);
}

// ---------- Claude ----------

const SYSTEM = `You design simple family emblems in a fixed SVG kit. Read the user's description (any language) and return ONLY a JSON object with these keys:
shape: one of ${Object.keys(SHAPES).join(", ")}
division: one of ${Object.keys(DIVISIONS).join(", ")} (how the field is split into two colours; "plain" = one colour)
field: tincture of the field; field2: second tincture (used when division is not plain)
ordinary: one of ${Object.keys(ORDINARIES).join(", ")} (chief = band across the top, bordure = border round the edge, fess = horizontal band, pale = vertical band, bend = diagonal band)
ordinaryColor: tincture
charges: array of 1 to 3 symbol ids from: ${Object.keys(CHARGES).join(", ")}. The first is the main symbol. Repeats are allowed: "anchor and two stars" → ["anchor","star","star"]; "three roses" → ["rose","rose","rose"].
chargeColor: tincture of all symbols
motto: short motto text exactly as the user wrote it, in their language, max 40 characters, or "" if none was asked for.
Tinctures: ${Object.keys(TINCTURES).join(", ")} (or = gold/yellow, argent = silver/white, gules = red, azure = blue, vert = green, purpure = purple, sable = black).
If the user asks for something the kit doesn't have, pick the closest symbol (oak/linden → tree, eagle/dove/falcon → bird, moon → crescent, castle → tower, pen → feather, quill → feather, river/sea → waves, flower/lily → rose, lyre/violin → music, factory/machine → gear, smith → hammer, church → bell).
Keep anything the user did not mention from the current crest. Prefer good contrast: a metal (or, argent) on a colour or the other way round.`;

async function viaClaude(text: string, base: CrestConfig, lineName: string): Promise<CrestConfig | null> {
  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: "user", content: `Family line: ${lineName}\nCurrent crest: ${JSON.stringify(base)}\n\nDescription:\n"""\n${text}\n"""` }],
    });
    const out = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const m = out.match(/\{[\s\S]*\}/);
    if (!m) return null;
    return normalizeCrest({ ...base, ...JSON.parse(m[0]) });
  } catch (e) {
    console.error("[crest] Claude failed, using the keyword reader", e);
    return null;
  }
}

// ---------- Keyword reader (no key needed) ----------

const L = "(?<![\\p{L}])";
const rx = (parts: string[]) => new RegExp(L + "(?:" + parts.join("|") + ")", "iu");

const TINCT: [Tincture, RegExp][] = [
  ["or", rx(["золот", "жёлт", "желт", "gold", "yellow", "gelb", "d'or", "oro", "dorad", "giall", "amarill"])],
  ["argent", rx(["серебр", "бел[аоыу]", "silver", "white", "wei(?:ß|ss)", "silber", "argent", "blanc", "bianc", "plata", "plate"])],
  ["gules", rx(["красн", "червл", "ал[аоыу]", "red", "rot", "rouge", "gueule", "ross[oa]", "roj[oa]", "gules"])],
  ["azure", rx(["син", "голуб(?![ья])", "лазур", "blue", "blau", "bleu", "azur", "blu", "azul"])],
  ["vert", rx(["зел[её]н", "green", "grün", "vert", "verde", "sinopl"])],
  ["purpure", rx(["пурпур", "фиолет", "лилов", "purple", "violet", "lila", "viola", "morad", "púrpur", "porpor", "pourpre"])],
  ["sable", rx(["ч[её]рн", "black", "schwarz", "noir", "sable", "ner[oa]", "negr[oa]"])],
];

const FIELD = rx(["пол[еяю]", "фон", "щит", "field", "background", "feld", "hintergrund", "champ", "fond", "campo", "fondo", "sfondo"]);

const ORD_WORDS: [Ordinary, RegExp][] = [
  ["bordure", rx(["кайм", "рамк", "обод", "окантов", "border", "bordure", "bord", "rand", "bordura", "orla"])],
  ["chief", rx(["глав[аеуы]", "chief", "schildhaupt", "chef", "capo", "jefe"])],
  ["chevron", rx(["стропил", "chevron", "sparren", "scaglion", "cheurón", "cabrio"])],
  ["cross", rx(["крест", "cross", "kreuz", "croix", "croce", "cruz"])],
  ["bend", rx(["перевяз", "диагональн[а-я]* полос", "bend", "schrägbalken", "bande", "banda"])],
  ["pale", rx(["столб", "вертикальн[а-я]* полос", "pale", "pfahl", "pal", "palo"])],
  ["fess", rx(["пояс", "полос", "band", "stripe", "balken", "streifen", "fasce", "fascia", "faja"])],
];

const DIV_WORDS: [Division, RegExp][] = [
  ["quarterly", rx(["четвер", "четыре част", "quarter", "geviert", "écartel", "inquartat", "cuartel"])],
  ["pale", rx(["рассеч", "вертикально попол", "split", "per pale", "gespalten", "parti", "partit"])],
  ["fess", rx(["пересеч", "горизонтально попол", "per fess", "geteilt", "coupé", "troncat", "cortad"])],
  ["bend", rx(["скош", "по диагонал", "per bend", "schräg", "tranché", "trinciat", "tronchad"])],
];

const SHAPE_WORDS: [Shape, RegExp][] = [
  ["oval", rx(["овал", "oval", "ovale"])],
  ["swiss", rx(["кругл", "скругл", "швейцар", "round", "rund", "swiss", "rond", "rotond", "redond"])],
  ["french", rx(["француз", "french", "französ", "français", "frances", "francés"])],
];

const EXTRA: Partial<Record<ChargeId, string[]>> = {
  tree: ["дуб", "липа", "берёз", "берез", "oak", "eiche", "chêne", "querc", "roble"],
  bird: ["ор[её]л", "голуб[ья]", "сокол", "журав", "ласточ", "eagle", "dove", "falcon", "adler", "taube", "aigle", "colomb", "aquil", "águil", "paloma"],
  crescent: ["лун", "месяц", "moon", "mond", "lune", "luna"],
  tower: ["замок", "крепост", "castle", "burg", "château", "castell", "castillo"],
  feather: ["pen", "ручк", "плюм"],
  waves: ["волн", "рек", "мор[еяю]", "river", "sea", "fluss", "meer", "fleuve", "rivière", "fiume", "río"],
  rose: ["роз", "лили", "цвет", "flower", "lily", "lilie", "blume", "lys", "giglio", "lirio"],
  music: ["лир", "скрип", "нот", "lyre", "violin", "geige", "violon"],
  gear: ["завод", "машин", "factory", "cog", "fabrik", "usine", "fabbric", "fábrica"],
  mountain: ["гор[аыу]", "alp", "berg", "mountain"],
  sun: ["солнц", "sun", "sonne", "soleil", "sole", "sol"],
};

const CHARGE_RX: [ChargeId, RegExp][] = (Object.keys(CHARGES) as ChargeId[]).map((id) => {
  const stems = new Set<string>(EXTRA[id] ?? []);
  for (const t of Object.values(crestsT)) {
    const name = (t.charges as Record<string, string>)[id];
    if (!name) continue;
    for (const w of name.toLowerCase().replace(/ё/g, "е").split(/\s+/)) {
      if (w.length < 3 || ["de", "à"].includes(w)) continue;
      stems.add((w.length <= 4 ? w : w.slice(0, Math.max(4, w.length - 2))).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    }
  }
  return [id, rx([...stems])];
});

const TWO = new RegExp(L + "(?:дв[аеу]|двумя|пар[аы]|two|a pair|zwei|deux|due|dos)(?![\\p{L}])", "iu");
const THREE = new RegExp(L + "(?:тр[иеё]|тремя|three|drei|trois|tre|tres)(?![\\p{L}])", "iu");

function findCharges(s: string): { id: ChargeId; at: number }[] {
  const out: { id: ChargeId; at: number }[] = [];
  for (const [id, re] of CHARGE_RX) {
    const m = new RegExp(re.source, "giu").exec(s);
    if (m) out.push({ id, at: m.index });
  }
  return out.sort((a, b) => a.at - b.at);
}

const firstTincture = (s: string): Tincture | null => {
  let best: { t: Tincture; at: number } | null = null;
  for (const [t, re] of TINCT) {
    const m = new RegExp(re.source, "iu").exec(s);
    if (m && (!best || m.index < best.at)) best = { t, at: m.index };
  }
  return best?.t ?? null;
};
const allTinctures = (s: string): Tincture[] => {
  const hits: { t: Tincture; at: number }[] = [];
  for (const [t, re] of TINCT) {
    const g = new RegExp(re.source, "giu");
    let m; while ((m = g.exec(s))) hits.push({ t, at: m.index });
  }
  return [...new Set(hits.sort((a, b) => a.at - b.at).map((h) => h.t))];
};

export function parseText(text: string, base: CrestConfig): CrestConfig | null {
  const c: CrestConfig = { ...base, charges: [...base.charges] };
  let changed = false;

  // Motto first, and cut it out so its words are not read as symbols or colours.
  let rest = text;
  const motto = text.match(/(?:девиз|motto|wahlspruch|devise|lema|divisa)\s*[:\-–—]?\s*[«"“„'‘]([^»"”“'’]{1,60})[»"”“'’]/iu)
    ?? text.match(/[«"“„]([^»"”“]{1,60})[»"”“]/u);
  if (motto) { c.motto = motto[1].trim().slice(0, 40); rest = text.replace(motto[0], " "); changed = true; }

  for (const [s, re] of SHAPE_WORDS) if (re.test(rest)) { c.shape = s; changed = true; break; }
  for (const [d, re] of DIV_WORDS) if (re.test(rest)) { c.division = d; changed = true; break; }

  // "две звёзды" and "две звезды" are the same; stems are stored without ё.
  rest = rest.replace(/ё/g, "е").replace(/Ё/g, "Е");
  // Commas split the description into parts; a part about the field keeps its "and" ("red and gold field").
  const clauses = rest.split(/[,;.\n]/u).map((x) => x.trim()).filter(Boolean)
    .flatMap((part) => (FIELD.test(part) && !findCharges(part).length ? [part]
      : part.split(/\s(?:и|а также|с|со|and|with|und|mit|et|avec|e|con|y)\s/iu).map((x) => x.trim()).filter(Boolean)));
  const charges: ChargeId[] = [];
  let chargeColour: Tincture | null = null;

  for (const cl of clauses) {
    const ord = ORD_WORDS.find(([, re]) => re.test(cl));
    const chs = findCharges(cl);
    const tint = firstTincture(cl);
    if (FIELD.test(cl) && !chs.length) {
      const ts = allTinctures(cl);
      if (ts[0]) { c.field = ts[0]; changed = true; }
      if (ts[1]) { c.field2 = ts[1]; if (c.division === "plain") c.division = "pale"; }
      continue;
    }
    if (ord && !chs.length) {
      c.ordinary = ord[0]; changed = true;
      if (tint) c.ordinaryColor = tint;
      continue;
    }
    if (chs.length) {
      for (const ch of chs) {
        const before = cl.slice(Math.max(0, ch.at - 14), ch.at);
        const n = THREE.test(before) ? 3 : TWO.test(before) ? 2 : 1;
        for (let i = 0; i < n; i++) charges.push(ch.id);
      }
      if (tint && !chargeColour) chargeColour = tint;
      continue;
    }
    // A colour on its own, early on, usually means the field ("синий, с золотым якорем").
    if (tint && !changed) { c.field = tint; changed = true; }
  }

  if (charges.length) { c.charges = charges.slice(0, 3); changed = true; }
  if (chargeColour) c.chargeColor = chargeColour;
  if (/без\s+(?:полос|каймы)|no\s+(?:band|border)|ohne\s+(?:balken|bord)/iu.test(rest)) { c.ordinary = "none"; changed = true; }

  // Keep symbols readable: never the same colour as the field they sit on.
  if (c.chargeColor === c.field) c.chargeColor = TINCTURES[c.field].metal ? "sable" : "or";
  if (c.ordinary !== "none" && c.ordinaryColor === c.field) c.ordinaryColor = TINCTURES[c.field].metal ? "gules" : "argent";

  return changed ? normalizeCrest(c) : null;
}
