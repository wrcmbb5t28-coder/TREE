import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getUser, setCurrentFamily } from "@/lib/auth";
import { track } from "@/lib/analytics";

export const metadata: Metadata = { title: "Join your family | Treename", robots: { index: false } };
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

  return (
    <main className="answer-page">
      <div className="answer-card card-elev stack">
        <p className="eyebrow">Treename</p>
        <h1 style={{ fontSize: "2.2rem" }}>You’re invited to {inv.family.name}</h1>
        <p className="muted">{people} people and {stories} stories so far. Add what only you remember.</p>
        {user ? (
          <form action={accept.bind(null, token)}><button className="btn btn-primary">Join the family</button></form>
        ) : (
          <Link className="btn btn-primary" href={`/login?invite=${token}`}>Join with your email</Link>
        )}
      </div>
    </main>
  );
}
