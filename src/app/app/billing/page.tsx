import { isPaid } from "@/lib/plans";
import { appContext } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { more } from "@/i18n/app/more";
import { stripe } from "@/lib/stripe";
import { track } from "@/lib/analytics";
import { PRICES } from "@/lib/prices";
import { paymentsLive } from "@/lib/payments";
import { BETA } from "@/i18n/beta";
import { db } from "@/lib/db";

const OFFERS = ["family", "legacy", "founding"] as const;

export default async function Billing({ searchParams }: { searchParams: Promise<{ plan?: string; reason?: string; canceled?: string; joined?: string }> }) {
  const sp = await searchParams;
  const { user, family, lang } = await appContext();
  const t = more[lang].billing;
  const c = common[lang];
  const paid = isPaid(family);
  if (!paymentsLive()) return <BetaBilling lang={lang} email={user.email} familyId={family.id} plan={sp.plan} joined={sp.joined} planLabels={c.plans} />;
  const configured = !!stripe();
  await track("paywall_viewed", { familyId: family.id, userId: user.id, props: { trigger: sp.reason ?? "billing_page" } });

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head">
        <div><p className="eyebrow">{t.current(c.plans[family.plan as keyof typeof c.plans] ?? c.plans.free)}</p><h1>{t.title}</h1></div>
      </div>
      {sp.reason === "answers" && <div className="notice">{t.reasonAnswers}</div>}
      {sp.reason === "photos" && <div className="notice">{t.reasonPhotos}</div>}
      {sp.canceled && <div className="notice">{t.canceled}</div>}
      {!configured && <div className="notice">{t.notConfigured}</div>}
      {paid && <div className="notice">{t.active}</div>}
      <div className="cards3" style={{ marginTop: 0 }}>
        {OFFERS.map((key) => ({ key, price: PRICES[lang][key] })).map((o) => (
          <form key={o.key} method="post" action="/api/stripe/checkout" className={`card price${o.key === (sp.plan ?? "family") ? " feat" : ""}`}>
            <input type="hidden" name="product" value={o.key} />
            <h3>{c.plans[o.key]}</h3>
            <div className="amt">{o.price} <small>{t.offers[o.key].per}</small></div>
            <ul>{t.offers[o.key].points.map((p) => <li key={p}>{p}</li>)}</ul>
            {o.key === "legacy" && (
              <div className="field"><label htmlFor="giftTo">{t.giftLabel}</label><input id="giftTo" name="giftTo" type="email" placeholder={t.giftPh} /></div>
            )}
            <button className="btn btn-primary" disabled={!configured}>{t.cta}</button>
          </form>
        ))}
      </div>
      <p className="small muted">{t.footnote}</p>
    </div>
  );
}

/** Free beta: prices "after launch", with a launch e-mail or a free, non-binding Founding reservation instead of checkout. */
async function BetaBilling({ lang, email, familyId, plan, joined, planLabels }: {
  lang: keyof typeof BETA; email: string; familyId: string; plan?: string; joined?: string; planLabels: Record<string, string>;
}) {
  const b = BETA[lang];
  const t = more[lang].billing;
  const have = new Set((await db.waitlist.findMany({ where: { email: email.toLowerCase() }, select: { plan: true } })).map((w) => w.plan));
  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head">
        <div><p className="eyebrow">{b.menu}</p><h1>{b.billingTitle}</h1></div>
      </div>
      <div className="notice">
        <p style={{ margin: 0 }}>{b.billingText}</p>
        <p style={{ margin: "8px 0 0", fontWeight: 600 }}>{b.bonus}</p>
      </div>
      {joined && joined !== "bad" && <div className="notice" role="status">{joined === "founding" ? b.doneFounding : b.done}</div>}
      <div className="cards3" style={{ marginTop: 0 }}>
        {OFFERS.map((key) => {
          const done = have.has(key);
          return (
            <form key={key} method="post" action="/api/waitlist" className={`card price${key === (plan ?? "founding") ? " feat" : ""}`}>
              <input type="hidden" name="plan" value={key} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="lang" value={lang} />
              <input type="hidden" name="familyId" value={familyId} />
              <input type="hidden" name="next" value="/app/billing" />
              <h3>{planLabels[key]}</h3>
              <div className="amt">{PRICES[lang][key]} <small>{t.offers[key].per}</small> <span className="beta-after">{b.afterLaunch}</span></div>
              <ul>{t.offers[key].points.map((p) => <li key={p}>{p}</li>)}</ul>
              <button className={`btn ${key === "founding" ? "btn-primary" : "btn-ghost"}`} disabled={done}>{done ? b.cardDone[key] : b.cardBtn[key]}</button>
            </form>
          );
        })}
      </div>
      <p className="small muted">{b.reserveFine}</p>
    </div>
  );
}
