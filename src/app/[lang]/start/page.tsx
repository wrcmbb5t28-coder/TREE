import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLang, COUNTRY_CODES, countryName } from "@/i18n";
import Onboarding from "@/components/Onboarding";

export const metadata: Metadata = { robots: { index: false } };

export default async function Start({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ plan?: string; gift?: string }>;
}) {
  const { lang } = await params;
  const { plan, gift } = await searchParams;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const questions = [t.library.love.q[0], t.library.childhood.q[0], t.library.advice.q[0]];
  const countries = COUNTRY_CODES.map((code) => ({ code, name: countryName(code, lang) }));
  return (
    <main>
      <Onboarding lang={lang} t={t.onboarding} questions={questions} countries={countries} plan={plan} gift={gift} />
    </main>
  );
}
