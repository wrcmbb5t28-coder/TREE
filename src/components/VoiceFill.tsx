"use client";

import { useEffect, useRef, useState } from "react";

const LOCALE: Record<string, string> = { ru: "ru-RU", en: "en-GB", de: "de-CH", fr: "fr-CH", it: "it-CH", es: "es-ES" };

type Rec = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

/**
 * Microphone button for an event form: say "В 1995 году переехал в Москву" and it fills
 * "What happened", and the year when it is heard and the year field is still empty.
 * Uses the browser's own speech recognition (Chrome, Safari, Edge); hidden where there is none.
 */
export default function VoiceFill({ lang, labels }: { lang: string; labels: { speak: string; listening: string } }) {
  const [ok, setOk] = useState(false);
  const [on, setOn] = useState(false);
  const rec = useRef<Rec | null>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    setOk(Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition));
  }, []);

  function fill(text: string) {
    const form = btn.current?.closest("form");
    if (!form) return;
    const set = (name: string, v: string, onlyEmpty = false) => {
      const el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (el && (!onlyEmpty || !el.value.trim())) el.value = v;
    };
    let what = text.trim();
    const year = what.match(/\b(1[5-9]\d\d|20\d\d)\b/);
    if (year) {
      set("year", year[1], true);
      // "в 1995 году," / "in 1995," at the start is said for the date, not the event
      what = what.replace(new RegExp(`^(в|во|in|im|en|nel|el)?\\s*${year[1]}\\s*(году|г\\.?|года)?[,\\s]*`, "i"), "");
    }
    if (what) set("description", what.charAt(0).toUpperCase() + what.slice(1));
  }

  function toggle() {
    if (on) { rec.current?.stop(); return; }
    const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const R = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!R) return;
    const r = new R();
    r.lang = LOCALE[lang] ?? lang;
    r.interimResults = false;
    r.continuous = false;
    r.onresult = (e) => { const t = Array.from(e.results).map((x) => x[0].transcript).join(" "); fill(t); };
    r.onend = () => setOn(false);
    r.onerror = () => setOn(false);
    rec.current = r;
    setOn(true);
    r.start();
  }

  if (!ok) return null;
  return (
    <button ref={btn} type="button" onClick={toggle} className={`btn btn-ghost btn-sm voice-btn${on ? " is-on" : ""}`} aria-pressed={on} title={labels.speak}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
      <span>{on ? labels.listening : labels.speak}</span>
    </button>
  );
}
