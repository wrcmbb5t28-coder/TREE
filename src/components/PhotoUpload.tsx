"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Picks a photo, shrinks it in the browser (phone photos are often 3–10 MB,
 * uploads are limited to 4 MB) and sends it to the given server action.
 */
export default function PhotoUpload({
  action,
  label = "Upload a photo",
  maxSide = 1600,
  multiple = false,
}: {
  action: (fd: FormData) => Promise<void | { error?: string }>;
  label?: string;
  maxSide?: number;
  multiple?: boolean;
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
    try {
      for (let i = 0; i < files.length; i++) {
        setBusy(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : "Uploading…");
        try {
          const blob = await shrink(files[i], maxSide);
          const fd = new FormData();
          fd.append("photo", blob, "photo.jpg");
          const res = await action(fd);
          if (res && res.error) throw new Error(res.error);
        } catch (err) {
          // After a new deploy, an open page can point to an old server action: reload once.
          if (err instanceof Error && /Server Action .* was not found/i.test(err.message)) {
            window.location.reload();
            return;
          }
          failed.push(err instanceof Error && err.message ? err.message : "Could not upload this photo.");
          if (failed.length && /free plan/i.test(failed[failed.length - 1])) break;
        }
      }
      if (failed.length) setError(failed.length === 1 ? failed[0] : `${failed.length} photos could not be uploaded. ${failed[0]}`);
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

function shrink(file: File, maxSide: number): Promise<Blob> {
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
      reject(new Error("This file is not a photo we can read. Try a JPG or PNG."));
    };
    img.src = url;
  });
}
