import { NextResponse } from "next/server";
import { requireFamily } from "@/lib/auth";
import { stripe, priceFor, type Product } from "@/lib/stripe";
import { appUrl, clean } from "@/lib/util";
import { track } from "@/lib/analytics";
import { isDemoFamily } from "@/lib/demo";

export async function POST(req: Request) {
  const { user, family } = await requireFamily();
  if (isDemoFamily(family.id)) return NextResponse.redirect(new URL("/app?readonly=1", req.url), 303);
  const form = await req.formData();
  const product = clean(form.get("product"), 20) as Product;
  const giftTo = clean(form.get("giftTo"), 200).toLowerCase();
  const s = stripe();
  const price = priceFor(product);
  if (!s || !price) return NextResponse.redirect(new URL("/app/billing?canceled=1", req.url), 303);

  const session = await s.checkout.sessions.create({
    mode: product === "family" ? "subscription" : "payment",
    line_items: [{ price, quantity: 1 }],
    customer: family.stripeCustomerId ?? undefined,
    customer_email: family.stripeCustomerId ? undefined : user.email,
    allow_promotion_codes: true,
    automatic_tax: { enabled: false },
    success_url: appUrl("/app?paid=1"),
    cancel_url: appUrl("/app/billing?canceled=1"),
    metadata: { familyId: family.id, userId: user.id, product, giftTo },
    ...(product === "family" ? { subscription_data: { metadata: { familyId: family.id } } } : {}),
  });
  await track("checkout_started", { familyId: family.id, userId: user.id, props: { product, gift: !!giftTo } });
  return NextResponse.redirect(session.url!, 303);
}
