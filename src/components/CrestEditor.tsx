"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import CrestSvg from "./CrestSvg";
import { CHARGES, DIVISIONS, SHAPES, TINCTURES, type ChargeId, type CrestConfig, type Division, type Shape, type Suggestion, type Tincture } from "@/lib/crest";
import type { CrestsT } from "@/i18n/app/crests";

type Props = {
  lineKey: string;
  name: string;
  initial: CrestConfig;
  draft: CrestConfig;
  suggestions: Suggestion[];
  t: Omit<CrestsT, "people" | "lineOf">;
  save: (key: string, config: string) => Promise<{ ok: boolean }>;
  reset: (key: string) => Promise<{ ok: boolean }>;
  canEdit: boolean;
};

export default function CrestEditor({ lineKey, name, initial, draft, suggestions, t, save, reset, canEdit }: Props) {
  const [c, setC] = useState<CrestConfig>(initial);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  const preview = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const set = (patch: Partial<CrestConfig>) => { setC((x) => ({ ...x, ...patch })); setMsg(""); };

  const run = (fn: () => Promise<{ ok: boolean }>, after?: () => void) =>
    start(async () => {
      try {
        const r = await fn();
        if (r.ok) { setMsg(t.saved); after?.(); router.refresh(); }
      } catch {
        window.location.reload();
      }
    });

  const svgText = () => {
    const svg = preview.current?.querySelector("svg");
    return svg ? `<?xml version="1.0" encoding="UTF-8"?>\n${svg.outerHTML}` : "";
  };
  const file = (ext: string) => `${name.replace(/[^\p{L}\p{N}]+/gu, "-")}-crest.${ext}`;
  const download = (href: string, filename: string) => { const a = document.createElement("a"); a.href = href; a.download = filename; a.click(); };
  const downloadSvg = () => {
    const url = URL.createObjectURL(new Blob([svgText()], { type: "image/svg+xml" }));
    download(url, file("svg"));
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const downloadPng = () => {
    const svg = svgText();
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    img.onload = () => {
      const scale = 1200 / img.width;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      download(canvas.toDataURL("image/png"), file("png"));
    };
    img.src = url;
  };

  const tincture = (field: "field" | "field2" | "chargeColor", label: string) => (
    <div className="stack" style={{ gap: 6 }}>
      <span className="small muted">{label}</span>
      <div className="swatches" role="radiogroup" aria-label={label}>
        {(Object.keys(TINCTURES) as Tincture[]).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={c[field] === k} title={t.tinctures[k]} aria-label={t.tinctures[k]}
            className={`swatch${c[field] === k ? " is-on" : ""}`} style={{ background: TINCTURES[k].hex }} onClick={() => set({ [field]: k })} disabled={!canEdit} />
        ))}
      </div>
    </div>
  );
  const sugIds = suggestions.map((s) => s.charge);

  return (
    <div className="crest-editor">
      <div className="crest-preview" ref={preview}>
        <CrestSvg c={c} size={240} title={name} idSuffix="edit" />
        <p className="small muted" style={{ textAlign: "center", maxWidth: 260 }}>{t.note}</p>
      </div>

      <div className="stack" style={{ gap: 18 }}>
        {suggestions.length > 0 && (
          <div className="stack" style={{ gap: 6 }}>
            <span className="small muted">{t.suggested}</span>
            <div className="row" style={{ gap: 8 }}>
              {suggestions.map((s) => (
                <button key={s.charge} type="button" className={`chip-btn${c.charge === s.charge ? " is-on" : ""}`} onClick={() => set({ charge: s.charge })} disabled={!canEdit}>
                  <ChargeIcon id={s.charge} /> {t.charges[s.charge as keyof typeof t.charges]} <span className="muted">· {t.because} «{s.reason}»</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="stack" style={{ gap: 6 }}>
          <span className="small muted">{t.symbol}</span>
          <div className="charge-grid">
            {(Object.keys(CHARGES) as ChargeId[]).sort((a, b) => Number(sugIds.includes(b)) - Number(sugIds.includes(a))).map((k) => (
              <button key={k} type="button" className={`charge-btn${c.charge === k ? " is-on" : ""}`} onClick={() => set({ charge: k })} title={t.charges[k as keyof typeof t.charges]} disabled={!canEdit}>
                <ChargeIcon id={k} size={30} />
                <span>{t.charges[k as keyof typeof t.charges]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid2">
          <div className="stack" style={{ gap: 6 }}>
            <span className="small muted">{t.shape}</span>
            <div className="row" style={{ gap: 6 }}>
              {(Object.keys(SHAPES) as Shape[]).map((k) => (
                <button key={k} type="button" className={`shape-btn${c.shape === k ? " is-on" : ""}`} onClick={() => set({ shape: k })} title={t.shapes[k]} aria-label={t.shapes[k]} disabled={!canEdit}>
                  <svg width="26" height="31" viewBox="0 0 100 120"><path d={SHAPES[k]} fill="currentColor" /></svg>
                </button>
              ))}
            </div>
          </div>
          <div className="stack" style={{ gap: 6 }}>
            <span className="small muted">{t.division}</span>
            <div className="row" style={{ gap: 6 }}>
              {(Object.keys(DIVISIONS) as Division[]).map((k) => (
                <button key={k} type="button" className={`shape-btn${c.division === k ? " is-on" : ""}`} onClick={() => set({ division: k })} title={t.divisions[k]} aria-label={t.divisions[k]} disabled={!canEdit}>
                  <svg width="26" height="31" viewBox="0 0 100 120">
                    <defs><clipPath id={`dv-${k}`}><path d={SHAPES.heater} /></clipPath></defs>
                    <g clipPath={`url(#dv-${k})`}><rect width="100" height="120" fill="currentColor" opacity=".35" />{DIVISIONS[k] && <path d={DIVISIONS[k]} fill="currentColor" />}</g>
                    <path d={SHAPES.heater} fill="none" stroke="currentColor" strokeWidth="6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid2">
          {tincture("field", t.field1)}
          {c.division !== "plain" && tincture("field2", t.field2)}
          {tincture("chargeColor", t.chargeColour)}
        </div>
        <p className="small muted" style={{ margin: 0 }}>{t.ruleHint}</p>

        <div className="field">
          <label htmlFor="motto">{t.motto}</label>
          <input id="motto" value={c.motto} maxLength={40} placeholder={t.mottoPh} onChange={(e) => set({ motto: e.target.value })} disabled={!canEdit} />
        </div>

        <div className="row" style={{ gap: 10 }}>
          {canEdit && <button type="button" className="btn btn-primary" disabled={pending} onClick={() => run(() => save(lineKey, JSON.stringify(c)))}>{t.save}</button>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={downloadPng}>{t.downloadPng}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={downloadSvg}>{t.downloadSvg}</button>
          {canEdit && <button type="button" className="linkbtn small" disabled={pending} onClick={() => run(() => reset(lineKey), () => setC(draft))}>{t.reset}</button>}
          {msg && <span className="small" style={{ color: "var(--accent)" }}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}

function ChargeIcon({ id, size = 20 }: { id: string; size?: number }) {
  const ch = CHARGES[id];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ flex: "none" }}>
      {ch.stroke
        ? <path d={ch.d} fill="none" stroke="currentColor" strokeWidth={ch.stroke} strokeLinecap="round" strokeLinejoin="round" />
        : <path d={ch.d} fill="currentColor" />}
    </svg>
  );
}
