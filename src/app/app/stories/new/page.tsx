import { writeMemory } from "../../actions";
import { db } from "@/lib/db";
import { appContext } from "@/i18n/app";
import { common, chapterName } from "@/i18n/app/common";
import { storiesT } from "@/i18n/app/stories";

const CHAPTERS = ["Origins", "Childhood", "Love", "Work", "Leaving home", "Hard years", "Family life", "Traditions", "Advice", "The next generation"];

export default async function NewMemory({ searchParams }: { searchParams: Promise<{ person?: string }> }) {
  const { person } = await searchParams;
  const { family, lang } = await appContext();
  const t = storiesT[lang].newMemory;
  const c = common[lang];
  const people = await db.person.findMany({ where: { familyId: family.id }, orderBy: [{ generation: "asc" }, { firstName: "asc" }] });
  return (
    <form action={writeMemory} className="stack" style={{ maxWidth: 760 }}>
      <div className="page-head"><h1>{t.title}</h1></div>
      <div className="field"><label htmlFor="title">{t.titleLabel}</label><input id="title" name="title" placeholder={t.titlePh} /></div>
      <div className="field"><label htmlFor="body">{t.body}</label><textarea id="body" name="body" required minLength={10} placeholder={t.bodyPh} style={{ minHeight: 260 }} /></div>
      <div className="field">
        <label htmlFor="personId">{t.whose}</label>
        <select id="personId" name="personId" defaultValue={people.some((x) => x.id === person) ? person : ""}>
          <option value="">{t.nobody}</option>
          {people.map((x) => <option key={x.id} value={x.id}>{[x.firstName, x.lastName].filter(Boolean).join(" ")}{x.isSelf ? ` (${c.you})` : ""}</option>)}
        </select>
      </div>
      <div className="grid2">
        <div className="field">
          <label htmlFor="chapter">{t.chapter}</label>
          <select id="chapter" name="chapter" defaultValue="Family life">{CHAPTERS.map((ch) => <option key={ch} value={ch}>{chapterName(lang, ch)}</option>)}</select>
        </div>
        <label className="check" style={{ alignSelf: "end", minHeight: 48, alignItems: "center" }}><input type="checkbox" name="private" /> <span>{t.private}</span></label>
      </div>
      <div><button className="btn btn-primary" type="submit">{t.save}</button></div>
    </form>
  );
}
