import type { Lang } from "@/i18n/config";

type Status = "documented" | "corroborated" | "possible" | "lead" | "contradicted";

/** Archive search on a person's page (src/lib/research.ts, skills/treename-roots). */
export const researchT: Record<
  Lang,
  {
    title: string;
    intro: (name: string) => string;
    notEligible: string;
    start: (name: string) => string;
    again: string;
    left: (n: number) => string;
    freeNote: string;
    limit: string;
    plans: string;
    editorsOnly: string;
    running: string;
    failed: string;
    found: string;
    notFound: string;
    next: string;
    letter: (to: string) => string;
    letterHint: string;
    goodToKnow: string;
    open: string;
    disclaimer: string;
    earlier: string;
    searchedOn: (date: string, n: number) => string;
    status: Record<Status, string>;
  }
> = {
  en: {
    title: "Archive search",
    intro: (n) => `Treename searches public archives, indexes and memorial databases for ${n} and tells you honestly what it found, how sure it is and where to ask next.`,
    notEligible: "Archive search is for relatives who have passed away or were born more than 100 years ago. We never search for living people.",
    start: (n) => `Search the archives for ${n}`,
    again: "Search again",
    left: (n) => `Searches left: ${n}`,
    freeNote: "Your first search is free. The Family plan includes 20 searches a month.",
    limit: "You have used all your searches. The Family plan includes 20 searches a month.",
    plans: "See plans",
    editorsOnly: "Only family members who can edit the tree can start a search.",
    running: "Searching the archives… This takes one to three minutes. You can leave this page: the result will be saved here.",
    failed: "The last search did not finish. It did not count against your searches, please try again.",
    found: "What we found",
    notFound: "Searched, nothing usable",
    next: "Your next steps",
    letter: (to) => `Request letter${to ? ` to ${to}` : ""}`,
    letterHint: "Written in the archive's language. Fill in your details in [brackets], then copy it into an e-mail or letter.",
    goodToKnow: "Good to know",
    open: "Open source",
    disclaimer: "Found by AI on the open web. Please check each record yourself before adding it to the tree.",
    earlier: "Earlier searches",
    searchedOn: (d, n) => `Search of ${d}${n ? ` · ${n} queries` : ""}`,
    status: { documented: "Documented", corroborated: "Confirmed by several sources", possible: "Possible match", lead: "Lead to check", contradicted: "Disagrees with family memory" },
  },
  de: {
    title: "Archivsuche",
    intro: (n) => `Treename durchsucht öffentliche Archive, Register und Gedenkdatenbanken nach ${n} und sagt ehrlich, was gefunden wurde, wie sicher es ist und wo Sie weiterfragen können.`,
    notEligible: "Die Archivsuche gibt es für Verstorbene und für Menschen, die vor mehr als 100 Jahren geboren wurden. Nach lebenden Personen suchen wir nie.",
    start: (n) => `Archive nach ${n} durchsuchen`,
    again: "Erneut suchen",
    left: (n) => `Verbleibende Suchen: ${n}`,
    freeNote: "Die erste Suche ist kostenlos. Im Familienplan sind 20 Suchen pro Monat enthalten.",
    limit: "Sie haben alle Suchen aufgebraucht. Im Familienplan sind 20 Suchen pro Monat enthalten.",
    plans: "Pläne ansehen",
    editorsOnly: "Eine Suche können nur Familienmitglieder starten, die den Stammbaum bearbeiten dürfen.",
    running: "Die Archive werden durchsucht… Das dauert ein bis drei Minuten. Sie können die Seite verlassen, das Ergebnis wird hier gespeichert.",
    failed: "Die letzte Suche wurde nicht abgeschlossen. Sie zählt nicht, bitte versuchen Sie es noch einmal.",
    found: "Was wir gefunden haben",
    notFound: "Gesucht, nichts Brauchbares",
    next: "Ihre nächsten Schritte",
    letter: (to) => `Anfrage${to ? ` an ${to}` : ""}`,
    letterHint: "In der Sprache des Archivs. Ergänzen Sie Ihre Angaben in [Klammern] und kopieren Sie den Text in eine E-Mail oder einen Brief.",
    goodToKnow: "Gut zu wissen",
    open: "Quelle öffnen",
    disclaimer: "Von KI im offenen Web gefunden. Bitte prüfen Sie jeden Eintrag selbst, bevor Sie ihn in den Stammbaum übernehmen.",
    earlier: "Frühere Suchen",
    searchedOn: (d, n) => `Suche vom ${d}${n ? ` · ${n} Abfragen` : ""}`,
    status: { documented: "Belegt", corroborated: "Durch mehrere Quellen bestätigt", possible: "Möglicher Treffer", lead: "Hinweis zum Prüfen", contradicted: "Widerspricht der Familienerinnerung" },
  },
  fr: {
    title: "Recherche dans les archives",
    intro: (n) => `Treename cherche ${n} dans les archives publiques, les index et les bases mémorielles, puis vous dit honnêtement ce qui a été trouvé, avec quelle certitude, et où demander ensuite.`,
    notEligible: "La recherche est réservée aux proches décédés ou nés il y a plus de 100 ans. Nous ne cherchons jamais de personnes vivantes.",
    start: (n) => `Chercher ${n} dans les archives`,
    again: "Relancer la recherche",
    left: (n) => `Recherches restantes : ${n}`,
    freeNote: "La première recherche est offerte. La formule Famille comprend 20 recherches par mois.",
    limit: "Vous avez utilisé toutes vos recherches. La formule Famille comprend 20 recherches par mois.",
    plans: "Voir les formules",
    editorsOnly: "Seuls les membres qui peuvent modifier l’arbre peuvent lancer une recherche.",
    running: "Recherche dans les archives… Cela prend une à trois minutes. Vous pouvez quitter la page : le résultat sera enregistré ici.",
    failed: "La dernière recherche n’a pas abouti. Elle n’est pas décomptée, réessayez.",
    found: "Ce que nous avons trouvé",
    notFound: "Cherché, rien d’utile",
    next: "Vos prochaines étapes",
    letter: (to) => `Lettre de demande${to ? ` à ${to}` : ""}`,
    letterHint: "Rédigée dans la langue de l’archive. Complétez vos coordonnées entre [crochets], puis copiez-la dans un e-mail ou un courrier.",
    goodToKnow: "Bon à savoir",
    open: "Ouvrir la source",
    disclaimer: "Trouvé par l’IA sur le web ouvert. Vérifiez chaque document vous-même avant de l’ajouter à l’arbre.",
    earlier: "Recherches précédentes",
    searchedOn: (d, n) => `Recherche du ${d}${n ? ` · ${n} requêtes` : ""}`,
    status: { documented: "Documenté", corroborated: "Confirmé par plusieurs sources", possible: "Correspondance possible", lead: "Piste à vérifier", contradicted: "Contredit la mémoire familiale" },
  },
  it: {
    title: "Ricerca negli archivi",
    intro: (n) => `Treename cerca ${n} negli archivi pubblici, negli indici e nelle banche dati della memoria e ti dice onestamente cosa ha trovato, quanto è sicuro e dove chiedere poi.`,
    notEligible: "La ricerca è disponibile per i parenti scomparsi o nati più di 100 anni fa. Non cerchiamo mai persone in vita.",
    start: (n) => `Cerca ${n} negli archivi`,
    again: "Cerca di nuovo",
    left: (n) => `Ricerche rimaste: ${n}`,
    freeNote: "La prima ricerca è gratuita. Il piano Famiglia include 20 ricerche al mese.",
    limit: "Hai usato tutte le ricerche. Il piano Famiglia include 20 ricerche al mese.",
    plans: "Vedi i piani",
    editorsOnly: "Solo chi può modificare l’albero può avviare una ricerca.",
    running: "Ricerca negli archivi in corso… Ci vogliono da uno a tre minuti. Puoi lasciare la pagina: il risultato verrà salvato qui.",
    failed: "L’ultima ricerca non si è conclusa. Non viene conteggiata, riprova.",
    found: "Cosa abbiamo trovato",
    notFound: "Cercato, niente di utile",
    next: "I tuoi prossimi passi",
    letter: (to) => `Lettera di richiesta${to ? ` a ${to}` : ""}`,
    letterHint: "Scritta nella lingua dell’archivio. Completa i tuoi dati tra [parentesi] e copiala in un’e-mail o in una lettera.",
    goodToKnow: "Buono a sapersi",
    open: "Apri la fonte",
    disclaimer: "Trovato dall’IA sul web aperto. Controlla ogni documento prima di aggiungerlo all’albero.",
    earlier: "Ricerche precedenti",
    searchedOn: (d, n) => `Ricerca del ${d}${n ? ` · ${n} interrogazioni` : ""}`,
    status: { documented: "Documentato", corroborated: "Confermato da più fonti", possible: "Possibile corrispondenza", lead: "Pista da verificare", contradicted: "In contrasto con la memoria di famiglia" },
  },
  es: {
    title: "Búsqueda en archivos",
    intro: (n) => `Treename busca a ${n} en archivos públicos, índices y bases de datos de memoria y te dice con honestidad qué ha encontrado, con qué seguridad y dónde preguntar después.`,
    notEligible: "La búsqueda está disponible para familiares fallecidos o nacidos hace más de 100 años. Nunca buscamos a personas vivas.",
    start: (n) => `Buscar a ${n} en los archivos`,
    again: "Buscar de nuevo",
    left: (n) => `Búsquedas restantes: ${n}`,
    freeNote: "La primera búsqueda es gratis. El plan Familia incluye 20 búsquedas al mes.",
    limit: "Has usado todas tus búsquedas. El plan Familia incluye 20 búsquedas al mes.",
    plans: "Ver planes",
    editorsOnly: "Solo quienes pueden editar el árbol pueden iniciar una búsqueda.",
    running: "Buscando en los archivos… Tarda de uno a tres minutos. Puedes salir de la página: el resultado se guardará aquí.",
    failed: "La última búsqueda no terminó. No cuenta, inténtalo de nuevo.",
    found: "Lo que hemos encontrado",
    notFound: "Buscado, nada útil",
    next: "Tus próximos pasos",
    letter: (to) => `Carta de solicitud${to ? ` a ${to}` : ""}`,
    letterHint: "Escrita en el idioma del archivo. Completa tus datos entre [corchetes] y cópiala en un correo o una carta.",
    goodToKnow: "Conviene saber",
    open: "Abrir la fuente",
    disclaimer: "Encontrado por IA en la web abierta. Comprueba cada registro antes de añadirlo al árbol.",
    earlier: "Búsquedas anteriores",
    searchedOn: (d, n) => `Búsqueda del ${d}${n ? ` · ${n} consultas` : ""}`,
    status: { documented: "Documentado", corroborated: "Confirmado por varias fuentes", possible: "Posible coincidencia", lead: "Pista por comprobar", contradicted: "Contradice la memoria familiar" },
  },
  ru: {
    title: "Поиск в архивах",
    intro: (n) => `Treename проверит открытые архивы, указатели и базы памяти по имени «${n}» и честно скажет, что нашлось, насколько это надёжно и куда обратиться дальше.`,
    notEligible: "Поиск в архивах доступен для родных, которых уже нет, или тех, кто родился больше 100 лет назад. Живых людей мы не ищем.",
    start: (n) => `Искать в архивах: ${n}`,
    again: "Искать ещё раз",
    left: (n) => `Осталось поисков: ${n}`,
    freeNote: "Первый поиск бесплатный. В тарифе «Семейный» 20 поисков в месяц.",
    limit: "Поиски закончились. В тарифе «Семейный» 20 поисков в месяц.",
    plans: "Посмотреть тарифы",
    editorsOnly: "Начать поиск могут только те, кто может редактировать древо.",
    running: "Ищем в архивах… Это займёт одну–три минуты. Страницу можно закрыть: результат сохранится здесь.",
    failed: "Прошлый поиск не завершился. Он не засчитан, попробуйте ещё раз.",
    found: "Что нашлось",
    notFound: "Искали, ничего полезного",
    next: "Что можно сделать дальше",
    letter: (to) => `Запрос${to ? `: ${to}` : " в архив"}`,
    letterHint: "Написан на языке архива. Впишите свои данные вместо [скобок] и скопируйте текст в письмо.",
    goodToKnow: "Важно знать",
    open: "Открыть источник",
    disclaimer: "Найдено AI в открытом интернете. Проверьте каждую запись сами, прежде чем добавлять её в древо.",
    earlier: "Прошлые поиски",
    searchedOn: (d, n) => `Поиск от ${d}${n ? ` · запросов: ${n}` : ""}`,
    status: { documented: "Есть документ", corroborated: "Подтверждено несколькими источниками", possible: "Возможное совпадение", lead: "Наводка, нужно проверить", contradicted: "Расходится с семейной памятью" },
  },
};
