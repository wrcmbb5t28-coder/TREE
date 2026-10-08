import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLang, LANGS, HREFLANG } from "@/i18n";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { waLink } from "@/lib/util";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return {
    title: t.questions.metaTitle,
    description: t.questions.metaDesc,
    alternates: {
      canonical: `/${lang}/questions`,
      languages: Object.fromEntries([...LANGS.map((l) => [HREFLANG[l], `/${l}/questions`]), ["x-default", "/en/questions"]]),
    },
    openGraph: { title: t.questions.metaTitle, description: t.questions.metaDesc, url: `/${lang}/questions` },
  };
}

/** SEO page: "questions to ask your grandparents" in 6 languages. Each question can be sent by WhatsApp right away. */
export default async function Questions({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const topics = Object.entries(t.library);
  const all = topics.flatMap(([, v]) => v.q);
  const faq = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.questions.title,
    itemListElement: all.map((q, i) => ({ "@type": "ListItem", position: i + 1, name: q })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <div className="wrap"><SiteNav lang={lang} t={t} rest="/questions" /></div>
      <main className="narrow stack" style={{ paddingBlock: "32px 80px", gap: 32 }}>
        <div className="stack">
          <h1>{t.questions.title}</h1>
          <p className="lead">{t.questions.intro}</p>
          <div><Link className="btn btn-primary" href={`/${lang}/start`}>{t.questions.cta}</Link></div>
        </div>
        {topics.map(([key, topic]) => (
          <section key={key} className="stack" aria-labelledby={`t-${key}`}>
            <h2 id={`t-${key}`} style={{ fontSize: "1.6rem" }}>{topic.name}</h2>
            <ol className="stack" style={{ paddingLeft: "1.2rem", margin: 0 }}>
              {topic.q.map((q) => (
                <li key={q}>
                  <div className="row between">
                    <span style={{ flex: "1 1 280px" }}>{q}</span>
                    <a className="btn btn-ghost btn-sm" href={waLink(q)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>
      <SiteFooter lang={lang} t={t} />
    </>
  );
}
