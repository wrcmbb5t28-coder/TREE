import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLang, LANGS } from "@/i18n";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { LEGAL } from "@/i18n/legal";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return { title: `${t.privacy.title} | Treename`, alternates: { canonical: `/${lang}/privacy` } };
}

/*
 * The policy text lives in src/i18n/legal.ts (6 languages), written from what the code does.
 * It is a draft for review by a Swiss/EU data-protection lawyer (nDSG + GDPR).
 */
export default async function Privacy({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const L = LEGAL[lang];
  return (
    <>
      <div className="wrap"><SiteNav lang={lang} t={t} rest="/privacy" /></div>
      <main className="narrow stack" style={{ paddingBlock: "32px 80px", gap: 28 }}>
        <h1>{t.privacy.title}</h1>
        <ul className="plist">
          {t.privacy.items.map((i) => <li key={i.t}><div><b>{i.t}</b><span>{i.d}</span></div></li>)}
        </ul>
        <section className="stack legal">
          <h2 style={{ fontSize: "1.5rem" }}>{L.policyTitle}</h2>
          <p className="small muted">{L.updated}</p>
          {L.sections(process.env.DATA_REGION === "ch" ? L.regionCh : L.regionEu).map((s) => (
            <div key={s.h} className="stack" style={{ gap: 8 }}>
              <h3 style={{ fontSize: "1.1rem" }}>{s.h}</h3>
              {s.p.map((x) => <p key={x}>{x}</p>)}
            </div>
          ))}
          <p><Link href={`/${lang}/imprint`}>{L.imprint.title} →</Link></p>
        </section>
      </main>
      <SiteFooter lang={lang} t={t} />
    </>
  );
}
