import type { Scene } from "@/components/StoryArt";

/** One story in the sample book: a left page (picture) and a right page (text). */
export type SampleStory = {
  scene: Scene;
  chapter: string;
  title: string;
  who: string; // "Якоб Мюллер, 1648–1712"
  caption: string; // handwritten under the picture: "Берн, 1674"
  text: string;
  quote?: string;
  voice?: string; // under a QR code: "Послушайте, как это рассказывал Андрей"
};

export type SampleBookText = {
  title: string; // family name on the cover
  subtitle: string;
  years: string;
  motto: string; // on the crest ribbon, max ~30 characters
  dedication: string;
  contents: string;
  treeTitle: string;
  treeNote: string;
  treeFrom: string; // "из" — "Anna Zbinden, from Thun"
  mapTitle: string;
  mapNote: string;
  stops: string[]; // one line per stop, same order as STOPS
  recipe: { chapter: string; title: string; who: string; ingredientsTitle: string; ingredients: string[]; text: string; note: string };
  stories: SampleStory[];
  endTitle: string;
  endText: string;
  colophon: string;
  ui: { facts: string[]; back: string; start: string; prev: string; next: string; open: string; page: string; of: string; hint: string; chapter: string; listen: string; eyebrow: string; lead: string; cta: string };
};

/** The direct line of the Müllers, oldest first: [husband, wife] per generation, then the children. */
export const LINE: { h: [string, string]; w: [string, string]; place: string }[] = [
  { h: ["Hans Müller", "1620–1681"], w: ["Anna Zbinden", "1624–1690"], place: "Bern" },
  { h: ["Jakob Müller", "1648–1712"], w: ["Verena Schmid", "1652–1715"], place: "Bern" },
  { h: ["Peter Müller", "1677–1740"], w: ["Katharina Weber", "1680–1745"], place: "Mannheim" },
  { h: ["Johann Müller", "1705–1770"], w: ["Elisabeth Kraus", "1708–1772"], place: "Worms" },
  { h: ["Georg Müller", "1734–1799"], w: ["Margaretha Becker", "1737–1801"], place: "Darmstadt" },
  { h: ["Friedrich Müller", "1762–1830"], w: ["Christina Lang", "1765–1834"], place: "Saratov" },
  { h: ["Heinrich Müller", "1790–1858"], w: ["Maria Schäfer", "1793–1860"], place: "Saratov" },
  { h: ["Andreas Müller", "1818–1889"], w: ["Zofia Kowalska", "1822–1891"], place: "Odessa" },
  { h: ["Wilhelm Müller", "1846–1912"], w: ["Olga Petrenko", "1850–1920"], place: "Odessa" },
  { h: ["Karl Müller", "1874–1938"], w: ["Natalja Iwanowa", "1877–1945"], place: "Omsk" },
  { h: ["Alexander Müller", "1901–1962"], w: ["Lidia Schmidt", "1904–1979"], place: "Omsk" },
  { h: ["Viktor Müller", "1928–2001"], w: ["Aigul Zhanibekova", "1931–2010"], place: "Karaganda" },
  { h: ["Andrej Müller", "1955"], w: ["Tatjana Melnik", "1957"], place: "Karaganda" },
  { h: ["Michael Müller", "1981"], w: ["Giulia Rossi", "1984"], place: "Köln" },
];
export const CHILDREN: [string, string][] = [["Leon", "2011"], ["Sofia", "2016"]];

/** Stops of the family's road: [lon, lat, year]. Labels come from each language. */
export const STOPS: [number, number, number][] = [
  [7.45, 46.95, 1620], // Bern
  [8.47, 49.49, 1675], // Mannheim
  [46.03, 51.53, 1766], // Saratov
  [30.72, 46.48, 1845], // Odessa
  [73.37, 54.99, 1898], // Omsk
  [73.09, 49.81, 1941], // Karaganda
  [6.96, 50.94, 1992], // Köln
  [8.52, 47.17, 2015], // Zug
];
export const SIDE_TRIP: [number, number, number] = [-96.7, 40.81, 1903]; // Lincoln, Nebraska
