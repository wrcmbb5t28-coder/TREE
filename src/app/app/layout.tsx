import type { Metadata } from "next";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import LangSwitch from "@/components/LangSwitch";
import AppMenu from "@/components/AppMenu";
import { isPaid } from "@/lib/plans";
import { appContext } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { setUiLang } from "./actions";

export const metadata: Metadata = { title: "Treename", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { family, lang } = await appContext();
  const c = common[lang];
  const paid = isPaid(family);
  return (
    <div data-ui-lang={lang} lang={lang}>
      <header className="appbar">
        <div className="wrap">
          <Link className="logo" href="/app"><b style={{ fontSize: "1.35rem" }}>Treename</b></Link>
          <AppNav labels={c.nav} />
          <div className="appbar-right">
            <Link className="btn btn-primary btn-sm" href="/app/ask">{c.header.ask}</Link>
            <AppMenu
              label={c.header.menu}
              familyName={family.name}
              links={[
                { href: "/app/keep", label: c.nav.keep },
                { href: "/app/settings", label: c.nav.settings },
                ...(!paid ? [{ href: "/app/billing", label: `${c.plans.free} · ${c.header.upgrade}`, accent: true }] : []),
              ]}
            >
              <label className="appmenu-lang">
                <span>{c.header.language}</span>
                <LangSwitch value={lang} label={c.header.language} action={setUiLang} />
              </label>
            </AppMenu>
          </div>
        </div>
      </header>
      <main className="wrap page">{children}</main>
    </div>
  );
}
