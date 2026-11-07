import { NextResponse, type NextRequest } from "next/server";
import { LANGS, pickLang, NO_RU_COUNTRIES, NO_RU_COOKIE, RU_OVERRIDE_COOKIE } from "@/i18n/config";

/**
 * - "/" redirects to the visitor's language (Accept-Language), e.g. /de
 * - Passes the language of the current URL to the root layout via a header,
 *   so <html lang> is correct for every page.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase();
  const override = req.nextUrl.searchParams.get("ru") === "1" || req.cookies.get(RU_OVERRIDE_COOKIE)?.value === "1";
  const noRu = NO_RU_COUNTRIES.has(country) && !override;
  const accept = req.headers.get("accept-language");
  const withNoRu = (res: NextResponse) => {
    if (noRu) res.cookies.set(NO_RU_COOKIE, "1", { path: "/", maxAge: 60 * 60 * 24, sameSite: "lax" });
    else if (req.cookies.get(NO_RU_COOKIE)) res.cookies.delete(NO_RU_COOKIE);
    if (req.nextUrl.searchParams.get("ru") === "1") res.cookies.set(RU_OVERRIDE_COOKIE, "1", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  };

  if (pathname === "/") {
    const lang = pickLang(accept, noRu ? ["ru"] : []);
    return withNoRu(NextResponse.redirect(new URL(`/${lang}`, req.url)));
  }

  const first = pathname.split("/")[1];
  // Russian pages are not offered in the EU and Switzerland: same page in the visitor's other language.
  if (first === "ru" && noRu) {
    const to = new URL(req.url);
    to.pathname = `/${pickLang(accept, ["ru"])}${pathname.slice(3)}`;
    return withNoRu(NextResponse.redirect(to));
  }
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
  return withNoRu(res);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|svg|ico|webp)$).*)"],
};
