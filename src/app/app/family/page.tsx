import CountrySelect from "@/components/CountrySelect";
import { countryName } from "@/i18n/config";
import Link from "next/link";
import { db } from "@/lib/db";
import { canEdit } from "@/lib/auth";
import { appContext, plural } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { familyT } from "@/i18n/app/family";
import TreeView from "@/components/TreeView";
import CrestSvg from "@/components/CrestSvg";
import { familyLines } from "@/lib/lines";
import { crestsT } from "@/i18n/app/crests";
import { addPerson } from "../actions";
import { RELATIONS } from "@/i18n/questions";

export default async function Family() {
  const { family, role, lang } = await appContext();
  const t = familyT[lang].tree;
  const c = common[lang];
  const editable = canEdit(role);
  const people = await db.person.findMany({
    where: { familyId: family.id, ...(editable ? {} : { hidden: false }) },
    orderBy: [{ generation: "asc" }, { createdAt: "asc" }],
  });
  const ids = people.map((p) => p.id);
  const links = await db.relationship.findMany({ where: { parentId: { in: ids }, childId: { in: ids } } });
  const lines = await familyLines(family.id).catch((e) => { console.error("[family] crests failed", e); return []; });

  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">{plural(lang, people.length, t.people)}</p><h1>{t.title}</h1></div>
        <a className="btn btn-primary" href="#add">{t.addPerson}</a>
      </div>
      {lines.length > 0 && (
        <div className="crests-row" aria-label={crestsT[lang].title}>
          {lines.map((l) => (
            <Link key={l.key} href={`/app/crests?line=${encodeURIComponent(l.key)}#editor`} title={crestsT[lang].lineOf(l.name)}>
              <CrestSvg c={{ ...l.config, motto: "" }} size={26} idSuffix={`row-${l.key}`} /> {l.name}
            </Link>
          ))}
        </div>
      )}
      <TreeView people={people} links={links} label={t.treeLabel} />
      <p className="small muted">{t.hint}</p>

      {editable && (
        <form id="add" action={addPerson} className="card stack" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: "1.4rem" }}>{t.addPerson}</h2>
          <div className="grid2">
            <div className="field"><label htmlFor="firstName">{t.firstName}</label><input id="firstName" name="firstName" required /></div>
            <div className="field"><label htmlFor="lastName">{t.lastName}</label><input id="lastName" name="lastName" /></div>
          </div>
          <div className="field">
            <label htmlFor="role">{t.whoToYou}</label>
            <select id="role" name="role" defaultValue="">
              <option value="">{t.notSet}</option>
              {RELATIONS.map((r) => <option key={r.id} value={r.id}>{c.relations[r.id]}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="relation">{t.whereInTree}</label>
            <select id="relation" name="relation" defaultValue="">
              <option value="">{t.notSure}</option>
              {people.map((p) => (
                <optgroup key={p.id} label={p.firstName}>
                  <option value={`parent-of:${p.id}`}>{t.parentOf(p.firstName)}</option>
                  <option value={`child-of:${p.id}`}>{t.childOf(p.firstName)}</option>
                  <option value={`partner-of:${p.id}`}>{t.partnerOf(p.firstName)}</option>
                </optgroup>
              ))}
            </select>
          </div>
          <div className="grid2">
            <div className="field"><label htmlFor="birthYear">{t.birthYear}</label><input id="birthYear" name="birthYear" inputMode="numeric" placeholder={t.egYear} /></div>
            <div className="field"><label htmlFor="birthPlace">{t.birthPlace}</label><input id="birthPlace" name="birthPlace" placeholder={t.egPlace} /></div>
            <div className="field"><label htmlFor="birthCountry">{familyT[lang].journey.country}</label><CountrySelect lang={lang} id="birthCountry" name="birthCountry" /></div>
          </div>
          <div className="grid2">
            <div className="field"><label htmlFor="deathYear">{t.deathYearIf}</label><input id="deathYear" name="deathYear" inputMode="numeric" /></div>
            <label className="row small" style={{ alignSelf: "end", minHeight: 48 }}><input type="checkbox" name="deceased" /> {t.passedAway}</label>
          </div>
          <div><button className="btn btn-primary">{t.addToTree}</button></div>
        </form>
      )}

      <section className="stack">
        <h2 style={{ fontSize: "1.4rem" }}>{t.everyone}</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead><tr><th>{t.colName}</th><th>{t.colBorn}</th><th></th></tr></thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/app/family/${p.id}`}>{[p.firstName, p.lastName].filter(Boolean).join(" ")}</Link>{p.isSelf ? ` (${c.you})` : ""}{p.hidden ? ` · ${t.hiddenBranch}` : ""}</td>
                  <td>{[p.birthYear, p.birthPlace, p.birthCountry && countryName(p.birthCountry, lang)].filter(Boolean).join(", ")}</td>
                  <td>{!p.isSelf && p.isLiving && <Link className="small" href={`/app/ask?to=${p.id}`}>{c.header.ask}</Link>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
