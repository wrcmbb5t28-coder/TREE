// Ligne-claire bust portraits: even black outline, flat colours, dot eyes. viewBox 0 0 200 200.
const INK = "#1E1B1A";
const SK = { light: "#F6D2B4", fair: "#F1C6A2", warm: "#E3AE85", olive: "#D49A6E", brown: "#B87A52" };
const HAIR = { black: "#2A2421", dark: "#4A3326", brown: "#7A4E2E", auburn: "#A0522D", fair: "#D9B25E", gray: "#C9C6C0", white: "#EEEDEA" };
const sw = 2.4;
const L = (d, fill = "none", w = sw, extra = "") => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;
const N = (d, fill) => `<path d="${d}" fill="${fill}"/>`;

const HEAD = "M68 82 C68 120 84 138 100 138 C116 138 132 120 132 82 C132 56 118 42 100 42 C82 42 68 56 68 82Z";
const HEAD_F = "M70 84 C70 118 85 134 100 134 C115 134 130 118 130 84 C130 58 117 46 100 46 C83 46 70 58 70 84Z"; // female, a little softer

function clothes(c) {
  const col = c.cloth, body = L("M28 200 C30 170 56 152 100 150 C144 152 170 170 172 200Z", col);
  let s = "";
  switch (c.wear) {
    case "collarTie": // shirt collar, tie, jacket
      s = body + L("M80 152 L100 176 L120 152", c.shirt || "#FBF3E2") + L("M80 152 L92 166 L100 156 L108 166 L120 152", c.shirt || "#FBF3E2", 2) +
        L("M96 160 L104 160 L106 190 L100 198 L94 190Z", c.tie || "#D9503F", 2) +
        L("M62 160 L84 196 M138 160 L116 196", "none", 2);
      break;
    case "waistcoat": // collarless shirt + waistcoat (Edwardian working man)
      s = L("M28 200 C30 170 56 152 100 150 C144 152 170 170 172 200Z", c.shirt || "#FBF3E2") +
        L("M64 158 C74 170 82 186 84 200 L116 200 C118 186 126 170 136 158 C126 154 112 152 100 152 C88 152 74 154 64 158Z", col) +
        L("M88 152 C92 158 108 158 112 152", "#FBF3E2", 2) + `<circle cx="100" cy="172" r="2" fill="${INK}"/><circle cx="100" cy="186" r="2" fill="${INK}"/>`;
      break;
    case "highCollar": // Victorian/Edwardian dress with high collar and brooch
      s = body + L("M84 132 L84 156 C92 160 108 160 116 156 L116 132", col) +
        `<circle cx="100" cy="162" r="4.5" fill="#F2C744" stroke="${INK}" stroke-width="2"/>` + L("M60 168 C72 176 88 178 100 178 C112 178 128 176 140 168", "none", 1.6);
      break;
    case "round": // round neckline dress / jumper
      s = body + L("M80 152 C86 164 114 164 120 152", c.trim || "#FBF3E2", 2.2);
      break;
    case "cardigan":
      s = L("M28 200 C30 170 56 152 100 150 C144 152 170 170 172 200Z", c.shirt || "#FBF3E2") +
        L("M30 200 C32 172 56 154 86 151 L96 200Z", col) + L("M170 200 C168 172 144 154 114 151 L104 200Z", col) +
        `<circle cx="92" cy="176" r="2" fill="${INK}"/><circle cx="91" cy="190" r="2" fill="${INK}"/>`;
      break;
    case "tee":
      s = body + L("M84 151 C90 160 110 160 116 151", "none", 2.2);
      break;
    case "uniform": // soldier tunic with collar
      s = body + L("M80 150 L84 162 L100 166 L116 162 L120 150", col, 2.2) + `<circle cx="100" cy="178" r="2.2" fill="#F2C744" stroke="${INK}" stroke-width="1.2"/><circle cx="100" cy="192" r="2.2" fill="#F2C744" stroke="${INK}" stroke-width="1.2"/>` +
        L("M56 166 L74 166 M126 166 L144 166", "none", 2);
      break;
    case "sari": // sari with border over one shoulder
      s = body + L("M128 150 C116 170 96 186 76 200", "none", 9, ` stroke="${c.trim || "#F2C744"}"`).replace(`stroke="${INK}" stroke-width="9"`, `stroke="${c.trim || "#F2C744"}" stroke-width="9"`) +
        L("M124 150 C112 168 92 184 70 198 M134 152 C122 172 102 190 84 200", "none", 2) + L("M86 152 C92 158 108 158 114 152", "none", 2);
      break;
    case "kurta":
      s = body + L("M100 152 L100 182", "none", 2) + L("M88 152 C92 156 108 156 112 152", "none", 2) +
        `<circle cx="100" cy="164" r="1.8" fill="${INK}"/><circle cx="100" cy="174" r="1.8" fill="${INK}"/>`;
      break;
    case "dungarees": // child
      s = body + L("M78 168 L122 168 L124 200 L76 200Z", c.trim || "#7DB9DE", 2.2) + L("M80 168 L74 154 M120 168 L126 154", "none", 2.2) +
        `<circle cx="84" cy="174" r="2" fill="${INK}"/><circle cx="116" cy="174" r="2" fill="${INK}"/>`;
      break;
  }
  return s;
}

function hairBack(c) {
  const h = HAIR[c.hair], st = c.style;
  if (st === "bunLow") return L("M100 50 m-30 0 a30 26 0 1 0 60 0", h) + L("M100 40 m-22 0 a22 18 0 1 0 44 0 a22 18 0 1 0 -44 0", h);
  if (st === "long") return L("M66 80 C60 120 62 150 70 166 L130 166 C138 150 140 120 134 80 C134 50 118 36 100 36 C82 36 66 50 66 80Z", h);
  if (st === "bob") return L("M64 84 C60 112 62 130 70 136 L130 136 C138 130 140 112 136 84 C136 52 118 38 100 38 C82 38 64 52 64 84Z", h);
  if (st === "braid") return L("M64 84 C60 112 64 130 72 134 L128 134 C136 130 140 112 136 84 C136 52 118 38 100 38 C82 38 64 52 64 84Z", h) + L("M128 128 C138 146 136 170 128 186", "none", 12, ` stroke="${h}"`).replace(`stroke="${INK}" stroke-width="12"`, `stroke="${h}" stroke-width="12"`) + L("M122 130 C132 150 130 172 122 190 M134 128 C144 148 142 170 134 186", "none", 2);
  if (st === "topBun") return L("M100 32 m-16 0 a16 13 0 1 0 32 0 a16 13 0 1 0 -32 0", h);
  if (st === "pigtails") return L("M58 96 m-12 0 a12 16 0 1 0 24 0 a12 16 0 1 0 -24 0", h) + L("M142 96 m-12 0 a12 16 0 1 0 24 0 a12 16 0 1 0 -24 0", h);
  return "";
}

function hairFront(c) {
  const h = HAIR[c.hair], st = c.style;
  switch (st) {
    case "sidePart": return L("M66 84 C62 52 80 38 102 38 C124 38 138 52 134 84 C130 70 128 62 120 58 C104 62 86 60 74 54 C70 62 68 72 66 84Z", h) + L("M88 44 C92 50 96 54 100 56", "none", 1.6);
    case "slick": return L("M67 80 C64 52 80 38 100 38 C122 38 136 52 133 80 C128 64 122 56 112 54 C96 52 80 56 72 64 C70 70 68 74 67 80Z", h) + L("M80 46 C92 42 108 42 120 48 M78 54 C94 48 110 48 124 56", "none", 1.4);
    case "short": return L("M68 80 C64 54 80 40 100 40 C122 40 136 54 132 80 C128 66 122 60 114 58 C104 64 88 62 80 56 C74 62 70 70 68 80Z", h);
    case "receding": return L("M67 92 C64 74 68 60 74 54 C76 64 76 76 74 92Z", h) + L("M133 92 C136 74 132 60 126 54 C124 64 124 76 126 92Z", h) + L("M82 46 C92 42 108 42 118 46", "none", 1.6);
    case "bald": return L("M67 96 C64 84 66 76 70 72 C72 80 72 88 72 98Z", h) + L("M133 96 C136 84 134 76 130 72 C128 80 128 88 128 98Z", h);
    case "messy": return L("M66 84 C58 58 72 36 92 36 C98 28 112 30 116 38 C134 38 144 58 134 84 C130 72 126 64 120 62 C116 70 108 70 104 62 C98 70 88 70 86 62 C80 68 72 74 66 84Z", h);
    case "curly": return L("M64 86 C54 74 58 56 70 52 C68 40 82 32 92 38 C98 28 114 28 118 38 C130 34 142 44 138 56 C148 62 146 78 136 86 C132 74 126 66 116 64 C104 70 92 70 82 64 C74 68 68 76 64 86Z", h);
    case "bunLow": case "topBun": return L("M70 84 C66 56 82 42 100 42 C118 42 134 56 130 84 C126 66 118 56 100 54 C82 56 74 66 70 84Z", h) + L("M100 44 C98 50 98 54 100 56", "none", 1.6) + L("M78 58 C84 52 92 50 98 50 M122 58 C116 52 108 50 102 50", "none", 1.4);
    case "waves": return L("M68 90 C62 58 80 40 100 40 C122 40 138 58 132 90 C130 78 126 70 120 66 C126 76 120 82 112 78 C104 72 100 64 92 64 C84 64 82 72 76 76 C72 80 70 86 68 90Z", h) + L("M78 52 C86 46 92 50 98 46 M104 46 C112 50 118 46 124 52", "none", 1.4);
    case "long": case "bob": return L("M68 90 C64 58 80 40 100 40 C122 40 136 58 132 90 C128 72 120 62 108 58 C98 64 84 70 72 74 C70 80 68 84 68 90Z", h);
    case "braid": return L("M68 88 C64 58 80 40 100 40 C122 40 136 58 132 88 C126 70 116 60 100 58 C86 60 74 70 68 88Z", h) + L("M100 42 C100 48 100 54 100 58", "none", 1.6);
    case "pigtails": return L("M68 84 C66 58 82 42 100 42 C120 42 134 58 132 84 C126 70 116 62 106 60 C96 66 82 66 74 62 C72 68 70 76 68 84Z", h);
    case "babyTuft": return L("M96 44 C94 36 100 32 104 36 C102 38 100 40 100 44", h, 2);
    case "flatCap": return L("M64 70 C64 46 82 34 104 34 C128 34 140 48 138 64 C150 66 154 72 146 76 C120 80 86 76 64 70Z", c.cap || "#6E6A63") + L("M70 62 C90 58 118 58 136 62", "none", 1.6) + L("M66 72 C66 80 68 86 70 90 M134 72 C134 80 132 86 130 90", HAIR[c.hair], 2);
  }
  return "";
}

function face(c) {
  const old = c.age >= 60, mid = c.age >= 40, f = c.sex === "f", kid = c.age < 12;
  const skin = SK[c.skin || "fair"];
  const head = f ? HEAD_F : HEAD;
  let s = "";
  s += L("M86 120 L86 156 C92 160 108 160 114 156 L114 120", skin); // neck
  s += clothes(c);
  s += hairBack(c);
  s += L("M68 92 m-7 0 a7 10 0 1 0 14 0 a7 10 0 1 0 -14 0", skin) + L("M132 92 m-7 0 a7 10 0 1 0 14 0 a7 10 0 1 0 -14 0", skin); // ears
  s += L(head, skin);
  if (c.earrings) s += `<circle cx="68" cy="106" r="3" fill="#F2C744" stroke="${INK}" stroke-width="1.4"/><circle cx="132" cy="106" r="3" fill="#F2C744" stroke="${INK}" stroke-width="1.4"/>`;
  if (c.bindi) s += `<circle cx="100" cy="78" r="2.4" fill="#D9503F"/>`;
  // cheeks
  s += `<circle cx="80" cy="108" r="6" fill="#E88B74" opacity="${kid ? .45 : .22}"/><circle cx="120" cy="108" r="6" fill="#E88B74" opacity="${kid ? .45 : .22}"/>`;
  // eyes & brows
  const ey = kid ? 96 : 92, br = HAIR[c.brow || (old ? "gray" : c.hair === "white" || c.hair === "gray" ? "gray" : c.hair)] || INK;
  s += `<ellipse cx="87" cy="${ey}" rx="2.6" ry="3.2" fill="${INK}"/><ellipse cx="113" cy="${ey}" rx="2.6" ry="3.2" fill="${INK}"/>`;
  const bw = old ? 3.6 : 2.6;
  s += L(`M79 ${ey - 9} C83 ${ey - 12} 89 ${ey - 12} 94 ${ey - 9}`, "none", bw, ` stroke="${br === HAIR.white || br === HAIR.gray ? INK : INK}"`);
  s += L(`M106 ${ey - 9} C111 ${ey - 12} 117 ${ey - 12} 121 ${ey - 9}`, "none", bw);
  // nose
  s += kid ? L(`M99 ${ey + 10} C98 ${ey + 13} 100 ${ey + 14} 102 ${ey + 13}`, "none", 2) : L("M100 96 C96 106 97 110 104 109", "none", 2.2);
  // mouth
  s += c.mouth === "open" ? L("M92 119 C96 126 104 126 108 119Z", "#9E3B33", 2) : L(kid ? `M95 ${ey + 20} C98 ${ey + 23} 102 ${ey + 23} 105 ${ey + 20}` : "M93 119 C97 122 103 122 107 119", "none", 2.2);
  // age lines
  if (mid) s += L("M84 70 C92 68 108 68 116 70", "none", 1.3, ' opacity=".7"');
  if (old) s += L("M86 64 C94 62 106 62 114 64 M85 110 C83 116 84 120 88 124 M115 110 C117 116 116 120 112 124 M76 96 l-4 2 M124 96 l4 2", "none", 1.3, ' opacity=".8"');
  // facial hair
  if (c.tache === "walrus") s += L("M86 112 C90 106 98 108 100 110 C102 108 110 106 114 112 C118 118 110 120 104 116 C102 115 98 115 96 116 C90 120 82 118 86 112Z", HAIR[c.hair === "bald" ? "gray" : c.tacheCol || c.hair]);
  if (c.tache === "thin") s += L("M90 112 C94 109 98 110 100 111 C102 110 106 109 110 112 C106 114 102 113 100 113 C98 113 94 114 90 112Z", HAIR[c.tacheCol || c.hair], 1.6);
  if (c.beard) s += L("M70 96 C70 124 84 144 100 144 C116 144 130 124 130 96 C126 112 118 124 100 126 C82 124 74 112 70 96Z", HAIR[c.tacheCol || c.hair]) + L("M88 112 C92 108 108 108 112 112 C106 116 94 116 88 112Z", HAIR[c.tacheCol || c.hair], 1.6) + L("M95 121 C98 123 102 123 105 121", "none", 2);
  s += hairFront(c);
  if (c.glasses) s += L("M87 92 m-10 0 a10 9 0 1 0 20 0 a10 9 0 1 0 -20 0", "none", 2) + L("M113 92 m-10 0 a10 9 0 1 0 20 0 a10 9 0 1 0 -20 0", "none", 2) + L("M97 91 C99 89 101 89 103 91 M77 90 L69 87 M123 90 L131 87", "none", 2);
  return s;
}

export function portrait(c, id) {
  const bg = c.bg || "#A3CF8E";
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="pc-${id}"><circle cx="100" cy="100" r="97"/></clipPath></defs>
<circle cx="100" cy="100" r="97" fill="${bg}"/><g clip-path="url(#pc-${id})"><g transform="translate(100 108) scale(1.22) translate(-100 -100)">${face(c)}</g></g><circle cx="100" cy="100" r="97" fill="none" stroke="${INK}" stroke-width="3.2"/></svg>`;
}

// The people. Ages are the age at which they are drawn.
export const people = {
  evan:    { sex: "m", age: 58, skin: "fair", hair: "gray", style: "flatCap", cap: "#5E5A55", tache: "walrus", tacheCol: "white", wear: "waistcoat", cloth: "#5A4A3E", bg: "#E3CC9C" },
  margaret:{ sex: "f", age: 52, skin: "fair", hair: "gray", style: "bunLow", wear: "highCollar", cloth: "#34507A", bg: "#F4A983" },
  david:   { sex: "m", age: 30, skin: "fair", hair: "dark", style: "sidePart", tache: "thin", wear: "collarTie", cloth: "#3C3C46", tie: "#D9503F", bg: "#7DB9DE" },
  mary:    { sex: "f", age: 26, skin: "light", hair: "auburn", style: "topBun", wear: "highCollar", cloth: "#5FA052", bg: "#F2C744" },
  john:    { sex: "m", age: 34, skin: "fair", hair: "brown", style: "short", tache: "thin", wear: "uniform", cloth: "#8C7A4E", bg: "#C8CDD2" },
  william: { sex: "m", age: 30, skin: "fair", hair: "black", style: "slick", wear: "collarTie", cloth: "#34507A", tie: "#F2C744", bg: "#D9503F" },
  elsie:   { sex: "f", age: 24, skin: "light", hair: "dark", style: "waves", wear: "round", cloth: "#D9503F", trim: "#FBF3E2", earrings: 1, bg: "#7DB9DE", mouth: "open" },
  thomas:  { sex: "m", age: 45, skin: "fair", hair: "brown", style: "receding", glasses: 1, wear: "collarTie", cloth: "#7A6A55", tie: "#34507A", bg: "#A3CF8E" },
  joan:    { sex: "f", age: 40, skin: "light", hair: "fair", style: "bob", wear: "cardigan", cloth: "#F4A983", shirt: "#FBF3E2", bg: "#CFE8F2" },
  peggy:   { sex: "f", age: 23, skin: "light", hair: "auburn", style: "bob", wear: "round", cloth: "#F2C744", bg: "#7DB9DE" },
  gareth:  { sex: "m", age: 24, skin: "fair", hair: "dark", style: "messy", wear: "tee", cloth: "#2A2421", bg: "#F2C744" },
  susan:   { sex: "f", age: 22, skin: "light", hair: "fair", style: "curly", wear: "round", cloth: "#5FA052", trim: "#FBF3E2", bg: "#F4A983" },
  rhys:    { sex: "m", age: 36, skin: "fair", hair: "brown", style: "short", beard: 1, wear: "tee", cloth: "#34507A", bg: "#A3CF8E" },
  priya:   { sex: "f", age: 34, skin: "olive", hair: "black", style: "long", wear: "round", cloth: "#F2C744", trim: "#D9503F", earrings: 1, bg: "#D9503F" },
  seren:   { sex: "f", age: 7, skin: "warm", hair: "dark", style: "pigtails", wear: "dungarees", cloth: "#F4A983", trim: "#7DB9DE", bg: "#F2C744" },
  owen:    { sex: "m", age: 4, skin: "warm", hair: "brown", style: "messy", wear: "tee", cloth: "#D9503F", bg: "#7DB9DE" },
  navin:   { sex: "m", age: 60, skin: "brown", hair: "white", style: "receding", glasses: 1, tache: "thin", tacheCol: "gray", wear: "kurta", cloth: "#FBF3E2", bg: "#E3CC9C" },
  kokila:  { sex: "f", age: 70, skin: "brown", hair: "gray", style: "braid", wear: "sari", cloth: "#5FA052", trim: "#F2C744", bindi: 1, glasses: 1, bg: "#F4A983" },
  mahesh:  { sex: "m", age: 50, skin: "brown", hair: "black", style: "sidePart", tache: "thin", glasses: 1, wear: "collarTie", cloth: "#3C3C46", tie: "#7DB9DE", bg: "#CFE8F2" },
  hema:    { sex: "f", age: 48, skin: "brown", hair: "black", style: "bunLow", wear: "sari", cloth: "#D9503F", trim: "#F2C744", bindi: 1, earrings: 1, bg: "#A3CF8E" },
};
