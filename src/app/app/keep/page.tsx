import Link from "next/link";
import { db } from "@/lib/db";
import { requireFamily, canEdit } from "@/lib/auth";
import { appUrl } from "@/lib/util";
import { isPaid } from "@/lib/plans";
import Emblem from "@/components/Emblem";
import { togglePage } from "../actions";

export default async function Keep() {
  const { family, role } = await requireFamily();
  const [stories, publicStories, countries, people] = await Promise.all([
    db.story.count({ where: { familyId: family.id, visibility: { not: "private" } } }),
    db.story.count({ where: { familyId: family.id, visibility: "public" } }),
    db.lifeEvent.findMany({ where: { familyId: family.id, country: { not: null } }, distinct: ["country"], select: { country: true } }),
    db.person.findMany({ where: { familyId: family.id }, select: { birthPlace: true } }),
  ]);
  const paid = isPaid(family);
  const places = [...new Set(people.map((p) => p.birthPlace).filter(Boolean))] as string[];

  return (
    <>
      <div className="page-head"><div><p className="eyebrow">Made to be passed on</p><h1>Keep</h1></div></div>
      <div className="cards3" style={{ marginTop: 0 }}>
        <article className="card stack">
          <div className="vis"><div className="book"><b style={{ fontWeight: 500 }}>{family.name}</b><small style={{ fontFamily: "var(--body)", fontSize: ".7rem" }}>{stories} stories</small></div></div>
          <h3>The Family Book</h3>
          <p className="muted small">All family stories by chapter, with the tree and a code to play each voice. Open it and save it as PDF from your browser.</p>
          <Link className="btn btn-primary" href="/app/book">Open the book</Link>
          <p className="small muted">Printed hardcover: {paid ? "included in your plan, ordering opens soon." : "part of the Legacy Gift."}</p>
        </article>

        <article className="card stack">
          <div className="vis"><div className="card" style={{ width: 180, padding: 12, fontSize: ".8rem" }}><b style={{ fontFamily: "var(--display)" }}>{family.name}</b><div className="muted">{publicStories} shared stories</div></div></div>
          <h3>The Family Page</h3>
          <p className="muted small">A private link for relatives who are not on Treename yet. It shows only stories you mark “Also on the family page”, never living people’s details.</p>
          {canEdit(role) && (
            <form action={togglePage}><button className={`btn ${family.pageEnabled ? "btn-ghost" : "btn-primary"}`}>{family.pageEnabled ? "Turn the page off" : "Turn the page on"}</button></form>
          )}
          {family.pageEnabled && <p className="small" style={{ wordBreak: "break-all" }}><a href={`/f/${family.pageSlug}`} target="_blank">{appUrl(`/f/${family.pageSlug}`)}</a></p>}
        </article>

        <article className="card stack">
          <div className="vis"><Emblem seed={family.id} countries={countries.map((c) => c.country!)} places={places} size={150} /></div>
          <h3>The Family Emblem</h3>
          <p className="muted small">Drawn from your family’s countries and places. The AI version with your own symbols is coming next.</p>
          <p className="small muted" style={{ fontStyle: "italic" }}>An artistic emblem inspired by your story, not a historical coat of arms.</p>
        </article>
      </div>

      <section className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>Take everything with you</h2>
        <p className="muted small">Your stories, transcripts, tree and timeline belong to your family. Download them any time.</p>
        <div className="row">
          <a className="btn btn-ghost" href="/api/export?format=json">Download everything (JSON)</a>
          <a className="btn btn-ghost" href="/api/export?format=gedcom">Download the tree (GEDCOM)</a>
        </div>
      </section>
    </>
  );
}
