import { NextResponse } from "next/server";
import { THEME_COOKIE, isTheme } from "@/lib/theme";

/** /api/theme?to=classic&back=/app — switch the look for this browser and go back. */
export function GET(req: Request) {
  const url = new URL(req.url);
  const to = url.searchParams.get("to");
  const back = url.searchParams.get("back") ?? "/";
  const safeBack = back.startsWith("/") && !back.startsWith("//") ? back : "/";
  const res = NextResponse.redirect(new URL(safeBack, url.origin));
  if (isTheme(to)) res.cookies.set(THEME_COOKIE, to, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}
