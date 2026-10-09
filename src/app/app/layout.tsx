import type { Metadata } from "next";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import LangSwitch from "@/components/LangSwitch";
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
          <div className="row">
            <span className="small muted">{family.name}</span>
            {!paid && <Link className="tag" href="/app/billing">{c.plans.free} · {c.header.upgrade}</Link>}
            <LangSwitch value={lang} label={c.header.language} action={setUiLang} />
            <Link className="btn btn-primary btn-sm" href="/app/ask">{c.header.ask}</Link>
          </div>
        </div>
      </header>
      <main className="wrap page">{children}</main>
    </div>
  );
}
