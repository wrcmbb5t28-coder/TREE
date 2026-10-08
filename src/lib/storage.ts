import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { put, get, del, list } from "@vercel/blob";
import { token } from "./util";

/**
 * File storage for voice recordings and photos. Two drivers:
 * - Vercel Blob (private store) when BLOB_READ_WRITE_TOKEN is set — production on Vercel.
 * - Local folder (STORAGE_DIR) otherwise — development.
 * Files are never public: /api/files/[...path] checks family membership before streaming.
 */
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
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
