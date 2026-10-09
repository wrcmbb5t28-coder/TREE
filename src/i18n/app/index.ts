/**
 * App (signed-in area) interface language.
 * Each person picks their own language (User.uiLang, header switcher or Settings);
 * until they do, the family's language is used. Story text stays in the family's language.
 *
 * Strings live in section files next to this one (common.ts, home.ts, ...). Each exports
 * one object per language with the same shape as English; values may be functions
 * for interpolation, e.g. hello: (name: string) => `Hello, ${name}`.
 */
import { isLang, type Lang } from "../config";
import { requireFamily } from "@/lib/auth";

export type { Lang };

export function uiLang(user: { uiLang?: string | null }, family: { lang: string }): Lang {
  if (isLang(user.uiLang)) return user.uiLang;
  return isLang(family.lang) ? family.lang : "en";
}

/** requireFamily() plus the interface language. Use in every /app page. */
export async function appContext() {
  const ctx = await requireFamily();
  return { ...ctx, lang: uiLang(ctx.user, ctx.family) };
}

const LOCALE: Record<Lang, string> = { en: "en-GB", de: "de-CH", fr: "fr-CH", it: "it-CH", es: "es-ES", ru: "ru-RU" };

export function fmtDate(d: Date, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  return d.toLocaleDateString(LOCALE[lang], opts);
}

/** Pick the right plural form: plural(lang, n, { one, few, many, other }). Russian uses one/few/many. */
export function plural(lang: Lang, n: number, forms: { one: string; few?: string; many?: string; other: string }): string {
  const rule = new Intl.PluralRules(LOCALE[lang]).select(n);
  const f = (forms as Record<string, string | undefined>)[rule] ?? forms.other;
  return f.replace("#", String(n));
}
