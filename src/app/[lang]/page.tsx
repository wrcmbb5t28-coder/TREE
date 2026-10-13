import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLang, LANGS, HREFLANG } from "@/i18n";
import HomeClassic from "./HomeClassic";
import HomeComic from "./HomeComic";

export const dynamicParams = false;
export const revalidate = 86400;
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

/**
 * Two homepage designs. The illustrated one is the default; set HOME_DESIGN=classic
 * in Vercel (and redeploy) to bring back the previous page without touching the code.
 */
export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (process.env.HOME_DESIGN || "").toLowerCase() === "classic" ? <HomeClassic lang={lang} /> : <HomeComic lang={lang} />;
}
