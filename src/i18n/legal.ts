/**
 * Privacy policy and legal notice (Impressum), per language.
 * Written from what the code actually does (Nov 2026). DRAFT for review by a Swiss/EU data-protection lawyer:
 * open points for the lawyer are listed in claude/legal-draft-2026-11-07.md in the Project.
 */
import type { Lang } from "./config";

export const OPERATOR = {
  name: "FC Finance Consulting GmbH",
  street: "Zugerstrasse 20",
  city: "6314 Unterägeri",
  uid: "CHE-314.397.343",
  register: "CH-130.4.031.657-1",
  manager: "Egor Lavrishchev",
  privacy: "privacy@treename.ai",
  hello: "hello@treename.ai",
};

type Section = { h: string; p: string[] };
type LegalT = {
  policyTitle: string;
  updated: string;
  sections: (region: string) => Section[];
  regionEu: string;
  regionCh: string;
  imprint: {
    link: string;
    title: string;
    operator: string;
    address: string;
    register: string;
    manager: string;
    managerRole: string;
    contact: string;
    privacyContact: string;
    disclaimerH: string;
    disclaimer: string;
  };
};

const O = OPERATOR;
const addr = `${O.name}, ${O.street}, ${O.city}`;

const en: LegalT = {
  policyTitle: "Privacy policy",
  updated: "Last updated: 7 November 2026",
  regionEu: "the European Union (Frankfurt)",
  regionCh: "Switzerland",
  sections: (region) => [
    { h: "1. Who is responsible", p: [
      `Treename is operated by ${addr}, Switzerland (UID ${O.uid}). We are responsible for your personal data under the Swiss Federal Act on Data Protection (FADP) and, for people in the EU and EEA, the General Data Protection Regulation (GDPR).`,
      `Questions about your data: ${O.privacy}.`,
    ]},
    { h: "2. What we store", p: [
      "Your account: e-mail address, name and preferred language.",
      "Your family space: names, dates, places and relationships of family members, stories, voice recordings, photos, life events and questions, added by you and by the relatives you invite. This can include information about relatives who are alive or deceased.",
      "Invitations: the e-mail addresses or links you use to invite relatives.",
      "Usage: which pages and features are used (for example “question sent”, “story saved”) and, if you arrived through a link with a campaign tag, where you came from. We use this only in our own statistics.",
      "Technical data: our hosting provider processes IP addresses and similar data in server logs to deliver the site and protect it.",
      "If you leave your e-mail for the launch or reserve a Founding Family place: that e-mail, the choice and your language.",
      "Payments, once paid plans start: handled by Stripe. We never see or store card numbers.",
    ]},
    { h: "3. Why we use it and on what basis", p: [
      "To provide Treename: create your family space, show it to the people you invite, send sign-in links and invitations (performance of our contract with you; Art. 6(1)(b) GDPR).",
      "To use the AI features you start: transcribe voice recordings, turn answers into stories, correct typos and search public archives for ancestors (performance of contract). Names of living people are never put into web searches.",
      "To improve the product with our own anonymised usage statistics (our legitimate interest; Art. 6(1)(f) GDPR).",
      "To send the launch e-mail you asked for (your consent; Art. 6(1)(a) GDPR, which you can withdraw at any time).",
      "To bill paid plans and keep accounting records (contract and legal obligation; Art. 6(1)(c) GDPR).",
      "We do not sell your data, we do not show advertising inside Treename and we do not use your family content for advertising.",
    ]},
    { h: "4. Information about relatives", p: [
      "Family history is about other people too. Please add only what you are entitled to share and respect relatives who do not want to be included.",
      "Data about living people is visible only inside your family space and is never shown on a public page. A family page you share shows only stories you mark for it.",
      `Any relative can ask us to correct or remove information about them: write to ${O.privacy}.`,
    ]},
    { h: "5. Service providers and countries", p: [
      `Your family space is stored in data centres in ${region}. We use these providers, bound by data processing agreements:`,
      "Vercel Inc. (USA): hosting of the website and storage of photos and recordings.",
      "Neon Inc. (USA): the database, with servers in the region named above.",
      "Resend Inc. (USA): sending sign-in and invitation e-mails.",
      "Anthropic PBC (USA): AI for stories, corrections and archive research.",
      "OpenAI L.L.C. (USA): transcription of voice recordings.",
      "Stripe Payments Europe Ltd. (Ireland) and Stripe Inc. (USA): payments, once paid plans start.",
      "Some of these providers process data in the USA. Such transfers are based on the Swiss–US and EU–US Data Privacy Framework where the provider is certified, and otherwise on the standard contractual clauses approved by the European Commission and recognised in Switzerland. Under their business terms, the AI providers do not use the data we send them to train their models.",
    ]},
    { h: "6. Cookies", p: [
      "We use only cookies that the site needs or that remember your choices: sign-in (tn_session, tn_family), language (tn_lang), the look of the site (tn_look), unfinished onboarding (tn_onboarding) and, for 60 days, the source of your visit if the link had a campaign tag (tn_src). We do not use advertising cookies or third-party trackers.",
    ]},
    { h: "7. How long we keep data", p: [
      "Family content is kept as long as your family space exists. When you delete the family space in Settings, its content and files are deleted from our systems; copies in our providers’ backups disappear after a short period.",
      "Launch e-mails are kept until you ask us to remove them, and at the latest 12 months after the launch. Accounting records are kept for 10 years as Swiss law requires.",
    ]},
    { h: "8. Your rights", p: [
      "You can ask for access to your data, correction, deletion, restriction or objection, and you can withdraw consent at any time. You can export everything yourself (stories, recordings, photos, the tree as GEDCOM) and delete your family space in Settings.",
      `Write to ${O.privacy}. You can also complain to the Swiss Federal Data Protection and Information Commissioner (FDPIC) or, in the EU, to the data protection authority of your country.`,
    ]},
    { h: "9. Children", p: [
      "Treename is meant for adults. Children may appear in a family’s stories and tree when an adult family member adds them; data about living children is never public.",
    ]},
    { h: "10. Security and changes", p: [
      "Connections are encrypted, and only members of a family space can see its content. If we change this policy, we will show the new date here and inform users of important changes by e-mail.",
    ]},
  ],
  imprint: {
    link: "Legal notice",
    title: "Legal notice",
    operator: "Operator",
    address: "Address",
    register: "Commercial register",
    manager: "Authorised representative",
    managerRole: "managing director",
    contact: "Contact",
    privacyContact: "Data protection",
    disclaimerH: "Liability",
    disclaimer: "We prepare the content of this site with care but cannot guarantee that it is complete or always up to date. We are not responsible for the content of external websites we link to. Stories and family information in family spaces are written by their users.",
  },
};

const de: LegalT = {
  policyTitle: "Datenschutzerklärung",
  updated: "Stand: 7. November 2026",
  regionEu: "der Europäischen Union (Frankfurt)",
  regionCh: "der Schweiz",
  sections: (region) => [
    { h: "1. Verantwortliche Stelle", p: [
      `Treename wird betrieben von der ${addr}, Schweiz (UID ${O.uid}). Wir sind für Ihre Personendaten verantwortlich nach dem Schweizer Datenschutzgesetz (DSG) und, für Personen in der EU und im EWR, nach der Datenschutz-Grundverordnung (DSGVO).`,
      `Fragen zu Ihren Daten: ${O.privacy}.`,
    ]},
    { h: "2. Welche Daten wir speichern", p: [
      "Ihr Konto: E-Mail-Adresse, Name und bevorzugte Sprache.",
      "Ihr Familienbereich: Namen, Daten, Orte und Verwandtschaftsbeziehungen von Familienmitgliedern, Geschichten, Sprachaufnahmen, Fotos, Lebensereignisse und Fragen, eingegeben von Ihnen und den Verwandten, die Sie einladen. Dazu können Angaben über lebende und verstorbene Verwandte gehören.",
      "Einladungen: die E-Mail-Adressen oder Links, mit denen Sie Verwandte einladen.",
      "Nutzung: welche Seiten und Funktionen genutzt werden (zum Beispiel «Frage gesendet», «Geschichte gespeichert») und, wenn Sie über einen Link mit Kampagnenkennzeichnung kamen, woher. Wir verwenden das nur für eigene Statistiken.",
      "Technische Daten: Unser Hosting-Anbieter verarbeitet IP-Adressen und ähnliche Daten in Server-Protokollen, um die Website auszuliefern und zu schützen.",
      "Wenn Sie sich für die Benachrichtigung zum Start eintragen oder einen Platz als Gründerfamilie reservieren: diese E-Mail-Adresse, Ihre Auswahl und Ihre Sprache.",
      "Zahlungen, sobald es Bezahlpläne gibt: über Stripe. Kartennummern sehen und speichern wir nie.",
    ]},
    { h: "3. Zwecke und Rechtsgrundlagen", p: [
      "Um Treename bereitzustellen: Ihren Familienbereich anlegen, ihn den eingeladenen Personen zeigen, Anmeldelinks und Einladungen senden (Vertragserfüllung; Art. 6 Abs. 1 lit. b DSGVO).",
      "Für die KI-Funktionen, die Sie auslösen: Sprachaufnahmen verschriftlichen, Antworten zu Geschichten verarbeiten, Tippfehler korrigieren und öffentliche Archive nach Vorfahren durchsuchen (Vertragserfüllung). Namen lebender Personen werden nie in Websuchen verwendet.",
      "Um das Produkt mit eigenen, anonymisierten Nutzungsstatistiken zu verbessern (berechtigtes Interesse; Art. 6 Abs. 1 lit. f DSGVO).",
      "Um Ihnen die gewünschte E-Mail zum Start zu senden (Einwilligung; Art. 6 Abs. 1 lit. a DSGVO, jederzeit widerrufbar).",
      "Um Bezahlpläne abzurechnen und Buchhaltungsunterlagen aufzubewahren (Vertrag und gesetzliche Pflicht; Art. 6 Abs. 1 lit. c DSGVO).",
      "Wir verkaufen keine Daten, zeigen in Treename keine Werbung und verwenden Familieninhalte nicht für Werbung.",
    ]},
    { h: "4. Angaben über Verwandte", p: [
      "Familiengeschichte betrifft auch andere Menschen. Bitte erfassen Sie nur, was Sie teilen dürfen, und respektieren Sie Verwandte, die nicht aufgenommen werden möchten.",
      "Daten lebender Personen sind nur im Familienbereich sichtbar und erscheinen nie auf einer öffentlichen Seite. Eine geteilte Familienseite zeigt nur Geschichten, die Sie dafür markieren.",
      `Jede verwandte Person kann verlangen, dass wir Angaben über sie berichtigen oder löschen: ${O.privacy}.`,
    ]},
    { h: "5. Dienstleister und Länder", p: [
      `Ihr Familienbereich wird in Rechenzentren in ${region} gespeichert. Wir setzen folgende Anbieter ein, mit denen Auftragsverarbeitungsverträge bestehen:`,
      "Vercel Inc. (USA): Hosting der Website und Speicherung von Fotos und Aufnahmen.",
      "Neon Inc. (USA): Datenbank, mit Servern in der oben genannten Region.",
      "Resend Inc. (USA): Versand von Anmelde- und Einladungs-E-Mails.",
      "Anthropic PBC (USA): KI für Geschichten, Korrekturen und Archivrecherche.",
      "OpenAI L.L.C. (USA): Verschriftlichung von Sprachaufnahmen.",
      "Stripe Payments Europe Ltd. (Irland) und Stripe Inc. (USA): Zahlungen, sobald es Bezahlpläne gibt.",
      "Einige dieser Anbieter verarbeiten Daten in den USA. Grundlage dafür ist das Swiss-U.S. bzw. EU-U.S. Data Privacy Framework, sofern der Anbieter zertifiziert ist, sonst die von der EU-Kommission genehmigten und in der Schweiz anerkannten Standardvertragsklauseln. Nach ihren Geschäftsbedingungen verwenden die KI-Anbieter die übermittelten Daten nicht zum Training ihrer Modelle.",
    ]},
    { h: "6. Cookies", p: [
      "Wir verwenden nur Cookies, die die Website braucht oder die Ihre Einstellungen speichern: Anmeldung (tn_session, tn_family), Sprache (tn_lang), Darstellung (tn_look), unvollständige Einrichtung (tn_onboarding) und für 60 Tage die Herkunft Ihres Besuchs, wenn der Link eine Kampagnenkennzeichnung hatte (tn_src). Werbe-Cookies oder Tracker von Dritten verwenden wir nicht.",
    ]},
    { h: "7. Speicherdauer", p: [
      "Familieninhalte speichern wir, solange Ihr Familienbereich besteht. Löschen Sie ihn in den Einstellungen, werden Inhalte und Dateien aus unseren Systemen gelöscht; Kopien in Sicherungen unserer Anbieter verschwinden nach kurzer Zeit.",
      "E-Mails für die Startbenachrichtigung behalten wir, bis Sie die Löschung verlangen, längstens 12 Monate nach dem Start. Buchhaltungsunterlagen bewahren wir 10 Jahre auf, wie es das Schweizer Recht verlangt.",
    ]},
    { h: "8. Ihre Rechte", p: [
      "Sie können Auskunft, Berichtigung, Löschung, Einschränkung oder Widerspruch verlangen und Einwilligungen jederzeit widerrufen. Alles lässt sich selbst exportieren (Geschichten, Aufnahmen, Fotos, Stammbaum als GEDCOM), und der Familienbereich lässt sich in den Einstellungen löschen.",
      `Schreiben Sie an ${O.privacy}. Sie können sich auch beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) oder, in der EU, bei der Datenschutzbehörde Ihres Landes beschweren.`,
    ]},
    { h: "9. Kinder", p: [
      "Treename richtet sich an Erwachsene. Kinder können in Geschichten und im Stammbaum vorkommen, wenn ein erwachsenes Familienmitglied sie erfasst; Daten lebender Kinder sind nie öffentlich.",
    ]},
    { h: "10. Sicherheit und Änderungen", p: [
      "Verbindungen sind verschlüsselt, und nur Mitglieder eines Familienbereichs sehen dessen Inhalte. Ändern wir diese Erklärung, zeigen wir hier das neue Datum und informieren über wichtige Änderungen per E-Mail.",
    ]},
  ],
  imprint: {
    link: "Impressum",
    title: "Impressum",
    operator: "Betreiberin",
    address: "Adresse",
    register: "Handelsregister",
    manager: "Vertretungsberechtigte Person",
    managerRole: "Geschäftsführer",
    contact: "Kontakt",
    privacyContact: "Datenschutz",
    disclaimerH: "Haftung",
    disclaimer: "Wir erstellen die Inhalte dieser Website mit Sorgfalt, können aber keine Gewähr für Vollständigkeit und Aktualität übernehmen. Für Inhalte verlinkter externer Websites sind deren Betreiber verantwortlich. Geschichten und Familienangaben in Familienbereichen stammen von deren Nutzerinnen und Nutzern.",
  },
};

const fr: LegalT = {
  policyTitle: "Politique de confidentialité",
  updated: "Mise à jour : 7 novembre 2026",
  regionEu: "l’Union européenne (Francfort)",
  regionCh: "Suisse",
  sections: (region) => [
    { h: "1. Responsable du traitement", p: [
      `Treename est exploité par ${addr}, Suisse (IDE ${O.uid}). Nous sommes responsables de vos données personnelles au sens de la loi fédérale sur la protection des données (LPD) et, pour les personnes dans l’UE et l’EEE, du Règlement général sur la protection des données (RGPD).`,
      `Questions sur vos données : ${O.privacy}.`,
    ]},
    { h: "2. Données que nous conservons", p: [
      "Votre compte : adresse e-mail, nom et langue préférée.",
      "Votre espace familial : noms, dates, lieux et liens de parenté des membres de la famille, histoires, enregistrements vocaux, photos, événements de vie et questions, ajoutés par vous et par les proches que vous invitez. Cela peut inclure des informations sur des proches vivants ou décédés.",
      "Invitations : les adresses e-mail ou liens que vous utilisez pour inviter vos proches.",
      "Utilisation : les pages et fonctions utilisées (par exemple « question envoyée », « histoire enregistrée ») et, si vous êtes arrivé par un lien avec une étiquette de campagne, votre provenance. Nous l’utilisons uniquement pour nos propres statistiques.",
      "Données techniques : notre hébergeur traite les adresses IP et données similaires dans les journaux du serveur pour fournir et protéger le site.",
      "Si vous laissez votre e-mail pour le lancement ou réservez une place de famille fondatrice : cet e-mail, votre choix et votre langue.",
      "Paiements, dès que les offres payantes démarrent : gérés par Stripe. Nous ne voyons ni ne conservons jamais les numéros de carte.",
    ]},
    { h: "3. Finalités et bases juridiques", p: [
      "Fournir Treename : créer votre espace familial, le montrer aux personnes invitées, envoyer liens de connexion et invitations (exécution du contrat ; art. 6, par. 1, let. b RGPD).",
      "Les fonctions d’IA que vous lancez : transcrire les enregistrements, transformer les réponses en histoires, corriger les fautes et chercher des ancêtres dans des archives publiques (exécution du contrat). Les noms de personnes vivantes ne sont jamais utilisés dans des recherches web.",
      "Améliorer le produit grâce à nos propres statistiques d’utilisation anonymisées (intérêt légitime ; art. 6, par. 1, let. f RGPD).",
      "Vous envoyer l’e-mail de lancement demandé (consentement ; art. 6, par. 1, let. a RGPD, révocable à tout moment).",
      "Facturer les offres payantes et conserver la comptabilité (contrat et obligation légale ; art. 6, par. 1, let. c RGPD).",
      "Nous ne vendons pas vos données, n’affichons pas de publicité dans Treename et n’utilisons pas le contenu familial à des fins publicitaires.",
    ]},
    { h: "4. Informations sur vos proches", p: [
      "L’histoire familiale concerne aussi d’autres personnes. N’ajoutez que ce que vous avez le droit de partager et respectez les proches qui ne souhaitent pas y figurer.",
      "Les données de personnes vivantes ne sont visibles que dans votre espace familial et n’apparaissent jamais sur une page publique. Une page familiale partagée ne montre que les histoires que vous lui destinez.",
      `Tout proche peut nous demander de corriger ou supprimer les informations le concernant : ${O.privacy}.`,
    ]},
    { h: "5. Prestataires et pays", p: [
      `Votre espace familial est stocké dans des centres de données en ${region}. Nous faisons appel à ces prestataires, liés par des contrats de sous-traitance :`,
      "Vercel Inc. (États-Unis) : hébergement du site et stockage des photos et enregistrements.",
      "Neon Inc. (États-Unis) : base de données, avec des serveurs dans la région indiquée ci-dessus.",
      "Resend Inc. (États-Unis) : envoi des e-mails de connexion et d’invitation.",
      "Anthropic PBC (États-Unis) : IA pour les histoires, corrections et recherches d’archives.",
      "OpenAI L.L.C. (États-Unis) : transcription des enregistrements vocaux.",
      "Stripe Payments Europe Ltd. (Irlande) et Stripe Inc. (États-Unis) : paiements, dès que les offres payantes démarrent.",
      "Certains de ces prestataires traitent des données aux États-Unis. Ces transferts reposent sur le Swiss-U.S. et l’EU-U.S. Data Privacy Framework lorsque le prestataire est certifié, sinon sur les clauses contractuelles types approuvées par la Commission européenne et reconnues en Suisse. Selon leurs conditions commerciales, les fournisseurs d’IA n’utilisent pas les données transmises pour entraîner leurs modèles.",
    ]},
    { h: "6. Cookies", p: [
      "Nous n’utilisons que des cookies nécessaires au site ou qui mémorisent vos choix : connexion (tn_session, tn_family), langue (tn_lang), apparence du site (tn_look), inscription inachevée (tn_onboarding) et, pendant 60 jours, la provenance de votre visite si le lien portait une étiquette de campagne (tn_src). Aucun cookie publicitaire ni traceur tiers.",
    ]},
    { h: "7. Durée de conservation", p: [
      "Le contenu familial est conservé tant que votre espace familial existe. Si vous le supprimez dans les Réglages, son contenu et ses fichiers sont effacés de nos systèmes ; les copies dans les sauvegardes de nos prestataires disparaissent après une courte période.",
      "Les e-mails de lancement sont conservés jusqu’à votre demande de suppression, au plus tard 12 mois après le lancement. La comptabilité est conservée 10 ans, comme l’exige le droit suisse.",
    ]},
    { h: "8. Vos droits", p: [
      "Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou vous opposer au traitement, et retirer votre consentement à tout moment. Vous pouvez tout exporter vous-même (histoires, enregistrements, photos, arbre en GEDCOM) et supprimer votre espace familial dans les Réglages.",
      `Écrivez à ${O.privacy}. Vous pouvez aussi déposer plainte auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT) ou, dans l’UE, auprès de l’autorité de protection des données de votre pays.`,
    ]},
    { h: "9. Enfants", p: [
      "Treename s’adresse aux adultes. Des enfants peuvent figurer dans les histoires et l’arbre lorsqu’un adulte de la famille les ajoute ; les données d’enfants vivants ne sont jamais publiques.",
    ]},
    { h: "10. Sécurité et modifications", p: [
      "Les connexions sont chiffrées et seuls les membres d’un espace familial en voient le contenu. Si nous modifions cette politique, la nouvelle date figurera ici et nous informerons les utilisateurs par e-mail des changements importants.",
    ]},
  ],
  imprint: {
    link: "Mentions légales",
    title: "Mentions légales",
    operator: "Exploitant",
    address: "Adresse",
    register: "Registre du commerce",
    manager: "Personne autorisée à représenter",
    managerRole: "gérant",
    contact: "Contact",
    privacyContact: "Protection des données",
    disclaimerH: "Responsabilité",
    disclaimer: "Nous préparons le contenu de ce site avec soin, sans pouvoir garantir qu’il soit complet ou toujours à jour. Les exploitants des sites externes liés sont responsables de leur contenu. Les histoires et informations des espaces familiaux sont rédigées par leurs utilisateurs.",
  },
};

const it: LegalT = {
  policyTitle: "Informativa sulla privacy",
  updated: "Aggiornata il 7 novembre 2026",
  regionEu: "nell’Unione europea (Francoforte)",
  regionCh: "in Svizzera",
  sections: (region) => [
    { h: "1. Titolare del trattamento", p: [
      `Treename è gestito da ${addr}, Svizzera (IDI ${O.uid}). Siamo responsabili dei vostri dati personali ai sensi della legge federale sulla protezione dei dati (LPD) e, per le persone nell’UE e nel SEE, del Regolamento generale sulla protezione dei dati (GDPR).`,
      `Domande sui vostri dati: ${O.privacy}.`,
    ]},
    { h: "2. Quali dati conserviamo", p: [
      "Il vostro account: indirizzo e-mail, nome e lingua preferita.",
      "Il vostro spazio di famiglia: nomi, date, luoghi e legami di parentela dei familiari, storie, registrazioni vocali, foto, eventi della vita e domande, inseriti da voi e dai parenti che invitate. Possono esserci informazioni su parenti viventi o defunti.",
      "Inviti: gli indirizzi e-mail o i link con cui invitate i parenti.",
      "Utilizzo: quali pagine e funzioni vengono usate (per esempio «domanda inviata», «storia salvata») e, se siete arrivati da un link con un’etichetta di campagna, la provenienza. Lo usiamo solo per le nostre statistiche.",
      "Dati tecnici: il nostro fornitore di hosting tratta indirizzi IP e dati simili nei log del server per fornire e proteggere il sito.",
      "Se lasciate l’e-mail per il lancio o prenotate un posto da famiglia fondatrice: quell’e-mail, la scelta e la vostra lingua.",
      "Pagamenti, quando partiranno i piani a pagamento: gestiti da Stripe. Non vediamo né conserviamo mai i numeri di carta.",
    ]},
    { h: "3. Finalità e basi giuridiche", p: [
      "Fornire Treename: creare il vostro spazio di famiglia, mostrarlo alle persone invitate, inviare link di accesso e inviti (esecuzione del contratto; art. 6, par. 1, lett. b GDPR).",
      "Le funzioni di IA che avviate: trascrivere le registrazioni, trasformare le risposte in storie, correggere i refusi e cercare antenati in archivi pubblici (esecuzione del contratto). I nomi delle persone viventi non vengono mai usati nelle ricerche web.",
      "Migliorare il prodotto con nostre statistiche d’uso anonimizzate (interesse legittimo; art. 6, par. 1, lett. f GDPR).",
      "Inviarvi l’e-mail di lancio richiesta (consenso; art. 6, par. 1, lett. a GDPR, revocabile in qualsiasi momento).",
      "Fatturare i piani a pagamento e conservare la contabilità (contratto e obbligo di legge; art. 6, par. 1, lett. c GDPR).",
      "Non vendiamo i vostri dati, non mostriamo pubblicità in Treename e non usiamo i contenuti di famiglia per la pubblicità.",
    ]},
    { h: "4. Informazioni sui parenti", p: [
      "La storia di famiglia riguarda anche altre persone. Inserite solo ciò che avete il diritto di condividere e rispettate i parenti che non vogliono comparire.",
      "I dati delle persone viventi sono visibili solo nel vostro spazio di famiglia e non appaiono mai su una pagina pubblica. Una pagina di famiglia condivisa mostra solo le storie che contrassegnate.",
      `Ogni parente può chiederci di correggere o cancellare le informazioni che lo riguardano: ${O.privacy}.`,
    ]},
    { h: "5. Fornitori e paesi", p: [
      `Il vostro spazio di famiglia è conservato in centri dati ${region}. Ci avvaliamo di questi fornitori, vincolati da accordi sul trattamento dei dati:`,
      "Vercel Inc. (USA): hosting del sito e archiviazione di foto e registrazioni.",
      "Neon Inc. (USA): database, con server nella regione indicata sopra.",
      "Resend Inc. (USA): invio delle e-mail di accesso e di invito.",
      "Anthropic PBC (USA): IA per storie, correzioni e ricerche d’archivio.",
      "OpenAI L.L.C. (USA): trascrizione delle registrazioni vocali.",
      "Stripe Payments Europe Ltd. (Irlanda) e Stripe Inc. (USA): pagamenti, quando partiranno i piani a pagamento.",
      "Alcuni fornitori trattano dati negli Stati Uniti. Questi trasferimenti si basano sullo Swiss-U.S. e sull’EU-U.S. Data Privacy Framework se il fornitore è certificato, altrimenti sulle clausole contrattuali tipo approvate dalla Commissione europea e riconosciute in Svizzera. Secondo le loro condizioni commerciali, i fornitori di IA non usano i dati ricevuti per addestrare i propri modelli.",
    ]},
    { h: "6. Cookie", p: [
      "Usiamo solo cookie necessari al sito o che ricordano le vostre scelte: accesso (tn_session, tn_family), lingua (tn_lang), aspetto del sito (tn_look), registrazione non completata (tn_onboarding) e, per 60 giorni, la provenienza della visita se il link aveva un’etichetta di campagna (tn_src). Nessun cookie pubblicitario né tracciamento di terzi.",
    ]},
    { h: "7. Durata di conservazione", p: [
      "I contenuti di famiglia sono conservati finché esiste il vostro spazio di famiglia. Se lo eliminate nelle Impostazioni, contenuti e file vengono cancellati dai nostri sistemi; le copie nei backup dei fornitori scompaiono dopo breve tempo.",
      "Le e-mail per il lancio sono conservate finché non ne chiedete la cancellazione, al massimo 12 mesi dopo il lancio. La contabilità è conservata 10 anni, come richiede il diritto svizzero.",
    ]},
    { h: "8. I vostri diritti", p: [
      "Potete chiedere accesso, rettifica, cancellazione, limitazione od opporvi al trattamento, e revocare il consenso in qualsiasi momento. Potete esportare tutto da soli (storie, registrazioni, foto, albero in GEDCOM) ed eliminare lo spazio di famiglia nelle Impostazioni.",
      `Scrivete a ${O.privacy}. Potete anche rivolgervi all’Incaricato federale della protezione dei dati e della trasparenza (IFPDT) o, nell’UE, all’autorità per la protezione dei dati del vostro paese.`,
    ]},
    { h: "9. Minori", p: [
      "Treename è pensato per gli adulti. I bambini possono comparire nelle storie e nell’albero se un familiare adulto li inserisce; i dati di bambini viventi non sono mai pubblici.",
    ]},
    { h: "10. Sicurezza e modifiche", p: [
      "Le connessioni sono cifrate e solo i membri di uno spazio di famiglia ne vedono i contenuti. Se modifichiamo questa informativa, qui comparirà la nuova data e informeremo per e-mail sui cambiamenti importanti.",
    ]},
  ],
  imprint: {
    link: "Note legali",
    title: "Note legali",
    operator: "Gestore",
    address: "Indirizzo",
    register: "Registro di commercio",
    manager: "Persona autorizzata alla rappresentanza",
    managerRole: "gerente",
    contact: "Contatto",
    privacyContact: "Protezione dei dati",
    disclaimerH: "Responsabilità",
    disclaimer: "Prepariamo i contenuti di questo sito con cura, ma non possiamo garantire che siano completi o sempre aggiornati. I gestori dei siti esterni collegati sono responsabili dei loro contenuti. Storie e informazioni negli spazi di famiglia sono scritte dai rispettivi utenti.",
  },
};

const es: LegalT = {
  policyTitle: "Política de privacidad",
  updated: "Actualizada el 7 de noviembre de 2026",
  regionEu: "la Unión Europea (Fráncfort)",
  regionCh: "Suiza",
  sections: (region) => [
    { h: "1. Responsable del tratamiento", p: [
      `Treename lo gestiona ${addr}, Suiza (UID ${O.uid}). Somos responsables de tus datos personales según la Ley Federal suiza de Protección de Datos (LPD) y, para las personas en la UE y el EEE, el Reglamento General de Protección de Datos (RGPD).`,
      `Preguntas sobre tus datos: ${O.privacy}.`,
    ]},
    { h: "2. Qué datos guardamos", p: [
      "Tu cuenta: dirección de e-mail, nombre e idioma preferido.",
      "Tu espacio familiar: nombres, fechas, lugares y parentescos de los familiares, historias, grabaciones de voz, fotos, acontecimientos vitales y preguntas, añadidos por ti y por los familiares que invites. Puede incluir información sobre familiares vivos o fallecidos.",
      "Invitaciones: las direcciones de e-mail o enlaces con los que invitas a familiares.",
      "Uso: qué páginas y funciones se usan (por ejemplo «pregunta enviada», «historia guardada») y, si llegaste por un enlace con etiqueta de campaña, de dónde vienes. Lo usamos solo para nuestras propias estadísticas.",
      "Datos técnicos: nuestro proveedor de alojamiento trata direcciones IP y datos similares en los registros del servidor para servir y proteger el sitio.",
      "Si dejas tu e-mail para el lanzamiento o reservas una plaza de familia fundadora: ese e-mail, tu elección y tu idioma.",
      "Pagos, cuando empiecen los planes de pago: gestionados por Stripe. Nunca vemos ni guardamos números de tarjeta.",
    ]},
    { h: "3. Finalidades y bases jurídicas", p: [
      "Prestar Treename: crear tu espacio familiar, mostrarlo a las personas invitadas, enviar enlaces de acceso e invitaciones (ejecución del contrato; art. 6.1.b RGPD).",
      "Las funciones de IA que inicias: transcribir grabaciones, convertir respuestas en historias, corregir erratas y buscar antepasados en archivos públicos (ejecución del contrato). Los nombres de personas vivas nunca se usan en búsquedas web.",
      "Mejorar el producto con nuestras propias estadísticas de uso anonimizadas (interés legítimo; art. 6.1.f RGPD).",
      "Enviarte el e-mail de lanzamiento que pediste (consentimiento; art. 6.1.a RGPD, que puedes retirar en cualquier momento).",
      "Facturar los planes de pago y conservar la contabilidad (contrato y obligación legal; art. 6.1.c RGPD).",
      "No vendemos tus datos, no mostramos publicidad en Treename y no usamos el contenido familiar con fines publicitarios.",
    ]},
    { h: "4. Información sobre familiares", p: [
      "La historia familiar también trata de otras personas. Añade solo lo que tengas derecho a compartir y respeta a los familiares que no quieran aparecer.",
      "Los datos de personas vivas solo son visibles dentro de tu espacio familiar y nunca aparecen en una página pública. Una página familiar compartida muestra solo las historias que marques para ella.",
      `Cualquier familiar puede pedirnos que corrijamos o eliminemos la información sobre él: ${O.privacy}.`,
    ]},
    { h: "5. Proveedores y países", p: [
      `Tu espacio familiar se guarda en centros de datos en ${region}. Trabajamos con estos proveedores, vinculados por contratos de encargo de tratamiento:`,
      "Vercel Inc. (EE. UU.): alojamiento del sitio y almacenamiento de fotos y grabaciones.",
      "Neon Inc. (EE. UU.): base de datos, con servidores en la región indicada arriba.",
      "Resend Inc. (EE. UU.): envío de e-mails de acceso e invitación.",
      "Anthropic PBC (EE. UU.): IA para historias, correcciones y búsquedas en archivos.",
      "OpenAI L.L.C. (EE. UU.): transcripción de grabaciones de voz.",
      "Stripe Payments Europe Ltd. (Irlanda) y Stripe Inc. (EE. UU.): pagos, cuando empiecen los planes de pago.",
      "Algunos proveedores tratan datos en Estados Unidos. Estas transferencias se basan en el Swiss-U.S. y el EU-U.S. Data Privacy Framework cuando el proveedor está certificado y, si no, en las cláusulas contractuales tipo aprobadas por la Comisión Europea y reconocidas en Suiza. Según sus condiciones comerciales, los proveedores de IA no usan los datos que les enviamos para entrenar sus modelos.",
    ]},
    { h: "6. Cookies", p: [
      "Solo usamos cookies que el sitio necesita o que recuerdan tus elecciones: acceso (tn_session, tn_family), idioma (tn_lang), aspecto del sitio (tn_look), registro sin terminar (tn_onboarding) y, durante 60 días, el origen de tu visita si el enlace tenía etiqueta de campaña (tn_src). No usamos cookies publicitarias ni rastreadores de terceros.",
    ]},
    { h: "7. Plazos de conservación", p: [
      "El contenido familiar se guarda mientras exista tu espacio familiar. Si lo eliminas en Ajustes, su contenido y archivos se borran de nuestros sistemas; las copias en las copias de seguridad de los proveedores desaparecen tras un breve plazo.",
      "Los e-mails para el lanzamiento se guardan hasta que pidas su eliminación y como máximo 12 meses después del lanzamiento. La contabilidad se conserva 10 años, como exige la ley suiza.",
    ]},
    { h: "8. Tus derechos", p: [
      "Puedes pedir acceso, rectificación, supresión, limitación u oponerte al tratamiento, y retirar tu consentimiento en cualquier momento. Puedes exportarlo todo tú mismo (historias, grabaciones, fotos, árbol en GEDCOM) y eliminar tu espacio familiar en Ajustes.",
      `Escribe a ${O.privacy}. También puedes reclamar ante el Comisionado Federal suizo de Protección de Datos y Transparencia (FDPIC) o, en la UE, ante la autoridad de protección de datos de tu país.`,
    ]},
    { h: "9. Menores", p: [
      "Treename está pensado para adultos. Los niños pueden aparecer en las historias y el árbol cuando un familiar adulto los añade; los datos de niños vivos nunca son públicos.",
    ]},
    { h: "10. Seguridad y cambios", p: [
      "Las conexiones están cifradas y solo los miembros de un espacio familiar ven su contenido. Si cambiamos esta política, aquí aparecerá la nueva fecha e informaremos por e-mail de los cambios importantes.",
    ]},
  ],
  imprint: {
    link: "Aviso legal",
    title: "Aviso legal",
    operator: "Titular",
    address: "Dirección",
    register: "Registro mercantil",
    manager: "Representante autorizado",
    managerRole: "gerente",
    contact: "Contacto",
    privacyContact: "Protección de datos",
    disclaimerH: "Responsabilidad",
    disclaimer: "Elaboramos el contenido de este sitio con cuidado, pero no podemos garantizar que esté completo o siempre actualizado. Los titulares de los sitios externos enlazados son responsables de su contenido. Las historias e información de los espacios familiares las escriben sus usuarios.",
  },
};

const ru: LegalT = {
  policyTitle: "Политика конфиденциальности",
  updated: "Редакция от 7 ноября 2026 года",
  regionEu: "Европейском союзе (Франкфурт)",
  regionCh: "Швейцарии",
  sections: (region) => [
    { h: "1. Кто отвечает за данные", p: [
      `Treename управляет компания ${addr}, Швейцария (UID ${O.uid}). Мы отвечаем за ваши персональные данные по швейцарскому Федеральному закону о защите данных (DSG/FADP), а для людей в ЕС и ЕЭЗ — по Общему регламенту по защите данных (GDPR).`,
      `Вопросы о ваших данных: ${O.privacy}.`,
    ]},
    { h: "2. Что мы храним", p: [
      "Ваш аккаунт: адрес e-mail, имя и выбранный язык.",
      "Пространство вашей семьи: имена, даты, места и родственные связи членов семьи, истории, голосовые записи, фото, события жизни и вопросы, которые добавляете вы и приглашённые вами родственники. Среди них могут быть сведения о живых и умерших родственниках.",
      "Приглашения: адреса e-mail или ссылки, которыми вы приглашаете родных.",
      "Использование: какие страницы и функции используются (например, «вопрос отправлен», «история сохранена») и, если вы пришли по ссылке с меткой кампании, откуда. Это нужно только для нашей собственной статистики.",
      "Технические данные: хостинг-провайдер обрабатывает IP-адреса и похожие данные в журналах сервера, чтобы показывать сайт и защищать его.",
      "Если вы оставили e-mail для сообщения о запуске или забронировали место «Семьи-основателя»: этот e-mail, ваш выбор и язык.",
      "Платежи, когда появятся платные планы: через Stripe. Номера карт мы никогда не видим и не храним.",
    ]},
    { h: "3. Зачем мы это используем и на каком основании", p: [
      "Чтобы Treename работал: создать пространство семьи, показать его приглашённым, отправить ссылки для входа и приглашения (исполнение договора с вами; ст. 6(1)(b) GDPR).",
      "Для функций ИИ, которые вы запускаете: расшифровать голосовые записи, превратить ответы в истории, исправить опечатки и поискать предков в открытых архивах (исполнение договора). Имена живых людей никогда не используются в поиске в интернете.",
      "Чтобы улучшать продукт по собственной обезличенной статистике (законный интерес; ст. 6(1)(f) GDPR).",
      "Чтобы отправить письмо о запуске, которое вы попросили (согласие; ст. 6(1)(a) GDPR, его можно отозвать в любой момент).",
      "Чтобы выставлять счета за платные планы и вести бухгалтерию (договор и требование закона; ст. 6(1)(c) GDPR).",
      "Мы не продаём ваши данные, не показываем рекламу внутри Treename и не используем семейные материалы для рекламы.",
    ]},
    { h: "4. Сведения о родственниках", p: [
      "Семейная история касается и других людей. Добавляйте только то, чем вправе делиться, и уважайте родных, которые не хотят в ней участвовать.",
      "Данные живых людей видны только внутри пространства семьи и никогда не показываются на публичной странице. На общей странице семьи видны только истории, которые вы для неё отметили.",
      `Любой родственник может попросить нас исправить или удалить сведения о себе: ${O.privacy}.`,
    ]},
    { h: "5. Поставщики услуг и страны", p: [
      `Пространство вашей семьи хранится в дата-центрах в ${region}. Мы работаем с этими поставщиками по договорам об обработке данных:`,
      "Vercel Inc. (США): хостинг сайта и хранение фото и записей.",
      "Neon Inc. (США): база данных, серверы в указанном выше регионе.",
      "Resend Inc. (США): отправка писем для входа и приглашений.",
      "Anthropic PBC (США): ИИ для историй, исправлений и поиска в архивах.",
      "OpenAI L.L.C. (США): расшифровка голосовых записей.",
      "Stripe Payments Europe Ltd. (Ирландия) и Stripe Inc. (США): платежи, когда появятся платные планы.",
      "Часть поставщиков обрабатывает данные в США. Основание такой передачи — Swiss-U.S. и EU-U.S. Data Privacy Framework, если поставщик сертифицирован, а иначе стандартные договорные положения, утверждённые Европейской комиссией и признанные в Швейцарии. По своим условиям поставщики ИИ не используют полученные от нас данные для обучения моделей.",
    ]},
    { h: "6. Cookies", p: [
      "Мы используем только cookies, без которых сайт не работает или которые запоминают ваш выбор: вход (tn_session, tn_family), язык (tn_lang), вид сайта (tn_look), незаконченная регистрация (tn_onboarding) и на 60 дней — источник визита, если в ссылке была метка кампании (tn_src). Рекламных cookies и сторонних трекеров нет.",
    ]},
    { h: "7. Сколько мы храним данные", p: [
      "Семейные материалы хранятся, пока существует пространство семьи. Если вы удалите его в настройках, материалы и файлы удаляются из наших систем; копии в резервных копиях поставщиков исчезают через короткое время.",
      "Адреса для письма о запуске хранятся, пока вы не попросите их удалить, и не дольше 12 месяцев после запуска. Бухгалтерские документы хранятся 10 лет, как требует швейцарский закон.",
    ]},
    { h: "8. Ваши права", p: [
      "Вы можете запросить доступ к данным, их исправление, удаление, ограничение обработки или возразить против неё, а также в любой момент отозвать согласие. Всё можно выгрузить самостоятельно (истории, записи, фото, дерево в GEDCOM) и удалить пространство семьи в настройках.",
      `Пишите на ${O.privacy}. Вы также можете подать жалобу Федеральному уполномоченному Швейцарии по защите данных и информации (EDÖB) или, в ЕС, в орган по защите данных своей страны.`,
    ]},
    { h: "9. Дети", p: [
      "Treename предназначен для взрослых. Дети могут появляться в историях и дереве, если их добавил взрослый член семьи; данные живых детей никогда не публикуются.",
    ]},
    { h: "10. Безопасность и изменения", p: [
      "Соединения шифруются, а содержимое пространства семьи видят только его участники. Если мы изменим эту политику, здесь появится новая дата, а о важных изменениях мы сообщим по e-mail.",
    ]},
  ],
  imprint: {
    link: "Выходные данные",
    title: "Выходные данные (Impressum)",
    operator: "Оператор",
    address: "Адрес",
    register: "Торговый реестр",
    manager: "Уполномоченный представитель",
    managerRole: "управляющий директор",
    contact: "Контакт",
    privacyContact: "Защита данных",
    disclaimerH: "Ответственность",
    disclaimer: "Мы тщательно готовим материалы сайта, но не можем гарантировать их полноту и актуальность. За содержание внешних сайтов по ссылкам отвечают их владельцы. Истории и сведения в пространствах семей пишут их пользователи.",
  },
};

export const LEGAL: Record<Lang, LegalT> = { en, de, fr, it, es, ru };
