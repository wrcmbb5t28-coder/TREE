import QRCode from "qrcode";
import { db } from "@/lib/db";
import { appContext, plural } from "@/i18n/app";
import { chapterName } from "@/i18n/app/common";
import { more } from "@/i18n/app/more";
import { appUrl } from "@/lib/util";
import { track } from "@/lib/analytics";
import TreeView from "@/components/TreeView";
import PrintButton from "@/components/PrintButton";
import { StoryPhoto } from "@/components/StoryArt";

const ORDER = ["Origins", "Childhood", "Love", "Work", "Leaving home", "Hard years", "Family life", "Traditions", "Advice", "The next generation"];

/**
 * The digital Family Book: print-ready (A4/Letter) HTML.
 * "Save as PDF" in the browser produces the PDF; the same layout is the base for the printed hardcover.
 */
export default async function Book() {
  const { user, family, lang } = await appContext();
  const t = more[lang].book;
  const stories = await db.story.findMany({
    where: { familyId: family.id, visibility: { not: "private" } },
    include: { answer: { include: { question: { include: { storyteller: true } } } }, photos: true, person: true },
    orderBy: { createdAt: "asc" },
  });
  const people = await db.person.findMany({ where: { familyId: family.id, hidden: false } });
  const ids = people.map((p) => p.id);
  const links = await db.relationship.findMany({ where: { parentId: { in: ids }, childId: { in: ids } } });
  await track("book_preview_opened", { familyId: family.id, userId: user.id, props: { stories: stories.length } });

  const chapters = new Map<string, typeof stories>();
  for (const s of stories) {
    const c = s.chapter && ORDER.includes(s.chapter) ? s.chapter : "Family life";
    if (!chapters.has(c)) chapters.set(c, []);
    chapters.get(c)!.push(s);
  }
  const sorted = ORDER.filter((c) => chapters.has(c));
  // Inside a chapter, oldest first: the story of a person born in 1760 comes before one born in 1980.
  const born = (s: (typeof stories)[number]) => s.person?.birthYear ?? s.answer?.question.storyteller.birthYear ?? 9999;
  for (const list of chapters.values()) list.sort((a, b) => born(a) - born(b));
  const qr = new Map<string, string>();
  for (const s of stories) {
    if (s.answer?.audioPath) qr.set(s.id, await QRCode.toDataURL(appUrl(`/app/stories/${s.id}`), { margin: 0, width: 96 }));
  }
  const years = people.map((p) => p.birthYear).filter((y): y is number => !!y);
  const span = years.length ? `${Math.min(...years)} – ${new Date().getFullYear()}` : String(new Date().getFullYear());

  return (
    <div className="book-page" style={{ borderRadius: 12 }}>
      <div className="no-print row between" style={{ padding: 16 }}>
        <span className="small muted">{plural(lang, stories.length, t.stories)} · {plural(lang, sorted.length, t.chapters)}</span>
        <PrintButton label={t.print} />
      </div>
      <div className="book-sheet">
        <section style={{ minHeight: "60vh", display: "grid", alignContent: "center", gap: 16 }}>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{family.name}</h1>
          <p style={{ fontSize: "1.2rem", color: "#58645F" }}>{span}</p>
        </section>

        <section className="book-chapter">
          <h2>{t.ourFamily}</h2>
          <TreeView people={people} links={links} />
        </section>

        {sorted.map((c) => (
          <section key={c} className="book-chapter">
            <h2>{chapterName(lang, c)}</h2>
            {chapters.get(c)!.map((s, i) => {
              const who = s.person ?? s.answer?.question.storyteller ?? null;
              return (
              <div key={s.id} className="book-story">
                {s.photos.length === 0 && (
                  <div className={`book-art ${i % 2 ? "right" : "left"}`}><StoryPhoto seed={s.id} text={`${s.title} ${s.body}`} tilt={i % 2 ? 1.5 : -1.5} idSuffix="b" /></div>
                )}
                <h3>{s.title}</h3>
                {who && <p className="book-who">{[who.firstName, who.lastName].filter(Boolean).join(" ")}{who.birthYear ? ` · ${who.birthYear}${who.deathYear ? `–${who.deathYear}` : ""}` : ""}</p>}
                <p>{s.body}</p>
                {s.photos.slice(0, 2).map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={`/api/files/${p.path}`} alt={p.caption ?? ""} style={{ maxHeight: 260, marginTop: 12, borderRadius: 4 }} />
                ))}
                {qr.has(s.id) && (
                  <div className="row book-qr">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qr.get(s.id)} alt="" width={64} height={64} />
                    <span>{t.scan(s.answer!.question.storyteller.firstName)}</span>
                  </div>
                )}
              </div>
              );
            })}
          </section>
        ))}
        {stories.length === 0 && <p className="muted">{t.empty}</p>}
      </div>
    </div>
  );
}
