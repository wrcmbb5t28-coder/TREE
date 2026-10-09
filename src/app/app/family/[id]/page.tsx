import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import { AVATARS } from "@/lib/avatars";
import PersonAvatar, { PresetAvatar } from "@/components/PersonAvatar";
import PhotoUpload from "@/components/PhotoUpload";
import { updatePerson, deletePerson, setPersonPhoto, setPersonAvatar, addEvent, deleteEvent } from "../../actions";

export default async function PersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { user, family, role } = await requireFamily();
  const editable = canEdit(role);

  const p = await db.person.findFirst({
    where: { id, familyId: family.id },
    include: {
      parentLinks: { include: { parent: true } },
      childLinks: { include: { child: true } },
      events: { orderBy: [{ year: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!p || (p.hidden && !editable)) notFound();

  // Their stories: linked directly, or told by them in an interview (older stories have no direct link).
  const stories = await db.story.findMany({
    where: {
      familyId: family.id,
      OR: [{ personId: p.id }, { personId: null, answer: { question: { storytellerId: p.id } } }],
      ...(role === "owner" ? {} : { AND: [{ OR: [{ visibility: { not: "private" } }, { authorId: user.id }] }] }),
    },
    include: { answer: { select: { audioPath: true, durationS: true } }, photos: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
  const years = p.birthYear || p.deathYear ? `${p.birthYear ?? "?"}${p.isLiving ? "" : ` – ${p.deathYear ?? "?"}`}` : "";
  const relatives = [
    ...p.parentLinks.map((l) => ({ id: l.id, rel: "parent", person: l.parent })),
    ...p.childLinks.map((l) => ({ id: l.id, rel: "child", person: l.child })),
  ];

  return (
    <div className="stack" style={{ maxWidth: 860, gap: 32 }}>
      <Link className="small muted" href="/app/family">← Family tree</Link>
      {saved && <p className="notice small">Saved.</p>}

      {/* ---------- Header ---------- */}
      <header className="profile-head">
        <PersonAvatar person={p} size={120} />
        <div className="stack" style={{ gap: 6, minWidth: 0 }}>
          <p className="eyebrow">{p.isSelf ? "You" : p.isLiving ? "Living" : "In memory"}{p.hidden ? " · hidden branch" : ""}</p>
          <h1 style={{ fontSize: "clamp(2rem,4.5vw,2.9rem)" }}>{name}</h1>
          <p className="muted">{[years, p.birthPlace && `born in ${p.birthPlace}`].filter(Boolean).join(" · ")}</p>
          {p.bio && <p className="lead" style={{ marginTop: 6 }}>{p.bio}</p>}
          <div className="row" style={{ marginTop: 8 }}>
            {p.isLiving && !p.isSelf && <Link className="btn btn-primary" href={`/app/ask?to=${p.id}`}>Ask {p.firstName} a question</Link>}
            {editable && <Link className="btn btn-ghost" href={`/app/stories/new?person=${p.id}`}>Write a memory about {p.firstName}</Link>}
            {editable && <a className="btn btn-ghost" href="#edit">Edit profile</a>}
          </div>
        </div>
      </header>

      {relatives.length > 0 && (
        <div className="row small">
          {relatives.map((r) => (
            <Link key={r.id} className="chip" href={`/app/family/${r.person.id}`} style={{ paddingLeft: 4 }}>
              <PersonAvatar person={r.person} size={22} /> <em>{r.rel}</em> {r.person.firstName}
            </Link>
          ))}
        </div>
      )}

      {/* ---------- Life story ---------- */}
      <section className="stack">
        <h2 className="section-title">Life story</h2>
        {p.lifePath ? (
          <div className="prose">{p.lifePath.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
        ) : (
          <p className="muted small">
            No life story yet.{" "}
            {editable && <>Where did {p.firstName} grow up, what did they do, what were they like? <a href="#edit">Write it</a> in your own words.</>}
          </p>
        )}
      </section>

      {/* ---------- Timeline ---------- */}
      <section className="stack">
        <h2 className="section-title">Life path</h2>
        {p.events.length === 0 ? (
          <p className="muted small">No life events yet. Add key moments: birth, moves, marriage, work, children.</p>
        ) : (
          <ol className="timeline">
            {p.events.map((e) => (
              <li key={e.id}>
                <span className="timeline-year">{e.year ?? "?"}</span>
                <span>
                  {e.description}
                  {e.place ? <span className="muted">, {e.place}</span> : null}
                  {e.source !== "user" && <span className="muted small"> · from a story</span>}
                </span>
                {editable && (
                  <form action={deleteEvent.bind(null, e.id)}>
                    <button className="btn-link small muted" aria-label="Remove event">Remove</button>
                  </form>
                )}
              </li>
            ))}
          </ol>
        )}
        {editable && (
          <form action={addEvent} className="row" style={{ alignItems: "end", gap: 8 }}>
            <input type="hidden" name="personId" value={p.id} />
            <input type="hidden" name="back" value={`/app/family/${p.id}`} />
            <div className="field" style={{ width: 90 }}><label htmlFor="ev-year">Year</label><input id="ev-year" name="year" inputMode="numeric" placeholder="1953" /></div>
            <div className="field" style={{ flex: "2 1 220px" }}><label htmlFor="ev-desc">What happened</label><input id="ev-desc" name="description" required placeholder="Moved to Zurich for work" /></div>
            <div className="field" style={{ flex: "1 1 140px" }}><label htmlFor="ev-place">Place</label><input id="ev-place" name="place" placeholder="Zurich" /></div>
            <button className="btn btn-ghost">Add</button>
          </form>
        )}
      </section>

      {/* ---------- Stories ---------- */}
      <section className="stack">
        <h2 className="section-title">Stories{stories.length ? ` · ${stories.length}` : ""}</h2>
        {stories.length === 0 ? (
          <p className="muted small">
            No stories yet.{" "}
            {p.isLiving && !p.isSelf ? <Link href={`/app/ask?to=${p.id}`}>Ask {p.firstName} a first question</Link> : editable ? <Link href={`/app/stories/new?person=${p.id}`}>Write the first memory</Link> : null}
          </p>
        ) : (
          <div className="story-grid">
            {stories.map((s) => (
              <Link key={s.id} href={`/app/stories/${s.id}`} className="card story-card">
                <p className="eyebrow">{s.chapter ?? "Story"}{s.answer?.audioPath ? " · voice" : ""}{s.visibility === "private" ? " · private" : ""}</p>
                <h3>{s.title}</h3>
                <p className="small muted">{excerpt(s.body)}</p>
                <p className="small muted">{s.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Edit ---------- */}
      {editable && (
        <section id="edit" className="card stack" style={{ gap: 22 }}>
          <h2 className="section-title">Edit profile</h2>

          <div className="stack" style={{ gap: 12 }}>
            <h3 className="small" style={{ fontWeight: 600 }}>Picture</h3>
            <div className="row" style={{ gap: 16 }}>
              <PersonAvatar person={p} size={72} />
              <PhotoUpload action={setPersonPhoto.bind(null, p.id)} label={p.photoPath ? "Replace photo" : "Upload a photo"} />
            </div>
            <form action={setPersonAvatar.bind(null, p.id)} className="stack" style={{ gap: 8 }}>
              <p className="small muted">Or choose a symbol:</p>
              <div className="avatar-grid">
                {AVATARS.map((a) => (
                  <button key={a.id} name="avatar" value={a.id} title={a.label} aria-label={a.label}
                    className={`avatar-pick${!p.photoPath && p.avatar === a.id ? " is-on" : ""}`}>
                    <PresetAvatar preset={a} size={44} />
                  </button>
                ))}
                <button name="avatar" value="" title="Initials" aria-label="Initials"
                  className={`avatar-pick${!p.photoPath && !p.avatar ? " is-on" : ""}`}>
                  <PersonAvatar person={{ firstName: p.firstName, lastName: p.lastName }} size={44} />
                </button>
              </div>
              {p.photoPath && <p className="small muted">Choosing a symbol removes the uploaded photo.</p>}
            </form>
          </div>

          <form action={updatePerson.bind(null, p.id)} className="stack">
            <div className="field">
              <label htmlFor="bio">In one line</label>
              <input id="bio" name="bio" maxLength={280} defaultValue={p.bio ?? ""} placeholder="Teacher, gardener, the best storyteller at every family dinner" />
            </div>
            <div className="field">
              <label htmlFor="lifePath">Life story</label>
              <textarea id="lifePath" name="lifePath" defaultValue={p.lifePath ?? ""} style={{ minHeight: 220 }}
                placeholder="Where they grew up, how they met their partner, what they worked as, where life took them, what they were like. Leave an empty line between paragraphs." />
            </div>
            <div className="grid2">
              <div className="field"><label htmlFor="firstName">First name</label><input id="firstName" name="firstName" defaultValue={p.firstName} required /></div>
              <div className="field"><label htmlFor="lastName">Last name</label><input id="lastName" name="lastName" defaultValue={p.lastName ?? ""} /></div>
              <div className="field"><label htmlFor="birthYear">Year of birth</label><input id="birthYear" name="birthYear" defaultValue={p.birthYear ?? ""} inputMode="numeric" /></div>
              <div className="field"><label htmlFor="birthPlace">Place of birth</label><input id="birthPlace" name="birthPlace" defaultValue={p.birthPlace ?? ""} /></div>
              <div className="field"><label htmlFor="deathYear">Year of death</label><input id="deathYear" name="deathYear" defaultValue={p.deathYear ?? ""} inputMode="numeric" /></div>
              <div className="stack" style={{ gap: 4, alignSelf: "end" }}>
                <label className="row small"><input type="checkbox" name="deceased" defaultChecked={!p.isLiving} /> Has passed away</label>
                <label className="row small"><input type="checkbox" name="hidden" defaultChecked={p.hidden} /> Hide from viewers (sensitive branch)</label>
              </div>
            </div>
            <div><button className="btn btn-primary">Save</button></div>
          </form>
        </section>
      )}

      {editable && !p.isSelf && (
        <details>
          <summary className="btn btn-ghost btn-sm" style={{ listStyle: "none" }}>Remove from tree…</summary>
          <form action={deletePerson.bind(null, p.id)} className="row" style={{ marginTop: 8 }}>
            <span className="small muted">Only possible while they have no recorded answers, so no story is ever lost.</span>
            <button className="btn btn-danger btn-sm">Remove {p.firstName}</button>
          </form>
        </details>
      )}
    </div>
  );
}

function excerpt(body: string, n = 170): string {
  const t = body.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, t.lastIndexOf(" ", n)) + "…" : t;
}
