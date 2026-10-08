import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { saveFile, MAX_UPLOAD_BYTES } from "@/lib/storage";
import { transcribe } from "@/lib/transcribe";
import { storyFromAnswer } from "@/lib/stories";
import { track } from "@/lib/analytics";
import { clean, toInt } from "@/lib/util";

export const maxDuration = 60;


/**
 * Receives a storyteller's answer (voice and/or text) for /a/<token>.
 * A storyteller's answer is never refused because of the family's plan:
 * losing Grandma's story would be worse than any paywall.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const tokenValue = clean(form.get("token"), 64);
  const q = await db.question.findUnique({ where: { token: tokenValue } });
  if (!q) return NextResponse.json({ error: "Question not found" }, { status: 404 });
  if (q.status === "answered") return NextResponse.json({ error: "Already answered" }, { status: 409 });

  const typed = clean(form.get("text"), 20000);
  const audio = form.get("audio");
  let audioPath: string | null = null;
  let transcript = typed;
  let language: string | undefined;

  if (audio instanceof File && audio.size > 0) {
    if (audio.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Recording is too long" }, { status: 413 });
    const buf = Buffer.from(await audio.arrayBuffer());
    const ext = (audio.name.split(".").pop() || "webm").toLowerCase();
    if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("[answers] BLOB_READ_WRITE_TOKEN is missing: connect a Blob store to the project and redeploy");
      return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
    }
    try {
      audioPath = await saveFile(q.familyId, buf, ext);
    } catch (e) {
      console.error("[answers] saving the recording failed", e);
      return NextResponse.json({ error: "storage_failed" }, { status: 502 });
    }
    try {
      const tr = await transcribe(buf, audio.name || `answer.${ext}`);
      if (tr) {
        transcript = [tr.text, typed].filter(Boolean).join("\n\n");
        language = tr.language;
      }
    } catch (e) {
      console.error("[answers] transcription failed, keeping the audio", e);
    }
  }

  if (!transcript && !audioPath) return NextResponse.json({ error: "Empty answer" }, { status: 400 });
  if (!transcript) transcript = "(Voice answer. Transcription is not configured yet, listen to the recording.)";

  const answer = await db.answer.create({
    data: {
      questionId: q.id,
      audioPath,
      durationS: toInt(form.get("durationS")),
      transcript,
      originalLang: language ?? q.lang,
    },
  });
  await db.question.update({ where: { id: q.id }, data: { status: "answered", answeredAt: new Date() } });
  await track("answer_recorded", {
    familyId: q.familyId,
    props: { storytellerId: q.storytellerId, voice: !!audioPath, duration_s: answer.durationS ?? 0, lang: q.lang },
  });

  // The answer is saved at this point. If the story step fails, the family can
  // still listen and write it later; the storyteller must not see an error.
  try {
    await storyFromAnswer(answer.id);
  } catch (e) {
    console.error("[answers] story generation failed", e);
  }
  return NextResponse.json({ ok: true });
}
