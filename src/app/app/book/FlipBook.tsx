import Link from "next/link";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { appContext, plural } from "@/i18n/app";
import { canEdit } from "@/lib/auth";
import { isDemoFamily } from "@/lib/demo";
import { setBookTitle } from "../actions";
import { chapterName } from "@/i18n/app/common";
import { more } from "@/i18n/app/more";
import { ownBook } from "@/i18n/app/ownbook";
import { sampleBook } from "@/lib/sampleBook";
import { getDict } from "@/i18n";
import { appUrl } from "@/lib/util";
import { track } from "@/lib/analytics";
import { familyLines } from "@/lib/lines";
import { surnameKey } from "@/lib/crest";
import { geocodeMany, placeKey } from "@/lib/geo";
import BookReader from "@/components/BookReader";
import BookMap, { type MapStop } from "@/components/BookMap";
import CrestSvg from "@/components/CrestSvg";
import { FaceSvg } from "@/components/Face";
import { resolveCover, type Scene } from "@/components/StoryArt";
import BookArt, { type BookScene } from "@/components/BookArt";

const ORDER = ["Origins", "Childhood", "Love", "Work", "Leaving home", "Hard years", "Family life", "Traditions", "Advice", "The next generation"];
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
const roman = (i: number) => ROMAN[i] ?? String(i + 1);

/**
 * Cut a story into page-sized pieces: a budget of characters per page, broken at the end of a
 * sentence when one is close, otherwise between words. The first page holds less (title, name, voice code).
 */
function paginate(text: string, first: number, rest: number): string[] {
  const out: string[] = [];
  let t = text.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
  let budget = first;
  while (t.length > budget * 1.08) {
    const win = t.slice(0, budget);
    const sentence = Math.max(win.lastIndexOf(". "), win.lastIndexOf("! "), win.lastIndexOf("? "), win.lastIndexOf("\n"), win.lastIndexOf("… "));
    let cut = sentence > budget * 0.7 ? sentence + 1 : win.lastIndexOf(" ");
    if (cut < budget * 0.4) cut = budget;
    out.push(t.slice(0, cut).trim());
    t = t.slice(cut).trim();
    budget = rest;
  }
  out.push(t);
  return out;
}

/** A watercolour scene for a story without a photo, picked from its words (any of the six languages). */
const ART: [BookScene, RegExp][] = [
  ["ruins", /войн|фронт|блокад|бомб|\bwar\b|wartime|krieg|guerre|guerra/i],
  ["steamship", /волг|река|реке|пароход|капитан|судн|\briver|steamer|\bship|schiff|fleuve|\bnave|barco/i],
  ["beach", /море|пляж|\bsea\b|beach|meer|strand|plage|spiaggia|playa/i],
  ["harbour", /порт\b|гаван|harbou?r|hafen|\bporto|puerto/i],
  ["station", /арми|призыв|поезд|вокзал|\barmy|military|\btrain|\bzug\b|bahnhof|militär|\bgare\b|armée|treno|stazione|esercito|\btren\b|estación|ejército/i],
  ["classroom", /школ|учител|урок|институт|университет|school|teacher|schule|lehrer|école|enseign|scuola|insegn|escuela|maestr/i],
  ["celebration", /свадьб|wedding|hochzeit|mariage|matrimonio|\bboda/i],
  ["dance", /танц|\bdanc|tanz|\bdans|ballo|baile/i],
  ["choir", /\bхор|пел[аи]?\b|choir|\bchor\b|chœur|\bcoro\b/i],
  ["factory", /завод|фабрик|factory|fabrik|usine|fabbrica|fábrica/i],
  ["mine", /шахт|\bmine\b|miner|bergwerk|zeche|miniera|\bmina\b/i],
  ["carlake", /машин|автомоб|\bcar\b|\bauto\b|voiture|macchina|\bcoche/i],
  ["letters", /письм|\bletter|\bbrief|lettre|lettera|\bcarta/i],
  ["moving", /переех|переезд|\bmoved|umzug|déménag|trasloc|mudanza|mudamos/i],
  ["kitchen", /кухн|рецепт|пирог|варень|kitchen|recipe|küche|rezept|cuisine|recette|cucina|ricetta|cocina|receta/i],
  ["garden", /\bсад|дач|огород|garden|garten|jardin|giardino|jardín/i],
  ["market", /рынок|рынке|базар|market|markt|marché|mercato|mercado/i],
  ["shop", /магазин|лавк|\bshop|laden|boutique|negozio|tienda/i],
  ["church", /церк|храм|church|kirche|église|chiesa|iglesia/i],
  ["snowvillage", /зим|снег|winter|schnee|hiver|neige|inverno|neve|invierno|nieve/i],
  ["village", /деревн|\bсел[оае]|колхоз|village|\bdorf|villaggio|paese|pueblo/i],
  ["farm", /ферм|\bполе|\bполя|\bfarm|bauernhof|ferme|fattoria|granja/i],
  ["citystreet", /город|улиц|\bcity|stadt|\bville\b|città|ciudad/i],
];
const FROM_SCENE: Record<Scene, BookScene> = { river: "steamship", pier: "harbour", house: "room", school: "classroom", village: "village", city: "citystreet", field: "farm" };
function bookScene(text: string, year: number): BookScene {
  for (const [s, re] of ART) if (re.test(text)) return s;
  return year < 1950 ? "village" : "apartments";
}

const longestWord = (t: string) => Math.max(...t.split(/[\s-]+/).map((w) => w.length));

const Folio = ({ n }: { n: number }) => <span className="sb-folio">{n}</span>;

/** The family's own book, leafed through like the sample book: cover, contents, generations, map, numbers, stories. */
export default async function FlipBook() {
  const { user, family, lang, role } = await appContext();
  const t = more[lang].book;
  const o = ownBook[lang];
  const ui = sampleBook(lang).ui;
  const mapTitle = sampleBook(lang).mapTitle;

  const [stories, people, events, lines] = await Promise.all([
    db.story.findMany({
      where: { familyId: family.id, visibility: { not: "private" } },
      include: { answer: { include: { question: { include: { storyteller: true } } } }, photos: { orderBy: { createdAt: "asc" } }, person: true },
      orderBy: { createdAt: "asc" },
    }),
    db.person.findMany({ where: { familyId: family.id, hidden: false }, include: { photos: { orderBy: [{ year: "asc" }, { createdAt: "asc" }] } }, orderBy: [{ generation: "asc" }, { birthYear: "asc" }, { createdAt: "asc" }] }),
    db.lifeEvent.findMany({ where: { familyId: family.id, year: { not: null } }, include: { person: true }, orderBy: { year: "asc" } }),
    familyLines(family.id),
  ]);
  await track("book_preview_opened", { familyId: family.id, userId: user.id, props: { stories: stories.length, view: "flip" } });

  // Title: the main family line ("Лимоновы", "The Jones Family"); a name the family typed themselves wins.
  // The book carries the surname of the person who keeps it (or of their father), not simply the most common one.
  const self = people.find((p) => p.isSelf);
  let ownKey = self?.lastName?.trim() ? surnameKey(self.lastName) : null;
  if (!ownKey && self) {
    const parentIds = (await db.relationship.findMany({ where: { childId: self.id }, select: { parentId: true } })).map((r) => r.parentId);
    const parents = people.filter((p) => parentIds.includes(p.id) && p.lastName?.trim());
    const father = parents.find((p) => p.gender === "m" || p.relation === "father") ?? parents[0];
    if (father?.lastName) ownKey = surnameKey(father.lastName);
  }
  const line = lines.find((l) => o.titleOf(l.name) === family.name.trim()) ?? lines.find((l) => l.key === ownKey) ?? lines[0];
  const autoName = /'s family$/i.test(family.name.trim());
  const title = !autoName ? family.name : line ? o.titleOf(line.name) : o.fallbackTitle;
  const crest = line?.config ?? null;

  const gens = [...new Set(people.map((p) => p.generation))].sort((a, b) => a - b);
  const years = people.map((p) => p.birthYear).filter((y): y is number => !!y);
  const now = new Date().getFullYear();
  const span = years.length ? `${Math.min(...years)} — ${now}` : String(now);
  const subtitle = plural(lang, Math.max(1, gens.length), o.generations);

  // Stories in chapter order; inside a chapter the oldest person first.
  const born = (s: (typeof stories)[number]) => s.person?.birthYear ?? s.answer?.question.storyteller.birthYear ?? 9999;
  const chap = (s: (typeof stories)[number]) => (s.chapter && ORDER.includes(s.chapter) ? s.chapter : "Family life");
  const sorted = [...stories].sort((a, b) => ORDER.indexOf(chap(a)) - ORDER.indexOf(chap(b)) || born(a) - born(b));
  const qr = new Map<string, string>();
  for (const s of sorted) {
    if (s.answer?.audioPath) qr.set(s.id, await QRCode.toDataURL(appUrl(`/app/stories/${s.id}`), { margin: 0, width: 160, color: { dark: "#2B231C", light: "#00000000" } }));
  }

  // The family's road: places with coordinates, in the order the family first reached them.
  const located = events.filter((e) => e.place || e.country);
  const coords = located.length ? await geocodeMany(located.map((e) => ({ place: e.place, country: e.country })), 2) : new Map();
  const stopMap = new Map<string, MapStop & { who: Set<string> }>();
  for (const e of located) {
    const k = placeKey(e.place, e.country);
    const c = coords.get(k);
    if (!c) continue;
    const st = stopMap.get(k) ?? { name: e.place || e.country || "", label: "", lon: c.lng, lat: c.lat, year: e.year!, who: new Set<string>() };
    if (e.person) st.who.add(e.person.firstName);
    stopMap.set(k, st);
  }
  const stops: MapStop[] = [...stopMap.values()].sort((a, b) => a.year - b.year).slice(0, 8)
    .map((s) => ({ name: s.name, lon: s.lon, lat: s.lat, year: s.year, label: [...s.who].slice(0, 3).join(", ") }));
  const hasMap = stops.length >= 2;

  // Generations, oldest first, as on the sample's "line" page.
  const rows = gens.slice(0, 8).map((g) => people.filter((p) => p.generation === g));
  const life = (p: { birthYear: number | null; deathYear: number | null }) => (p.birthYear ? `${p.birthYear}${p.deathYear ? `–${p.deathYear}` : ""}` : "");
  const fullName = (p: { firstName: string; lastName: string | null }) => [p.firstName, p.lastName].filter(Boolean).join(" ");

  // ---- page plan ----
  const front = hasMap ? 6 : 4; // title, contents, generations, (map), numbers … then portraits and stories

  // Portraits: everyone the family has described gets a page with their picture and words,
  // then their life story and the rest of their photos. Oldest generation first.
  type Portrait = { person: (typeof people)[number]; start: number; picture: string | null; chunks: string[]; album: { path: string; caption: string }[][] };
  const portraits: Portrait[] = [];
  let next = front + 1;
  for (const p of people.filter((x) => x.bio?.trim() || x.lifePath?.trim())) {
    const picture = p.photoPath ?? p.photos[0]?.path ?? null;
    const rest = p.photos.filter((ph) => ph.path !== picture).map((ph) => ({ path: ph.path, caption: [ph.caption, ph.year].filter(Boolean).join(", ") }));
    const album: Portrait["album"] = [];
    for (let i = 0; i < rest.length && album.length < 3; i += 4) album.push(rest.slice(i, i + 4));
    const chunks = p.lifePath?.trim() ? paginate(p.lifePath, 700, 840) : [];
    portraits.push({ person: p, start: next, picture, chunks, album });
    next += 1 + chunks.length + album.length;
  }
  const peopleStart = portraits[0]?.start ?? null;
  const peopleEnd = next;
  if (next % 2 === 0) next += 1; // the stories open on a left page
  const storiesStart = next;

  // every story opens on a left page (odd number), so it reads as a spread
  type Piece = { story: (typeof sorted)[number]; idx: number; start: number; chunks: string[] };
  const pieces: Piece[] = [];
  sorted.forEach((s, idx) => {
    const chunks = paginate(s.body, qr.has(s.id) ? 500 : 620, 840);
    pieces.push({ story: s, idx, start: next, chunks });
    let used = 1 + chunks.length; // picture page + text pages
    if (used % 2) used += 1; // keep the next story on a left page
    next += used;
  });
  const endPage = next;

  const pages: React.ReactNode[] = [
    <div key="cover" className="sb-cover">
      <div className="sb-cover-frame">
        {crest && <CrestSvg c={crest} size={150} idSuffix="own-cover" title={title} />}
        <h1 className="sb-cover-title ob-cover-title" style={{ fontSize: `${Math.min(12, 100 / Math.max(5, longestWord(title)))}cqw` }}>{title}</h1>
        <p className="sb-cover-sub">{subtitle}</p>
        <p className="sb-cover-years">{span}</p>
      </div>
      <span className="sb-cover-brand">Treename</span>
    </div>,

    <article key="title" className="sb-p sb-titlepage">
      {crest && <CrestSvg c={{ ...crest, motto: "" }} size={64} idSuffix="own-t" title={title} />}
      <h2>{title}</h2>
      <p className="sb-sub">{subtitle}</p>
      <p className="sb-years">{span}</p>
      <p className="sb-dedication">{o.made(now)}</p>
      <Folio n={1} />
    </article>,

    <article key="toc" className="sb-p">
      <h2 className="sb-h">{sampleBook(lang).contents}</h2>
      <ol className="sb-toc ob-toc">
        <li><span>{t.ourFamily}</span><i /><b>3</b></li>
        {hasMap && <li><span>{mapTitle}</span><i /><b>4</b></li>}
        {peopleStart && <li><span>{o.peopleTitle}</span><i /><b>{peopleStart}</b></li>}
        {pieces.slice(0, peopleStart ? 13 : 14).map((p) => <li key={p.story.id}><span><small>{roman(p.idx)}.</small> {p.story.title}</span><i /><b>{p.start}</b></li>)}
        {pieces.length > (peopleStart ? 13 : 14) && <li><span>{o.more(pieces.length - (peopleStart ? 13 : 14))}</span><i /><b /></li>}
      </ol>
      <Folio n={2} />
    </article>,

    <article key="gens" className="sb-p">
      <h2 className="sb-h">{t.ourFamily}</h2>
      <ol className="sb-line ob-line">
        {rows.map((row, i) => (
          <li key={i} className="sb-gen">
            <span className="sb-roman">{roman(i)}</span>
            <span className="sb-pair">{row.slice(0, 3).map((p) => <FaceSvg key={p.id} p={p} size={34} idSuffix="ob" />)}</span>
            <span className="sb-names">
              {row.slice(0, 2).map((p, k) => <span key={p.id}>{k > 0 && <br />}<b>{fullName(p)}</b> <em>{life(p)}</em></span>)}
              {row.length > 2 && <><br /><em>{o.more(row.length - 2)}</em></>}
            </span>
          </li>
        ))}
      </ol>
      <Folio n={3} />
    </article>,

    ...(hasMap
      ? [
          <article key="map" className="sb-p">
            <h2 className="sb-h">{mapTitle}</h2>
            <BookMap b={{ mapTitle, stops }} />
            <ol className="sb-stops">{stops.map((s, i) => <li key={i}><b>{s.year}</b> {s.name}{s.label ? ` — ${s.label}` : ""}</li>)}</ol>
            <Folio n={4} />
          </article>,
        ]
      : []),

    <article key="numbers" className="sb-p sb-numbers">
      <dl className="sb-facts">
        {[gens.length, people.length, stopMap.size, stories.length].map((n, i) => <div key={i}><dt>{n}</dt><dd>{ui.facts[i]}</dd></div>)}
      </dl>
      {crest && <CrestSvg c={crest} size={110} idSuffix="own-n" title={title} />}
      <Folio n={hasMap ? 5 : 4} />
    </article>,

    // keep the first story on a left page
    ...(hasMap ? [<article key="motto" className="sb-p sb-numbers ob-mottopage"><p className="sb-orn" aria-hidden="true">❦</p><p className="sb-mapnote ob-motto">{getDict(lang).hero.slogan}</p><Folio n={6} /></article>] : []),
  ];

  for (const pt of portraits) {
    const p = pt.person;
    let n = pt.start;
    const where = [life(p), p.birthPlace].filter(Boolean).join(" · ");
    pages.push(
      <article key={`${p.id}-portrait`} className={`sb-p ${n % 2 ? "sb-left" : "sb-right"} ob-portrait`}>
        <p className="sb-chapter">{n === peopleStart ? o.peopleTitle : o.portrait}</p>
        <div className="ob-frame">
          {pt.picture
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={`/api/files/${pt.picture}`} alt={fullName(p)} loading="lazy" />
            : <FaceSvg p={p} size={240} idSuffix="obp" />}
        </div>
        <h3 className="sb-title">{fullName(p)}</h3>
        {where && <p className="sb-who">{where}</p>}
        {p.bio?.trim() && <p className="ob-bio">{p.bio}</p>}
        <Folio n={n++} />
      </article>,
    );
    pt.chunks.forEach((c, k) => {
      const last = k === pt.chunks.length - 1;
      pages.push(
        <article key={`${p.id}-t${k}`} className={`sb-p ${n % 2 ? "sb-left" : "sb-right"}`}>
          {k === 0 && <p className="sb-chapter ob-chapter-left">{fullName(p)}</p>}
          <p data-fit="" className={`ob-text${k === 0 ? " ob-first" : ""}${last ? " ob-last" : ""}`}>{c}</p>
          <Folio n={n++} />
        </article>,
      );
    });
    pt.album.forEach((photos, k) => {
      pages.push(
        <article key={`${p.id}-a${k}`} className={`sb-p ${n % 2 ? "sb-left" : "sb-right"} ob-albumpage`}>
          <p className="sb-chapter">{o.album} · {p.firstName}</p>
          <div className={`ob-album ob-album-${photos.length}`}>
            {photos.map((ph, i) => (
              <figure key={ph.path} className="sb-photo ob-snap" style={{ transform: `rotate(${[-2, 1.6, 1.2, -1.4][i]}deg)` }}>
                <span className="tape tape-l" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/files/${ph.path}`} alt={ph.caption} loading="lazy" />
                {ph.caption && <figcaption>{ph.caption}</figcaption>}
              </figure>
            ))}
          </div>
          <Folio n={n++} />
        </article>,
      );
    });
  }
  if (storiesStart !== peopleEnd) {
    const n = peopleEnd;
    pages.push(<article key="people-end" className={`sb-p ${n % 2 ? "sb-left" : "sb-right"} ob-filler`}><p className="sb-orn" aria-hidden="true">❦</p><Folio n={n} /></article>);
  }

  for (const p of pieces) {
    const s = p.story;
    const who = s.person ?? s.answer?.question.storyteller ?? null;
    const whoLine = who ? [fullName(who), life(who)].filter(Boolean).join(", ") : "";
    const caption = [who?.firstName, who?.birthYear ? String(who.birthYear) : ""].filter(Boolean).join(", ");
    let n = p.start;
    const cover = resolveCover(s.cover, s.photos, `${s.title} ${s.body}`);
    const artYear = Math.min(now, who?.birthYear ? who.birthYear + 25 : now);
    pages.push(
      <article key={`${s.id}-pic`} className="sb-p sb-left">
        <p className="sb-chapter">{ui.chapter} {roman(p.idx)} · {chapterName(lang, chap(s))}</p>
        <figure className="sb-photo" style={{ transform: `rotate(${p.idx % 2 ? 1.4 : -1.6}deg)` }}>
          <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
          {cover.photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={`/api/files/${cover.photo.path}`} alt={cover.photo.caption ?? ""} className="sb-img" loading="lazy" />
            : <BookArt seed={s.id} year={artYear} title={s.title} scene={cover.auto ? bookScene(`${s.title} ${s.body}`, artYear) : FROM_SCENE[cover.scene]} />}
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
        <p className="sb-orn" aria-hidden="true">❦</p>
        <Folio n={n++} />
      </article>,
    );
    p.chunks.forEach((c, k) => {
      const side = (n % 2) ? "sb-left" : "sb-right";
      const last = k === p.chunks.length - 1;
      pages.push(
        <article key={`${s.id}-t${k}`} className={`sb-p ${side}`}>
          {k === 0 && <h3 className="sb-title">{s.title}</h3>}
          {k === 0 && whoLine && <p className="sb-who">{whoLine}</p>}
          <p data-fit="" className={`ob-text${k === 0 ? " ob-first" : ""}${last ? " ob-last" : ""}`}>{c}</p>
          {k === 0 && qr.has(s.id) && who && (
            <div className="sb-voice">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr.get(s.id)} alt="" width={80} height={80} />
              <span><b>{ui.listen}</b><br />{t.scan(who.firstName)}</span>
            </div>
          )}
          <Folio n={n++} />
        </article>,
      );
    });
    if ((n - p.start) % 2) {
      const extra = s.photos.find((ph) => !s.cover?.endsWith(ph.id) && ph.id !== s.photos[0]?.id);
      pages.push(
        <article key={`${s.id}-end`} className={`sb-p ${n % 2 ? "sb-left" : "sb-right"} ob-filler`}>
          {extra ? (
            <figure className="sb-photo" style={{ transform: "rotate(1.2deg)" }}>
              <span className="tape tape-l" aria-hidden="true" /><span className="tape tape-r" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/files/${extra.path}`} alt={extra.caption ?? ""} className="sb-img" loading="lazy" />
              {extra.caption && <figcaption>{extra.caption}</figcaption>}
            </figure>
          ) : <p className="sb-orn" aria-hidden="true">❦</p>}
          <Folio n={n++} />
        </article>,
      );
    }
  }

  pages.push(
    <article key="end" className="sb-p sb-end">
      <p className="sb-orn" aria-hidden="true">❦</p>
      <h2>{stories.length ? o.endTitle : t.empty}</h2>
      {stories.length > 0 && <p>{o.endText}</p>}
      <p><Link className="btn btn-primary" href="/app/ask">{o.endCta}</Link></p>
      <Folio n={endPage} />
    </article>,
    <article key="colophon" className="sb-p sb-colophon">
      {crest && <CrestSvg c={{ ...crest, motto: "" }} size={48} idSuffix="own-c" title={title} />}
      <p>{title} · Treename · {now}</p>
      <Folio n={endPage + 1} />
    </article>,
  );

  return (
    <div className="sb-root ob-root" lang={lang}>
      <header className="sb-top">
        <Link href="/app" className="sb-back">{o.back}</Link>
        <p className="sb-eyebrow">{t.eyebrow} · {plural(lang, stories.length, t.stories)}</p>
        <Link href="/app/book?print=1" className="btn btn-ghost btn-sm ob-print">{t.print}</Link>
      </header>
      {canEdit(role) && !isDemoFamily(family.id) && (
        <details className="ob-name">
          <summary>{o.cover}: <b>{title}</b></summary>
          <form action={setBookTitle} className="ob-name-form">
            <select name="pick" defaultValue={autoName ? "" : lines.map((l) => o.titleOf(l.name)).includes(family.name) ? family.name : ""}>
              <option value="">{o.auto}</option>
              {lines.map((l) => <option key={l.key} value={o.titleOf(l.name)}>{o.titleOf(l.name)}</option>)}
            </select>
            <input name="custom" placeholder={o.custom} defaultValue={!autoName && !lines.map((l) => o.titleOf(l.name)).includes(family.name) ? family.name : ""} maxLength={80} />
            <button className="btn btn-primary btn-sm">{o.save}</button>
          </form>
        </details>
      )}
      <BookReader pages={pages} labels={{ prev: ui.prev, next: ui.next, page: ui.page, of: ui.of, hint: ui.hint, open: ui.open }} />
    </div>
  );
}
