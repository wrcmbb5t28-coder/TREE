import type { Family } from "@prisma/client";

export const FREE_LIMITS = {
  answeredQuestions: 3,
  photos: 50,
  voiceMinutes: 60,
};

export const PLANS = {
  free: { name: "Free", price: "$0" },
  family: { name: "Family", price: "$59 / year" },
  legacy: { name: "Legacy Gift", price: "$99 one time" },
  founding: { name: "Founding Family", price: "$249 one time" },
} as const;

export function isPaid(family: Pick<Family, "plan" | "planExpiresAt">): boolean {
  if (family.plan === "founding") return true; // lifetime for the first 500 families
  if (family.plan === "family" || family.plan === "legacy") {
    return !family.planExpiresAt || family.planExpiresAt > new Date();
  }
  return false;
}
