import { NextResponse } from "next/server";
import { loadFile, mimeFor } from "@/lib/storage";
import { memberOf } from "@/lib/auth";
import { db } from "@/lib/db";

/** Streams a stored recording or photo to family members (or via a family page that shares the story). */
export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const rel = path.join("/");
  const familyId = path[0];
  if (!familyId || rel.includes("..")) return new NextResponse("Not found", { status: 404 });

  let allowed = !!(await memberOf(familyId));
  if (!allowed) {
    // Shared on the family page: only audio that belongs to a story marked "public" on an enabled page.
    const page = new URL(req.url).searchParams.get("page");
    if (page) {
      const fam = await db.family.findFirst({ where: { id: familyId, pageSlug: page, pageEnabled: true } });
      if (fam) {
        const story = await db.story.findFirst({ where: { familyId, visibility: "public", answer: { audioPath: rel } } });
        allowed = !!story;
      }
    }
  }
  if (!allowed) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await loadFile(rel);
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": mimeFor(rel), "Cache-Control": "private, max-age=3600", "Content-Length": String(data.length) },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
