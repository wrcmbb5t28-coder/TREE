import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import Journey from "@/components/JourneyDemo";
import { countryName, isLang, COUNTRY_CODES } from "@/i18n/config";
import { addEvent, deleteEvent } from "../actions";

export default async function JourneyPage() {
  const { family, role } = await requireFamily();
  const events = await db.lifeEvent.findMany({ where: { familyId: family.id }, include: { person: true }, orderBy: [{ year: "asc" }, { createdAt: "asc" }] });
  const people = await db.person.findMany({ where: { familyId: family.id }, orderBy: { generation: "asc" } });
  const lang = isLang(family.lang) ? family.lang : "en";
  const dated = events.filter((e) => e.year && (e.place || e.country));
  const stops = dated.map((e) => ({ year: e.year!, place: e.place || countryName(e.country!, lang) }));
  const countries = [...new Set(events.map((e) => e.country).filter(Boolean))] as string[];
  const editable = canEdit(role);

  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">{countries.length} countries · {dated.length} dated moments</p><h1>Your family’s journey</h1></div>
      </div>

      {stops.length > 0 ? (
        <div className="tree-wrap"><Journey stops={stops} label="Family journey" /></div>
      ) : (
        <div className="empty">Add years and places to life events, or confirm facts from stories, and your family’s journey appears here.</div>
      )}

      {countries.length > 0 && (
        <div className="row">{countries.map((c) => <span key={c} className="chip">{countryName(c, lang)}</span>)}</div>
      )}

      <section className="stack">
        <h2 style={{ fontSize: "1.4rem" }}>Timeline</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead><tr><th>Year</th><th>What happened</th><th>Where</th><th>Who</th><th></th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>{e.year ?? "—"}</td>
                  <td>{e.description}</td>
                  <td>{[e.place, e.country && countryName(e.country, lang)].filter(Boolean).join(", ")}</td>
                  <td>{e.person?.firstName ?? ""}</td>
                  <td>{editable && <form action={deleteEvent.bind(null, e.id)}><button className="linkbtn small">Remove</button></form>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editable && (
        <form action={addEvent} className="card stack" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: "1.3rem" }}>Add a moment</h2>
          <div className="field"><label htmlFor="description">What happened</label><input id="description" name="description" required placeholder="Moved to Zürich for work" /></div>
          <div className="grid2">
            <div className="field"><label htmlFor="year">Year</label><input id="year" name="year" inputMode="numeric" /></div>
            <div className="field"><label htmlFor="place">Town or city</label><input id="place" name="place" /></div>
            <div className="field">
              <label htmlFor="country">Country</label>
              <select id="country" name="country" defaultValue="">
                <option value="">—</option>
                {COUNTRY_CODES.map((c) => <option key={c} value={c}>{countryName(c, lang)}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="personId">Who</label>
              <select id="personId" name="personId" defaultValue="">
                <option value="">The whole family</option>
                {people.map((p) => <option key={p.id} value={p.id}>{p.firstName}</option>)}
              </select>
            </div>
          </div>
          <div><button className="btn btn-primary">Add</button></div>
        </form>
      )}
    </>
  );
}
