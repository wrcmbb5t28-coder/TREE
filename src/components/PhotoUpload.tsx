"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/** Interface strings; plain data so a server page can pass them. Defaults are English. */
export type PhotoUploadTexts = {
  lang: string;
  uploading: string;
  /** "{i}" and "{n}" are replaced. */
  uploadingN: string;
  failed: string;
  notPhoto: string;
  /** Plural forms, "#" is replaced by the count. */
  failedN: { one: string; few?: string; many?: string; other: string };
};

const EN: PhotoUploadTexts = {
  lang: "en",
  uploading: "Uploading…",
  uploadingN: "Uploading {i} of {n}…",
  failed: "Could not upload this photo.",
  notPhoto: "This file is not a photo we can read. Try a JPG or PNG.",
  failedN: { one: "# photo could not be uploaded.", other: "# photos could not be uploaded." },
};

function countText(t: PhotoUploadTexts, n: number): string {
  let rule = "other";
  try {
    rule = new Intl.PluralRules(t.lang).select(n);
  } catch {}
  const f = (t.failedN as Record<string, string | undefined>)[rule] ?? t.failedN.other;
  return f.replace("#", String(n));
}

/**
 * Picks a photo, shrinks it in the browser (phone photos are often 3–10 MB,
 * uploads are limited to 4 MB) and sends it to the given server action.
 */
export default function PhotoUpload({
  action,
  label = "Upload a photo",
  maxSide = 1600,
  multiple = false,
  fields,
  texts = EN,
}: {
  action: (fd: FormData) => Promise<void | { error?: string; limit?: boolean }>;
  label?: string;
  maxSide?: number;
  multiple?: boolean;
  /** Extra form fields sent with every photo. */
  fields?: Record<string, string>;
  texts?: PhotoUploadTexts;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    const failed: string[] = [];
    let limit = false;
    try {
      for (let i = 0; i < files.length; i++) {
        setBusy(files.length > 1 ? texts.uploadingN.replace("{i}", String(i + 1)).replace("{n}", String(files.length)) : texts.uploading);
        try {
          const blob = await shrink(files[i], maxSide, texts.notPhoto);
          const fd = new FormData();
          fd.append("photo", blob, "photo.jpg");
          for (const [k, v] of Object.entries(fields ?? {})) fd.append(k, v);
          const res = await action(fd);
          if (res && res.error) {
            if (res.limit) limit = true;
            throw new Error(res.error);
          }
        } catch (err) {
          // After a new deploy, an open page can point to an old server action: reload once.
          if (err instanceof Error && /Server Action .* was not found/i.test(err.message)) {
            window.location.reload();
            return;
          }
          failed.push(err instanceof Error && err.message ? err.message : texts.failed);
          if (limit || /free plan/i.test(failed[failed.length - 1])) break;
        }
      }
      if (failed.length) setError(failed.length === 1 ? failed[0] : `${countText(texts, failed.length)} ${failed[0]}`);
      router.refresh();
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="stack" style={{ gap: 6 }}>
      <input ref={input} type="file" accept="image/*" multiple={multiple} hidden onChange={onPick} />
      <div>
        <button type="button" className="btn btn-ghost btn-sm" disabled={!!busy} onClick={() => input.current?.click()}>
          {busy || label}
        </button>
      </div>
      {error && <p className="small notice">{error}</p>}
    </div>
  );
}

function shrink(file: File, maxSide: number, notPhoto: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error(""));
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(""))), "image/jpeg", 0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(notPhoto));
    };
    img.src = url;
  });
}
