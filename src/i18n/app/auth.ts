/** Sign-in and invite pages (outside the app; language from the site cookie or the browser). */
import { cookies, headers } from "next/headers";
import { isLang, pickLang, type Lang } from "../config";

export async function visitorLang(): Promise<Lang> {
  const c = (await cookies()).get("tn_lang")?.value;
  if (isLang(c)) return c;
  return pickLang((await headers()).get("accept-language"));
}

const en = {
  login: {
    metaTitle: "Sign in | Treename",
    checkInbox: "Check your inbox",
    sent: "We sent a sign-in link to",
    sentTail: "It works once and expires in 24 hours.",
    devMode: "Test mode: email is not set up yet. Open this link to sign in:",
    join: "Join your family on Treename",
    signIn: "Sign in",
    noPassword: "No password. We email you a link that signs you in.",
    expired: "That link has expired or was already used. Request a new one.",
    badEmail: "Please enter a valid email address.",
    email: "Email",
    submit: "Email me a sign-in link",
    newHere: "New here?",
    start: "Start your family story",
  },
  join: {
    metaTitle: "Join your family | Treename",
    invited: (family: string) => `You’re invited to ${family}`,
    stats: (people: number, stories: number) => `${people} ${people === 1 ? "person" : "people"} and ${stories} ${stories === 1 ? "story" : "stories"} so far. Add what only you remember.`,
    accept: "Join the family",
    withEmail: "Join with your email",
  },
};
export type AuthT = typeof en;

const ru: AuthT = {
  login: {
    metaTitle: "Вход | Treename",
    checkInbox: "Проверьте почту",
    sent: "Мы отправили ссылку для входа на",
    sentTail: "Она сработает один раз и действует 24 часа.",
    devMode: "Тестовый режим: почта ещё не настроена. Откройте эту ссылку, чтобы войти:",
    join: "Присоединяйтесь к своей семье в Treename",
    signIn: "Вход",
    noPassword: "Без пароля: мы пришлём на почту ссылку для входа.",
    expired: "Ссылка устарела или уже использована. Запросите новую.",
    badEmail: "Введите корректный адрес почты.",
    email: "Электронная почта",
    submit: "Прислать ссылку для входа",
    newHere: "Впервые здесь?",
    start: "Начните историю своей семьи",
  },
  join: {
    metaTitle: "Приглашение в семью | Treename",
    invited: (family: string) => `Вас приглашают: ${family}`,
    stats: (people: number, stories: number) => {
      const f = (n: number, a: string, b: string, c: string) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
      return `Уже ${people} ${f(people, "человек", "человека", "человек")} и ${stories} ${f(stories, "история", "истории", "историй")}. Добавьте то, что помните только вы.`;
    },
    accept: "Присоединиться",
    withEmail: "Войти по почте и присоединиться",
  },
};

const de: AuthT = {
  login: {
    metaTitle: "Anmelden | Treename",
    checkInbox: "Schauen Sie in Ihr Postfach",
    sent: "Wir haben einen Anmeldelink gesendet an",
    sentTail: "Er funktioniert einmal und ist 24 Stunden gültig.",
    devMode: "Testmodus: E-Mail ist noch nicht eingerichtet. Öffnen Sie diesen Link, um sich anzumelden:",
    join: "Treten Sie Ihrer Familie auf Treename bei",
    signIn: "Anmelden",
    noPassword: "Kein Passwort. Wir senden Ihnen einen Link, der Sie anmeldet.",
    expired: "Dieser Link ist abgelaufen oder wurde schon verwendet. Fordern Sie einen neuen an.",
    badEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    email: "E-Mail",
    submit: "Anmeldelink senden",
    newHere: "Neu hier?",
    start: "Beginnen Sie Ihre Familiengeschichte",
  },
  join: {
    metaTitle: "Familie beitreten | Treename",
    invited: (family: string) => `Sie sind eingeladen: ${family}`,
    stats: (p: number, s: number) => `Bisher ${p} ${p === 1 ? "Person" : "Personen"} und ${s} ${s === 1 ? "Geschichte" : "Geschichten"}. Ergänzen Sie, woran nur Sie sich erinnern.`,
    accept: "Der Familie beitreten",
    withEmail: "Mit E-Mail beitreten",
  },
};

const fr: AuthT = {
  login: {
    metaTitle: "Connexion | Treename",
    checkInbox: "Vérifiez votre boîte mail",
    sent: "Nous avons envoyé un lien de connexion à",
    sentTail: "Il fonctionne une fois et expire dans 24 heures.",
    devMode: "Mode test : l’e-mail n’est pas encore configuré. Ouvrez ce lien pour vous connecter :",
    join: "Rejoignez votre famille sur Treename",
    signIn: "Connexion",
    noPassword: "Pas de mot de passe. Nous vous envoyons un lien qui vous connecte.",
    expired: "Ce lien a expiré ou a déjà été utilisé. Demandez-en un nouveau.",
    badEmail: "Veuillez saisir une adresse e-mail valide.",
    email: "E-mail",
    submit: "Recevoir un lien de connexion",
    newHere: "Nouveau ici ?",
    start: "Commencez l’histoire de votre famille",
  },
  join: {
    metaTitle: "Rejoindre votre famille | Treename",
    invited: (family: string) => `Vous êtes invité·e : ${family}`,
    stats: (p: number, s: number) => `Déjà ${p} ${p > 1 ? "personnes" : "personne"} et ${s} ${s > 1 ? "histoires" : "histoire"}. Ajoutez ce dont vous seul·e vous souvenez.`,
    accept: "Rejoindre la famille",
    withEmail: "Rejoindre avec votre e-mail",
  },
};

const it: AuthT = {
  login: {
    metaTitle: "Accedi | Treename",
    checkInbox: "Controlla la tua email",
    sent: "Abbiamo inviato un link di accesso a",
    sentTail: "Funziona una sola volta e scade tra 24 ore.",
    devMode: "Modalità test: l’email non è ancora configurata. Apri questo link per accedere:",
    join: "Unisciti alla tua famiglia su Treename",
    signIn: "Accedi",
    noPassword: "Nessuna password. Ti inviamo via email un link per accedere.",
    expired: "Il link è scaduto o è già stato usato. Richiedine uno nuovo.",
    badEmail: "Inserisci un indirizzo email valido.",
    email: "Email",
    submit: "Inviami il link di accesso",
    newHere: "Sei nuovo?",
    start: "Inizia la storia della tua famiglia",
  },
  join: {
    metaTitle: "Unisciti alla famiglia | Treename",
    invited: (family: string) => `Sei invitato: ${family}`,
    stats: (p: number, s: number) => `Finora ${p} ${p === 1 ? "persona" : "persone"} e ${s} ${s === 1 ? "storia" : "storie"}. Aggiungi ciò che ricordi solo tu.`,
    accept: "Unisciti alla famiglia",
    withEmail: "Unisciti con la tua email",
  },
};

const es: AuthT = {
  login: {
    metaTitle: "Iniciar sesión | Treename",
    checkInbox: "Revisa tu correo",
    sent: "Hemos enviado un enlace de acceso a",
    sentTail: "Funciona una sola vez y caduca en 24 horas.",
    devMode: "Modo de prueba: el correo aún no está configurado. Abre este enlace para entrar:",
    join: "Únete a tu familia en Treename",
    signIn: "Iniciar sesión",
    noPassword: "Sin contraseña. Te enviamos por correo un enlace para entrar.",
    expired: "El enlace ha caducado o ya se usó. Pide uno nuevo.",
    badEmail: "Introduce una dirección de correo válida.",
    email: "Correo electrónico",
    submit: "Enviarme el enlace de acceso",
    newHere: "¿Eres nuevo?",
    start: "Empieza la historia de tu familia",
  },
  join: {
    metaTitle: "Únete a tu familia | Treename",
    invited: (family: string) => `Te han invitado: ${family}`,
    stats: (p: number, s: number) => `Por ahora ${p} ${p === 1 ? "persona" : "personas"} y ${s} ${s === 1 ? "historia" : "historias"}. Añade lo que solo tú recuerdas.`,
    accept: "Unirme a la familia",
    withEmail: "Unirme con mi correo",
  },
};

export const authT: Record<Lang, AuthT> = { en, ru, de, fr, it, es };
