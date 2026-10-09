/**
 * Questions made for a specific person: who they are to the asker (wife, mother,
 * grandfather, brother...) and their gender. Used in the app's "Ask" page.
 * The neutral library in each dictionary (t.library) stays the fallback and is
 * also used on the public site, where we do not know who will answer.
 *
 * A question is a plain string, or {f, m} when the wording depends on the
 * storyteller's gender (Russian verbs, Italian/French participles, Mum vs Dad...).
 */
import type { Lang } from "./config";
import { getDict } from "./index";

export type Gender = "f" | "m";
type Q = string | { f: string; m: string };
type GroupBank = { us: Q[]; love?: Q[]; advice?: Q[] };
export type Group = "partner" | "parent" | "grandparent" | "sibling" | "child" | "elder";

/** Who someone is to the person asking. */
export const RELATIONS = [
  { id: "wife", label: "Wife", group: "partner", gender: "f" },
  { id: "husband", label: "Husband", group: "partner", gender: "m" },
  { id: "mother", label: "Mother", group: "parent", gender: "f" },
  { id: "father", label: "Father", group: "parent", gender: "m" },
  { id: "grandmother", label: "Grandmother", group: "grandparent", gender: "f" },
  { id: "grandfather", label: "Grandfather", group: "grandparent", gender: "m" },
  { id: "sister", label: "Sister", group: "sibling", gender: "f" },
  { id: "brother", label: "Brother", group: "sibling", gender: "m" },
  { id: "daughter", label: "Daughter", group: "child", gender: "f" },
  { id: "son", label: "Son", group: "child", gender: "m" },
  { id: "aunt", label: "Aunt", group: "elder", gender: "f" },
  { id: "uncle", label: "Uncle", group: "elder", gender: "m" },
  { id: "sisterInLaw", label: "Sister-in-law", group: null, gender: "f" },
  { id: "brotherInLaw", label: "Brother-in-law", group: null, gender: "m" },
  { id: "motherInLaw", label: "Mother-in-law", group: "elder", gender: "f" },
  { id: "fatherInLaw", label: "Father-in-law", group: "elder", gender: "m" },
  { id: "niece", label: "Niece", group: null, gender: "f" },
  { id: "nephew", label: "Nephew", group: null, gender: "m" },
  { id: "cousinF", label: "Cousin (female)", group: null, gender: "f" },
  { id: "cousinM", label: "Cousin (male)", group: null, gender: "m" },
  { id: "other", label: "Other relative or friend", group: null, gender: null },
] as const satisfies readonly { id: string; label: string; group: Group | null; gender: Gender | null }[];

export type RelationId = (typeof RELATIONS)[number]["id"];
export const relationById = (id?: string | null) => RELATIONS.find((r) => r.id === id);

type Bank = { usName: string; base?: Record<string, string[]>; groups: Record<Group, GroupBank> };

const BANK: Record<Lang, Bank> = {
  en: {
    usName: "About us",
    groups: {
      partner: {
        us: ["What did you think the first time you saw me?", "Which day of our life together do you remember best?", "What have you learned in our years together?"],
        love: ["When did you know it was love?", "What do you remember about our wedding day?", "What do you want our family to remember about us?"],
        advice: ["What advice would you give a young couple?", "What would you tell your younger self?", "What matters most in a family?"],
      },
      parent: {
        us: ["What do you remember about the day I was born?", "How did you choose my name?", "Which of my childhood antics do you still remember?"],
        love: [{ f: "How did you and Dad meet?", m: "How did you and Mum meet?" }, "What was your wedding like?", { f: "What made you fall for Dad?", m: "What made you fall for Mum?" }],
        advice: [{ f: "What would you tell yourself on the day you became a mother?", m: "What would you tell yourself on the day you became a father?" }, "What do you want to pass on to your children and grandchildren?", "What matters most in a family?"],
      },
      grandparent: {
        us: ["What were my parents like as children?", { f: "What do you remember about the day you became a grandmother?", m: "What do you remember about the day you became a grandfather?" }, "Which family recipe or tradition do you want to pass on?"],
        love: [{ f: "How did you and Grandpa meet?", m: "How did you and Grandma meet?" }, "What was your wedding like?", { f: "What made you fall for Grandpa?", m: "What made you fall for Grandma?" }],
        advice: ["What do you want your grandchildren to remember?", "What would you tell your younger self?", "What matters most in a family?"],
      },
      sibling: { us: ["What is your brightest memory of our childhood?", "What did we fight about most often?", "What do you remember about our parents that I might not?"] },
      child: {
        us: ["What do you remember best about your childhood?", "What was your favourite day with us?", "What do you dream about?"],
        advice: ["Which family tradition do you want to keep?", "What would you like your own children to know about our family?", "What matters most in a family?"],
      },
      elder: { us: ["What were my parents like when they were young?", "What was the home you grew up in like?", "Which family story does nobody remember except you?"] },
    },
  },
  ru: {
    usName: "Мы с тобой",
    groups: {
      partner: {
        us: [{ f: "Что ты подумала, когда впервые меня увидела?", m: "Что ты подумал, когда впервые меня увидел?" }, "Какой день нашей совместной жизни ты помнишь лучше всего?", { f: "Чему ты научилась за наши годы вместе?", m: "Чему ты научился за наши годы вместе?" }],
        love: [{ f: "Когда ты поняла, что это любовь?", m: "Когда ты понял, что это любовь?" }, "Что ты помнишь о дне нашей свадьбы?", "Что ты хочешь, чтобы наша семья помнила о нас?"],
        advice: [{ f: "Какой совет ты дала бы молодой паре?", m: "Какой совет ты дал бы молодой паре?" }, { f: "Что бы ты сказала себе молодой?", m: "Что бы ты сказал себе молодому?" }, "Что самое важное в семье?"],
      },
      parent: {
        us: ["Что ты помнишь о дне моего рождения?", { f: "Как ты выбирала мне имя?", m: "Как ты выбирал мне имя?" }, "Какие мои детские проделки ты помнишь до сих пор?"],
        love: [{ f: "Как вы познакомились с папой?", m: "Как вы познакомились с мамой?" }, "Какой была ваша свадьба?", { f: "Чем тебя покорил папа?", m: "Чем тебя покорила мама?" }],
        advice: [{ f: "Что бы ты сказала себе в день, когда стала мамой?", m: "Что бы ты сказал себе в день, когда стал папой?" }, "Что ты хочешь передать своим детям и внукам?", "Что самое важное в семье?"],
      },
      grandparent: {
        us: ["Какими были мои родители в детстве?", { f: "Что ты помнишь о дне, когда стала бабушкой?", m: "Что ты помнишь о дне, когда стал дедушкой?" }, "Какой семейный рецепт или традицию ты хочешь передать?"],
        love: [{ f: "Как вы познакомились с дедушкой?", m: "Как вы познакомились с бабушкой?" }, "Какой была ваша свадьба?", { f: "Чем тебя покорил дедушка?", m: "Чем тебя покорила бабушка?" }],
        advice: ["Что ты хочешь, чтобы запомнили твои внуки?", { f: "Что бы ты сказала себе молодой?", m: "Что бы ты сказал себе молодому?" }, "Что самое важное в семье?"],
      },
      sibling: { us: ["Какое твоё самое яркое воспоминание о нашем детстве?", "Из-за чего мы ссорились чаще всего?", "Что ты помнишь о наших родителях такого, чего могу не помнить я?"] },
      child: {
        us: ["Что ты лучше всего помнишь из своего детства?", "Какой день с нами был для тебя самым любимым?", "О чём ты мечтаешь?"],
        advice: ["Какую семейную традицию ты хочешь сохранить?", "Что ты хочешь, чтобы твои дети знали о нашей семье?", "Что самое важное в семье?"],
      },
      elder: { us: ["Какими были мои родители в молодости?", { f: "Каким был дом, в котором ты росла?", m: "Каким был дом, в котором ты рос?" }, "Какую семейную историю никто, кроме тебя, не помнит?"] },
    },
  },
  de: {
    usName: "Wir beide",
    // Family members are asked with "du" (the public library uses "Sie").
    base: {
      childhood: ["Wo bist du aufgewachsen, und wie war dein Zuhause?", "Was hast du als Kind am liebsten gespielt?", "Was hat deine Familie an einem normalen Tag gegessen, und was an Feiertagen?"],
      family: ["Wie waren deine Eltern?", "Woran erinnerst du dich bei deinen eigenen Großeltern?", "Welche Familiengeschichten wurden immer wieder erzählt?"],
      love: ["Wie hat deine Liebesgeschichte begonnen?", "Welchen Moment mit deiner großen Liebe wirst du nie vergessen?", "Was hat dich an deiner großen Liebe am meisten berührt?"],
      work: ["Was war deine erste Arbeit?", "Auf welche Arbeit bist du am meisten stolz?", "Wie hast du dein erstes Geld verdient?"],
      leaving: ["Wann hast du zum ersten Mal dein Zuhause verlassen, und warum?", "Wie war es, an einem neuen Ort neu anzufangen?", "Was hast du von zu Hause am meisten vermisst?"],
      hard: ["Was war die schwierigste Zeit in deinem Leben?", "Wer hat dir in schweren Zeiten geholfen?", "Was hat dir Kraft gegeben?"],
      advice: ["Woran sollen sich die nächsten Generationen unserer Familie erinnern?", "Was würdest du deinem jüngeren Ich sagen?", "Was ist in einer Familie am wichtigsten?"],
    },
    groups: {
      partner: {
        us: ["Was hast du gedacht, als du mich zum ersten Mal gesehen hast?", "An welchen Tag unseres gemeinsamen Lebens erinnerst du dich am liebsten?", "Was hast du in unseren gemeinsamen Jahren gelernt?"],
        love: ["Wann wusstest du, dass es Liebe ist?", "Woran erinnerst du dich bei unserem Hochzeitstag?", "Was soll unsere Familie über uns in Erinnerung behalten?"],
        advice: ["Welchen Rat würdest du einem jungen Paar geben?", "Was würdest du deinem jüngeren Ich sagen?", "Was ist in einer Familie am wichtigsten?"],
      },
      parent: {
        us: ["Woran erinnerst du dich beim Tag meiner Geburt?", "Wie habt ihr meinen Namen ausgesucht?", "Welche meiner Kinderstreiche weißt du heute noch?"],
        love: [{ f: "Wie habt ihr euch kennengelernt, du und Papa?", m: "Wie habt ihr euch kennengelernt, du und Mama?" }, "Wie war eure Hochzeit?", { f: "Was hat dich an Papa begeistert?", m: "Was hat dich an Mama begeistert?" }],
        advice: [{ f: "Was würdest du dir an dem Tag sagen, an dem du Mutter geworden bist?", m: "Was würdest du dir an dem Tag sagen, an dem du Vater geworden bist?" }, "Was möchtest du deinen Kindern und Enkeln weitergeben?", "Was ist in einer Familie am wichtigsten?"],
      },
      grandparent: {
        us: ["Wie waren meine Eltern als Kinder?", { f: "Woran erinnerst du dich bei dem Tag, an dem du Oma geworden bist?", m: "Woran erinnerst du dich bei dem Tag, an dem du Opa geworden bist?" }, "Welches Familienrezept oder welche Tradition möchtest du weitergeben?"],
        love: [{ f: "Wie habt ihr euch kennengelernt, du und Opa?", m: "Wie habt ihr euch kennengelernt, du und Oma?" }, "Wie war eure Hochzeit?", { f: "Was hat dich an Opa begeistert?", m: "Was hat dich an Oma begeistert?" }],
        advice: ["Woran sollen sich deine Enkel erinnern?", "Was würdest du deinem jüngeren Ich sagen?", "Was ist in einer Familie am wichtigsten?"],
      },
      sibling: { us: ["Was ist deine schönste Erinnerung an unsere Kindheit?", "Worüber haben wir uns am häufigsten gestritten?", "Woran erinnerst du dich bei unseren Eltern, das ich vielleicht nicht mehr weiß?"] },
      child: {
        us: ["Woran aus deiner Kindheit erinnerst du dich am liebsten?", "Welcher Tag mit uns war dein liebster?", "Wovon träumst du?"],
        advice: ["Welche Familientradition möchtest du weiterführen?", "Was sollen deine eigenen Kinder einmal über unsere Familie wissen?", "Was ist in einer Familie am wichtigsten?"],
      },
      elder: { us: ["Wie waren meine Eltern, als sie jung waren?", "Wie war das Zuhause, in dem du aufgewachsen bist?", "Welche Familiengeschichte kennt außer dir niemand mehr?"] },
    },
  },
  fr: {
    usName: "Toi et moi",
    // Family members are asked with "tu" (the public library uses "vous").
    base: {
      childhood: ["Où as-tu grandi, et à quoi ressemblait ta maison ?", "Quels étaient tes jeux préférés quand tu étais enfant ?", "Que mangeait ta famille au quotidien, et les jours de fête ?"],
      family: ["Comment étaient tes parents ?", "Quels souvenirs gardes-tu de tes propres grands-parents ?", "Quelles histoires de famille racontait-on encore et encore ?"],
      love: ["Comment ton histoire d'amour a-t-elle commencé ?", "Quel moment avec l'amour de ta vie n'oublieras-tu jamais ?", "Qu'aimes-tu le plus chez l'amour de ta vie ?"],
      work: ["Quel a été ton premier travail ?", "De quel travail tires-tu le plus de fierté ?", "Comment as-tu gagné ton premier argent ?"],
      leaving: ["Quand as-tu quitté la maison pour la première fois, et pourquoi ?", "Comment était-ce de recommencer dans un nouvel endroit ?", "Qu'est-ce qui te manquait le plus de chez toi ?"],
      hard: ["Quelle a été la période la plus difficile de ta vie ?", "Qui a été là pour toi dans les moments durs ?", "Qu'est-ce qui t'a donné de la force ?"],
      advice: ["Que veux-tu que les prochaines générations de la famille retiennent ?", "Quel conseil donnerais-tu à la personne que tu étais jeune ?", "Qu'est-ce qui compte le plus dans une famille ?"],
    },
    groups: {
      partner: {
        us: ["Quelle a été ta première impression de moi ?", "De quel jour de notre vie ensemble te souviens-tu le mieux ?", "Qu'as-tu appris pendant nos années ensemble ?"],
        love: ["Quand as-tu su que c'était l'amour ?", "Que gardes-tu de notre jour de mariage ?", "Que veux-tu que notre famille retienne de nous ?"],
        advice: ["Quel conseil donnerais-tu à un jeune couple ?", "Que dirais-tu à la personne que tu étais jeune ?", "Qu'est-ce qui compte le plus dans une famille ?"],
      },
      parent: {
        us: ["De quoi te souviens-tu du jour de ma naissance ?", "Comment avez-vous choisi mon prénom ?", "Quelles bêtises de mon enfance te font encore sourire ?"],
        love: [{ f: "Comment as-tu rencontré papa ?", m: "Comment as-tu rencontré maman ?" }, "Comment s'est passé votre mariage ?", { f: "Qu'est-ce qui t'a plu chez papa ?", m: "Qu'est-ce qui t'a plu chez maman ?" }],
        advice: [{ f: "Que te dirais-tu le jour où tu es devenue maman ?", m: "Que te dirais-tu le jour où tu es devenu papa ?" }, "Que veux-tu transmettre à tes enfants et petits-enfants ?", "Qu'est-ce qui compte le plus dans une famille ?"],
      },
      grandparent: {
        us: ["Comment étaient mes parents enfants ?", { f: "De quoi te souviens-tu du jour où tu es devenue grand-mère ?", m: "De quoi te souviens-tu du jour où tu es devenu grand-père ?" }, "Quelle recette ou tradition familiale veux-tu transmettre ?"],
        love: [{ f: "Comment as-tu rencontré papi ?", m: "Comment as-tu rencontré mamie ?" }, "Comment s'est passé votre mariage ?", { f: "Qu'est-ce qui t'a plu chez papi ?", m: "Qu'est-ce qui t'a plu chez mamie ?" }],
        advice: ["Que veux-tu que tes petits-enfants retiennent ?", "Que dirais-tu à la personne que tu étais jeune ?", "Qu'est-ce qui compte le plus dans une famille ?"],
      },
      sibling: { us: ["Quel est ton plus beau souvenir de notre enfance ?", "Pourquoi nous disputions-nous le plus souvent ?", "De quoi te souviens-tu sur nos parents que j'ai peut-être oublié ?"] },
      child: {
        us: ["De quoi te souviens-tu le mieux de ton enfance ?", "Quel a été ton jour préféré avec nous ?", "De quoi rêves-tu ?"],
        advice: ["Quelle tradition familiale veux-tu garder ?", "Que voudrais-tu que tes propres enfants sachent de notre famille ?", "Qu'est-ce qui compte le plus dans une famille ?"],
      },
      elder: { us: ["Comment étaient mes parents quand ils étaient jeunes ?", "À quoi ressemblait la maison où tu as grandi ?", "Quelle histoire de famille personne d'autre que toi ne connaît ?"] },
    },
  },
  it: {
    usName: "Noi due",
    groups: {
      partner: {
        us: ["Qual è stata la tua prima impressione di me?", "Quale giorno della nostra vita insieme ricordi meglio?", "Cosa hai imparato nei nostri anni insieme?"],
        love: ["Quando hai capito che era amore?", "Cosa ricordi del giorno del nostro matrimonio?", "Cosa vuoi che la nostra famiglia ricordi di noi?"],
        advice: ["Che consiglio daresti a una giovane coppia?", { f: "Cosa diresti a te stessa da giovane?", m: "Cosa diresti a te stesso da giovane?" }, "Cosa conta di più in una famiglia?"],
      },
      parent: {
        us: ["Cosa ricordi del giorno della mia nascita?", "Come avete scelto il mio nome?", "Quali marachelle della mia infanzia ricordi ancora?"],
        love: [{ f: "Come hai conosciuto papà?", m: "Come hai conosciuto la mamma?" }, "Com'è stato il vostro matrimonio?", { f: "Cosa ti ha conquistato di papà?", m: "Cosa ti ha conquistato della mamma?" }],
        advice: [{ f: "Cosa ti diresti il giorno in cui sei diventata mamma?", m: "Cosa ti diresti il giorno in cui sei diventato papà?" }, "Cosa vuoi trasmettere ai tuoi figli e nipoti?", "Cosa conta di più in una famiglia?"],
      },
      grandparent: {
        us: ["Com'erano i miei genitori da bambini?", { f: "Cosa ricordi del giorno in cui sei diventata nonna?", m: "Cosa ricordi del giorno in cui sei diventato nonno?" }, "Quale ricetta o tradizione di famiglia vuoi tramandare?"],
        love: [{ f: "Come hai conosciuto il nonno?", m: "Come hai conosciuto la nonna?" }, "Com'è stato il vostro matrimonio?", { f: "Cosa ti ha conquistato del nonno?", m: "Cosa ti ha conquistato della nonna?" }],
        advice: ["Cosa vuoi che ricordino i tuoi nipoti?", { f: "Cosa diresti a te stessa da giovane?", m: "Cosa diresti a te stesso da giovane?" }, "Cosa conta di più in una famiglia?"],
      },
      sibling: { us: ["Qual è il tuo ricordo più bello della nostra infanzia?", "Per cosa litigavamo più spesso?", "Cosa ricordi dei nostri genitori che io forse non ricordo?"] },
      child: {
        us: ["Cosa ricordi meglio della tua infanzia?", "Qual è stato il tuo giorno preferito con noi?", "Cosa sogni?"],
        advice: ["Quale tradizione di famiglia vuoi portare avanti?", "Cosa vorresti che i tuoi figli sapessero della nostra famiglia?", "Cosa conta di più in una famiglia?"],
      },
      elder: { us: ["Com'erano i miei genitori da giovani?", { f: "Com'era la casa in cui sei cresciuta?", m: "Com'era la casa in cui sei cresciuto?" }, "Quale storia di famiglia ricordi solo tu?"] },
    },
  },
  es: {
    usName: "Tú y yo",
    groups: {
      partner: {
        us: ["¿Cuál fue tu primera impresión de mí?", "¿Qué día de nuestra vida juntos recuerdas mejor?", "¿Qué has aprendido en nuestros años juntos?"],
        love: ["¿Cuándo supiste que era amor?", "¿Qué recuerdas del día de nuestra boda?", "¿Qué quieres que nuestra familia recuerde de nosotros?"],
        advice: ["¿Qué consejo le darías a una pareja joven?", "¿Qué consejo le darías a tu yo más joven?", "¿Qué es lo más importante en una familia?"],
      },
      parent: {
        us: ["¿Qué recuerdas del día en que nací?", "¿Cómo elegisteis mi nombre?", "¿Qué travesuras de mi infancia todavía recuerdas?"],
        love: [{ f: "¿Cómo conociste a papá?", m: "¿Cómo conociste a mamá?" }, "¿Cómo fue vuestra boda?", { f: "¿Qué te enamoró de papá?", m: "¿Qué te enamoró de mamá?" }],
        advice: [{ f: "¿Qué te dirías el día en que te convertiste en madre?", m: "¿Qué te dirías el día en que te convertiste en padre?" }, "¿Qué quieres transmitir a tus hijos y nietos?", "¿Qué es lo más importante en una familia?"],
      },
      grandparent: {
        us: ["¿Cómo eran mis padres de niños?", { f: "¿Qué recuerdas del día en que te convertiste en abuela?", m: "¿Qué recuerdas del día en que te convertiste en abuelo?" }, "¿Qué receta o tradición familiar quieres transmitir?"],
        love: [{ f: "¿Cómo conociste al abuelo?", m: "¿Cómo conociste a la abuela?" }, "¿Cómo fue vuestra boda?", { f: "¿Qué te enamoró del abuelo?", m: "¿Qué te enamoró de la abuela?" }],
        advice: ["¿Qué quieres que recuerden tus nietos?", "¿Qué consejo le darías a tu yo más joven?", "¿Qué es lo más importante en una familia?"],
      },
      sibling: { us: ["¿Cuál es tu recuerdo más bonito de nuestra infancia?", "¿Por qué discutíamos más a menudo?", "¿Qué recuerdas de nuestros padres que yo quizá no recuerde?"] },
      child: {
        us: ["¿Qué recuerdas mejor de tu infancia?", "¿Cuál fue tu día favorito con nosotros?", "¿Con qué sueñas?"],
        advice: ["¿Qué tradición familiar quieres mantener?", "¿Qué te gustaría que tus hijos supieran de nuestra familia?", "¿Qué es lo más importante en una familia?"],
      },
      elder: { us: ["¿Cómo eran mis padres de jóvenes?", "¿Cómo era la casa en la que creciste?", "¿Qué historia de la familia solo recuerdas tú?"] },
    },
  },
};

export type Topic = { key: string; name: string; q: string[] };

/**
 * Topics for one storyteller. Without a known relation this is the neutral library.
 * With one, an "About us" topic comes first and the love/advice topics fit the role.
 */
export function questionsFor(lang: Lang, person: { relation?: string | null; gender?: string | null }): { topics: Topic[]; personal: boolean } {
  const t = getDict(lang);
  const rel = relationById(person.relation);
  const neutral = Object.entries(t.library).map(([key, v]) => ({ key, name: v.name, q: [...v.q] }));
  if (!rel || !rel.group) return { topics: neutral, personal: false };

  const bank = BANK[lang] ?? BANK.en;
  const g: Gender = (person.gender === "m" || person.gender === "f" ? person.gender : rel.gender) ?? "f";
  const pick = (q: Q) => (typeof q === "string" ? q : q[g]);
  const group = bank.groups[rel.group];

  const topics: Topic[] = [{ key: "us", name: bank.usName, q: group.us.map(pick) }];
  for (const topic of neutral) {
    let q = bank.base?.[topic.key] ?? topic.q;
    if (topic.key === "love" && group.love) q = group.love.map(pick);
    if (topic.key === "advice" && group.advice) q = group.advice.map(pick);
    topics.push({ ...topic, q });
  }
  return { topics, personal: true };
}
