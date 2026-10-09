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
  maxSide = 1024,
}: {
  action: (fd: FormData) => Promise<void | { error?: string }>;
  label?: string;
  maxSide?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await shrink(file, maxSide);
      const fd = new FormData();
      fd.append("photo", blob, "photo.jpg");
      const res = await action(fd);
      if (res && res.error) throw new Error(res.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Could not upload this photo. Try another one.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack" style={{ gap: 6 }}>
      <input ref={input} type="file" accept="image/*" hidden onChange={onPick} />
      <div>
        <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? "Uploading…" : label}
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
