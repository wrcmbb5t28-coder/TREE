import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in | Treename", robots: { index: false } };

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; dev?: string; error?: string; invite?: string }>;
}) {
  const sp = await searchParams;
  if (!sp.invite && (await getUser())) redirect("/app");
  return (
    <main className="answer-page">
      <div className="answer-card card-elev">
        <Link className="logo" href="/"><b>Treename</b></Link>
        {sp.sent ? (
          <div className="stack">
            <h1 style={{ fontSize: "2rem" }}>Check your inbox</h1>
            <p className="muted">We sent a sign-in link to <b>{sp.sent}</b>. It works once and expires in 24 hours.</p>
            {sp.dev && (
              <div className="notice">
                <p className="small">Development mode: email is not configured. Open this link to sign in:</p>
                <a href={sp.dev} style={{ wordBreak: "break-all" }}>{sp.dev}</a>
              </div>
            )}
          </div>
        ) : (
          <form className="stack" method="post" action="/api/auth/request">
            <h1 style={{ fontSize: "2rem" }}>{sp.invite ? "Join your family on Treename" : "Sign in"}</h1>
            <p className="muted">No password. We email you a link that signs you in.</p>
            {sp.error === "expired" && <p className="notice">That link has expired or was already used. Request a new one.</p>}
            {sp.error === "email" && <p className="notice">Please enter a valid email address.</p>}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
            </div>
            {sp.invite && <input type="hidden" name="invite" value={sp.invite} />}
            <button className="btn btn-primary" type="submit">Email me a sign-in link</button>
            {!sp.invite && <p className="small muted">New here? <Link href="/en/start">Start your family story</Link></p>}
          </form>
        )}
      </div>
    </main>
  );
}
