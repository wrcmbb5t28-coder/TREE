import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getRealUser } from "@/lib/auth";
import { authT, visitorLang } from "@/i18n/app/auth";

export async function generateMetadata(): Promise<Metadata> {
  return { title: authT[await visitorLang()].login.metaTitle, robots: { index: false } };
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; dev?: string; error?: string; invite?: string }>;
}) {
  const sp = await searchParams;
  if (!sp.invite && (await getRealUser())) redirect("/app");
  const lang = await visitorLang();
  const t = authT[lang].login;
  return (
    <main className="answer-page">
      <div className="answer-card card-elev">
        <Link className="logo" href="/"><b>Treename</b></Link>
        {sp.sent ? (
          <div className="stack">
            <h1 style={{ fontSize: "2rem" }}>{t.checkInbox}</h1>
            <p className="muted">{t.sent} <b>{sp.sent}</b>. {t.sentTail}</p>
            {sp.dev && (
              <div className="notice">
                <p className="small">{t.devMode}</p>
                <a className="btn btn-primary" href={sp.dev} style={{ marginTop: 10 }}>{t.devButton}</a>
              </div>
            )}
          </div>
        ) : (
          <form className="stack" method="post" action="/api/auth/request">
            <h1 style={{ fontSize: "2rem" }}>{sp.invite ? t.join : t.signIn}</h1>
            <p className="muted">{t.noPassword}</p>
            {sp.error === "expired" && <p className="notice">{t.expired}</p>}
            {sp.error === "email" && <p className="notice">{t.badEmail}</p>}
            <div className="field">
              <label htmlFor="email">{t.email}</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
            </div>
            {sp.invite && <input type="hidden" name="invite" value={sp.invite} />}
            <button className="btn btn-primary" type="submit">{t.submit}</button>
            {!sp.invite && <p className="small muted">{t.newHere} <Link href={`/${lang}/start`}>{t.start}</Link></p>}
          </form>
        )}
      </div>
    </main>
  );
}
