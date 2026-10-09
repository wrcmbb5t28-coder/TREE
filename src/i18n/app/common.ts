/** Strings shared across the app: navigation, header, buttons, relations, chapters, facts. */
import type { Lang } from "../config";

const en = {
  nav: { home: "Home", stories: "Stories", family: "Family", journey: "Journey", keep: "Keep", invite: "Invite", settings: "Settings" },
  header: { upgrade: "Upgrade", ask: "Ask a question", language: "Language" },
  plans: { free: "Free", family: "Family", legacy: "Legacy Gift", founding: "Founding Family" },
  btn: { save: "Save", cancel: "Cancel", remove: "Remove", delete: "Delete", add: "Add", back: "Back", edit: "Edit" },
  saved: "Saved.",
  you: "you",
  /** Who someone is to you. Keys match RELATIONS in src/i18n/questions.ts. */
  relations: {
    wife: "Wife", husband: "Husband", mother: "Mother", father: "Father", grandmother: "Grandmother", grandfather: "Grandfather",
    sister: "Sister", brother: "Brother", daughter: "Daughter", son: "Son", aunt: "Aunt", uncle: "Uncle", other: "Other relative or friend",
  },
  /** "Your son", "Your grandmother"... */
  yourRelation: {
    wife: "Your wife", husband: "Your husband", mother: "Your mother", father: "Your father", grandmother: "Your grandmother", grandfather: "Your grandfather",
    sister: "Your sister", brother: "Your brother", daughter: "Your daughter", son: "Your son", aunt: "Your aunt", uncle: "Your uncle", other: "Relative or friend",
  },
  /** Chapters are stored in English; these are the display names. */
  chapters: {
    Origins: "Origins", Childhood: "Childhood", Love: "Love", Work: "Work", "Leaving home": "Leaving home", "Hard years": "Hard years",
    "Family life": "Family life", Traditions: "Traditions", Advice: "Advice", "The next generation": "The next generation", Unsorted: "Unsorted", Story: "Story",
  },
  factKinds: { person: "Person", place: "Place", date: "Date", event: "Event" },
  confidence: { confirmed: "stated clearly", likely: "approximate", guess: "only implied" },
  factStatus: { suggested: "suggested", confirmed: "added", rejected: "not right" },
  gender: { label: "Gender", unset: "Not set", f: "Woman", m: "Man" },
  isBorn: (name: string, _g?: string | null) => `${name} is born`,
};

export type CommonT = typeof en;

const ru: CommonT = {
  nav: { home: "Главная", stories: "Истории", family: "Семья", journey: "Путь семьи", keep: "Сохранить", invite: "Пригласить", settings: "Настройки" },
  header: { upgrade: "Улучшить", ask: "Задать вопрос", language: "Язык" },
  plans: { free: "Бесплатный", family: "Семейный", legacy: "Подарок наследия", founding: "Семья-основатель" },
  btn: { save: "Сохранить", cancel: "Отмена", remove: "Убрать", delete: "Удалить", add: "Добавить", back: "Назад", edit: "Изменить" },
  saved: "Сохранено.",
  you: "вы",
  relations: {
    wife: "Жена", husband: "Муж", mother: "Мама", father: "Папа", grandmother: "Бабушка", grandfather: "Дедушка",
    sister: "Сестра", brother: "Брат", daughter: "Дочь", son: "Сын", aunt: "Тётя", uncle: "Дядя", other: "Другой родственник или друг",
  },
  yourRelation: {
    wife: "Ваша жена", husband: "Ваш муж", mother: "Ваша мама", father: "Ваш папа", grandmother: "Ваша бабушка", grandfather: "Ваш дедушка",
    sister: "Ваша сестра", brother: "Ваш брат", daughter: "Ваша дочь", son: "Ваш сын", aunt: "Ваша тётя", uncle: "Ваш дядя", other: "Родственник или друг",
  },
  chapters: {
    Origins: "Корни", Childhood: "Детство", Love: "Любовь", Work: "Работа", "Leaving home": "Переезд", "Hard years": "Трудные годы",
    "Family life": "Семейная жизнь", Traditions: "Традиции", Advice: "Советы", "The next generation": "Следующее поколение", Unsorted: "Без главы", Story: "История",
  },
  factKinds: { person: "Человек", place: "Место", date: "Дата", event: "Событие" },
  confidence: { confirmed: "сказано прямо", likely: "приблизительно", guess: "только намёк" },
  factStatus: { suggested: "предложено", confirmed: "добавлено", rejected: "неверно" },
  gender: { label: "Пол", unset: "Не указан", f: "Женщина", m: "Мужчина" },
  isBorn: (name: string, g?: string | null) => (g === "f" ? `Родилась ${name}` : g === "m" ? `Родился ${name}` : `${name}: рождение`),
};

const de: CommonT = {
  nav: { home: "Start", stories: "Geschichten", family: "Familie", journey: "Familienweg", keep: "Bewahren", invite: "Einladen", settings: "Einstellungen" },
  header: { upgrade: "Upgrade", ask: "Frage stellen", language: "Sprache" },
  plans: { free: "Kostenlos", family: "Familie", legacy: "Vermächtnis-Geschenk", founding: "Gründerfamilie" },
  btn: { save: "Speichern", cancel: "Abbrechen", remove: "Entfernen", delete: "Löschen", add: "Hinzufügen", back: "Zurück", edit: "Bearbeiten" },
  saved: "Gespeichert.",
  you: "Sie",
  relations: {
    wife: "Ehefrau", husband: "Ehemann", mother: "Mutter", father: "Vater", grandmother: "Großmutter", grandfather: "Großvater",
    sister: "Schwester", brother: "Bruder", daughter: "Tochter", son: "Sohn", aunt: "Tante", uncle: "Onkel", other: "Andere Verwandte oder Freunde",
  },
  yourRelation: {
    wife: "Ihre Frau", husband: "Ihr Mann", mother: "Ihre Mutter", father: "Ihr Vater", grandmother: "Ihre Großmutter", grandfather: "Ihr Großvater",
    sister: "Ihre Schwester", brother: "Ihr Bruder", daughter: "Ihre Tochter", son: "Ihr Sohn", aunt: "Ihre Tante", uncle: "Ihr Onkel", other: "Verwandte oder Freunde",
  },
  chapters: {
    Origins: "Herkunft", Childhood: "Kindheit", Love: "Liebe", Work: "Arbeit", "Leaving home": "Aufbruch", "Hard years": "Schwere Jahre",
    "Family life": "Familienleben", Traditions: "Traditionen", Advice: "Ratschläge", "The next generation": "Die nächste Generation", Unsorted: "Ohne Kapitel", Story: "Geschichte",
  },
  factKinds: { person: "Person", place: "Ort", date: "Datum", event: "Ereignis" },
  confidence: { confirmed: "klar gesagt", likely: "ungefähr", guess: "nur angedeutet" },
  factStatus: { suggested: "vorgeschlagen", confirmed: "hinzugefügt", rejected: "nicht richtig" },
  gender: { label: "Geschlecht", unset: "Nicht angegeben", f: "Frau", m: "Mann" },
  isBorn: (name: string, _g?: string | null) => `${name} wird geboren`,
};

const fr: CommonT = {
  nav: { home: "Accueil", stories: "Histoires", family: "Famille", journey: "Parcours", keep: "Conserver", invite: "Inviter", settings: "Réglages" },
  header: { upgrade: "Passer à l’offre", ask: "Poser une question", language: "Langue" },
  plans: { free: "Gratuit", family: "Famille", legacy: "Cadeau Héritage", founding: "Famille fondatrice" },
  btn: { save: "Enregistrer", cancel: "Annuler", remove: "Retirer", delete: "Supprimer", add: "Ajouter", back: "Retour", edit: "Modifier" },
  saved: "Enregistré.",
  you: "vous",
  relations: {
    wife: "Épouse", husband: "Mari", mother: "Mère", father: "Père", grandmother: "Grand-mère", grandfather: "Grand-père",
    sister: "Sœur", brother: "Frère", daughter: "Fille", son: "Fils", aunt: "Tante", uncle: "Oncle", other: "Autre proche ou ami",
  },
  yourRelation: {
    wife: "Votre épouse", husband: "Votre mari", mother: "Votre mère", father: "Votre père", grandmother: "Votre grand-mère", grandfather: "Votre grand-père",
    sister: "Votre sœur", brother: "Votre frère", daughter: "Votre fille", son: "Votre fils", aunt: "Votre tante", uncle: "Votre oncle", other: "Proche ou ami",
  },
  chapters: {
    Origins: "Origines", Childhood: "Enfance", Love: "Amour", Work: "Travail", "Leaving home": "Partir", "Hard years": "Années difficiles",
    "Family life": "Vie de famille", Traditions: "Traditions", Advice: "Conseils", "The next generation": "La génération suivante", Unsorted: "Sans chapitre", Story: "Histoire",
  },
  factKinds: { person: "Personne", place: "Lieu", date: "Date", event: "Événement" },
  confidence: { confirmed: "dit clairement", likely: "approximatif", guess: "seulement suggéré" },
  factStatus: { suggested: "suggéré", confirmed: "ajouté", rejected: "incorrect" },
  gender: { label: "Genre", unset: "Non précisé", f: "Femme", m: "Homme" },
  isBorn: (name: string, _g?: string | null) => `Naissance de ${name}`,
};

const it: CommonT = {
  nav: { home: "Home", stories: "Storie", family: "Famiglia", journey: "Percorso", keep: "Conserva", invite: "Invita", settings: "Impostazioni" },
  header: { upgrade: "Passa al piano", ask: "Fai una domanda", language: "Lingua" },
  plans: { free: "Gratis", family: "Famiglia", legacy: "Regalo Eredità", founding: "Famiglia fondatrice" },
  btn: { save: "Salva", cancel: "Annulla", remove: "Rimuovi", delete: "Elimina", add: "Aggiungi", back: "Indietro", edit: "Modifica" },
  saved: "Salvato.",
  you: "tu",
  relations: {
    wife: "Moglie", husband: "Marito", mother: "Madre", father: "Padre", grandmother: "Nonna", grandfather: "Nonno",
    sister: "Sorella", brother: "Fratello", daughter: "Figlia", son: "Figlio", aunt: "Zia", uncle: "Zio", other: "Altro parente o amico",
  },
  yourRelation: {
    wife: "Tua moglie", husband: "Tuo marito", mother: "Tua madre", father: "Tuo padre", grandmother: "Tua nonna", grandfather: "Tuo nonno",
    sister: "Tua sorella", brother: "Tuo fratello", daughter: "Tua figlia", son: "Tuo figlio", aunt: "Tua zia", uncle: "Tuo zio", other: "Parente o amico",
  },
  chapters: {
    Origins: "Origini", Childhood: "Infanzia", Love: "Amore", Work: "Lavoro", "Leaving home": "Partire", "Hard years": "Anni difficili",
    "Family life": "Vita di famiglia", Traditions: "Tradizioni", Advice: "Consigli", "The next generation": "La prossima generazione", Unsorted: "Senza capitolo", Story: "Storia",
  },
  factKinds: { person: "Persona", place: "Luogo", date: "Data", event: "Evento" },
  confidence: { confirmed: "detto chiaramente", likely: "approssimativo", guess: "solo accennato" },
  factStatus: { suggested: "suggerito", confirmed: "aggiunto", rejected: "non corretto" },
  gender: { label: "Genere", unset: "Non indicato", f: "Donna", m: "Uomo" },
  isBorn: (name: string, _g?: string | null) => `Nasce ${name}`,
};

const es: CommonT = {
  nav: { home: "Inicio", stories: "Historias", family: "Familia", journey: "Recorrido", keep: "Guardar", invite: "Invitar", settings: "Ajustes" },
  header: { upgrade: "Mejorar plan", ask: "Hacer una pregunta", language: "Idioma" },
  plans: { free: "Gratis", family: "Familia", legacy: "Regalo Legado", founding: "Familia fundadora" },
  btn: { save: "Guardar", cancel: "Cancelar", remove: "Quitar", delete: "Eliminar", add: "Añadir", back: "Volver", edit: "Editar" },
  saved: "Guardado.",
  you: "tú",
  relations: {
    wife: "Esposa", husband: "Esposo", mother: "Madre", father: "Padre", grandmother: "Abuela", grandfather: "Abuelo",
    sister: "Hermana", brother: "Hermano", daughter: "Hija", son: "Hijo", aunt: "Tía", uncle: "Tío", other: "Otro familiar o amigo",
  },
  yourRelation: {
    wife: "Tu esposa", husband: "Tu esposo", mother: "Tu madre", father: "Tu padre", grandmother: "Tu abuela", grandfather: "Tu abuelo",
    sister: "Tu hermana", brother: "Tu hermano", daughter: "Tu hija", son: "Tu hijo", aunt: "Tu tía", uncle: "Tu tío", other: "Familiar o amigo",
  },
  chapters: {
    Origins: "Orígenes", Childhood: "Infancia", Love: "Amor", Work: "Trabajo", "Leaving home": "Partir", "Hard years": "Años difíciles",
    "Family life": "Vida familiar", Traditions: "Tradiciones", Advice: "Consejos", "The next generation": "La próxima generación", Unsorted: "Sin capítulo", Story: "Historia",
  },
  factKinds: { person: "Persona", place: "Lugar", date: "Fecha", event: "Evento" },
  confidence: { confirmed: "dicho claramente", likely: "aproximado", guess: "solo insinuado" },
  factStatus: { suggested: "sugerido", confirmed: "añadido", rejected: "incorrecto" },
  gender: { label: "Género", unset: "Sin indicar", f: "Mujer", m: "Hombre" },
  isBorn: (name: string, _g?: string | null) => `Nace ${name}`,
};

export const common: Record<Lang, CommonT> = { en, ru, de, fr, it, es };

/** Display name of a stored (English) chapter key; unknown values are shown as they are. */
export function chapterName(lang: Lang, chapter: string | null | undefined): string {
  const c = common[lang].chapters as Record<string, string>;
  return chapter ? c[chapter] ?? chapter : c.Story;
}

/** "Anna is born" events created before translation are stored in English: show them translated. */
export function eventText(lang: Lang, description: string, person?: { firstName: string; gender?: string | null } | null): string {
  const m = /^(.+) is born$/.exec(description);
  if (m && (!person || m[1] === person.firstName)) return common[lang].isBorn(m[1], person?.gender);
  return description;
}
