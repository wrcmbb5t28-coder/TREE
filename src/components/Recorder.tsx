"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/i18n";
import { fill } from "@/i18n";

type Phase = "idle" | "recording" | "recorded" | "sending" | "done";

const MAX_SECONDS = 15 * 60;

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"]) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return "";
}

/** Voice recorder for storytellers, with a typed-answer fallback. */
export default function Recorder({ token, t, askerName }: { token: string; t: Dict["answer"]; askerName: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [showType, setShowType] = useState(false);
  const [error, setError] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const blob = useRef<Blob | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const stream = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    if (tick.current) clearInterval(tick.current);
    stream.current?.getTracks().forEach((tr) => tr.stop());
  }, []);

  async function start() {
    setError("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const mime = pickMime();
      const r = new MediaRecorder(s, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 32000 });
      chunks.current = [];
      r.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      r.onstop = () => {
        const b = new Blob(chunks.current, { type: r.mimeType || "audio/webm" });
        blob.current = b;
        setAudioUrl(URL.createObjectURL(b));
        setPhase("recorded");
        s.getTracks().forEach((tr) => tr.stop());
      };
      r.start(1000);
      rec.current = r;
      setSeconds(0);
      tick.current = setInterval(() => {
        setSeconds((x) => {
          // Keep each answer under the 4 MB upload limit: stop at 15 minutes.
          if (x + 1 >= MAX_SECONDS) stop();
          return x + 1;
        });
      }, 1000);
      setPhase("recording");
    } catch {
      setError(t.micError);
      setShowType(true);
    }
  }

  function stop() {
    if (tick.current) clearInterval(tick.current);
    if (rec.current?.state === "recording") rec.current.stop();
  }

  async function send() {
    if (!blob.current && typed.trim().length < 10) { setError(t.tooShort); return; }
    setPhase("sending");
    setError("");
    const fd = new FormData();
    fd.append("token", token);
    fd.append("text", typed);
    fd.append("durationS", String(seconds));
    if (blob.current) {
      const ext = (blob.current.type.split("/")[1] || "webm").split(";")[0];
      fd.append("audio", blob.current, `answer.${ext}`);
    }
    try {
      const res = await fetch("/api/answers", { method: "POST", body: fd });
      if (res.status === 409) { setError(t.answered); setPhase("done"); return; }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Treename: answer upload failed", res.status, body);
        throw new Error("send");
      }
      setPhase("done");
    } catch {
      setError(t.sendError);
      setPhase(blob.current ? "recorded" : "idle");
    }
  }

  if (phase === "done") {
    return (
      <div className="card-elev stack">
        <h2>{t.thanks} ♥</h2>
        <p className="big-text">{fill(t.thanksBody, { name: askerName })}</p>
      </div>
    );
  }

  const mmss = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="stack">
      {phase === "idle" && (
        <button className="rec" onClick={start}><span className="dot" />{t.record}</button>
      )}
      {phase === "recording" && (
        <button className="rec on" onClick={stop} aria-live="polite"><span className="dot" />{t.recording} {mmss} · {t.stop}</button>
      )}
      {(phase === "recorded" || phase === "sending") && audioUrl && (
        <div className="card stack">
          <audio controls src={audioUrl} />
          <div className="row between">
            <button className="btn btn-ghost" onClick={() => { setAudioUrl(null); blob.current = null; setPhase("idle"); }} disabled={phase === "sending"}>{t.again}</button>
            <button className="btn btn-primary" onClick={send} disabled={phase === "sending"}>{phase === "sending" ? t.sending : t.send}</button>
          </div>
        </div>
      )}

      {!showType && phase === "idle" && (
        <button className="linkbtn big-text" onClick={() => setShowType(true)}>{t.orType}</button>
      )}
      {showType && phase !== "recording" && (
        <div className="stack">
          <div className="field">
            <label htmlFor="typed">{t.orType}</label>
            <textarea id="typed" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={t.typePh} />
          </div>
          {!audioUrl && (
            <button className="btn btn-primary" onClick={send} disabled={phase === "sending"}>{phase === "sending" ? t.sending : t.send}</button>
          )}
        </div>
      )}
      {error && <p className="notice">{error}</p>}
    </div>
  );
}
