import type { Family } from "@prisma/client";
import { isPaid } from "@/lib/plans";

/**
 * Payment mode, switched in Vercel with PAYMENTS_MODE:
 *   beta (default) — everything is free, prices are shown as "after launch", no checkout;
 *                    visitors can leave an e-mail to be told about the launch or reserve a Founding place.
 *   live           — Stripe checkout and the free-plan limits are on.
 */
export function paymentsLive(): boolean {
  return (process.env.PAYMENTS_MODE ?? "").trim().toLowerCase() === "live";
}

/** True when the family may use everything without limits: always during beta, otherwise only on a paid plan. */
export function hasFullAccess(family: Pick<Family, "plan" | "planExpiresAt">): boolean {
  return !paymentsLive() || isPaid(family);
}
