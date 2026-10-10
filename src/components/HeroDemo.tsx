"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/i18n";

const N = 56;
const TOTAL = 84; // seconds in the sample

function bars(): number[] {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: N }, (_, i) => Math.min(100, 18 + Math.round((Math.sin(i / 3.2) * 0.5 + 0.5) * 40 * rnd() + 20 * rnd())));
}
const HEIGHTS = bars();

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/** The example story card in the hero: a sample voice answer with transcript and suggested facts. */
export default function HeroDemo({ d }: { d: Dict["demo"] }) {
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [orig, setOrig] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= N) { setPlaying(false); return N; }
        return p + 1;
      });
    }, 90);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing]);

  const toggle = () => {
    if (!playing && pos >= N) setPos(0);
    setPlaying(!playing);
  };

  return (
    <div className="card-elev story" id="example" aria-label={d.who}>
      <div className="story-head">
        <div className="photo" aria-hidden="true">
          <svg viewBox="0 0 80 100"><rect width="80" height="100" fill="#d9c3a0" /><rect y="62" width="80" height="38" fill="#b89a72" /><circle cx="29" cy="40" r="9" fill="#7b5f42" /><rect x="20" y="49" width="18" height="30" rx="7" fill="#6a513a" /><circle cx="52" cy="38" r="9.5" fill="#5e4733" /><rect x="42" y="47" width="20" height="33" rx="7" fill="#4f3c2b" /><circle cx="66" cy="16" r="6" fill="#efe1c6" /></svg>
        </div>
        <div className="who"><strong>{d.who}</strong>{d.meta}</div>
      </div>
      <p className="q">{d.question}</p>
      <div className="player">
        <button className="play" onClick={toggle} aria-label={d.play}>
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor" /></svg>
          )}
        </button>
        <div className="wave" aria-hidden="true">
          {HEIGHTS.map((h, i) => <i key={i} className={i < pos ? "on" : ""} style={{ height: `${h}%` }} />)}
        </div>
        <span className="dur">{fmt((pos / N) * TOTAL)} / {fmt(TOTAL)}</span>
      </div>
      <div className="tabs" role="group">
        <button aria-pressed={!orig} onClick={() => setOrig(false)}>{d.translation}</button>
        <button aria-pressed={orig} onClick={() => setOrig(true)}>{d.original}</button>
      </div>
      <p style={{ minHeight: "6.2em" }}>{orig ? d.original_text : d.answer}</p>
      <div className="facts">
        <small>{d.found}</small>
        {d.people.map((n) => <span key={n} className="chip"><em>●</em> {n}</span>)}
        <span className="chip"><em>⌖</em> {d.place}</span>
        <span className="chip"><em>♡</em> {d.year}</span>
      </div>
      <span className="note-hand" aria-hidden="true">{d.note}</span>
    </div>
  );
}
