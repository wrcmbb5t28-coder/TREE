import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import { updatePerson, deletePerson } from "../../actions";

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { family, role } = await requireFamily();
  const p = await db.person.findFirst({
    where: { id, familyId: family.id },
    include: {
      parentLinks: { include: { parent: true } },
      childLinks: { include: { child: true } },
      questions: { include: { answers: { include: { story: true } } }, orderBy: { createdAt: "desc" } },
      events: { orderBy: { year: "asc" } },
    },
  });
  if (!p) notFound();
  const editable = canEdit(role);
  const stories = p.questions.flatMap((q) => q.answers.map((a) => a.story)).filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <div className="stack" style={{ maxWidth: 820, gap: 24 }}>
      <Link className="small muted" href="/app/family">← Family tree</Link>
      <div className="page-head">
        <div>
          <p className="eyebrow">{p.isLiving ? "Living" : `In memory${p.deathYear ? ` · ${p.deathYear}` : ""}`}</p>
          <h1>{[p.firstName, p.lastName].filter(Boolean).join(" ")}</h1>
          <p className="muted">{[p.birthYear && `Born ${p.birthYear}`, p.birthPlace].filter(Boolean).join(" · ")}</p>
        </div>
        {p.isLiving && !p.isSelf && <Link className="btn btn-primary" href={`/app/ask?to=${p.id}`}>Ask {p.firstName} a question</Link>}
      </div>

      <div className="row small">
        {p.parentLinks.map((l) => <Link key={l.id} className="chip" href={`/app/family/${l.parent.id}`}><em>parent</em> {l.parent.firstName}</Link>)}
        {p.childLinks.map((l) => <Link key={l.id} className="chip" href={`/app/family/${l.child.id}`}><em>child</em> {l.child.firstName}</Link>)}
      </div>

      <section className="stack">
        <h2 style={{ fontSize: "1.3rem" }}>Stories told by {p.firstName}</h2>
        {stories.length === 0 ? <p className="muted small">None yet.</p> : (
          <ul>{stories.map((s) => <li key={s.id}><Link href={`/app/stories/${s.id}`}>{s.title}</Link></li>)}</ul>
        )}
      </section>

      {p.events.length > 0 && (
        <section className="stack">
          <h2 style={{ fontSize: "1.3rem" }}>Life events</h2>
          <ul>{p.events.map((e) => <li key={e.id}>{e.year ?? "?"} · {e.description}{e.place ? `, ${e.place}` : ""}</li>)}</ul>
        </section>
      )}

      {editable && (
        <form action={updatePerson.bind(null, p.id)} className="card stack">
          <h2 style={{ fontSize: "1.3rem" }}>Edit</h2>
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
