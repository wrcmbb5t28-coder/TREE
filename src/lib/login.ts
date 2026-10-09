import { db } from "./db";
import { appUrl, token } from "./util";
import { sendEmail, emailLayout } from "./email";
import { isLang, type Lang } from "@/i18n/config";

const MAIL: Record<Lang, { subject: string; title: string; body: string; cta: string; text: (link: string) => string; footer: string }> = {
  en: { subject: "Your Treename sign-in link", title: "Welcome to Treename", body: "Tap the button to open your family story. The link works once and expires in 24 hours.", cta: "Open my family story", text: (l) => `Open your family story: ${l}\nThe link works once and expires in 24 hours.`, footer: "Family history, told by your family" },
  ru: { subject: "Ссылка для входа в Treename", title: "Добро пожаловать в Treename", body: "Нажмите на кнопку, чтобы открыть историю вашей семьи. Ссылка сработает один раз и действует 24 часа.", cta: "Открыть историю семьи", text: (l) => `Откройте историю вашей семьи: ${l}\nСсылка сработает один раз и действует 24 часа.`, footer: "История семьи, рассказанная вашей семьёй" },
  de: { subject: "Ihr Anmeldelink für Treename", title: "Willkommen bei Treename", body: "Tippen Sie auf die Schaltfläche, um Ihre Familiengeschichte zu öffnen. Der Link funktioniert einmal und ist 24 Stunden gültig.", cta: "Familiengeschichte öffnen", text: (l) => `Öffnen Sie Ihre Familiengeschichte: ${l}\nDer Link funktioniert einmal und ist 24 Stunden gültig.`, footer: "Familiengeschichte, erzählt von Ihrer Familie" },
  fr: { subject: "Votre lien de connexion Treename", title: "Bienvenue sur Treename", body: "Appuyez sur le bouton pour ouvrir l’histoire de votre famille. Le lien fonctionne une fois et expire dans 24 heures.", cta: "Ouvrir l’histoire de ma famille", text: (l) => `Ouvrez l’histoire de votre famille : ${l}\nLe lien fonctionne une fois et expire dans 24 heures.`, footer: "L’histoire de famille, racontée par votre famille" },
  it: { subject: "Il tuo link di accesso a Treename", title: "Benvenuto su Treename", body: "Tocca il pulsante per aprire la storia della tua famiglia. Il link funziona una sola volta e scade tra 24 ore.", cta: "Apri la storia di famiglia", text: (l) => `Apri la storia della tua famiglia: ${l}\nIl link funziona una sola volta e scade tra 24 ore.`, footer: "La storia di famiglia, raccontata dalla tua famiglia" },
  es: { subject: "Tu enlace de acceso a Treename", title: "Bienvenido a Treename", body: "Toca el botón para abrir la historia de tu familia. El enlace funciona una sola vez y caduca en 24 horas.", cta: "Abrir la historia de mi familia", text: (l) => `Abre la historia de tu familia: ${l}\nEl enlace funciona una sola vez y caduca en 24 horas.`, footer: "La historia familiar, contada por tu familia" },
};

/**
 * Creates a one-time sign-in link and emails it.
 * Returns the link itself only in development without email configured,
 * so the flow can be tested locally. Never in production.
 */
export async function sendLoginLink(opts: {
  email: string;
  draftFamilyId?: string;
  inviteToken?: string;
  next?: string;
  lang?: string | null;
}): Promise<{ devLink?: string }> {
  const t = token(24);
  await db.loginToken.create({
    data: {
      token: t,
      email: opts.email.toLowerCase(),
      draftFamilyId: opts.draftFamilyId,
      inviteToken: opts.inviteToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
  const next = opts.next && opts.next.startsWith("/app") ? `&next=${encodeURIComponent(opts.next)}` : "";
  const link = appUrl(`/api/auth/verify?token=${t}${next}`);
  const m = MAIL[isLang(opts.lang) ? opts.lang : "en"];
  const { sent } = await sendEmail(
    opts.email,
    m.subject,
    emailLayout(m.title, m.body, { label: m.cta, url: link }, m.footer),
    m.text(link)
  );
  // SHOW_LOGIN_LINKS=1 is for staging/testing only, never set it in production.
  const dev = !sent && (process.env.NODE_ENV !== "production" || process.env.SHOW_LOGIN_LINKS === "1");
  return dev ? { devLink: link } : {};
}
