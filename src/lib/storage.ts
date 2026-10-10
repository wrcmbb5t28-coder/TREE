import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { put, get, del, list } from "@vercel/blob";
import { token } from "./util";

/**
 * File storage for voice recordings and photos. Two drivers:
 * - Vercel Blob (private store) when BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN is set — production on Vercel.
 * - Local folder (STORAGE_DIR) otherwise — development.
 * Files are never public: /api/files/[...path] checks family membership before streaming.
 */
// Vercel connects a Blob store either with a read-write token (older setup) or with
// BLOB_STORE_ID + the project's OIDC identity (current setup). The SDK handles both.
const useBlob = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const ROOT = path.resolve(process.env.STORAGE_DIR || "./storage");

function safeLocal(rel: string): string {
  const p = path.resolve(ROOT, rel);
  if (!p.startsWith(ROOT + path.sep)) throw new Error("Invalid path");
  return p;
}

export async function saveFile(familyId: string, data: Buffer, ext: string): Promise<string> {
  const cleanExt = ext.replace(/[^a-z0-9]/gi, "").slice(0, 5) || "bin";
  const rel = `${familyId}/${Date.now()}-${token(6)}.${cleanExt}`;
  if (useBlob()) {
    await put(rel, data, { access: "private", contentType: mimeFor(rel), addRandomSuffix: false });
    return rel;
  }
  const abs = safeLocal(rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, data);
  return rel;
}

export async function loadFile(rel: string): Promise<Buffer> {
  if (useBlob()) {
    const res = await get(rel, { access: "private" });
    if (!res || res.statusCode !== 200) throw new Error("Not found");
    return Buffer.from(await new Response(res.stream).arrayBuffer());
  }
  return readFile(safeLocal(rel));
}

/** Saves a file at a fixed path, replacing what was there (used for the sample book's pictures). */
export async function saveFileAt(rel: string, data: Buffer): Promise<void> {
  if (rel.includes("..")) throw new Error("Invalid path");
  if (useBlob()) {
    await put(rel, data, { access: "private", contentType: mimeFor(rel), addRandomSuffix: false, allowOverwrite: true });
    return;
  }
  const abs = safeLocal(rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, data);
}

/** Names (relative paths) of the files stored under a folder. */
export async function listFiles(prefix: string): Promise<string[]> {
  if (useBlob()) {
    const out: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor });
      out.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out;
  }
  try {
    const { readdir } = await import("node:fs/promises");
    return (await readdir(safeLocal(prefix.replace(/\/$/, "")))).map((f) => `${prefix.replace(/\/$/, "")}/${f}`);
  } catch {
    return [];
  }
}

export async function deleteFile(rel: string): Promise<void> {
  try {
    if (useBlob()) await del(rel);
    else await rm(safeLocal(rel), { force: true });
  } catch (e) {
    console.error("[storage] delete failed", rel, e);
  }
}

export async function deleteFamilyFiles(familyId: string): Promise<void> {
  if (useBlob()) {
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: `${familyId}/`, cursor });
      if (page.blobs.length) await del(page.blobs.map((b) => b.url));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return;
  }
  await rm(safeLocal(familyId), { recursive: true, force: true });
}

export function mimeFor(rel: string): string {
  const ext = rel.split(".").pop()?.toLowerCase();
  return (
    {
      webm: "audio/webm",
      ogg: "audio/ogg",
      mp3: "audio/mpeg",
      m4a: "audio/mp4",
      mp4: "audio/mp4",
      wav: "audio/wav",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    } as Record<string, string>
  )[ext ?? ""] ?? "application/octet-stream";
}

/** Vercel Functions accept request bodies up to 4.5 MB. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Health check for the founder page: can we write, read and delete a file right now? */
export const storageConfigured = useBlob;

export async function storageCheck(): Promise<{ driver: string; store: string; ok: boolean; detail: string }> {
  const tokenValue = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  // Token format: vercel_blob_rw_<storeId>_<secret>
  const store = process.env.BLOB_STORE_ID || (tokenValue ? tokenValue.split("_")[3] ?? "?" : "");
  const how = process.env.BLOB_READ_WRITE_TOKEN ? "token" : "OIDC";
  const driver = useBlob() ? `Vercel Blob (private, ${how})` : process.env.VERCEL ? "none: no Blob store is connected" : "local folder";
  const rel = `_healthcheck/${Date.now()}.txt`;
  try {
    if (useBlob()) {
      await put(rel, "ok", { access: "private", contentType: "text/plain", addRandomSuffix: false });
      const res = await get(rel, { access: "private" });
      if (!res || res.statusCode !== 200) throw new Error("written, but could not read it back");
      await del(rel);
    } else {
      const abs = safeLocal(rel);
      await mkdir(path.dirname(abs), { recursive: true });
      await writeFile(abs, "ok");
      await rm(abs, { force: true });
    }
    return { driver, store, ok: true, detail: "write, read and delete work" };
  } catch (e) {
    return { driver, store, ok: false, detail: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
  }
}
