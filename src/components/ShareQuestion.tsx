"use client";

import { useState } from "react";

/** WhatsApp / copy-link buttons for a question that waits for an answer. */
export default function ShareQuestion({ url, message, familyId, together }: { url: string; message: string; familyId: string; together?: boolean }) {
  const [copied, setCopied] = useState(false);
  const text = `${message} ${url}`;
  const ping = (channel: string) =>
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "share_clicked", familyId, props: { object: "question", channel } }) }).catch(() => {});

  async function copy() {
    ping("link");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className="row">
      <a className="btn btn-primary btn-sm" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" onClick={() => ping("whatsapp")}>Send on WhatsApp</a>
      <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? "Copied" : "Copy link"}</button>
      {together && <a className="btn btn-ghost btn-sm" href={url} target="_blank" rel="noopener noreferrer" onClick={() => ping("together")}>Record together now</a>}
    </div>
  );
}
