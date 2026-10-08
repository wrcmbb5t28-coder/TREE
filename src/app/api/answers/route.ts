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
    audioPath = await saveFile(q.familyId, buf, ext);
    const tr = await transcribe(buf, audio.name || `answer.${ext}`);
    if (tr) {
      transcript = [tr.text, typed].filter(Boolean).join("\n\n");
      language = tr.language;
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

  await storyFromAnswer(answer.id);
  return NextResponse.json({ ok: true });
}
