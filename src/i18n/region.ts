import type { Dict } from "./en";
import type { Lang } from "./config";

/**
 * Where family data is stored. The site promises "Switzerland" only when
 * DATA_REGION=ch is set, i.e. when the database, files and AI processing really are there.
 * Default "eu" (e.g. Vercel + Neon Frankfurt).
 */
const EU: Record<Lang, { trust: string; t: string; d: string }> = {
  en: { trust: "Data hosted in Europe", t: "Stored in Europe", d: "Protected under Swiss and EU data law, encrypted in storage and in transit." },
  de: { trust: "Daten in Europa", t: "In Europa gespeichert", d: "Geschützt nach Schweizer und EU-Datenschutzrecht, verschlüsselt gespeichert und übertragen." },
  fr: { trust: "Données hébergées en Europe", t: "Stocké en Europe", d: "Protégé par le droit suisse et européen, chiffré au stockage et en transit." },
  it: { trust: "Dati ospitati in Europa", t: "Conservato in Europa", d: "Protetto dalle leggi svizzere ed europee sui dati, cifrato in archivio e in transito." },
  es: { trust: "Datos alojados en Europa", t: "Guardado en Europa", d: "Protegido por las leyes suizas y europeas de datos, cifrado al guardar y al enviar." },
  ru: { trust: "Данные хранятся в Европе", t: "Хранится в Европе", d: "Под защитой швейцарского и европейского законодательства, с шифрованием при хранении и передаче." },
};

export function applyRegion(d: Dict, lang: Lang): Dict {
  if ((process.env.DATA_REGION || "eu").toLowerCase() === "ch") return d;
  const r = EU[lang];
  return {
    ...d,
    hero: { ...d.hero, trust: [d.hero.trust[0], d.hero.trust[1], r.trust] },
    privacy: {
      ...d.privacy,
      items: d.privacy.items.map((it, i) => (i === 1 ? { t: r.t, d: r.d } : it)),
    },
  };
}
