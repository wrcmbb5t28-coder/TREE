import Link from "next/link";
import { db } from "@/lib/db";
import { appContext } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { storiesT } from "@/i18n/app/stories";
import { LANGS, LANG_NAME } from "@/i18n";
import { askQuestion } from "../actions";
import { questionsFor, relationById } from "@/i18n/questions";
import { isLang } from "@/i18n/config";
import StorytellerSelect from "@/components/StorytellerSelect";

export default async function Ask({ searchParams }: { searchParams: Promise<{ to?: string; q?: string }> }) {
  const { to, q: preset } = await searchParams;
  const { family, lang } = await appContext();
  const t = storiesT[lang].ask;
  const c = common[lang];
  const relLower = (s: string) => (lang === "de" ? s : s.toLowerCase());
  const people = await db.person.findMany({ where: { familyId: family.id, isSelf: false, isLiving: true }, orderBy: [{ generation: "asc" }, { createdAt: "asc" }] });
  const asked = new Set((await db.question.findMany({ where: { familyId: family.id }, select: { text: true } })).map((q) => q.text));

  const teller = people.find((p) => p.id === to) ?? people[0];
  const { topics, personal } = teller ? questionsFor(isLang(family.lang) ? family.lang : "en", teller) : { topics: [], personal: false };
  const rel = teller ? relationById(teller.relation) : undefined;

  if (people.length === 0) {
    return (
      <div className="empty stack">
        <p>{t.noPeople}</p>
        <p><Link className="btn btn-primary" href="/app/family#add">{t.addPerson}</Link></p>
      </div>
    );
  }

  return (
    <form action={askQuestion} className="stack" style={{ maxWidth: 760 }}>
      <div className="page-head"><h1>{t.title}</h1></div>

      <div className="field">
        <label htmlFor="storytellerId">{t.who}</label>
        <StorytellerSelect
          value={teller.id}
          people={people.map((p) => {
            const r = relationById(p.relation);
            return { id: p.id, label: [p.firstName, p.lastName].filter(Boolean).join(" ") + (r && r.id !== "other" ? ` · ${relLower(c.relations[r.id])}` : "") };
          })}
        />
        {personal ? (
          <p className="small muted">{rel ? t.pickedFor(rel.id, c.yourRelation[rel.id]) : null} <Link href={`/app/family/${teller.id}#edit`}>{t.change}</Link></p>
        ) : (
          <p className="small muted">
            {t.tipPre} <Link href={`/app/family/${teller.id}#edit`}>{t.tipLink(teller.firstName)}</Link> {t.tipPost}
          </p>
        )}
      </div>

      <fieldset className="card stack" style={{ border: "1px solid var(--line)" }}>
        <legend className="eyebrow" style={{ padding: "0 6px" }}>{t.pick}</legend>
        {topics.map(({ key, ...topic }, ti) => (
          <div key={key} className="stack" style={{ gap: 8 }}>
            <b>{topic.name}</b>
            <div className="pick">
              {topic.q.map((q) => (
                <label key={q} style={asked.has(q) ? { opacity: 0.55 } : undefined}>
                  <input type="radio" name="question" value={q} defaultChecked={ti === 0 && q === topic.q[0]} />
                  <span>{q}{asked.has(q) ? " ✓" : ""}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="field">
          <label htmlFor="custom">{t.custom}</label>
          <input id="custom" name="custom" placeholder={t.customPh} defaultValue={preset?.slice(0, 300)} />
        </div>
      </fieldset>

      <div className="grid2">
        <div className="field">
          <label htmlFor="lang">{t.answerLang}</label>
          <select id="lang" name="lang" defaultValue={family.lang}>
            {LANGS.map((l) => <option key={l} value={l}>{LANG_NAME[l]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="channel">{t.channel}</label>
          <select id="channel" name="channel" defaultValue="whatsapp">
            <option value="whatsapp">WhatsApp</option>
            <option value="link">{t.chLink}</option>
            <option value="together">{t.chTogether}</option>
          </select>
        </div>
      </div>
      <p className="small muted">{t.note(LANG_NAME[family.lang as keyof typeof LANG_NAME] ?? "English")}</p>
      <div><button className="btn btn-primary" type="submit">{t.submit}</button></div>
    </form>
  );
}
