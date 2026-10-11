import { NextResponse, type NextRequest } from "next/server";
import { LANGS, pickLang } from "@/i18n/config";

/**
 * - "/" redirects to the visitor's language (Accept-Language), e.g. /de
 * - Passes the language of the current URL to the root layout via a header,
 *   so <html lang> is correct for every page.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const lang = pickLang(req.headers.get("accept-language"));
    return NextResponse.redirect(new URL(`/${lang}`, req.url));
  }

  const first = pathname.split("/")[1];
  const lang = (LANGS as readonly string[]).includes(first) ? first : "en";
  const headers = new Headers(req.headers);
  headers.set("x-tn-lang", lang);
  const res = NextResponse.next({ request: { headers } });
  // Remember the site language, so sign-in and invite pages (no language in the URL) speak it too.
  if ((LANGS as readonly string[]).includes(first) && req.cookies.get("tn_lang")?.value !== first) {
    res.cookies.set("tn_lang", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  // First-touch attribution: where the visitor came from (ad, post, newsletter, friend's link).
  // Kept 60 days; only the campaign tags, never anything personal.
  const q = req.nextUrl.searchParams;
  const src = q.get("utm_source") || q.get("ref");
  if (src && !req.cookies.get("tn_src")) {
    const clip = (v: string | null) => (v ?? "").replace(/[^\w.\- ]/g, "").slice(0, 40);
    const val = [clip(src), clip(q.get("utm_medium")), clip(q.get("utm_campaign")), pathname.replace(/[^\w/.\-]/g, "").slice(0, 40)].join("|");
    res.cookies.set("tn_src", val, { path: "/", maxAge: 60 * 60 * 24 * 60, sameSite: "lax" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|svg|ico|webp)$).*)"],
};
