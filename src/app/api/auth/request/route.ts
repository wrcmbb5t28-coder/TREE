import { NextResponse } from "next/server";
import { clean } from "@/lib/util";
import { sendLoginLink } from "@/lib/login";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = clean(form.get("email"), 200).toLowerCase();
  const invite = clean(form.get("invite"), 64) || undefined;
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.redirect(new URL("/login?error=email", req.url), 303);
  }
  const { devLink } = await sendLoginLink({ email, inviteToken: invite });
  const url = new URL("/login", req.url);
  url.searchParams.set("sent", email);
  if (devLink) url.searchParams.set("dev", devLink);
  return NextResponse.redirect(url, 303);
}
