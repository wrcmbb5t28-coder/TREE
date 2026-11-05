"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import { isDemoFamily } from "@/lib/demo";
import { uiLang } from "@/i18n/app";
import { track } from "@/lib/analytics";
import { canResearch, researchesLeft, runResearch, RESEARCH_LIMITS } from "@/lib/research";

/** Starts an archive search for one ancestor; the work continues after the response (see runResearch). */
export async function startResearch(personId: string) {
  const ctx = await requireFamily();
  const back = `/app/family/${personId}#research`;
  if (isDemoFamily(ctx.family.id)) redirect("/app?readonly=1");
  if (!canEdit(ctx.role)) redirect(back);

  const p = await db.person.findFirst({ where: { id: personId, familyId: ctx.family.id } });
  if (!p || !canResearch(p)) redirect(back);

  // One search per person at a time.
  const running = await db.research.findFirst({
    where: { personId, status: "running", createdAt: { gt: new Date(Date.now() - RESEARCH_LIMITS.staleAfterMs) } },
  });
  if (running) redirect(back);

  const left = await researchesLeft(ctx.family, ctx.user);
  if (left !== null && left <= 0) redirect(`/app/family/${personId}?research=limit#research`);

  const job = await db.research.create({
    data: { familyId: ctx.family.id, personId, userId: ctx.user.id, lang: uiLang(ctx.user, ctx.family) },
  });
  track("research_started", { userId: ctx.user.id, familyId: ctx.family.id });
  after(() => runResearch(job.id));
  revalidatePath(`/app/family/${personId}`);
  redirect(back);
}
