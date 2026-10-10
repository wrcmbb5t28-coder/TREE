import { cookies } from "next/headers";
import { db } from "./db";
import { token } from "./util";
import { isLang, type Lang } from "@/i18n/config";
import data from "./demo/mueller.json";

/**
 * The sample family shown to visitors ("Посмотреть пример"): the Müllers, 15 generations,
 * Bern → Palatinate → Volga → Odessa → Siberia → Karaganda → Cologne → Zug, 131 people.
 * Visitors are signed in as a read-only viewer (one demo user per interface language),
 * so nothing they click can change the sample.
 */
export const DEMO_FAMILY_ID = "demo-mueller";
const SESSION_COOKIE = "tn_session";
const FAMILY_COOKIE = "tn_family";
const PREV_COOKIE = "tn_prev_session";

export const isDemoFamily = (id: string | null | undefined) => id === DEMO_FAMILY_ID;
const demoEmail = (lang: Lang) => `demo+${lang}@demo.treename.invalid`;
export const isDemoEmail = (email: string) => email.endsWith("@demo.treename.invalid");

type J = Record<string, unknown>;
const D = data as unknown as {
  family: { name: string; lang: string };
  people: J[]; rels: [string, string][]; events: J[]; stories: (J & { daysAgo: number })[];
  crests: { key: string; config: string }[]; places: J[];
};

/** Creates the sample family once (all inserts in one transaction, so a half-made family never shows). */
export async function ensureDemoFamily(): Promise<void> {
  if (await db.family.findUnique({ where: { id: DEMO_FAMILY_ID }, select: { id: true } })) return;
  try {
    await db.$transaction(async (tx) => {
      await tx.family.create({ data: { id: DEMO_FAMILY_ID, name: D.family.name, lang: D.family.lang, plan: "legacy", pageSlug: `demo-${token(10)}` } });
      await tx.person.createMany({ data: D.people.map((p) => ({ ...p, familyId: DEMO_FAMILY_ID })) as never });
      await tx.relationship.createMany({ data: D.rels.map(([parentId, childId]) => ({ parentId, childId })), skipDuplicates: true });
      await tx.lifeEvent.createMany({ data: D.events.map((e) => ({ ...e, familyId: DEMO_FAMILY_ID })) as never });
      await tx.story.createMany({
        data: D.stories.map(({ daysAgo, ...s }) => ({ ...s, familyId: DEMO_FAMILY_ID, createdAt: new Date(Date.now() - daysAgo * 864e5) })) as never,
      });
      if (D.crests.length) await tx.crest.createMany({ data: D.crests.map((c) => ({ ...c, familyId: DEMO_FAMILY_ID })) });
      await tx.place.createMany({ data: D.places.map(({ id: _id, ...p }) => p) as never, skipDuplicates: true });
    }, { timeout: 60_000, maxWait: 20_000 });
  } catch (e) {
    // Two first visitors at once: the other one created it.
    if (!(await db.family.findUnique({ where: { id: DEMO_FAMILY_ID }, select: { id: true } }))) throw e;
  }
}

/** The read-only demo user for an interface language. */
async function demoUser(lang: Lang) {
  const user = await db.user.upsert({
    where: { email: demoEmail(lang) },
    update: {},
    create: { email: demoEmail(lang), name: lang === "ru" ? "Михаэль" : "Michael", lang, uiLang: lang },
  });
  await db.membership.upsert({
    where: { userId_familyId: { userId: user.id, familyId: DEMO_FAMILY_ID } },
    update: { role: "viewer" },
    create: { userId: user.id, familyId: DEMO_FAMILY_ID, role: "viewer" },
  });
  return user;
}

/** Signs the visitor into the sample family. A real session, if any, is kept aside and comes back on exit. */
export async function enterDemo(lang: Lang): Promise<void> {
  await ensureDemoFamily();
  const user = await demoUser(lang);
  const jar = await cookies();
  const current = jar.get(SESSION_COOKIE)?.value;
  if (current) {
    const s = await db.session.findUnique({ where: { id: current }, include: { user: true } });
    if (s && isDemoEmail(s.user.email)) {
      await db.session.update({ where: { id: current }, data: { userId: user.id } });
      jar.set(FAMILY_COOKIE, DEMO_FAMILY_ID, { httpOnly: true, sameSite: "lax", path: "/" });
      return;
    }
    if (s) jar.set(PREV_COOKIE, current, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 * 24 * 7 });
  }
  const id = token(32);
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000);
  await db.session.create({ data: { id, userId: user.id, expiresAt } });
  jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expiresAt });
  jar.set(FAMILY_COOKIE, DEMO_FAMILY_ID, { httpOnly: true, sameSite: "lax", path: "/" });
  // Old demo sessions are useless after a day; tidy them now and then.
  if (Math.random() < 0.05) await db.session.deleteMany({ where: { expiresAt: { lt: new Date() }, user: { email: { endsWith: "@demo.treename.invalid" } } } });
}

/** Leaves the sample: back to the visitor's own account if they had one. Returns true if they did. */
export async function exitDemo(): Promise<boolean> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) await db.session.deleteMany({ where: { id, user: { email: { endsWith: "@demo.treename.invalid" } } } });
  jar.delete(FAMILY_COOKIE);
  const prev = jar.get(PREV_COOKIE)?.value;
  jar.delete(PREV_COOKIE);
  const s = prev ? await db.session.findUnique({ where: { id: prev } }) : null;
  if (s && s.expiresAt > new Date()) {
    jar.set(SESSION_COOKIE, s.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: s.expiresAt });
    return true;
  }
  jar.delete(SESSION_COOKIE);
  return false;
}

/** Interface language switch inside the sample: move this visitor to the demo user of that language. */
export async function switchDemoLang(lang: string): Promise<void> {
  if (!isLang(lang)) return;
  const user = await demoUser(lang);
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (id) await db.session.update({ where: { id }, data: { userId: user.id } });
}
