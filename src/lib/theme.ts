/** Site look: "book" (pages, chapters, notes in the margins) or "classic" (the earlier look). */
export type Theme = "book" | "classic";
export const THEME_COOKIE = "tn_theme";
/** Default for everyone; set SITE_THEME=classic in Vercel to roll the whole site back. */
export const DEFAULT_THEME: Theme = process.env.NEXT_PUBLIC_SITE_THEME === "classic" || process.env.SITE_THEME === "classic" ? "classic" : "book";
export const isTheme = (v: unknown): v is Theme => v === "book" || v === "classic";
