import Link from "next/link";
import { StoryCover } from "@/components/StoryArt";
import { db } from "@/lib/db";
import { appContext, fmtDate, plural } from "@/i18n/app";
import { chapterName } from "@/i18n/app/common";
import { storiesT } from "@/i18n/app/stories";

export default async function Stories() {
  const { user, family, role, lang } = await appContext();
  const t = storiesT[lang].stories;
  const stories = await db.story.findMany({
    where: role === "owner" ? { familyId: family.id } : { familyId: family.id, OR: [{ visibility: { not: "private" } }, { authorId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: { answer: { include: { question: { include: { storyteller: true } } } }, facts: { where: { status: "suggested" } }, photos: { orderBy: { createdAt: "asc" } } },
  });
  const byChapter = new Map<string, typeof stories>();
  for (const s of stories) {
    const k = s.chapter || "Unsorted";
    if (!byChapter.has(k)) byChapter.set(k, []);
    byChapter.get(k)!.push(s);
  }

  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">{plural(lang, stories.length, t.count)}</p><h1>{t.title}</h1></div>
        <div className="row">
          <Link className="btn btn-ghost" href="/app/stories/new">{t.write}</Link>
          <Link className="btn btn-primary" href="/app/ask">{t.ask}</Link>
        </div>
      </div>
      {stories.length === 0 && <div className="empty">{t.empty}</div>}
      {[...byChapter.entries()].map(([chapter, list]) => (
        <section key={chapter} className="stack">
          <h2 style={{ fontSize: "1.4rem" }}>{chapterName(lang, chapter)}</h2>
          <div className="grid-cards">
            {list.map((s) => (
              <Link key={s.id} href={`/app/stories/${s.id}`} className="card feed-item" style={{ textDecoration: "none" }}>
                <div className="card-art" aria-hidden="true"><StoryCover seed={s.id} text={`${s.title} ${s.body}`} cover={s.cover} photos={s.photos} idSuffix="c" /></div>
                <span className="small muted">
                  {s.answer ? s.answer.question.storyteller.firstName : t.written} · {fmtDate(s.createdAt, lang)}
                  {s.visibility === "private" ? ` · ${t.private}` : s.visibility === "public" ? ` · ${t.public}` : ""}
                </span>
                <h3>{s.title}</h3>
                <p className="small muted">{s.body.slice(0, 140)}{s.body.length > 140 ? "…" : ""}</p>
                <div className="row small">
                  {s.answer?.audioPath && <span className="tag">{t.voiceTag}</span>}
                  {s.photos.length > 0 && <span className="tag">{plural(lang, s.photos.length, t.photos)}</span>}
                  {s.facts.length > 0 && <span className="tag">{plural(lang, s.facts.length, t.factsToConfirm)}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
