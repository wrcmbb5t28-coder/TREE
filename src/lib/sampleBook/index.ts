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

/** The full printable sample book (the Jones family, 44 pages) in each site language. */
export const SAMPLE_PDF: Record<Lang, { href: string; label: string; note: string }> = {
  en: { href: "/books/treename-sample-book-en.pdf", label: "Download the full sample book (PDF)", note: "44 pages · 1 MB" },
  ru: { href: "/books/treename-sample-book-ru.pdf", label: "Скачать полную книгу-пример (PDF)", note: "46 страниц · 1 МБ" },
  de: { href: "/books/treename-sample-book-de.pdf", label: "Das ganze Beispielbuch herunterladen (PDF)", note: "46 Seiten · 1 MB" },
  fr: { href: "/books/treename-sample-book-fr.pdf", label: "Télécharger le livre d’exemple complet (PDF)", note: "44 pages · 1 Mo" },
  it: { href: "/books/treename-sample-book-it.pdf", label: "Scarica il libro di esempio completo (PDF)", note: "44 pagine · 1 MB" },
  es: { href: "/books/treename-sample-book-es.pdf", label: "Descargar el libro de ejemplo completo (PDF)", note: "46 páginas · 1 MB" },
};
