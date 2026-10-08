import Link from "next/link";
import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import TreeView from "@/components/TreeView";
import { addPerson } from "../actions";

export default async function Family() {
  const { family, role } = await requireFamily();
  const editable = canEdit(role);
  const people = await db.person.findMany({
    where: { familyId: family.id, ...(editable ? {} : { hidden: false }) },
    orderBy: [{ generation: "asc" }, { createdAt: "asc" }],
  });
  const ids = people.map((p) => p.id);
  const links = await db.relationship.findMany({ where: { parentId: { in: ids }, childId: { in: ids } } });

  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">{people.length} people</p><h1>Family tree</h1></div>
        <a className="btn btn-primary" href="#add">Add a person</a>
      </div>
      <TreeView people={people} links={links} />
      <p className="small muted">Tap a person to edit them or to ask them a question. Dashed boxes are relatives who have passed away.</p>

      {editable && (
        <form id="add" action={addPerson} className="card stack" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: "1.4rem" }}>Add a person</h2>
          <div className="grid2">
            <div className="field"><label htmlFor="firstName">First name</label><input id="firstName" name="firstName" required /></div>
            <div className="field"><label htmlFor="lastName">Last name</label><input id="lastName" name="lastName" /></div>
          </div>
          <div className="field">
            <label htmlFor="relation">How are they related?</label>
            <select id="relation" name="relation" defaultValue="">
              <option value="">Not sure yet</option>
              {people.map((p) => (
                <optgroup key={p.id} label={p.firstName}>
                  <option value={`parent-of:${p.id}`}>Parent of {p.firstName}</option>
                  <option value={`child-of:${p.id}`}>Child of {p.firstName}</option>
                  <option value={`partner-of:${p.id}`}>Partner of {p.firstName}</option>
                </optgroup>
              ))}
            </select>
          </div>
          <div className="grid2">
            <div className="field"><label htmlFor="birthYear">Year of birth</label><input id="birthYear" name="birthYear" inputMode="numeric" placeholder="e.g. 1934" /></div>
            <div className="field"><label htmlFor="birthPlace">Place of birth</label><input id="birthPlace" name="birthPlace" placeholder="e.g. Cosenza" /></div>
          </div>
          <div className="grid2">
            <div className="field"><label htmlFor="deathYear">Year of death (if passed away)</label><input id="deathYear" name="deathYear" inputMode="numeric" /></div>
            <label className="row small" style={{ alignSelf: "end", minHeight: 48 }}><input type="checkbox" name="deceased" /> Has passed away</label>
          </div>
          <div><button className="btn btn-primary">Add to the tree</button></div>
        </form>
      )}

      <section className="stack">
        <h2 style={{ fontSize: "1.4rem" }}>Everyone</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead><tr><th>Name</th><th>Born</th><th></th></tr></thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/app/family/${p.id}`}>{[p.firstName, p.lastName].filter(Boolean).join(" ")}</Link>{p.isSelf ? " (you)" : ""}{p.hidden ? " · hidden branch" : ""}</td>
                  <td>{[p.birthYear, p.birthPlace].filter(Boolean).join(", ")}</td>
                  <td>{!p.isSelf && p.isLiving && <Link className="small" href={`/app/ask?to=${p.id}`}>Ask a question</Link>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
