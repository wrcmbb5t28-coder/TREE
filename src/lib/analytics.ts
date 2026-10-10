import { db } from "./db";

/**
 * Event names follow the tracking plan in the Treename 2.0 Blueprint.
 * Every event carries familyId / userId where known, plus free-form props
 * (role, language, channel, relation...).
 */
export type EventName =
  | "onboarding_started"
  | "crest_generated"
  | "onboarding_step_completed"
  | "first_person_created"
  | "first_parent_added"
  | "tree_created"
  | "signup"
  | "question_sent"
  | "question_opened"
  | "answer_recorded"
  | "fact_suggested"
  | "fact_confirmed"
  | "story_created"
  | "AI_story_generated"
  | "photo_uploaded"
  | "family_member_added"
  | "invite_sent"
  | "invite_accepted"
  | "family_page_created"
  | "share_clicked"
  | "book_preview_opened"
  | "paywall_viewed"
  | "checkout_started"
  | "subscription_started"
  | "gift_purchased"
  | "gift_redeemed"
  | "subscription_cancelled";

export async function track(
  name: EventName,
  opts: { familyId?: string | null; userId?: string | null; props?: Record<string, unknown> } = {}
): Promise<void> {
  try {
    await db.analyticsEvent.create({
      data: {
        name,
        familyId: opts.familyId ?? null,
        userId: opts.userId ?? null,
        props: JSON.stringify(opts.props ?? {}),
      },
    });
  } catch (e) {
    // Analytics must never break the product.
    console.error("[analytics]", name, e);
  }
}

/**
 * North Star: Contributing Families (28 days) — families where at least two
 * different people added a memory (story, answer, captioned photo) in the last 28 days.
 */
export async function contributingFamilies28d(): Promise<number> {
  const since = new Date(Date.now() - 28 * 24 * 3600 * 1000);
  const rows = await db.analyticsEvent.findMany({
    where: {
      createdAt: { gte: since },
      name: { in: ["story_created", "answer_recorded", "photo_uploaded"] },
      familyId: { not: null },
    },
    select: { familyId: true, userId: true, props: true },
  });
  const byFamily = new Map<string, Set<string>>();
  for (const r of rows) {
    // Storytellers answer without an account; their person id is stored in props.
    let who = r.userId;
    if (!who) {
      try { who = "p:" + (JSON.parse(r.props).storytellerId ?? ""); } catch { who = null; }
    }
    if (!who || !r.familyId) continue;
    if (!byFamily.has(r.familyId)) byFamily.set(r.familyId, new Set());
    byFamily.get(r.familyId)!.add(who);
  }
  return [...byFamily.values()].filter((s) => s.size >= 2).length;
}
