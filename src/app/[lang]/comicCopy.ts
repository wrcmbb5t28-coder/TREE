// Copy and image sizes for the comic homepage in languages other than English.
export type ComicCopy = { dims: Record<"hero" | "how" | "gift" | "family" | "reasons-right", [number, number]>; steps: { t: string; d: string }[]; reasonsTitle: string; reasons: { t: string; d: string }[]; alt: Record<"hero" | "how" | "reasons" | "family" | "gift", string> };

export const COMIC: Partial<Record<string, ComicCopy>> = {
  "de": {
    "dims": {
      "hero": [
        1254,
        1254
      ],
      "how": [
        1254,
        1254
      ],
      "gift": [
        1254,
        1254
      ],
      "family": [
        1254,
        1254
      ],
      "reasons-right": [
        1254,
        1254
      ]
    },
    "steps": [
      {
        "t": "Laden Sie Ihre Familie ein",
        "d": "Wählen Sie, wen Sie fragen möchten: Eltern, Großeltern, Tanten und Onkel. Wir schlagen die Fragen vor, oder Sie schreiben eigene."
      },
      {
        "t": "Sie antworten per Sprachnachricht",
        "d": "Einmal pro Woche kommt eine Frage per WhatsApp. Geantwortet wird per Sprachnachricht, wann es passt. Keine App, kein Passwort."
      },
      {
        "t": "KI verwandelt Antworten in Geschichten",
        "d": "Treename schreibt jede Aufnahme ab und macht daraus eine Geschichte, ohne etwas zu erfinden."
      },
      {
        "t": "Es entsteht ein Stammbaum und ein Buch",
        "d": "Namen, Orte und Daten kommen in Ihren Stammbaum und auf die Karte, und aus den Geschichten wird ein Familienbuch."
      }
    ],
    "reasonsTitle": "Vier Gründe, Ihre Geschichte mit Treename zu beginnen",
    "reasons": [
      {
        "t": "Ein Archiv der Stimmen",
        "d": "Jede Geschichte behält ihre Aufnahme. In zwanzig Jahren hören Ihre Enkel, wie Oma gelacht hat, und lesen es nicht nur."
      },
      {
        "t": "Ein Stammbaum, in dem jeder ein Gesicht und eine Stimme hat",
        "d": "Paare nebeneinander, Kinder unter ihren Eltern. Tippen Sie auf eine Person, um ihre Geschichten zu lesen."
      },
      {
        "t": "Wo Ihre Familie gelebt hat",
        "d": "Orte und Jahre auf einer Karte, mit den Namen der Menschen, die dort gelebt haben."
      },
      {
        "t": "Ein Familienbuch zum Anfassen",
        "d": "Alle Geschichten nach Kapiteln, mit dem Stammbaum und auf jeder Seite einem Code, der die echte Stimme abspielt. Zum Ausdrucken oder als PDF."
      }
    ],
    "alt": {
      "hero": "Eine Großmutter am Telefon: 1962 sind wir nach Zürich gezogen.",
      "how": "So funktioniert Treename in vier Schritten.",
      "reasons": "Eine Familie am Laptop: Wir sind in der kostenlosen Beta.",
      "family": "Opa spricht Italienisch, die Kinder sprechen Deutsch. Treename funktioniert in 6 Sprachen.",
      "gift": "Familie Müller: So sehen die Erinnerungen einer Familie aus, wenn sie endlich aufgeschrieben werden."
    }
  },
  "ru": {
    "dims": {
      "hero": [
        792,
        756
      ],
      "how": [
        816,
        756
      ],
      "gift": [
        678,
        756
      ],
      "family": [
        669,
        756
      ],
      "reasons-right": [
        630,
        756
      ]
    },
    "steps": [
      {
        "t": "Пригласите родных",
        "d": "Выберите, кого спросить: родителей, бабушек и дедушек, тёть и дядь. Вопросы предложим мы, или напишите свои."
      },
      {
        "t": "Они отвечают голосом",
        "d": "Раз в неделю в WhatsApp приходит вопрос. Отвечают голосом, когда удобно. Без приложений и паролей."
      },
      {
        "t": "ИИ превращает ответы в истории",
        "d": "Treename расшифровывает каждую запись и пишет по ней историю, ничего не выдумывая."
      },
      {
        "t": "Получается семейное дерево и книга",
        "d": "Имена, места и даты попадают в дерево и на карту, а из историй складывается семейная книга."
      }
    ],
    "reasonsTitle": "Четыре причины начать историю вашей семьи в Treename",
    "reasons": [
      {
        "t": "Архив голосов",
        "d": "К каждой истории сохраняется запись. Через двадцать лет внуки услышат, как смеялась бабушка, а не только прочитают об этом."
      },
      {
        "t": "Дерево, где у каждого есть лицо и голос",
        "d": "Пары рядом, дети под родителями. Нажмите на человека, чтобы прочитать его истории."
      },
      {
        "t": "Где жила ваша семья",
        "d": "Города и годы на карте, с именами тех, кто там жил."
      },
      {
        "t": "Семейная книга, которую можно взять в руки",
        "d": "Все истории по главам, с деревом и кодом на каждой странице, который включает настоящий голос. Распечатайте или сохраните в PDF."
      }
    ],
    "alt": {
      "hero": "Бабушка говорит по телефону: В 1962 году мы переехали в Цюрих.",
      "how": "Как работает Treename, в четыре шага.",
      "reasons": "Ноутбук с Treename: Бета бесплатна.",
      "family": "Истории на своём языке: Treename работает на 6 языках.",
      "gift": "Открытая семейная книга: вот так выглядят семейные воспоминания, когда они собраны в книгу."
    }
  },
  "es": {
    "dims": {
      "hero": [
        792,
        738
      ],
      "how": [
        816,
        738
      ],
      "gift": [
        678,
        738
      ],
      "family": [
        669,
        738
      ],
      "reasons-right": [
        630,
        738
      ]
    },
    "steps": [
      {
        "t": "Invita a tu familia",
        "d": "Elige a quién preguntar: padres, abuelos, tíos y tías. Te sugerimos las preguntas, o escribes las tuyas."
      },
      {
        "t": "Responden por voz",
        "d": "Cada semana llega una pregunta por WhatsApp. Responden por voz cuando quieren. Sin app ni contraseña."
      },
      {
        "t": "La IA convierte las respuestas en historias",
        "d": "Treename transcribe cada grabación y la escribe como una historia, sin inventar nada."
      },
      {
        "t": "Obtienes un árbol genealógico y un libro",
        "d": "Nombres, lugares y fechas pasan a tu árbol y al mapa, y las historias se convierten en un libro familiar."
      }
    ],
    "reasonsTitle": "Cuatro razones para empezar tu historia en Treename",
    "reasons": [
      {
        "t": "Un archivo de voces",
        "d": "Cada historia conserva su grabación. Dentro de veinte años tus nietos oirán cómo se reía la abuela, no solo lo leerán."
      },
      {
        "t": "Un árbol donde cada uno tiene cara y voz",
        "d": "Las parejas juntas, los hijos debajo de sus padres. Toca a cualquiera para leer sus historias."
      },
      {
        "t": "Dónde vivió tu familia",
        "d": "Ciudades y años en un mapa, con los nombres de quienes vivieron allí."
      },
      {
        "t": "Un libro familiar que puedes tener en las manos",
        "d": "Todas las historias por capítulos, con el árbol y un código en cada página que reproduce la voz real. Imprímelo o guárdalo en PDF."
      }
    ],
    "alt": {
      "hero": "Una abuela al teléfono: En 1962 nos mudamos a Zúrich.",
      "how": "Cómo funciona Treename en cuatro pasos.",
      "reasons": "Un portátil con Treename: Beta gratuita.",
      "family": "Historias en tu idioma: Treename funciona en 6 idiomas.",
      "gift": "Un libro familiar abierto: así se ve la memoria de una familia cuando por fin se escribe."
    }
  },
  "fr": {
    "dims": {
      "hero": [
        792,
        741
      ],
      "how": [
        816,
        741
      ],
      "gift": [
        678,
        741
      ],
      "family": [
        669,
        741
      ],
      "reasons-right": [
        630,
        741
      ]
    },
    "steps": [
      {
        "t": "Invitez vos proches",
        "d": "Choisissez qui interroger : parents, grands-parents, oncles et tantes. Nous proposons les questions, ou vous écrivez les vôtres."
      },
      {
        "t": "Ils répondent par la voix",
        "d": "Une question par semaine arrive sur WhatsApp. Ils répondent par message vocal quand ils veulent. Sans application ni mot de passe."
      },
      {
        "t": "L’IA transforme les réponses en récits",
        "d": "Treename transcrit chaque enregistrement et en fait un récit, sans rien inventer."
      },
      {
        "t": "Vous obtenez un arbre généalogique et un livre",
        "d": "Noms, lieux et dates rejoignent votre arbre et la carte, et les récits deviennent un livre de famille."
      }
    ],
    "reasonsTitle": "Quatre raisons de commencer votre histoire avec Treename",
    "reasons": [
      {
        "t": "Des voix archivées",
        "d": "Chaque récit garde son enregistrement. Dans vingt ans, vos petits-enfants entendront le rire de grand-mère, pas seulement le lire."
      },
      {
        "t": "Un arbre où chacun a un visage et une voix",
        "d": "Les couples côte à côte, les enfants sous leurs parents. Touchez une personne pour lire ses récits."
      },
      {
        "t": "Là où votre famille a vécu",
        "d": "Villes et années sur une carte, avec le nom de ceux qui y ont vécu."
      },
      {
        "t": "Un livre de famille à tenir entre les mains",
        "d": "Tous les récits par chapitres, avec l’arbre et sur chaque page un code qui fait entendre la vraie voix. À imprimer ou à enregistrer en PDF."
      }
    ],
    "alt": {
      "hero": "Une grand-mère au téléphone : En 1962, nous avons déménagé à Zurich.",
      "how": "Comment fonctionne Treename, en quatre étapes.",
      "reasons": "Un ordinateur avec Treename : Bêta gratuite.",
      "family": "Des histoires dans votre langue : Treename fonctionne en 6 langues.",
      "gift": "Un livre de famille ouvert : voici à quoi ressemble la mémoire d’une famille quand elle est enfin mise par écrit."
    }
  },
  "it": {
    "dims": {
      "hero": [
        792,
        735
      ],
      "how": [
        816,
        735
      ],
      "gift": [
        678,
        735
      ],
      "family": [
        669,
        735
      ],
      "reasons-right": [
        630,
        735
      ]
    },
    "steps": [
      {
        "t": "Invita i tuoi familiari",
        "d": "Scegli a chi chiedere: genitori, nonni, zii e zie. Ti suggeriamo le domande, oppure scrivi le tue."
      },
      {
        "t": "Rispondono con la voce",
        "d": "Ogni settimana arriva una domanda su WhatsApp. Rispondono a voce quando vogliono. Niente app, niente password."
      },
      {
        "t": "L’IA trasforma le risposte in storie",
        "d": "Treename trascrive ogni registrazione e la scrive come una storia, senza inventare nulla."
      },
      {
        "t": "Ottieni l’albero genealogico e un libro",
        "d": "Nomi, luoghi e date finiscono nel tuo albero e sulla mappa, e le storie diventano un libro di famiglia."
      }
    ],
    "reasonsTitle": "Quattro motivi per iniziare la tua storia su Treename",
    "reasons": [
      {
        "t": "Un archivio di voci",
        "d": "Ogni storia conserva la sua registrazione. Tra vent’anni i tuoi nipoti sentiranno come rideva la nonna, non solo lo leggeranno."
      },
      {
        "t": "Un albero dove ognuno ha un volto e una voce",
        "d": "Le coppie vicine, i figli sotto i genitori. Tocca una persona per leggere le sue storie."
      },
      {
        "t": "Dove ha vissuto la tua famiglia",
        "d": "Città e anni su una mappa, con i nomi di chi ci ha vissuto."
      },
      {
        "t": "Un libro di famiglia da tenere in mano",
        "d": "Tutte le storie per capitoli, con l’albero e su ogni pagina un codice che fa ascoltare la voce vera. Da stampare o salvare in PDF."
      }
    ],
    "alt": {
      "hero": "Una nonna al telefono: Nel 1962 ci siamo trasferiti a Zurigo.",
      "how": "Come funziona Treename, in quattro passi.",
      "reasons": "Un portatile con Treename: Beta gratuita.",
      "family": "Storie nella tua lingua: Treename funziona in 6 lingue.",
      "gift": "Un libro di famiglia aperto: ecco come si presenta la memoria di una famiglia quando viene finalmente scritta."
    }
  }
};
