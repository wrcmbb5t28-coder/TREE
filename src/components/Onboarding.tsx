"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dict, Lang } from "@/i18n";
import { fill } from "@/i18n";

type Keys = "mother" | "father" | "gm1" | "gf1" | "gm2" | "gf2";
type State = {
  name: string; born: string;
  mother: string; father: string; gm1: string; gf1: string; gm2: string; gf2: string;
  countries: string[];
  teller: Keys | "other" | ""; tellerName: string;
  question: string; channel: "whatsapp" | "link" | "together";
  email: string;
};

const PEOPLE: Keys[] = ["gm2", "gf2", "gm1", "gf1", "mother", "father"];
const STEPS = 8;

export default function Onboarding({
  lang, t, questions, countries, plan, gift,
}: {
  lang: Lang;
  t: Dict["onboarding"];
  questions: string[];
  countries: { code: string; name: string }[];
  plan?: string;
  gift?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ email: string; devLink?: string } | null>(null);
  const [s, setS] = useState<State>({
    name: "", born: "", mother: "", father: "", gm1: "", gf1: "", gm2: "", gf2: "",
    countries: [], teller: "", tellerName: "", question: questions[0], channel: "whatsapp", email: "",
  });
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "onboarding_started", props: { lang } }) }).catch(() => {});
  }, [lang]);

  const people = PEOPLE.filter((k) => s[k].trim());
  const stats = useMemo(() => {
    const p = 1 + people.length;
    const gens = 1 + (s.mother || s.father ? 1 : 0) + (s.gm1 || s.gf1 || s.gm2 || s.gf2 ? 1 : 0);
    return { p, gens, c: s.countries.length };
  }, [s, people.length]);

  const tellerName = s.teller && s.teller !== "other" ? s[s.teller] : s.tellerName;

  function go(n: number) {
    setError("");
    if (n > step) {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "onboarding_step_completed", props: { step: step + 1, lang } }) }).catch(() => {});
    }
    if (n === 6 && !s.teller) {
      const first = people[0];
      setS((p) => ({ ...p, teller: first ?? "other" }));
    }
    setStep(n);
  }

  async function submit() {
    if (!/^\S+@\S+\.\S+$/.test(s.email)) { setError(t.preview.error); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, tellerName, lang, plan, gift }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Error");
      setSent({ email: s.email, devLink: j.devLink });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  const field = (k: keyof State, label: string, ph = "") => (
    <div className="field">
      <label htmlFor={`ob-${k}`}>{label}</label>
      <input
        id={`ob-${k}`}
        value={s[k] as string}
        placeholder={ph}
        autoComplete="off"
        onChange={(e) => set(k, e.target.value as never)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); go(step + 1); } }}
      />
    </div>
  );

  const nav = (opts: { back?: boolean; next: string; skip?: boolean; onNext?: () => void; disabled?: boolean }) => (
    <div className="nav-row">
      {opts.back ? <button className="linkbtn" onClick={() => go(step - 1)}>{t.back}</button> : <span />}
      <div className="row">
        {opts.skip && <button className="linkbtn" onClick={() => go(step + 1)}>{t.skip}</button>}
        <button className="btn btn-primary" disabled={opts.disabled || busy} onClick={opts.onNext ?? (() => go(step + 1))}>{opts.next}</button>
      </div>
    </div>
  );

  let body: React.ReactNode = null;
  if (step === 0) {
    body = (<>
      <h2 id="ob-title">{t.name.t}</h2><p className="hint">{t.name.h}</p>
      {field("name", t.name.label, t.name.ph)}
      {nav({ next: t.next, disabled: !s.name.trim() })}
    </>);
  } else if (step === 1) {
    body = (<>
      <h2 id="ob-title">{fill(t.born.t, { name: s.name })}</h2><p className="hint">{t.born.h}</p>
      {field("born", t.born.label, t.born.ph)}
      {nav({ back: true, next: t.next, skip: true })}
    </>);
  } else if (step === 2) {
    body = (<>
      <h2 id="ob-title">{t.parents.t}</h2><p className="hint">{t.parents.h}</p>
      <div className="grid2">{field("mother", t.parents.mother)}{field("father", t.parents.father)}</div>
      {nav({ back: true, next: t.next, skip: true })}
    </>);
  } else if (step === 3) {
    body = (<>
      <h2 id="ob-title">{t.grand.t}</h2><p className="hint">{t.grand.h}</p>
      <div className="grid2">{field("gm1", t.grand.gm1)}{field("gf1", t.grand.gf1)}{field("gm2", t.grand.gm2)}{field("gf2", t.grand.gf2)}</div>
      {nav({ back: true, next: t.next, skip: true })}
    </>);
  } else if (step === 4) {
    body = (<>
      <h2 id="ob-title">{t.places.t}</h2><p className="hint">{t.places.h}</p>
      <div className="pick" role="group" aria-label={t.places.t}>
        {countries.map((c) => {
          const on = s.countries.includes(c.code);
          return <button key={c.code} aria-pressed={on} onClick={() => set("countries", on ? s.countries.filter((x) => x !== c.code) : [...s.countries, c.code])}>{c.name}</button>;
        })}
      </div>
      {nav({ back: true, next: t.places.cta })}
    </>);
  } else if (step === 5) {
    body = (<>
      <h2 id="ob-title">{t.result.t}</h2><p className="hint">{t.result.h}</p>
      <div className="stats">
        <div className="stat"><b>{stats.p}</b><span>{t.result.people}</span></div>
        <div className="stat"><b>{stats.gens}</b><span>{t.result.generations}</span></div>
        <div className="stat"><b>{stats.c}</b><span>{t.result.countries}</span></div>
      </div>
      <MiniTree s={s} />
      {nav({ back: true, next: t.result.cta })}
    </>);
  } else if (step === 6) {
    body = (<>
      <h2 id="ob-title">{t.teller.t}</h2><p className="hint">{t.teller.h}</p>
      <div className="stack">
        {people.length > 0 && (
          <div className="pick" role="group" aria-label={t.teller.who}>
            {people.map((k) => <button key={k} aria-pressed={s.teller === k} onClick={() => set("teller", k)}>{s[k]}</button>)}
            <button aria-pressed={s.teller === "other"} onClick={() => set("teller", "other")}>+</button>
          </div>
        )}
        {(s.teller === "other" || people.length === 0) && field("tellerName", t.teller.who, "")}
        <div className="opts" role="group">
          {questions.map((q) => <button key={q} aria-pressed={s.question === q} onClick={() => set("question", q)}>{q}</button>)}
        </div>
        <div className="pick" role="group">
          {(["whatsapp", "link", "together"] as const).map((c) => <button key={c} aria-pressed={s.channel === c} onClick={() => set("channel", c)}>{t.teller[c]}</button>)}
        </div>
      </div>
      {nav({ back: true, next: t.teller.cta, disabled: !tellerName.trim() })}
    </>);
  } else {
    body = sent ? (
      <>
        <h2 id="ob-title">✉️</h2>
        <p className="hint">{fill(t.preview.sent, { email: sent.email })}</p>
        {sent.devLink && (
          <div className="notice">
            <p className="small">{t.preview.devLink}</p>
            <a href={sent.devLink} style={{ wordBreak: "break-all" }}>{sent.devLink}</a>
          </div>
        )}
      </>
    ) : (
      <>
        <h2 id="ob-title">{fill(t.preview.t, { who: tellerName })}</h2>
        <p className="hint">{s.channel === "together" ? t.preview.hTogether : t.preview.hRemote}</p>
        <div className="msg">
          <small>{s.channel === "whatsapp" ? "WhatsApp" : s.channel === "link" ? t.teller.link : t.teller.together}</small>
          {fill(t.preview.message, { name: s.name, q: s.question })} <u>treename.ai/a/…</u>
        </div>
        <p className="hint" style={{ marginTop: 18 }}>{t.preview.save}</p>
        <div className="field">
          <label htmlFor="ob-email">{t.preview.email}</label>
          <input id="ob-email" type="email" autoComplete="email" placeholder={t.preview.emailPh} value={s.email}
            onChange={(e) => set("email", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
        </div>
        {error && <p className="small" style={{ color: "var(--danger)", marginTop: 8 }}>{error}</p>}
        {nav({ back: true, next: t.preview.cta, onNext: submit })}
      </>
    );
  }

  return (
    <div className="sheet" style={{ position: "static", background: "transparent", minHeight: "100vh" }}>
      <div className="panel" role="dialog" aria-labelledby="ob-title">
        <div className="panel-top">
          <div className="progress" aria-hidden="true"><i style={{ width: `${Math.round(((step + 1) / STEPS) * 100)}%` }} /></div>
          <button className="x" aria-label={t.close} onClick={() => router.push(`/${lang}`)}>×</button>
        </div>
        {body}
      </div>
    </div>
  );
}

function MiniTree({ s }: { s: State }) {
  const box = (x: number, y: number, label: string, main = false) => (
    <g key={`${x}-${y}`}>
      <rect x={x - 62} y={y - 16} width={124} height={32} rx={8} fill={main ? "var(--accent)" : "var(--surface)"} stroke="var(--accent)" strokeWidth={1.5} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fill={main ? "var(--accent-ink)" : "var(--ink)"} fontFamily="var(--body)">
        {label.length > 16 ? label.slice(0, 15) + "…" : label}
      </text>
    </g>
  );
  const line = (x1: number, y1: number, x2: number, y2: number) => (
    <path key={`l${x1}-${y1}-${x2}`} d={`M${x1} ${y1} V${(y1 + y2) / 2} H${x2} V${y2}`} fill="none" stroke="var(--line)" strokeWidth={1.5} />
  );
  const gp: [string, number, number][] = [[s.gm1, 65, 130], [s.gf1, 195, 130], [s.gm2, 325, 390], [s.gf2, 455, 390]];
  const par: [string, number][] = [[s.mother, 130], [s.father, 390]];
  return (
    <div className="tree-wrap" style={{ background: "var(--paper)", border: 0 }}>
      <svg viewBox="0 0 520 220" role="img" aria-label="Family tree" style={{ minWidth: 420 }}>
        {gp.map(([n, x, px], i) => n && par[i < 2 ? 0 : 1][0] ? line(x, 46, px, 96) : null)}
        {par.map(([n, x]) => n ? line(x, 128, 260, 178) : null)}
        {gp.map(([n, x]) => n ? box(x, 30, n) : null)}
        {par.map(([n, x]) => n ? box(x, 112, n) : null)}
        {box(260, 194, s.name || "You", true)}
      </svg>
    </div>
  );
}
