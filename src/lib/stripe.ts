import Stripe from "stripe";

let client: Stripe | null = null;

export function stripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export type Product = "family" | "legacy" | "founding";

export function priceFor(p: Product): string | undefined {
  return {
    family: process.env.STRIPE_PRICE_FAMILY_YEARLY,
    legacy: process.env.STRIPE_PRICE_LEGACY_GIFT,
    founding: process.env.STRIPE_PRICE_FOUNDING,
  }[p];
}
