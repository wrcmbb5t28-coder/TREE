import type { Lang } from "./config";

/** Texts for the illustrated homepage (HOME_DESIGN=comic, the default). Everything else comes from the main dictionaries. */
export type Home5 = {
  eyebrow: string; title: string; sub: string; ctaInside: string;
  heroCaption: string; heroBubble: string;
  ch1Caption: string; ch2Caption: string; chips: [string, string, string];
  stepsTitle: string;
  step3Caption: string; storyLabel: string; toldBy: string; voice: string;
  results: [string, string, string, string];
  insideEyebrow: string; insideTitle: string; insideSub: string;
  archive: { t: string; d: string }; fromStory: string;
  bookCover: string;
  familyEyebrow: string; familyTitle: string; familyBody: string;
  feed: [string, string, string, string];
  giftBubble: string;
};

const en: Home5 = {
  eyebrow: "Family memory, while there’s still someone to tell it",
  title: "Your family’s stories, voices and tree, all in one place",
  sub: "Your parents and grandparents tell their stories by voice, right in WhatsApp. Treename turns them into stories, a living tree and a map of your family’s journey. And everyone in the family can add what they remember, from any country and in their own language.",
  ctaInside: "What’s inside",
  heroCaption: "A family evening",
  heroBubble: "And this is your great-grandfather {name}. He was a ship’s captain…",
  ch1Caption: "{city}, evening", ch2Caption: "{city}, next morning",
  chips: ["What did you eat on holidays?", "Why did you move?", "What was your street like?"],
  stepsTitle: "One question a week, and the family grows closer",
  step3Caption: "A minute later", storyLabel: "Story", toldBy: "told by {name}", voice: "Voice",
  results: ["added to the tree", "marked on the map", "in the timeline", "kept for good"],
  insideEyebrow: "What’s inside", insideTitle: "Four things that stay with your family",
  insideSub: "Everything is connected: a story leads to a person in the tree, a person to their towns on the map, and the best of it goes into a book.",
  archive: { t: "An archive of voices", d: "Every story keeps its recording. In twenty years your grandchildren will hear how Grandma laughed, not just read it." },
  fromStory: "from a story",
  bookCover: "Family stories",
  familyEyebrow: "With the whole family",
  familyTitle: "One family, one place, even across countries",
  familyBody: "Invite your brother, your aunt, your grown-up children. Everyone sees everything and adds their own: a photo, a correction, a question. In their own language.",
  feed: ["{name}, {city}: added a wedding photo from 1988", "{name}, {city}: corrected the year they moved", "{name}: reads Grandma’s stories in German", "{name}: listens to Grandma’s voice at bedtime"],
  giftBubble: "This is for you: a whole year of stories!",
};

const de: Home5 = {
  eyebrow: "Familiengedächtnis – solange es jemand erzählen kann",
  title: "Geschichten, Stimmen und Stammbaum eurer Familie – an einem Ort",
  sub: "Eltern und Großeltern erzählen ihre Geschichten per Sprachnachricht, direkt in WhatsApp. Treename macht daraus Geschichten, einen lebendigen Stammbaum und eine Karte eurer Familienwege. Und jede und jeder in der Familie kann ergänzen, aus jedem Land und in der eigenen Sprache.",
  ctaInside: "Was drin ist",
  heroCaption: "Ein Familienabend",
  heroBubble: "Und das ist dein Urgroßvater {name}. Er war Kapitän auf einem Schiff…",
  ch1Caption: "{city}, abends", ch2Caption: "{city}, am nächsten Morgen",
  chips: ["Was gab es an Feiertagen?", "Warum seid ihr umgezogen?", "Wie war eure Straße?"],
  stepsTitle: "Eine Frage pro Woche – und die Familie rückt zusammen",
  step3Caption: "Eine Minute später", storyLabel: "Geschichte", toldBy: "erzählt von {name}", voice: "Stimme",
  results: ["im Stammbaum", "auf der Karte", "in der Chronik", "für immer bewahrt"],
  insideEyebrow: "Was drin ist", insideTitle: "Vier Dinge, die eurer Familie bleiben",
  insideSub: "Alles hängt zusammen: Eine Geschichte führt zu einem Menschen im Stammbaum, ein Mensch zu seinen Orten auf der Karte, und das Schönste kommt ins Buch.",
  archive: { t: "Ein Archiv der Stimmen", d: "Jede Geschichte behält ihre Aufnahme. In zwanzig Jahren hören eure Enkel, wie Oma gelacht hat – nicht nur, was sie gesagt hat." },
  fromStory: "aus einer Geschichte",
  bookCover: "Familiengeschichten",
  familyEyebrow: "Mit der ganzen Familie",
  familyTitle: "Eine Familie, ein Ort – auch über Ländergrenzen",
  familyBody: "Ladet Bruder, Tante und erwachsene Kinder ein. Alle sehen alles und ergänzen ihres: ein Foto, eine Korrektur, eine Frage. In der eigenen Sprache.",
  feed: ["{name}, {city}: hat ein Hochzeitsfoto von 1988 ergänzt", "{name}, {city}: hat das Umzugsjahr korrigiert", "{name}: liest Omas Geschichten auf Englisch", "{name}: hört abends Omas Stimme"],
  giftBubble: "Für euch: ein ganzes Jahr voller Geschichten!",
};

const fr: Home5 = {
  eyebrow: "La mémoire de la famille, tant qu’il reste quelqu’un pour la raconter",
  title: "Les histoires, les voix et l’arbre de votre famille, au même endroit",
  sub: "Vos parents et grands-parents racontent leurs histoires de vive voix, directement dans WhatsApp. Treename en fait des récits, un arbre vivant et une carte du parcours de votre famille. Et chacun peut ajouter ses souvenirs, depuis n’importe quel pays et dans sa langue.",
  ctaInside: "Ce qu’on y trouve",
  heroCaption: "Une soirée en famille",
  heroBubble: "Et voici ton arrière-grand-père {name}. Il était capitaine de navire…",
  ch1Caption: "{city}, le soir", ch2Caption: "{city}, le lendemain matin",
  chips: ["Que mangiez-vous les jours de fête ?", "Pourquoi avoir déménagé ?", "Comment était votre rue ?"],
  stepsTitle: "Une question par semaine, et la famille se rapproche",
  step3Caption: "Une minute plus tard", storyLabel: "Histoire", toldBy: "racontée par {name}", voice: "Voix",
  results: ["ajouté à l’arbre", "placé sur la carte", "dans la chronologie", "gardée pour toujours"],
  insideEyebrow: "Ce qu’on y trouve", insideTitle: "Quatre choses qui restent à votre famille",
  insideSub: "Tout est relié : une histoire mène à une personne dans l’arbre, une personne à ses villes sur la carte, et le meilleur entre dans un livre.",
  archive: { t: "Des voix archivées", d: "Chaque histoire garde son enregistrement. Dans vingt ans, vos petits-enfants entendront le rire de Mamie, pas seulement ses mots." },
  fromStory: "d’une histoire",
  bookCover: "Histoires de famille",
  familyEyebrow: "Avec toute la famille",
  familyTitle: "Une famille, un seul endroit, même entre plusieurs pays",
  familyBody: "Invitez votre frère, votre tante, vos enfants adultes. Chacun voit tout et ajoute le sien : une photo, une correction, une question. Dans sa propre langue.",
  feed: ["{name}, {city} : a ajouté une photo de mariage de 1988", "{name}, {city} : a corrigé l’année du déménagement", "{name} : lit les histoires de Mamie en anglais", "{name} : écoute la voix de Mamie le soir"],
  giftBubble: "C’est pour vous : une année entière d’histoires !",
};

const it: Home5 = {
  eyebrow: "La memoria di famiglia, finché c’è chi la racconta",
  title: "Storie, voci e albero della vostra famiglia, in un solo posto",
  sub: "Genitori e nonni raccontano le loro storie a voce, direttamente su WhatsApp. Treename le trasforma in racconti, in un albero vivo e in una mappa del cammino della famiglia. E tutti in famiglia possono aggiungere i propri ricordi, da qualsiasi paese e nella propria lingua.",
  ctaInside: "Cosa c’è dentro",
  heroCaption: "Una sera in famiglia",
  heroBubble: "E questo è il tuo bisnonno {name}. Era capitano di una nave…",
  ch1Caption: "{city}, sera", ch2Caption: "{city}, il mattino dopo",
  chips: ["Cosa mangiavate alle feste?", "Perché vi siete trasferiti?", "Com’era la vostra strada?"],
  stepsTitle: "Una domanda alla settimana, e la famiglia si avvicina",
  step3Caption: "Un minuto dopo", storyLabel: "Storia", toldBy: "raccontata da {name}", voice: "Voce",
  results: ["nell’albero", "sulla mappa", "nella cronologia", "custodita per sempre"],
  insideEyebrow: "Cosa c’è dentro", insideTitle: "Quattro cose che restano alla famiglia",
  insideSub: "Tutto è collegato: una storia porta a una persona nell’albero, una persona alle sue città sulla mappa, e il meglio finisce in un libro.",
  archive: { t: "Un archivio di voci", d: "Ogni storia conserva la registrazione. Tra vent’anni i nipoti sentiranno come rideva la nonna, non solo cosa diceva." },
  fromStory: "da una storia",
  bookCover: "Storie di famiglia",
  familyEyebrow: "Con tutta la famiglia",
  familyTitle: "Una famiglia, un solo posto, anche in paesi diversi",
  familyBody: "Invitate fratelli, zie, figli adulti. Tutti vedono tutto e aggiungono il proprio: una foto, una correzione, una domanda. Nella propria lingua.",
  feed: ["{name}, {city}: ha aggiunto una foto del matrimonio del 1988", "{name}, {city}: ha corretto l’anno del trasloco", "{name}: legge le storie della nonna in inglese", "{name}: ascolta la voce della nonna prima di dormire"],
  giftBubble: "È per voi: un anno intero di storie!",
};

const es: Home5 = {
  eyebrow: "La memoria de la familia, mientras quede quien la cuente",
  title: "Las historias, las voces y el árbol de tu familia, en un solo lugar",
  sub: "Tus padres y abuelos cuentan sus historias con su voz, directamente en WhatsApp. Treename las convierte en relatos, un árbol vivo y un mapa del camino de tu familia. Y toda la familia puede añadir lo que recuerda, desde cualquier país y en su idioma.",
  ctaInside: "Qué incluye",
  heroCaption: "Una tarde en familia",
  heroBubble: "Y este es tu bisabuelo {name}. Era capitán de barco…",
  ch1Caption: "{city}, por la tarde", ch2Caption: "{city}, a la mañana siguiente",
  chips: ["¿Qué comíais en las fiestas?", "¿Por qué os mudasteis?", "¿Cómo era vuestra calle?"],
  stepsTitle: "Una pregunta por semana, y la familia se acerca",
  step3Caption: "Un minuto después", storyLabel: "Historia", toldBy: "contada por {name}", voice: "Voz",
  results: ["en el árbol", "en el mapa", "en la cronología", "guardada para siempre"],
  insideEyebrow: "Qué incluye", insideTitle: "Cuatro cosas que se quedan con tu familia",
  insideSub: "Todo está conectado: una historia lleva a una persona del árbol, una persona a sus ciudades en el mapa, y lo mejor acaba en un libro.",
  archive: { t: "Un archivo de voces", d: "Cada historia guarda su grabación. Dentro de veinte años tus nietos oirán cómo se reía la abuela, no solo lo que decía." },
  fromStory: "de una historia",
  bookCover: "Historias de familia",
  familyEyebrow: "Con toda la familia",
  familyTitle: "Una familia, un lugar, aunque viváis en distintos países",
  familyBody: "Invita a tu hermano, a tu tía, a tus hijos mayores. Todos lo ven todo y añaden lo suyo: una foto, una corrección, una pregunta. En su propio idioma.",
  feed: ["{name}, {city}: añadió una foto de la boda de 1988", "{name}, {city}: corrigió el año de la mudanza", "{name}: lee las historias de la abuela en inglés", "{name}: escucha la voz de la abuela antes de dormir"],
  giftBubble: "Es para vosotros: ¡un año entero de historias!",
};

const ru: Home5 = {
  eyebrow: "Семейная память — пока есть кому рассказать",
  title: "Истории, голоса и древо вашей семьи — в одном месте",
  sub: "Родные рассказывают голосом прямо в WhatsApp. Treename превращает рассказы в истории, живое древо и карту пути семьи. А добавлять своё может вся семья — из любой страны и на своём языке.",
  ctaInside: "Что внутри",
  heroCaption: "Семейный вечер",
  heroBubble: "А это твой прадед {name} — он был капитаном корабля…",
  ch1Caption: "{city}, вечер", ch2Caption: "{city}, утро",
  chips: ["Что ели на праздник?", "Почему вы переехали?", "Какой была ваша улица?"],
  stepsTitle: "Один вопрос в неделю — и семья становится ближе",
  step3Caption: "Через минуту", storyLabel: "История", toldBy: "рассказала {name}", voice: "Голос",
  results: ["встал в древо", "отмечен на карте", "попал в хронику", "сохранён навсегда"],
  insideEyebrow: "Что внутри", insideTitle: "Четыре вещи, которые остаются у семьи",
  insideSub: "Всё связано между собой: история ведёт к человеку в древе, человек — к его городам на карте, а лучшее собирается в книгу.",
  archive: { t: "Архив голосов", d: "Каждый рассказ — с записью голоса. Через двадцать лет внуки услышат, как бабушка смеётся, а не только прочитают." },
  fromStory: "из рассказа",
  bookCover: "История семьи",
  familyEyebrow: "Вместе со всей семьёй",
  familyTitle: "Одна семья — одно место, даже если вы в разных странах",
  familyBody: "Пригласите брата, тётю, взрослых детей. Каждый видит всё и добавляет своё — фото, поправку, вопрос. На своём языке.",
  feed: ["{name}, {city}: добавил фото свадьбы 1988 года", "{name}, {city}: поправила год переезда", "{name}: читает истории бабушки по-английски", "{name}: слушает голос бабушки перед сном"],
  giftBubble: "Это вам — на целый год историй!",
};

export const HOME5: Record<Lang, Home5> = { en, de, fr, it, es, ru };
