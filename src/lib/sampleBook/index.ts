import type { Lang } from "@/i18n/config";
import type { SampleBookText } from "./types";
import ru from "./ru";
import en from "./en";
import de from "./de";
import fr from "./fr";
import it from "./it";
import es from "./es";

import type { BookScene } from "@/components/BookArt";

export * from "./types";

/** Which drawing goes with each story (same order as the stories). */
const ART: Record<Lang, BookScene[]> = {
  ru: ["village", "factory", "church", "wintertrain", "apartments", "garden", "market", "kitchen"],
  en: ["mine", "choir", "docks", "dance", "ruins", "classroom", "citystreet", "kitchen"],
  de: ["farm", "mine", "shop", "ruins", "carlake", "wallnight", "moving", "kitchen"],
  fr: ["harbour", "letters", "factory", "beach", "celebration", "alley", "celebration", "kitchen"],
  it: ["lemons", "steamship", "alley", "ruins", "station", "carsea", "room", "kitchen"],
  es: ["orchard", "fair", "letters", "station", "carsea", "stadium", "citystreet", "kitchen"],
};
export const storyArt = (lang: Lang, i: number): BookScene => ART[lang]?.[i] ?? "village";
const BOOKS: Record<Lang, SampleBookText> = { ru, en, de, fr, it, es };
/** The sample book in the visitor's language: each language has its own made-up family. */
export const sampleBook = (lang: Lang): SampleBookText => BOOKS[lang] ?? en;
