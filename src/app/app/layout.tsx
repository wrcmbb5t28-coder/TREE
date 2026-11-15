import type { Metadata } from "next";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import LangSwitch from "@/components/LangSwitch";
import AppMenu from "@/components/AppMenu";
import { isPaid } from "@/lib/plans";
import { paymentsLive } from "@/lib/payments";
import { BETA } from "@/i18n/beta";
import { appContext } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { setUiLang, undoFix } from "./actions";
import FixNotice from "@/components/FixNotice";
import { fixT } from "@/i18n/app/fix";
import { crestsT } from "@/i18n/app/crests";
import ThemeToggle from "@/components/ThemeToggle";
import DemoBanner from "@/components/DemoBanner";
import { isDemoFamily } from "@/lib/demo";
import { Suspense } from "react";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = { title: "Treename", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { family, lang } = await appContext();
  const c = common[lang];
  const paid = isPaid(family);
  return (
    <div data-ui-lang={lang} lang={lang}>
      <a className="skip-link" href="#main">{c.header.skip}</a>
      <header className="appbar">
        <div className="wrap">
          <Link className="logo" href="/app" aria-label="Treename">
            <BrandLogo priority />
          </Link>
          <AppNav labels={c.nav} />
          <div className="appbar-right">
            <Link className="btn btn-primary btn-sm" href="/app/ask">{c.header.ask}</Link>
            <AppMenu
              label={c.header.menu}
              familyName={family.name}
              links={[
                { href: "/app/crests", label: crestsT[lang].nav },
                { href: "/app/keep", label: c.nav.keep },
                { href: "/app/proofread", label: `✎ ${fixT[lang].all.link}` },
                { href: "/app/settings", label: c.nav.settings },
                ...(!paymentsLive()
                  ? [{ href: "/app/billing", label: BETA[lang].menu, accent: true }]
                  : !paid ? [{ href: "/app/billing", label: `${c.plans.free} · ${c.header.upgrade}`, accent: true }] : []),
              ]}
            >
              <label className="appmenu-lang">
                <span>{c.header.language}</span>
                <LangSwitch value={lang} label={c.header.language} action={setUiLang} />
              </label>
              <ThemeToggle lang={lang} className="appmenu-theme" />
            </AppMenu>
          </div>
        </div>
      </header>
      {isDemoFamily(family.id) && <Suspense fallback={null}><DemoBanner lang={lang} family={family.name} /></Suspense>}
      <main id="main" className="wrap page">
        <FixNotice labels={{ ...fixT[lang], more: fixT[lang].more(0).replace("0", "#") }} undo={undoFix} />
        {children}
      </main>
    </div>
  );
}
