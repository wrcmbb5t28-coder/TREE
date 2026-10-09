import { db } from "@/lib/db";
import { canEdit } from "@/lib/auth";
import { appContext, plural } from "@/i18n/app";
import { common, eventText } from "@/i18n/app/common";
import { familyT } from "@/i18n/app/family";
import Journey from "@/components/JourneyDemo";
import { countryName, COUNTRY_CODES } from "@/i18n/config";
import { addEvent, deleteEvent } from "../actions";

export default async function JourneyPage() {
  const { family, role, lang } = await appContext();
  const t = familyT[lang].journey;
  const c = common[lang];
  const events = await db.lifeEvent.findMany({ where: { familyId: family.id }, include: { person: true }, orderBy: [{ year: "asc" }, { createdAt: "asc" }] });
  const people = await db.person.findMany({ where: { familyId: family.id }, orderBy: { generation: "asc" } });
  const dated = events.filter((e) => e.year && (e.place || e.country));
  const stops = dated.map((e) => ({ year: e.year!, place: e.place || countryName(e.country!, lang) }));
  const countries = [...new Set(events.map((e) => e.country).filter(Boolean))] as string[];
  const editable = canEdit(role);

  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">{plural(lang, countries.length, t.countries)} · {plural(lang, dated.length, t.moments)}</p><h1>{t.title}</h1></div>
      </div>

      {stops.length > 0 ? (
        <div className="tree-wrap"><Journey stops={stops} label={t.label} /></div>
      ) : (
        <div className="empty">{t.empty}</div>
      )}

      {countries.length > 0 && (
        <div className="row">{countries.map((c) => <span key={c} className="chip">{countryName(c, lang)}</span>)}</div>
      )}

      <section className="stack">
        <h2 style={{ fontSize: "1.4rem" }}>{t.timeline}</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead><tr><th>{t.colYear}</th><th>{t.colWhat}</th><th>{t.colWhere}</th><th>{t.colWho}</th><th></th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>{e.year ?? "—"}</td>
                  <td>{eventText(lang, e.description, e.person)}</td>
                  <td>{[e.place, e.country && countryName(e.country, lang)].filter(Boolean).join(", ")}</td>
                  <td>{e.person?.firstName ?? ""}</td>
                  <td>{editable && <form action={deleteEvent.bind(null, e.id)}><button className="linkbtn small">{c.btn.remove}</button></form>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editable && (
        <form action={addEvent} className="card stack" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: "1.3rem" }}>{t.addMoment}</h2>
          <div className="field"><label htmlFor="description">{t.whatHappened}</label><input id="description" name="description" required placeholder={t.phWhat} /></div>
          <div className="grid2">
            <div className="field"><label htmlFor="year">{t.year}</label><input id="year" name="year" inputMode="numeric" /></div>
            <div className="field"><label htmlFor="place">{t.town}</label><input id="place" name="place" /></div>
            <div className="field">
              <label htmlFor="country">{t.country}</label>
              <select id="country" name="country" defaultValue="">
                <option value="">—</option>
                {COUNTRY_CODES.map((c) => <option key={c} value={c}>{countryName(c, lang)}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="personId">{t.who}</label>
              <select id="personId" name="personId" defaultValue="">
                <option value="">{t.wholeFamily}</option>
                {people.map((p) => <option key={p.id} value={p.id}>{p.firstName}</option>)}
              </select>
            </div>
          </div>
          <div><button className="btn btn-primary">{c.btn.add}</button></div>
        </form>
      )}
    </>
  );
}
