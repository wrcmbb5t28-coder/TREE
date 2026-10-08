import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clean, familySlug, token } from "@/lib/util";
import { isLang } from "@/i18n/config";
import { track } from "@/lib/analytics";
import { sendLoginLink } from "@/lib/login";

type Body = {
  name?: string; born?: string;
  mother?: string; father?: string; gm1?: string; gf1?: string; gm2?: string; gf2?: string;
  countries?: string[];
  teller?: string; tellerName?: string;
  question?: string; channel?: string;
  email?: string; lang?: string; plan?: string; gift?: string;
};

/**
 * Creates the family from the onboarding answers (before sign-up) and emails a
 * sign-in link. The family is attached to the person when they open the link.
 */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Body;
  const email = clean(b.email, 200).toLowerCase();
  const name = clean(b.name, 60);
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const lang = isLang(b.lang) ? b.lang : "en";
  const channel = ["whatsapp", "link", "together"].includes(b.channel ?? "") ? b.channel! : "whatsapp";

  const result = await db.$transaction(async (tx) => {
    const family = await tx.family.create({ data: { name: `${name}'s family`, lang, pageSlug: familySlug(name) } });
    const mk = (firstName: string, generation: number, extra: { isSelf?: boolean; birthPlace?: string } = {}) =>
      tx.person.create({ data: { familyId: family.id, firstName, generation, isLiving: true, ...extra } });

    const self = await mk(name, 0, { isSelf: true, birthPlace: clean(b.born, 80) || undefined });
    const ids: Record<string, string> = {};
    for (const [k, gen] of [["mother", -1], ["father", -1], ["gm1", -2], ["gf1", -2], ["gm2", -2], ["gf2", -2]] as const) {
      const n = clean(b[k], 60);
      if (n) ids[k] = (await mk(n, gen)).id;
    }
    const link = (parent?: string, child?: string) =>
      parent && child ? tx.relationship.create({ data: { parentId: parent, childId: child } }) : null;
    await link(ids.mother, self.id);
    await link(ids.father, self.id);
    await link(ids.gm1, ids.mother);
    await link(ids.gf1, ids.mother);
    await link(ids.gm2, ids.father);
    await link(ids.gf2, ids.father);

    if (b.born) {
      await tx.lifeEvent.create({ data: { familyId: family.id, personId: self.id, place: clean(b.born, 80), description: `${name} is born`, source: "user" } });
    }
    for (const c of (b.countries ?? []).slice(0, 20)) {
      await tx.lifeEvent.create({ data: { familyId: family.id, country: clean(c, 2).toUpperCase(), description: "The family lived here", source: "user" } });
    }

    // The first storyteller and question
    let tellerId = b.teller && ids[b.teller];
    if (!tellerId) {
      const tn = clean(b.tellerName, 60);
      if (tn) tellerId = (await mk(tn, -2)).id;
    }
    let questionToken: string | null = null;
    if (tellerId && b.question) {
      questionToken = token(12);
      await tx.question.create({
        data: { familyId: family.id, storytellerId: tellerId, text: clean(b.question, 300), lang, token: questionToken, channel },
      });
    }
    return { family, peopleCount: 1 + Object.keys(ids).length, hasParent: !!(ids.mother || ids.father), questionToken };
  });

  await track("first_person_created", { familyId: result.family.id, props: { lang } });
  if (result.hasParent) await track("first_parent_added", { familyId: result.family.id });
  await track("tree_created", { familyId: result.family.id, props: { people: result.peopleCount, countries: b.countries?.length ?? 0 } });
  if (result.questionToken) await track("question_sent", { familyId: result.family.id, props: { channel, lang, from: "onboarding" } });

  // Legacy Gift received from someone else
  const giftCode = clean(b.gift, 40);
  if (giftCode) {
    const g = await db.giftCode.findUnique({ where: { code: giftCode } });
    if (g && !g.redeemedAt) {
      await db.giftCode.update({ where: { code: giftCode }, data: { redeemedAt: new Date(), redeemedFamilyId: result.family.id } });
      await db.family.update({ where: { id: result.family.id }, data: { plan: "legacy", planExpiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000) } });
      await track("gift_redeemed", { familyId: result.family.id });
    }
  }

  const plan = ["family", "legacy", "founding"].includes(b.plan ?? "") ? b.plan : undefined;
  const { devLink } = await sendLoginLink({
    email,
    draftFamilyId: result.family.id,
    next: plan ? `/app/billing?plan=${plan}` : "/app?welcome=1",
  });
  return NextResponse.json({ ok: true, devLink });
}
