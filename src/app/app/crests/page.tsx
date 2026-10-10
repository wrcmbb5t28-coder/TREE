import Link from "next/link";
import { canEdit } from "@/lib/auth";
import { appContext, plural } from "@/i18n/app";
import { crestsT } from "@/i18n/app/crests";
import { familyLines } from "@/lib/lines";
import CrestSvg from "@/components/CrestSvg";
import CrestEditor from "@/components/CrestEditor";
import PersonAvatar from "@/components/PersonAvatar";
import { saveCrest, resetCrest, generateCrest } from "../actions";
import { countryName } from "@/i18n/config";

export default async function CrestsPage({ searchParams }: { searchParams: Promise<{ line?: string }> }) {
  const { line } = await searchParams;
  const { family, role, lang } = await appContext();
  const t = crestsT[lang];
  const lines = await familyLines(family.id);
  const current = lines.find((l) => l.key === line) ?? lines[0];
  const { people: _p, lineOf: _l, ...editorT } = t;

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="stack" style={{ gap: 8 }}>
        <h1>{t.title}</h1>
        <p className="muted" style={{ maxWidth: "64ch" }}>{t.intro}</p>
      </div>

      {lines.length === 0 ? (
        <div className="empty">{t.empty} <Link href="/app/family">→</Link></div>
      ) : (
        <>
          <div className="crest-lines">
            {lines.map((l) => (
              <Link key={l.key} href={`/app/crests?line=${encodeURIComponent(l.key)}#editor`} className={`crest-card${l.key === current.key ? " is-on" : ""}`}>
                <CrestSvg c={l.config} size={92} title={l.name} idSuffix={`l-${l.key}`} />
                <b>{l.name}</b>
                <span className="small muted">{plural(lang, l.people.length, t.people)}{l.saved ? "" : ` · ${t.draft}`}</span>
              </Link>
            ))}
          </div>

          <section id="editor" className="card stack" style={{ gap: 18 }}>
            <div className="row between">
              <h2 className="section-title" style={{ margin: 0 }}>{t.lineOf(current.name)}</h2>
              <div className="row" style={{ gap: 6 }}>
                {current.people.map((p) => (
                  <Link key={p.id} href={`/app/family/${p.id}`} className="route-person" title={[p.firstName, p.lastName].filter(Boolean).join(" ")}>
                    <PersonAvatar person={p} size={26} />
                  </Link>
                ))}
              </div>
            </div>
            <CrestEditor
              key={current.key}
              lineKey={current.key}
              name={current.name}
              initial={current.config}
              draft={current.draft}
              suggestions={current.suggestions.map((sg) => ({ ...sg, reason: /^[A-Z]{2}$/.test(sg.reason) ? countryName(sg.reason, lang) : sg.reason }))}
              t={editorT}
              save={saveCrest}
              reset={resetCrest}
              generate={generateCrest}
              canEdit={canEdit(role)}
            />
          </section>
        </>
      )}
    </div>
  );
}
