import Link from "next/link";
import { StoryPhoto } from "@/components/StoryArt";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { canEdit } from "@/lib/auth";
import { appContext, fmtDate } from "@/i18n/app";
import { common, chapterName } from "@/i18n/app/common";
import { storiesT } from "@/i18n/app/stories";
import { fmtDuration } from "@/lib/util";
import { confirmFact, rejectFact, updateStory, deleteStory, askFollowUp, uploadPhoto } from "../../actions";

const CHAPTER_KEYS = ["Origins", "Childhood", "Love", "Work", "Leaving home", "Hard years", "Family life", "Traditions", "Advice", "The next generation"];

export default async function StoryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { id } = await params;
  const { edit } = await searchParams;
  const { user, family, role, lang } = await appContext();
  const ts = storiesT[lang];
  const t = ts.story;
  const c = common[lang];
  const CONF = c.confidence as Record<string, string>;
  const KINDS = c.factKinds as Record<string, string>;
  const STATUS = c.factStatus as Record<string, string>;
  const s = await db.story.findFirst({
    where: { id, familyId: family.id },
    include: {
      answer: { include: { question: { include: { storyteller: true, askedBy: true } } } },
      facts: { orderBy: { createdAt: "asc" } },
      photos: true,
      author: true,
    },
  });
  if (!s) notFound();
  if (s.visibility === "private" && s.authorId !== user.id && role !== "owner") notFound();
  const editable = canEdit(role);
  const q = s.answer?.question;
  const people = editable && edit ? await db.person.findMany({ where: { familyId: family.id }, orderBy: [{ generation: "asc" }, { firstName: "asc" }] }) : [];
  const about = s.personId ? await db.person.findFirst({ where: { id: s.personId, familyId: family.id } }) : null;

  return (
    <article className="stack" style={{ maxWidth: 820, gap: 24 }}>
      <div className="stack" style={{ gap: 8 }}>
        <Link className="small muted" href="/app/stories">{t.back}</Link>
        <p className="eyebrow">{chapterName(lang, s.chapter)}{s.sensitive ? ` · ${t.sensitive}` : ""}</p>
        <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>{s.title}</h1>
        <p className="small muted">
          {q ? <>{t.toldBy} <Link href={`/app/family/${q.storyteller.id}`}><b>{q.storyteller.firstName}</b></Link>, {t.askedBy(q.askedBy?.name ?? t.theFamily)}: {ts.quote(q.text)}</> : <>{t.writtenBy(s.author?.name ?? s.author?.email ?? t.aMember)}</>}
          {about && !q && <> · {t.about} <Link href={`/app/family/${about.id}`}>{about.firstName}</Link></>}
          {" · "}{fmtDate(s.createdAt, lang)}
        </p>
      </div>

      {s.photos.length === 0 && (
        <div className="story-hero-art"><StoryPhoto seed={s.id} text={`${s.title} ${s.body}`} tilt={-1.5} idSuffix="h" /></div>
      )}

      {s.answer?.audioPath && (
        <div className="player" style={{ display: "block" }}>
          <audio controls preload="none" src={`/api/files/${s.answer.audioPath}`} />
          <p className="small muted" style={{ marginTop: 6 }}>{t.recording(fmtDuration(s.answer.durationS))}</p>
        </div>
      )}

      {edit && editable ? (
        <form action={updateStory.bind(null, s.id)} className="card stack">
          <div className="field"><label htmlFor="title">{t.titleLabel}</label><input id="title" name="title" defaultValue={s.title} /></div>
          <div className="field"><label htmlFor="body">{t.body}</label><textarea id="body" name="body" defaultValue={s.body} style={{ minHeight: 280 }} /></div>
          <div className="grid2">
            <div className="field">
              <label htmlFor="chapter">{t.chapter}</label>
              <select id="chapter" name="chapter" defaultValue={s.chapter ?? ""}>
                <option value="">{chapterName(lang, "Unsorted")}</option>
                {[...CHAPTER_KEYS, ...(s.chapter && !CHAPTER_KEYS.includes(s.chapter) ? [s.chapter] : [])].map((k) => (
                  <option key={k} value={k}>{chapterName(lang, k)}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="personId">{t.whose}</label>
              <select id="personId" name="personId" defaultValue={s.personId ?? ""}>
                <option value="">{t.nobody}</option>
                {people.map((x) => <option key={x.id} value={x.id}>{[x.firstName, x.lastName].filter(Boolean).join(" ")}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="visibility">{t.visibility}</label>
              <select id="visibility" name="visibility" defaultValue={s.visibility}>
                <option value="family">{t.visFamily}</option>
                <option value="private">{t.visPrivate}</option>
                <option value="public">{t.visPublic}</option>
              </select>
            </div>
          </div>
          <div className="row"><button className="btn btn-primary">{c.btn.save}</button><Link className="btn btn-ghost" href={`/app/stories/${s.id}`}>{c.btn.cancel}</Link></div>
        </form>
      ) : (
        <div className="card-elev"><p className="story-body">{s.body}</p></div>
      )}

      {s.answer && (
        <details className="card">
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>{t.transcript(s.answer.originalLang)}</summary>
          <p className="transcript" style={{ marginTop: 12 }}>{s.answer.transcript}</p>
        </details>
      )}

      {s.facts.length > 0 && (
        <section className="card stack">
          <h2 style={{ fontSize: "1.3rem" }}>{t.factsTitle}</h2>
          <p className="small muted">{t.factsNote}</p>
          <div className="table-wrap">
            <table className="simple">
              <thead><tr><th>{t.thFact}</th><th>{t.thType}</th><th>{t.thSure}</th><th></th></tr></thead>
              <tbody>
                {s.facts.map((f) => (
                  <tr key={f.id}>
                    <td>{f.label}</td>
                    <td>{KINDS[f.kind] ?? f.kind}</td>
                    <td>{CONF[f.confidence] ?? f.confidence}</td>
                    <td>
                      {f.status === "suggested" && editable ? (
                        <div className="row">
                          <form action={confirmFact.bind(null, f.id)}><button className="btn btn-primary btn-sm">{t.add}</button></form>
                          <form action={rejectFact.bind(null, f.id)}><button className="btn btn-ghost btn-sm">{t.notRight}</button></form>
                        </div>
                      ) : (
                        <span className="small muted">{STATUS[f.status] ?? f.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {s.followUp && q && editable && (
        <section className="card row between">
          <div>
            <p className="eyebrow">{t.followUp(q.storyteller.firstName)}</p>
            <p className="q" style={{ margin: "6px 0 0" }}>{ts.quote(s.followUp)}</p>
          </div>
          <form action={askFollowUp.bind(null, s.id)}><button className="btn btn-primary">{t.askNext}</button></form>
        </section>
      )}

      <section className="stack">
        <h2 style={{ fontSize: "1.3rem" }}>{t.photos}</h2>
        {s.photos.length > 0 && (
          <div className="grid-cards">
            {s.photos.map((p) => (
              <figure key={p.id} className="card" style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/files/${p.path}`} alt={p.caption ?? t.photoAlt} loading="lazy" style={{ borderRadius: 10, height: "auto" }} width={1200} height={900} />
                {p.caption && <figcaption className="small muted" style={{ marginTop: 6 }}>{p.caption}{p.year ? ` · ${p.year}` : ""}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        {editable && (
          <form action={uploadPhoto} className="card row" encType="multipart/form-data">
            <input type="hidden" name="storyId" value={s.id} />
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required />
            <input className="input" name="caption" placeholder={t.captionPh} style={{ flex: "1 1 200px" }} />
            <input className="input" name="year" placeholder={t.yearPh} inputMode="numeric" style={{ width: 100 }} />
            <button className="btn btn-ghost btn-sm">{t.addPhoto}</button>
          </form>
        )}
      </section>

      {editable && !edit && (
        <div className="row">
          <Link className="btn btn-ghost btn-sm" href={`/app/stories/${s.id}?edit=1`}>{t.editStory}</Link>
          <details>
            <summary className="btn btn-ghost btn-sm" style={{ listStyle: "none" }}>{t.deleteDots}</summary>
            <form action={deleteStory.bind(null, s.id)} className="row" style={{ marginTop: 8 }}>
              <span className="small muted">{t.deleteWarn}</span>
              <button className="btn btn-danger btn-sm">{t.deleteStory}</button>
            </form>
          </details>
        </div>
      )}
    </article>
  );
}
