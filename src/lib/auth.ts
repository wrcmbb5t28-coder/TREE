import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { token } from "./util";

const SESSION_COOKIE = "tn_session";
const FAMILY_COOKIE = "tn_family";
const SESSION_DAYS = 90;

export async function createSession(userId: string): Promise<void> {
  const id = token(32);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  await db.session.create({ data: { id, userId, expiresAt } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) await db.session.deleteMany({ where: { id } });
  jar.delete(SESSION_COOKIE);
  jar.delete(FAMILY_COOKIE);
}

export async function getUser() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const s = await db.session.findUnique({ where: { id }, include: { user: true } });
  if (!s || s.expiresAt < new Date()) return null;
  return s.user;
}

/** Like getUser(), but a visitor looking at the sample family counts as signed out (for sign-in and invite pages). */
export async function getRealUser() {
  const u = await getUser();
  return u && !u.email.endsWith("@demo.treename.invalid") ? u : null;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function setCurrentFamily(familyId: string): Promise<void> {
  const jar = await cookies();
  jar.set(FAMILY_COOKIE, familyId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 * 24 * 365 });
}

/** The signed-in user, their current family and their role in it. */
export async function requireFamily() {
  const user = await requireUser();
  const jar = await cookies();
  const wanted = jar.get(FAMILY_COOKIE)?.value;
  const memberships = await db.membership.findMany({
    where: { userId: user.id },
    include: { family: true },
    orderBy: { createdAt: "asc" },
  });
  if (memberships.length === 0) redirect("/en/start");
  const m = memberships.find((x) => x.familyId === wanted) ?? memberships[0];
  return { user, family: m.family, role: m.role, memberships };
}

export function canEdit(role: string): boolean {
  return role === "owner" || role === "editor";
}

/** Membership check used by API routes. */
export async function memberOf(familyId: string) {
  const user = await getUser();
  if (!user) return null;
  const m = await db.membership.findUnique({ where: { userId_familyId: { userId: user.id, familyId } } });
  return m ? { user, role: m.role } : null;
}
