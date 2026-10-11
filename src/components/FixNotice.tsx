"use client";

import { useEffect, useState } from "react";

type Notice = { items: { field: string; from: string; to: string }[]; more: number; undo?: string };
type L = { fixed: string; undo: string; ok: string; more: string; fields: Record<string, string> };

/** After saving: what the proofreader changed, with a way back to the text as typed. */
export default function FixNotice({ labels, undo }: { labels: L; undo: (id: string) => Promise<void> }) {
  const [n, setN] = useState<Notice | null>(null);
  useEffect(() => {
    // the app's frame stays on screen after a save, so look for a new notice now and then (a cheap cookie read)
    const look = () => {
      const m = document.cookie.match(/(?:^|; )tn_fixed=([^;]*)/);
      if (!m) return;
      document.cookie = "tn_fixed=; path=/; max-age=0";
      try {
        const v = decodeURIComponent(m[1]);
        setN(JSON.parse(v.startsWith("{") ? v : decodeURIComponent(v)));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch { /* ignore */ }
    };
    look();
    const t = setInterval(look, 800);
    return () => clearInterval(t);
  }, []);
  if (!n || !n.items.length) return null;
  return (
    <div className="notice fix-notice" role="status">
      <b>✎ {labels.fixed}:</b>{" "}
      {n.items.map((it, i) => (
        <span key={i} className="fix-item">
          {i > 0 && "; "}
          {it.from ? <s>{it.from}</s> : null} → <ins>{it.to || "—"}</ins>
          {labels.fields[it.field] && <small> ({labels.fields[it.field]})</small>}
        </span>
      ))}
      {n.more > 0 && <span> {labels.more.replace("#", String(n.more))}</span>}
      <span className="fix-actions">
        {n.undo && <button className="btn btn-ghost btn-sm" onClick={async () => { await undo(n.undo!); setN(null); }}>{labels.undo}</button>}
        <button className="btn btn-ghost btn-sm" onClick={() => setN(null)}>{labels.ok}</button>
      </span>
    </div>
  );
}
