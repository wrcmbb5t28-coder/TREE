import { db } from "./db";
import { writeStory } from "./ai";
import { track } from "./analytics";

/**
 * Turns a recorded/typed answer into a story with suggested facts.
 * The verbatim transcript and the audio are always kept, whatever the AI does.
 */
export async function storyFromAnswer(answerId: string) {
  const answer = await db.answer.findUniqueOrThrow({
    where: { id: answerId },
    include: { question: { include: { storyteller: true, family: { include: { people: true } } } } },
  });
  const { question } = answer;
  const family = question.family;
  const teller = question.storyteller;

  const result = await writeStory({
    question: question.text,
    transcript: answer.transcript,
    storytellerName: [teller.firstName, teller.lastName].filter(Boolean).join(" "),
    storytellerRelation: relationLabel(teller.generation),
    outputLang: family.lang,
    knownPeople: family.people.map((p) => [p.firstName, p.lastName].filter(Boolean).join(" ")),
  });

  const story = await db.story.create({
    data: {
      familyId: family.id,
      answerId: answer.id,
      personId: teller.id,
      title: result.title,
      body: result.body,
      bodyLang: result.aiUsed ? family.lang : answer.originalLang || question.lang,
      followUp: result.followUp,
      chapter: result.chapter,
      sensitive: result.sensitive,
      visibility: result.sensitive ? "private" : "family",
      facts: {
        create: result.facts.map((f) => ({
          familyId: family.id,
          kind: f.kind,
          label: f.label,
          data: JSON.stringify(f.data ?? {}),
          confidence: f.confidence,
        })),
      },
    },
  });

  await track("story_created", { familyId: family.id, props: { storytellerId: teller.id, source: "interview" } });
  if (result.aiUsed) await track("AI_story_generated", { familyId: family.id, props: { facts: result.facts.length } });
  if (result.facts.length) await track("fact_suggested", { familyId: family.id, props: { count: result.facts.length } });
  return story;
}

export function relationLabel(generation: number): string | null {
  if (generation <= -3) return "great-grandparent";
  if (generation === -2) return "grandparent";
  if (generation === -1) return "parent";
  return null;
}
