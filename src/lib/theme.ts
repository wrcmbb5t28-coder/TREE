/**
 * Site look: "comic" (clear-line comic panels, the style of the homepage; default since Oct 2026),
 * "book" (pages on a dark desk) or "classic" (the earliest look).
 * Roll the whole site back with SITE_THEME=book or SITE_THEME=classic in Vercel.
 */
export type Theme = "comic" | "book" | "classic";
/** New cookie name, so choices made in the old look don't hide the new one. */
export const THEME_COOKIE = "tn_look";
const env = (process.env.NEXT_PUBLIC_SITE_THEME || process.env.SITE_THEME || "").toLowerCase();
export const DEFAULT_THEME: Theme = env === "classic" ? "classic" : env === "book" ? "book" : "comic";
export const isTheme = (v: unknown): v is Theme => v === "comic" || v === "book" || v === "classic";
