"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isLang, type Lang } from "@/i18n/config";
import { more } from "@/i18n/app/more";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const l = document.querySelector("[data-ui-lang]")?.getAttribute("data-ui-lang");
    if (isLang(l)) setLang(l);
  }, []);
  const t = more[lang].error;

  return (
    <div className="empty stack" style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: "1.5rem" }}>{t.title}</h2>
      <p>{error.message && !error.message.includes("digest") ? error.message : t.fallback}</p>
      {error.digest && <p className="small muted" style={{ margin: 0 }}>#{error.digest}</p>}
      <div className="row" style={{ justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={reset}>{t.retry}</button>
        <Link className="btn btn-ghost" href="/app">{t.home}</Link>
      </div>
    </div>
  );
}
