import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { track } from "@/lib/analytics";
import { sendEmail, emailLayout } from "@/lib/email";
import { appUrl, token } from "@/lib/util";

const YEAR = 365 * 24 * 3600 * 1000;

/** Stripe webhook: activates plans, extends subscriptions, issues gift codes. */
export async function POST(req: Request) {
  const s = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !secret) return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = s.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const cs = event.data.object as Stripe.Checkout.Session;
    const { familyId, userId, product, giftTo } = (cs.metadata ?? {}) as Record<string, string>;
    const customer = typeof cs.customer === "string" ? cs.customer : null;

    if (product === "legacy" && giftTo) {
      // Gift for someone else: issue a code and email the recipient.
      const code = token(9);
      await db.giftCode.upsert({
        where: { stripeSessionId: cs.id },
        create: { code, purchasedById: userId, recipientEmail: giftTo, stripeSessionId: cs.id },
        update: {},
      });
      const link = appUrl(`/en/start?gift=${code}`);
      await sendEmail(
        giftTo,
        "Someone gave you Treename",
        emailLayout("A gift for your family’s stories", "Someone who loves you gave you a year of Treename: 52 questions, your voice kept forever, and a hardcover family book.", { label: "Open your gift", url: link }),
        `Someone gave you Treename. Open your gift: ${link}`
      );
      await track("gift_purchased", { familyId, userId, props: { forOther: true } });
    } else if (familyId) {
      const plan = product === "founding" ? "founding" : product === "legacy" ? "legacy" : "family";
      await db.family.update({
        where: { id: familyId },
        data: { plan, planExpiresAt: plan === "founding" ? null : new Date(Date.now() + YEAR), stripeCustomerId: customer ?? undefined },
      });
      await track(product === "legacy" ? "gift_purchased" : "subscription_started", { familyId, userId, props: { product } });
    }
  }

  if (event.type === "invoice.paid") {
    const inv = event.data.object as Stripe.Invoice;
    const customer = typeof inv.customer === "string" ? inv.customer : null;
    if (customer) {
      await db.family.updateMany({ where: { stripeCustomerId: customer, plan: "family" }, data: { planExpiresAt: new Date(Date.now() + YEAR + 7 * 24 * 3600 * 1000) } });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customer = typeof sub.customer === "string" ? sub.customer : null;
    if (customer) {
      // The archive stays readable: we only stop new paid features after the period ends.
      const fams = await db.family.findMany({ where: { stripeCustomerId: customer, plan: "family" } });
      for (const f of fams) await track("subscription_cancelled", { familyId: f.id, props: { reason: sub.cancellation_details?.reason ?? "unknown" } });
    }
  }

  return NextResponse.json({ received: true });
}
