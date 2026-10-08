import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { token } from "./util";

/**
 * Simple file storage on a local/persistent volume.
 * Files are never served publicly: /api/files/[...path] checks family membership
 * (or a valid answer token) before streaming them.
 * To use S3-compatible storage (e.g. a Swiss provider), replace these three functions.
 */
const ROOT = path.resolve(process.env.STORAGE_DIR || "./storage");

function safe(rel: string): string {
  const p = path.resolve(ROOT, rel);
  if (!p.startsWith(ROOT + path.sep)) throw new Error("Invalid path");
  return p;
}

export async function saveFile(familyId: string, data: Buffer, ext: string): Promise<string> {
  const cleanExt = ext.replace(/[^a-z0-9]/gi, "").slice(0, 5) || "bin";
  const rel = path.join(familyId, `${Date.now()}-${token(6)}.${cleanExt}`);
  const abs = safe(rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, data);
  return rel.split(path.sep).join("/");
}

export async function loadFile(rel: string): Promise<Buffer> {
  return readFile(safe(rel));
}

export async function deleteFamilyFiles(familyId: string): Promise<void> {
  await rm(safe(familyId), { recursive: true, force: true });
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
