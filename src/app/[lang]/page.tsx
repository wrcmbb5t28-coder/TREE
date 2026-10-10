import type { Metadata } from "next";
import StoryArt from "@/components/StoryArt";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLang, LANGS, HREFLANG } from "@/i18n";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import HeroDemo from "@/components/HeroDemo";
import TreeView from "@/components/TreeView";
import CrestSvg from "@/components/CrestSvg";
import type { CrestConfig } from "@/lib/crest";
import { appUrl } from "@/lib/util";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries([...LANGS.map((l) => [HREFLANG[l], `/${l}`]), ["x-default", "/en"]]),
    },
    openGraph: { title: t.meta.title, description: t.meta.description, url: `/${lang}`, siteName: "Treename", locale: lang, type: "website" },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
  };
}

/** Example crests for the three sample family lines. */
const SAMPLE_CRESTS: CrestConfig[] = [
  { shape: "heater", division: "plain", field: "azure", field2: "argent", ordinary: "chief", ordinaryColor: "argent", charges: ["anchor", "star", "star"], chargeColor: "or", motto: "" },
  { shape: "french", division: "plain", field: "vert", field2: "or", ordinary: "bordure", ordinaryColor: "or", charges: ["wheat", "wheat", "sun"], chargeColor: "or", motto: "" },
  { shape: "heater", division: "pale", field: "gules", field2: "or", ordinary: "none", ordinaryColor: "argent", charges: ["book", "feather"], chargeColor: "argent", motto: "" },
];
const SAMPLE_GENDERS = ["m", "f", "m", "f", "m", "f", "m", "f"];

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const h = t.home;
  const start = `/${lang}/start`;

  // The example family, drawn by the real tree component.
  const sp = h.sample.people;
  const gens = [-2, -2, -2, -2, -1, -1, 0, 0];
  const people = sp.map((p, i) => ({
    id: `s${i}`, firstName: p.first, lastName: p.last, birthYear: p.born, birthPlace: p.place, generation: gens[i],
    isSelf: i === 6, isLiving: i > 1, deathYear: i === 0 ? 2011 : i === 1 ? 2023 : null,
    createdAt: new Date(2020, 0, i + 1), photoPath: null, avatar: null, gender: SAMPLE_GENDERS[i], relation: null,
  })) as never[];
  const L = (p: number, c: number) => ({ id: `${p}-${c}`, parentId: `s${p}`, childId: `s${c}` });
  const links = [L(0, 4), L(1, 4), L(2, 5), L(3, 5), L(4, 6), L(5, 6), L(4, 7), L(5, 7)] as never[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Treename",
    url: appUrl(`/${lang}`),
    applicationCategory: "LifestyleApplication",
    description: t.meta.description,
    inLanguage: lang,
    offers: [
      { "@type": "Offer", name: t.pricing.free.name, price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: t.pricing.family.name, price: "59", priceCurrency: "USD" },
      { "@type": "Offer", name: t.pricing.legacy.name, price: "99", priceCurrency: "USD" },
    ],
  };

  // Map sketch: route points placed on a gentle arc.
  const route = h.sample.route;
  const who = [[3], [2, 5], [0, 1, 4], [6, 7], [6]].map((ix) => ix.map((k) => sp[k].first).join(", "));
  const pts = route.map((r, i) => ({ ...r, x: 70 + i * ((560 - 140) / Math.max(1, route.length - 1)), y: 210 - Math.sin((i / Math.max(1, route.length - 1)) * Math.PI) * 120 + (i % 2) * 18 }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <SiteNav lang={lang} t={t} />
        <header className="h-hero">
          <div>
            <h1 className="h-reveal">{t.hero.title}</h1>
            <p className="lead h-reveal d1">{t.hero.sub}</p>
            <div className="row h-reveal d2">
              <Link className="btn btn-primary" href={start}>{t.hero.cta}</Link>
              <a className="btn btn-ghost" href={`/demo?lang=${lang}`}>{t.hero.cta2}</a>
            </div>
            <div className="trust h-reveal d3">{t.hero.trust.map((x) => <span key={x}>{x}</span>)}</div>
          </div>
          <div className="h-reveal d2"><HeroDemo d={t.demo} /></div>
        </header>
      </div>

      {/* How it works: three steps */}
      <section className="h-sec band">
        <div className="wrap">
          <p className="eyebrow">{h.stepsEyebrow}</p>
          <h2>{h.stepsTitle}</h2>
          <ol className="h-steps">
            {h.steps.map((s, i) => (
              <li key={s.t}>
                <span className="h-num">{i + 1}</span>
                <div className="stack" style={{ gap: 6 }}>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="h-after">{h.stepsAfter}</p>
        </div>
      </section>

      {/* What you'll have: real components with one example family */}
      <section className="h-sec" id="show">
        <div className="wrap">
          <p className="eyebrow">{h.showEyebrow}</p>
          <h2>{h.showTitle}</h2>
          <p className="h-sub">{h.showSub}</p>

          <div className="h-show">
            <div className="h-row">
              <div className="h-row-text"><h3>{h.show.tree.t}</h3><p>{h.show.tree.d}</p></div>
              <div className="h-frame">
                <TreeView people={people} links={links} label={h.show.tree.t} fit />
                <span className="h-caption">{sp[6].first} · {sp[6].born}</span>
              </div>
            </div>

            <div className="h-row flip">
              <div className="h-row-text"><h3>{h.show.crest.t}</h3><p>{h.show.crest.d}</p></div>
              <div className="h-frame">
                <div className="h-crests">
                  {SAMPLE_CRESTS.map((c, i) => (
                    <figure key={i}>
                      <CrestSvg c={c} size={i === 1 ? 128 : 104} idSuffix={`home-${i}`} title={h.sample.surnames[i]} />
                      <figcaption>{h.sample.surnames[i]}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-row">
              <div className="h-row-text"><h3>{h.show.book.t}</h3><p>{h.show.book.d}</p></div>
              <div className="h-book" aria-label={h.show.book.t}>
                <div className="h-page">
                  <span className="chap">{h.bookChapter}</span>
                  <h4>{h.bookTitle}</h4>
                  <p>{h.bookText}</p>
                </div>
                <div className="h-page">
                  <div className="h-photo" aria-hidden="true">
                    <StoryArt seed="home-pier" scene="pier" idSuffix="home" />
                  </div>
                  <div className="h-qr">
                    <svg width="46" height="46" viewBox="0 0 7 7" aria-hidden="true" shapeRendering="crispEdges">
                      {["1110111", "1010101", "1110111", "0001000", "1101011", "0110101", "1011101"].flatMap((row, y) => [...row].map((v, x) => (v === "1" ? <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill="#2A2420" /> : null)))}
                    </svg>
                    <span>{h.bookScan}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-row flip">
              <div className="h-row-text"><h3>{h.show.map.t}</h3><p>{h.show.map.d}</p></div>
              <div className="h-frame h-map">
                <svg viewBox="0 0 620 300" width="100%" role="img" aria-label={h.show.map.t}>
                  {Array.from({ length: 11 }, (_, i) => <path key={`v${i}`} d={`M${i * 62} 0 V300`} stroke="#e4dccb" strokeWidth="1" />)}
                  {Array.from({ length: 6 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 60} H620`} stroke="#e4dccb" strokeWidth="1" />)}
                  <path d="M40 260 C140 170 180 230 260 160 S420 60 600 120" fill="none" stroke="#d8ccb4" strokeWidth="14" strokeLinecap="round" opacity=".5" />
                  <path d={pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ")} fill="none" stroke="var(--warm)" strokeWidth="2.5" strokeDasharray="7 6" />
                  {pts.map((p) => (
                    <g key={p.place}>
                      <circle cx={p.x} cy={p.y} r="8" fill="var(--accent)" stroke="#fff" strokeWidth="2.5" />
                      <text x={p.x} y={p.y - 16} textAnchor="middle" fontFamily="var(--display)" fontSize="15" fill="#2A2420">{p.place}</text>
                      <text x={p.x} y={p.y + 26} textAnchor="middle" fontFamily="var(--body)" fontSize="12" fill="#6F665C">{p.year}</text>
                      <text x={p.x} y={p.y + 42} textAnchor="middle" fontFamily="var(--hand)" fontSize="16" fill="var(--warm)">{who[pts.indexOf(p)]}</text>
                    </g>
                  ))}
                  <g transform="translate(560 250)" opacity=".7"><circle r="18" fill="none" stroke="#a8977a" /><path d="M0 -16 L4 0 L0 16 L-4 0 Z" fill="#a8977a" /><text y="-22" textAnchor="middle" fontSize="10" fill="#a8977a">N</text></g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Treename won't do */}
      <section className="h-sec band">
        <div className="wrap">
          <p className="eyebrow">{h.honestEyebrow}</p>
          <div className="h-honest">
            {h.honest.map((x) => <article key={x.t}><b>{x.t}</b><p>{x.d}</p></article>)}
          </div>
        </div>
      </section>

      <section className="h-sec" id="pricing">
        <div className="wrap">
          <p className="eyebrow">{t.pricing.eyebrow}</p>
          <h2>{t.pricing.title}</h2>
          <div className="cards3">
            {(["free", "family", "legacy"] as const).map((k) => {
              const p = t.pricing[k];
              return (
                <article key={k} className={`card price${k === "family" ? " feat" : ""}`}>
                  {k === "family" && <span className="tag" style={{ alignSelf: "flex-start" }}>{t.pricing.popular}</span>}
                  {k === "legacy" && <span className="tag" style={{ alignSelf: "flex-start" }}>{t.pricing.giftTag}</span>}
                  <h3>{p.name}</h3>
                  <div className="amt">{p.price} {p.per && <small>{p.per}</small>}</div>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <Link className={`btn ${k === "family" ? "btn-primary" : "btn-ghost"}`} href={k === "free" ? start : `${start}?plan=${k}`}>{p.cta}</Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="h-sec band">
        <div className="narrow center stack" style={{ justifyItems: "center", gap: 16 }}>
          <h2>{t.final.title}</h2>
          <p className="muted" style={{ maxWidth: "34em" }}>{t.final.body}</p>
          <Link className="btn btn-primary" href={start}>{t.final.cta}</Link>
        </div>
      </section>

      <SiteFooter lang={lang} t={t} />
    </>
  );
}
