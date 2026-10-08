import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getDict, fill } from "@/i18n";
import { track } from "@/lib/analytics";
import Recorder from "@/components/Recorder";

export const metadata: Metadata = { title: "Treename", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * The storyteller's page. Opened from WhatsApp or a link. No account, no password:
 * the unguessable token is the permission. Big text, one big button.
 */
export default async function AnswerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const q = await db.question.findUnique({
    where: { token },
    include: { storyteller: true, askedBy: true, family: { include: { people: { where: { isSelf: true }, take: 1 } } } },
  });
  if (!q) notFound();
  const t = getDict(q.lang).answer;
  const askerName = q.askedBy?.name || q.family.people[0]?.firstName || "Your family";

  if (q.status === "sent") {
    await db.question.update({ where: { id: q.id }, data: { status: "opened" } });
    await track("question_opened", { familyId: q.familyId, props: { channel: q.channel, lang: q.lang } });
  }

  return (
    <main className="answer-page" lang={q.lang}>
      <div className="answer-card">
        <p className="eyebrow">Treename</p>
        <p className="muted big-text">{fill(t.from, { name: askerName })}</p>
        <h1 className="answer-q">{q.text}</h1>
        {q.status === "answered" ? (
          <div className="notice big-text">{t.answered}</div>
        ) : (
          <Recorder token={q.token} t={t} askerName={askerName} />
        )}
        <p className="small muted">🔒 {t.note}</p>
      </div>
    </main>
  );
}
