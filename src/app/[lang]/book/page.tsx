import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, LANGS, HREFLANG } from "@/i18n";
import type { Lang } from "@/i18n/config";
import BookReader from "@/components/BookReader";
import StoryArt from "@/components/StoryArt";
import CrestSvg from "@/components/CrestSvg";
import { FaceSvg } from "@/components/Face";
import type { CrestConfig } from "@/lib/crest";
import { sampleBook, LINE, CHILDREN, STOPS, type SampleBookText } from "@/lib/sampleBook";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const b = sampleBook(lang);
  return {
    title: `${b.title} — ${b.ui.eyebrow} | Treename`,
    description: b.ui.lead,
    alternates: { canonical: `/${lang}/book`, languages: Object.fromEntries(LANGS.map((l) => [HREFLANG[l], `/${l}/book`])) },
  };
}

const CREST: CrestConfig = { shape: "heater", division: "plain", field: "azure", field2: "argent", ordinary: "chief", ordinaryColor: "or", charges: ["gear", "wheat", "wheat"], chargeColor: "or", motto: "" };
const Q: Record<Lang, [string, string]> = { ru: ["«", "»"], fr: ["« ", " »"], it: ["«", "»"], es: ["«", "»"], de: ["„", "“"], en: ["“", "”"] };
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

const yearsOf = (s: string) => { const [b, d] = s.split("–"); return { birthYear: +b, deathYear: d ? +d : null }; };

function Folio({ n }: { n: number }) {
  return <span className="sb-folio">{n}</span>;
}

/** A couple in the line: two drawn portraits, names and years. */
function Gen({ i, g, lang }: { i: number; g: (typeof LINE)[number]; lang: Lang }) {
  const face = (who: [string, string], gender: "m" | "f") => {
    const [first, ...rest] = who[0].split(" ");
    return <FaceSvg p={{ id: `sb-${who[0]}`, firstName: first, lastName: rest.join(" "), gender, ...yearsOf(who[1]) }} size={34} idSuffix={`sb${lang}`} />;
  };
  return (
    <li className="sb-gen">
      <span className="sb-roman">{ROMAN[i]}</span>
      <span className="sb-pair">
        {face(g.h, "m")}{face(g.w, "f")}
      </span>
      <span className="sb-names">
        <b>{g.h[0]}</b> <em>{g.h[1]}</em><br />
        <b>{g.w[0]}</b> <em>{g.w[1]}</em>
      </span>
    </li>
  );
}

function MapSvg({ b }: { b: SampleBookText }) {
  // Longitude on a square-root scale: the four stops in Switzerland and Germany would otherwise sit on one dot.
  const W = 400, H = 230;
  const P = (lon: number, lat: number) => ({ x: 22 + Math.sqrt(Math.max(0, lon - 3) / 75) * (W - 50), y: 18 + ((57 - lat) / (57 - 44)) * (H - 52) });
  const pts = STOPS.map(([lon, lat, y], i) => ({ ...P(lon, lat), y0: y, name: b.stops[i].split(/ [—–] /)[0] }));
  // where each label sits: [dx, dy, anchor]
  const LBL: [number, number, "start" | "middle" | "end"][] = [[-7, 9, "end"], [-7, 2, "end"], [0, -9, "middle"], [0, 15, "middle"], [0, -9, "middle"], [0, 16, "middle"], [-7, -5, "end"], [7, 10, "start"]];
  const seg = (a: { x: number; y: number }, c: { x: number; y: number }, bend: number) => {
    const mx = (a.x + c.x) / 2, my = (a.y + c.y) / 2, dx = c.x - a.x, dy = c.y - a.y;
    return `Q${(mx - dy * bend).toFixed(1)} ${(my + dx * bend).toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  };
  const out = pts.slice(0, 6).map((p, i) => (i ? seg(pts[i - 1], p, 0.12) : `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`)).join(" ");
  const back = `M${pts[5].x.toFixed(1)} ${pts[5].y.toFixed(1)} ${seg(pts[5], pts[6], -0.28)} ${seg(pts[6], pts[7], 0.3)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sb-map" role="img" aria-label={b.mapTitle}>
      {Array.from({ length: 9 }, (_, i) => <path key={`v${i}`} d={`M${i * 50} 0 V${H}`} className="sb-grid" />)}
      {Array.from({ length: 5 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 57} H${W}`} className="sb-grid" />)}
      <path d={out} className="sb-route" />
      <path d={back} className="sb-route sb-back-route" />
      {/* Johann's road to Nebraska leaves the map to the west */}
      <path d={`M${pts[3].x} ${pts[3].y} Q ${pts[3].x - 70} ${H - 8} 4 ${H - 22}`} className="sb-route sb-side" />
      <text x="6" y={H - 28} className="sb-side-t">← Nebraska, 1903</text>
      {pts.map((p, i) => {
        const [dx, dy, a] = LBL[i];
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.4" className="sb-dot" />
            <text x={p.x + dx} y={p.y + dy} textAnchor={a} className="sb-place">{p.name} <tspan className="sb-year">{p.y0}</tspan></text>
          </g>
        );
      })}
      <g transform={`translate(${W - 24} ${H - 24})`} className="sb-compass"><circle r="12" /><path d="M0 -10 L3 0 L0 10 L-3 0 Z" /><text y="-15" textAnchor="middle">N</text></g>
    </svg>
  );
}

function Qr() {
  const rows = ["1110111", "1010101", "1110111", "0001000", "1101011", "0110101", "1011101"];
  return (
    <svg width="44" height="44" viewBox="0 0 7 7" aria-hidden="true" shapeRendering="crispEdges">
      {rows.flatMap((row, y) => [...row].map((v, x) => (v === "1" ? <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill="#2A2420" /> : null)))}
    </svg>
  );
}

export default async function SampleBook({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const b = sampleBook(lang);
  const ui = b.ui;
  const storyPage = (i: number) => 7 + i * 2;
  const people = 131, countries = 8, generations = LINE.length + 1;

  const pages = [
    // 0 — the cover
    <div key="cover" className="sb-cover">
      <div className="sb-cover-frame">
        <CrestSvg c={{ ...CREST, motto: b.motto }} size={150} idSuffix={`cover-${lang}`} title={b.title} />
        <h1 className="sb-cover-title">{b.title}</h1>
        <p className="sb-cover-sub">{b.subtitle}</p>
        <p className="sb-cover-years">{b.years}</p>
      </div>
      <span className="sb-cover-brand">Treename</span>
    </div>,

    // 1 — title page with dedication
    <article key="title" className="sb-p sb-titlepage">
      <CrestSvg c={{ ...CREST, motto: "" }} size={64} idSuffix={`t-${lang}`} title={b.title} />
      <h2>{b.title}</h2>
      <p className="sb-sub">{b.subtitle}</p>
      <p className="sb-years">{b.years}</p>
      <p className="sb-dedication">{b.dedication.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</p>
      <Folio n={1} />
    </article>,

    // 2 — contents
    <article key="toc" className="sb-p">
      <h2 className="sb-h">{b.contents}</h2>
      <ol className="sb-toc">
        <li><span>{b.treeTitle}</span><i /><b>3</b></li>
        <li><span>{b.mapTitle}</span><i /><b>5</b></li>
        {b.stories.map((s, i) => <li key={i}><span><small>{ROMAN[i]}.</small> {s.title}</span><i /><b>{storyPage(i)}</b></li>)}
        <li><span>{b.recipe.chapter}</span><i /><b>{storyPage(b.stories.length)}</b></li>
      </ol>
      <Folio n={2} />
    </article>,

    // 3–4 — the line
    <article key="tree1" className="sb-p">
      <h2 className="sb-h">{b.treeTitle}</h2>
      <ol className="sb-line">{LINE.slice(0, 7).map((g, i) => <Gen key={i} i={i} g={g} lang={lang} />)}</ol>
      <Folio n={3} />
    </article>,
    <article key="tree2" className="sb-p">
      <ol className="sb-line" start={8}>{LINE.slice(7).map((g, i) => <Gen key={i} i={i + 7} g={g} lang={lang} />)}</ol>
      <div className="sb-kids">
        <span className="sb-roman">{ROMAN[14]}</span>
        {CHILDREN.map(([n, y]) => (
          <span key={n} className="sb-kid"><FaceSvg p={{ id: `sb-${n}`, firstName: n, gender: n === "Leon" ? "m" : "f", birthYear: +y }} size={34} idSuffix={`sb${lang}`} /> <b>{n}</b> <em>{y}</em></span>
        ))}
      </div>
      <p className="sb-note">{b.treeNote}</p>
      <Folio n={4} />
    </article>,

    // 5–6 — the road and the numbers
    <article key="map" className="sb-p">
      <h2 className="sb-h">{b.mapTitle}</h2>
      <MapSvg b={b} />
      <ol className="sb-stops">{b.stops.map((s, i) => <li key={i}><b>{STOPS[i][2]}</b> {s}</li>)}</ol>
      <Folio n={5} />
    </article>,
    <article key="numbers" className="sb-p sb-numbers">
      <p className="sb-mapnote">{b.mapNote}</p>
      <dl className="sb-facts">
        {[generations, people, countries, b.stories.length + 1].map((v, i) => <div key={i}><dt>{v}</dt><dd>{ui.facts[i]}</dd></div>)}
      </dl>
      <figure className="sb-photo sb-photo-wide" style={{ transform: "rotate(1.2deg)" }}>
        <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
        <StoryArt seed="sb-family" scene="house" idSuffix={`fam${lang}`} />
        <figcaption>{b.stories[9].caption.replace(/,.*$/, "")} · 2026</figcaption>
      </figure>
      <Folio n={6} />
    </article>,

    // 7… — one spread per story: picture on the left, text on the right
    ...b.stories.flatMap((s, i) => [
      <article key={`s${i}l`} className="sb-p sb-left">
        <p className="sb-chapter">{ui.chapter} {ROMAN[i]} · {s.chapter}</p>
        <figure className="sb-photo" style={{ transform: `rotate(${i % 2 ? 1.4 : -1.6}deg)` }}>
          <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
          <StoryArt seed={`sb-${i}`} scene={s.scene} idSuffix={`sb${i}${lang}`} title={s.caption} />
          <figcaption>{s.caption}</figcaption>
        </figure>
        {s.quote ? <blockquote className="sb-quote">{Q[lang][0]}{s.quote}{Q[lang][1]}</blockquote> : <p className="sb-orn" aria-hidden="true">❦</p>}
        <Folio n={storyPage(i)} />
      </article>,
      <article key={`s${i}r`} className="sb-p sb-right">
        <h3 className="sb-title">{s.title}</h3>
        <p className="sb-who">{s.who}</p>
        <p className="sb-text">{s.text}</p>
        {s.voice && <div className="sb-voice"><Qr /><span><b>{ui.listen}</b><br />{s.voice}</span></div>}
        <Folio n={storyPage(i) + 1} />
      </article>,
    ]),

    // the recipe
    <article key="r1" className="sb-p sb-left">
      <p className="sb-chapter">{b.recipe.chapter}</p>
      <h3 className="sb-title">{b.recipe.title}</h3>
      <p className="sb-who">{b.recipe.who}</p>
      <div className="sb-card">
        <p className="sb-card-h">{b.recipe.ingredientsTitle}</p>
        <ul>{b.recipe.ingredients.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <svg className="sb-cherries" viewBox="0 0 80 60" aria-hidden="true">
        <path d="M40 6 C34 18 26 26 20 38 M40 6 C44 20 52 28 58 40" fill="none" stroke="#5E7A3A" strokeWidth="2" />
        <path d="M40 6 C48 2 58 4 62 10 C54 12 46 10 40 6 Z" fill="#7C9A55" />
        <circle cx="19" cy="45" r="11" fill="#A33A2E" /><circle cx="59" cy="47" r="11" fill="#A33A2E" />
        <circle cx="15" cy="41" r="3" fill="#fff" opacity=".35" /><circle cx="55" cy="43" r="3" fill="#fff" opacity=".35" />
      </svg>
      <Folio n={storyPage(b.stories.length)} />
    </article>,
    <article key="r2" className="sb-p sb-right">
      <p className="sb-text">{b.recipe.text}</p>
      <p className="sb-hand">{b.recipe.note}</p>
      <Folio n={storyPage(b.stories.length) + 1} />
    </article>,

    // the end
    <article key="end" className="sb-p sb-end">
      <p className="sb-orn" aria-hidden="true">❦</p>
      <h2>{b.endTitle}</h2>
      <p>{b.endText}</p>
      <p><Link className="btn btn-primary" href={`/${lang}/start`}>{ui.start}</Link></p>
      <Folio n={storyPage(b.stories.length) + 2} />
    </article>,
    <article key="colophon" className="sb-p sb-colophon">
      <CrestSvg c={{ ...CREST, motto: "" }} size={48} idSuffix={`c-${lang}`} title={b.title} />
      <p>{b.colophon}</p>
      <Folio n={storyPage(b.stories.length) + 3} />
    </article>,
  ];

  return (
    <main className="sb-root" lang={lang}>
      <header className="sb-top">
        <Link href={`/${lang}`} className="sb-back">{ui.back}</Link>
        <p className="sb-eyebrow">{ui.eyebrow} · {b.title}</p>
        <Link href={`/${lang}/start`} className="btn btn-primary btn-sm">{ui.start}</Link>
      </header>
      <BookReader pages={pages} labels={{ prev: ui.prev, next: ui.next, page: ui.page, of: ui.of, hint: ui.hint, open: ui.open }} />
    </main>
  );
}
