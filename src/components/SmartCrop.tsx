"use client";

import { useEffect } from "react";

/**
 * Sensible framing for every photo shown "cover" style (book frames, albums, story pictures, avatars).
 * By default a picture is cut around its centre, which takes the heads off tall photos.
 * Here each such photo is looked at once (smartcrop: skin tones, detail, saturation) and the frame is moved
 * to the most interesting part. Until that is done, and if it fails, a tall photo is framed from the top,
 * where the faces usually are.
 */
const cache = new Map<string, string>();

type Crop = { x: number; y: number; width: number; height: number };
type SmartcropLib = { crop: (img: HTMLCanvasElement, o: { width: number; height: number; minScale?: number }) => Promise<{ topCrop: Crop }> };
let lib: Promise<SmartcropLib> | null = null;
const load = () => (lib ??= import("smartcrop").then((m) => ((m as unknown as { default?: SmartcropLib }).default ?? (m as unknown as SmartcropLib))));

function sameOrigin(src: string) {
  try { return new URL(src, location.href).origin === location.origin; } catch { return false; }
}

async function frame(img: HTMLImageElement) {
  if (img.dataset.nocrop !== undefined || !img.complete || !img.naturalWidth) return;
  if (getComputedStyle(img).objectFit !== "cover") return;
  const bw = img.clientWidth, bh = img.clientHeight;
  if (bw < 8 || bh < 8) return; // hidden page: done when it is shown
  const box = bw / bh, pic = img.naturalWidth / img.naturalHeight;
  if (Math.abs(box - pic) / box < 0.04) return; // nothing is cut
  const key = `${img.currentSrc || img.src}|${box.toFixed(2)}`;
  if (img.dataset.framed === key) return;
  img.dataset.framed = key;

  const tall = pic < box;
  if (!img.style.objectPosition) img.style.objectPosition = tall ? "50% 22%" : "50% 50%";
  const hit = cache.get(key);
  if (hit) { img.style.objectPosition = hit; return; }
  if (!sameOrigin(img.currentSrc || img.src)) return;

  try {
    const sc = await load();
    const k = Math.min(1, 256 / Math.max(img.naturalWidth, img.naturalHeight));
    const cw = Math.max(1, Math.round(img.naturalWidth * k)), ch = Math.max(1, Math.round(img.naturalHeight * k));
    const c = document.createElement("canvas");
    c.width = cw; c.height = ch;
    c.getContext("2d")!.drawImage(img, 0, 0, cw, ch);
    // the window has the frame's shape and is as large as the photo allows, as object-fit: cover shows it
    const w = tall ? cw : Math.round(ch * box), h = tall ? Math.round(cw / box) : ch;
    const { topCrop } = await sc.crop(c, { width: w, height: h, minScale: 1 });
    let px = 50, py = 50;
    if (tall) {
      const free = ch - topCrop.height;
      py = free > 0 ? (topCrop.y / free) * 100 : 50;
      py = Math.min(py, 60); // a face is almost never at the very bottom
    } else {
      const free = cw - topCrop.width;
      px = free > 0 ? (topCrop.x / free) * 100 : 50;
    }
    const pos = `${px.toFixed(1)}% ${py.toFixed(1)}%`;
    cache.set(key, pos);
    img.style.objectPosition = pos;
  } catch { /* keep the top-biased default */ }
}

export default function SmartCrop() {
  useEffect(() => {
    const seen = new WeakSet<HTMLImageElement>();
    const ro = new ResizeObserver((entries) => entries.forEach((e) => frame(e.target as HTMLImageElement)));
    const watch = (img: HTMLImageElement) => {
      if (seen.has(img)) return;
      seen.add(img);
      ro.observe(img);
      img.addEventListener("load", () => { delete img.dataset.framed; frame(img); });
      frame(img);
    };
    document.querySelectorAll("img").forEach(watch);
    const mo = new MutationObserver((list) => {
      for (const m of list) m.addedNodes.forEach((n) => {
        if (n instanceof HTMLImageElement) watch(n);
        else if (n instanceof HTMLElement) n.querySelectorAll("img").forEach(watch);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}
