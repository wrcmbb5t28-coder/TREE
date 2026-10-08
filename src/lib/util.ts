import { randomBytes } from "node:crypto";

/** URL-safe random token, e.g. for answer links and invites. */
export function token(bytes = 18): string {
  return randomBytes(bytes).toString("base64url");
}

/** Short readable slug for the private family page: rossi-7k2q9x */
export function familySlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24) || "family";
  return `${base}-${randomBytes(4).toString("hex").slice(0, 6)}`;
}

export function appUrl(path = ""): string {
  // APP_URL wins; on Vercel fall back to the project's production domain.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const base = (process.env.APP_URL || (vercel ? `https://${vercel}` : "http://localhost:3000")).replace(/\/$/, "");
  return base + path;
}

export function clean(s: unknown, max = 200): string {
  return String(s ?? "").trim().slice(0, max);
}

export function toInt(s: unknown): number | null {
  const n = parseInt(String(s ?? ""), 10);
  return Number.isFinite(n) ? n : null;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function waLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function fmtDuration(s?: number | null): string {
  if (!s) return "";
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
