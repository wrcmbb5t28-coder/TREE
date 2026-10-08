import { requireFamily } from "@/lib/auth";
import { isPaid, PLANS } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import { track } from "@/lib/analytics";

const OFFERS = [
  { key: "family", name: "Family", price: "$59", per: "per year, whole family", points: ["Unlimited interviews and voice", "Stories, chapters and translation", "Journey map and family page", "Digital family book"] },
  { key: "legacy", name: "Legacy Gift", price: "$99", per: "one time", points: ["One year of Family", "52 weekly questions for one storyteller", "One hardcover color book", "Arrives as a gift card"] },
  { key: "founding", name: "Founding Family", price: "$249", per: "one time · first 500 families", points: ["Family plan for life", "One hardcover book", "Help shape Treename"] },
] as const;

export default async function Billing({ searchParams }: { searchParams: Promise<{ plan?: string; reason?: string; canceled?: string }> }) {
  const sp = await searchParams;
  const { user, family } = await requireFamily();
  const paid = isPaid(family);
  const configured = !!stripe();
  await track("paywall_viewed", { familyId: family.id, userId: user.id, props: { trigger: sp.reason ?? "billing_page" } });

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head">
        <div><p className="eyebrow">Current plan: {(PLANS[family.plan as keyof typeof PLANS] ?? PLANS.free).name}</p><h1>Keep your family’s stories forever</h1></div>
      </div>
      {sp.reason === "answers" && <div className="notice">Answers are always saved. The Family plan unlocks unlimited interviews and the full archive.</div>}
      {sp.reason === "photos" && <div className="notice">You reached the 50 free photos. The Family plan has no photo limit.</div>}
      {sp.canceled && <div className="notice">Payment was canceled. Nothing was charged.</div>}
      {!configured && <div className="notice">Payments are not configured yet (STRIPE_SECRET_KEY). Buttons are shown for testing the layout.</div>}
      {paid && <div className="notice">Your family plan is active. Thank you.</div>}
      <div className="cards3" style={{ marginTop: 0 }}>
        {OFFERS.map((o) => (
          <form key={o.key} method="post" action="/api/stripe/checkout" className={`card price${o.key === (sp.plan ?? "family") ? " feat" : ""}`}>
            <input type="hidden" name="product" value={o.key} />
            <h3>{o.name}</h3>
            <div className="amt">{o.price} <small>{o.per}</small></div>
            <ul>{o.points.map((p) => <li key={p}>{p}</li>)}</ul>
            {o.key === "legacy" && (
              <div className="field"><label htmlFor="giftTo">Gift for (optional email)</label><input id="giftTo" name="giftTo" type="email" placeholder="Leave empty to use it yourself" /></div>
            )}
            <button className="btn btn-primary" disabled={!configured}>Continue to payment</button>
          </form>
        ))}
      </div>
      <p className="small muted">Prices in USD; EUR and CHF prices are the same numbers. Payments are processed by Stripe. If you cancel, your archive stays readable and exportable.</p>
    </div>
  );
}
