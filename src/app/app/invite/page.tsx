import { db } from "@/lib/db";
import { appContext, fmtDate, plural } from "@/i18n/app";
import { more, INVITE_RELATIONS } from "@/i18n/app/more";
import { appUrl } from "@/lib/util";
import ShareQuestion from "@/components/ShareQuestion";
import { storiesT } from "@/i18n/app/stories";
import { createInvite } from "../actions";

const RELATIONS = INVITE_RELATIONS;
type Rel = (typeof RELATIONS)[number];

export default async function Invite({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const sp = await searchParams;
  const { family, user, lang } = await appContext();
  const t = more[lang].invite;
  const [members, invites] = await Promise.all([
    db.membership.findMany({ where: { familyId: family.id }, include: { user: true }, orderBy: { createdAt: "asc" } }),
    db.invite.findMany({ where: { familyId: family.id, acceptedAt: null }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  const fresh = sp.new ? invites.find((i) => i.token === sp.new) : null;
  const inviter = user.name || null;
  const freshRel = fresh?.relation && (RELATIONS as readonly string[]).includes(fresh.relation) ? (fresh.relation as Rel) : null;

  return (
    <>
      <div className="page-head"><div><p className="eyebrow">{plural(lang, members.length, t.members)}</p><h1>{t.title}</h1></div></div>

      {fresh && (
        <div className="card stack" style={{ borderColor: "var(--accent)", borderWidth: 2 }}>
          <b>{freshRel ? t.readyFor(freshRel) : t.ready}</b>
          <p className="small muted">{t.canJoin(family.name, fresh.role === "viewer")}</p>
          <ShareQuestion url={appUrl(`/join/${fresh.token}`)} message={t.message(inviter)} familyId={family.id} labels={storiesT[lang].share} />
        </div>
      )}

      <form action={createInvite} className="card stack" style={{ maxWidth: 760 }}>
        <h2 style={{ fontSize: "1.3rem" }}>{t.formTitle}</h2>
        <div className="pick" role="group" aria-label={t.relationAria}>
          {RELATIONS.map((r, i) => (
            <label key={r}><input type="radio" name="relation" value={r} defaultChecked={i === 0} /><span>{t.relations[r]}</span></label>
          ))}
        </div>
        <div className="field" style={{ maxWidth: 320 }}>
          <label htmlFor="role">{t.theyCan}</label>
          <select id="role" name="role" defaultValue="editor">
            <option value="editor">{t.canEdit}</option>
            <option value="viewer">{t.canView}</option>
          </select>
        </div>
        <div><button className="btn btn-primary">{t.create}</button></div>
      </form>

      <section className="stack">
        <h2 style={{ fontSize: "1.3rem" }}>{t.membersTitle}</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead><tr><th>{t.colName}</th><th>{t.colRole}</th><th>{t.colJoined}</th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}><td>{m.user.name ?? m.user.email}</td><td>{t.roles[m.role] ?? m.role}</td><td>{fmtDate(m.createdAt, lang)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        {invites.length > 0 && <p className="small muted">{t.unused(invites.length)}</p>}
      </section>
    </>
  );
}
