import Link from "next/link";
import { db } from "@/lib/db";
import { fmtDate, type Lang } from "@/i18n/app";
import { researchT } from "@/i18n/app/research";
import { canResearch, researchesLeft, readReport, RESEARCH_LIMITS, type FindingStatus } from "@/lib/research";
import { isPaid } from "@/lib/plans";
import { startResearch } from "@/app/app/research-actions";
import AutoRefresh from "./AutoRefresh";

const STATUS_COLOR: Record<FindingStatus, string> = {
  documented: "#3E7D4F",
  corroborated: "#2F6B3F",
  possible: "#9A6B16",
  lead: "#6B6257",
  contradicted: "#A2412F",
};

/** "Archive search" block on a person's page (skills/treename-roots). */
export default async function ResearchSection({
  person,
  family,
  user,
  lang,
  editable,
  selectedId,
  limitHit,
}: {
  person: { id: string; firstName: string; lastName: string | null; isLiving: boolean; birthYear: number | null };
  family: { id: string; plan: string; planExpiresAt: Date | null };
  user: { email?: string | null };
  lang: Lang;
  editable: boolean;
  selectedId?: string;
  limitHit?: boolean;
}) {
  const t = researchT[lang];
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ");

  if (!canResearch(person)) {
    return (
      <section id="research" className="stack">
        <h2 className="section-title">{t.title}</h2>
        <p className="muted small">{t.notEligible}</p>
      </section>
    );
  }

  const all = await db.research.findMany({ where: { personId: person.id, familyId: family.id }, orderBy: { createdAt: "desc" }, take: 12 });
  const stale = (r: (typeof all)[number]) => r.status === "running" && Date.now() - r.createdAt.getTime() > RESEARCH_LIMITS.staleAfterMs;
  const running = all.find((r) => r.status === "running" && !stale(r));
  const done = all.filter((r) => r.status === "done");
  const shown = done.find((r) => r.id === selectedId) ?? done[0];
  const lastFailed = all[0] && (all[0].status === "failed" || stale(all[0]));
  const report = readReport(shown?.result ?? null);
  const left = editable ? await researchesLeft(family, user) : 0;
  const canStart = editable && !running && (left === null || left > 0);

  return (
    <section id="research" className="stack">
      <h2 className="section-title">{t.title}</h2>
      {!report && !running && <p className="muted">{t.intro(name)}</p>}

      {running && (
        <p className="notice small" role="status">
          {t.running}
          <AutoRefresh />
        </p>
      )}
      {lastFailed && !running && <p className="notice small">{t.failed}</p>}
      {limitHit && left !== null && left <= 0 && (
        <p className="notice small">
          {t.limit(RESEARCH_LIMITS.paidPerMonth)} <Link href="/app/billing">{t.plans}</Link>
        </p>
      )}

      {report && shown && (
        <article className="card stack" style={{ gap: 18 }}>
          <p className="eyebrow">{t.searchedOn(fmtDate(shown.createdAt, lang), shown.searches)}</p>
          {report.summary && <p className="lead" style={{ margin: 0 }}>{report.summary}</p>}

          {report.findings.length > 0 && (
            <div className="stack" style={{ gap: 12 }}>
              <h3>{t.found}</h3>
              {report.findings.map((f, i) => (
                <div key={i} className="stack" style={{ gap: 4, paddingLeft: 12, borderLeft: `3px solid ${STATUS_COLOR[f.status]}` }}>
                  <span className="small" style={{ color: STATUS_COLOR[f.status], fontWeight: 600 }}>{t.status[f.status]}</span>
                  <strong>{f.title}</strong>
                  {f.detail && <span>{f.detail}</span>}
                  {(f.source || f.url) && (
                    <span className="small muted">
                      {f.source}
                      {f.url && <> · <a href={f.url} target="_blank" rel="noreferrer nofollow">{t.open}</a></>}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {report.nextSteps.length > 0 && (
            <div className="stack" style={{ gap: 8 }}>
              <h3>{t.next}</h3>
              <ol className="stack" style={{ gap: 8, paddingLeft: 20, margin: 0 }}>
                {report.nextSteps.map((s, i) => (
                  <li key={i}>
                    <strong>{s.url ? <a href={s.url} target="_blank" rel="noreferrer nofollow">{s.title}</a> : s.title}</strong>
                    {s.detail && <> — {s.detail}</>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {report.letter && (
            <details>
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>{t.letter(report.letter.to)}</summary>
              <p className="small muted" style={{ marginTop: 8 }}>{t.letterHint}</p>
              <textarea readOnly rows={12} defaultValue={report.letter.text} style={{ width: "100%", font: "inherit", padding: 12, borderRadius: 10, border: "1px solid var(--line)" }} />
            </details>
          )}

          {report.notFound.length > 0 && (
            <details>
              <summary style={{ cursor: "pointer" }} className="small">{t.notFound} · {report.notFound.length}</summary>
              <ul className="small muted" style={{ marginTop: 8 }}>
                {report.notFound.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </details>
          )}

          {report.caveats && (
            <p className="small"><strong>{t.goodToKnow}:</strong> {report.caveats}</p>
          )}
          <p className="small muted" style={{ margin: 0 }}>{t.disclaimer}</p>
        </article>
      )}

      {editable ? (
        <div className="row" style={{ alignItems: "center" }}>
          {canStart && (
            <form action={startResearch.bind(null, person.id)}>
              <button className={report ? "btn btn-ghost" : "btn btn-primary"}>{report ? t.again : t.start(person.firstName)}</button>
            </form>
          )}
          {left !== null && !running && (
            <span className="small muted">
              {t.left(left)}
              {!isPaid(family) && <> · {t.freeNote(RESEARCH_LIMITS.freeTotal, RESEARCH_LIMITS.paidPerMonth)}</>}
              {left <= 0 && <> <Link href="/app/billing">{t.plans}</Link></>}
            </span>
          )}
        </div>
      ) : (
        !report && <p className="small muted">{t.editorsOnly}</p>
      )}

      {done.length > 1 && (
        <div className="row small">
          <span className="muted">{t.earlier}:</span>
          {done.map((r) => (
            <Link key={r.id} className="chip" href={`/app/family/${person.id}?research=${r.id}#research`} aria-current={r.id === shown?.id ? "true" : undefined}>
              {fmtDate(r.createdAt, lang)}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
