import Link from "next/link";
import { db } from "@/lib/db";
import { canEdit } from "@/lib/auth";
import { appContext, plural } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { more } from "@/i18n/app/more";
import { appUrl } from "@/lib/util";
import { isPaid } from "@/lib/plans";
import Emblem from "@/components/Emblem";
import { togglePage } from "../actions";

export default async function Keep() {
  const { family, role, lang } = await appContext();
  const t = more[lang].keep;
  const c = common[lang];
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
      <div className="page-head"><div><p className="eyebrow">{t.eyebrow}</p><h1>{c.nav.keep}</h1></div></div>
      <div className="cards3" style={{ marginTop: 0 }}>
        <article className="card stack">
          <div className="vis"><div className="book"><b style={{ fontWeight: 500 }}>{family.name}</b><small style={{ fontFamily: "var(--body)", fontSize: ".7rem" }}>{plural(lang, stories, t.stories)}</small></div></div>
          <h3>{t.bookTitle}</h3>
          <p className="muted small">{t.bookText}</p>
          <Link className="btn btn-primary" href="/app/book">{t.openBook}</Link>
          <p className="small muted">{paid ? t.hardcoverPaid : t.hardcoverFree(c.plans.legacy)}</p>
        </article>

        <article className="card stack">
          <div className="vis"><div className="card" style={{ width: 180, padding: 12, fontSize: ".8rem" }}><b style={{ fontFamily: "var(--display)" }}>{family.name}</b><div className="muted">{plural(lang, publicStories, t.shared)}</div></div></div>
          <h3>{t.pageTitle}</h3>
          <p className="muted small">{t.pageText}</p>
          {canEdit(role) && (
            <form action={togglePage}><button className={`btn ${family.pageEnabled ? "btn-ghost" : "btn-primary"}`}>{family.pageEnabled ? t.pageOff : t.pageOn}</button></form>
          )}
          {family.pageEnabled && <p className="small" style={{ wordBreak: "break-all" }}><a href={`/f/${family.pageSlug}`} target="_blank">{appUrl(`/f/${family.pageSlug}`)}</a></p>}
        </article>

        <article className="card stack">
          <div className="vis"><Emblem seed={family.id} countries={countries.map((c) => c.country!)} places={places} size={150} /></div>
          <h3>{t.emblemTitle}</h3>
          <p className="muted small">{t.emblemText}</p>
          <p className="small muted" style={{ fontStyle: "italic" }}>{t.emblemNote}</p>
        </article>
      </div>

      <section className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>{t.exportTitle}</h2>
        <p className="muted small">{t.exportText}</p>
        <div className="row">
          <a className="btn btn-ghost" href="/api/export?format=json">{t.exportJson}</a>
          <a className="btn btn-ghost" href="/api/export?format=gedcom">{t.exportGedcom}</a>
        </div>
      </section>
    </>
  );
}
