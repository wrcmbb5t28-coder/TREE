import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import { fmtDuration } from "@/lib/util";
import { confirmFact, rejectFact, updateStory, deleteStory, askFollowUp, uploadPhoto } from "../../actions";

const CONF: Record<string, string> = { confirmed: "stated clearly", likely: "approximate", guess: "only implied" };

export default async function StoryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { id } = await params;
  const { edit } = await searchParams;
  const { user, family, role } = await requireFamily();
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

  return (
    <article className="stack" style={{ maxWidth: 820, gap: 24 }}>
      <div className="stack" style={{ gap: 8 }}>
        <Link className="small muted" href="/app/stories">← Stories</Link>
        <p className="eyebrow">{s.chapter ?? "Story"}{s.sensitive ? " · sensitive, private by default" : ""}</p>
        <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>{s.title}</h1>
        <p className="small muted">
          {q ? <>Told by <b>{q.storyteller.firstName}</b>, asked by {q.askedBy?.name ?? "the family"}: “{q.text}”</> : <>Written by {s.author?.name ?? s.author?.email ?? "a family member"}</>}
          {" · "}{s.createdAt.toLocaleDateString("en-GB")}
        </p>
      </div>

      {s.answer?.audioPath && (
        <div className="player" style={{ display: "block" }}>
          <audio controls preload="none" src={`/api/files/${s.answer.audioPath}`} />
          <p className="small muted" style={{ marginTop: 6 }}>Original recording {fmtDuration(s.answer.durationS)}</p>
        </div>
      )}

      {edit && editable ? (
        <form action={updateStory.bind(null, s.id)} className="card stack">
          <div className="field"><label htmlFor="title">Title</label><input id="title" name="title" defaultValue={s.title} /></div>
          <div className="field"><label htmlFor="body">Story</label><textarea id="body" name="body" defaultValue={s.body} style={{ minHeight: 280 }} /></div>
          <div className="grid2">
            <div className="field"><label htmlFor="chapter">Chapter</label><input id="chapter" name="chapter" defaultValue={s.chapter ?? ""} /></div>
            <div className="field">
              <label htmlFor="visibility">Who can see it</label>
              <select id="visibility" name="visibility" defaultValue={s.visibility}>
                <option value="family">Everyone in the family space</option>
                <option value="private">Only owners and the author</option>
                <option value="public">Also on the family page (if enabled)</option>
              </select>
            </div>
          </div>
          <div className="row"><button className="btn btn-primary">Save</button><Link className="btn btn-ghost" href={`/app/stories/${s.id}`}>Cancel</Link></div>
        </form>
      ) : (
        <div className="card-elev"><p className="story-body">{s.body}</p></div>
      )}

      {s.answer && (
        <details className="card">
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>Their exact words (transcript{s.answer.originalLang ? `, ${s.answer.originalLang}` : ""})</summary>
          <p className="transcript" style={{ marginTop: 12 }}>{s.answer.transcript}</p>
        </details>
      )}

      {s.facts.length > 0 && (
        <section className="card stack">
          <h2 style={{ fontSize: "1.3rem" }}>Facts found in this story</h2>
          <p className="small muted">Nothing is added to your tree until you confirm it.</p>
          <div className="table-wrap">
            <table className="simple">
              <thead><tr><th>Fact</th><th>Type</th><th>How sure</th><th></th></tr></thead>
              <tbody>
                {s.facts.map((f) => (
                  <tr key={f.id}>
                    <td>{f.label}</td>
                    <td>{f.kind}</td>
                    <td>{CONF[f.confidence] ?? f.confidence}</td>
                    <td>
                      {f.status === "suggested" && editable ? (
                        <div className="row">
                          <form action={confirmFact.bind(null, f.id)}><button className="btn btn-primary btn-sm">Add</button></form>
                          <form action={rejectFact.bind(null, f.id)}><button className="btn btn-ghost btn-sm">Not right</button></form>
                        </div>
                      ) : (
                        <span className="small muted">{f.status}</span>
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
            <p className="eyebrow">Suggested follow-up for {q.storyteller.firstName}</p>
            <p className="q" style={{ margin: "6px 0 0" }}>“{s.followUp}”</p>
          </div>
          <form action={askFollowUp.bind(null, s.id)}><button className="btn btn-primary">Ask this next</button></form>
        </section>
      )}

      <section className="stack">
        <h2 style={{ fontSize: "1.3rem" }}>Photos</h2>
        {s.photos.length > 0 && (
          <div className="grid-cards">
            {s.photos.map((p) => (
              <figure key={p.id} className="card" style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/files/${p.path}`} alt={p.caption ?? "Family photo"} style={{ borderRadius: 10 }} />
                {p.caption && <figcaption className="small muted" style={{ marginTop: 6 }}>{p.caption}{p.year ? ` · ${p.year}` : ""}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        {editable && (
          <form action={uploadPhoto} className="card row" encType="multipart/form-data">
            <input type="hidden" name="storyId" value={s.id} />
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required />
            <input className="input" name="caption" placeholder="Who is in the photo?" style={{ flex: "1 1 200px" }} />
            <input className="input" name="year" placeholder="Year" inputMode="numeric" style={{ width: 100 }} />
            <button className="btn btn-ghost btn-sm">Add photo</button>
          </form>
        )}
      </section>

      {editable && !edit && (
        <div className="row">
          <Link className="btn btn-ghost btn-sm" href={`/app/stories/${s.id}?edit=1`}>Edit story</Link>
          <details>
            <summary className="btn btn-ghost btn-sm" style={{ listStyle: "none" }}>Delete…</summary>
            <form action={deleteStory.bind(null, s.id)} className="row" style={{ marginTop: 8 }}>
              <span className="small muted">The story and its facts are deleted for everyone. The recording stays in your export until you delete the family.</span>
              <button className="btn btn-danger btn-sm">Delete story</button>
            </form>
          </details>
        </div>
      )}
    </article>
  );
}
