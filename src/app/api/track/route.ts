import { NextResponse } from "next/server";
import { track, type EventName } from "@/lib/analytics";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Only these events may come from the browser; everything else is tracked server-side.
const CLIENT_EVENTS = new Set<EventName>([
  "onboarding_started",
  "onboarding_step_completed",
  "share_clicked",
  "book_preview_opened",
  "paywall_viewed",
]);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { name?: string; familyId?: string; props?: Record<string, unknown> };
  if (!body.name || !CLIENT_EVENTS.has(body.name as EventName)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const user = await getUser();
  let familyId: string | null = null;
  if (user && body.familyId) {
    const m = await db.membership.findUnique({ where: { userId_familyId: { userId: user.id, familyId: body.familyId } } });
    if (m) familyId = body.familyId;
  }
  const props = Object.fromEntries(Object.entries(body.props ?? {}).slice(0, 10).map(([k, v]) => [k.slice(0, 40), typeof v === "string" ? v.slice(0, 100) : v]));
  await track(body.name as EventName, { userId: user?.id, familyId, props });
  return NextResponse.json({ ok: true });
}
