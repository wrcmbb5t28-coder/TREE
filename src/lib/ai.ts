import Anthropic from "@anthropic-ai/sdk";

/**
 * Treename AI principle: an editor and archivist, never an author.
 * - The story is built ONLY from the storyteller's own words.
 * - Every fact carries a confidence level; guesses are labelled as guesses.
 * - Historical context is kept out of the story body (it is not family data).
 */

export type ExtractedFact = {
  kind: "person" | "place" | "date" | "event";
  label: string;
  confidence: "confirmed" | "likely" | "guess";
  data: {
    name?: string;
    relation?: string;
    year?: number;
    place?: string;
    country?: string;
    description?: string;
  };
};

export type StoryResult = {
  title: string;
  body: string;
  followUp: string | null;
  chapter: string | null;
  sensitive: boolean;
  facts: ExtractedFact[];
  aiUsed: boolean;
};

const LANG_NAMES: Record<string, string> = {
  en: "English", de: "German", fr: "French", it: "Italian", es: "Spanish", ru: "Russian",
};

const SYSTEM = `You are the family archivist for Treename, a service that preserves family memories.
You receive a question that a family member asked a relative (the storyteller) and the storyteller's verbatim answer, usually transcribed from voice.

Your job:
1. Write a short, warm, readable story (60-220 words) from the answer, in third person, in the requested output language.
   Use ONLY what the storyteller said. Never invent names, dates, places, feelings or events. If something is unclear, leave it out or say it is unclear.
   Keep the storyteller's memorable phrases as short quotes in their own words where it helps.
2. Give the story a plain title (max 8 words).
3. Extract facts that could be added to the family tree or timeline. Each fact has a confidence:
   "confirmed" = stated clearly, "likely" = stated but approximate ("around 1956", "in the fifties"), "guess" = only implied.
   Years must be numbers. Do not extract facts about people who are only mentioned in passing without any detail.
4. Suggest ONE gentle follow-up question in the storyteller's language that invites more detail. No questions about trauma unless the storyteller raised it.
5. Mark sensitive=true if the story touches war, violence, illness, death circumstances, adoption, divorce, addiction or crime.
6. Choose a chapter from: Origins, Childhood, Love, Work, Leaving home, Hard years, Family life, Traditions, Advice, The next generation.

Reply with JSON only, no prose, in this exact shape:
{"title": string, "body": string, "followUp": string, "chapter": string, "sensitive": boolean,
 "facts": [{"kind": "person"|"place"|"date"|"event", "label": string, "confidence": "confirmed"|"likely"|"guess",
            "data": {"name"?: string, "relation"?: string, "year"?: number, "place"?: string, "country"?: string, "description"?: string}}]}`;

function parseJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("No JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

function fallback(question: string, transcript: string): StoryResult {
  return {
    title: question.replace(/[?¿]/g, "").slice(0, 60),
    body: transcript,
    followUp: null,
    chapter: null,
    sensitive: false,
    facts: [],
    aiUsed: false,
  };
}

export async function writeStory(input: {
  question: string;
  transcript: string;
  storytellerName: string;
  storytellerRelation?: string | null;
  outputLang: string;
  knownPeople: string[];
}): Promise<StoryResult> {
  const { question, transcript } = input;
  if (!process.env.ANTHROPIC_API_KEY || transcript.trim().length < 20) return fallback(question, transcript);

  const client = new Anthropic();
  const user = `Output language: ${LANG_NAMES[input.outputLang] ?? "English"}
Storyteller: ${input.storytellerName}${input.storytellerRelation ? ` (${input.storytellerRelation})` : ""}
People already in the family tree: ${input.knownPeople.join(", ") || "none yet"}

Question asked: ${question}

Verbatim answer:
"""
${transcript}
"""`;

  try {
    const msg = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 1500,
      system: SYSTEM,
      messages: [{ role: "user", content: user }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const j = parseJson(text) as Partial<StoryResult> & { facts?: ExtractedFact[] };
    const facts = (Array.isArray(j.facts) ? j.facts : [])
      .filter((f) => f && typeof f.label === "string" && ["person", "place", "date", "event"].includes(f.kind))
      .slice(0, 12)
      .map((f) => ({
        kind: f.kind,
        label: f.label.slice(0, 120),
        confidence: (["confirmed", "likely", "guess"].includes(f.confidence) ? f.confidence : "likely") as ExtractedFact["confidence"],
        data: f.data && typeof f.data === "object" ? f.data : {},
      }));
    return {
      title: String(j.title || question).slice(0, 80),
      body: String(j.body || transcript),
      followUp: j.followUp ? String(j.followUp).slice(0, 200) : null,
      chapter: j.chapter ? String(j.chapter).slice(0, 40) : null,
      sensitive: Boolean(j.sensitive),
      facts,
      aiUsed: true,
    };
  } catch (e) {
    console.error("[ai] writeStory failed, keeping the verbatim answer", e);
    return fallback(question, transcript);
  }
}
