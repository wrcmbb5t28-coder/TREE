import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { contributingFamilies28d } from "@/lib/analytics";
import { storageCheck } from "@/lib/storage";
import SampleImagesPanel from "@/components/SampleImagesPanel";
import { ALL_LANGS, existingSamples, imageKey, sampleSlots } from "@/lib/sampleImages";
import { sampleBook } from "@/lib/sampleBook";

/**
 * Founder metrics. Visible only to emails listed in ADMIN_EMAILS (comma-separated).
 * North Star: Contributing Families (28 days).
 */
export default async function Admin() {
  const user = await requireUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!admins.includes(user.email.toLowerCase())) notFound();

  const since = new Date(Date.now() - 28 * 24 * 3600 * 1000);
  const [northStar, families, users, events] = await Promise.all([
    contributingFamilies28d(),
    db.family.count(),
    db.user.count(),
    db.analyticsEvent.groupBy({ by: ["name"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
  ]);
  const storage = await storageCheck();
  const sampleRows = await Promise.all(ALL_LANGS.map(async (lang) => {
    const has = await existingSamples(lang);
    return { lang, family: sampleBook(lang).title, slots: sampleSlots(lang).map((s) => ({ slot: s.slot, title: s.title, has: has.has(s.slot) })) };
  }));
  const errors = await db.analyticsEvent.findMany({ where: { name: "server_error" }, orderBy: { createdAt: "desc" }, take: 12 });
  const keys: [string, boolean][] = [
    ["Database (DATABASE_URL)", !!process.env.DATABASE_URL],
    ["File storage (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN)", !!(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN)],
    ["AI stories (ANTHROPIC_API_KEY)", !!process.env.ANTHROPIC_API_KEY],
    ["Voice to text (TRANSCRIBE_API_KEY)", !!process.env.TRANSCRIBE_API_KEY],
    ["Sample book photographs (OPENAI_API_KEY)", !!imageKey()],
    ["Email (RESEND_API_KEY)", !!process.env.RESEND_API_KEY],
    ["Payments (STRIPE_SECRET_KEY)", !!process.env.STRIPE_SECRET_KEY],
    ["Sign-in links on screen (SHOW_LOGIN_LINKS) — remove before launch", process.env.SHOW_LOGIN_LINKS === "1"],
  ];
  const n = (name: string) => events.find((e) => e.name === name)?._count._all ?? 0;
  const funnel = [
    ["Onboarding started", n("onboarding_started")],
    ["Tree created", n("tree_created")],
    ["Signed up", n("signup")],
    ["Question sent", n("question_sent")],
    ["Question opened", n("question_opened")],
    ["Answer recorded", n("answer_recorded")],
    ["Invite accepted", n("invite_accepted")],
    ["Paid (subscription or gift)", n("subscription_started") + n("gift_purchased")],
  ] as const;
  const top = Math.max(1, funnel[0][1]);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head"><div><p className="eyebrow">Last 28 days</p><h1>Metrics</h1></div></div>
      <section className="card stack" style={{ gap: 10 }}>
        <h2 style={{ fontSize: "1.2rem" }}>System check</h2>
        <p className={storage.ok ? "small" : "notice small"}>
          <b>{storage.ok ? "✓" : "✗"} File storage:</b> {storage.driver}{storage.store ? ` · store ${storage.store}` : ""} · {storage.detail}
        </p>
        <ul className="small" style={{ margin: 0 }}>
          {keys.map(([label, on]) => <li key={label}>{on ? "✓" : "—"} {label}</li>)}
        </ul>
      </section>
      {errors.length > 0 && (
        <section className="card stack" style={{ gap: 10 }}>
          <h2 style={{ fontSize: "1.2rem" }}>Recent server errors</h2>
          {errors.map((e) => {
            const p = JSON.parse(e.props || "{}") as Record<string, string>;
            return (
              <details key={e.id} className="small">
                <summary><b>{e.createdAt.toISOString().slice(0, 16).replace("T", " ")}</b> · {p.path} · {p.digest} · {p.message?.slice(0, 140)}</summary>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: ".75rem" }}>{p.message}{"\n"}{p.stack}</pre>
              </details>
            );
          })}
        </section>
      )}
      <div className="kpis">
        <div className="kpi"><b>{northStar}</b><span>Contributing families (North Star)</span></div>
        <div className="kpi"><b>{families}</b><span>families total</span></div>
        <div className="kpi"><b>{users}</b><span>users total</span></div>
        <div className="kpi"><b>{n("invite_sent") ? (n("invite_accepted") / n("invite_sent")).toFixed(2) : "–"}</b><span>invite acceptance rate</span></div>
      </div>
      <section className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>Activation funnel</h2>
        {funnel.map(([label, v]) => (
          <div key={label} className="stack" style={{ gap: 4 }}>
            <div className="row between small"><span>{label}</span><b style={{ fontVariantNumeric: "tabular-nums" }}>{v}</b></div>
            <div style={{ height: 10, background: "var(--tint)", borderRadius: 6 }}>
              <div style={{ height: 10, width: `${(v / top) * 100}%`, background: "var(--accent)", borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </section>
      <section className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>Sample book photographs</h2>
        <p className="small muted">Each language has its own made-up family. Pictures are made once (about 10 per language) and stored with the other files.</p>
        <SampleImagesPanel rows={sampleRows} hasKey={!!imageKey()} />
      </section>
    </div>
  );
}
