"use client";

import { useState } from "react";

/** WhatsApp / copy-link buttons for a question that waits for an answer. */
export type ShareLabels = { whatsapp: string; copy: string; copied: string; together: string; copyPrompt: string };

const EN_LABELS: ShareLabels = { whatsapp: "Send on WhatsApp", copy: "Copy link", copied: "Copied", together: "Record together now", copyPrompt: "Copy this link" };

export default function ShareQuestion({ url, message, familyId, together, labels = EN_LABELS }: { url: string; message: string; familyId: string; together?: boolean; labels?: ShareLabels }) {
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
      window.prompt(labels.copyPrompt, url);
    }
  }

  return (
    <div className="row">
      <a className="btn btn-primary btn-sm" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" onClick={() => ping("whatsapp")}>{labels.whatsapp}</a>
      <button className="btn btn-ghost btn-sm" onClick={copy}>{copied ? labels.copied : labels.copy}</button>
      {together && <a className="btn btn-ghost btn-sm" href={url} target="_blank" rel="noopener noreferrer" onClick={() => ping("together")}>{labels.together}</a>}
    </div>
  );
}
