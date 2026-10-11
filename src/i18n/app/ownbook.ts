import type { Lang } from "@/i18n/config";

type Forms = { one: string; few?: string; many?: string; other: string };

/** Words for the family's own book (the rest comes from the sample book and the print version). */
export const ownBook: Record<Lang, {
  titleOf: (line: string) => string;
  fallbackTitle: string;
  generations: Forms;
  made: (year: number) => string;
  more: (n: number) => string;
  endTitle: string;
  endText: string;
  endCta: string;
  back: string;
}> = {
  ru: {
    titleOf: (l) => l,
    fallbackTitle: "Наша семья",
    generations: { one: "# поколение одной семьи", few: "# поколения одной семьи", many: "# поколений одной семьи", other: "# поколения одной семьи" },
    made: (y) => `Собрано семьёй в Treename · ${y}`,
    more: (n) => `и ещё ${n}`,
    endTitle: "Книга продолжается",
    endText: "Каждая новая история появится здесь сама. Спросите родных о том, что ещё не записано, пока есть кого спросить.",
    endCta: "Задать вопрос",
    back: "← В приложение",
  },
  en: {
    titleOf: (l) => `The ${l} Family`,
    fallbackTitle: "Our Family",
    generations: { one: "# generation of one family", other: "# generations of one family" },
    made: (y) => `Put together by the family with Treename · ${y}`,
    more: (n) => `and ${n} more`,
    endTitle: "The book goes on",
    endText: "Every new story will appear here by itself. Ask your family about what hasn’t been written down yet, while there is someone to ask.",
    endCta: "Ask a question",
    back: "← Back to the app",
  },
  de: {
    titleOf: (l) => `Familie ${l}`,
    fallbackTitle: "Unsere Familie",
    generations: { one: "# Generation einer Familie", other: "# Generationen einer Familie" },
    made: (y) => `Von der Familie mit Treename zusammengestellt · ${y}`,
    more: (n) => `und ${n} weitere`,
    endTitle: "Das Buch geht weiter",
    endText: "Jede neue Geschichte erscheint hier von selbst. Fragen Sie Ihre Familie nach dem, was noch nicht aufgeschrieben ist, solange es jemanden zu fragen gibt.",
    endCta: "Eine Frage stellen",
    back: "← Zur App",
  },
  fr: {
    titleOf: (l) => `Famille ${l}`,
    fallbackTitle: "Notre famille",
    generations: { one: "# génération d’une famille", other: "# générations d’une famille" },
    made: (y) => `Réuni par la famille avec Treename · ${y}`,
    more: (n) => `et ${n} autres`,
    endTitle: "Le livre continue",
    endText: "Chaque nouvelle histoire apparaîtra ici d’elle-même. Interrogez vos proches sur ce qui n’a pas encore été écrit, tant qu’il y a quelqu’un à qui demander.",
    endCta: "Poser une question",
    back: "← Retour à l’application",
  },
  it: {
    titleOf: (l) => `Famiglia ${l}`,
    fallbackTitle: "La nostra famiglia",
    generations: { one: "# generazione di una famiglia", other: "# generazioni di una famiglia" },
    made: (y) => `Raccolto dalla famiglia con Treename · ${y}`,
    more: (n) => `e altri ${n}`,
    endTitle: "Il libro continua",
    endText: "Ogni nuova storia comparirà qui da sola. Chiedete ai vostri cari ciò che non è ancora scritto, finché c’è qualcuno a cui chiederlo.",
    endCta: "Fai una domanda",
    back: "← Torna all’app",
  },
  es: {
    titleOf: (l) => `Familia ${l}`,
    fallbackTitle: "Nuestra familia",
    generations: { one: "# generación de una familia", other: "# generaciones de una familia" },
    made: (y) => `Reunido por la familia con Treename · ${y}`,
    more: (n) => `y ${n} más`,
    endTitle: "El libro continúa",
    endText: "Cada nueva historia aparecerá aquí sola. Pregunta a tu familia lo que aún no está escrito, mientras haya a quién preguntar.",
    endCta: "Hacer una pregunta",
    back: "← Volver a la app",
  },
};
