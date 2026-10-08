import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Journey from "@/components/JourneyDemo";
import Emblem from "@/components/Emblem";
import { countryName, isLang } from "@/i18n/config";
import { getDict } from "@/i18n";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return db.family.findFirst({ where: { pageSlug: slug, pageEnabled: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = await load(slug);
  return { title: f ? `${f.name} | Treename` : "Treename", robots: { index: false, follow: false } };
}

/**
 * The shareable family page (viral loop): a private, unguessable link.
 * Shows only stories marked "public" and never details of living people.
 */
export default async function FamilyPage({ params }: Props) {
  const { slug } = await params;
  const family = await load(slug);
  if (!family) notFound();
  const lang = isLang(family.lang) ? family.lang : "en";
  const t = getDict(lang);

  const [stories, events, people] = await Promise.all([
    db.story.findMany({ where: { familyId: family.id, visibility: "public" }, include: { answer: { include: { question: { include: { storyteller: true } } } } }, orderBy: { createdAt: "asc" } }),
    db.lifeEvent.findMany({ where: { familyId: family.id, OR: [{ personId: null }, { person: { isLiving: false } }] } }),
    db.person.findMany({ where: { familyId: family.id }, select: { generation: true, birthPlace: true, isLiving: true } }),
  ]);
  const generations = new Set(people.map((p) => p.generation)).size;
  const countries = [...new Set(events.map((e) => e.country).filter(Boolean))] as string[];
  const stops = events.filter((e) => e.year && (e.place || e.country)).map((e) => ({ year: e.year!, place: e.place || countryName(e.country!, lang) }));

  return (
    <main className="narrow stack" style={{ paddingBlock: "40px 80px", gap: 32 }}>
      <header className="stack center" style={{ justifyItems: "center" }}>
        <Emblem seed={family.id} countries={countries} places={people.filter((p) => !p.isLiving).map((p) => p.birthPlace ?? "").filter(Boolean)} size={120} />
        <h1>{family.name}</h1>
        <p className="muted">{generations} generations · {countries.length} countries · {stories.length} stories</p>
      </header>

      {stops.length > 0 && <div className="tree-wrap"><Journey stops={stops} label={family.name} /></div>}

      {stories.map((s) => (
        <article key={s.id} id={s.id} className="card-elev stack">
          <p className="eyebrow">{s.chapter ?? "Story"}{s.answer ? ` · ${s.answer.question.storyteller.firstName}` : ""}</p>
          <h2 style={{ fontSize: "1.6rem" }}>{s.title}</h2>
          {s.answer?.audioPath && <audio controls preload="none" src={`/api/files/${s.answer.audioPath}?page=${family.pageSlug}`} />}
          <p className="story-body">{s.body}</p>
        </article>
      ))}
      {stories.length === 0 && <p className="empty">The family hasn’t shared any stories on this page yet.</p>}

      <section className="card stack center" style={{ justifyItems: "center" }}>
        <h2 style={{ fontSize: "1.6rem" }}>{t.final.title}</h2>
        <p className="muted">{t.final.body}</p>
        <Link className="btn btn-primary" href={`/${lang}/start`}>{t.final.cta}</Link>
        <p className="small muted">Made with Treename · {t.nav.tagline}</p>
      </section>
    </main>
  );
}
