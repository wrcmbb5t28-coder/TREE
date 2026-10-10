import type { Scene } from "@/components/StoryArt";
import type { CrestConfig } from "@/lib/crest";

/**
 * A made-up family for the sample book, one per site language (the Ivanovs for Russian,
 * the Joneses for English…). Everything a page needs is here; pictures are generated once
 * from `prompt` (see src/lib/sampleImages.ts) and a drawing (`scene`) is shown until then.
 */
export type SampleStory = {
  scene: Scene;
  year: number; // when the picture was taken
  prompt: string; // English description of a period photograph for the image generator
  chapter: string;
  title: string;
  who: string; // "Степан Иванов, 1851–1919"
  caption: string; // handwritten under the picture: "Покровское, 1884"
  text: string;
  quote?: string;
  voice?: string; // under a QR code
};

export type Person = [name: string, years: string];

export type SampleBookText = {
  title: string; // family name on the cover
  subtitle: string;
  years: string;
  motto: string; // on the crest ribbon, up to ~24 characters
  crest: CrestConfig;
  dedication: string;
  contents: string;
  treeTitle: string;
  relatives: number; // others in the tree besides the direct line (for the numbers page)
  treeNote: string;
  line: { h: Person; w: Person }[]; // oldest first, one couple per generation
  children: Person[];
  family: { caption: string; prompt: string; scene: Scene; year: number }; // the old family photograph
  mapTitle: string;
  mapNote: string;
  stops: { name: string; label: string; lon: number; lat: number; year: number }[];
  side?: { label: string; dir: "w" | "e"; from: number }; // a branch that left the map
  recipe: { chapter: string; title: string; who: string; ingredientsTitle: string; ingredients: string[]; text: string; note: string; prompt: string };
  stories: SampleStory[];
  endTitle: string;
  endText: string;
  colophon: string;
  photoNote: string; // small print: the pictures are generated, the family is made up
  ui: { facts: string[]; back: string; start: string; prev: string; next: string; open: string; page: string; of: string; hint: string; chapter: string; listen: string; eyebrow: string; lead: string; cta: string };
};

/** Shared look for the image generator: a believable photograph of its time, never text or a watermark. */
export function photoStyle(year: number): string {
  const era =
    year < 1900 ? "a 19th-century albumen print, sepia, soft focus at the edges"
    : year < 1945 ? "an old black-and-white photograph, slight sepia tone"
    : year < 1965 ? "a black-and-white snapshot from that decade"
    : year < 1990 ? "a faded colour snapshot with the typical film colours of that decade"
    : year < 2010 ? "a slightly washed-out colour photo from a compact camera"
    : "a natural, candid modern family photo";
  return `Photorealistic ${era}, taken around ${year}. Authentic period clothing, objects and architecture, natural light, film grain, documentary feel. No text, no captions, no watermark, no frame or border.`;
}
