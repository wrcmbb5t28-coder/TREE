import { NextResponse } from "next/server";
import { loadFile } from "@/lib/storage";
import { isLang } from "@/i18n/config";
import { samplePath, sampleSlots } from "@/lib/sampleImages";

/** Public pictures of the sample book (made-up families only — never a family's own files). */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string; slot: string }> }) {
  const { lang, slot } = await params;
  if (!isLang(lang) || !sampleSlots(lang).some((s) => s.slot === slot)) return new NextResponse("Not found", { status: 404 });
  try {
    const data = await loadFile(samplePath(lang, slot));
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800", "Content-Length": String(data.length) },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
