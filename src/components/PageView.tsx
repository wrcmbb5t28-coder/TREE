"use client";

import { useEffect } from "react";

/** Counts a visit once per browser session (no personal data: just the event and the language). */
export default function PageView({ name, lang }: { name: "landing_view" | "sample_book_opened"; lang: string }) {
  useEffect(() => {
    try {
      const k = `tn_pv_${name}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch { /* private mode: count anyway */ }
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, props: { lang } }), keepalive: true }).catch(() => {});
  }, [name, lang]);
  return null;
}
