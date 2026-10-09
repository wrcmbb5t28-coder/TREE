/**
 * Place name -> coordinates for the family map, via OpenStreetMap Nominatim.
 * Results (also "not found") are cached in the Place table, so each place is looked up once.
 * Nominatim allows about one request per second; callers look up a few places at a time.
 */
import { db } from "./db";

export function placeKey(place: string | null | undefined, country: string | null | undefined): string {
  return `${(place ?? "").trim().toLowerCase()}|${(country ?? "").trim().toUpperCase()}`;
}

export type Coords = { lat: number; lng: number; country?: string | null };

async function lookup(place: string, country: string | null): Promise<Coords | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");
  if (place) url.searchParams.set("q", place);
  else if (country) url.searchParams.set("country", country);
  if (place && country) url.searchParams.set("countrycodes", country.toLowerCase());
  const res = await fetch(url, {
    headers: { "User-Agent": "Treename/2.0 (family history app; https://treename.ai)", "Accept-Language": "en" },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`geocoder ${res.status}`);
  const j = (await res.json()) as { lat: string; lon: string; address?: { country_code?: string } }[];
  return j[0] ? { lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon), country: j[0].address?.country_code?.toUpperCase() ?? null } : null;
}

/** Coordinates for many places; looks up at most `budget` new ones (about 1 per second). */
export async function geocodeMany(items: { place: string | null; country: string | null }[], budget = 4): Promise<Map<string, Coords>> {
  const keys = [...new Map(items.filter((i) => i.place || i.country).map((i) => [placeKey(i.place, i.country), i])).entries()];
  const cached = await db.place.findMany({ where: { key: { in: keys.map(([k]) => k) } } });
  const out = new Map<string, Coords>();
  const known = new Set<string>();
  for (const c of cached) {
    // Rows found before countries were stored are looked up once more.
    if (c.lat != null && !c.country) continue;
    known.add(c.key);
    if (c.lat != null && c.lng != null) out.set(c.key, { lat: c.lat, lng: c.lng, country: c.country });
  }
  let n = 0;
  for (const [key, item] of keys) {
    if (known.has(key) || n >= budget) continue;
    if (n > 0) await new Promise((r) => setTimeout(r, 1100));
    n++;
    try {
      const c = await lookup(item.place ?? "", item.country);
      const data = { lat: c?.lat ?? null, lng: c?.lng ?? null, country: c?.country ?? null };
      await db.place.upsert({ where: { key }, create: { key, ...data }, update: data });
      if (c) out.set(key, c);
    } catch (e) {
      console.error("[geo]", key, e);
      break; // try again on the next visit
    }
  }
  return out;
}

/**
 * Countries where the family lived: chosen countries of life events plus the countries of
 * their places (from the geocoding cache). Unknown places are looked up in the background.
 */
export async function familyCountries(familyId: string): Promise<{ codes: string[]; missing: { place: string | null; country: string | null }[] }> {
  const events = await db.lifeEvent.findMany({ where: { familyId, OR: [{ country: { not: null } }, { place: { not: null } }] }, select: { place: true, country: true } });
  const codes = new Set<string>();
  for (const e of events) if (e.country) codes.add(e.country.toUpperCase());
  const withPlace = events.filter((e) => e.place && !e.country);
  const keys = [...new Set(withPlace.map((e) => placeKey(e.place, e.country)))];
  const cached = keys.length ? await db.place.findMany({ where: { key: { in: keys } } }) : [];
  for (const c of cached) if (c.country) codes.add(c.country);
  const done = new Set(cached.filter((c) => c.country || c.lat == null).map((c) => c.key));
  const missing = withPlace.filter((e) => !done.has(placeKey(e.place, e.country)));
  return { codes: [...codes], missing };
}
