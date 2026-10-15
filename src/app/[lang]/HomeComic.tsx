import "./home5.css";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { getDict, fill, type Lang } from "@/i18n";
import { HOME5 } from "@/i18n/home5";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { appUrl } from "@/lib/util";
import PageView from "@/components/PageView";
import { sampleBook, SAMPLE_PDF } from "@/lib/sampleBook";
import { PRICES } from "@/lib/prices";

/** Illustrated homepage (comic "clear line" style): family memory first, the book as one of four results. */

type Pos = { l?: number; t?: number; r?: number; b?: number };
const at = (p: Pos): CSSProperties => ({
  left: p.l != null ? `${p.l}%` : undefined, top: p.t != null ? `${p.t}%` : undefined,
  right: p.r != null ? `${p.r}%` : undefined, bottom: p.b != null ? `${p.b}%` : undefined,
});

function Scene({ src, w, h, label, children, className = "" }: { src: string; w: number; h: number; label: string; children?: ReactNode; className?: string }) {
  return (
    <figure className={`h5-scene ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <img src={`/home5/${src}.webp`} width={w} height={h} alt={label} loading={src === "hero" ? "eager" : "lazy"} decoding="async" />
      {children}
    </figure>
  );
}
const Bal = ({ p, tail = "left", children }: { p: Pos; tail?: "left" | "right"; children: ReactNode }) => <div className={`h5-ov h5-bal ${tail}`} style={at(p)}>{children}</div>;
const Cap = ({ p, children }: { p: Pos; children: ReactNode }) => <div className="h5-ov h5-cap" style={at(p)}>{children}</div>;

const WAVE = [35, 65, 90, 50, 80, 100, 42, 72, 88, 40, 66, 82, 36];
const Voice = ({ time }: { time: string }) => (
  <span className="h5-voice">
    <span className="pl" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg></span>
    <span className="wv" aria-hidden="true">{WAVE.map((x, i) => <i key={i} style={{ height: `${x}%` }} className={i > 7 ? "o" : undefined} />)}</span>
    <b>{time}</b>
  </span>
);
const Face = ({ who, bg, cls = "" }: { who: string; bg: string; cls?: string }) => (
  <span className={`h5-md ${cls}`} style={{ background: bg }}><img src={`/home5/${who}.svg`} alt="" width={60} height={60} loading="lazy" /></span>
);

function BookCover({ title, sub }: { title: string; sub: string }) {
  const s = { stroke: "#1E1B1A", strokeWidth: 3.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 260 350" aria-hidden="true">
      <path d="M40 30 L222 22 Q236 22 236 36 L240 312 Q240 326 226 326 L48 330" fill="#FFFDF8" {...s} />
      <path d="M22 26 Q22 14 34 14 L206 10 Q220 10 220 24 L224 304 Q224 318 210 318 L36 322 Q22 322 22 308 Z" fill="#4A5E39" {...s} />
      <rect x="64" y="40" width="136" height="252" rx="6" fill="none" stroke="#E2C27A" strokeWidth="1.6" />
      <path d="M132 78 L160 88 L160 118 Q160 142 132 154 Q104 142 104 118 L104 88 Z" fill="#E2C27A" />
      <path d="M132 146 V108 M132 124 L120 112 M132 118 L144 106" stroke="#4A5E39" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="132" cy="102" r="9" fill="#4A5E39" />
      <text x="132" y="200" textAnchor="middle" fontFamily="Literata, Georgia, serif" fontSize={title.length > 9 ? 22 : 27} fontWeight="600" fill="#F3DFA9">{title}</text>
      <text x="132" y="226" textAnchor="middle" fontFamily="Literata, Georgia, serif" fontStyle="italic" fontSize="15" fill="#E9D6A4">{sub}</text>
      <path d="M150 318 L150 344 L160 336 L170 344 L170 318" fill="#B65A35" {...s} strokeWidth={2.4} />
    </svg>
  );
}

function FamilyMap({ route, label }: { route: { place: string; year: string }[]; label: string }) {
  const W = 480, H = 300;
  const pts = [[410, 150], [330, 92], [250, 160], [170, 96], [90, 170]].slice(0, route.length);
  const o = { stroke: "#1E1B1A", strokeWidth: 2.4, strokeLinejoin: "round" as const };
  return (
    <figure className="h5-scene h5-map" style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label={`${label}: ${route.map((r) => `${r.place} ${r.year}`).join(", ")}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <rect width={W} height={H} fill="#A9D4EE" />
        {[[30, 262], [100, 280], [400, 38], [420, 276], [250, 290]].map(([x, y]) => <path key={`${x}`} d={`M${x} ${y} q8 -5 16 0 q8 5 16 0`} fill="none" stroke="#7FB3D6" strokeWidth="1.5" />)}
        <path {...o} fill="#F3E3BE" d="M-10 40 C40 20 90 60 140 40 C200 18 250 30 300 20 C350 10 400 30 440 70 C470 100 460 150 480 180 L490 240 C440 236 400 260 350 250 C300 240 260 262 210 246 C160 232 120 256 70 240 C40 230 10 236 -10 230Z" />
        <path d="M60 120 C100 104 126 128 160 122 C176 140 146 156 110 150Z M286 186 C316 176 352 196 334 214 C300 218 280 204 286 186Z" fill="#B9D59A" />
        <path d="M200 228 l16 -28 l16 28Z M222 228 l16 -32 l16 32Z" fill="#B6C6D6" {...o} strokeWidth={1.6} />
        <path d="M380 40 C370 90 400 130 390 180 C384 210 400 230 396 246" fill="none" stroke="#7FB3D6" strokeWidth="3" />
        <path d={`M${pts.map((p) => p.join(",")).join(" ")}`} fill="none" stroke="#D9503F" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        {pts.map(([x, y]) => (
          <g key={`${x}`}><path {...o} fill="#D9503F" d={`M${x} ${y} c-10 -12 -12 -18 -12 -22 a12 12 0 0 1 24 0 c0 4 -2 10 -12 22Z`} /><circle cx={x} cy={y - 22} r="4" fill="#fff" /></g>
        ))}
      </svg>
      {route.map((r, i) => {
        const [x, y] = pts[i]; const up = i % 2 === 1;
        return (
          <span key={r.place} className={`h5-mlab ${up ? "up" : ""}`} style={{ left: `${(x / W) * 100}%`, top: `${((up ? y - 38 : y + 6) / H) * 100}%` }}>
            <b>{r.place}</b>{r.year}
          </span>
        );
      })}
    </figure>
  );
}

export default function HomeComic({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const h = t.home;
  const x = HOME5[lang];
  const start = `/${lang}/start`;
  const sp = h.sample.people;
  const route = h.sample.route;
  const first = (s: string) => s.split(" ")[0];
  const grandpa = first(t.demo.people[1]);
  const grandma = first(t.demo.people[0]);
  const quote = (t.demo.answer.match(/^.*?[.!?…](?=\s)/)?.[0] ?? t.demo.answer).replace(/[.!?]?[”»"“]?$/, "") + "…" + (/[«„]/.test(t.demo.answer.slice(0, 2)) ? (t.demo.answer.startsWith("«") ? "»" : "“") : "”");
  const giftTitle = new Date().getMonth() >= 9 ? t.gift.season : t.gift.title;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "WebApplication", name: "Treename", url: appUrl(`/${lang}`),
    applicationCategory: "LifestyleApplication", description: t.meta.description, inLanguage: lang,
    offers: [
      { "@type": "Offer", name: t.pricing.free.name, price: "0", priceCurrency: PRICES[lang].currency },
      { "@type": "Offer", name: t.pricing.family.name, price: String(PRICES[lang].amount.family), priceCurrency: PRICES[lang].currency },
      { "@type": "Offer", name: t.pricing.legacy.name, price: String(PRICES[lang].amount.legacy), priceCurrency: PRICES[lang].currency },
    ],
  };

  const tree: [number, string, string, string?][][] = [
    [[0, "pyotr", "#A3CF8E", x.fromStory], [1, "anna", "#F4A983"]],
    [[4, "sergey", "#7DB9DE"], [5, "irina", "#F2C744"]],
    [[6, "egor", "#A3CF8E"], [7, "masha", "#F4A983"]],
  ];

  return (
    <div className="h5">
      <PageView name="landing_view" lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="h5-promo" href="#gift">{giftTitle} — <b>{t.pricing.legacy.price}</b></a>
      <div className="h5-bar"><div className="wrap"><SiteNav lang={lang} t={t} /></div></div>

      <main>
        <section className="h5-hero">
          <div className="h5-wrap h5-hero-grid">
            <div>
              <p className="h5-eyebrow">{x.eyebrow}</p>
              <h1>{x.title}</h1>
              <p className="h5-lead">{x.sub}</p>
              <div className="h5-actions">
                <Link className="h5-btn h5-olive" href={start}>{t.hero.cta}</Link>
                <a className="h5-btn h5-line" href="#inside">{x.ctaInside}</a>
              </div>
              <Link className="h5-booklink" href={`/${lang}/book`}>{t.gift.heroBook}</Link>
              <p className="h5-fine">{t.hero.trust.join(" · ")}</p>
            </div>
            <Scene src="hero" w={1400} h={1356} label={x.heroCaption}>
              <Cap p={{ l: 2, t: 2 }}>{x.heroCaption}</Cap>
              <Bal p={{ l: 2, t: 22 }}>{fill(x.heroBubble, { name: grandpa })}</Bal>
            </Scene>
          </div>
        </section>

        <section className="h5-sec" id="how">
          <div className="h5-wrap">
            <div className="h5-head"><p className="h5-eyebrow">{h.stepsEyebrow}</p><h2>{x.stepsTitle}</h2></div>
            <ol className="h5-strip">
              <li>
                <Scene src="ch1" w={890} h={765} label={h.steps[0].t}>
                  <Cap p={{ l: 2, t: 2.5 }}>{fill(x.ch1Caption, { city: route[3].place })}</Cap>
                  <Bal p={{ l: 44, t: 6 }}>{t.demo.question}</Bal>
                  <div className="h5-ov h5-chips" style={at({ r: 3, t: 44 })}>{x.chips.map((c) => <span key={c} className="h5-chip">{c}</span>)}</div>
                </Scene>
                <h3><span className="n">1</span>{h.steps[0].t}</h3>
                <p>{h.steps[0].d}</p>
              </li>
              <li>
                <Scene src="ch2" w={890} h={765} label={h.steps[1].t}>
                  <Cap p={{ l: 2, b: 3 }}>{fill(x.ch2Caption, { city: t.demo.place })}</Cap>
                  <div className="h5-ov" style={at({ l: 38, t: 5 })}><Voice time="1:24" /></div>
                </Scene>
                <h3><span className="n">2</span>{h.steps[1].t}</h3>
                <p>{h.steps[1].d}</p>
              </li>
              <li>
                <div className="h5-scene h5-ui3">
                  <span className="h5-cap">{x.step3Caption}</span>
                  <div className="sto">
                    <p className="st">{x.storyLabel}</p>
                    <h4>{h.bookTitle}</h4>
                    <p className="by">{fill(x.toldBy, { name: grandma })}</p>
                    <p className="tx">{quote}</p>
                  </div>
                  <ul className="res">
                    {[[grandpa, "#A3CF8E"], [t.demo.place, "#D9503F"], [t.demo.year, "#F2C744"], [`${x.voice} 1:24`, "#7DB9DE"]].map(([v, c], i) => (
                      <li key={i}><i style={{ background: c }} /><b>{v}</b><span>→ {x.results[i]}</span></li>
                    ))}
                  </ul>
                </div>
                <h3><span className="n">3</span>{h.steps[2].t}</h3>
                <p>{h.steps[2].d}</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="h5-sec h5-inside" id="inside">
          <div className="h5-wrap">
            <div className="h5-head"><p className="h5-eyebrow">{x.insideEyebrow}</p><h2>{x.insideTitle}</h2><p>{x.insideSub}</p></div>
            <div className="h5-feat">
              <article className="h5-fc">
                <ul className="h5-arc">
                  {([[1, "anna", "#F2C744", t.demo.question, "1:24"], [0, "pyotr", "#7DB9DE", t.library.work.q[0], "3:10"], [5, "irina", "#F4A983", t.library.love.q[0], "2:05"]] as const).map(([i, f, bg, q, d]) => (
                    <li key={f}><Face who={f} bg={bg} /><span><b>{sp[i].first}</b>{q}</span><em><i className="p" />{d}</em></li>
                  ))}
                </ul>
                <h3>{x.archive.t}</h3><p>{x.archive.d}</p>
              </article>
              <article className="h5-fc">
                <div className="h5-tree" role="img" aria-label={h.show.tree.t}>
                  {tree.map((row, r) => (
                    <div key={r} className="tg">
                      {row.map(([i, f, bg, tag]) => (
                        <div key={i} className={`tp${tag ? " nw" : ""}`}>
                          <Face who={f} bg={bg} cls={tag ? "new" : ""} />
                          <b>{sp[i].first}</b>
                          <small>{tag ?? sp[i].born}</small>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <h3>{h.show.tree.t}</h3><p>{h.show.tree.d}</p>
              </article>
              <article className="h5-fc">
                <FamilyMap route={route} label={h.show.map.t} />
                <h3>{h.show.map.t}</h3><p>{h.show.map.d}</p>
              </article>
              <article className="h5-fc">
                <Link className="h5-bv" href={`/${lang}/book`} aria-label={h.show.book.t}>
                  <Scene src="photo" w={973} h={733} label={t.demo.note} className="ph" />
                  <span className="bk"><BookCover title={h.sample.surnames[0]} sub={x.bookCover} /></span>
                </Link>
                <h3>{h.show.book.t}</h3><p>{h.show.book.d}</p>
                <Link className="h5-btn h5-olive h5-bookcta" href={`/${lang}/book`}>{sampleBook(lang).ui.cta}</Link>
                <a className="h5-bookpdf" href={SAMPLE_PDF[lang].href} download>{SAMPLE_PDF[lang].label}<small>{SAMPLE_PDF[lang].note}</small></a>
              </article>
            </div>
          </div>
        </section>

        <section className="h5-sec" id="family">
          <div className="h5-wrap h5-fam">
            <Scene src="family" w={1400} h={849} label={x.familyTitle} />
            <div>
              <p className="h5-eyebrow">{x.familyEyebrow}</p>
              <h2>{x.familyTitle}</h2>
              <p className="h5-l">{x.familyBody}</p>
              <ul className="h5-feed">
                {([[4, "sergey", "#A3CF8E", route[4].place], [5, "irina", "#F4A983", route[3].place], [6, "egor", "#7DB9DE", ""], [7, "masha", "#F2C744", ""]] as const).map(([i, f, bg, city], k) => {
                  const [who, what] = fill(x.feed[k], { name: sp[i].first, city }).split(/:\s/);
                  return <li key={f}><Face who={f} bg={bg} /><span><b>{who}</b>{what}</span></li>;
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="h5-sec" id="gift">
          <div className="h5-wrap">
            <div className="h5-gift">
              <div className="ill">
                <Scene src="gift" w={1285} h={1380} label={giftTitle}>
                  <Bal p={{ l: 3, t: 6 }} tail="right">{x.giftBubble}</Bal>
                </Scene>
              </div>
              <div className="txt">
                <p className="h5-eyebrow">{t.pricing.giftTag}</p>
                <h2>{giftTitle}</h2>
                <p className="h5-l">{t.gift.lead}</p>
                <ol>{t.gift.steps.map((s, i) => <li key={i}><span className="n">{i + 1}</span><span><b>{s.t}</b>{s.d}</span></li>)}</ol>
                <div className="pr"><b>{t.pricing.legacy.price}</b><span>{t.gift.note}</span></div>
                <div className="act">
                  <Link className="h5-btn h5-terra" href={`${start}?plan=legacy`}>{t.gift.cta}</Link>
                  <Link className="h5-btn h5-line" href={`/${lang}/book`}>{t.gift.more}</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="h5-sec h5-inside" id="pricing">
          <div className="h5-wrap">
            <div className="h5-head"><p className="h5-eyebrow">{t.pricing.eyebrow}</p><h2>{t.pricing.title}</h2></div>
            <div className="h5-prices">
              {(["free", "family", "legacy"] as const).map((k) => {
                const p = t.pricing[k];
                return (
                  <article key={k} className={`h5-price${k === "family" ? " feat" : ""}`}>
                    {k === "family" && <span className="tag">{t.pricing.popular}</span>}
                    {k === "legacy" && <span className="tag gift">{t.pricing.giftTag}</span>}
                    <h3>{p.name}</h3>
                    <div className="amt">{p.price} {p.per && <small>{p.per}</small>}</div>
                    <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                    <Link className={`h5-btn ${k === "family" ? "h5-olive" : k === "legacy" ? "h5-terra" : "h5-line"}`} href={k === "free" ? start : `${start}?plan=${k}`}>{p.cta}</Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="h5-sec">
          <div className="h5-wrap">
            <div className="h5-head"><p className="h5-eyebrow">{h.honestEyebrow}</p></div>
            <div className="h5-honest">{h.honest.map((q) => <article key={q.t}><b>{q.t}</b><p>{q.d}</p></article>)}</div>
          </div>
        </section>

        <section className="h5-final">
          <div className="h5-wrap">
            <div className="card">
              <h2>{t.final.title}</h2>
              <p className="h5-l">{t.final.body}</p>
              <Link className="h5-btn h5-olive" href={start}>{t.final.cta}</Link>
            </div>
          </div>
        </section>
      </main>
      <div className="h5-bar"><SiteFooter lang={lang} t={t} /></div>
    </div>
  );
}
