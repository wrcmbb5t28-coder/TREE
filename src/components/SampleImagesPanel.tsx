"use client";

import { useState } from "react";

type LangRow = { lang: string; family: string; slots: { slot: string; title: string; has: boolean }[] };

/** Admin: make the photographs of the sample books, one picture per request (each takes 20–60 s). */
export default function SampleImagesPanel({ rows, hasKey }: { rows: LangRow[]; hasKey: boolean }) {
  const [state, setState] = useState(rows);
  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [v, setV] = useState(Date.now().toString(36));

  async function run(lang: string, all: boolean) {
    const row = state.find((r) => r.lang === lang)!;
    const todo = row.slots.filter((s) => all || !s.has);
    for (const s of todo) {
      setBusy(`${lang}/${s.slot}`);
      const res = await fetch("/api/admin/sample-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang, slot: s.slot }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setLog((l) => [`${lang}/${s.slot}: ${j.error ?? res.status}`, ...l]); break; }
      setState((st) => st.map((r) => (r.lang !== lang ? r : { ...r, slots: r.slots.map((x) => (x.slot === s.slot ? { ...x, has: true } : x)) })));
      setV(Date.now().toString(36));
      setLog((l) => [`${lang}/${s.slot}: ✓ ${s.title}`, ...l]);
    }
    setBusy(null);
  }

  return (
    <div className="stack" style={{ gap: 14 }}>
      {!hasKey && <p className="notice small">Add OPENAI_API_KEY in Vercel → Settings → Environment Variables, then redeploy. Until then the sample books show drawings.</p>}
      {state.map((r) => {
        const n = r.slots.filter((s) => s.has).length;
        return (
          <div key={r.lang} className="card stack" style={{ gap: 10 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <b>{r.lang.toUpperCase()} · {r.family} · {n}/{r.slots.length}</b>
              <div className="row">
                <a className="btn btn-ghost btn-sm" href={`/${r.lang}/book`} target="_blank" rel="noreferrer">Open book</a>
                <button className="btn btn-primary btn-sm" disabled={!hasKey || !!busy || n === r.slots.length} onClick={() => run(r.lang, false)}>Make missing</button>
                <button className="btn btn-ghost btn-sm" disabled={!hasKey || !!busy} onClick={() => run(r.lang, true)}>Remake all</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
              {r.slots.map((s) => (
                <figure key={s.slot} style={{ margin: 0, fontSize: ".75rem" }}>
                  {s.has
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={`/api/sample-image/${r.lang}/${s.slot}?v=${v}`} alt="" style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", borderRadius: 4 }} />
                    : <div style={{ width: "100%", aspectRatio: "3 / 2", borderRadius: 4, background: "var(--tint)", display: "grid", placeItems: "center" }}>{busy === `${r.lang}/${s.slot}` ? "…" : "—"}</div>}
                  <figcaption className="muted">{s.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        );
      })}
      {log.length > 0 && <pre className="small" style={{ whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto" }}>{log.join("\n")}</pre>}
    </div>
  );
}
