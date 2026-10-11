import type { Lang } from "@/i18n/config";

/** The proofreader's notice after saving, and voice dictation labels for long texts. */
export const fixT: Record<Lang, { fixed: string; undo: string; ok: string; more: (n: number) => string; speak: string; listening: string; fields: Record<string, string> }> = {
  ru: { fixed: "Редактор поправил", undo: "Вернуть как было", ok: "Хорошо", more: (n) => `и ещё ${n}`, speak: "Наговорить", listening: "Слушаю… нажмите, чтобы остановить",
    fields: { firstName: "имя", lastName: "фамилия", birthPlace: "место рождения", bio: "описание", lifePath: "история жизни", title: "заголовок", body: "текст", description: "событие", place: "место", name: "имя" } },
  en: { fixed: "The editor corrected", undo: "Undo", ok: "OK", more: (n) => `and ${n} more`, speak: "Dictate", listening: "Listening… tap to stop",
    fields: { firstName: "first name", lastName: "surname", birthPlace: "birthplace", bio: "description", lifePath: "life story", title: "title", body: "text", description: "event", place: "place", name: "name" } },
  de: { fixed: "Das Lektorat hat korrigiert", undo: "Rückgängig", ok: "OK", more: (n) => `und ${n} weitere`, speak: "Diktieren", listening: "Ich höre zu… zum Beenden tippen",
    fields: { firstName: "Vorname", lastName: "Nachname", birthPlace: "Geburtsort", bio: "Beschreibung", lifePath: "Lebensgeschichte", title: "Titel", body: "Text", description: "Ereignis", place: "Ort", name: "Name" } },
  fr: { fixed: "Le correcteur a corrigé", undo: "Annuler", ok: "OK", more: (n) => `et ${n} autres`, speak: "Dicter", listening: "J’écoute… touchez pour arrêter",
    fields: { firstName: "prénom", lastName: "nom", birthPlace: "lieu de naissance", bio: "description", lifePath: "histoire de vie", title: "titre", body: "texte", description: "événement", place: "lieu", name: "prénom" } },
  it: { fixed: "Il correttore ha sistemato", undo: "Annulla", ok: "OK", more: (n) => `e altre ${n}`, speak: "Detta", listening: "Ascolto… tocca per fermare",
    fields: { firstName: "nome", lastName: "cognome", birthPlace: "luogo di nascita", bio: "descrizione", lifePath: "storia di vita", title: "titolo", body: "testo", description: "evento", place: "luogo", name: "nome" } },
  es: { fixed: "El corrector ha corregido", undo: "Deshacer", ok: "Vale", more: (n) => `y ${n} más`, speak: "Dictar", listening: "Escuchando… toca para parar",
    fields: { firstName: "nombre", lastName: "apellido", birthPlace: "lugar de nacimiento", bio: "descripción", lifePath: "historia de vida", title: "título", body: "texto", description: "evento", place: "lugar", name: "nombre" } },
};
