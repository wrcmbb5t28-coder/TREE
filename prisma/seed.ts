/**
 * Demo data: the fictional Rossi family (Italy → Switzerland).
 * Run with `npm run db:seed`, then sign in at /login with demo@treename.ai
 * (in development the sign-in link is shown on screen).
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "node:crypto";

const db = new PrismaClient();
const tok = (n = 12) => randomBytes(n).toString("base64url");

async function main() {
  const email = "demo@treename.ai";
  const existing = await db.user.findUnique({ where: { email }, include: { memberships: true } });
  if (existing?.memberships.length) {
    console.log("Demo data already exists. Delete dev.db and run `npm run setup` to start over.");
    return;
  }
  const user = existing ?? (await db.user.create({ data: { email, name: "Luca", lang: "en" } }));
  const family = await db.family.create({ data: { name: "The Rossi family", lang: "en", pageSlug: `rossi-${tok(4)}`, pageEnabled: true } });
  await db.membership.create({ data: { userId: user.id, familyId: family.id, role: "owner" } });

  const P = (firstName: string, generation: number, x: Partial<{ lastName: string; birthYear: number; birthPlace: string; deathYear: number; isSelf: boolean }> = {}) =>
    db.person.create({ data: { familyId: family.id, firstName, generation, lastName: x.lastName ?? "Rossi", birthYear: x.birthYear, birthPlace: x.birthPlace, deathYear: x.deathYear, isLiving: !x.deathYear, isSelf: !!x.isSelf } });

  const giuseppe = await P("Giuseppe", -2, { birthYear: 1931, birthPlace: "Cosenza", deathYear: 2015 });
  const maria = await P("Maria", -2, { birthYear: 1934, birthPlace: "Cosenza" });
  const marco = await P("Marco", -1, { birthYear: 1969, birthPlace: "Basel" });
  const sofia = await P("Sofia", -1, { lastName: "Keller", birthYear: 1971, birthPlace: "Zürich" });
  const paolo = await P("Paolo", -1, { birthYear: 1963, birthPlace: "Zürich" });
  const luca = await P("Luca", 0, { birthYear: 1996, birthPlace: "Zug", isSelf: true });
  const link = (parentId: string, childId: string) => db.relationship.create({ data: { parentId, childId } });
  await link(giuseppe.id, marco.id); await link(maria.id, marco.id);
  await link(giuseppe.id, paolo.id); await link(maria.id, paolo.id);
  await link(marco.id, luca.id); await link(sofia.id, luca.id);

  const E = (year: number | null, place: string | null, country: string | null, description: string, personId?: string) =>
    db.lifeEvent.create({ data: { familyId: family.id, year, place, country, description, personId } });
  await E(1931, "Cosenza", "IT", "Giuseppe is born", giuseppe.id);
  await E(1956, "Cosenza", "IT", "Maria and Giuseppe marry");
  await E(1962, "Zürich", "CH", "Giuseppe takes the night train north for work", giuseppe.id);
  await E(1968, "Basel", "CH", "First apartment of their own");
  await E(1994, "Buenos Aires", "AR", "Cousin Ana’s family settles");

  const story = async (q: string, transcript: string, title: string, body: string, chapter: string, facts: { kind: string; label: string; confidence: string; data: object }[], followUp?: string) => {
    const question = await db.question.create({ data: { familyId: family.id, storytellerId: maria.id, askedById: user.id, text: q, lang: "it", token: tok(), status: "answered", answeredAt: new Date() } });
    const answer = await db.answer.create({ data: { questionId: question.id, transcript, originalLang: "it", durationS: 84 } });
    await db.story.create({
      data: {
        familyId: family.id, answerId: answer.id, title, body, chapter, followUp, bodyLang: "en", visibility: "public",
        facts: { create: facts.map((f) => ({ familyId: family.id, kind: f.kind, label: f.label, confidence: f.confidence, data: JSON.stringify(f.data) })) },
      },
    });
  };

  await story(
    "Come vi siete conosciuti tu e il nonno?",
    "Ci siamo conosciuti alla festa di San Francesco, nel ’53. Lui aveva una bicicletta rossa e mi ha offerto una granita al limone. Mia madre non era per niente d’accordo, ma tre anni dopo eravamo sposati.",
    "A red bicycle and a lemon ice",
    "Maria met Giuseppe at the feast of San Francesco in 1953. He had a red bicycle and bought her a lemon ice. Her mother did not approve at all, “but three years later we were married.”",
    "Love",
    [
      { kind: "event", label: "Maria and Giuseppe meet at the feast of San Francesco, 1953", confidence: "confirmed", data: { year: 1953, place: "Cosenza", description: "Maria and Giuseppe meet" } },
      { kind: "date", label: "Married about 1956", confidence: "likely", data: { year: 1956, description: "Maria and Giuseppe marry" } },
    ],
    "What do you remember about your wedding day?"
  );
  await story(
    "Qual è stato il periodo più difficile della tua vita?",
    "Il primo inverno a Zurigo. Avevo un bambino piccolo, non parlavo tedesco e Giuseppe lavorava di notte. Una vicina, la signora Keller, mi ha insegnato a dire ‘Brot’.",
    "The first winter in Zürich",
    "The hardest time Maria remembers is her first winter in Zürich. She had a small baby, spoke no German, and Giuseppe worked nights. A neighbour, Frau Keller, taught her to say “Brot”.",
    "Hard years",
    [{ kind: "person", label: "Frau Keller, a neighbour in Zürich", confidence: "confirmed", data: { name: "Frau Keller", relation: "neighbour", place: "Zürich" } }],
    "How did Frau Keller help you after that?"
  );

  const pending = await db.question.create({ data: { familyId: family.id, storytellerId: maria.id, askedById: user.id, text: "Cosa vuoi che i tuoi nipoti ricordino?", lang: "it", token: tok() } });
  console.log("Demo family created.");
  console.log("Sign in at http://localhost:3000/login with demo@treename.ai");
  console.log(`Try answering as Nonna Maria: http://localhost:3000/a/${pending.token}`);
}

main().finally(() => db.$disconnect());
