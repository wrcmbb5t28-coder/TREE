import { NextResponse } from "next/server";
import { clean } from "@/lib/util";
import { sendLoginLink } from "@/lib/login";
import { visitorLang } from "@/i18n/app/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = clean(form.get("email"), 200).toLowerCase();
  const invite = clean(form.get("invite"), 64) || undefined;
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.redirect(new URL("/login?error=email", req.url), 303);
  }
  // Known people get the email in their own app language; new visitors in the site language.
  const known = await db.user.findUnique({ where: { email }, include: { memberships: { include: { family: true }, take: 1 } } });
  const lang = known?.uiLang ?? known?.memberships[0]?.family.lang ?? (await visitorLang());
  const { devLink } = await sendLoginLink({ email, inviteToken: invite, lang });
  const url = new URL("/login", req.url);
  url.searchParams.set("sent", email);
  if (devLink) url.searchParams.set("dev", devLink);
  return NextResponse.redirect(url, 303);
}
