import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clean } from "@/lib/util";
import { isLang } from "@/i18n/config";
import { track } from "@/lib/analytics";

const PLANS = ["launch", "family", "legacy", "founding"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Beta form: "tell me at launch" or a free, non-binding Founding Family reservation. Plain form post, then back to the page. */
export async function POST(req: Request) {
  const form = await req.formData();
  const email = clean(form.get("email"), 200).toLowerCase();
  const planRaw = clean(form.get("plan"), 20);
  const plan = (PLANS as readonly string[]).includes(planRaw) ? planRaw : "launch";
  const langRaw = clean(form.get("lang"), 5);
  const lang = isLang(langRaw) ? langRaw : "en";
  const familyId = clean(form.get("familyId"), 40) || null;
  let next = clean(form.get("next"), 300);
  if (!next.startsWith("/") || next.startsWith("//")) next = `/${lang}`;
  const back = (q: string) => {
    const [path, hash] = next.split("#");
    return NextResponse.redirect(new URL(`${path}${path.includes("?") ? "&" : "?"}${q}${hash ? `#${hash}` : ""}`, req.url), 303);
  };

  // Honeypot: real people never fill this field.
  if (clean(form.get("website"), 100)) return back(`joined=${plan}`);
  if (!EMAIL.test(email)) return back("joined=bad");

  await db.waitlist.upsert({
    where: { email_plan: { email, plan } },
    create: { email, plan, lang, familyId },
    update: { lang, ...(familyId ? { familyId } : {}) },
  });
  await track("waitlist_joined", { familyId: familyId ?? undefined, props: { plan, lang } });
  return back(`joined=${plan}`);
}
