import { cookies } from "next/headers";
import { db } from "./db";
import { token } from "./util";
import { isLang, type Lang } from "@/i18n/config";
import { sampleBook } from "./sampleBook";

/**
 * The sample family shown to visitors ("See a sample family"): the same made-up family as the
 * sample book of that language (the Ivanovs for Russian, the Joneses for English …).
 * Visitors are signed in as a read-only viewer, one demo user per interface language,
 * so nothing they click can change the sample.
 */
const SESSION_COOKIE = "tn_session";
const FAMILY_COOKIE = "tn_family";
const PREV_COOKIE = "tn_prev_session";
const VERSION = 2; // bump when the sample families change: a new family is built, the old one is left alone

export const demoFamilyId = (lang: Lang) => `demo-v${VERSION}-${lang}`;
export const isDemoFamily = (id: string | null | undefined) => !!id && id.startsWith("demo-");
const demoEmail = (lang: Lang) => `demo+${lang}@demo.treename.invalid`;
export const isDemoEmail = (email: string) => email.endsWith("@demo.treename.invalid");

const COUNTRY: Record<Lang, string> = { ru: "RU", en: "GB", de: "DE", fr: "FR", it: "IT", es: "ES" };

/** Builds the sample family of a language once (one transaction, so a half-made family never shows). */
export async function ensureDemoFamily(lang: Lang): Promise<string> {
  const id = demoFamilyId(lang);
  if (await db.family.findUnique({ where: { id }, select: { id: true } })) return id;
  const b = sampleBook(lang);
  const cc = COUNTRY[lang];
  const placeFor = (year: number) => [...b.stops].reverse().find((s) => s.year <= year) ?? b.stops[0];
  const split = (name: string) => { const [first, ...rest] = name.split(" "); return { firstName: first, lastName: rest.join(" ") || null }; };
  const yrs = (y: string) => { const [a, d] = y.split("–"); return { birthYear: +a, deathYear: d ? +d : null }; };

  type P = { id: string; firstName: string; lastName: string | null; birthYear: number; deathYear: number | null; gender: string; generation: number; isSelf: boolean };
  const people: P[] = [];
  const self = b.line.length - 1;
  b.line.forEach((g, i) => {
    people.push({ id: `${id}-h${i}`, ...split(g.h[0]), ...yrs(g.h[1]), gender: "m", generation: i - self, isSelf: i === self });
    people.push({ id: `${id}-w${i}`, ...split(g.w[0]), ...yrs(g.w[1]), gender: "f", generation: i - self, isSelf: false });
  });
  const surname = split(b.line[self].h[0]).lastName;
  b.children.forEach((c, i) => people.push({ id: `${id}-c${i}`, firstName: c[0], lastName: surname, ...yrs(c[1]), gender: i % 2 ? "m" : "f", generation: 1, isSelf: false }));
  const rels: { parentId: string; childId: string }[] = [];
  for (let i = 1; i < b.line.length; i++) for (const p of ["h", "w"]) rels.push({ parentId: `${id}-${p}${i - 1}`, childId: `${id}-h${i}` });
  b.children.forEach((_, i) => { for (const p of ["h", "w"]) rels.push({ parentId: `${id}-${p}${self}`, childId: `${id}-c${i}` }); });

  // each story belongs to the person of its generation (by the year of the story)
  const gOf = (year: number) => b.line.reduce((g, l, i) => (+l.h[1].slice(0, 4) + 16 <= year ? i : g), 0);
  try {
    await db.$transaction(async (tx) => {
      await tx.family.create({ data: { id, name: b.title, lang, plan: "legacy", pageSlug: `demo-${token(10)}` } });
      await tx.person.createMany({
        data: people.map((p) => {
          const at = placeFor(p.birthYear);
          return { ...p, familyId: id, isLiving: p.deathYear === null, birthPlace: at.name, birthCountry: cc };
        }),
      });
      await tx.relationship.createMany({ data: rels, skipDuplicates: true });
      // the map needs no geocoding: the stops' coordinates are known
      await tx.place.createMany({ data: b.stops.map((st) => ({ key: `${st.name.toLowerCase()}|${cc}`, lat: st.lat, lng: st.lon, country: cc })), skipDuplicates: true });
      await tx.lifeEvent.createMany({
        data: [
          ...people.map((p) => ({ familyId: id, personId: p.id, year: p.birthYear, place: placeFor(p.birthYear).name, country: cc, description: `${p.firstName} is born`, source: "user" })),
          ...b.stops.slice(1).map((s) => ({ familyId: id, personId: `${id}-h${gOf(s.year)}`, year: s.year, place: s.name, country: cc, description: s.label.charAt(0).toUpperCase() + s.label.slice(1), source: "user" })),
        ],
      });
      await tx.story.createMany({
        data: b.stories.map((s, i) => ({
          familyId: id, title: s.title, body: s.text, bodyLang: lang, chapter: s.chapter, cover: `scene:${s.scene}`,
          personId: `${id}-h${gOf(s.year)}`, visibility: "family",
          createdAt: new Date(Date.now() - (b.stories.length - i) * 5 * 864e5),
        })),
      });
    }, { timeout: 60_000, maxWait: 20_000 });
  } catch (e) {
    // Two first visitors at once: the other one created it.
    if (!(await db.family.findUnique({ where: { id }, select: { id: true } }))) throw e;
  }
  return id;
}

/** The read-only demo user for an interface language, a viewer of that language's family. */
async function demoUser(lang: Lang) {
  const familyId = await ensureDemoFamily(lang);
  const self = sampleBook(lang).line.at(-1)!.h[0].split(" ")[0];
  const user = await db.user.upsert({
    where: { email: demoEmail(lang) },
    update: { name: self },
    create: { email: demoEmail(lang), name: self, lang, uiLang: lang },
  });
  await db.membership.upsert({
    where: { userId_familyId: { userId: user.id, familyId } },
    update: { role: "viewer" },
    create: { userId: user.id, familyId, role: "viewer" },
  });
  return { user, familyId };
}

/** Signs the visitor into the sample family. A real session, if any, is kept aside and comes back on exit. */
export async function enterDemo(lang: Lang): Promise<void> {
  const { user, familyId } = await demoUser(lang);
  const jar = await cookies();
  const current = jar.get(SESSION_COOKIE)?.value;
  if (current) {
    const s = await db.session.findUnique({ where: { id: current }, include: { user: true } });
    if (s && isDemoEmail(s.user.email)) {
      await db.session.update({ where: { id: current }, data: { userId: user.id } });
      jar.set(FAMILY_COOKIE, familyId, { httpOnly: true, sameSite: "lax", path: "/" });
      return;
    }
    if (s) jar.set(PREV_COOKIE, current, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 * 24 * 7 });
  }
  const id = token(32);
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000);
  await db.session.create({ data: { id, userId: user.id, expiresAt } });
  jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expiresAt });
  jar.set(FAMILY_COOKIE, familyId, { httpOnly: true, sameSite: "lax", path: "/" });
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

/** Interface language switch inside the sample: that language's own family and demo user. */
export async function switchDemoLang(lang: string): Promise<void> {
  if (!isLang(lang)) return;
  const { user, familyId } = await demoUser(lang);
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) await db.session.update({ where: { id }, data: { userId: user.id } });
  jar.set(FAMILY_COOKIE, familyId, { httpOnly: true, sameSite: "lax", path: "/" });
}
