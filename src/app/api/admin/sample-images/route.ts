import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { isLang } from "@/i18n/config";
import { generateSample } from "@/lib/sampleImages";

export const maxDuration = 300;

/** Founder tool: make one picture of a sample book. Body: { lang, slot }. */
export async function POST(req: Request) {
  const user = await getUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!user || !admins.includes(user.email.toLowerCase())) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  const { lang, slot } = (await req.json().catch(() => ({}))) as { lang?: string; slot?: string };
  if (!isLang(lang) || !slot) return NextResponse.json({ error: "lang and slot are required" }, { status: 400 });
  try {
    const err = await generateSample(lang, slot);
    if (err) return NextResponse.json({ error: err }, { status: 502 });
    revalidatePath(`/${lang}/book`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message.slice(0, 300) : "Failed" }, { status: 500 });
  }
}
