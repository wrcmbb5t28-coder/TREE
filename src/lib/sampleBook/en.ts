import type { SampleBookText } from "./types";

const en: SampleBookText = {
  title: "The Müllers",
  subtitle: "Fifteen generations of one family",
  years: "1620 — 2026",
  motto: "Bread grows where it is sown",
  dedication: "For Leon and Sofia, so they know where they come from.\nAnd for everyone who told the stories while we wrote them down.",
  contents: "Contents",
  treeTitle: "Our line",
  treeNote: "The direct line from Hans Müller, a miller near Bern, to Leon and Sofia. The family tree holds more than a hundred others: brothers, sisters and their families.",
  treeFrom: "from",
  mapTitle: "The family's road",
  mapNote: "Almost four hundred years and nine thousand kilometres: from Switzerland to the Volga, to Siberia and the Kazakh steppe — and back to Switzerland.",
  stops: [
    "Bern — the mill on the Aare",
    "Mannheim — after the flood",
    "Saratov — a Volga colony",
    "Odessa — by the Black Sea",
    "Omsk — a Siberian farm",
    "Karaganda — deportation",
    "Cologne — coming back",
    "Zug — Switzerland again",
  ],
  recipe: {
    chapter: "Traditions",
    title: "Grandma Lidia's cherry pie",
    who: "Lidia Müller, née Schmidt, 1904–1979",
    ingredientsTitle: "You need",
    ingredients: ["500 g flour", "250 g butter", "150 g sugar", "3 eggs", "a pinch of salt", "1 kg pitted cherries", "2 spoons of semolina, so it doesn't leak"],
    text: "Copied from her notebook, which travelled with the family from Omsk to Karaganda in the bundle of photographs. Cream the butter with the sugar, beat in the eggs, add flour and salt. Roll two thirds of the dough into the tin, sprinkle with semolina, add the cherries. Cut the rest into strips and lay them as a lattice. Bake forty minutes, until the lattice turns golden.",
    note: "In Omsk she used bird cherry instead, in Karaganda dried apricots. In Zug, Giulia bakes it with cherries, as it was meant to be.",
  },
  stories: [
    {
      scene: "river", chapter: "Origins", title: "The mill near Bern", who: "Jakob Müller, 1648–1712", caption: "The Aare, 1674",
      text: "The first Müller we know by name kept a mill on the river Aare near Bern. No records survive — only the surname, which simply means “miller”, and a story handed down from grandfather to grandson. In the spring of 1674 the water rose so high that it carried off the wheel together with the barn. Jakob and his wife Verena loaded what was left onto a cart and went north to the Palatinate, where the Elector was calling for settlers and promising land.",
      quote: "The water takes, and the water gives.",
    },
    {
      scene: "river", chapter: "The road", title: "The road to the Volga", who: "Georg and Margaretha Müller, 1766", caption: "Lübeck — Saratov, 1766",
      text: "In 1766, in Darmstadt, Georg read the manifesto of the Russian Empress: land, thirty years without taxes and freedom of faith. That spring he, Margaretha and four-year-old Friedrich set off — by sea from Lübeck to Kronstadt, then by river and by sledge to Saratov. The journey took almost a year. The family said Margaretha brought only a chest of seeds and a Bible, and the seeds came up the very next spring.",
    },
    {
      scene: "village", chapter: "Childhood", title: "A colony on the Volga", who: "Heinrich Müller, 1790–1858", caption: "A colony near Saratov",
      text: "Heinrich was born in the colony. At home they spoke German, at the market Russian, and in church they sang the old hymns from Hesse. In summer the children herded geese on the water meadows; in winter they went to the church school: catechism, sums and handwriting. Heinrich's copybook is lost, but his saying survived — all his grandchildren repeated it.",
      quote: "Bread grows where you have sown it.",
    },
    {
      scene: "pier", chapter: "Love", title: "The girl from Kraków", who: "Zofia Müller, née Kowalska, 1822–1891", caption: "Odessa, the pier, 1844",
      text: "Zofia came to Odessa to work in her uncle's shop, and in her first week she met Andreas Müller on the pier, loading grain onto a steamer. Her family was against her marrying a German colonist; his was against a Catholic bride. They married with almost no guests and lived together for forty-six years. Zofia's ring with its small garnet is still kept by Aunt Elena in Hanover.",
    },
    {
      scene: "river", chapter: "Leaving home", title: "The brother who went to Nebraska", who: "Johann Müller, 1876–1950", caption: "Bremen — New York, 1903",
      text: "In 1903 Johann, the younger brother of great-grandfather Karl, sailed from Bremen to New York and went on by train to Lincoln, Nebraska, where other Volga Germans had settled. He wrote home once a year, at Christmas, always with a pressed prairie flower in the envelope. The last letter came in 1938. We haven't found his descendants yet — perhaps one day they will find this book.",
    },
    {
      scene: "village", chapter: "Work", title: "A farm in Siberia", who: "Karl and Natalja Müller, 1898", caption: "Near Omsk, 1910",
      text: "Karl and Natalja moved to the land near Omsk when it was being given out. The first winter they lived in a dugout and burned dried dung; in spring Karl built a house of larch with his own hands. By 1910 they had twelve cows and a small dairy. The butter went to the station in little barrels, and from there, so they say, to Denmark and England. Natalja kept the accounts in a thick notebook that still exists.",
    },
    {
      scene: "city", chapter: "Hard years", title: "How great-grandfather came to Karaganda", who: "Viktor Müller, 1928–2001", caption: "Karaganda, 1941",
      text: "In September 1941 the whole Müller family was sent from Omsk to Kazakhstan. Viktor was thirteen. He remembered the freight wagon, the steppe without a single tree, and his mother holding the bundle of photographs on her lap the whole way. From the age of fifteen he worked in the mine. He never liked to talk about those years, and only once, as an old man, said one sentence to his grandson.",
      quote: "We survived because we stayed together.",
    },
    {
      scene: "school", chapter: "Love", title: "The teacher from Almaty", who: "Aigul Müller, née Zhanibekova, 1931–2010", caption: "Evening school, 1952",
      text: "Aigul was sent to Karaganda to teach Russian at an evening school. Viktor came for his school certificate — tired after his shift, with coal dust on his eyelashes. A year later they married. Grandma used to laugh that he was the only pupil who never passed her dictation. But every morning, until they were old, he made her tea with milk, the way they drink it in Almaty.",
    },
    {
      scene: "city", chapter: "Leaving home", title: "Ninety-two", who: "Andrej Müller, 1955", caption: "Karaganda — Cologne, 1992",
      text: "We left for Germany with three suitcases and a box of photographs. At the station my father said: “Two hundred years ago we came here, now we are going back.” In Cologne we spent the first year in a hostel for resettlers. I learned German in the evenings and worked on building sites, though back home I had been an engineer. Michael went to a German school and within six months was correcting my grammar.",
      voice: "Listen to Andrej telling it",
    },
    {
      scene: "river", chapter: "The next generation", title: "Zug and our children", who: "Michael Müller, 1981", caption: "Bern, the Aare, 2019",
      text: "In 2015 we moved to Zug. Leon was four; Sofia wasn't born yet. One day we drove to Bern and found the place on the Aare where, the family says, the mill once stood. There's a cycle path there now. So after almost four hundred years the family came back to where it began. Leon asked: “So what are we now?” I am still thinking about what to tell him.",
      voice: "Michael's voice, recorded in 2026",
    },
  ],
  endTitle: "This book is a sample",
  endText: "The Müllers are made up, but the book is real: this is how Treename puts together the stories your family tells by voice, with the tree, the map and the photographs. Yours will be made from your own stories.",
  colophon: "The Müller family book · made with Treename · Zug, 2026",
  ui: {
    facts: ["generations", "people in the tree", "countries", "stories"],
    back: "← Home", start: "Start your own book", prev: "Back", next: "Next", open: "Open the book",
    page: "Page", of: "of", hint: "Turn pages with the arrows, a swipe or the buttons", chapter: "Chapter", listen: "Scan to listen",
    eyebrow: "Sample book", lead: "This is what your family's book can look like: stories told by voice, the tree, the map of the family's road and photographs. Leaf through the book of the made-up Müller family.", cta: "Leaf through a sample book",
  },
};
export default en;
