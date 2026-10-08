import Link from "next/link";
import { requireFamily } from "@/lib/auth";
import { LANGS, LANG_NAME } from "@/i18n/config";
import { PLANS, isPaid } from "@/lib/plans";
import { updateSettings, updateProfile, deleteFamily, switchFamily } from "../actions";

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const { user, family, role, memberships } = await requireFamily();
  const owner = role === "owner";
  const plan = PLANS[family.plan as keyof typeof PLANS] ?? PLANS.free;

  return (
    <div className="stack" style={{ maxWidth: 760, gap: 24 }}>
      <div className="page-head"><h1>Settings</h1></div>
      {sp.saved && <div className="notice">Saved.</div>}

      <form action={updateProfile} className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>You</h2>
        <div className="grid2">
          <div className="field"><label htmlFor="pname">Your name</label><input id="pname" name="name" defaultValue={user.name ?? ""} /></div>
          <div className="field">
            <label htmlFor="plang">Your language</label>
            <select id="plang" name="lang" defaultValue={user.lang}>{LANGS.map((l) => <option key={l} value={l}>{LANG_NAME[l]}</option>)}</select>
          </div>
        </div>
        <p className="small muted">Signed in as {user.email}</p>
        <div><button className="btn btn-ghost">Save</button></div>
      </form>

      {owner && (
        <form action={updateSettings} className="card stack">
          <h2 style={{ fontSize: "1.3rem" }}>Family</h2>
          <div className="field"><label htmlFor="name">Family name</label><input id="name" name="name" defaultValue={family.name} /></div>
          <div className="field">
            <label htmlFor="lang">Stories are written in</label>
            <select id="lang" name="lang" defaultValue={family.lang}>{LANGS.map((l) => <option key={l} value={l}>{LANG_NAME[l]}</option>)}</select>
          </div>
          <div className="field">
            <label htmlFor="legacyContact">Legacy contact (email)</label>
            <input id="legacyContact" name="legacyContact" type="email" defaultValue={family.legacyContact ?? ""} placeholder="Who keeps the archive if you can’t?" />
          </div>
          <div><button className="btn btn-primary">Save family settings</button></div>
        </form>
      )}

      <section className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>Plan</h2>
        <p>{plan.name}{isPaid(family) && family.planExpiresAt ? ` · renews or ends ${family.planExpiresAt.toLocaleDateString("en-GB")}` : ""}</p>
        <div className="row">
          <Link className="btn btn-ghost" href="/app/billing">{isPaid(family) ? "Manage plan" : "See plans"}</Link>
        </div>
      </section>

      {memberships.length > 1 && (
        <section className="card stack">
          <h2 style={{ fontSize: "1.3rem" }}>Your families</h2>
          <div className="row">
            {memberships.map((m) => (
              <form key={m.familyId} action={switchFamily.bind(null, m.familyId)}>
                <button className={`btn btn-sm ${m.familyId === family.id ? "btn-primary" : "btn-ghost"}`}>{m.family.name}</button>
              </form>
            ))}
          </div>
        </section>
      )}

      <section className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>Your data</h2>
        <div className="row">
          <a className="btn btn-ghost" href="/api/export?format=json">Download everything</a>
          <a className="btn btn-ghost" href="/api/export?format=gedcom">Download tree (GEDCOM)</a>
        </div>
        <form method="post" action="/api/auth/logout"><button className="linkbtn">Sign out</button></form>
      </section>

      {owner && (
        <details className="card">
          <summary style={{ cursor: "pointer", color: "var(--danger)", fontWeight: 600 }}>Delete this family space</summary>
          <form action={deleteFamily} className="stack" style={{ marginTop: 12 }}>
            <p className="small">This permanently deletes every story, recording, photo and person in <b>{family.name}</b> for all members. Download your data first. Type the family name to confirm.</p>
            <div className="field"><label htmlFor="confirm">Family name</label><input id="confirm" name="confirm" autoComplete="off" /></div>
            <div><button className="btn btn-danger">Delete permanently</button></div>
          </form>
        </details>
      )}
    </div>
  );
}
