import type { Metadata } from "next";
import Link from "next/link";
import { authT, visitorLang } from "@/i18n/app/auth";

export const metadata: Metadata = { robots: { index: false } };

/**
 * Landing page of the emailed sign-in link. Opening it does NOT use the link up:
 * mail scanners (Outlook, Gmail, antivirus) open links before the person does.
 * The link is spent only when the person presses the button (POST).
 */
export default async function OpenLink({ searchParams }: { searchParams: Promise<{ token?: string; next?: string }> }) {
  const sp = await searchParams;
  const t = authT[await visitorLang()].login;
  return (
    <main className="answer-page">
      <div className="answer-card card-elev">
        <Link className="logo" href="/"><b>Treename</b></Link>
        <form className="stack" method="post" action="/api/auth/verify">
          <h1 style={{ fontSize: "2rem" }}>{t.openTitle}</h1>
          <p className="muted">{t.openText}</p>
          <input type="hidden" name="token" value={sp.token ?? ""} />
          {sp.next && <input type="hidden" name="next" value={sp.next} />}
          <button className="btn btn-primary" type="submit" autoFocus>{t.openBtn}</button>
        </form>
      </div>
    </main>
  );
}
