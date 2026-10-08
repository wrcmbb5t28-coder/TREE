import { db } from "@/lib/db";
import { requireFamily } from "@/lib/auth";
import { appUrl } from "@/lib/util";
import ShareQuestion from "@/components/ShareQuestion";
import { createInvite } from "../actions";

const RELATIONS = ["Mother", "Father", "Grandmother", "Grandfather", "Sister", "Brother", "Cousin", "Aunt", "Uncle", "Daughter", "Son", "Partner"];

export default async function Invite({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const sp = await searchParams;
  const { family, user } = await requireFamily();
  const [members, invites] = await Promise.all([
    db.membership.findMany({ where: { familyId: family.id }, include: { user: true }, orderBy: { createdAt: "asc" } }),
    db.invite.findMany({ where: { familyId: family.id, acceptedAt: null }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  const fresh = sp.new ? invites.find((i) => i.token === sp.new) : null;
  const inviter = user.name || "I";

  return (
    <>
      <div className="page-head"><div><p className="eyebrow">{members.length} members</p><h1>Your family story is better together</h1></div></div>

      {fresh && (
        <div className="card stack" style={{ borderColor: "var(--accent)", borderWidth: 2 }}>
          <b>Invite link ready{fresh.relation ? ` for your ${fresh.relation.toLowerCase()}` : ""}</b>
          <p className="small muted">Anyone with this link can join {family.name} as {fresh.role === "viewer" ? "a viewer" : "an editor"}.</p>
          <ShareQuestion url={appUrl(`/join/${fresh.token}`)} message={`${inviter} started our family story on Treename. Join us and add what you remember:`} familyId={family.id} />
        </div>
      )}

      <form action={createInvite} className="card stack" style={{ maxWidth: 760 }}>
        <h2 style={{ fontSize: "1.3rem" }}>Invite someone</h2>
        <div className="pick" role="group" aria-label="Relation">
          {RELATIONS.map((r, i) => (
            <label key={r}><input type="radio" name="relation" value={r} defaultChecked={i === 0} /><span>{r}</span></label>
          ))}
        </div>
        <div className="field" style={{ maxWidth: 320 }}>
          <label htmlFor="role">They can</label>
          <select id="role" name="role" defaultValue="editor">
            <option value="editor">Add and edit stories, people and photos</option>
            <option value="viewer">Only read and listen</option>
          </select>
        </div>
        <div><button className="btn btn-primary">Create invite link</button></div>
      </form>

      <section className="stack">
        <h2 style={{ fontSize: "1.3rem" }}>Members</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead><tr><th>Name</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}><td>{m.user.name ?? m.user.email}</td><td>{m.role}</td><td>{m.createdAt.toLocaleDateString("en-GB")}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        {invites.length > 0 && <p className="small muted">{invites.length} invite link(s) not used yet.</p>}
      </section>
    </>
  );
}
