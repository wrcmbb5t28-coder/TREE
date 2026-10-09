import { countryName } from "@/i18n/config";
import CountrySelect from "@/components/CountrySelect";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { canEdit } from "@/lib/auth";
import { appContext, fmtDate } from "@/i18n/app";
import { common, chapterName, eventText } from "@/i18n/app/common";
import { familyT } from "@/i18n/app/family";
import { AVATARS } from "@/lib/avatars";
import { RELATIONS, relationById } from "@/i18n/questions";
import PersonAvatar, { PresetAvatar } from "@/components/PersonAvatar";
import PhotoUpload from "@/components/PhotoUpload";
import { updatePerson, deletePerson, addPersonPhoto, makeProfilePhoto, deletePersonPhoto, setPersonAvatar, addEvent, deleteEvent } from "../../actions";

export default async function PersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { user, family, role, lang } = await appContext();
  const T = familyT[lang];
  const t = T.person;
  const c = common[lang];
  const editable = canEdit(role);

  const p = await db.person.findFirst({
    where: { id, familyId: family.id },
    include: {
      parentLinks: { include: { parent: true } },
      childLinks: { include: { child: true } },
      events: { orderBy: [{ year: "asc" }, { createdAt: "asc" }] },
      photos: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!p || (p.hidden && !editable)) notFound();

  // Profile pictures uploaded before galleries existed: add them to the gallery once.
  if (p.photoPath && !p.photos.some((ph) => ph.path === p.photoPath)) {
    const ph = await db.photo.create({ data: { familyId: family.id, personId: p.id, path: p.photoPath } });
    p.photos.unshift(ph);
  }

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
  const kin = relationById(p.relation);
  const years = p.birthYear || p.deathYear ? `${p.birthYear ?? "?"}${p.isLiving ? "" : ` – ${p.deathYear ?? "?"}`}` : "";
  const uploadTexts = { ...T.upload, lang };
  const relatives = [
    ...p.parentLinks.map((l) => ({ id: l.id, rel: "parent", person: l.parent })),
    ...p.childLinks.map((l) => ({ id: l.id, rel: "child", person: l.child })),
  ];

  return (
    <div className="stack" style={{ maxWidth: 860, gap: 32 }}>
      <Link className="small muted" href="/app/family">{t.back}</Link>
      {saved && <p className="notice small">{c.saved}</p>}

      {/* ---------- Header ---------- */}
      <header className="profile-head">
        <PersonAvatar person={p} size={120} />
        <div className="stack" style={{ gap: 6, minWidth: 0 }}>
          <p className="eyebrow">{p.isSelf ? t.you : [kin && kin.id !== "other" ? c.yourRelation[kin.id] : null, p.isLiving ? null : t.inMemory].filter(Boolean).join(" · ") || t.living}{p.hidden ? ` · ${t.hiddenBranch}` : ""}</p>
          <h1 style={{ fontSize: "clamp(2rem,4.5vw,2.9rem)" }}>{name}</h1>
          <p className="muted">{[years, (p.birthPlace || p.birthCountry) && t.bornIn([p.birthPlace, p.birthCountry && countryName(p.birthCountry, lang)].filter(Boolean).join(", "), p.gender)].filter(Boolean).join(" · ")}</p>
          {p.bio && <p className="lead" style={{ marginTop: 6 }}>{p.bio}</p>}
          <div className="row" style={{ marginTop: 8 }}>
            {p.isLiving && !p.isSelf && <Link className="btn btn-primary" href={`/app/ask?to=${p.id}`}>{t.ask(p.firstName)}</Link>}
            {editable && <Link className="btn btn-ghost" href={`/app/stories/new?person=${p.id}`}>{t.writeMemory(p.firstName)}</Link>}
            {editable && <a className="btn btn-ghost" href="#edit">{t.editProfile}</a>}
          </div>
        </div>
      </header>

      {relatives.length > 0 && (
        <div className="row small">
          {relatives.map((r) => (
            <Link key={r.id} className="chip" href={`/app/family/${r.person.id}`} style={{ paddingLeft: 4 }}>
              <PersonAvatar person={r.person} size={22} /> <em>{r.rel === "parent" ? t.parent(r.person.gender) : t.child(r.person.gender)}</em> {r.person.firstName}
            </Link>
          ))}
        </div>
      )}

      {/* ---------- Life story ---------- */}
      <section className="stack">
        <h2 className="section-title">{t.lifeStory}</h2>
        {p.lifePath ? (
          <div className="prose">{p.lifePath.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
        ) : (
          <p className="muted small">
            {t.noLifeStory}{" "}
            {editable && <>{t.lifeStoryAsk(p.firstName, p.gender)} <a href="#edit">{t.writeIt}</a>{t.inOwnWords}</>}
          </p>
        )}
      </section>

      {/* ---------- Timeline ---------- */}
      <section className="stack">
        <h2 className="section-title">{t.lifePath}</h2>
        {p.events.length === 0 ? (
          <p className="muted small">{t.noEvents}</p>
        ) : (
          <ol className="timeline">
            {p.events.map((e) => (
              <li key={e.id}>
                <span className="timeline-year">{e.year ?? "?"}</span>
                <span>
                  {eventText(lang, e.description, p)}
                  {e.place || e.country ? <span className="muted">, {[e.place, e.country && countryName(e.country, lang)].filter(Boolean).join(", ")}</span> : null}
                  {e.source !== "user" && <span className="muted small"> · {t.fromStory}</span>}
                </span>
                {editable && (
                  <form action={deleteEvent.bind(null, e.id)}>
                    <button className="btn-link small muted" aria-label={t.removeEvent}>{c.btn.remove}</button>
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
            <div className="field" style={{ width: 90 }}><label htmlFor="ev-year">{t.year}</label><input id="ev-year" name="year" inputMode="numeric" placeholder={t.phYear} /></div>
            <div className="field" style={{ flex: "2 1 220px" }}><label htmlFor="ev-desc">{t.whatHappened}</label><input id="ev-desc" name="description" required placeholder={t.phWhat} /></div>
            <div className="field" style={{ flex: "1 1 140px" }}><label htmlFor="ev-place">{t.place}</label><input id="ev-place" name="place" placeholder={t.phPlace} /></div>
            <div className="field" style={{ flex: "1 1 160px" }}><label htmlFor="ev-country">{familyT[lang].journey.country}</label><CountrySelect lang={lang} id="ev-country" /></div>
            <button className="btn btn-ghost">{c.btn.add}</button>
          </form>
        )}
      </section>

      {/* ---------- Photos ---------- */}
      <section id="photos" className="stack">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 className="section-title">{t.photos}{p.photos.length ? ` · ${p.photos.length}` : ""}</h2>
          {editable && <PhotoUpload action={addPersonPhoto.bind(null, p.id)} label={t.addPhotos} texts={uploadTexts} multiple />}
        </div>
        {p.photos.length === 0 ? (
          <p className="muted small">{t.noPhotos}{editable ? t.noPhotosHint : ""}</p>
        ) : (
          <div className="photo-grid">
            {p.photos.map((ph) => {
              const isAvatar = ph.path === p.photoPath;
              return (
                <figure key={ph.id} className={`photo-tile${isAvatar ? " is-avatar" : ""}`}>
                  <a href={`/api/files/${ph.path}`} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/files/${ph.path}`} alt={ph.caption ?? t.photoAlt(p.firstName)} loading="lazy" />
                  </a>
                  {editable ? (
                    <figcaption className="photo-actions">
                      {isAvatar ? (
                        <span className="photo-current">✓ {t.profilePicture}</span>
                      ) : (
                        <form action={makeProfilePhoto.bind(null, ph.id)}><button className="photo-btn">{t.makeProfilePicture}</button></form>
                      )}
                      <details className="photo-del">
                        <summary className="photo-btn photo-icon" aria-label={t.deletePhoto} title={t.deletePhoto}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
                        </summary>
                        <div className="photo-confirm">
                          <form action={deletePersonPhoto.bind(null, ph.id)}><button className="btn btn-danger btn-sm">{t.deletePhoto}</button></form>
                        </div>
                      </details>
                    </figcaption>
                  ) : (
                    isAvatar && <figcaption className="photo-actions"><span className="photo-current">✓ {t.profilePicture}</span></figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------- Stories ---------- */}
      <section className="stack">
        <h2 className="section-title">{t.stories}{stories.length ? ` · ${stories.length}` : ""}</h2>
        {stories.length === 0 ? (
          <p className="muted small">
            {t.noStories}{" "}
            {p.isLiving && !p.isSelf ? <Link href={`/app/ask?to=${p.id}`}>{t.askFirst(p.firstName)}</Link> : editable ? <Link href={`/app/stories/new?person=${p.id}`}>{t.writeFirst}</Link> : null}
          </p>
        ) : (
          <div className="story-grid">
            {stories.map((s) => (
              <Link key={s.id} href={`/app/stories/${s.id}`} className="card story-card">
                <p className="eyebrow">{chapterName(lang, s.chapter)}{s.answer?.audioPath ? ` · ${t.voice}` : ""}{s.visibility === "private" ? ` · ${t.private}` : ""}</p>
                <h3>{s.title}</h3>
                <p className="small muted">{excerpt(s.body)}</p>
                <p className="small muted">{fmtDate(s.createdAt, lang)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Edit ---------- */}
      {editable && (
        <section id="edit" className="card stack" style={{ gap: 22 }}>
          <h2 className="section-title">{t.editProfile}</h2>

          <div className="stack" style={{ gap: 12 }}>
            <h3 className="small" style={{ fontWeight: 600 }}>{t.picture}</h3>
            <div className="row" style={{ gap: 16 }}>
              <PersonAvatar person={p} size={72} />
              <div className="stack" style={{ gap: 6, flex: "1 1 220px" }}>
                <PhotoUpload action={addPersonPhoto.bind(null, p.id)} label={t.uploadProfilePhoto} texts={uploadTexts} fields={{ makeAvatar: "1" }} />
                {p.photos.length > 0 && (
                  <p className="small muted" style={{ margin: 0 }}>{t.orPickBefore(p.photos.length)}<a href="#photos">{t.photos}</a>{t.orPickAfter}</p>
                )}
              </div>
            </div>
            <form action={setPersonAvatar.bind(null, p.id)} className="stack" style={{ gap: 8 }}>
              <p className="small muted">{t.chooseSymbol}</p>
              <div className="avatar-grid">
                {AVATARS.map((a) => (
                  <button key={a.id} name="avatar" value={a.id} title={T.symbols[a.id] ?? a.label} aria-label={T.symbols[a.id] ?? a.label}
                    className={`avatar-pick${!p.photoPath && p.avatar === a.id ? " is-on" : ""}`}>
                    <PresetAvatar preset={a} size={44} />
                  </button>
                ))}
                <button name="avatar" value="" title={t.initials} aria-label={t.initials}
                  className={`avatar-pick${!p.photoPath && !p.avatar ? " is-on" : ""}`}>
                  <PersonAvatar person={{ firstName: p.firstName, lastName: p.lastName }} size={44} />
                </button>
              </div>
              {p.photoPath && <p className="small muted">{t.symbolKeepsPhotos}</p>}
            </form>
          </div>

          <form action={updatePerson.bind(null, p.id)} className="stack">
            {!p.isSelf && (
              <div className="grid2">
                <div className="field">
                  <label htmlFor="role">{t.whoIs(p.firstName)}</label>
                  <select id="role" name="role" defaultValue={p.relation ?? ""}>
                    <option value="">{t.notSet}</option>
                    {RELATIONS.map((r) => <option key={r.id} value={r.id}>{c.relations[r.id]}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="gender">{c.gender.label}</label>
                  <select id="gender" name="gender" defaultValue={p.gender ?? ""}>
                    <option value="">{c.gender.unset}</option>
                    <option value="f">{c.gender.f}</option>
                    <option value="m">{c.gender.m}</option>
                  </select>
                </div>
              </div>
            )}
            {!p.isSelf && <p className="small muted" style={{ marginTop: -8 }}>{t.genderHint(p.firstName)}</p>}
            <div className="field">
              <label htmlFor="bio">{t.inOneLine}</label>
              <input id="bio" name="bio" maxLength={280} defaultValue={p.bio ?? ""} placeholder={t.phBio} />
            </div>
            <div className="field">
              <label htmlFor="lifePath">{t.lifeStory}</label>
              <textarea id="lifePath" name="lifePath" defaultValue={p.lifePath ?? ""} style={{ minHeight: 220 }}
                placeholder={t.phLifePath} />
            </div>
            <div className="grid2">
              <div className="field"><label htmlFor="firstName">{t.firstName}</label><input id="firstName" name="firstName" defaultValue={p.firstName} required /></div>
              <div className="field"><label htmlFor="lastName">{t.lastName}</label><input id="lastName" name="lastName" defaultValue={p.lastName ?? ""} /></div>
              <div className="field"><label htmlFor="birthYear">{t.birthYear}</label><input id="birthYear" name="birthYear" defaultValue={p.birthYear ?? ""} inputMode="numeric" /></div>
              <div className="field"><label htmlFor="birthPlace">{t.birthPlace}</label><input id="birthPlace" name="birthPlace" defaultValue={p.birthPlace ?? ""} /></div>
              <div className="field"><label htmlFor="birthCountry">{familyT[lang].journey.country}</label><CountrySelect lang={lang} id="birthCountry" name="birthCountry" defaultValue={p.birthCountry} /></div>
              <div className="field"><label htmlFor="deathYear">{t.deathYear}</label><input id="deathYear" name="deathYear" defaultValue={p.deathYear ?? ""} inputMode="numeric" /></div>
              <div className="stack" style={{ gap: 4, alignSelf: "end" }}>
                <label className="row small"><input type="checkbox" name="deceased" defaultChecked={!p.isLiving} /> {t.passedAway}</label>
                <label className="row small"><input type="checkbox" name="hidden" defaultChecked={p.hidden} /> {t.hide}</label>
              </div>
            </div>
            <div><button className="btn btn-primary">{c.btn.save}</button></div>
          </form>
        </section>
      )}

      {editable && !p.isSelf && (
        <details>
          <summary className="btn btn-ghost btn-sm" style={{ listStyle: "none" }}>{t.removeFromTree}</summary>
          <form action={deletePerson.bind(null, p.id)} className="row" style={{ marginTop: 8 }}>
            <span className="small muted">{t.removeHint}</span>
            <button className="btn btn-danger btn-sm">{t.removeName(p.firstName)}</button>
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
