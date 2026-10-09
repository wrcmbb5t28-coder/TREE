import Link from "next/link";
import { db } from "@/lib/db";
import { canEdit } from "@/lib/auth";
import { appContext, plural } from "@/i18n/app";
import { common, eventText } from "@/i18n/app/common";
import { familyT } from "@/i18n/app/family";
import PersonAvatar from "@/components/PersonAvatar";
import { countryName } from "@/i18n/config";
import CountrySelect from "@/components/CountrySelect";
import { addEvent, deleteEvent } from "../actions";
import FamilyMap, { type MapPath, type MapPlace } from "@/components/FamilyMap";
import { geocodeMany, placeKey } from "@/lib/geo";
import { avatarById } from "@/lib/avatars";

const PALETTE = ["#2F6B5E", "#9C4F5A", "#4F6D8F", "#B4774A", "#7A5C8E", "#5E7A3A", "#A0663A", "#3F5E6B"];

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
  let countries: string[] = [];
  const dated = events.filter((e) => e.year);

  // Map: places with coordinates, who lived there and when; one line per person in time order.
  const located = dated.filter((e) => e.place || e.country);
  const coords = await geocodeMany(located.map((e) => ({ place: e.place, country: e.country })), 6);
  const placeMap = new Map<string, { name: string; lat: number; lng: number; from: number; to: number; people: Set<string> }>();
  for (const e of located) {
    const k = placeKey(e.place, e.country);
    const at = coords.get(k);
    if (!at) continue;
    const p = placeMap.get(k) ?? { name: placeOf(e), ...at, from: e.year!, to: e.year!, people: new Set<string>() };
    p.from = Math.min(p.from, e.year!);
    p.to = Math.max(p.to, e.year!);
    if (e.person) p.people.add(e.person.firstName);
    placeMap.set(k, p);
  }
  const mapPlaces: MapPlace[] = [...placeMap.entries()].map(([key, p]) => ({
    key, name: p.name, lat: p.lat, lng: p.lng, years: p.from === p.to ? String(p.from) : `${p.from}–${p.to}`, people: [...p.people],
  }));
  const colorOf = new Map<string, string>();
  const mapPaths: MapPath[] = [];
  for (const person of people) {
    const pts = located
      .filter((e) => e.personId === person.id && coords.has(placeKey(e.place, e.country)))
      .map((e) => coords.get(placeKey(e.place, e.country))!);
    const dedup = pts.filter((pt, i) => i === 0 || pt.lat !== pts[i - 1].lat || pt.lng !== pts[i - 1].lng);
    if (!pts.length) continue;
    const color = avatarById(person.avatar)?.bg ?? PALETTE[colorOf.size % PALETTE.length];
    colorOf.set(person.id, color);
    mapPaths.push({ id: person.id, name: person.firstName, color, points: dedup.map((pt) => [pt.lat, pt.lng]) });
  }
  countries = [...new Set([...events.map((e) => e.country).filter(Boolean), ...located.map((e) => coords.get(placeKey(e.place, e.country))?.country).filter(Boolean)])] as string[];
  const missing = new Set(located.filter((e) => !coords.has(placeKey(e.place, e.country))).map(placeOf));

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

      {mapPlaces.length > 0 && (
        <section className="stack">
          <h2 className="section-title">{t.route}</h2>
          <FamilyMap places={mapPlaces} paths={mapPaths} label={t.label} />
          {mapPaths.length > 0 && (
            <div className="map-legend">
              {mapPaths.map((p) => {
                const person = people.find((x) => x.id === p.id)!;
                return (
                  <Link key={p.id} href={`/app/family/${p.id}`} className="map-legend-item">
                    <span className="map-swatch" style={{ background: p.color }} />
                    <PersonAvatar person={person} size={22} /> {p.name}
                  </Link>
                );
              })}
            </div>
          )}
          {missing.size > 0 && <p className="small muted">{t.notOnMap([...missing].join(", "))}</p>}
        </section>
      )}

      {events.length > 0 && (
        <section className="stack">
          <h2 className="section-title">{t.timeline}</h2>
          <ol className="ct">
            {(() => {
              let i = 0;
              return [...groups.entries()].flatMap(([decade, list]) => [
                <li key={`d-${decade}`} className="ct-decade"><span>{decade}</span></li>,
                ...list.map((e) => {
                  const side = i++ % 2 === 0 ? "ct-left" : "ct-right";
                  const where = [e.place, e.country && countryName(e.country, lang)].filter(Boolean).join(", ");
                  return (
                    <li key={e.id} className={`ct-item ${side}`}>
                      <span className="ct-dot" aria-hidden="true" />
                      <div className="ct-card">
                        <div className="ct-top">
                          <span className="ct-year">{e.year ?? "—"}</span>
                          {editable && (
                            <form action={deleteEvent.bind(null, e.id)}>
                              <button className="ct-del" aria-label={t.removeEvent} title={t.removeEvent}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                              </button>
                            </form>
                          )}
                        </div>
                        <p className="ct-what">{eventText(lang, e.description, e.person)}</p>
                        {where && <p className="ct-where">{where}</p>}
                        {e.person ? (
                          <Link href={`/app/family/${e.person.id}`} className="route-person ct-who">
                            <PersonAvatar person={e.person} size={24} /> {e.person.firstName}
                          </Link>
                        ) : (
                          <span className="muted small">{t.wholeFamily}</span>
                        )}
                      </div>
                    </li>
                  );
                }),
              ]);
            })()}
          </ol>
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
              <CountrySelect lang={lang} id="country" />
            </div>
          </div>
          <div><button className="btn btn-primary">{c.btn.add}</button></div>
        </form>
      )}
    </div>
  );
}
