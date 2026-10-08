import type { Metadata } from "next";
import Link from "next/link";
import { requireFamily } from "@/lib/auth";
import AppNav from "@/components/AppNav";
import { isPaid, PLANS } from "@/lib/plans";

export const metadata: Metadata = { title: "Treename", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { family } = await requireFamily();
  const paid = isPaid(family);
  return (
    <>
      <header className="appbar">
        <div className="wrap">
          <Link className="logo" href="/app"><b style={{ fontSize: "1.35rem" }}>Treename</b></Link>
          <AppNav />
          <div className="row">
            <span className="small muted">{family.name}</span>
            {!paid && <Link className="tag" href="/app/billing">{PLANS.free.name} · Upgrade</Link>}
            <Link className="btn btn-primary btn-sm" href="/app/ask">Ask a question</Link>
          </div>
        </div>
      </header>
      <main className="wrap page">{children}</main>
    </>
  );
}
