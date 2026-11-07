export const LANGS = ["en", "de", "fr", "it", "es", "ru"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const LANG_LABEL: Record<Lang, string> = {
  en: "EN", de: "DE", fr: "FR", it: "IT", es: "ES", ru: "RU",
};

export const LANG_NAME: Record<Lang, string> = {
  en: "English", de: "Deutsch", fr: "Français", it: "Italiano", es: "Español", ru: "Русский",
};

// hreflang codes; German, French and Italian also cover Switzerland.
export const HREFLANG: Record<Lang, string> = {
  en: "en", de: "de", fr: "fr", it: "it", es: "es", ru: "ru",
};

export function isLang(x: string | undefined | null): x is Lang {
  return !!x && (LANGS as readonly string[]).includes(x);
}

export function pickLang(acceptLanguage: string | null | undefined, exclude: readonly Lang[] = []): Lang {
  if (!acceptLanguage) return DEFAULT_LANG;
  for (const part of acceptLanguage.split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (isLang(code) && !exclude.includes(code)) return code;
  }
  return DEFAULT_LANG;
}

/**
 * Russian is not offered to visitors from the EU and Switzerland (country from Vercel's
 * x-vercel-ip-country header). People who already use Treename in Russian keep it;
 * /ru?ru=1 turns Russian back on for one browser (for the team).
 */
export const NO_RU_COUNTRIES = new Set([
  "CH", "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);
export const NO_RU_COOKIE = "tn_noru";
export const RU_OVERRIDE_COOKIE = "tn_ru";

export const COUNTRY_CODES = ["CH", "IT", "DE", "FR", "ES", "PT", "AT", "RU", "UA", "PL", "GB", "US", "AR", "BR"] as const;

export function countryName(code: string, lang: Lang): string {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
