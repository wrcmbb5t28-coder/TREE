import Link from "next/link";
import { db } from "@/lib/db";
import { canEdit } from "@/lib/auth";
import { appContext, plural } from "@/i18n/app";
import { common, eventText } from "@/i18n/app/common";
import { familyT } from "@/i18n/app/family";
import PersonAvatar from "@/components/PersonAvatar";
import { countryName, COUNTRY_CODES } from "@/i18n/config";
import { addEvent, deleteEvent } from "../actions";

/**
 * The family's journey: where people lived, year by year, with who it was.
 * 1) "Where your family lived": places in the order the family reached them, with the people there.
 * 2) A vertical timeline grouped by decade.
 */
export default async function JourneyPage() {
  const { family, role, lang } = await appContext();
  const t = familyT[lang].journey;
  const c = common[lang];
  const editable = canEdit(role);
  const events = await db.lifeEvent.findMany({
    where: { familyId: family.id },
    include: { person: true },
    orderBy: [{ year: "asc" }, { createdAt: "asc" }],
  });
  const people = await db.person.findMany({ where: { familyId: family.id }, orderBy: { generation: "asc" } });

  const placeOf = (e: (typeof events)[number]) => e.place || (e.country ? countryName(e.country, lang) : "");
  const countries = [...new Set(events.map((e) => e.country).filter(Boolean))] as string[];
  const dated = events.filter((e) => e.year);

  // Places in the order the family first reached them, with the years and people.
  const stops = new Map<string, { place: string; from: number; to: number; people: Map<string, (typeof events)[number]["person"]> }>();
  for (const e of dated) {
    const place = placeOf(e);
    if (!place) continue;
    const key = place.toLowerCase();
    const s = stops.get(key) ?? { place, from: e.year!, to: e.year!, people: new Map() };
    s.from = Math.min(s.from, e.year!);
    s.to = Math.max(s.to, e.year!);
    if (e.person) s.people.set(e.person.id, e.person);
    stops.set(key, s);
  }
  const route = [...stops.values()].sort((a, b) => a.from - b.from);

  // Timeline grouped by decade; events without a year go last.
  const groups = new Map<string, typeof events>();
  for (const e of events) {
    const k = e.year ? t.decade(Math.floor(e.year / 10) * 10) : t.noYear;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(e);
  }

  return (
    <div className="stack" style={{ gap: 28, maxWidth: 900 }}>
      <div className="stack" style={{ gap: 8 }}>
        <p className="eyebrow">{plural(lang, countries.length, t.countries)} · {plural(lang, dated.length, t.moments)}</p>
        <h1>{t.title}</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>{t.intro}</p>
      </div>

      {events.length === 0 && <div className="empty">{t.empty}</div>}

      {route.length > 0 && (
        <section className="stack">
          <h2 className="section-title">{t.route}</h2>
          <ol className="route">
            {route.map((s) => (
              <li key={s.place} className="route-stop">
                <span className="route-years">{s.from === s.to ? s.from : `${s.from}–${s.to}`}</span>
                <b className="route-place">{s.place}</b>
                {s.people.size > 0 && (
                  <span className="route-people">
                    {[...s.people.values()].map((p) => p && (
                      <Link key={p.id} href={`/app/family/${p.id}`} className="route-person" title={p.firstName}>
                        <PersonAvatar person={p} size={22} /> {p.firstName}
                      </Link>
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {events.length > 0 && (
        <section className="stack">
          <h2 className="section-title">{t.timeline}</h2>
          {[...groups.entries()].map(([decade, list]) => (
            <div key={decade} className="stack" style={{ gap: 6 }}>
              <h3 className="decade">{decade}</h3>
              <ol className="jt">
                {list.map((e) => (
                  <li key={e.id} className="jt-item">
                    <span className="jt-year">{e.year ?? "—"}</span>
                    <span className="jt-who">
                      {e.person ? (
                        <Link href={`/app/family/${e.person.id}`} className="route-person">
                          <PersonAvatar person={e.person} size={28} /> <b>{e.person.firstName}</b>
                        </Link>
                      ) : (
                        <span className="muted small">{t.wholeFamily}</span>
                      )}
                    </span>
                    <span className="jt-what">
                      {eventText(lang, e.description, e.person)}
                      {placeOf(e) && <span className="muted"> · {[e.place, e.country && countryName(e.country, lang)].filter(Boolean).join(", ")}</span>}
                    </span>
                    {editable && (
                      <form action={deleteEvent.bind(null, e.id)}>
                        <button className="photo-btn photo-icon" aria-label={t.removeEvent} title={t.removeEvent}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      )}

      {editable && (
        <form action={addEvent} className="card stack" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: "1.3rem" }}>{t.addMoment}</h2>
          <div className="grid2">
            <div className="field">
              <label htmlFor="personId">{t.who}</label>
              <select id="personId" name="personId" defaultValue="">
                <option value="">{t.wholeFamily}</option>
                {people.map((p) => <option key={p.id} value={p.id}>{[p.firstName, p.lastName].filter(Boolean).join(" ")}</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor="year">{t.year}</label><input id="year" name="year" inputMode="numeric" placeholder="1989" /></div>
          </div>
          <div className="field"><label htmlFor="description">{t.whatHappened}</label><input id="description" name="description" required placeholder={t.phWhat} /></div>
          <div className="grid2">
            <div className="field"><label htmlFor="place">{t.town}</label><input id="place" name="place" /></div>
            <div className="field">
              <label htmlFor="country">{t.country}</label>
              <select id="country" name="country" defaultValue="">
                <option value="">—</option>
                {COUNTRY_CODES.map((cc) => <option key={cc} value={cc}>{countryName(cc, lang)}</option>)}
              </select>
            </div>
          </div>
          <div><button className="btn btn-primary">{c.btn.add}</button></div>
        </form>
      )}
    </div>
  );
}
