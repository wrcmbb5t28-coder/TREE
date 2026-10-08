import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLang, LANGS, HREFLANG } from "@/i18n";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import HeroDemo from "@/components/HeroDemo";
import Journey from "@/components/JourneyDemo";
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
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: `/${lang}`,
      siteName: "Treename",
      locale: lang,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const start = `/${lang}/start`;

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <SiteNav lang={lang} t={t} />
        <header className="hero">
          <div>
            <h1>{t.hero.title}</h1>
            <p className="lead">{t.hero.sub}</p>
            <div className="row">
              <Link className="btn btn-primary" href={start}>{t.hero.cta}</Link>
              <a className="btn btn-ghost" href="#example">{t.hero.cta2}</a>
            </div>
            <div className="trust">{t.hero.trust.map((x) => <span key={x}>{x}</span>)}</div>
          </div>
          <HeroDemo d={t.demo} />
        </header>
      </div>

      <section className="sec band">
        <div className="wrap two">
          <div>
            <p className="eyebrow">{t.problem.eyebrow}</p>
            <h2>{t.problem.title}</h2>
            <p className="lead" style={{ marginTop: "1rem" }}>{t.problem.body}</p>
          </div>
          <blockquote>
            {t.problem.quote}
            <footer>{t.problem.quoteBy}</footer>
          </blockquote>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">{t.how.eyebrow}</p>
          <h2>{t.how.title}</h2>
          <ol className="steps">
            {t.how.steps.map((s) => (
              <li key={s.t}><h3>{s.t}</h3><p>{s.d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec band">
        <div className="wrap two" style={{ alignItems: "center" }}>
          <div>
            <p className="eyebrow">{t.ask.eyebrow}</p>
            <h2>{t.ask.title}</h2>
            <p className="lead" style={{ margin: "1rem 0 1.6rem" }}>{t.ask.body}</p>
            <Link className="btn btn-primary" href={start}>{t.ask.cta}</Link>
          </div>
          <div className="card-elev stack">
            <div className="msg" style={{ justifySelf: "end", maxWidth: "88%" }}>
              <small>Luca → Nonna Maria</small>{t.demo.question}
            </div>
            <div className="player" style={{ margin: 0, maxWidth: "88%" }}>
              <span className="play" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z" fill="currentColor" /></svg></span>
              <div className="wave" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} className="on" style={{ height: `${30 + ((i * 37) % 60)}%` }} />)}</div>
              <span className="dur">1:24</span>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <span className="eyebrow">{t.ask.added}</span>
              <p className="story-body" style={{ fontSize: "1.05rem", marginTop: 6 }}>{t.demo.answer}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap two" style={{ alignItems: "center" }}>
          <div>
            <p className="eyebrow">{t.story.eyebrow}</p>
            <h2>{t.story.title}</h2>
            <p className="lead" style={{ marginTop: "1rem" }}>{t.story.body}</p>
          </div>
          <div className="card stack">
            <span className="eyebrow" style={{ color: "var(--warm)" }}>Chapter 3 · Leaving home</span>
            <p className="story-body">In 1962 Giuseppe takes the night train north to work in Zürich. Maria follows a year later.</p>
            <div className="row small muted">
              <span className="tag">Interview · Maria</span><span className="tag">Letter · March 1962</span><span className="tag">Photo · station</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sec band">
        <div className="wrap">
          <p className="eyebrow">{t.journey.eyebrow}</p>
          <h2>{t.journey.title}</h2>
          <p className="lead" style={{ marginTop: "1rem" }}>{t.journey.body}</p>
          <div className="tree-wrap" style={{ marginTop: 32 }}><Journey label={t.journey.title} /></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">{t.keep.eyebrow}</p>
          <h2>{t.keep.title}</h2>
          <div className="cards3">
            <article className="card">
              <div className="vis"><div className="book"><b style={{ fontWeight: 500 }}>The Rossi Family</b><small style={{ fontFamily: "var(--body)", fontSize: ".7rem" }}>1931 – 2027</small></div></div>
              <h3>{t.keep.book.t}</h3><p className="muted">{t.keep.book.d}</p>
            </article>
            <article className="card">
              <div className="vis"><div className="card" style={{ width: 180, padding: 12, fontSize: ".75rem" }}><b style={{ fontFamily: "var(--display)" }}>Rossi</b><div className="muted">4 · 3 · 38</div></div></div>
              <h3>{t.keep.page.t}</h3><p className="muted">{t.keep.page.d}</p>
            </article>
            <article className="card">
              <div className="vis">
                <svg width="140" height="140" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="66" fill="none" stroke="var(--accent)" strokeWidth="3" /><circle cx="75" cy="75" r="58" fill="none" stroke="var(--accent)" /><path d="M28 98 L58 62 L72 78 L90 52 L122 98 Z" fill="var(--accent)" opacity=".85" /><ellipse cx="75" cy="40" rx="13" ry="9" fill="var(--warm)" /><circle cx="75" cy="112" r="11" fill="none" stroke="var(--accent)" strokeWidth="2" /></svg>
              </div>
              <h3>{t.keep.emblem.t}</h3><p className="muted">{t.keep.emblem.d}</p>
              <p className="small muted" style={{ fontStyle: "italic", marginTop: 8 }}>{t.keep.emblemNote}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="sec band">
        <div className="wrap">
          <p className="eyebrow">{t.together.eyebrow}</p>
          <h2>{t.together.title}</h2>
          <p className="lead" style={{ marginTop: "1rem" }}>{t.together.body}</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap two">
          <div>
            <p className="eyebrow">{t.privacy.eyebrow}</p>
            <h2>{t.privacy.title}</h2>
          </div>
          <ul className="plist">
            {t.privacy.items.map((i) => <li key={i.t}><div><b>{i.t}</b><span>{i.d}</span></div></li>)}
          </ul>
        </div>
      </section>

      <section className="sec band" id="pricing">
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

      <section className="sec">
        <div className="narrow center stack" style={{ justifyItems: "center" }}>
          <h2>{t.final.title}</h2>
          <p className="muted">{t.final.body}</p>
          <Link className="btn btn-primary" href={start}>{t.final.cta}</Link>
        </div>
      </section>

      <SiteFooter lang={lang} t={t} />
    </>
  );
}
