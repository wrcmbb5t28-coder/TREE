"use client";

import { useState } from "react";
import type { BatchFix, BatchResult } from "@/app/app/proofread/actions";

type L = { start: string; progress: string; done: string; none: string; undo: string; undone: string; fields: Record<string, string> };
const fill = (t: string, ...v: (string | number)[]) => v.reduce<string>((s, x) => s.replace("#", String(x)), t);

/** Goes through all the family's texts a few at a time, showing progress and every correction with its own undo. */
export default function ProofreadAll({ labels, run, undo }: { labels: L; run: (offset: number) => Promise<BatchResult>; undo: (id: string) => Promise<void> }) {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [pos, setPos] = useState({ next: 0, total: 0 });
  const [fixes, setFixes] = useState<BatchFix[]>([]);
  const [undone, setUndone] = useState<Set<string>>(new Set());

  async function go() {
    setState("running");
    let offset = 0;
    for (let guard = 0; guard < 500; guard++) {
      let r: BatchResult;
      try { r = await run(offset); } catch { await new Promise((ok) => setTimeout(ok, 1500)); continue; }
      setPos({ next: r.next, total: r.total });
      if (r.fixes.length) setFixes((f) => [...f, ...r.fixes]);
      if (r.done) break;
      offset = r.next;
    }
    setState("done");
  }

  return (
    <div className="stack" style={{ gap: 14 }}>
      {state === "idle" && <button className="btn btn-primary" onClick={go} style={{ alignSelf: "flex-start" }}>{labels.start}</button>}
      {state !== "idle" && (
        <div className="stack" style={{ gap: 6 }}>
          <div className="small">{state === "done" ? (fixes.length ? fill(labels.done, fixes.length) : labels.none) : fill(labels.progress, pos.next, pos.total || "…")}</div>
          <div style={{ height: 8, background: "var(--tint)", borderRadius: 6 }}>
            <div style={{ height: 8, width: `${pos.total ? (pos.next / pos.total) * 100 : 4}%`, background: "var(--accent)", borderRadius: 6, transition: "width .3s" }} />
          </div>
        </div>
      )}
      {fixes.map((f) => (
        <div key={f.undo} className="card pr-fix">
          <div className="row between" style={{ gap: 10 }}>
            <b>{f.label}</b>
            {undone.has(f.undo)
              ? <span className="small muted">{labels.undone}</span>
              : <button className="btn btn-ghost btn-sm" onClick={async () => { await undo(f.undo); setUndone((u) => new Set(u).add(f.undo)); }}>{labels.undo}</button>}
          </div>
          <div className="small fix-notice" style={{ background: "none", boxShadow: "none", padding: 0 }}>
            {f.items.map((it, i) => (
              <span key={i} className="fix-item">
                {i > 0 && "; "}{it.from && <s>{it.from}</s>} → <ins>{it.to || "—"}</ins>{labels.fields[it.field] && <small> ({labels.fields[it.field]})</small>}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
