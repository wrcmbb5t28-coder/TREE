import { redirect } from "next/navigation";
import { enterDemo } from "@/lib/demo";
import { isLang, pickLang } from "@/i18n/config";
import { track } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/** /demo?lang=ru — open the sample family (read-only) in that interface language. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("lang");
  const lang = isLang(q) ? q : pickLang(req.headers.get("accept-language"));
  await enterDemo(lang);
  await track("demo_opened", { props: { lang } }).catch(() => {});
  const to = url.searchParams.get("to") ?? "/app";
  redirect(to.startsWith("/app") ? to : "/app");
}
