import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, LANGS, HREFLANG } from "@/i18n";
import type { Lang } from "@/i18n/config";
import BookReader from "@/components/BookReader";
import PageView from "@/components/PageView";
import BookArt, { type BookScene } from "@/components/BookArt";
import CrestSvg from "@/components/CrestSvg";
import BookMap from "@/components/BookMap";
import { FaceSvg } from "@/components/Face";
import { sampleBook, storyArt, SAMPLE_PDF, type SampleBookText, type Person } from "@/lib/sampleBook";
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

/** A photograph: the generated picture when there is one, otherwise the drawing. */
function Photo({ has, lang, slot, art, year, seed, caption, tilt, v, wide }: { has: boolean; lang: Lang; slot: string; art: BookScene; year: number; seed: string; caption: string; tilt: number; v: string; wide?: boolean }) {
  return (
    <figure className={`sb-photo${wide ? " sb-photo-wide" : ""}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
      {has
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={sampleUrl(lang, slot, v)} alt={caption} loading="lazy" width={1536} height={1024} className="sb-img" />
        : <BookArt seed={`${seed}-${slot}`} scene={art} year={year} title={caption} />}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** The family line drawn as a real tree: the oldest couple at the roots, the children in the crown. */
function TreeDrawing({ b, lang }: { b: SampleBookText; lang: Lang }) {
  const W = 600, H = 900, cx = 300;
  const rows = b.line.length + 1;
  const top = 120, bottom = 800;
  const step = (bottom - top) / (rows - 1);
  const y = (gen: number) => bottom - gen * step; // gen 0 = oldest
  const first = (s: string) => s.split(" ")[0];
  const leaves = Array.from({ length: 46 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180, r = 40 + ((i * 53) % 220);
    return { x: cx + Math.cos(a) * r * 1.15, y: 150 + Math.sin(a) * r * 0.55 - 20, rot: (i * 47) % 180, s: 0.8 + ((i * 7) % 5) / 10 };
  });
  const Medal = ({ x, yy, p, g, k }: { x: number; yy: number; p: Person; g: "m" | "f"; k: string }) => {
    const [fn, ...rest] = p[0].split(" ");
    return (
      <g key={k}>
        <circle cx={x} cy={yy} r="33" fill="#FFFDF7" stroke="#6E5A3A" strokeWidth="2" />
        <g transform={`translate(${x - 28} ${yy - 28})`}>
          <FaceSvg p={{ id: `tr-${lang}-${k}`, firstName: fn, lastName: rest.join(" "), gender: g, ...yearsOf(p[1]) }} size={56} idSuffix={`tr${lang}`} />
        </g>
        <text x={x} y={yy + 52} textAnchor="middle" fontSize="21" fontWeight="600" fill="#2A2420" fontFamily="var(--display, Georgia, serif)">{first(p[0])}</text>
        <text x={x} y={yy + 73} textAnchor="middle" fontSize="17" fill="#6B5D4B" fontFamily="var(--display, Georgia, serif)">{p[1]}</text>
      </g>
    );
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sb-treedraw" role="img" aria-label={b.treeTitle}>
      <ellipse cx={cx} cy="870" rx="250" ry="18" fill="#E7DCC4" />
      <path d="M300 868 C240 872 200 882 170 890 M300 868 C360 872 400 882 430 890 M300 868 C290 880 280 888 262 896" stroke="#7A5C3E" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d={`M272 870 C284 700 290 400 296 ${top - 10} L304 ${top - 10} C310 400 316 700 328 870 Z`} fill="#8A6A48" />
      <path d={`M292 860 C294 700 296 450 299 ${top}`} stroke="#A98A64" strokeWidth="3" fill="none" />
      <g opacity=".55">
        {[[300, 150, 190], [170, 220, 120], [430, 220, 120], [230, 110, 110], [370, 110, 110], [300, 300, 150], [150, 360, 90], [450, 360, 90]].map(([x, yy, r], i) => <circle key={i} cx={x} cy={yy} r={r} fill={i % 2 ? "#C9D9AE" : "#D7E4BF"} />)}
      </g>
      {leaves.map((l, i) => <ellipse key={i} cx={l.x} cy={l.y} rx={14 * l.s} ry={7 * l.s} transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill={i % 3 ? "#9DB27F" : "#7E9466"} opacity=".9" />)}
      {b.line.map((g, i) => {
        const yy = y(i);
        return (
          <g key={i}>
            <path d={`M300 ${yy + 6} C260 ${yy + 2} 220 ${yy - 4} 172 ${yy}`} stroke="#8A6A48" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d={`M300 ${yy + 6} C340 ${yy + 2} 380 ${yy - 4} 428 ${yy}`} stroke="#8A6A48" strokeWidth="7" strokeLinecap="round" fill="none" />
            <ellipse cx="214" cy={yy - 12} rx="12" ry="6" transform={`rotate(-25 214 ${yy - 12})`} fill="#9DB27F" />
            <ellipse cx="386" cy={yy - 12} rx="12" ry="6" transform={`rotate(25 386 ${yy - 12})`} fill="#9DB27F" />
            <text x="40" y={yy + 8} fontSize="24" fill="#B4613A" fontStyle="italic" fontFamily="var(--display, Georgia, serif)">{ROMAN[i]}</text>
            <Medal x={150} yy={yy} p={g.h} g="m" k={`h${i}`} />
            <Medal x={450} yy={yy} p={g.w} g="f" k={`w${i}`} />
          </g>
        );
      })}
      <text x="40" y={y(b.line.length) + 8} fontSize="24" fill="#B4613A" fontStyle="italic" fontFamily="var(--display, Georgia, serif)">{ROMAN[b.line.length]}</text>
      {b.children.map((c, i) => {
        const n = b.children.length, x = n === 1 ? cx : 220 + (160 * i) / Math.max(1, n - 1);
        return (
          <g key={c[0]}>
            <path d={`M300 ${y(b.line.length) + 30} Q${(300 + x) / 2} ${y(b.line.length) + 30} ${x} ${y(b.line.length) + 10}`} stroke="#8A6A48" strokeWidth="5" fill="none" />
            <Medal x={x} yy={y(b.line.length)} p={c} g={i % 2 ? "m" : "f"} k={`c${i}`} />
          </g>
        );
      })}
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
      <TreeDrawing b={b} lang={lang} />
      <p className="sb-note">{b.treeNote}</p>
      <Folio n={3} />
    </article>,

    <article key="family" className="sb-p sb-familypage">
      <Photo has={has.has("family")} lang={lang} slot="family" art="portrait" year={b.family.year} seed={`fam-${lang}`} caption={b.family.caption} tilt={-1.2} v={v} wide />
      <p className="sb-small">{b.photoNote}</p>
      <Folio n={4} />
    </article>,

    <article key="map" className="sb-p">
      <h2 className="sb-h">{b.mapTitle}</h2>
      <BookMap b={b} />
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
        <Photo has={has.has(`s${i}`)} lang={lang} slot={`s${i}`} art={storyArt(lang, i)} year={s.year} seed={`sb-${lang}-${i}`} caption={s.caption} tilt={i % 2 ? 1.4 : -1.6} v={v} />
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
      <Photo has={has.has("recipe")} lang={lang} slot="recipe" art="dish" year={2026} seed={`rc-${lang}`} caption={b.recipe.title} tilt={1.2} v={v} />
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
      <p><a className="sb-pdf" href={SAMPLE_PDF[lang].href} download>{SAMPLE_PDF[lang].label}</a></p>
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
      <PageView name="sample_book_opened" lang={lang} />
      <header className="sb-top">
        <Link href={`/${lang}`} className="sb-back">{ui.back}</Link>
        <p className="sb-eyebrow">{ui.eyebrow} · {b.title}</p>
        <a className="sb-pdf-top" href={SAMPLE_PDF[lang].href} download title={SAMPLE_PDF[lang].note}>PDF ↓</a>
        <Link href={`/${lang}/start`} className="btn btn-primary btn-sm">{ui.start}</Link>
      </header>
      <BookReader pages={pages} labels={{ prev: ui.prev, next: ui.next, page: ui.page, of: ui.of, hint: ui.hint, open: ui.open }} />
    </main>
  );
}
