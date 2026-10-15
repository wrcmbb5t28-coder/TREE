import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, setCurrentFamily } from "@/lib/auth";
import { track } from "@/lib/analytics";

/** Links already sent by email point here: show the confirm page, do not spend the link (mail scanners open links too). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  return NextResponse.redirect(new URL(`/login/open${url.search}`, req.url), 303);
}

/** A used link still works for a short while, e.g. when it was first opened in the mail app's own browser. */
const GRACE_MS = 15 * 60 * 1000;

/** Spends the sign-in link: creates the account if needed, attaches the draft family or invite. */
export async function POST(req: Request) {
  const form = await req.formData();
  const t = String(form.get("token") ?? "");
  const next = String(form.get("next") ?? "/app");
  const lt = t ? await db.loginToken.findUnique({ where: { token: t } }) : null;
  const now = new Date();
  if (!lt || lt.expiresAt < now || (lt.usedAt && now.getTime() - lt.usedAt.getTime() > GRACE_MS)) {
    return NextResponse.redirect(new URL("/login?error=expired", req.url), 303);
  }
  if (!lt.usedAt) await db.loginToken.update({ where: { token: t }, data: { usedAt: now } });

  let user = await db.user.findUnique({ where: { email: lt.email } });
  if (!user) {
    user = await db.user.create({ data: { email: lt.email } });
    await track("signup", { userId: user.id, familyId: lt.draftFamilyId });
  }

  let familyId: string | null = null;

  // Family created during onboarding: the first person to open the link becomes the owner.
  if (lt.draftFamilyId) {
    const owners = await db.membership.count({ where: { familyId: lt.draftFamilyId } });
    if (owners === 0) {
      await db.membership.create({ data: { userId: user.id, familyId: lt.draftFamilyId, role: "owner" } });
      const self = await db.person.findFirst({ where: { familyId: lt.draftFamilyId, isSelf: true } });
      if (self && !user.name) await db.user.update({ where: { id: user.id }, data: { name: self.firstName } });
    }
    familyId = lt.draftFamilyId;
  }

  // Invite to an existing family
  if (lt.inviteToken) {
    const inv = await db.invite.findUnique({ where: { token: lt.inviteToken } });
    if (inv) {
      await db.membership.upsert({
        where: { userId_familyId: { userId: user.id, familyId: inv.familyId } },
        create: { userId: user.id, familyId: inv.familyId, role: inv.role },
        update: {},
      });
      if (!inv.acceptedAt) {
        await db.invite.update({ where: { token: inv.token }, data: { acceptedAt: new Date() } });
        await track("invite_accepted", { userId: user.id, familyId: inv.familyId, props: { relation: inv.relation } });
      }
      familyId = inv.familyId;
    }
  }

  await createSession(user.id);
  if (familyId) await setCurrentFamily(familyId);
  const safeNext = next.startsWith("/app") ? next : "/app";
  return NextResponse.redirect(new URL(safeNext, req.url), 303);
}
