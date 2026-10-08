import Link from "next/link";
import { db } from "@/lib/db";
import { requireFamily } from "@/lib/auth";
import { appUrl, fmtDuration } from "@/lib/util";
import { getDict, fill } from "@/i18n";
import { FREE_LIMITS, isPaid } from "@/lib/plans";
import ShareQuestion from "@/components/ShareQuestion";
import { deleteQuestion } from "./actions";

export default async function Home({ searchParams }: { searchParams: Promise<{ asked?: string; welcome?: string; paid?: string }> }) {
  const sp = await searchParams;
  const { user, family, role } = await requireFamily();

  const [people, stories, waiting, suggested, countries, answered] = await Promise.all([
    db.person.count({ where: { familyId: family.id } }),
    db.story.findMany({
      where: role === "owner" ? { familyId: family.id } : { familyId: family.id, OR: [{ visibility: { not: "private" } }, { authorId: user.id }] },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { answer: { include: { question: { include: { storyteller: true } } } }, facts: { where: { status: "suggested" } } },
    }),
    db.question.findMany({ where: { familyId: family.id, status: { not: "answered" } }, include: { storyteller: true }, orderBy: { createdAt: "desc" } }),
    db.fact.count({ where: { familyId: family.id, status: "suggested" } }),
    db.lifeEvent.findMany({ where: { familyId: family.id, country: { not: null } }, distinct: ["country"], select: { country: true } }),
    db.question.count({ where: { familyId: family.id, status: "answered" } }),
  ]);
  const self = await db.person.findFirst({ where: { familyId: family.id, isSelf: true } });
  const askerName = user.name || self?.firstName || "Your family";
  const generations = (await db.person.findMany({ where: { familyId: family.id }, distinct: ["generation"], select: { generation: true } })).length;
  const paid = isPaid(family);

  return (
    <>
      {sp.welcome && (
        <div className="notice">
          <b>Welcome to your family story.</b> Your first question is ready below. Send it now, and you will hear the answer here.
        </div>
      )}
      {sp.paid && <div className="notice"><b>Thank you!</b> Your plan is active.</div>}

      <div className="page-head">
        <div>
          <p className="eyebrow">{family.name}</p>
          <h1>Hello, {askerName}</h1>
        </div>
        <Link className="btn btn-primary" href="/app/ask">Ask someone a question</Link>
      </div>

      <div className="kpis">
        <div className="kpi"><b>{people}</b><span>people</span></div>
        <div className="kpi"><b>{generations}</b><span>generations</span></div>
        <div className="kpi"><b>{countries.length}</b><span>countries</span></div>
        <div className="kpi"><b>{answered}</b><span>answers recorded</span></div>
      </div>

      {!paid && answered >= FREE_LIMITS.answeredQuestions && (
        <div className="notice row between">
          <span>You have used the {FREE_LIMITS.answeredQuestions} free interview answers. New answers are always saved, but full access needs the Family plan.</span>
          <Link className="btn btn-primary btn-sm" href="/app/billing?reason=answers">See plans</Link>
        </div>
      )}

      {waiting.length > 0 && (
        <section className="stack">
          <h2 style={{ fontSize: "1.5rem" }}>Waiting for an answer</h2>
          {waiting.map((q) => {
            const t = getDict(q.lang);
            const url = appUrl(`/a/${q.token}`);
            const highlight = sp.asked === q.id;
            return (
              <div key={q.id} className="card stack" style={highlight ? { borderColor: "var(--accent)", borderWidth: 2 } : undefined}>
                <div className="row between">
                  <div>
                    <p className="small muted">To {q.storyteller.firstName} · {q.status === "opened" ? "opened, not answered yet" : "not opened yet"}</p>
                    <p className="q" style={{ margin: 0 }}>“{q.text}”</p>
                  </div>
                  <form action={deleteQuestion.bind(null, q.id)}><button className="linkbtn small">Remove</button></form>
                </div>
                <ShareQuestion url={url} message={fill(t.onboarding.preview.message, { name: askerName, q: q.text })} familyId={family.id} together={q.channel === "together"} />
              </div>
            );
          })}
        </section>
      )}

      {suggested > 0 && (
        <div className="notice row between">
          <span>Treename found <b>{suggested}</b> new facts in your stories. Confirm them to grow your tree.</span>
          <Link className="btn btn-ghost btn-sm" href="/app/stories">Review</Link>
        </div>
      )}

      <section className="stack">
        <div className="row between">
          <h2 style={{ fontSize: "1.5rem" }}>Latest stories</h2>
          <Link className="small" href="/app/stories">All stories</Link>
        </div>
        {stories.length === 0 ? (
          <div className="empty">
            <p>No stories yet. The first one usually arrives within a day of sending a question.</p>
            <p style={{ marginTop: 12 }}><Link className="btn btn-ghost btn-sm" href="/app/stories/new">Write a memory yourself</Link></p>
          </div>
        ) : (
          <div className="grid-cards">
            {stories.map((s) => (
              <Link key={s.id} href={`/app/stories/${s.id}`} className="card feed-item" style={{ textDecoration: "none" }}>
                <span className="small muted">
                  {s.answer ? `${s.answer.question.storyteller.firstName} · voice ${fmtDuration(s.answer.durationS)}` : "Written memory"}
                  {s.chapter ? ` · ${s.chapter}` : ""}
                </span>
                <h3>{s.title}</h3>
                <p className="muted small">{s.body.slice(0, 160)}{s.body.length > 160 ? "…" : ""}</p>
                {s.facts.length > 0 && <span className="tag" style={{ justifySelf: "start" }}>{s.facts.length} facts to confirm</span>}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card row between">
        <div>
          <h3>Your family story is better together</h3>
          <p className="muted small">Invite your parents, siblings and cousins. Everyone adds what only they remember.</p>
        </div>
        <Link className="btn btn-ghost" href="/app/invite">Invite family</Link>
      </section>
    </>
  );
}
