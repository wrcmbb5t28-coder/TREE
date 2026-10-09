"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type MapPlace = { key: string; name: string; lat: number; lng: number; years: string; people: string[] };
export type MapPath = { id: string; name: string; color: string; points: [number, number][] };

/**
 * Family map: a dot for every place (with years and who lived there) and
 * one coloured line per person connecting their places in time order.
 */
export default function FamilyMap({ places, paths, label }: { places: MapPlace[]; paths: MapPath[]; label: string }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false, worldCopyJump: true, attributionControl: true });
      // Plain-text library credit instead of Leaflet's default prefix.
      map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noreferrer">Leaflet</a>');
      // OpenStreetMap standard tiles (no key). For heavy production traffic switch to a paid tile
      // provider (e.g. MapTiler) via NEXT_PUBLIC_MAP_TILES, a URL template with {z}/{x}/{y}.
      L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILES || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      }).addTo(map);

      for (const p of paths) {
        if (p.points.length < 2) continue;
        L.polyline(p.points, { color: p.color, weight: 3, opacity: 0.85, dashArray: "6 6" }).addTo(map).bindTooltip(p.name, { sticky: true });
      }

      const pts = places.map((p) => [p.lat, p.lng] as [number, number]);
      if (pts.length === 1) map.setView(pts[0], 6);
      else map.fitBounds(L.latLngBounds(pts), { padding: [70, 70], maxZoom: 7 });

      // Labels: places close to each other on screen get their labels on different sides.
      const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
      const sides = ["top", "bottom", "right", "left"] as const;
      const placed: { x: number; y: number; side: (typeof sides)[number] }[] = [];
      const order = [...places].sort((a, b) => b.people.length - a.people.length);
      for (const pl of order) {
        const r = 7 + Math.min(pl.people.length, 5) * 2;
        const pt = map.latLngToContainerPoint([pl.lat, pl.lng]);
        const near = placed.filter((q) => Math.abs(q.x - pt.x) < 150 && Math.abs(q.y - pt.y) < 70);
        const side = sides.find((sd) => !near.some((q) => q.side === sd)) ?? "top";
        placed.push({ x: pt.x, y: pt.y, side });
        const offset: [number, number] = side === "top" ? [0, -r] : side === "bottom" ? [0, r] : side === "right" ? [r, 0] : [-r, 0];
        L.circleMarker([pl.lat, pl.lng], { radius: r, color: "#fff", weight: 2, fillColor: "#2F6B5E", fillOpacity: 0.95 })
          .addTo(map)
          .bindTooltip(`<b>${esc(pl.name)}</b> · ${esc(pl.years)}${pl.people.length ? `<br>${pl.people.map(esc).join(", ")}` : ""}`, {
            permanent: places.length <= 12,
            direction: side,
            offset,
            className: "fm-label",
          });
      }
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [places, paths]);

  return <div ref={el} className="family-map" role="img" aria-label={label} />;
}
