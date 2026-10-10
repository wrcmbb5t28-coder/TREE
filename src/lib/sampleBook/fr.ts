import type { SampleBookText } from "./types";

const fr: SampleBookText = {
  title: "Les Müller",
  subtitle: "Quinze générations d'une même famille",
  years: "1620 — 2026",
  motto: "Le pain pousse où l'on sème",
  dedication: "Pour Leon et Sofia, afin qu'ils sachent d'où ils viennent.\nEt pour tous ceux qui ont raconté pendant que nous écrivions.",
  contents: "Sommaire",
  treeTitle: "Notre lignée",
  treeNote: "La lignée directe, de Hans Müller, meunier près de Berne, jusqu'à Leon et Sofia. L'arbre de la famille compte plus de cent autres personnes : frères, sœurs et leurs familles.",
  treeFrom: "de",
  mapTitle: "Le chemin de la famille",
  mapNote: "Près de quatre cents ans et neuf mille kilomètres : de la Suisse à la Volga, en Sibérie et dans la steppe kazakhe — puis retour en Suisse.",
  stops: [
    "Berne — le moulin sur l'Aar",
    "Mannheim — après la crue",
    "Saratov — une colonie sur la Volga",
    "Odessa — au bord de la mer Noire",
    "Omsk — une ferme en Sibérie",
    "Karaganda — la déportation",
    "Cologne — le retour",
    "Zoug — de nouveau la Suisse",
  ],
  recipe: {
    chapter: "Traditions",
    title: "La tarte aux cerises de grand-mère Lidia",
    who: "Lidia Müller, née Schmidt, 1904–1979",
    ingredientsTitle: "Il faut",
    ingredients: ["500 g de farine", "250 g de beurre", "150 g de sucre", "3 œufs", "une pincée de sel", "1 kg de cerises dénoyautées", "2 cuillères de semoule, pour que ça ne coule pas"],
    text: "Recopiée de son cahier, qui a voyagé avec la famille d'Omsk à Karaganda dans le baluchon des photos. Travailler le beurre avec le sucre, ajouter les œufs, puis la farine et le sel. Étaler deux tiers de la pâte dans le moule, saupoudrer de semoule, garnir de cerises. Découper le reste en bandes et les poser en croisillons. Cuire quarante minutes, jusqu'à ce que le croisillon soit doré.",
    note: "À Omsk, elle mettait des merises ; à Karaganda, des abricots secs. À Zoug, Giulia la fait avec des cerises, comme prévu.",
  },
  stories: [
    {
      scene: "river", chapter: "Les origines", title: "Le moulin près de Berne", who: "Jakob Müller, 1648–1712", caption: "L'Aar, 1674",
      text: "Le premier Müller que nous connaissons par son nom tenait un moulin sur l'Aar, près de Berne. Il ne reste aucun document — seulement le nom, qui veut dire « meunier », et une histoire transmise de grand-père en petit-fils. Au printemps 1674, l'eau monta si haut qu'elle emporta la roue avec la grange. Jakob et sa femme Verena chargèrent ce qui restait sur une charrette et partirent vers le nord, dans le Palatinat, où le prince-électeur appelait des colons et promettait des terres.",
      quote: "L'eau prend, et l'eau donne.",
    },
    {
      scene: "river", chapter: "La route", title: "La route de la Volga", who: "Georg et Margaretha Müller, 1766", caption: "Lübeck — Saratov, 1766",
      text: "En 1766, à Darmstadt, Georg lut le manifeste de l'impératrice de Russie : des terres, trente ans sans impôts et la liberté de culte. Au printemps, il partit avec Margaretha et le petit Friedrich, quatre ans — par la mer de Lübeck à Kronstadt, puis par les rivières et en traîneau jusqu'à Saratov. Le voyage dura presque un an. On disait dans la famille que Margaretha n'avait emporté qu'un coffre de semences et la Bible, et que les semences levèrent dès le printemps suivant.",
    },
    {
      scene: "village", chapter: "L'enfance", title: "Une colonie sur la Volga", who: "Heinrich Müller, 1790–1858", caption: "Une colonie près de Saratov",
      text: "Heinrich naquit dans la colonie. À la maison on parlait allemand, au marché russe, et à l'église on chantait les vieux cantiques de Hesse. L'été, les enfants gardaient les oies dans les prés inondables ; l'hiver, ils allaient à l'école paroissiale : catéchisme, calcul et écriture. Le cahier d'Heinrich s'est perdu, mais son dicton est resté — tous ses petits-enfants le répétaient.",
      quote: "Le pain pousse là où tu l'as semé.",
    },
    {
      scene: "pier", chapter: "L'amour", title: "La Polonaise de Cracovie", who: "Zofia Müller, née Kowalska, 1822–1891", caption: "Odessa, le quai, 1844",
      text: "Zofia vint à Odessa travailler dans la boutique de son oncle et, dès la première semaine, rencontra sur le quai Andreas Müller, qui chargeait du grain sur un vapeur. Sa famille ne voulait pas d'un colon allemand, la sienne pas d'une catholique. Ils se marièrent presque sans invités et vécurent ensemble quarante-six ans. La bague de Zofia, avec son petit grenat, est aujourd'hui chez tante Elena, à Hanovre.",
    },
    {
      scene: "river", chapter: "Le départ", title: "Le frère parti au Nebraska", who: "Johann Müller, 1876–1950", caption: "Brême — New York, 1903",
      text: "En 1903, Johann, le frère cadet de l'arrière-grand-père Karl, embarqua à Brême pour New York, puis prit le train jusqu'à Lincoln, au Nebraska, où vivaient déjà des Allemands de la Volga. Il écrivait une fois par an, à Noël, et glissait toujours une fleur de prairie séchée dans l'enveloppe. La dernière lettre arriva en 1938. Nous n'avons pas encore retrouvé ses descendants — peut-être trouveront-ils un jour ce livre.",
    },
    {
      scene: "village", chapter: "Le travail", title: "Une ferme en Sibérie", who: "Karl et Natalja Müller, 1898", caption: "Près d'Omsk, 1910",
      text: "Karl et Natalja s'installèrent près d'Omsk quand on y distribuait des terres. Le premier hiver, ils vécurent dans une hutte creusée dans le sol et se chauffèrent à la bouse séchée ; au printemps, Karl construisit lui-même une maison en mélèze. En 1910, ils avaient douze vaches et une petite laiterie. Le beurre partait en tonnelets à la gare et, dit-on, jusqu'au Danemark et en Angleterre. Natalja tenait les comptes dans un gros cahier qui existe toujours.",
    },
    {
      scene: "city", chapter: "Les années dures", title: "Comment l'arrière-grand-père arriva à Karaganda", who: "Viktor Müller, 1928–2001", caption: "Karaganda, 1941",
      text: "En septembre 1941, toute la famille Müller fut envoyée d'Omsk au Kazakhstan. Viktor avait treize ans. Il se souvenait du wagon de marchandises, de la steppe sans un seul arbre et de sa mère qui garda tout le voyage sur ses genoux le baluchon de photos. Dès quinze ans, il travailla à la mine. Il n'aimait pas parler de ces années et ne dit qu'une fois, déjà vieux, une phrase à son petit-fils.",
      quote: "Nous avons survécu parce que nous sommes restés ensemble.",
    },
    {
      scene: "school", chapter: "L'amour", title: "L'institutrice d'Almaty", who: "Aigul Müller, née Zhanibekova, 1931–2010", caption: "École du soir, 1952",
      text: "Aigul fut envoyée à Karaganda pour enseigner le russe dans une école du soir. Viktor y vint pour son certificat — fatigué après son poste, de la poussière de charbon sur les cils. Un an plus tard, ils se marièrent. Grand-mère riait : c'était son seul élève à n'avoir jamais réussi la dictée. Mais chaque matin, jusqu'à la vieillesse, il lui préparait du thé au lait, comme on le boit à Almaty.",
    },
    {
      scene: "city", chapter: "Le départ", title: "Quatre-vingt-douze", who: "Andrej Müller, 1955", caption: "Karaganda — Cologne, 1992",
      text: "Nous sommes partis pour l'Allemagne avec trois valises et une boîte de photos. À la gare, mon père a dit : « Il y a deux cents ans, nous sommes venus ici ; maintenant nous repartons. » À Cologne, nous avons passé la première année dans un foyer pour rapatriés. J'apprenais l'allemand le soir et je travaillais sur des chantiers, alors que chez nous j'étais ingénieur. Michael est entré dans une école allemande et, six mois plus tard, corrigeait déjà ma grammaire.",
      voice: "Écoutez Andrej le raconter",
    },
    {
      scene: "river", chapter: "La génération suivante", title: "Zoug et nos enfants", who: "Michael Müller, 1981", caption: "Berne, l'Aar, 2019",
      text: "En 2015, nous avons déménagé à Zoug. Leon avait quatre ans, Sofia n'était pas encore née. Un jour, nous sommes allés à Berne et avons trouvé, au bord de l'Aar, l'endroit où, selon la légende familiale, se trouvait le moulin. Il y a maintenant une piste cyclable. Après presque quatre cents ans, la famille est donc revenue là où elle avait commencé. Leon a demandé : « Et nous, on est quoi maintenant ? » Je cherche encore quoi lui répondre.",
      voice: "La voix de Michael, enregistrée en 2026",
    },
  ],
  endTitle: "Ce livre est un exemple",
  endText: "Les Müller sont inventés, mais le livre est bien réel : c'est ainsi que Treename rassemble les histoires que votre famille raconte de vive voix, avec l'arbre, la carte et les photos. Le vôtre sera fait de vos propres histoires.",
  colophon: "Le livre de la famille Müller · réalisé avec Treename · Zoug, 2026",
  ui: {
    facts: ["générations", "personnes dans l’arbre", "pays", "histoires"],
    back: "← Accueil", start: "Commencer mon livre", prev: "Précédent", next: "Suivant", open: "Ouvrir le livre",
    page: "Page", of: "sur", hint: "Tournez les pages avec les flèches, d'un geste ou avec les boutons", chapter: "Chapitre", listen: "Scannez pour écouter",
    eyebrow: "Livre exemple", lead: "Voici à quoi peut ressembler le livre de votre famille : des histoires racontées de vive voix, l'arbre, la carte du chemin familial et des photos. Feuilletez le livre de la famille inventée Müller.", cta: "Feuilleter un livre exemple",
  },
};
export default fr;
