import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getRealUser as getUser, setCurrentFamily } from "@/lib/auth";
import { track } from "@/lib/analytics";
import { authT } from "@/i18n/app/auth";
import { isLang } from "@/i18n/config";

export const metadata: Metadata = { title: "Treename", robots: { index: false } };
export const dynamic = "force-dynamic";

async function accept(token: string) {
  "use server";
  const user = await getUser();
  const inv = await db.invite.findUnique({ where: { token } });
  if (!user || !inv) redirect("/login");
  await db.membership.upsert({
    where: { userId_familyId: { userId: user.id, familyId: inv.familyId } },
    create: { userId: user.id, familyId: inv.familyId, role: inv.role },
    update: {},
  });
  if (!inv.acceptedAt) {
    await db.invite.update({ where: { token }, data: { acceptedAt: new Date() } });
    await track("invite_accepted", { userId: user.id, familyId: inv.familyId, props: { relation: inv.relation } });
  }
  await setCurrentFamily(inv.familyId);
  redirect("/app");
}

export default async function Join({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const inv = await db.invite.findUnique({ where: { token }, include: { family: true } });
  if (!inv) notFound();
  const user = await getUser();
  const people = await db.person.count({ where: { familyId: inv.familyId } });
  const stories = await db.story.count({ where: { familyId: inv.familyId } });
  const t = authT[isLang(inv.family.lang) ? inv.family.lang : "en"].join;

  return (
    <main className="answer-page">
      <div className="answer-card card-elev stack">
        <p className="eyebrow">Treename</p>
        <h1 style={{ fontSize: "2.2rem" }}>{t.invited(inv.family.name)}</h1>
        <p className="muted">{t.stats(people, stories)}</p>
        {user ? (
          <form action={accept.bind(null, token)}><button className="btn btn-primary">{t.accept}</button></form>
        ) : (
          <Link className="btn btn-primary" href={`/login?invite=${token}`}>{t.withEmail}</Link>
        )}
      </div>
    </main>
  );
}
