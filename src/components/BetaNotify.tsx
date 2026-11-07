"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/i18n/config";
import { BETA } from "@/i18n/beta";

/**
 * Beta box on the public pages: what "beta" means, plus a one-field form for a launch e-mail
 * or a free Founding Family reservation. The thank-you is read from ?joined= after the form post,
 * so the page itself can stay static.
 */
export default function BetaNotify({ lang, foundingPrice, next }: { lang: Lang; foundingPrice: string; next: string }) {
  const b = BETA[lang];
  const [joined, setJoined] = useState<string | null>(null);
  useEffect(() => {
    setJoined(new URLSearchParams(window.location.search).get("joined"));
  }, []);

  return (
    <div className="beta-box" id="notify">
      <div className="beta-head">
        <span className="beta-tag">{b.tag}</span>
        <h3>{b.homeTitle}</h3>
      </div>
      <p>{b.homeText}</p>
      <p className="beta-bonus">{b.bonus}</p>

      {joined && joined !== "bad" ? (
        <p className="beta-done" role="status">{joined === "founding" ? b.doneFounding : b.done}</p>
      ) : (
        <form method="post" action="/api/waitlist" className="beta-form">
          <p className="beta-sub"><b>{b.notifyTitle}</b> {b.notifyText}</p>
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="next" value={`${next}#notify`} />
          <input className="beta-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="beta-label" htmlFor="beta-email">{b.emailLabel}</label>
          <div className="beta-row">
            <input id="beta-email" name="email" type="email" required placeholder={b.emailPh} autoComplete="email" />
            <button className="beta-btn" name="plan" value="launch">{b.notifyBtn}</button>
            <button className="beta-btn beta-btn-alt" name="plan" value="founding">{b.reserveBtn}</button>
          </div>
          {joined === "bad" && <p className="beta-err" role="alert">{b.badEmail}</p>}
          <p className="beta-fine">{b.foundingNote(foundingPrice)} {b.reserveFine}</p>
        </form>
      )}
    </div>
  );
}
