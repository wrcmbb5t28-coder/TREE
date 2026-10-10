import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, LANGS, HREFLANG } from "@/i18n";
import type { Lang } from "@/i18n/config";
import BookReader from "@/components/BookReader";
import StoryArt, { type Scene } from "@/components/StoryArt";
import CrestSvg from "@/components/CrestSvg";
import { FaceSvg } from "@/components/Face";
import { sampleBook, type SampleBookText, type Person } from "@/lib/sampleBook";
import { existingSamples, sampleUrl } from "@/lib/sampleImages";

export const dynamicParams = false;
export const revalidate = 600; // new pictures appear without a redeploy
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

const Q: Record<Lang, [string, string]> = { ru: ["«", "»"], fr: ["« ", " »"], it: ["«", "»"], es: ["«", "»"], de: ["„", "“"], en: ["“", "”"] };
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const yearsOf = (s: string) => { const [b, d] = s.split("–"); return { birthYear: +b, deathYear: d ? +d : null }; };
const Folio = ({ n }: { n: number }) => <span className="sb-folio">{n}</span>;

function face(p: Person, gender: "m" | "f", lang: Lang) {
  const [first, ...rest] = p[0].split(" ");
  return <FaceSvg p={{ id: `sb-${lang}-${p[0]}`, firstName: first, lastName: rest.join(" "), gender, ...yearsOf(p[1]) }} size={34} idSuffix={`sb${lang}`} />;
}

/** A photograph: the generated picture when there is one, otherwise the drawing. */
function Photo({ has, lang, slot, scene, seed, caption, tilt, v, wide }: { has: boolean; lang: Lang; slot: string; scene: Scene; seed: string; caption: string; tilt: number; v: string; wide?: boolean }) {
  return (
    <figure className={`sb-photo${wide ? " sb-photo-wide" : ""}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
      {has
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={sampleUrl(lang, slot, v)} alt={caption} loading="lazy" width={1536} height={1024} className="sb-img" />
        : <StoryArt seed={seed} scene={scene} idSuffix={`${slot}${lang}`} title={caption} />}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function MapSvg({ b }: { b: SampleBookText }) {
  const W = 400, H = 230, pad = 34;
  const lat0 = b.stops.reduce((a, s) => a + s.lat, 0) / b.stops.length;
  const k = Math.cos((lat0 * Math.PI) / 180);
  const xs = b.stops.map((s) => s.lon * k), ys = b.stops.map((s) => -s.lat);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const sc = Math.min((W - pad * 2) / Math.max(x1 - x0, 0.01), (H - pad * 2) / Math.max(y1 - y0, 0.01));
  const ox = (W - (x1 - x0) * sc) / 2, oy = (H - (y1 - y0) * sc) / 2;
  const pts = b.stops.map((s, i) => ({ x: ox + (xs[i] - x0) * sc, y: oy + (ys[i] - y0) * sc, s }));
  // towns a few kilometres apart would sit on one dot: push them apart a little
  for (let it = 0; it < 30; it++) for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y, d = Math.hypot(dx, dy) || 0.01;
    if (d < 22) { const m = (22 - d) / 2, ux = dx / d || 1, uy = dy / d; pts[i].x -= ux * m; pts[i].y -= uy * m; pts[j].x += ux * m; pts[j].y += uy * m; }
  }
  // labels: the first of above / below / right / left that hits no other label or dot
  type Box = [number, number, number, number];
  const hit = (a: Box, c: Box) => a[0] < c[2] && c[0] < a[2] && a[1] < c[3] && c[1] < a[3];
  const taken: Box[] = [...pts.map((p): Box => [p.x - 6, p.y - 6, p.x + 6, p.y + 6]), [W - 40, 2, W - 2, 40]];
  const labels = pts.map((p) => {
    const w = (p.s.name.length + 5) * 5.4, h = 11;
    const opts: [number, number, "start" | "middle" | "end"][] = [[0, -9, "middle"], [0, 16, "middle"], [9, 4, "start"], [-9, 4, "end"]];
    for (const [dx, dy, an] of opts) {
      const x = p.x + dx, y = p.y + dy;
      const bx: Box = an === "middle" ? [x - w / 2, y - h, x + w / 2, y + 2] : an === "start" ? [x, y - h, x + w, y + 2] : [x - w, y - h, x, y + 2];
      if (bx[0] < 2 || bx[2] > W - 2 || bx[1] < 2 || bx[3] > H - 2) continue;
      if (!taken.some((t) => hit(t, bx))) { taken.push(bx); return { x, y, an }; }
    }
    return { x: p.x, y: p.y - 9, an: "middle" as const };
  });
  const seg = (a: { x: number; y: number }, c: { x: number; y: number }, i: number) => {
    const bend = i % 2 ? 0.16 : -0.16;
    const mx = (a.x + c.x) / 2 - (c.y - a.y) * bend, my = (a.y + c.y) / 2 + (c.x - a.x) * bend;
    return `Q${mx.toFixed(1)} ${my.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  };
  const route = pts.map((p, i) => (i ? seg(pts[i - 1], p, i) : `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`)).join(" ");
  const side = b.side ? pts[b.side.from] : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sb-map" role="img" aria-label={b.mapTitle}>
      {Array.from({ length: 9 }, (_, i) => <path key={`v${i}`} d={`M${i * 50} 0 V${H}`} className="sb-grid" />)}
      {Array.from({ length: 5 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 57} H${W}`} className="sb-grid" />)}
      <path d={route} className="sb-route" />
      {side && b.side && (
        <>
          <path d={`M${side.x} ${side.y} Q ${b.side.dir === "w" ? side.x - 60 : side.x + 60} ${H - 6} ${b.side.dir === "w" ? 6 : W - 6} ${H - 16}`} className="sb-route sb-side" />
          <text x={b.side.dir === "w" ? 8 : W - 8} y={H - 22} textAnchor={b.side.dir === "w" ? "start" : "end"} className="sb-side-t">{b.side.label}</text>
        </>
      )}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.6" className="sb-dot" />
          <text x={labels[i].x} y={labels[i].y} textAnchor={labels[i].an} className="sb-place">{p.s.name} <tspan className="sb-year">{p.s.year}</tspan></text>
        </g>
      ))}
      <g transform={`translate(${W - 22} 22)`} className="sb-compass"><circle r="12" /><path d="M0 -10 L3 0 L0 10 L-3 0 Z" /><text y="-15" textAnchor="middle">N</text></g>
    </svg>
  );
}

function Qr() {
  const rows = ["1110111", "1010101", "1110111", "0001000", "1101011", "0110101", "1011101"];
  return (
    <svg width="44" height="44" viewBox="0 0 7 7" aria-hidden="true" shapeRendering="crispEdges">
      {rows.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill="#2A2420" /> : null)))}
    </svg>
  );
}

export default async function SampleBook({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const b = sampleBook(lang);
  const ui = b.ui;
  const has = await existingSamples(lang);
  const v = Math.floor(Date.now() / 36e5).toString(36); // changes hourly, so remade pictures show up
  const first = 7, storyPage = (i: number) => first + i * 2, recipePage = storyPage(b.stories.length);
  const facts = [b.line.length + 1, b.line.length * 2 + b.children.length + b.relatives, b.stops.length, b.stories.length];

  const pages = [
    <div key="cover" className="sb-cover">
      <div className="sb-cover-frame">
        <CrestSvg c={{ ...b.crest, motto: b.motto }} size={150} idSuffix={`cover-${lang}`} title={b.title} />
        <h1 className="sb-cover-title">{b.title}</h1>
        <p className="sb-cover-sub">{b.subtitle}</p>
        <p className="sb-cover-years">{b.years}</p>
      </div>
      <span className="sb-cover-brand">Treename</span>
    </div>,

    <article key="title" className="sb-p sb-titlepage">
      <CrestSvg c={{ ...b.crest, motto: "" }} size={64} idSuffix={`t-${lang}`} title={b.title} />
      <h2>{b.title}</h2>
      <p className="sb-sub">{b.subtitle}</p>
      <p className="sb-years">{b.years}</p>
      <p className="sb-dedication">{b.dedication.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</p>
      <Folio n={1} />
    </article>,

    <article key="toc" className="sb-p">
      <h2 className="sb-h">{b.contents}</h2>
      <ol className="sb-toc">
        <li><span>{b.treeTitle}</span><i /><b>3</b></li>
        <li><span>{b.mapTitle}</span><i /><b>5</b></li>
        {b.stories.map((s, i) => <li key={i}><span><small>{ROMAN[i]}.</small> {s.title}</span><i /><b>{storyPage(i)}</b></li>)}
        <li><span>{b.recipe.chapter}</span><i /><b>{recipePage}</b></li>
      </ol>
      <Folio n={2} />
    </article>,

    <article key="line" className="sb-p">
      <h2 className="sb-h">{b.treeTitle}</h2>
      <ol className="sb-line">
        {b.line.map((g, i) => (
          <li key={i} className="sb-gen">
            <span className="sb-roman">{ROMAN[i]}</span>
            <span className="sb-pair">{face(g.h, "m", lang)}{face(g.w, "f", lang)}</span>
            <span className="sb-names"><b>{g.h[0]}</b> <em>{g.h[1]}</em><br /><b>{g.w[0]}</b> <em>{g.w[1]}</em></span>
          </li>
        ))}
      </ol>
      <div className="sb-kids">
        <span className="sb-roman">{ROMAN[b.line.length]}</span>
        {b.children.map((c, i) => (
          <span key={c[0]} className="sb-kid">{face(c, i % 2 ? "m" : "f", lang)} <b>{c[0]}</b> <em>{c[1]}</em></span>
        ))}
      </div>
      <p className="sb-note">{b.treeNote}</p>
      <Folio n={3} />
    </article>,

    <article key="family" className="sb-p sb-familypage">
      <Photo has={has.has("family")} lang={lang} slot="family" scene={b.family.scene} seed={`fam-${lang}`} caption={b.family.caption} tilt={-1.2} v={v} wide />
      <p className="sb-small">{b.photoNote}</p>
      <Folio n={4} />
    </article>,

    <article key="map" className="sb-p">
      <h2 className="sb-h">{b.mapTitle}</h2>
      <MapSvg b={b} />
      <ol className="sb-stops">{b.stops.map((s, i) => <li key={i}><b>{s.year}</b> {s.name} — {s.label}</li>)}</ol>
      <Folio n={5} />
    </article>,

    <article key="numbers" className="sb-p sb-numbers">
      <p className="sb-mapnote">{b.mapNote}</p>
      <dl className="sb-facts">{facts.map((n, i) => <div key={i}><dt>{n}</dt><dd>{ui.facts[i]}</dd></div>)}</dl>
      <CrestSvg c={{ ...b.crest, motto: b.motto }} size={110} idSuffix={`n-${lang}`} title={b.title} />
      <Folio n={6} />
    </article>,

    ...b.stories.flatMap((s, i) => [
      <article key={`s${i}l`} className="sb-p sb-left">
        <p className="sb-chapter">{ui.chapter} {ROMAN[i]} · {s.chapter}</p>
        <Photo has={has.has(`s${i}`)} lang={lang} slot={`s${i}`} scene={s.scene} seed={`sb-${lang}-${i}`} caption={s.caption} tilt={i % 2 ? 1.4 : -1.6} v={v} />
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

    <article key="r1" className="sb-p sb-left sb-recipe-left">
      <p className="sb-chapter">{b.recipe.chapter}</p>
      <h3 className="sb-title sb-center">{b.recipe.title}</h3>
      <p className="sb-who sb-center">{b.recipe.who}</p>
      <Photo has={has.has("recipe")} lang={lang} slot="recipe" scene="house" seed={`rc-${lang}`} caption={b.recipe.title} tilt={1.2} v={v} />
      <Folio n={recipePage} />
    </article>,
    <article key="r2" className="sb-p sb-right">
      <div className="sb-card">
        <p className="sb-card-h">{b.recipe.ingredientsTitle}</p>
        <ul>{b.recipe.ingredients.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <p className="sb-text sb-recipe-text">{b.recipe.text}</p>
      <p className="sb-hand">{b.recipe.note}</p>
      <Folio n={recipePage + 1} />
    </article>,

    <article key="end" className="sb-p sb-end">
      <p className="sb-orn" aria-hidden="true">❦</p>
      <h2>{b.endTitle}</h2>
      <p>{b.endText}</p>
      <p><Link className="btn btn-primary" href={`/${lang}/start`}>{ui.start}</Link></p>
      <Folio n={recipePage + 2} />
    </article>,
    <article key="colophon" className="sb-p sb-colophon">
      <CrestSvg c={{ ...b.crest, motto: "" }} size={48} idSuffix={`c-${lang}`} title={b.title} />
      <p>{b.colophon}</p>
      <p className="sb-small">{b.photoNote}</p>
      <Folio n={recipePage + 3} />
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
