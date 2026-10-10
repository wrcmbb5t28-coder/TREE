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
  prompt: string; // English description of the scene for the image generator (drawn as an illustration)
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
  family: { caption: string; prompt: string; scene: Scene; year: number }; // the drawn family portrait
  mapTitle: string;
  mapNote: string;
  stops: { name: string; label: string; lon: number; lat: number; year: number }[];
  side?: { label: string; dir: "w" | "e"; from: number }; // a branch that left the map
  recipe: { chapter: string; title: string; who: string; ingredientsTitle: string; ingredients: string[]; text: string; note: string; prompt: string };
  stories: SampleStory[];
  endTitle: string;
  endText: string;
  colophon: string;
  photoNote: string; // small print: the family and the drawings are made up
  ui: { facts: string[]; back: string; start: string; prev: string; next: string; open: string; page: string; of: string; hint: string; chapter: string; listen: string; eyebrow: string; lead: string; cta: string };
};

/**
 * Shared look for the image generator: a realistic, finely drawn book illustration of its time —
 * always clearly a drawing, never a photograph, never text or a watermark.
 */
export function drawingStyle(year: number): string {
  const palette =
    year < 1900 ? "sepia ink and soft brown washes, like an engraving coloured by hand"
    : year < 1945 ? "graphite pencil with muted grey-brown watercolour washes"
    : year < 1975 ? "pencil and gentle watercolour in faded mid-century colours"
    : "pencil and warm, soft watercolour colours";
  return `A realistic, finely detailed book illustration drawn by hand in ${palette}, set around ${year}. Accurate period clothing, objects and architecture, natural light, visible paper texture and pencil lines. Clearly a drawing in the tradition of classic illustrated books, not a photograph. No text, no captions, no signature, no frame or border.`;
}
