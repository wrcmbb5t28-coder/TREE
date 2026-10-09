import { isPaid } from "@/lib/plans";
import { appContext } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { more } from "@/i18n/app/more";
import { stripe } from "@/lib/stripe";
import { track } from "@/lib/analytics";

const OFFERS = [
  { key: "family", price: "$59" },
  { key: "legacy", price: "$99" },
  { key: "founding", price: "$249" },
] as const;

export default async function Billing({ searchParams }: { searchParams: Promise<{ plan?: string; reason?: string; canceled?: string }> }) {
  const sp = await searchParams;
  const { user, family, lang } = await appContext();
  const t = more[lang].billing;
  const c = common[lang];
  const paid = isPaid(family);
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
        {OFFERS.map((o) => (
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
