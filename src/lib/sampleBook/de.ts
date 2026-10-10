import type { SampleBookText } from "./types";

const de: SampleBookText = {
  title: "Die Müllers",
  subtitle: "Fünfzehn Generationen einer Familie",
  years: "1620 — 2026",
  motto: "Brot wächst, wo man sät",
  dedication: "Für Leon und Sofia – damit sie wissen, woher sie kommen.\nUnd für alle, die erzählt haben, während wir aufschrieben.",
  contents: "Inhalt",
  treeTitle: "Unsere Linie",
  treeNote: "Die direkte Linie von Hans Müller, einem Müller bei Bern, bis zu Leon und Sofia. Im Stammbaum stehen noch über hundert weitere: Brüder, Schwestern und ihre Familien.",
  treeFrom: "aus",
  mapTitle: "Der Weg der Familie",
  mapNote: "Fast vierhundert Jahre und neuntausend Kilometer: von der Schweiz an die Wolga, nach Sibirien und in die kasachische Steppe – und zurück in die Schweiz.",
  stops: [
    "Bern – die Mühle an der Aare",
    "Mannheim – nach dem Hochwasser",
    "Saratow – eine Kolonie an der Wolga",
    "Odessa – am Schwarzen Meer",
    "Omsk – ein Hof in Sibirien",
    "Karaganda – Deportation",
    "Köln – die Rückkehr",
    "Zug – wieder in der Schweiz",
  ],
  recipe: {
    chapter: "Traditionen",
    title: "Oma Lidias Kirschkuchen",
    who: "Lidia Müller, geb. Schmidt, 1904–1979",
    ingredientsTitle: "Man braucht",
    ingredients: ["500 g Mehl", "250 g Butter", "150 g Zucker", "3 Eier", "1 Prise Salz", "1 kg entsteinte Kirschen", "2 Löffel Griess, damit nichts durchläuft"],
    text: "Abgeschrieben aus ihrem Heft, das mit der Familie von Omsk nach Karaganda reiste – im Bündel mit den Fotos. Butter mit Zucker schaumig rühren, Eier unterschlagen, Mehl und Salz dazu. Zwei Drittel des Teigs in die Form, mit Griess bestreuen, Kirschen darauf. Aus dem Rest Streifen schneiden und als Gitter legen. Vierzig Minuten backen, bis das Gitter golden ist.",
    note: "In Omsk nahm sie Traubenkirschen, in Karaganda getrocknete Aprikosen. In Zug backt Giulia ihn mit Kirschen – so, wie er gedacht war.",
  },
  stories: [
    {
      scene: "river", chapter: "Ursprung", title: "Die Mühle bei Bern", who: "Jakob Müller, 1648–1712", caption: "Die Aare, 1674",
      text: "Der erste Müller, den wir beim Namen kennen, betrieb eine Mühle an der Aare bei Bern. Urkunden gibt es keine – nur den Namen, der ja «Müller» bedeutet, und eine Geschichte, die vom Grossvater zum Enkel weiterging. Im Frühling 1674 stieg das Wasser so hoch, dass es das Rad samt Scheune mitriss. Jakob und seine Frau Verena luden, was übrig war, auf einen Wagen und zogen nach Norden in die Pfalz, wo der Kurfürst Siedler rief und Land versprach.",
      quote: "Das Wasser nimmt, und das Wasser gibt.",
    },
    {
      scene: "river", chapter: "Der Weg", title: "Der Weg an die Wolga", who: "Georg und Margaretha Müller, 1766", caption: "Lübeck – Saratow, 1766",
      text: "1766 las Georg in Darmstadt das Manifest der russischen Zarin: Land, dreissig Jahre ohne Steuern und Glaubensfreiheit. Im Frühling brachen er, Margaretha und der vierjährige Friedrich auf – von Lübeck übers Meer nach Kronstadt, dann über Flüsse und mit dem Schlitten bis Saratow. Die Reise dauerte fast ein Jahr. In der Familie hiess es, Margaretha habe nur eine Truhe mit Saatgut und die Bibel mitgenommen – und die Saat ging schon im nächsten Frühling auf.",
    },
    {
      scene: "village", chapter: "Kindheit", title: "Eine Kolonie an der Wolga", who: "Heinrich Müller, 1790–1858", caption: "Kolonie bei Saratow",
      text: "Heinrich kam schon in der Kolonie zur Welt. Zu Hause sprach man Deutsch, auf dem Markt Russisch, und in der Kirche sang man die alten hessischen Lieder. Im Sommer hüteten die Kinder Gänse auf den Auwiesen, im Winter gingen sie in die Kirchenschule: Katechismus, Rechnen und Schönschrift. Heinrichs Schreibheft ist verloren, aber sein Spruch ist geblieben – alle Enkel haben ihn wiederholt.",
      quote: "Brot wächst dort, wo du es gesät hast.",
    },
    {
      scene: "pier", chapter: "Liebe", title: "Die Polin aus Krakau", who: "Zofia Müller, geb. Kowalska, 1822–1891", caption: "Odessa, am Hafen, 1844",
      text: "Zofia kam nach Odessa, um im Laden ihres Onkels zu arbeiten, und traf schon in der ersten Woche am Hafen Andreas Müller, der Getreide auf einen Dampfer lud. Ihre Familie war gegen die Heirat mit einem deutschen Kolonisten, seine gegen eine Katholikin. Sie heirateten fast ohne Gäste und lebten sechsundvierzig Jahre zusammen. Zofias Ring mit dem kleinen Granat bewahrt heute Tante Elena in Hannover auf.",
    },
    {
      scene: "river", chapter: "Aufbruch", title: "Der Bruder, der nach Nebraska ging", who: "Johann Müller, 1876–1950", caption: "Bremen – New York, 1903",
      text: "1903 fuhr Johann, der jüngere Bruder von Urgrossvater Karl, von Bremen nach New York und weiter mit dem Zug nach Lincoln in Nebraska, wo schon andere Wolgadeutsche lebten. Er schrieb einmal im Jahr, zu Weihnachten, und legte immer eine gepresste Prärieblume in den Umschlag. Der letzte Brief kam 1938. Seine Nachkommen haben wir noch nicht gefunden – vielleicht finden sie eines Tages dieses Buch.",
    },
    {
      scene: "village", chapter: "Arbeit", title: "Ein Hof in Sibirien", who: "Karl und Natalja Müller, 1898", caption: "Bei Omsk, 1910",
      text: "Karl und Natalja zogen in die Gegend von Omsk, als dort Land verteilt wurde. Den ersten Winter wohnten sie in einer Erdhütte und heizten mit getrocknetem Mist, im Frühling baute Karl selbst ein Haus aus Lärchenholz. 1910 hatten sie zwölf Kühe und eine kleine Molkerei. Die Butter kam in Fässchen zum Bahnhof und ging von dort, so erzählt man, nach Dänemark und England. Natalja führte die Bücher in einem dicken Heft, das es noch heute gibt.",
    },
    {
      scene: "city", chapter: "Schwere Jahre", title: "Wie Urgrossvater nach Karaganda kam", who: "Viktor Müller, 1928–2001", caption: "Karaganda, 1941",
      text: "Im September 1941 wurde die ganze Familie Müller von Omsk nach Kasachstan geschickt. Viktor war dreizehn. Er erinnerte sich an den Güterwagen, an die Steppe ohne einen einzigen Baum und an seine Mutter, die den ganzen Weg das Bündel mit den Fotos auf dem Schoss hielt. Ab fünfzehn arbeitete er im Bergwerk. Über diese Jahre sprach er nicht gern, nur einmal, schon alt, sagte er seinem Enkel einen Satz.",
      quote: "Wir haben überlebt, weil wir zusammengehalten haben.",
    },
    {
      scene: "school", chapter: "Liebe", title: "Die Lehrerin aus Almaty", who: "Aigul Müller, geb. Zhanibekova, 1931–2010", caption: "Abendschule, 1952",
      text: "Aigul wurde nach Karaganda geschickt, um an einer Abendschule Russisch zu unterrichten. Viktor kam für seinen Schulabschluss – müde nach der Schicht, mit Kohlenstaub an den Wimpern. Ein Jahr später heirateten sie. Oma lachte, er sei ihr einziger Schüler gewesen, der das Diktat nie bestanden habe. Dafür kochte er ihr bis ins hohe Alter jeden Morgen Tee mit Milch – so, wie man ihn in Almaty trinkt.",
    },
    {
      scene: "city", chapter: "Aufbruch", title: "Zweiundneunzig", who: "Andrej Müller, 1955", caption: "Karaganda – Köln, 1992",
      text: "Wir fuhren nach Deutschland mit drei Koffern und einer Schachtel Fotos. Am Bahnhof sagte mein Vater: «Vor zweihundert Jahren sind wir hierher gefahren, jetzt fahren wir zurück.» In Köln wohnten wir das erste Jahr in einem Übergangswohnheim für Aussiedler. Abends lernte ich Deutsch, tagsüber arbeitete ich auf dem Bau, obwohl ich zu Hause Ingenieur gewesen war. Michael kam in eine deutsche Schule und verbesserte nach einem halben Jahr schon meine Grammatik.",
      voice: "Hören Sie, wie Andrej es erzählt",
    },
    {
      scene: "river", chapter: "Die nächste Generation", title: "Zug und unsere Kinder", who: "Michael Müller, 1981", caption: "Bern, die Aare, 2019",
      text: "2015 zogen wir nach Zug. Leon war vier, Sofia noch nicht geboren. Einmal fuhren wir nach Bern und fanden an der Aare die Stelle, an der laut Familienlegende die Mühle stand. Heute führt dort ein Veloweg vorbei. Nach fast vierhundert Jahren ist die Familie also dorthin zurückgekehrt, wo sie angefangen hat. Leon fragte: «Und was sind wir jetzt?» Ich überlege noch immer, was ich ihm antworten soll.",
      voice: "Michaels Stimme, aufgenommen 2026",
    },
  ],
  endTitle: "Dieses Buch ist ein Beispiel",
  endText: "Die Müllers sind erfunden, das Buch ist echt: So stellt Treename die Geschichten zusammen, die Ihre Familie mit ihrer Stimme erzählt – mit Stammbaum, Karte und Fotos. Ihres entsteht aus Ihren eigenen Geschichten.",
  colophon: "Das Familienbuch der Müllers · gemacht mit Treename · Zug, 2026",
  ui: {
    facts: ["Generationen", "Menschen im Stammbaum", "Länder", "Geschichten"],
    back: "← Startseite", start: "Eigenes Buch beginnen", prev: "Zurück", next: "Weiter", open: "Buch öffnen",
    page: "Seite", of: "von", hint: "Blättern mit den Pfeiltasten, durch Wischen oder mit den Knöpfen", chapter: "Kapitel", listen: "Scannen und zuhören",
    eyebrow: "Beispielbuch", lead: "So kann das Buch Ihrer Familie aussehen: Geschichten, mit der Stimme erzählt, Stammbaum, Karte des Familienwegs und Fotos. Blättern Sie im Buch der erfundenen Familie Müller.", cta: "Im Beispielbuch blättern",
  },
};
export default de;
