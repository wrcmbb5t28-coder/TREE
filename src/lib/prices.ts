import type { Lang } from "@/i18n/config";

/**
 * Prices shown on the site, per language.
 * Base prices are in USD (what Stripe charges today). Russian shows rubles at the
 * Bank of Russia rate of 14.10.2026 (83.87 ₽/$), rounded; DE/FR/IT/ES show euros
 * (rate 1 € = 1.118 $ from the same day), rounded to whole euros.
 */
const NB = " ";
type P = { currency: "USD" | "EUR" | "RUB"; free: string; family: string; legacy: string; founding: string; amount: { family: number; legacy: number; founding: number } };
const eur: P = { currency: "EUR", free: `0${NB}€`, family: `53${NB}€`, legacy: `89${NB}€`, founding: `223${NB}€`, amount: { family: 53, legacy: 89, founding: 223 } };
export const PRICES: Record<Lang, P> = {
  en: { currency: "USD", free: "$0", family: "$59", legacy: "$99", founding: "$249", amount: { family: 59, legacy: 99, founding: 249 } },
  ru: { currency: "RUB", free: `0${NB}₽`, family: `4${NB}950${NB}₽`, legacy: `8${NB}300${NB}₽`, founding: `20${NB}900${NB}₽`, amount: { family: 4950, legacy: 8300, founding: 20900 } },
  de: eur, fr: eur, it: eur, es: eur,
};
