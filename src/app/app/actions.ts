"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireFamily, canEdit, setCurrentFamily } from "@/lib/auth";
import { clean, toInt, token } from "@/lib/util";
import { track } from "@/lib/analytics";
import { saveFile, deleteFile, deleteFamilyFiles, MAX_UPLOAD_BYTES } from "@/lib/storage";
import { avatarById } from "@/lib/avatars";
import { isCrestConfig } from "@/lib/crest";
import { relationById } from "@/i18n/questions";
import { FREE_LIMITS, isPaid } from "@/lib/plans";
import { isLang } from "@/i18n/config";
import { uiLang } from "@/i18n/app";
import { familyT } from "@/i18n/app/family";

async function editor() {
  const ctx = await requireFamily();
  if (!canEdit(ctx.role)) throw new Error("You can view this family but not change it.");
  return ctx;
}

/** ISO country code from a form field ("CH"), or null. */
function countryCode(v: FormDataEntryValue | null): string | null {
  const c = clean(v, 2).toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
}

/** relation + gender from a form; a gendered relation (wife, father...) sets the gender. */
function roleFields(form: FormData): { relation: string | null; gender: string | null } {
  const rel = relationById(clean(form.get("role"), 20));
  const g = clean(form.get("gender"), 1);
  return { relation: rel?.id ?? null, gender: rel?.gender ?? (g === "f" || g === "m" ? g : null) };
}

// ---------- Questions ----------

export async function askQuestion(form: FormData) {
  const { user, family } = await editor();
  const storytellerId = clean(form.get("storytellerId"), 40);
  const text = clean(form.get("custom"), 300) || clean(form.get("question"), 300);
  const lang = clean(form.get("lang"), 2);
  const channel = clean(form.get("channel"), 10) || "whatsapp";
  const teller = await db.person.findFirst({ where: { id: storytellerId, familyId: family.id } });
  if (!teller || !text) throw new Error("Choose a person and a question.");
  const q = await db.question.create({
    data: {
      familyId: family.id, storytellerId: teller.id, askedById: user.id, text,
      lang: isLang(lang) ? lang : family.lang, token: token(12),
      channel: ["whatsapp", "link", "together"].includes(channel) ? channel : "whatsapp",
      topic: clean(form.get("topic"), 30) || null,
    },
  });
  await track("question_sent", { familyId: family.id, userId: user.id, props: { channel: q.channel, lang: q.lang } });
  redirect(`/app?asked=${q.id}`);
}

export async function askFollowUp(storyId: string) {
  const { user, family } = await editor();
  const story = await db.story.findFirst({ where: { id: storyId, familyId: family.id }, include: { answer: { include: { question: true } } } });
  const prev = story?.answer?.question;
  if (!story?.followUp || !prev) throw new Error("No follow-up question for this story.");
  const q = await db.question.create({
    data: { familyId: family.id, storytellerId: prev.storytellerId, askedById: user.id, text: story.followUp, lang: prev.lang, token: token(12), channel: prev.channel, topic: "follow-up" },
  });
  await track("question_sent", { familyId: family.id, userId: user.id, props: { channel: q.channel, followUp: true } });
  redirect(`/app?asked=${q.id}`);
}

export async function deleteQuestion(id: string) {
  const { family } = await editor();
  await db.question.deleteMany({ where: { id, familyId: family.id, status: { not: "answered" } } });
  revalidatePath("/app");
}

// ---------- People ----------

export async function addPerson(form: FormData) {
  const { user, family } = await editor();
  const firstName = clean(form.get("firstName"), 60);
  if (!firstName) throw new Error("First name is required.");
  const rel = clean(form.get("relation"), 80); // "parent-of:<id>" | "child-of:<id>" | "partner-of:<id>" | ""
  const [kind, otherId] = rel.split(":");
  const other = otherId ? await db.person.findFirst({ where: { id: otherId, familyId: family.id } }) : null;
  const generation = other ? (kind === "parent-of" ? other.generation - 1 : kind === "child-of" ? other.generation + 1 : other.generation) : 0;
  const deathYear = toInt(form.get("deathYear"));
  const person = await db.person.create({
    data: {
      familyId: family.id, firstName,
      lastName: clean(form.get("lastName"), 60) || null,
      birthYear: toInt(form.get("birthYear")),
      birthPlace: clean(form.get("birthPlace"), 80) || null,
      birthCountry: countryCode(form.get("birthCountry")),
      deathYear,
      isLiving: !deathYear && form.get("deceased") !== "on",
      generation,
      ...roleFields(form),
    },
  });
  if (other && kind === "parent-of") await db.relationship.create({ data: { parentId: person.id, childId: other.id } });
  if (other && kind === "child-of") await db.relationship.create({ data: { parentId: other.id, childId: person.id } });
  if (other && kind === "partner-of") {
    // Partners share children: link the new person as parent of the other's children.
    const kids = await db.relationship.findMany({ where: { parentId: other.id } });
    for (const k of kids) await db.relationship.create({ data: { parentId: person.id, childId: k.childId } }).catch(() => {});
  }
  if (person.birthYear || person.birthPlace || person.birthCountry) {
    await db.lifeEvent.create({ data: { familyId: family.id, personId: person.id, year: person.birthYear, place: person.birthPlace, country: person.birthCountry, description: `${firstName} is born`, source: "user" } });
  }
  await track("family_member_added", { familyId: family.id, userId: user.id, props: { relation: kind || "none" } });
  revalidatePath("/app/family");
  redirect("/app/family");
}

export async function updatePerson(id: string, form: FormData) {
  const { family } = await editor();
  const deathYear = toInt(form.get("deathYear"));
  const birthYear = toInt(form.get("birthYear"));
  const birthPlace = clean(form.get("birthPlace"), 80) || null;
  const birthCountry = countryCode(form.get("birthCountry"));
  const firstName = clean(form.get("firstName"), 60) || undefined;
  await db.person.updateMany({
    where: { id, familyId: family.id },
    data: {
      firstName,
      lastName: clean(form.get("lastName"), 60) || null,
      birthYear,
      birthPlace,
      birthCountry,
      deathYear,
      isLiving: !deathYear && form.get("deceased") !== "on",
      hidden: form.get("hidden") === "on",
      ...(form.has("role") ? roleFields(form) : {}),
      bio: clean(form.get("bio"), 280) || null,
      lifePath: clean(form.get("lifePath"), 20000) || null,
    },
  });
  // Keep the birth event on the timeline and map in step with the profile.
  const person = await db.person.findFirst({ where: { id, familyId: family.id } });
  if (person) {
    const birth = await db.lifeEvent.findFirst({ where: { familyId: family.id, personId: id, description: { endsWith: " is born" } } });
    const data = { year: birthYear, place: birthPlace, country: birthCountry, description: `${person.firstName} is born` };
    if (birth) await db.lifeEvent.update({ where: { id: birth.id }, data });
    else if (birthYear || birthPlace || birthCountry) await db.lifeEvent.create({ data: { familyId: family.id, personId: id, source: "user", ...data } });
  }
  revalidatePath("/app/family");
  revalidatePath("/app/journey");
  redirect(`/app/family/${id}?saved=1`);
}

// ---------- Person photos and profile picture ----------

/** Adds one photo to a person's gallery (called per file by PhotoUpload, already shrunk to JPEG). */
export async function addPersonPhoto(id: string, form: FormData): Promise<{ error?: string; limit?: boolean }> {
  const { user, family } = await editor();
  const msg = familyT[uiLang(user, family)].uploadErr;
  const person = await db.person.findFirst({ where: { id, familyId: family.id } });
  if (!person) return { error: msg.notFound };
  const file = form.get("photo");
  if (!(file instanceof Blob) || file.size === 0) return { error: msg.choose };
  if (file.size > MAX_UPLOAD_BYTES) return { error: msg.tooLarge };
  if (!file.type.startsWith("image/")) return { error: msg.format };
  if (!isPaid(family) && (await db.photo.count({ where: { familyId: family.id } })) >= FREE_LIMITS.photos) {
    return { error: msg.freeLimit(FREE_LIMITS.photos), limit: true };
  }
  try {
    const path = await saveFile(family.id, Buffer.from(await file.arrayBuffer()), "jpg");
    await db.photo.create({ data: { familyId: family.id, personId: id, path } });
    // Uploaded from the "Picture" block, or the first photo while no symbol was chosen: it becomes the profile picture.
    if (form.get("makeAvatar") === "1" || (!person.photoPath && !person.avatar)) {
      await db.person.update({ where: { id }, data: { photoPath: path, avatar: null } });
    }
  } catch (e) {
    console.error("[person photo]", e);
    const why = e instanceof Error ? e.message.slice(0, 160) : "";
    return { error: `${msg.saveFailed}${why ? ` (${why})` : ""}` };
  }
  revalidatePath(`/app/family/${id}`);
  revalidatePath("/app/family");
  return {};
}

export async function makeProfilePhoto(photoId: string) {
  const { family } = await editor();
  const photo = await db.photo.findFirst({ where: { id: photoId, familyId: family.id } });
  if (!photo?.personId) return;
  await db.person.update({ where: { id: photo.personId }, data: { photoPath: photo.path, avatar: null } });
  revalidatePath(`/app/family/${photo.personId}`);
  revalidatePath("/app/family");
}

export async function deletePersonPhoto(photoId: string) {
  const { family } = await editor();
  const photo = await db.photo.findFirst({ where: { id: photoId, familyId: family.id } });
  if (!photo) return;
  await db.photo.delete({ where: { id: photo.id } });
  if (photo.personId) {
    await db.person.updateMany({ where: { id: photo.personId, photoPath: photo.path }, data: { photoPath: null } });
    revalidatePath(`/app/family/${photo.personId}`);
  }
  const stillUsed = await db.person.count({ where: { familyId: family.id, photoPath: photo.path } });
  if (!stillUsed) await deleteFile(photo.path);
  revalidatePath("/app/family");
}

/** Preset symbol (or initials when empty). Photos stay in the gallery. */
export async function setPersonAvatar(id: string, form: FormData) {
  const { family } = await editor();
  const preset = avatarById(clean(form.get("avatar"), 20));
  await db.person.updateMany({ where: { id, familyId: family.id }, data: { avatar: preset?.id ?? null, photoPath: null } });
  revalidatePath(`/app/family/${id}`);
  revalidatePath("/app/family");
  redirect(`/app/family/${id}#edit`);
}

export async function deletePerson(id: string) {
  const { family } = await editor();
  const answered = await db.question.count({ where: { storytellerId: id, familyId: family.id, status: "answered" } });
  if (answered > 0) throw new Error("This person has recorded stories. Hide them instead of removing them.");
  await db.person.deleteMany({ where: { id, familyId: family.id, isSelf: false } });
  revalidatePath("/app/family");
  redirect("/app/family");
}

// ---------- Stories and facts ----------

/** Only accept a person id that belongs to this family. */
async function personInFamily(familyId: string, raw: FormDataEntryValue | null): Promise<string | null> {
  const id = clean(raw, 40);
  if (!id) return null;
  const p = await db.person.findFirst({ where: { id, familyId }, select: { id: true } });
  return p?.id ?? null;
}

export async function writeMemory(form: FormData) {
  const { user, family } = await editor();
  const body = clean(form.get("body"), 20000);
  if (body.length < 10) throw new Error("Write a little more.");
  const story = await db.story.create({
    data: {
      familyId: family.id, authorId: user.id,
      title: clean(form.get("title"), 100) || body.slice(0, 50),
      body, bodyLang: family.lang,
      chapter: clean(form.get("chapter"), 40) || null,
      visibility: form.get("private") === "on" ? "private" : "family",
      personId: await personInFamily(family.id, form.get("personId")),
    },
  });
  await track("story_created", { familyId: family.id, userId: user.id, props: { source: "written" } });
  redirect(`/app/stories/${story.id}`);
}

export async function updateStory(id: string, form: FormData) {
  const { family } = await editor();
  const vis = clean(form.get("visibility"), 10);
  await db.story.updateMany({
    where: { id, familyId: family.id },
    data: {
      title: clean(form.get("title"), 100) || undefined,
      body: clean(form.get("body"), 20000) || undefined,
      chapter: clean(form.get("chapter"), 40) || null,
      visibility: ["family", "private", "public"].includes(vis) ? vis : undefined,
      ...(form.has("personId") ? { personId: await personInFamily(family.id, form.get("personId")) } : {}),
    },
  });
  revalidatePath(`/app/stories/${id}`);
  redirect(`/app/stories/${id}`);
}

export async function deleteStory(id: string) {
  const { family } = await editor();
  await db.story.deleteMany({ where: { id, familyId: family.id } });
  redirect("/app/stories");
}

export async function confirmFact(id: string) {
  const { user, family } = await editor();
  const fact = await db.fact.findFirst({ where: { id, familyId: family.id, status: "suggested" }, include: { story: { include: { answer: { include: { question: true } } } } } });
  if (!fact) return;
  const d = JSON.parse(fact.data || "{}") as { name?: string; relation?: string; year?: number; place?: string; country?: string; description?: string };
  const teller = fact.story.answer?.question.storytellerId;

  if (fact.kind === "person" && d.name) {
    const [firstName, ...rest] = d.name.split(" ");
    const exists = await db.person.findFirst({ where: { familyId: family.id, firstName } });
    if (!exists) {
      const anchor = teller ? await db.person.findUnique({ where: { id: teller } }) : null;
      const rel = (d.relation || "").toLowerCase();
      let generation = anchor?.generation ?? 0;
      if (/(mother|father|parent|mutter|vater|mère|père|madre|padre|мать|отец|мама|папа)/.test(rel)) generation -= 1;
      if (/(son|daughter|child|sohn|tochter|fils|fille|figli|hij|сын|дочь)/.test(rel)) generation += 1;
      const p = await db.person.create({ data: { familyId: family.id, firstName, lastName: rest.join(" ") || null, generation, birthYear: d.year ?? null, birthPlace: d.place ?? null } });
      if (anchor && generation === anchor.generation - 1) await db.relationship.create({ data: { parentId: p.id, childId: anchor.id } });
      if (anchor && generation === anchor.generation + 1) await db.relationship.create({ data: { parentId: anchor.id, childId: p.id } });
    }
  } else if (d.year || d.place || d.country) {
    await db.lifeEvent.create({
      data: { familyId: family.id, personId: teller ?? null, year: d.year ?? null, place: d.place ?? null, country: d.country?.slice(0, 2).toUpperCase() ?? null, description: d.description || fact.label, source: fact.storyId },
    });
  }
  await db.fact.update({ where: { id }, data: { status: "confirmed" } });
  await track("fact_confirmed", { familyId: family.id, userId: user.id, props: { kind: fact.kind } });
  revalidatePath(`/app/stories/${fact.storyId}`);
}

export async function rejectFact(id: string) {
  const { family } = await editor();
  const f = await db.fact.findFirst({ where: { id, familyId: family.id } });
  await db.fact.updateMany({ where: { id, familyId: family.id }, data: { status: "rejected" } });
  if (f) revalidatePath(`/app/stories/${f.storyId}`);
}

// ---------- Photos ----------

export async function uploadPhoto(form: FormData) {
  const { user, family } = await editor();
  const file = form.get("photo");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose a photo.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Photo is larger than 4 MB. Please use a smaller photo.");
  if (!isPaid(family) && (await db.photo.count({ where: { familyId: family.id } })) >= FREE_LIMITS.photos) {
    await track("paywall_viewed", { familyId: family.id, userId: user.id, props: { trigger: "photos" } });
    redirect("/app/billing?reason=photos");
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  if (!["jpg", "jpeg", "png", "webp"].includes(ext)) throw new Error("Use a JPG, PNG or WebP photo.");
  const path = await saveFile(family.id, Buffer.from(await file.arrayBuffer()), ext);
  const storyId = clean(form.get("storyId"), 40) || null;
  await db.photo.create({ data: { familyId: family.id, path, caption: clean(form.get("caption"), 200) || null, year: toInt(form.get("year")), storyId } });
  await track("photo_uploaded", { familyId: family.id, userId: user.id, props: { captioned: !!form.get("caption") } });
  redirect(storyId ? `/app/stories/${storyId}` : "/app/stories");
}

// ---------- Journey ----------

export async function addEvent(form: FormData) {
  const { family } = await editor();
  const description = clean(form.get("description"), 200);
  if (!description) throw new Error("Describe what happened.");
  await db.lifeEvent.create({
    data: {
      familyId: family.id, description,
      year: toInt(form.get("year")),
      place: clean(form.get("place"), 80) || null,
      country: countryCode(form.get("country")),
      personId: await personInFamily(family.id, form.get("personId")),
    },
  });
  revalidatePath("/app/journey");
  const back = clean(form.get("back"), 80);
  if (back.startsWith("/app/family/")) {
    revalidatePath(back);
    redirect(back);
  }
}

export async function deleteEvent(id: string) {
  const { family } = await editor();
  const ev = await db.lifeEvent.findFirst({ where: { id, familyId: family.id } });
  await db.lifeEvent.deleteMany({ where: { id, familyId: family.id } });
  revalidatePath("/app/journey");
  if (ev?.personId) revalidatePath(`/app/family/${ev.personId}`);
}

// ---------- Family, invites, page, settings ----------

export async function createInvite(form: FormData) {
  const { user, family, role } = await requireFamily();
  if (role === "viewer") throw new Error("Viewers cannot invite.");
  const inviteRole = clean(form.get("role"), 12);
  const t = token(12);
  await db.invite.create({
    data: { token: t, familyId: family.id, createdById: user.id, relation: clean(form.get("relation"), 40) || null, role: ["editor", "viewer"].includes(inviteRole) ? inviteRole : "editor" },
  });
  await track("invite_sent", { familyId: family.id, userId: user.id, props: { relation: clean(form.get("relation"), 40), channel: "link" } });
  redirect(`/app/invite?new=${t}`);
}

export async function togglePage() {
  const { user, family } = await editor();
  const updated = await db.family.update({ where: { id: family.id }, data: { pageEnabled: !family.pageEnabled } });
  if (updated.pageEnabled) await track("family_page_created", { familyId: family.id, userId: user.id });
  revalidatePath("/app/keep");
}

export async function updateSettings(form: FormData) {
  const { family, role } = await requireFamily();
  if (role !== "owner") throw new Error("Only the owner can change settings.");
  const lang = clean(form.get("lang"), 2);
  await db.family.update({
    where: { id: family.id },
    data: {
      name: clean(form.get("name"), 80) || family.name,
      lang: isLang(lang) ? lang : family.lang,
      legacyContact: clean(form.get("legacyContact"), 200) || null,
    },
  });
  revalidatePath("/app/settings");
  redirect("/app/settings?saved=1");
}

export async function updateProfile(form: FormData) {
  const { user } = await requireFamily();
  const lang = clean(form.get("lang"), 2);
  await db.user.update({
    where: { id: user.id },
    data: { name: clean(form.get("name"), 60) || null, ...(isLang(lang) ? { lang, uiLang: lang } : {}) },
  });
  revalidatePath("/app", "layout");
  redirect("/app/settings?saved=1");
}

/** Language switcher in the app header. */
export async function setUiLang(lang: string) {
  const { user } = await requireFamily();
  if (!isLang(lang)) return;
  await db.user.update({ where: { id: user.id }, data: { uiLang: lang, lang } });
  revalidatePath("/app", "layout");
}

export async function deleteFamily(form: FormData) {
  const { family, role } = await requireFamily();
  if (role !== "owner") throw new Error("Only the owner can delete the family.");
  if (clean(form.get("confirm"), 100) !== family.name) throw new Error("Type the family name exactly to confirm.");
  await deleteFamilyFiles(family.id);
  await db.family.delete({ where: { id: family.id } });
  redirect("/app");
}

export async function switchFamily(id: string) {
  const { memberships } = await requireFamily();
  if (memberships.some((m) => m.familyId === id)) await setCurrentFamily(id);
  redirect("/app");
}

// ---------- Family crests ----------

export async function saveCrest(key: string, config: string): Promise<{ ok: boolean }> {
  const { family } = await editor();
  const k = clean(key, 80).toLowerCase();
  let parsed: unknown;
  try { parsed = JSON.parse(config); } catch { return { ok: false }; }
  if (!k || !isCrestConfig(parsed)) return { ok: false };
  const value = JSON.stringify({ ...parsed, motto: clean(parsed.motto, 40) });
  await db.crest.upsert({ where: { familyId_key: { familyId: family.id, key: k } }, create: { familyId: family.id, key: k, config: value }, update: { config: value } });
  revalidatePath("/app/crests");
  revalidatePath("/app/family");
  return { ok: true };
}

export async function resetCrest(key: string): Promise<{ ok: boolean }> {
  const { family } = await editor();
  await db.crest.deleteMany({ where: { familyId: family.id, key: clean(key, 80).toLowerCase() } });
  revalidatePath("/app/crests");
  revalidatePath("/app/family");
  return { ok: true };
}
