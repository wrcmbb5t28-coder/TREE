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
import EventEdit from "@/components/EventEdit";
import VoiceFill from "@/components/VoiceFill";
import FamilyMap, { type MapPath, type MapPlace } from "@/components/FamilyMap";
import { geocodeMany, placeKey } from "@/lib/geo";
import { after } from "next/server";
import { avatarById } from "@/lib/avatars";
import { distinctNames } from "@/lib/names";

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

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

  const nameOf = distinctNames(people);
  const nm = (p: { id: string; firstName: string }) => nameOf.get(p.id) ?? p.firstName;
  const placeOf = (e: (typeof events)[number]) => e.place || (e.country ? countryName(e.country, lang) : "");
  let countries: string[] = [];
  const dated = events.filter((e) => e.year);

  // Map: places with coordinates, who lived there and when; one line per person in time order.
  const located = dated.filter((e) => e.place || e.country);
  const coords = await geocodeMany(located.map((e) => ({ place: e.place, country: e.country })), 2);
  const placeMap = new Map<string, { name: string; lat: number; lng: number; from: number; to: number; people: Set<string> }>();
  for (const e of located) {
    const k = placeKey(e.place, e.country);
    const at = coords.get(k);
    if (!at) continue;
    const p = placeMap.get(k) ?? { name: placeOf(e), ...at, from: e.year!, to: e.year!, people: new Set<string>() };
    p.from = Math.min(p.from, e.year!);
    p.to = Math.max(p.to, e.year!);
    if (e.person) p.people.add(nm(e.person));
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
    mapPaths.push({ id: person.id, name: nm(person), color, points: dedup.map((pt) => [pt.lat, pt.lng]) });
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


  // ---------- "Where we come from": roads, places west to east, the summary, gaps ----------
  type Stop = { key: string; name: string; year: number | null };
  const roads = people.map((person) => {
    const stops: Stop[] = [];
    const push = (place: string | null, country: string | null, year: number | null) => {
      const name = place || (country ? countryName(country, lang) : "");
      if (!name) return;
      const key = placeKey(place, country);
      if (stops.length && stops[stops.length - 1].key === key) return;
      stops.push({ key, name, year });
    };
    const own = events.filter((e) => e.personId === person.id && (e.place || e.country));
    const born = own.find((e) => /is born$/.test(e.description));
    if (person.birthPlace || person.birthCountry) push(person.birthPlace, person.birthCountry, person.birthYear);
    else if (born) push(born.place, born.country, born.year);
    for (const e of own.filter((e) => e !== born).sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999))) push(e.place, e.country, e.year);
    return { person, stops };
  }).filter((r) => r.stops.length > 0);

  const roadPlaces = roads.flatMap((r) => r.stops.map((st) => {
    const ev = events.find((e) => placeKey(e.place, e.country) === st.key);
    return ev ? { place: ev.place, country: ev.country } : { place: r.person.birthPlace, country: r.person.birthCountry };
  }));
  // Cached places only (no waiting); new ones are looked up after the page is sent and show next time.
  const allCoords = await geocodeMany(roadPlaces, 0);
  if (roadPlaces.some((x) => !allCoords.has(placeKey(x.place, x.country)))) after(() => geocodeMany([...roadPlaces, ...located.map((e) => ({ place: e.place, country: e.country }))], 15).then(() => undefined).catch(() => undefined));
  const placeAgg = new Map<string, { name: string; lng: number | null; lat: number | null; who: Map<string, number | null> }>();
  for (const r of roads) for (const st of r.stops) {
    const at = allCoords.get(st.key) ?? coords.get(st.key);
    const a = placeAgg.get(st.key) ?? { name: st.name, lng: at?.lng ?? null, lat: at?.lat ?? null, who: new Map() };
    if (!a.who.has(nm(r.person))) a.who.set(nm(r.person), st.year);
    placeAgg.set(st.key, a);
  }
  const placeList = [...placeAgg.values()].sort((a, b) => (a.lng ?? 999) - (b.lng ?? 999));
  const placeCountries = new Set([...placeAgg.keys()].map((k) => (allCoords.get(k) ?? coords.get(k))?.country).filter(Boolean));
  for (const cc of countries) placeCountries.add(cc);
  const allStops = roads.flatMap((r) => r.stops.filter((st) => st.year)).sort((a, b) => a.year! - b.year!);
  const first = allStops[0], last = allStops[allStops.length - 1];
  const km = (a?: { lat: number | null; lng: number | null }, b?: { lat: number | null; lng: number | null }) => {
    if (!a || !b || a.lat == null || b.lat == null || a.lng == null || b.lng == null) return null;
    const R = 6371, rad = Math.PI / 180;
    const d = Math.acos(Math.min(1, Math.sin(a.lat * rad) * Math.sin(b.lat * rad) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.cos((b.lng - a.lng) * rad))) * R;
    return d > 30 ? Math.round(d / 100) * 100 : null;
  };
  const years = first ? Math.max(1, new Date().getFullYear() - first.year!) : 0;
  const firstLast = first && last ? km(placeAgg.get(first.key), placeAgg.get(last.key)) : null;
  // The farthest place from where the story starts: tells more than first → last when the family came back.
  const far = first ? [...placeAgg.entries()].map(([k, v]) => ({ k, name: v.name, d: km(placeAgg.get(first.key), v) ?? 0 })).sort((x, y) => y.d - x.d)[0] : null;
  const summary = !first || !last || first.key === last.key ? null
    : (firstLast ?? 0) < 500 && far && far.d >= 500 ? t.summaryFar(first.name, last.name, years, far.name, far.d)
    : t.summary(first.name, last.name, firstLast, years);

  // Many places: group them by country (west to east) instead of one long row.
  const countryOfKey = (k: string) => (allCoords.get(k) ?? coords.get(k))?.country || k.split("|")[1] || "";
  const byCountry = new Map<string, { name: string; lng: number[]; places: string[] }>();
  for (const [k, v] of placeAgg) {
    const cc = countryOfKey(k);
    const g = byCountry.get(cc) ?? { name: cc ? countryName(cc, lang) : "—", lng: [], places: [] };
    if (v.lng != null) g.lng.push(v.lng);
    g.places.push(v.name);
    byCountry.set(cc, g);
  }
  const countryGroups = [...byCountry.values()].sort((x, y) => (x.lng.length ? avg(x.lng) : 999) - (y.lng.length ? avg(y.lng) : 999));
  // Many people: one block per generation, oldest first.
  const gens = [...new Set(roads.map((r) => r.person.generation))].sort((a, b) => a - b);
  const roadGroups = gens.map((g, i) => {
    const list = roads.filter((r) => r.person.generation === g).sort((a, b) => (a.person.birthYear ?? 9999) - (b.person.birthYear ?? 9999));
    const yearsIn = list.map((r) => r.person.birthYear).filter((y): y is number => !!y);
    return { label: t.genLabel(i + 1, yearsIn.length ? Math.min(...yearsIn) : null), list };
  });
  const grouped = roads.length > 10 && gens.length > 1;
  // Long families: the four youngest generations stay open, older ones fold away.
  const shownGroups = grouped && roadGroups.length > 5 ? roadGroups.slice(-4) : roadGroups;
  const olderGroups = grouped && roadGroups.length > 5 ? roadGroups.slice(0, -4) : [];
  const olderFrom = olderGroups.flatMap((g) => g.list.map((r) => r.person.birthYear)).filter((y): y is number => !!y);

  // Questions from the gaps: one place only → "and then?"; a move → "why?". Living people first.
  const gaps: { q: string; personId: string | null; name: string }[] = [];
  for (const r of [...roads].sort((a, b) => Number(b.person.isLiving && !b.person.isSelf) - Number(a.person.isLiving && !a.person.isSelf))) {
    const askable = r.person.isLiving && !r.person.isSelf;
    if (r.stops.length === 1 && !r.person.isSelf) gaps.push({ q: t.qAfter(r.stops[0].name), personId: askable ? r.person.id : null, name: nm(r.person) });
    else if (r.stops.length > 1 && askable) gaps.push({ q: t.qMove(r.stops[0].name, r.stops[1].name), personId: r.person.id, name: nm(r.person) });
    if (gaps.length >= 4) break;
  }
  const word = (n: number, pf: Parameters<typeof plural>[2]) => plural(lang, n, pf).replace(String(n), "").trim();

  return (
    <div className="stack" style={{ gap: 30, maxWidth: 980 }}>
      <div className="stack" style={{ gap: 10 }}>
        <p className="eyebrow">{t.title}</p>
        <h1>{t.head}</h1>
        {summary && <p className="jr-summary">{summary}</p>}
        {roads.length > 0 && (
          <div className="jr-stats">
            <div><b>{placeAgg.size}</b><span>{word(placeAgg.size, t.placesN)}</span></div>
            <div><b>{placeCountries.size}</b><span>{word(placeCountries.size, t.countries)}</span></div>
            {first?.year && <div><b>{first.year}</b><span>{t.since}</span></div>}
          </div>
        )}
      </div>

      {roads.length === 0 && <div className="empty">{t.noPlaces}</div>}

      {placeList.length > 0 && (
        <section className="stack" style={{ gap: 8 }}>
          <h2 className="section-title">{t.places}</h2>
          <p className="muted small">{t.placesSub}</p>
          {placeList.length > 8 ? (
            <div className="jr-countries">
              {countryGroups.map((g) => (
                <div key={g.name} className="jr-country">
                  <b>{g.name}</b>
                  <span>{g.places.join(" · ")}</span>
                </div>
              ))}
            </div>
          ) : (
          <div className="jr-places-wrap">
            <ol className="jr-places" style={{ gridTemplateColumns: `repeat(${placeList.length}, minmax(120px, 1fr))` }}>
              {placeList.map((pl, i) => (
                <li key={pl.name + i}>
                  <span className="jr-pin" aria-hidden="true" />
                  <b>{pl.name}</b>
                  <span className="jr-who">{[...pl.who.entries()].map(([n, y]) => (y ? `${n} · ${y}` : n)).join(", ")}</span>
                </li>
              ))}
            </ol>
          </div>
          )}
        </section>
      )}

      {roads.length > 0 && (
        <section className="stack" style={{ gap: 8 }}>
          <h2 className="section-title">{t.roads}</h2>
          <p className="muted small">{t.roadsSub}</p>
          {olderGroups.length > 0 && (
            <details className="jr-all jr-older">
              <summary>{t.olderGens(olderGroups.length, olderFrom.length ? Math.min(...olderFrom) : null)}</summary>
              {olderGroups.map((grp) => (
          <div key={grp.label || "all"} className="jr-gen">
          {grp.label && <h3 className="jr-gen-title">{grp.label}</h3>}
          <ul className="jr-roads">
            {grp.list.map(({ person, stops }) => (
              <li key={person.id}>
                <Link href={`/app/family/${person.id}`} className="jr-person">
                  <PersonAvatar person={person} size={46} />
                  <span><b>{nm(person)}</b>{person.birthYear ? <small>{person.birthYear}{person.deathYear ? `–${person.deathYear}` : ""}</small> : null}</span>
                </Link>
                <div className="jr-stops">
                  {stops.map((st, i) => (
                    <span key={st.key + i} className="jr-step">
                      {i > 0 && <span className="jr-arrow" aria-hidden="true">→</span>}
                      <span className="jr-stop"><b>{st.name}</b>{st.year ? <span>{st.year}</span> : null}</span>
                    </span>
                  ))}
                  {stops.length === 1 && person.isLiving && (
                    <span className="jr-step"><span className="jr-arrow" aria-hidden="true">→</span><span className="jr-stop jr-unknown"><b>?</b><span>{t.later}</span></span></span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          </div>
          ))}
            </details>
          )}
          {(grouped ? shownGroups : [{ label: "", list: roads }]).map((grp) => (
          <div key={grp.label || "all"} className="jr-gen">
          {grp.label && <h3 className="jr-gen-title">{grp.label}</h3>}
          <ul className="jr-roads">
            {grp.list.map(({ person, stops }) => (
              <li key={person.id}>
                <Link href={`/app/family/${person.id}`} className="jr-person">
                  <PersonAvatar person={person} size={46} />
                  <span><b>{nm(person)}</b>{person.birthYear ? <small>{person.birthYear}{person.deathYear ? `–${person.deathYear}` : ""}</small> : null}</span>
                </Link>
                <div className="jr-stops">
                  {stops.map((st, i) => (
                    <span key={st.key + i} className="jr-step">
                      {i > 0 && <span className="jr-arrow" aria-hidden="true">→</span>}
                      <span className="jr-stop"><b>{st.name}</b>{st.year ? <span>{st.year}</span> : null}</span>
                    </span>
                  ))}
                  {stops.length === 1 && person.isLiving && (
                    <span className="jr-step"><span className="jr-arrow" aria-hidden="true">→</span><span className="jr-stop jr-unknown"><b>?</b><span>{t.later}</span></span></span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          </div>
          ))}
          {editable && <a href="#add" className="small" style={{ justifySelf: "start" }}>+ {t.addMove}</a>}
        </section>
      )}

      {gaps.length > 0 && (
        <section className="jr-gaps">
          <h2>{t.gaps}</h2>
          <p className="small">{t.gapsSub}</p>
          <ul>
            {gaps.map((g) => (
              <li key={g.q}>
                <span><small>{g.name}</small><q>{g.q}</q></span>
                <Link className="btn btn-primary btn-sm" href={`/app/ask?${g.personId ? `to=${g.personId}&` : ""}q=${encodeURIComponent(g.q)}`}>{g.personId ? t.ask : t.askFamily}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mapPlaces.length > 0 && (
        <section className="stack" id="map">
          <h2 className="section-title">{t.onMap}</h2>
          <FamilyMap places={mapPlaces} paths={mapPaths} label={t.label} />
          {missing.size > 0 && <p className="small muted">{t.notOnMap([...missing].join(", "))}</p>}
        </section>
      )}

      {events.length > 0 && (
        <details className="jr-all">
          <summary>{t.allEvents(events.length)}</summary>
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
                        {editable && (
                          <EventEdit e={e} lang={lang} back="/app/journey"
                            l={{ edit: common[lang].btn.edit, save: common[lang].btn.save, year: familyT[lang].person.year, what: familyT[lang].person.whatHappened, place: familyT[lang].person.place, country: t.country, whatShown: familyT[lang].person.birthAuto, speak: familyT[lang].person.speak, listening: familyT[lang].person.listening }} />
                        )}
                        {e.person ? (
                          <Link href={`/app/family/${e.person.id}`} className="route-person ct-who">
                            <PersonAvatar person={e.person} size={24} /> {nm(e.person)}
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
        </details>
      )}

      {editable && (
        <form id="add" action={addEvent} className="card stack" style={{ maxWidth: 760 }}>
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
          <div className="field ev-what">
            <div className="voice-label"><label htmlFor="description">{t.whatHappened}</label><VoiceFill lang={lang} labels={{ speak: t.speak, listening: t.listening }} /></div>
            <textarea id="description" name="description" required rows={3} placeholder={t.phWhat} />
          </div>
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
