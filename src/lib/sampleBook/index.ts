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
// One drawing per story, the same in every language (mill, journey, colony, pier, prairie, farm, mine town, school, station, home).
const SCENES = ["river", "river", "village", "pier", "field", "village", "city", "school", "city", "house"] as const;

/** The sample book (the made-up Müller family) in the visitor's language. */
export const sampleBook = (lang: Lang): SampleBookText => {
  const b = BOOKS[lang] ?? en;
  return { ...b, stories: b.stories.map((s, i) => ({ ...s, scene: SCENES[i] ?? s.scene })) };
};
