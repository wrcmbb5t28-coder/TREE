"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Labels = { prev: string; next: string; page: string; of: string; hint: string; open: string };

/**
 * Leaf through a book. pages[0] is the closed cover; on a wide screen the rest is shown
 * as two-page spreads (1–2, 3–4 …), on a phone one page at a time.
 * Arrow keys, swipes, the buttons, or a click on the left/right page turn the pages.
 */
export default function BookReader({ pages, labels }: { pages: ReactNode[]; labels: Labels }) {
  const n = pages.length;
  const [wide, setWide] = useState(true);
  const [pos, setPos] = useState(0); // spread index when wide, page index when narrow
  const [dir, setDir] = useState<"next" | "prev" | "">("");
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // keep the same place in the book when the screen switches between spreads and single pages
  const was = useRef(wide);
  useEffect(() => {
    if (was.current === wide) return;
    was.current = wide;
    setPos((p) => (wide ? Math.ceil(p / 2) : Math.max(0, p * 2 - 1)));
  }, [wide]);

  const last = wide ? Math.ceil((n - 1) / 2) : n - 1;
  const go = useCallback((d: 1 | -1) => {
    const q = Math.min(last, Math.max(0, pos + d));
    if (q === pos) return;
    setDir(d > 0 ? "next" : "prev");
    setPos(q);
  }, [pos, last]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go]);

  useEffect(() => { const t = setTimeout(() => setDir(""), 450); return () => clearTimeout(t); }, [pos]);

  const shown: number[] = wide ? (pos === 0 ? [0] : [2 * pos - 1, 2 * pos].filter((i) => i < n)) : [pos];
  const cover = shown.length === 1 && shown[0] === 0;
  const pageLabel = cover ? "" : shown.length === 2 ? `${labels.page} ${shown[0]}–${shown[1]} ${labels.of} ${n - 1}` : `${labels.page} ${shown[0]} ${labels.of} ${n - 1}`;

  return (
    <div className="br">
      <div
        className={`br-stage${wide ? " br-wide" : ""}${cover ? " br-cover" : ""}${dir ? ` br-turn-${dir}` : ""}`}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        }}
      >
        {pages.map((p, i) => {
          const at = shown.indexOf(i);
          const side = cover ? "br-solo" : shown.length === 1 ? "br-solo" : at === 0 ? "br-left" : "br-right";
          return (
            <div key={i} className={`br-page ${i === 0 ? "br-is-cover " : ""}${side}`} hidden={at < 0} aria-hidden={at < 0}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a,button")) return;
                if (i === 0) return go(1);
                if (wide) go(at === 0 ? -1 : 1);
              }}>
              {p}
            </div>
          );
        })}
      </div>
      <nav className="br-nav" aria-label={pageLabel || labels.open}>
        {cover ? (
          <button className="btn btn-primary" onClick={() => go(1)}>{labels.open}</button>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => go(-1)} aria-label={labels.prev}>← {labels.prev}</button>
            <span className="br-count" aria-live="polite">{pageLabel}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => go(1)} disabled={pos === last} aria-label={labels.next}>{labels.next} →</button>
          </>
        )}
      </nav>
      <p className="br-hint">{labels.hint}</p>
    </div>
  );
}
