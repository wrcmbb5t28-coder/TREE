import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLang, LANGS } from "@/i18n";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";

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
 * NOTE FOR THE TEAM: the policy text below is a working draft written from the
 * product's privacy decisions. It must be reviewed by a Swiss/EU data-protection
 * lawyer (nDSG + GDPR) and the controller details filled in before launch.
 */
export default async function Privacy({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  return (
    <>
      <div className="wrap"><SiteNav lang={lang} t={t} rest="/privacy" /></div>
      <main className="narrow stack" style={{ paddingBlock: "32px 80px", gap: 28 }}>
        <h1>{t.privacy.title}</h1>
        <ul className="plist">
          {t.privacy.items.map((i) => <li key={i.t}><div><b>{i.t}</b><span>{i.d}</span></div></li>)}
        </ul>
        <section className="stack">
          <h2 style={{ fontSize: "1.5rem" }}>Privacy policy</h2>
          <p><b>Who we are.</b> Treename is operated from Zug, Switzerland. Contact: privacy@treename.ai.</p>
          <p><b>What we store.</b> The names, places, dates, stories, voice recordings and photos that you and your family add; your email address; basic usage events that help us improve the product.</p>
          <p><b>Why.</b> Only to build and show your family's history to the people you invite, to send you the emails you ask for, and to bill paid plans.</p>
          <p><b>Where.</b> In data centres in {process.env.DATA_REGION === "ch" ? "Switzerland" : "the European Union (Frankfurt)"}. Voice recordings are transcribed and stories are written by AI service providers under contracts that forbid using your data to train their models.</p>
          <p><b>Who sees it.</b> Only members of your family space. A family page is private by default; living people are never shown publicly without their consent.</p>
          <p><b>Your rights.</b> You can export everything (stories, recordings, photos, tree in GEDCOM format) and delete your family space at any time in Settings. You can also choose a legacy contact who keeps the archive.</p>
          <p><b>Payments.</b> Processed by Stripe. We never see or store card numbers.</p>
        </section>
      </main>
      <SiteFooter lang={lang} t={t} />
    </>
  );
}
