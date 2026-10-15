// Builds book.html (and markers for the contents page) for the Jones family sample book.
import { readFileSync, writeFileSync } from "fs";
import * as d3 from "d3-geo";
import { feature } from "topojson-client";
import QRCode from "qrcode";
import { portrait, people } from "./portraits.mjs";
const LANG = process.env.BOOK_LANG || "en";
const { book } = await import(`./content.${LANG}.mjs`);
const U = book.ui;
let pid_ = 0;
const face = (k, cls = "pt") => `<span class="${cls}">${portrait(people[k], k + "-" + (pid_++))}</span>`;
const FACES = [["evan"], ["margaret"], ["david", "mary"], ["john"], ["william"], ["elsie"], ["william", "elsie"], ["thomas"], ["thomas", "joan"], ["peggy"], ["thomas", "joan", "gareth"], ["gareth", "susan"], ["thomas", "gareth"], ["mahesh"], ["rhys", "priya"], ["joan", "owen"]];
import { objects } from "./objects.mjs";

const pages = process.argv[2] ? JSON.parse(readFileSync(process.argv[2], "utf8")) : {};
const withMarkers = process.argv[3] === "markers";
const FONT = "node_modules/@fontsource";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const typo = (s) => esc(s).replace(/'/g, "’").replace(/(^|[\s(])’/g, "$1‘").replace(/ - /g, " – ");
const marker = (id) => (withMarkers ? `<span class="mk">@@${id}@@</span>` : "");
const obj = (k, cls = "vig") => `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true">${objects[k]}</svg>`;
const QR_URL = `https://treename.ai/${LANG}/book`;
const qr = await QRCode.toString(QR_URL, { type: "svg", margin: 0, color: { dark: "#2B2622", light: "#0000" } });

/* ---------- map ---------- */
function ukMap() {
  const W = 1000, H = 1150;
  const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
  const countries = feature(topo, topo.objects.countries).features.filter((f) => ["826", "372", "250", "056", "528", "276", "442"].includes(f.id));
  const pts = { type: "MultiPoint", coordinates: [[-5.2, 50.55], [1.4, 53.95]] };
  const proj = d3.geoMercator().fitExtent([[30, 40], [W - 30, H - 40]], pts).clipExtent([[0, 0], [W, H]]);
  const path = d3.geoPath(proj);
  const land = countries.map((f) => `<path d="${path(f)}" class="${f.id === "826" ? "uk" : "land"}"/>`).join("");
  const grat = d3.geoGraticule().step([1, 1]);
  const KEYS = ["Treorchy", "Mametz", "Cardiff", "Swansea", "London", "Leicester", "Manchester"];
  const s = book.stops.map((x, i) => ({ ...x, k: KEYS[i] }));
  const P = (st) => proj([st.lon, st.lat]);
  // journey order through time
  const order = ["Treorchy", "Cardiff", "Swansea", "London", "Manchester"].map((n) => s.find((x) => x.k === n));
  const curve = (a, b, bend = 0.18) => {
    const [x1, y1] = P(a), [x2, y2] = P(b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
    return `M${x1} ${y1} Q${mx - dy * bend} ${my + dx * bend} ${x2} ${y2}`;
  };
  let route = "";
  for (let i = 0; i < order.length - 1; i++) route += `<path class="route" d="${curve(order[i], order[i + 1], i % 2 ? -0.22 : 0.22)}"/>`;
  route += `<path class="route side" d="${curve(s.find((x) => x.k === "Treorchy"), s.find((x) => x.k === "Mametz"), -0.15)}"/>`;
  route += `<path class="route shah" d="${curve(s.find((x) => x.k === "Leicester"), s.find((x) => x.k === "Manchester"), 0.2)}"/>`;
  const place = { Treorchy: [-6, -40, "end"], Cardiff: [18, 34, "start"], Swansea: [-18, 38, "end"], London: [18, 8, "start"], Leicester: [18, 8, "start"], Manchester: [18, 8, "start"] };
  const labels = s.filter((st) => st.k !== "Mametz").map((st) => {
    const [x, y] = P(st), [dx, dy, a] = place[st.k];
    return `<g><circle cx="${x}" cy="${y}" r="9" class="dot"/><circle cx="${x}" cy="${y}" r="3.5" class="dot-in"/>
      <text x="${x + dx}" y="${y + dy}" text-anchor="${a}" class="pl">${st.name}</text>
      <text x="${x + dx}" y="${y + dy + 26}" text-anchor="${a}" class="pn">${st.year} · ${typo(st.note)}</text></g>`;
  }).join("");
  const seaLabel = (txt, lon, lat, rot = 0) => { const [x, y] = proj([lon, lat]); return `<text class="sea" x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})">${txt}</text>`; };
  return `<svg viewBox="0 0 ${W} ${H}" class="map">
    <rect width="${W}" height="${H}" class="sea-bg"/>
    <path d="${path(grat())}" class="grat"/>
    ${land}
    ${seaLabel(U.seas[0], -5.0, 53.6, -60)}${seaLabel(U.seas[1], -1.6, 50.25, -6)}${seaLabel(U.seas[2], 2.4, 53.4, -70)}
    ${route}${labels}
    <text x="${W - 40}" y="${H - 70}" text-anchor="end" class="pl">${U.toMametz}</text><text x="${W - 40}" y="${H - 42}" text-anchor="end" class="pn">${U.mametzNote}</text><g transform="translate(${W - 120} 380)" class="rose"><circle r="46"/><path d="M0 -60 L9 0 L0 60 L-9 0 Z"/><path d="M0 -60 L9 0 L-9 0 Z" class="rose-n"/><text y="-68" text-anchor="middle">N</text></g>
  </svg>`;
}
function worldInset() {
  const W = 1000, H = 520;
  const topo = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
  const land = feature(topo, topo.objects.land);
  const proj = d3.geoEqualEarth().fitExtent([[10, 10], [W - 10, H - 10]], { type: "Sphere" });
  const path = d3.geoPath(proj);
  const uk = [-1.5, 52.6];
  const arcs = book.far.map((f) => `<path class="route" d="${path({ type: "LineString", coordinates: Array.from({ length: 51 }, (_, i) => i / 50).map(d3.geoInterpolate(uk, [f.lon, f.lat])) })}"/>`).join("");
  const dots = [...book.far.map((f) => [f.lon, f.lat, f.name, f.note]), [uk[0], uk[1], "__uk", ""]].map(([lo, la, n, note]) => {
    const [x, y] = proj([lo, la]);
    return `<circle cx="${x}" cy="${y}" r="8" class="dot"/><circle cx="${x}" cy="${y}" r="3" class="dot-in"/>
      ${n === "__uk" ? "" : `<text x="${x + 16}" y="${y + 6}" class="pl s">${n}</text><text x="${x + 16}" y="${y + 30}" class="pn s">${typo(note)}</text>`}`;
  }).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="world"><path d="${path({ type: "Sphere" })}" class="sea-bg"/><path d="${path(d3.geoGraticule10())}" class="grat"/><path d="${path(land)}" class="land"/>${arcs}${dots}</svg>`;
}

/* ---------- tree ---------- */
function tree() {
  const W = 1000, H = 1240, R = 40;
  const ini = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const node = (x, y, [name, yrs], cls = "", key) => `<g class="tn ${cls}"><svg x="${x - R - 4}" y="${y - R - 4}" width="${2 * R + 8}" height="${2 * R + 8}" viewBox="0 0 200 200">${portrait(people[key], "t" + key).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</svg>
    <text x="${x}" y="${y - R - 32}" text-anchor="middle" class="nm">${name}</text>
    <text x="${x}" y="${y - R - 11}" text-anchor="middle" class="yr">${yrs}</text></g>`;
  const rows = [1140, 975, 810, 645, 480, 315];
  const TK = [["evan", "margaret"], ["david", "mary"], ["william", "elsie"], ["thomas", "joan"], ["gareth", "susan"], ["rhys", "priya"]];
  const HX = 330, WX = 520, SX = 770, SWX = 900;
  let s = "", lines = "";
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII"];
  book.line.forEach((c, i) => {
    const y = rows[i];
    s += node(HX, y, c.h, "", TK[i][0]) + node(WX, y, c.w, "", TK[i][1]);
    lines += `<path d="M${HX + R} ${y} H${WX - R}" class="tl m"/>`;
    s += `<text x="40" y="${y + 10}" class="rn">${roman[i]}</text>`;
    if (c.sibs.length) s += `<text y="${y - 4 - (c.sibs.length - 1) * 11}" text-anchor="end" class="sb">${c.sibs.map((t, k) => `<tspan x="${HX - R - 20}" dy="${k ? 22 : 0}">${typo(t)}</tspan>`).join("")}</text>`;
    const mid = (HX + WX) / 2;
    const yn = i < book.line.length - 1 ? rows[i + 1] : 120;
    if (i < book.line.length - 1) lines += `<path d="M${mid} ${y} V${yn + R + 22} H${HX} V${yn + R}" class="tl"/>`;
  });
  // children
  const yc = 150;
  s += node(HX, yc, book.children[0], "kid", "seren") + node(WX, yc, book.children[1], "kid", "owen");
  s += `<text x="40" y="${yc + 10}" class="rn">VII</text>`;
  const m6 = (HX + WX) / 2;
  lines += `<path d="M${m6} ${rows[5]} V${yc + R + 22} M${HX} ${yc + R + 22} H${WX} M${HX} ${yc + R + 22} V${yc + R} M${WX} ${yc + R + 22} V${yc + R}" class="tl"/>`;
  // Shah branch: Navin & Kokila (row 4) -> Mahesh & Hema (row 5) -> Priya
  s += node(SX, rows[3], book.shah[0], "shah", "navin") + node(SWX, rows[3], book.shah[1], "shah", "kokila");
  s += node(SX, rows[4], book.shah[2], "shah", "mahesh") + node(SWX, rows[4], book.shah[3], "shah", "hema");
  lines += `<path d="M${SX + R} ${rows[3]} H${SWX - R} M${SX + R} ${rows[4]} H${SWX - R}" class="tl m"/>`;
  lines += `<path d="M${(SX + SWX) / 2} ${rows[3]} V${rows[4] + R + 22} H${SX} V${rows[4] + R}" class="tl"/>`;
  lines += `<path d="M${(SX + SWX) / 2} ${rows[4]} V${rows[5] + R + 22} H${WX} V${rows[5] + R}" class="tl"/>`;
  s += `<text x="${(SX + SWX) / 2}" y="${rows[2] + 10}" text-anchor="middle" class="br">${U.shahs}</text><text x="${(SX + SWX) / 2}" y="${rows[2] + 36}" text-anchor="middle" class="brs">${U.shahsWhere}</text>`;
  s += `<text x="${(HX + WX) / 2}" y="${H + 10}" text-anchor="middle" class="br">${U.joneses}</text>`;
  return `<svg viewBox="20 30 ${W - 20} ${H}" class="tree">${lines}${s}</svg>`;
}

/* ---------- timeline ---------- */
function timeline() {
  return `<div class="tline">${book.timeline.map(([y, t, k]) => `<div class="te ${k}"><span class="ty">${y}</span><span class="tt">${typo(t)}</span></div>`).join("")}</div>`;
}

/* ---------- pages ---------- */
const P = book.parts;
let storyIdx = 0;
const storyHtml = (st, part) => {
  const id = `s${storyIdx++}`;
  const paras = st.paras.map((p, i) => `<p${i === 0 ? ' class="first"' : ""}>${typo(p)}</p>`).join("");
  const voice = st.voice ? `<aside class="voice"><div class="qr">${qr}</div><div><b>${U.scan}</b><span>${typo(st.voice)}</span></div></aside>` : "";
  const letter = st.letter ? `<div class="letter"><div class="ldate">${typo(st.letter.date)}</div>${st.letter.lines.map((l) => `<p>${typo(l)}</p>`).join("")}</div>` : "";
  const quote = st.quote ? `<blockquote><p>${typo(st.quote)}</p><cite>${typo(st.quoteBy)}</cite></blockquote>` : "";
  const margin = st.margin ? `<div class="note">${typo(st.margin)}</div>` : "";
  const vig = st.object ? `<div class="endvig">${obj(st.object)}</div>` : `<div class="orn">❦</div>`;
  return `<section class="page story" data-id="${id}">${marker(id)}
    <header><div class="hrow"><div class="htxt"><div class="kicker">${U.part} ${part.n} · ${part.title}</div><h2>${typo(st.title)}</h2></div>${(FACES[+id.slice(1)] || []).length ? `<div class="faces">${FACES[+id.slice(1)].map((k) => face(k)).join("")}</div>` : ""}</div>
    <div class="meta"><span>${typo(st.who)}</span><span>${typo(st.years)}</span><span>${typo(st.place)}</span></div></header>
    ${voice}<div class="body" data-flow>${paras}</div>${quote}${letter}${margin}${vig}</section>`;
};

const contentsRows = [];
const partHtml = P.map((part, pi) => {
  const pid = `p${pi}`;
  contentsRows.push(`<li class="cp"><span>${U.part} ${part.n} · ${part.title}</span><i>${part.years}</i><b data-ref="${pid}"></b></li>`);
  const stories = part.stories.map((st) => {
    const id = `s${storyIdx}`;
    contentsRows.push(`<li><span>${typo(st.title)}</span><i></i><b data-ref="${id}"></b></li>`);
    return storyHtml(st, part);
  }).join("");
  return `<section class="page full opener" data-id="${pid}"><div class="op-in">
      <div class="op-n">${U.part} ${part.n}</div><h1>${part.title}</h1><div class="op-y">${part.years}</div>
      ${obj(part.object, "op-vig")}<p>${typo(part.intro)}</p></div></section>${stories}`;
}).join("");

const extra = [
  ["cast", U.castTitle], ["tree", U.treeTitle], ["map", U.mapTitle], ["timeline", U.timelineTitle], ["kept", U.keptTitle], ["sayings", book.sayings.title],
  ["recipes", U.kitchens], ["unknown", book.questions.title], ["ask", book.ask.title],
];
const ex = (id) => `<b data-ref="${id}"></b>`;

const RANGES = { latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD", "latin-ext": "U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF", cyrillic: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116" };
function fontFaces() {
  const faces = [["Cormorant", "cormorant-garamond", [["500", "normal"], ["600", "normal"], ["500", "italic"]]], ["Literata", "literata", [["400", "normal"], ["400", "italic"], ["600", "normal"]]], ["Caveat", "caveat", [["500", "normal"]]]];
  let out = "";
  for (const [fam, dir, ws] of faces) for (const [w, st] of ws) for (const [sub, rng] of Object.entries(RANGES))
    out += `@font-face{font-family:${fam};src:url(${FONT}/${dir}/files/${dir}-${sub}-${w}-${st}.woff2);font-weight:${w};font-style:${st};unicode-range:${rng}}\n`;
  return out;
}
const css = `
${fontFaces()}
:root{--ink:#2B2622;--paper:#FBF8F2;--green:#22372D;--green2:#2E4A3C;--gold:#B4914F;--gold2:#D9BD83;--ox:#7E2F25;--muted:#736A5F;--line:#D9CFBF;--blue:#3D5A80;
  --disp:Cormorant,Georgia,serif;--body:Literata,Georgia,serif;--hand:Caveat,cursive}
@page{size:200mm 250mm;margin:0}
*{box-sizing:border-box}
html{background:var(--paper)}
body{margin:0;font-family:var(--body);font-size:10.8pt;line-height:1.6;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact;hyphens:auto}
.mk{position:absolute;font-size:2pt;color:#fff;opacity:.01}
.page{width:200mm;height:250mm;position:relative;overflow:hidden;break-after:page;padding:22mm 36mm 26mm 26mm;background:var(--paper)}
.page.left{padding:22mm 26mm 26mm 36mm}
.page.full{padding:0}
.pnum{position:absolute;bottom:12mm;left:0;right:0;text-align:center;font-size:8pt;color:var(--muted);font-variant-numeric:lining-nums}
h1,h2,h3{font-family:var(--disp);font-weight:500;margin:0;text-wrap:balance;letter-spacing:.005em}
p{margin:0 0 .7em}
.caps{font-family:var(--disp);text-transform:uppercase;letter-spacing:.22em;font-size:9pt}

/* cover */
.cover{background:var(--green);color:var(--gold2)}
.cover .tex{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cover .frame{position:absolute;inset:12mm;border:1.2pt solid var(--gold);}
.cover .frame:after{content:"";position:absolute;inset:2.2mm;border:.5pt solid var(--gold)}
.cover .c-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6mm;padding:30mm}
.cover h1{font-size:54pt;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--gold2)}
.cover .sub{font-family:var(--disp);font-style:italic;font-size:17pt;color:#E8DCC0}
.cover .yrs{font-family:var(--disp);letter-spacing:.3em;font-size:12pt}
.cover .emb{width:58mm;height:58mm;color:var(--gold2)}
.cover .foot{position:absolute;bottom:22mm;left:0;right:0;text-align:center;font-family:var(--disp);letter-spacing:.3em;font-size:8.5pt;text-transform:uppercase;color:var(--gold)}

/* front matter */
.half{display:flex;align-items:center;justify-content:center;height:100%}
.tp{display:flex;flex-direction:column;align-items:center;text-align:center;height:100%;justify-content:center;gap:5mm}
.tp h1{font-size:46pt;letter-spacing:.04em}
.tp .crest{width:32mm}
.tp .sub{font-family:var(--disp);font-style:italic;font-size:16pt;color:var(--muted)}
.tp .by{margin-top:14mm;font-size:9pt;color:var(--muted);letter-spacing:.04em}
.ded{height:100%;display:flex;align-items:center;justify-content:center;text-align:center;font-family:var(--disp);font-style:italic;font-size:16pt;line-height:1.5;color:var(--ink)}
.toc h2{font-size:30pt;margin-bottom:8mm}
.toc ul{list-style:none;margin:0;padding:0}
.toc li{display:grid;grid-template-columns:auto 1fr auto;gap:3mm;align-items:baseline;padding:1.4mm 0;font-size:10pt}
.toc li i{border-bottom:.6pt dotted var(--line);font-style:normal;transform:translateY(-1mm)}
.toc li b{font-weight:400;font-variant-numeric:tabular-nums;color:var(--muted)}
.toc li.cp{margin-top:4.5mm;font-family:var(--disp);font-size:13pt;font-weight:600}
.toc li.cp i{border:0;font-style:italic;font-weight:500;color:var(--muted);font-size:11pt;transform:none}
.toc li.sec{margin-top:4.5mm;font-family:var(--disp);font-size:13pt;font-weight:600}
.toc li:not(.cp):not(.sec) span{padding-left:6mm}

.fw h2{font-size:30pt;margin-bottom:2mm}
.fw .by{font-family:var(--disp);font-style:italic;font-size:12pt;color:var(--muted);margin-bottom:8mm}
.fw p{text-align:justify}
.fw p.first::first-letter{font-family:var(--disp);font-size:44pt;float:left;line-height:.8;padding:1.5mm 2mm 0 0;color:var(--ox)}
.sig{font-family:var(--hand);font-size:20pt;color:var(--ox);margin-top:6mm}

.nums h2{font-size:30pt;margin-bottom:10mm}
.nums .grid{display:grid;grid-template-columns:1fr 1fr;gap:10mm 8mm}
.nums .n b{display:block;font-family:var(--disp);font-size:46pt;font-weight:500;line-height:1;color:var(--green2)}
.nums .n span{font-size:10pt;color:var(--muted)}

/* tree & map */
.tree-pg h2,.map-pg h2,.tl-pg h2{font-size:28pt}
.page.wide{padding-right:22mm}.page.wide.left{padding-left:22mm;padding-right:26mm}
.lead{color:var(--muted);font-size:9.5pt;max-width:130mm;margin:2mm 0 4mm}
svg.tree{width:100%;height:160mm;display:block;margin:0 auto}
.tree .mono{font-family:Cormorant,serif;font-size:30px;font-weight:600;fill:var(--green2)}
.tree .shah .mono{fill:var(--ox)}
.tree .nm{font-family:Literata,serif;font-size:19px;fill:var(--ink)}
.tree .yr{font-family:Literata,serif;font-size:16px;fill:var(--muted)}
.tree .sb{font-family:Cormorant,serif;font-style:italic;font-size:21px;fill:var(--muted)}
.tree .rn{font-family:Cormorant,serif;font-size:26px;fill:var(--gold)}
.tree .tl{fill:none;stroke:var(--green2);stroke-width:1.6}
.tree .tl.m{stroke-dasharray:2 4;stroke:var(--gold)}
.tree .br{font-family:Cormorant,serif;font-size:30px;font-style:italic;fill:var(--ink)}
.tree .brs{font-family:Literata,serif;font-size:16px;fill:var(--muted)}
.full.mapfull{background:#E7EEF0}
.mapfull svg.map{position:absolute;inset:0;width:100%;height:100%}
.mapfull .mt{position:absolute;left:16mm;top:14mm;background:rgba(251,248,242,.92);padding:5mm 6mm;max-width:80mm;border:.5pt solid var(--line)}
.mapfull .mt h2{font-size:24pt}
.mapfull .mt p{font-size:8.6pt;color:var(--muted);margin:2mm 0 0}
.map .sea-bg{fill:#E2EBEE}.map .grat,.world .grat{fill:none;stroke:#C9D7DC;stroke-width:.8}
.map .land{fill:#F1ECE1;stroke:#BDB29E;stroke-width:1}
.map .uk{fill:#F7F2E8;stroke:#9E927C;stroke-width:1.2}
.map .route,.world .route{fill:none;stroke:var(--ox);stroke-width:3.2;stroke-dasharray:10 7;stroke-linecap:round}
.map .route.side{stroke:var(--muted);stroke-width:2.2}
.map .route.shah{stroke:var(--gold);}
.map .dot,.world .dot{fill:var(--paper);stroke:var(--ox);stroke-width:2.4}.map .dot-in,.world .dot-in{fill:var(--ox)}
.map .pl,.world .pl{font-family:Cormorant,serif;font-weight:600;font-size:34px;fill:var(--ink)}
.map .pn,.world .pn{font-family:Literata,serif;font-style:italic;font-size:17px;fill:var(--muted)}
.world .pl.s{font-size:30px}.world .pn.s{font-size:18px}
.map .sea{font-family:Cormorant,serif;font-style:italic;font-size:20px;letter-spacing:.3em;fill:#8EA4AC}
.map .rose circle{fill:none;stroke:#9EB2B9;stroke-width:1}.map .rose path{fill:none;stroke:#7F959C;stroke-width:1.2}.map .rose .rose-n{fill:#7F959C}
.map .rose text{font-family:Cormorant,serif;font-size:22px;fill:#7F959C}
.world-pg h2{font-size:28pt}
svg.world{width:100%;height:auto;margin:4mm 0 2mm}
.world .sea-bg{fill:#E2EBEE}.world .land{fill:#F1ECE1;stroke:#BDB29E;stroke-width:.8}

/* timeline */
.tline{position:relative;margin-top:3mm}
.tline:before{content:"";position:absolute;left:19mm;top:0;bottom:0;border-left:.8pt solid var(--line)}
.te{display:grid;grid-template-columns:16mm 1fr;gap:6mm;align-items:baseline;padding:.5mm 0;position:relative;font-size:9.8pt;line-height:1.45}
.te:before{content:"";position:absolute;left:18.2mm;top:3mm;width:1.8mm;height:1.8mm;border-radius:50%;background:var(--ox)}
.te.world:before{background:var(--paper);border:.8pt solid var(--muted)}
.ty{font-family:var(--disp);font-weight:600;font-size:12pt;text-align:right;font-variant-numeric:lining-nums}
.te.world .tt{font-style:italic;color:var(--muted)}
.key{font-size:8.5pt;color:var(--muted);margin-top:5mm;display:flex;gap:8mm}
.key span:before{content:"";display:inline-block;width:2mm;height:2mm;border-radius:50%;background:var(--ox);margin-right:2mm}
.key span.w:before{background:var(--paper);border:.8pt solid var(--muted)}

/* part openers */
.opener{background:var(--green);color:#EFE6D2}
.op-in{position:absolute;inset:0;padding:34mm 28mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.op-n{font-family:var(--disp);letter-spacing:.35em;text-transform:uppercase;font-size:10pt;color:var(--gold2)}
.opener h1{font-size:58pt;font-weight:500;margin:4mm 0 2mm;color:#F5EEDC}
.op-y{font-family:var(--disp);font-style:italic;font-size:15pt;color:var(--gold2)}
.op-vig{width:48mm;height:48mm;color:var(--gold2);margin:12mm 0 10mm;--paper:var(--green)}
.opener p{font-size:10.5pt;line-height:1.65;max-width:118mm;color:#E4DAC4;text-align:center}

/* stories */
.story{}
.story header{margin-bottom:6mm}
.kicker{font-family:var(--disp);text-transform:uppercase;letter-spacing:.25em;font-size:8pt;color:var(--gold)}
.story h2{font-size:32pt;line-height:1.05;margin:2mm 0 3mm;color:var(--ink)}
.meta{display:flex;gap:2mm 5mm;flex-wrap:wrap;font-family:var(--disp);font-style:italic;font-size:11.5pt;color:var(--muted);border-bottom:.6pt solid var(--line);padding-bottom:3mm}
.meta span+span:before{content:"·";margin-right:5mm;color:var(--gold)}
.body p{text-align:justify}
.body p.first::first-letter{font-family:var(--disp);font-size:46pt;float:left;line-height:.78;padding:1.6mm 2.2mm 0 0;color:var(--ox);font-weight:500}
.voice{float:right;width:36mm;margin:1mm 0 4mm 7mm;border:.6pt solid var(--line);padding:3mm;text-align:center;background:#F4EEE2}
.voice .qr svg{width:24mm;height:24mm;display:block;margin:0 auto 2mm}
.voice b{display:block;font-family:var(--disp);font-size:11pt;font-weight:600}
.voice span{display:block;font-size:7.6pt;line-height:1.35;color:var(--muted)}
blockquote{margin:6mm 6mm 4mm;padding:0;text-align:center;break-inside:avoid}
blockquote p{font-family:var(--disp);font-style:italic;font-size:17pt;line-height:1.25;color:var(--green2);margin:0 0 2mm}
blockquote p:before{content:"“"}blockquote p:after{content:"”"}
blockquote cite{font-size:8pt;font-style:normal;color:var(--muted);letter-spacing:.04em}
.letter{margin:6mm 4mm 2mm;padding:7mm 9mm;background:#FFFDF8;border:.6pt solid var(--line);box-shadow:1.5mm 1.5mm 0 #EDE5D5;transform:rotate(-.6deg);font-family:var(--hand);font-size:15pt;line-height:1.3;color:#283A5B;break-inside:avoid;
  background-image:repeating-linear-gradient(transparent 0 7.4mm,#E3E9F0 7.4mm 7.6mm)}
.letter p{margin:0 0 1.6mm;text-align:left}
.letter .ldate{text-align:right;font-size:13pt;margin-bottom:3mm}
.note{font-family:var(--hand);font-size:15pt;color:var(--ox);margin:5mm 0 0 auto;max-width:100mm;transform:rotate(-1.5deg);text-align:right;line-height:1.2;text-wrap:balance}
.endvig{display:flex;justify-content:center;margin-top:5mm}
.vig{width:42mm;height:42mm;color:var(--green2)}
.orn{text-align:center;color:var(--gold);font-size:16pt;margin-top:4mm}

/* things we kept */
.hrow{display:flex;align-items:flex-end;gap:4mm;justify-content:space-between}.htxt{min-width:0}
.faces{display:flex;flex-shrink:0;margin-bottom:2.5mm}.faces .pt+.pt{margin-left:-3.5mm}
.pt svg{width:17mm;height:17mm;display:block}
.cast .cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:2.6mm 3mm;margin-top:2mm}
.cast figure{margin:0;text-align:center}
.cast .cp svg{width:17mm;height:17mm;display:block;margin:0 auto 1.4mm}
.cast b{display:block;font-family:var(--disp);font-size:11pt;font-weight:600;line-height:1.1}
.cast i{display:block;font-size:7.6pt;color:var(--muted);font-style:normal}
.cast span{display:block;font-family:var(--disp);font-style:italic;font-size:8.6pt;color:var(--muted);line-height:1.15}
.cast h2{font-size:28pt}
.kept h2,.say h2,.rec h2,.unk h2,.ask h2,.aft h2{font-size:28pt}
.kept .grid{display:grid;grid-template-columns:1fr 1fr;gap:4mm 10mm;margin-top:3mm}
.kept figure{margin:0;break-inside:avoid}
.kept svg{width:26mm;height:26mm;color:var(--green2);display:block}
.kept figcaption b{display:block;font-family:var(--disp);font-size:14pt;font-weight:600}
.kept figcaption span{font-size:8.4pt;color:var(--muted);line-height:1.45;display:block}

.say ul{list-style:none;padding:0;margin:8mm 0 0;display:grid;gap:6mm}
.say li q{display:block;font-family:var(--disp);font-style:italic;font-size:18pt;line-height:1.2;color:var(--green2);quotes:"“" "”"}
.say li span{font-size:8.6pt;color:var(--muted)}

.rec{}
.rec .from{font-family:var(--disp);font-style:italic;font-size:12pt;color:var(--muted);margin:1mm 0 6mm}
.rec .cols{display:grid;grid-template-columns:52mm 1fr;gap:8mm}
.rec h3{font-family:var(--disp);font-size:11pt;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:2mm}
.rec ul{margin:0;padding:0;list-style:none}.rec ul li{padding:1.2mm 0;border-bottom:.5pt solid var(--line);font-size:9.4pt}
.rec ol{margin:0;padding-left:5mm}.rec ol li{margin-bottom:2.4mm;font-size:9.6pt}
.rec .rnote{font-family:var(--hand);font-size:15pt;color:var(--ox);line-height:1.2;margin-top:6mm;transform:rotate(-1deg)}
.rec .dish{width:30mm;height:30mm;color:var(--green2);margin-top:4mm}

.unk ol{padding-left:6mm;margin-top:6mm}.unk li{margin-bottom:4mm;font-size:10pt}
.unk li::marker{font-family:var(--disp);font-weight:600;color:var(--ox)}
.ask .q{margin-top:4mm;break-inside:avoid}
.ask .q b{font-family:var(--disp);font-size:14pt;font-weight:600;font-style:italic;color:var(--green2)}
.ask .q .ln{height:6.4mm;border-bottom:.5pt solid var(--line)}
.aft p{text-align:justify}
.notes h2{font-size:28pt}.notes .ln{height:9mm;border-bottom:.5pt solid var(--line)}
.colo{position:absolute;inset:auto 0 30mm 0;text-align:center;font-size:8.4pt;color:var(--muted);line-height:1.8}

/* back cover */
.back{background:var(--green);color:#E8DCC0}
.back .b-in{position:absolute;inset:0;padding:40mm 30mm;display:flex;flex-direction:column;align-items:center;text-align:center;gap:7mm}
.back blockquote p{color:var(--gold2);font-size:20pt}
.back blockquote cite{color:#CFC2A4}
.back .blurb{font-size:10pt;line-height:1.7;max-width:118mm;color:#E4DAC4}
.back .mark{position:absolute;bottom:22mm;left:0;right:0;text-align:center;font-family:var(--disp);font-size:16pt;font-weight:600;color:var(--gold2);letter-spacing:.06em}
.back .mark span{display:block;font-family:var(--body);font-weight:400;font-size:8pt;letter-spacing:.2em;color:var(--gold);margin-top:1mm;text-transform:uppercase}
`;

const cover = `<section class="page full cover">
  <img class="tex" alt="" src="data:image/jpeg;base64,${readFileSync("cloth.b64","utf8")}">
  <div class="frame"></div>
  <div class="c-in">${treeEmblem()}<h1>${book.title}</h1><div class="sub">${book.subtitle}</div><div class="yrs">${book.years}</div></div>
  <div class="foot">${U.familyBook}</div></section>`;

function treeEmblem() {
  // gold line tree with roots, in a ring
  let br = "";
  const branch = (x, y, a, len, d) => {
    if (d === 0) return;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    br += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${(d * 0.55).toFixed(2)}"/>`;
    if (d === 1) br += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="1.6" fill="currentColor" stroke="none"/>`;
    branch(x2, y2, a - 0.42, len * 0.74, d - 1);
    branch(x2, y2, a + 0.42, len * 0.74, d - 1);
  };
  branch(100, 128, -Math.PI / 2, 30, 6);
  let roots = "";
  [[-0.5, 1], [0.5, 1], [-1.1, .8], [1.1, .8], [0, 1.1]].forEach(([dx, s]) => { roots += `<path d="M100 128 C${100 + dx * 14} ${140} ${100 + dx * 28} ${146} ${100 + dx * 40 * s} ${160 - Math.abs(dx) * 6}" stroke-width="1.6"/>`; });
  return `<svg class="emb" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="100" cy="100" r="92" stroke-width="1.2"/><circle cx="100" cy="100" r="86" stroke-width=".6"/>${br}${roots}<path d="M50 160 H150" stroke-width="1"/></g></svg>`;
}

const crest = readFileSync("crest.svg", "utf8").replace("<svg ", '<svg class="crest" ');

const html = `<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><title>The Joneses — a family book</title><style>${css}</style></head><body data-notes-title="${esc(U.notesTitle)}" data-notes-lead="${esc(U.notesLead)}">
${cover}
<section class="page full"><div class="half"><div style="font-family:var(--disp);font-size:22pt;letter-spacing:.2em;text-transform:uppercase">${book.title}</div></div></section>
<section class="page full"><div class="tp" style="padding:30mm">${crest}<h1>${book.title}</h1><div class="sub">${book.subtitle}</div><div class="caps">${book.years}</div><div class="by">${book.compiledBy}</div></div></section>
<section class="page full"><div class="ded" style="padding:30mm">${book.dedication.map((l) => (l ? typo(l) : "&nbsp;")).join("<br>")}</div></section>
<section class="toc page"><h2>${U.contents}</h2><ul data-flow>
  <li class="sec"><span>${book.foreword.title}</span><i></i>${ex("fw")}</li>
  <li class="sec"><span>${U.castTitle}</span><i></i>${ex("cast")}</li>
  <li class="sec"><span>${U.treeTitle}</span><i></i>${ex("tree")}</li>
  <li class="sec"><span>${U.mapTitle}</span><i></i>${ex("map")}</li>
  <li class="sec"><span>${U.timelineTitle}</span><i></i>${ex("timeline")}</li>
  ${contentsRows.join("")}
  ${extra.slice(3).map(([id, t]) => `<li class="sec"><span>${t}</span><i></i>${ex(id)}</li>`).join("")}
</ul></section>
<section class="fw page" data-id="fw"><h2>${book.foreword.title}</h2><div class="by">${book.foreword.by}</div>${book.foreword.paras.map((p, i) => `<p${i === 0 ? ' class="first"' : ""}>${typo(p)}</p>`).join("")}<div class="sig">${U.signature}</div></section>
<section class="nums page"><h2>${U.numbersTitle}</h2><div class="grid">${book.numbers.map(([n, t]) => `<div class="n"><b>${n}</b><span>${typo(t)}</span></div>`).join("")}</div></section>
<section class="cast page wide" data-id="cast"><h2>${U.castTitle}</h2><p class="lead">${typo(U.castLead)}</p><div class="cgrid">${book.cast.map(([k, n, y, r]) => `<figure>${face(k, "cp")}<figcaption><b>${n}</b><i>${y}</i><span>${typo(r)}</span></figcaption></figure>`).join("")}</div></section>
<section class="tree-pg page wide" data-id="tree"><h2>${U.treeTitle}</h2><p class="lead">${U.treeLead}</p>${tree()}</section>
<section class="page full mapfull" data-id="map">${ukMap()}<div class="mt"><h2>${U.mapTitle}</h2><p>${U.mapText}</p></div></section>
<section class="world-pg page wide"><h2>${U.furtherTitle}</h2><p class="lead">${U.furtherLead}</p>${worldInset()}</section>
<section class="tl-pg page" data-id="timeline"><h2>${U.timelineTitle}</h2>${timeline()}<div class="key"><span>${U.keyFamily}</span><span class="w">${U.keyWorld}</span></div></section>
${partHtml}
<section class="kept page wide" data-id="kept"><h2>${U.keptTitle}</h2><p class="lead">${U.keptLead}</p><div class="grid">
  ${U.kept.map(([k, t, d]) => `<figure>${obj(k, "")}<figcaption><b>${t}</b><span>${typo(d)}</span></figcaption></figure>`).join("")}
</div></section>
<section class="say page" data-id="sayings"><h2>${book.sayings.title}</h2><p class="lead">${typo(book.sayings.note)}</p><ul>${book.sayings.items.map(([q, s]) => `<li><q>${typo(q)}</q><span>${typo(s)}</span></li>`).join("")}</ul></section>
${book.recipes.map((r, i) => `<section class="page rec"${i === 0 ? ' data-id="recipes"' : ""}><div class="kicker">${U.kitchens}</div><h2>${typo(r.title)}</h2><div class="from">${typo(r.from)}</div><div class="cols"><div><h3>${U.youNeed}</h3><ul>${r.ingredients.map((x) => `<li>${typo(x)}</li>`).join("")}</ul></div><div><h3>${U.method}</h3><ol>${r.method.map((x) => `<li>${typo(x)}</li>`).join("")}</ol><div class="rnote">${typo(r.note)}</div></div></div></section>`).join("")}
<section class="unk page" data-id="unknown"><h2>${book.questions.title}</h2><p class="lead">${typo(book.questions.note)}</p><ol>${book.questions.items.map((q) => `<li>${typo(q)}</li>`).join("")}</ol></section>
<section class="ask page" data-id="ask"><h2>${book.ask.title}</h2><p class="lead">${typo(book.ask.note)}</p>${book.ask.items.map((q) => `<div class="q"><b>${typo(q)}</b><div class="ln"></div><div class="ln"></div></div>`).join("")}</section>
<section class="aft page"><h2>${book.afterword.title}</h2>${book.afterword.paras.map((p) => `<p>${typo(p)}</p>`).join("")}</section>
<section class="page full" data-id="colo"><div class="colo">${book.colophon.map(typo).join("<br>")}</div></section>
<section class="page full back"><div class="b-in"><blockquote><p>${typo(U.backQuote)}</p><cite>${U.backQuoteBy}</cite></blockquote>
<div class="blurb">${typo(U.backBlurb)}</div></div>
<div class="mark">Treename<span>${U.tagline}</span></div></section>
<script src="paginate.js"></script></body></html>`;
writeFileSync("book.html", html);
console.log("ok", html.length);
