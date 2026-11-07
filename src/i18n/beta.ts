/** Texts for the free beta (PAYMENTS_MODE != live): homepage note, launch e-mail form, billing page, app menu. */
import type { Lang } from "./config";

type BetaT = {
  menu: string;
  tag: string;
  homeTitle: string;
  homeText: string;
  bonus: string;
  startCta: string;
  afterLaunch: string;
  notifyTitle: string;
  notifyText: string;
  emailLabel: string;
  emailPh: string;
  notifyBtn: string;
  reserveBtn: string;
  foundingNote: (price: string) => string;
  done: string;
  doneFounding: string;
  badEmail: string;
  giftCta: string;
  billingTitle: string;
  billingText: string;
  cardBtn: Record<"family" | "legacy" | "founding", string>;
  cardDone: Record<"family" | "legacy" | "founding", string>;
  reserveFine: string;
};

const en: BetaT = {
  menu: "Beta · everything free",
  tag: "Beta",
  homeTitle: "Beta: everything is free right now",
  homeText: "Treename is in its beta, and every feature is open to every family while we test it. The prices below will apply after launch. You will hear from us well before anything changes, nothing is ever charged automatically, and everything your family creates stays yours.",
  bonus: "Families who join during the beta get special conditions at launch.",
  startCta: "Start free in the beta",
  afterLaunch: "after launch",
  notifyTitle: "Want to know when we launch?",
  notifyText: "One e-mail at launch, nothing else.",
  emailLabel: "Your e-mail",
  emailPh: "name@example.com",
  notifyBtn: "Notify me",
  reserveBtn: "Reserve a Founding place",
  foundingNote: (price) => `Founding Family: ${price} once, the family plan for life, only for the first 500 families.`,
  done: "Thank you! We will write to you at launch.",
  doneFounding: "Your Founding Family place is reserved. Nothing has been charged.",
  badEmail: "Please check the e-mail address.",
  giftCta: "Notify me when gifts open",
  billingTitle: "Treename is free during the beta",
  billingText: "All features are open, with no limits on stories, photos or voice. Paid plans start after launch: you will hear from us first, and nothing is charged automatically. Everything your family creates stays yours.",
  cardBtn: { family: "Notify me at launch", legacy: "Notify me when gifts open", founding: "Reserve my place" },
  cardDone: { family: "✓ We will let you know", legacy: "✓ We will let you know", founding: "✓ Place reserved" },
  reserveFine: "A reservation is free and not binding. You pay only after launch, if you still want it.",
};

const ru: BetaT = {
  menu: "Бета · всё бесплатно",
  tag: "Бета",
  homeTitle: "Бета: сейчас всё бесплатно",
  homeText: "Treename работает в бета-режиме, и пока мы его проверяем, все функции открыты для каждой семьи. Цены ниже начнут действовать после запуска. Мы предупредим заранее, ничего не спишем автоматически, а всё, что создаст ваша семья, останется вашим.",
  bonus: "Семьи, которые присоединятся во время беты, получат особые условия при запуске.",
  startCta: "Начать бесплатно",
  afterLaunch: "после запуска",
  notifyTitle: "Сообщить вам о запуске?",
  notifyText: "Одно письмо в день запуска, больше ничего.",
  emailLabel: "Ваш e-mail",
  emailPh: "name@example.com",
  notifyBtn: "Сообщить мне",
  reserveBtn: "Забронировать место основателя",
  foundingNote: (price) => `«Семья-основатель»: ${price} один раз, семейный план навсегда, только для первых 500 семей.`,
  done: "Спасибо! Напишем вам в день запуска.",
  doneFounding: "Место «Семьи-основателя» забронировано за вами. Ничего не списано.",
  badEmail: "Проверьте, пожалуйста, адрес e-mail.",
  giftCta: "Сообщить, когда откроются подарки",
  billingTitle: "Во время беты Treename бесплатен",
  billingText: "Все функции открыты, без ограничений на истории, фото и голос. Платные планы появятся после запуска: мы напишем вам первыми и ничего не спишем автоматически. Всё, что создаст ваша семья, останется вашим.",
  cardBtn: { family: "Сообщить о запуске", legacy: "Сообщить, когда откроются подарки", founding: "Забронировать место" },
  cardDone: { family: "✓ Мы сообщим", legacy: "✓ Мы сообщим", founding: "✓ Место забронировано" },
  reserveFine: "Бронь бесплатная и ни к чему не обязывает. Платить нужно только после запуска, если вы не передумаете.",
};

const de: BetaT = {
  menu: "Beta · alles kostenlos",
  tag: "Beta",
  homeTitle: "Beta: Im Moment ist alles kostenlos",
  homeText: "Treename ist in der Beta, und solange wir testen, stehen allen Familien sämtliche Funktionen offen. Die Preise unten gelten erst nach dem Start. Wir melden uns rechtzeitig, bevor sich etwas ändert, es wird nie automatisch etwas abgebucht, und alles, was Ihre Familie erstellt, bleibt Ihres.",
  bonus: "Familien, die während der Beta dabei sind, erhalten beim Start besondere Konditionen.",
  startCta: "In der Beta kostenlos starten",
  afterLaunch: "nach dem Start",
  notifyTitle: "Sollen wir Ihnen Bescheid geben, wenn es losgeht?",
  notifyText: "Eine E-Mail zum Start, sonst nichts.",
  emailLabel: "Ihre E-Mail",
  emailPh: "name@beispiel.ch",
  notifyBtn: "Benachrichtigen",
  reserveBtn: "Gründerplatz reservieren",
  foundingNote: (price) => `Gründerfamilie: einmalig ${price}, der Familienplan auf Lebenszeit, nur für die ersten 500 Familien.`,
  done: "Danke! Wir schreiben Ihnen zum Start.",
  doneFounding: "Ihr Platz als Gründerfamilie ist reserviert. Es wurde nichts abgebucht.",
  badEmail: "Bitte prüfen Sie die E-Mail-Adresse.",
  giftCta: "Benachrichtigen, wenn Geschenke verfügbar sind",
  billingTitle: "Während der Beta ist Treename kostenlos",
  billingText: "Alle Funktionen sind offen, ohne Grenzen bei Geschichten, Fotos oder Sprachaufnahmen. Bezahlpläne kommen erst nach dem Start: Sie hören zuerst von uns, und es wird nie automatisch etwas abgebucht. Alles, was Ihre Familie erstellt, bleibt Ihres.",
  cardBtn: { family: "Zum Start benachrichtigen", legacy: "Benachrichtigen, wenn Geschenke verfügbar sind", founding: "Platz reservieren" },
  cardDone: { family: "✓ Wir geben Bescheid", legacy: "✓ Wir geben Bescheid", founding: "✓ Platz reserviert" },
  reserveFine: "Die Reservierung ist kostenlos und unverbindlich. Bezahlt wird erst nach dem Start, wenn Sie dann noch möchten.",
};

const fr: BetaT = {
  menu: "Bêta · tout est gratuit",
  tag: "Bêta",
  homeTitle: "Bêta : tout est gratuit pour l’instant",
  homeText: "Treename est en bêta : tant que nous testons, toutes les fonctions sont ouvertes à toutes les familles. Les prix ci-dessous s’appliqueront après le lancement. Nous vous préviendrons bien avant tout changement, rien n’est jamais débité automatiquement, et tout ce que votre famille crée vous appartient.",
  bonus: "Les familles qui nous rejoignent pendant la bêta bénéficieront de conditions particulières au lancement.",
  startCta: "Commencer gratuitement",
  afterLaunch: "après le lancement",
  notifyTitle: "Être prévenu du lancement ?",
  notifyText: "Un seul e-mail au lancement, rien d’autre.",
  emailLabel: "Votre e-mail",
  emailPh: "nom@exemple.fr",
  notifyBtn: "Me prévenir",
  reserveBtn: "Réserver une place fondatrice",
  foundingNote: (price) => `Famille fondatrice : ${price} une seule fois, l’offre Famille à vie, réservée aux 500 premières familles.`,
  done: "Merci ! Nous vous écrirons au lancement.",
  doneFounding: "Votre place de famille fondatrice est réservée. Rien n’a été débité.",
  badEmail: "Merci de vérifier l’adresse e-mail.",
  giftCta: "Me prévenir quand les cadeaux ouvrent",
  billingTitle: "Treename est gratuit pendant la bêta",
  billingText: "Toutes les fonctions sont ouvertes, sans limite d’histoires, de photos ou de voix. Les offres payantes arriveront après le lancement : vous serez prévenu en premier, et rien n’est débité automatiquement. Tout ce que votre famille crée vous appartient.",
  cardBtn: { family: "Me prévenir au lancement", legacy: "Me prévenir quand les cadeaux ouvrent", founding: "Réserver ma place" },
  cardDone: { family: "✓ Nous vous préviendrons", legacy: "✓ Nous vous préviendrons", founding: "✓ Place réservée" },
  reserveFine: "La réservation est gratuite et sans engagement. Vous ne payez qu’après le lancement, si vous le souhaitez toujours.",
};

const it: BetaT = {
  menu: "Beta · tutto gratis",
  tag: "Beta",
  homeTitle: "Beta: per ora è tutto gratis",
  homeText: "Treename è in beta e, finché lo stiamo provando, tutte le funzioni sono aperte a ogni famiglia. I prezzi qui sotto varranno dopo il lancio. Vi avviseremo con largo anticipo, non addebitiamo mai nulla in automatico e tutto ciò che la vostra famiglia crea resta vostro.",
  bonus: "Le famiglie che si uniscono durante la beta avranno condizioni speciali al lancio.",
  startCta: "Inizia gratis nella beta",
  afterLaunch: "dopo il lancio",
  notifyTitle: "Vuoi sapere quando partiamo?",
  notifyText: "Una sola e-mail al lancio, nient’altro.",
  emailLabel: "La tua e-mail",
  emailPh: "nome@esempio.it",
  notifyBtn: "Avvisami",
  reserveBtn: "Prenota un posto da fondatore",
  foundingNote: (price) => `Famiglia fondatrice: ${price} una volta sola, il piano Famiglia per sempre, solo per le prime 500 famiglie.`,
  done: "Grazie! Ti scriveremo al lancio.",
  doneFounding: "Il tuo posto da famiglia fondatrice è prenotato. Non è stato addebitato nulla.",
  badEmail: "Controlla l’indirizzo e-mail, per favore.",
  giftCta: "Avvisami quando aprono i regali",
  billingTitle: "Durante la beta Treename è gratis",
  billingText: "Tutte le funzioni sono aperte, senza limiti per storie, foto o voce. I piani a pagamento arriveranno dopo il lancio: sarai il primo a saperlo e non addebitiamo nulla in automatico. Tutto ciò che la tua famiglia crea resta vostro.",
  cardBtn: { family: "Avvisami al lancio", legacy: "Avvisami quando aprono i regali", founding: "Prenota il mio posto" },
  cardDone: { family: "✓ Ti avviseremo", legacy: "✓ Ti avviseremo", founding: "✓ Posto prenotato" },
  reserveFine: "La prenotazione è gratuita e non vincolante. Paghi solo dopo il lancio, se lo desideri ancora.",
};

const es: BetaT = {
  menu: "Beta · todo gratis",
  tag: "Beta",
  homeTitle: "Beta: ahora mismo todo es gratis",
  homeText: "Treename está en beta y, mientras lo probamos, todas las funciones están abiertas para todas las familias. Los precios de abajo se aplicarán después del lanzamiento. Te avisaremos con tiempo antes de cualquier cambio, nunca cobramos nada de forma automática y todo lo que cree tu familia sigue siendo vuestro.",
  bonus: "Las familias que se unan durante la beta tendrán condiciones especiales en el lanzamiento.",
  startCta: "Empieza gratis en la beta",
  afterLaunch: "tras el lanzamiento",
  notifyTitle: "¿Te avisamos del lanzamiento?",
  notifyText: "Un solo e-mail en el lanzamiento, nada más.",
  emailLabel: "Tu e-mail",
  emailPh: "nombre@ejemplo.es",
  notifyBtn: "Avísame",
  reserveBtn: "Reservar plaza de fundador",
  foundingNote: (price) => `Familia fundadora: ${price} una sola vez, el plan Familia para siempre, solo para las primeras 500 familias.`,
  done: "¡Gracias! Te escribiremos en el lanzamiento.",
  doneFounding: "Tu plaza de familia fundadora está reservada. No se ha cobrado nada.",
  badEmail: "Revisa la dirección de e-mail, por favor.",
  giftCta: "Avísame cuando abran los regalos",
  billingTitle: "Durante la beta Treename es gratis",
  billingText: "Todas las funciones están abiertas, sin límites de historias, fotos o voz. Los planes de pago llegarán tras el lanzamiento: serás el primero en saberlo y nunca cobramos de forma automática. Todo lo que cree tu familia sigue siendo vuestro.",
  cardBtn: { family: "Avísame en el lanzamiento", legacy: "Avísame cuando abran los regalos", founding: "Reservar mi plaza" },
  cardDone: { family: "✓ Te avisaremos", legacy: "✓ Te avisaremos", founding: "✓ Plaza reservada" },
  reserveFine: "La reserva es gratuita y no te compromete a nada. Solo pagas tras el lanzamiento, si todavía lo quieres.",
};

export const BETA: Record<Lang, BetaT> = { en, ru, de, fr, it, es };
