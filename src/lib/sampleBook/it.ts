import type { SampleBookText } from "./types";

const it: SampleBookText = {
  title: "I Müller",
  subtitle: "Quindici generazioni di una famiglia",
  years: "1620 — 2026",
  motto: "Il pane cresce dove si semina",
  dedication: "Per Leon e Sofia, perché sappiano da dove vengono.\nE per tutti quelli che hanno raccontato mentre noi scrivevamo.",
  contents: "Indice",
  treeTitle: "La nostra linea",
  treeNote: "La linea diretta da Hans Müller, mugnaio vicino a Berna, fino a Leon e Sofia. Nell'albero di famiglia ci sono più di cento altre persone: fratelli, sorelle e le loro famiglie.",
  treeFrom: "da",
  mapTitle: "Il cammino della famiglia",
  mapNote: "Quasi quattrocento anni e novemila chilometri: dalla Svizzera al Volga, in Siberia e nella steppa kazaka — e di nuovo in Svizzera.",
  stops: [
    "Berna — il mulino sull'Aar",
    "Mannheim — dopo l'alluvione",
    "Saratov — una colonia sul Volga",
    "Odessa — sul Mar Nero",
    "Omsk — una fattoria in Siberia",
    "Karaganda — la deportazione",
    "Colonia — il ritorno",
    "Zugo — di nuovo la Svizzera",
  ],
  recipe: {
    chapter: "Tradizioni",
    title: "La torta di ciliegie di nonna Lidia",
    who: "Lidia Müller, nata Schmidt, 1904–1979",
    ingredientsTitle: "Serve",
    ingredients: ["500 g di farina", "250 g di burro", "150 g di zucchero", "3 uova", "un pizzico di sale", "1 kg di ciliegie snocciolate", "2 cucchiai di semolino, perché non coli"],
    text: "Copiata dal suo quaderno, che viaggiò con la famiglia da Omsk a Karaganda nel fagotto con le fotografie. Lavorare il burro con lo zucchero, aggiungere le uova, poi farina e sale. Stendere due terzi dell'impasto nella teglia, cospargere di semolino, disporre le ciliegie. Con il resto tagliare strisce e posarle a griglia. Cuocere quaranta minuti, finché la griglia è dorata.",
    note: "A Omsk usava il ciliegio a grappoli, a Karaganda le albicocche secche. A Zugo Giulia la prepara con le ciliegie, come doveva essere.",
  },
  stories: [
    {
      scene: "river", chapter: "Le origini", title: "Il mulino vicino a Berna", who: "Jakob Müller, 1648–1712", caption: "L'Aar, 1674",
      text: "Il primo Müller che conosciamo per nome aveva un mulino sull'Aar, vicino a Berna. Non restano documenti — solo il cognome, che vuol dire «mugnaio», e una storia passata da nonno a nipote. Nella primavera del 1674 l'acqua salì così tanto da portarsi via la ruota insieme al fienile. Jakob e la moglie Verena caricarono su un carro quel che era rimasto e partirono verso nord, nel Palatinato, dove il principe elettore chiamava coloni e prometteva terra.",
      quote: "L'acqua prende, e l'acqua dà.",
    },
    {
      scene: "river", chapter: "Il viaggio", title: "La strada per il Volga", who: "Georg e Margaretha Müller, 1766", caption: "Lubecca — Saratov, 1766",
      text: "Nel 1766, a Darmstadt, Georg lesse il manifesto dell'imperatrice di Russia: terra, trent'anni senza tasse e libertà di fede. In primavera partì con Margaretha e il piccolo Friedrich di quattro anni — per mare da Lubecca a Kronštadt, poi lungo i fiumi e in slitta fino a Saratov. Il viaggio durò quasi un anno. In famiglia si diceva che Margaretha avesse portato solo una cassa di semi e la Bibbia, e i semi germogliarono già la primavera dopo.",
    },
    {
      scene: "village", chapter: "L'infanzia", title: "Una colonia sul Volga", who: "Heinrich Müller, 1790–1858", caption: "Una colonia vicino a Saratov",
      text: "Heinrich nacque già nella colonia. In casa si parlava tedesco, al mercato russo, e in chiesa si cantavano i vecchi inni dell'Assia. D'estate i bambini badavano alle oche nei prati lungo il fiume; d'inverno andavano alla scuola della parrocchia: catechismo, aritmetica e calligrafia. Il quaderno di Heinrich è andato perduto, ma il suo detto è rimasto — tutti i nipoti lo ripetevano.",
      quote: "Il pane cresce dove l'hai seminato.",
    },
    {
      scene: "pier", chapter: "L'amore", title: "La polacca di Cracovia", who: "Zofia Müller, nata Kowalska, 1822–1891", caption: "Odessa, il molo, 1844",
      text: "Zofia arrivò a Odessa per lavorare nella bottega dello zio e già nella prima settimana incontrò sul molo Andreas Müller, che caricava grano su un piroscafo. La sua famiglia non voleva un colono tedesco, quella di lui non voleva una cattolica. Si sposarono quasi senza invitati e vissero insieme quarantasei anni. L'anello di Zofia con il piccolo granato lo custodisce ancora zia Elena, a Hannover.",
    },
    {
      scene: "river", chapter: "La partenza", title: "Il fratello partito per il Nebraska", who: "Johann Müller, 1876–1950", caption: "Brema — New York, 1903",
      text: "Nel 1903 Johann, il fratello minore del bisnonno Karl, salpò da Brema per New York e proseguì in treno fino a Lincoln, nel Nebraska, dove vivevano già altri tedeschi del Volga. Scriveva una volta all'anno, a Natale, e metteva sempre nella busta un fiore di prateria essiccato. L'ultima lettera arrivò nel 1938. I suoi discendenti non li abbiamo ancora trovati — forse un giorno troveranno loro questo libro.",
    },
    {
      scene: "village", chapter: "Il lavoro", title: "Una fattoria in Siberia", who: "Karl e Natalja Müller, 1898", caption: "Vicino a Omsk, 1910",
      text: "Karl e Natalja si trasferirono vicino a Omsk quando lì si distribuiva la terra. Il primo inverno vissero in una capanna scavata nel terreno, scaldandosi con lo sterco secco; in primavera Karl costruì da solo una casa di larice. Nel 1910 avevano dodici mucche e un piccolo caseificio. Il burro partiva in barilotti per la stazione e da lì, si dice, fino in Danimarca e in Inghilterra. Natalja teneva i conti in un grosso quaderno che esiste ancora.",
    },
    {
      scene: "city", chapter: "Gli anni duri", title: "Come il bisnonno arrivò a Karaganda", who: "Viktor Müller, 1928–2001", caption: "Karaganda, 1941",
      text: "Nel settembre del 1941 tutta la famiglia Müller fu mandata da Omsk in Kazakistan. Viktor aveva tredici anni. Ricordava il vagone merci, la steppa senza un albero e sua madre che tenne in grembo per tutto il viaggio il fagotto con le fotografie. Dai quindici anni lavorò in miniera. Di quegli anni non amava parlare; solo una volta, ormai vecchio, disse una frase al nipote.",
      quote: "Siamo sopravvissuti perché siamo rimasti uniti.",
    },
    {
      scene: "school", chapter: "L'amore", title: "La maestra di Almaty", who: "Aigul Müller, nata Zhanibekova, 1931–2010", caption: "Scuola serale, 1952",
      text: "Aigul fu mandata a Karaganda a insegnare russo in una scuola serale. Viktor ci andò per prendere il diploma — stanco dopo il turno, con la polvere di carbone sulle ciglia. Un anno dopo si sposarono. La nonna rideva: era l'unico allievo che non aveva mai superato il dettato. In compenso, ogni mattina fino alla vecchiaia, le preparava il tè con il latte, come lo si beve ad Almaty.",
    },
    {
      scene: "city", chapter: "La partenza", title: "Novantadue", who: "Andrej Müller, 1955", caption: "Karaganda — Colonia, 1992",
      text: "Partimmo per la Germania con tre valigie e una scatola di fotografie. Alla stazione mio padre disse: «Duecento anni fa siamo venuti qui, ora torniamo indietro». A Colonia passammo il primo anno in un centro per rimpatriati. La sera studiavo tedesco e di giorno lavoravo nei cantieri, anche se a casa ero ingegnere. Michael andò in una scuola tedesca e dopo sei mesi correggeva già la mia grammatica.",
      voice: "Ascoltate Andrej che lo racconta",
    },
    {
      scene: "river", chapter: "La nuova generazione", title: "Zugo e i nostri figli", who: "Michael Müller, 1981", caption: "Berna, l'Aar, 2019",
      text: "Nel 2015 ci siamo trasferiti a Zugo. Leon aveva quattro anni, Sofia non era ancora nata. Un giorno siamo andati a Berna e abbiamo trovato sull'Aar il punto dove, secondo la leggenda di famiglia, sorgeva il mulino. Oggi ci passa una pista ciclabile. Dopo quasi quattrocento anni la famiglia è tornata dove era cominciata. Leon ha chiesto: «E adesso noi chi siamo?» Ci sto ancora pensando.",
      voice: "La voce di Michael, registrata nel 2026",
    },
  ],
  endTitle: "Questo libro è un esempio",
  endText: "I Müller sono inventati, ma il libro è vero: è così che Treename raccoglie le storie che la vostra famiglia racconta a voce, con l'albero, la mappa e le fotografie. Il vostro nascerà dalle vostre storie.",
  colophon: "Il libro della famiglia Müller · realizzato con Treename · Zugo, 2026",
  ui: {
    facts: ["generazioni", "persone nell’albero", "paesi", "storie"],
    back: "← Home", start: "Inizia il tuo libro", prev: "Indietro", next: "Avanti", open: "Apri il libro",
    page: "Pagina", of: "di", hint: "Sfoglia con le frecce, con un gesto o con i pulsanti", chapter: "Capitolo", listen: "Inquadra e ascolta",
    eyebrow: "Libro di esempio", lead: "Ecco come può essere il libro della vostra famiglia: storie raccontate a voce, l'albero, la mappa del cammino e le fotografie. Sfogliate il libro dell'immaginaria famiglia Müller.", cta: "Sfoglia un libro di esempio",
  },
};
export default it;
