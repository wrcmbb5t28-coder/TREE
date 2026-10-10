"use client";

import { useEffect, useRef } from "react";

/** On narrow screens the tree scrolls sideways: start with "you" in view instead of the left edge. */
export default function TreeAutoScroll() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const wrap = ref.current?.closest(".tree-wrap") as HTMLElement | null;
    const self = wrap?.querySelector("[data-self]") as SVGGraphicsElement | null;
    if (!wrap || !self || wrap.scrollWidth <= wrap.clientWidth) return;
    const w = wrap.getBoundingClientRect(), s = self.getBoundingClientRect();
    wrap.scrollLeft += s.left + s.width / 2 - (w.left + w.width / 2);
  }, []);
  return <span ref={ref} hidden />;
}
