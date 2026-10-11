import type { Lang } from "@/i18n/config";

/** Asking a newly joined family member their name, so the app greets them and not the tree's creator. */
export const whoami: Record<Lang, { hello: string; title: string; text: string; pick: string; or: string; save: string }> = {
  ru: { hello: "Здравствуйте!", title: "Как вас зовут?", text: "Чтобы мы обращались к вам по имени, а родные видели, кто задаёт вопросы.", pick: "Это я в древе…", or: "или впишите имя", save: "Готово" },
  en: { hello: "Hello!", title: "What’s your name?", text: "So we can greet you by name and your family sees who asks the questions.", pick: "This is me in the tree…", or: "or type your name", save: "Done" },
  de: { hello: "Hallo!", title: "Wie heißen Sie?", text: "Damit wir Sie mit Namen begrüßen und Ihre Familie sieht, wer die Fragen stellt.", pick: "Das bin ich im Stammbaum…", or: "oder Namen eingeben", save: "Fertig" },
  fr: { hello: "Bonjour !", title: "Comment vous appelez-vous ?", text: "Pour vous accueillir par votre prénom et que votre famille sache qui pose les questions.", pick: "C’est moi dans l’arbre…", or: "ou tapez votre prénom", save: "Terminé" },
  it: { hello: "Ciao!", title: "Come ti chiami?", text: "Così ti salutiamo per nome e la famiglia vede chi fa le domande.", pick: "Sono io nell’albero…", or: "o scrivi il tuo nome", save: "Fatto" },
  es: { hello: "¡Hola!", title: "¿Cómo te llamas?", text: "Para saludarte por tu nombre y que tu familia vea quién hace las preguntas.", pick: "Soy yo en el árbol…", or: "o escribe tu nombre", save: "Listo" },
};
