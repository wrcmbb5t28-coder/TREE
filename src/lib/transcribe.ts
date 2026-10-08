/**
 * Speech-to-text for voice answers. Uses any OpenAI-compatible
 * /audio/transcriptions endpoint (TRANSCRIBE_URL), so the provider can be
 * swapped without code changes. Returns null when not configured; the
 * storyteller can then type the answer instead, and the audio is still kept.
 */
export async function transcribe(
  audio: Buffer,
  filename: string,
  lang?: string
): Promise<{ text: string; language?: string } | null> {
  const key = process.env.TRANSCRIBE_API_KEY;
  if (!key) return null;
  const url = process.env.TRANSCRIBE_URL || "https://api.openai.com/v1/audio/transcriptions";
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(audio)]), filename);
  form.append("model", process.env.TRANSCRIBE_MODEL || "whisper-1");
  form.append("response_format", "verbose_json");
  if (lang) form.append("language", lang);
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form });
  if (!res.ok) {
    console.error("[transcribe]", res.status, await res.text());
    return null;
  }
  const json = (await res.json()) as { text?: string; language?: string };
  return json.text ? { text: json.text.trim(), language: json.language } : null;
}
