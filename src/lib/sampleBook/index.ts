import type { Lang } from "@/i18n/config";
import type { SampleBookText } from "./types";
import ru from "./ru";
import en from "./en";
import de from "./de";
import fr from "./fr";
import it from "./it";
import es from "./es";

export * from "./types";
const BOOKS: Record<Lang, SampleBookText> = { ru, en, de, fr, it, es };
/** The sample book in the visitor's language: each language has its own made-up family. */
export const sampleBook = (lang: Lang): SampleBookText => BOOKS[lang] ?? en;
