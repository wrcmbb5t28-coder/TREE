import { writeMemory } from "../../actions";
import { db } from "@/lib/db";
import { requireFamily } from "@/lib/auth";

const CHAPTERS = ["Origins", "Childhood", "Love", "Work", "Leaving home", "Hard years", "Family life", "Traditions", "Advice", "The next generation"];

export default async function NewMemory({ searchParams }: { searchParams: Promise<{ person?: string }> }) {
  const { person } = await searchParams;
  const { family } = await requireFamily();
  const people = await db.person.findMany({ where: { familyId: family.id }, orderBy: [{ generation: "asc" }, { firstName: "asc" }] });
  return (
    <form action={writeMemory} className="stack" style={{ maxWidth: 760 }}>
      <div className="page-head"><h1>Write a memory</h1></div>
      <div className="field"><label htmlFor="title">Title</label><input id="title" name="title" placeholder="Sunday lunches at Nonna's" /></div>
      <div className="field"><label htmlFor="body">Your memory</label><textarea id="body" name="body" required minLength={10} placeholder="What do you remember?" style={{ minHeight: 260 }} /></div>
      <div className="field">
        <label htmlFor="personId">Whose story is this?</label>
        <select id="personId" name="personId" defaultValue={people.some((x) => x.id === person) ? person : ""}>
          <option value="">Not about one person</option>
          {people.map((x) => <option key={x.id} value={x.id}>{[x.firstName, x.lastName].filter(Boolean).join(" ")}{x.isSelf ? " (you)" : ""}</option>)}
        </select>
      </div>
      <div className="grid2">
        <div className="field">
          <label htmlFor="chapter">Chapter</label>
          <select id="chapter" name="chapter" defaultValue="Family life">{CHAPTERS.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <label className="row small" style={{ alignSelf: "end", minHeight: 48 }}><input type="checkbox" name="private" /> Only visible to me</label>
      </div>
      <div><button className="btn btn-primary" type="submit">Save memory</button></div>
    </form>
  );
}
