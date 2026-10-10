import { LANGS, type Lang } from "@/i18n/config";
import { sampleBook, drawingStyle } from "./sampleBook";
import { listFiles, saveFileAt } from "./storage";

/**
 * Pictures for the sample books: realistic hand-drawn-looking illustrations made once with an image
 * model (OpenAI Images, OPENAI_API_KEY) and stored with the other files. Until a picture exists,
 * the book shows its drawn version, so the sample works without any key.
 */
export type Slot = { slot: string; prompt: string; title: string };

const DIR = "sample-book";
export const samplePath = (lang: Lang, slot: string) => `${DIR}/${lang}/${slot}.jpg`;
export const sampleUrl = (lang: Lang, slot: string, v?: string) => `/api/sample-image/${lang}/${slot}${v ? `?v=${v}` : ""}`;

export function sampleSlots(lang: Lang): Slot[] {
  const b = sampleBook(lang);
  return [
    { slot: "family", title: b.family.caption, prompt: `${b.family.prompt} ${drawingStyle(b.family.year)}` },
    ...b.stories.map((s, i) => ({ slot: `s${i}`, title: s.title, prompt: `${s.prompt} ${drawingStyle(s.year)} The people are ordinary, made-up people.` })),
    { slot: "recipe", title: b.recipe.title, prompt: `${b.recipe.prompt} ${drawingStyle(2026)} A still life of the dish, appetising but homely.` },
  ];
}

/** Which slots already have a picture, per language. */
export async function existingSamples(lang: Lang): Promise<Set<string>> {
  try {
    const files = await listFiles(`${DIR}/${lang}/`);
    return new Set(files.map((f) => f.split("/").pop()!.replace(/\.jpg$/, "")));
  } catch {
    return new Set();
  }
}

export const imageKey = () => process.env.OPENAI_API_KEY || (process.env.TRANSCRIBE_API_KEY?.startsWith("sk-") ? process.env.TRANSCRIBE_API_KEY : "");

/** Makes one picture and stores it. Returns an error message, or null when it worked. */
export async function generateSample(lang: Lang, slot: string): Promise<string | null> {
  const key = imageKey();
  if (!key) return "OPENAI_API_KEY is not set";
  const s = sampleSlots(lang).find((x) => x.slot === slot);
  if (!s) return "Unknown picture";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.IMAGE_MODEL || "gpt-image-1",
      prompt: s.prompt,
      size: "1536x1024",
      quality: process.env.IMAGE_QUALITY || "medium",
      output_format: "jpeg",
      output_compression: 82,
      n: 1,
    }),
  });
  const j = (await res.json().catch(() => ({}))) as { data?: { b64_json?: string }[]; error?: { message?: string } };
  if (!res.ok || !j.data?.[0]?.b64_json) return j.error?.message?.slice(0, 300) ?? `Image service answered ${res.status}`;
  await saveFileAt(samplePath(lang, slot), Buffer.from(j.data[0].b64_json, "base64"));
  return null;
}

export const ALL_LANGS = LANGS as readonly Lang[];
