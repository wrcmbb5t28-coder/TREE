import Link from "next/link";
import { db } from "@/lib/db";
import { requireFamily } from "@/lib/auth";
import { getDict, LANGS, LANG_NAME } from "@/i18n";
import { askQuestion } from "../actions";

export default async function Ask({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
  const { to } = await searchParams;
  const { family } = await requireFamily();
  const people = await db.person.findMany({ where: { familyId: family.id, isSelf: false, isLiving: true }, orderBy: [{ generation: "asc" }, { createdAt: "asc" }] });
  const t = getDict(family.lang);
  const asked = new Set((await db.question.findMany({ where: { familyId: family.id }, select: { text: true } })).map((q) => q.text));

  if (people.length === 0) {
    return (
      <div className="empty stack">
        <p>Add the person you want to ask to your family tree first.</p>
        <p><Link className="btn btn-primary" href="/app/family#add">Add a person</Link></p>
      </div>
    );
  }

  return (
    <form action={askQuestion} className="stack" style={{ maxWidth: 760 }}>
      <div className="page-head"><h1>Ask a question</h1></div>

      <div className="field">
        <label htmlFor="storytellerId">Who do you want to ask?</label>
        <select id="storytellerId" name="storytellerId" defaultValue={to ?? people[0].id}>
          {people.map((p) => <option key={p.id} value={p.id}>{[p.firstName, p.lastName].filter(Boolean).join(" ")}</option>)}
        </select>
      </div>

      <fieldset className="card stack" style={{ border: "1px solid var(--line)" }}>
        <legend className="eyebrow" style={{ padding: "0 6px" }}>Pick a question</legend>
        {Object.entries(t.library).map(([key, topic]) => (
          <div key={key} className="stack" style={{ gap: 8 }}>
            <b>{topic.name}</b>
            <div className="pick">
              {topic.q.map((q) => (
                <label key={q} style={asked.has(q) ? { opacity: 0.55 } : undefined}>
                  <input type="radio" name="question" value={q} defaultChecked={q === t.library.childhood.q[0]} />
                  <span>{q}{asked.has(q) ? " ✓" : ""}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="field">
          <label htmlFor="custom">Or write your own question</label>
          <input id="custom" name="custom" placeholder="What do you remember about…" />
        </div>
      </fieldset>

      <div className="grid2">
        <div className="field">
          <label htmlFor="lang">Language of the answer page</label>
          <select id="lang" name="lang" defaultValue={family.lang}>
            {LANGS.map((l) => <option key={l} value={l}>{LANG_NAME[l]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="channel">How will you send it?</label>
          <select id="channel" name="channel" defaultValue="whatsapp">
            <option value="whatsapp">WhatsApp</option>
            <option value="link">Link (email, SMS…)</option>
            <option value="together">I’ll record it together with them</option>
          </select>
        </div>
      </div>
      <p className="small muted">The storyteller answers by voice on a simple page in their language. No app and no password. Your stories are written in {LANG_NAME[family.lang as keyof typeof LANG_NAME] ?? "English"} (change in Settings).</p>
      <div><button className="btn btn-primary" type="submit">Create the question</button></div>
    </form>
  );
}
