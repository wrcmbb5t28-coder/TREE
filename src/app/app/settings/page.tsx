import Link from "next/link";
import { appContext, fmtDate } from "@/i18n/app";
import { common } from "@/i18n/app/common";
import { more } from "@/i18n/app/more";
import { LANGS, LANG_NAME } from "@/i18n/config";
import { isPaid } from "@/lib/plans";
import { updateSettings, updateProfile, deleteFamily, switchFamily } from "../actions";

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const { user, family, role, memberships, lang } = await appContext();
  const t = more[lang].settings;
  const c = common[lang];
  const owner = role === "owner";
  const planName = c.plans[family.plan as keyof typeof c.plans] ?? c.plans.free;

  return (
    <div className="stack" style={{ maxWidth: 760, gap: 24 }}>
      <div className="page-head"><h1>{t.title}</h1></div>
      {sp.saved && <div className="notice">{c.saved}</div>}

      <form action={updateProfile} className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>{t.you}</h2>
        <div className="grid2">
          <div className="field"><label htmlFor="pname">{t.yourName}</label><input id="pname" name="name" defaultValue={user.name ?? ""} /></div>
          <div className="field">
            <label htmlFor="plang">{t.uiLang}</label>
            <select id="plang" name="lang" defaultValue={lang}>{LANGS.map((l) => <option key={l} value={l}>{LANG_NAME[l]}</option>)}</select>
          </div>
        </div>
        <p className="small muted">{t.signedInAs(user.email)}</p>
        <div><button className="btn btn-ghost">{c.btn.save}</button></div>
      </form>

      {owner && (
        <form action={updateSettings} className="card stack">
          <h2 style={{ fontSize: "1.3rem" }}>{t.family}</h2>
          <div className="field"><label htmlFor="name">{t.familyName}</label><input id="name" name="name" defaultValue={family.name} /></div>
          <div className="field">
            <label htmlFor="lang">{t.storyLang}</label>
            <select id="lang" name="lang" defaultValue={family.lang}>{LANGS.map((l) => <option key={l} value={l}>{LANG_NAME[l]}</option>)}</select>
          </div>
          <div className="field">
            <label htmlFor="legacyContact">{t.legacyContact}</label>
            <input id="legacyContact" name="legacyContact" type="email" defaultValue={family.legacyContact ?? ""} placeholder={t.legacyPh} />
          </div>
          <div><button className="btn btn-primary">{t.saveFamily}</button></div>
        </form>
      )}

      <section className="card stack">
        <h2 style={{ fontSize: "1.3rem" }}>{t.plan}</h2>
        <p>{planName}{isPaid(family) && family.planExpiresAt ? t.renews(fmtDate(family.planExpiresAt, lang)) : ""}</p>
        <div className="row">
          <Link className="btn btn-ghost" href="/app/billing">{isPaid(family) ? t.managePlan : t.seePlans}</Link>
        </div>
      </section>

      {memberships.length > 1 && (
        <section className="card stack">
          <h2 style={{ fontSize: "1.3rem" }}>{t.families}</h2>
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
        <h2 style={{ fontSize: "1.3rem" }}>{t.data}</h2>
        <div className="row">
          <a className="btn btn-ghost" href="/api/export?format=json">{t.downloadAll}</a>
          <a className="btn btn-ghost" href="/api/export?format=gedcom">{t.downloadTree}</a>
        </div>
        <form method="post" action="/api/auth/logout"><button className="linkbtn">{t.signOut}</button></form>
      </section>

      {owner && (
        <details className="card">
          <summary style={{ cursor: "pointer", color: "var(--danger)", fontWeight: 600 }}>{t.deleteSummary}</summary>
          <form action={deleteFamily} className="stack" style={{ marginTop: 12 }}>
            <p className="small">{t.deleteBefore}<b>{family.name}</b>{t.deleteAfter}</p>
            <div className="field"><label htmlFor="confirm">{t.confirmLabel}</label><input id="confirm" name="confirm" autoComplete="off" /></div>
            <div><button className="btn btn-danger">{t.deleteBtn}</button></div>
          </form>
        </details>
      )}
    </div>
  );
}
