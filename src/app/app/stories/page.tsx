import Link from "next/link";
import { db } from "@/lib/db";
import { requireFamily } from "@/lib/auth";

export default async function Stories() {
  const { user, family, role } = await requireFamily();
  const stories = await db.story.findMany({
    where: role === "owner" ? { familyId: family.id } : { familyId: family.id, OR: [{ visibility: { not: "private" } }, { authorId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: { answer: { include: { question: { include: { storyteller: true } } } }, facts: { where: { status: "suggested" } }, photos: true },
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
        <div><p className="eyebrow">{stories.length} stories</p><h1>Stories</h1></div>
        <div className="row">
          <Link className="btn btn-ghost" href="/app/stories/new">Write a memory</Link>
          <Link className="btn btn-primary" href="/app/ask">Ask a question</Link>
        </div>
      </div>
      {stories.length === 0 && <div className="empty">Stories appear here when someone answers a question or writes a memory.</div>}
      {[...byChapter.entries()].map(([chapter, list]) => (
        <section key={chapter} className="stack">
          <h2 style={{ fontSize: "1.4rem" }}>{chapter}</h2>
          <div className="grid-cards">
            {list.map((s) => (
              <Link key={s.id} href={`/app/stories/${s.id}`} className="card feed-item" style={{ textDecoration: "none" }}>
                <span className="small muted">
                  {s.answer ? s.answer.question.storyteller.firstName : "Written memory"} · {s.createdAt.toLocaleDateString("en-GB")}
                  {s.visibility === "private" ? " · private" : s.visibility === "public" ? " · on family page" : ""}
                </span>
                <h3>{s.title}</h3>
                <p className="small muted">{s.body.slice(0, 140)}{s.body.length > 140 ? "…" : ""}</p>
                <div className="row small">
                  {s.answer?.audioPath && <span className="tag">voice</span>}
                  {s.photos.length > 0 && <span className="tag">{s.photos.length} photos</span>}
                  {s.facts.length > 0 && <span className="tag">{s.facts.length} facts to confirm</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
