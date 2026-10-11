"use client";

import { useEffect, useRef, useState } from "react";

const LOCALE: Record<string, string> = { ru: "ru-RU", en: "en-GB", de: "de-CH", fr: "fr-CH", it: "it-CH", es: "es-ES" };

type Rec = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

/**
 * Microphone button for an event form: say "В 1995 году переехал в Москву" and it fills
 * "What happened", and the year when it is heard and the year field is still empty.
 * Uses the browser's own speech recognition (Chrome, Safari, Edge); hidden where there is none.
 */
export default function VoiceFill({ lang, labels, target, dictate = false }: {
  lang: string; labels: { speak: string; listening: string };
  /** field to fill (default: the event's "description") */
  target?: string;
  /** long text (a life story, a memory): keep listening until stopped and add each sentence */
  dictate?: boolean;
}) {
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
    if (dictate) {
      const el = form.querySelector<HTMLTextAreaElement | HTMLInputElement>(`[name="${target ?? "description"}"]`);
      let t = text.trim();
      if (!el || !t) return;
      const before = el.value.replace(/\s+$/, "");
      const startsSentence = !before || /[.!?…]$/.test(before);
      if (startsSentence) t = t.charAt(0).toUpperCase() + t.slice(1);
      if (!/[.!?…,;:]$/.test(t)) t += ".";
      el.value = before ? `${before} ${t}` : t;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.scrollTop = el.scrollHeight;
      return;
    }
    const set = (name: string, v: string, onlyEmpty = false) => {
      const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
      if (el && (!onlyEmpty || !el.value.trim())) el.value = v;
    };
    let what = text.trim();
    const year = what.match(/\b(1[5-9]\d\d|20\d\d)\b/);
    if (year) {
      set("year", year[1], true);
      // "в 1995 году," / "in 1995," at the start is said for the date, not the event
      what = what.replace(new RegExp(`^(в|во|in|im|en|nel|el)?\\s*${year[1]}\\s*(году|г\\.?|года)?[,\\s]*`, "i"), "");
    }
    if (what) {
      const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${target ?? "description"}"]`);
      const cap = what.charAt(0).toUpperCase() + what.slice(1);
      if (el) { el.value = el.value.trim() ? `${el.value.trim()} ${what}` : cap; el.focus(); }
    }
  }

  function toggle() {
    if (on) { rec.current?.stop(); return; }
    const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const R = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!R) return;
    const r = new R();
    r.lang = LOCALE[lang] ?? lang;
    r.interimResults = false;
    r.continuous = dictate;
    let done = 0; // in continuous mode results accumulate: add only the new ones
    r.onresult = (e) => {
      const all = Array.from(e.results);
      const t = all.slice(dictate ? done : 0).map((x) => x[0].transcript).join(" ");
      done = all.length;
      fill(t);
    };
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
