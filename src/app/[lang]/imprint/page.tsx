import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLang, LANGS } from "@/i18n";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { LEGAL, OPERATOR as O } from "@/i18n/legal";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: `${LEGAL[lang].imprint.title} | Treename`, alternates: { canonical: `/${lang}/imprint` } };
}

/** Legal notice (Impressum): required for Germany and by Swiss UWG for sites offering services. */
export default async function Imprint({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const i = LEGAL[lang].imprint;
  const rows: [string, React.ReactNode][] = [
    [i.operator, O.name],
    [i.address, <>{O.street}<br />{O.city}<br />Switzerland / Schweiz</>],
    [i.register, <>Kanton Zug · {O.register}<br />UID {O.uid}</>],
    [i.manager, `${O.manager}, ${i.managerRole}`],
    [i.contact, <a href={`mailto:${O.hello}`}>{O.hello}</a>],
    [i.privacyContact, <a href={`mailto:${O.privacy}`}>{O.privacy}</a>],
  ];
  return (
    <>
      <div className="wrap"><SiteNav lang={lang} t={t} rest="/imprint" /></div>
      <main className="narrow stack" style={{ paddingBlock: "32px 80px", gap: 24 }}>
        <h1>{i.title}</h1>
        <dl className="stack" style={{ gap: 14, margin: 0 }}>
          {rows.map(([k, v]) => (
            <div key={k}><dt className="small muted">{k}</dt><dd style={{ margin: "2px 0 0" }}>{v}</dd></div>
          ))}
        </dl>
        <section className="stack" style={{ gap: 8 }}>
          <h2 style={{ fontSize: "1.2rem" }}>{i.disclaimerH}</h2>
          <p>{i.disclaimer}</p>
        </section>
      </main>
      <SiteFooter lang={lang} t={t} />
    </>
  );
}
