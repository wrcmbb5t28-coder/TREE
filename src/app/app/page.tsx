import Link from "next/link";
import { db } from "@/lib/db";
import { appContext, plural } from "@/i18n/app";
import { common, chapterName } from "@/i18n/app/common";
import { storiesT } from "@/i18n/app/stories";
import { appUrl, fmtDuration } from "@/lib/util";
import { getDict, fill } from "@/i18n";
import { FREE_LIMITS, isPaid } from "@/lib/plans";
import ShareQuestion from "@/components/ShareQuestion";
import { deleteQuestion } from "./actions";

export default async function Home({ searchParams }: { searchParams: Promise<{ asked?: string; welcome?: string; paid?: string }> }) {
  const sp = await searchParams;
  const { user, family, role, lang } = await appContext();
  const t = storiesT[lang].home;
  const ts = storiesT[lang];
  const c = common[lang];

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
  const askerName = user.name || self?.firstName || t.familyFallback;
  const generations = (await db.person.findMany({ where: { familyId: family.id }, distinct: ["generation"], select: { generation: true } })).length;
  const paid = isPaid(family);

  return (
    <>
      {sp.welcome && (
        <div className="notice">
          <b>{t.welcomeTitle}</b> {t.welcomeText}
        </div>
      )}
      {sp.paid && <div className="notice"><b>{t.paidTitle}</b> {t.paidText}</div>}

      <div className="page-head">
        <div>
          <p className="eyebrow">{family.name}</p>
          <h1>{t.hello(askerName)}</h1>
        </div>
        <Link className="btn btn-primary" href="/app/ask">{t.askCta}</Link>
      </div>

      <div className="kpis">
        <div className="kpi"><b>{people}</b><span>{plural(lang, people, t.kpiPeople)}</span></div>
        <div className="kpi"><b>{generations}</b><span>{plural(lang, generations, t.kpiGenerations)}</span></div>
        <div className="kpi"><b>{countries.length}</b><span>{plural(lang, countries.length, t.kpiCountries)}</span></div>
        <div className="kpi"><b>{answered}</b><span>{plural(lang, answered, t.kpiAnswers)}</span></div>
      </div>

      {!paid && answered >= FREE_LIMITS.answeredQuestions && (
        <div className="notice row between">
          <span>{t.freeLimit(FREE_LIMITS.answeredQuestions)}</span>
          <Link className="btn btn-primary btn-sm" href="/app/billing?reason=answers">{t.seePlans}</Link>
        </div>
      )}

      {waiting.length > 0 && (
        <section className="stack">
          <h2 style={{ fontSize: "1.5rem" }}>{t.waitingTitle}</h2>
          {waiting.map((q) => {
            const qd = getDict(q.lang);
            const url = appUrl(`/a/${q.token}`);
            const highlight = sp.asked === q.id;
            return (
              <div key={q.id} className="card stack" style={highlight ? { borderColor: "var(--accent)", borderWidth: 2 } : undefined}>
                <div className="row between">
                  <div>
                    <p className="small muted">{t.to(q.storyteller.firstName)} · {q.status === "opened" ? t.opened : t.notOpened}</p>
                    <p className="q" style={{ margin: 0 }}>{ts.quote(q.text)}</p>
                  </div>
                  <form action={deleteQuestion.bind(null, q.id)}><button className="linkbtn small">{c.btn.remove}</button></form>
                </div>
                <ShareQuestion url={url} message={fill(qd.onboarding.preview.message, { name: askerName, q: q.text })} familyId={family.id} together={q.channel === "together"} labels={ts.share} />
              </div>
            );
          })}
        </section>
      )}

      {suggested > 0 && (
        <div className="notice row between">
          <span>{t.factsPre} <b>{suggested}</b> {plural(lang, suggested, t.factsWord)} {t.factsPost}</span>
          <Link className="btn btn-ghost btn-sm" href="/app/stories">{t.review}</Link>
        </div>
      )}

      <section className="stack">
        <div className="row between">
          <h2 style={{ fontSize: "1.5rem" }}>{t.latestTitle}</h2>
          <Link className="small" href="/app/stories">{t.allStories}</Link>
        </div>
        {stories.length === 0 ? (
          <div className="empty">
            <p>{t.empty}</p>
            <p style={{ marginTop: 12 }}><Link className="btn btn-ghost btn-sm" href="/app/stories/new">{t.writeYourself}</Link></p>
          </div>
        ) : (
          <div className="grid-cards">
            {stories.map((s) => (
              <Link key={s.id} href={`/app/stories/${s.id}`} className="card feed-item" style={{ textDecoration: "none" }}>
                <span className="small muted">
                  {s.answer ? `${s.answer.question.storyteller.firstName} · ${t.voice(fmtDuration(s.answer.durationS))}` : ts.stories.written}
                  {s.chapter ? ` · ${chapterName(lang, s.chapter)}` : ""}
                </span>
                <h3>{s.title}</h3>
                <p className="muted small">{s.body.slice(0, 160)}{s.body.length > 160 ? "…" : ""}</p>
                {s.facts.length > 0 && <span className="tag" style={{ justifySelf: "start" }}>{plural(lang, s.facts.length, ts.stories.factsToConfirm)}</span>}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card row between">
        <div>
          <h3>{t.inviteTitle}</h3>
          <p className="muted small">{t.inviteText}</p>
        </div>
        <Link className="btn btn-ghost" href="/app/invite">{t.inviteBtn}</Link>
      </section>
    </>
  );
}
