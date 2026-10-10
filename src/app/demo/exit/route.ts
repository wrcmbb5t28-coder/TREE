import { redirect } from "next/navigation";
import { exitDemo } from "@/lib/demo";
import { isLang } from "@/i18n/config";

export const dynamic = "force-dynamic";

/** Leave the sample family: back to your own family, or to the start page to make one. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("lang");
  const lang = isLang(q) ? q : "en";
  const hadAccount = await exitDemo();
  redirect(hadAccount ? "/app" : url.searchParams.get("start") ? `/${lang}/start` : `/${lang}`);
}
