import { createHash } from "crypto";
import { db } from "@/lib/db";

/** Temporary: lets the developer read recent server errors (code-level messages only). Remove after debugging. */
const HASH = "12014c0dc4fefab25b84751e5042a7a7ddef75787f23c541e191a1d792b570f9";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  if (createHash("sha256").update(t).digest("hex") !== HASH) return new Response("Not found", { status: 404 });
  const rows = await db.analyticsEvent.findMany({ where: { name: "server_error" }, orderBy: { createdAt: "desc" }, take: 10 });
  return Response.json(rows.map((r) => {
    const p = JSON.parse(r.props || "{}");
    return { at: r.createdAt, route: p.route, digest: p.digest, message: String(p.message ?? "").slice(0, 400), stack: String(p.stack ?? "").slice(0, 1200) };
  }));
}
