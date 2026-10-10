import type { Metadata } from "next";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import LangSwitch from "@/components/LangSwitch";
import AppMenu from "@/components/AppMenu";
import { isPaid } from "@/lib/plans";
import { appContext } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { setUiLang } from "./actions";
import { crestsT } from "@/i18n/app/crests";
import ThemeToggle from "@/components/ThemeToggle";
import DemoBanner from "@/components/DemoBanner";
import { isDemoFamily } from "@/lib/demo";
import { Suspense } from "react";

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
            <svg className="logo-mark" width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="12" r="9" fill="#C9D9B8" /><circle cx="10.5" cy="14" r="5.5" fill="#AFC79B" /><circle cx="21.5" cy="14" r="5.5" fill="#B7CDA3" />
              <path d="M16 13v15M16 20l-4-4M16 18l4-4" stroke="#6E5238" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
            <b style={{ fontSize: "1.35rem" }}>Treename</b>
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
                { href: "/app/settings", label: c.nav.settings },
                ...(!paid ? [{ href: "/app/billing", label: `${c.plans.free} · ${c.header.upgrade}`, accent: true }] : []),
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
      {isDemoFamily(family.id) && <Suspense fallback={null}><DemoBanner lang={lang} /></Suspense>}
      <main id="main" className="wrap page">{children}</main>
    </div>
  );
}
