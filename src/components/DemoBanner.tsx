"use client";

import { useSearchParams } from "next/navigation";
import type { Lang } from "@/i18n/config";

const T: Record<Lang, { what: (f: string) => string; readonly: string; start: string; exit: string }> = {
  ru: { what: (f) => `Это пример — выдуманная семья: ${f}. Смотрите всё, что хотите, сломать ничего нельзя.`, readonly: "В примере ничего не меняется. Чтобы добавлять людей и истории, заведите своё древо — это бесплатно.", start: "Создать своё древо", exit: "Выйти из примера" },
  en: { what: (f) => `This is a sample — a made-up family: ${f}. Look around, nothing here can break.`, readonly: "Nothing changes in the sample. To add people and stories, start your own tree — it's free.", start: "Start your own tree", exit: "Leave the sample" },
  de: { what: (f) => `Das ist ein Beispiel – eine erfundene Familie: ${f}. Schauen Sie sich um, kaputt machen kann man nichts.`, readonly: "Im Beispiel lässt sich nichts ändern. Um Menschen und Geschichten hinzuzufügen, legen Sie Ihren eigenen Stammbaum an – kostenlos.", start: "Eigenen Stammbaum anlegen", exit: "Beispiel verlassen" },
  fr: { what: (f) => `Ceci est un exemple, une famille inventée : ${f}. Explorez librement, rien ne peut casser.`, readonly: "Rien ne change dans l'exemple. Pour ajouter des personnes et des histoires, créez votre propre arbre — c'est gratuit.", start: "Créer mon arbre", exit: "Quitter l'exemple" },
  it: { what: (f) => `Questo è un esempio, una famiglia immaginaria: ${f}. Guardate pure, non si può rompere nulla.`, readonly: "Nell'esempio non cambia nulla. Per aggiungere persone e storie, create il vostro albero: è gratuito.", start: "Crea il tuo albero", exit: "Esci dall'esempio" },
  es: { what: (f) => `Esto es un ejemplo, una familia inventada: ${f}. Mira todo lo que quieras, aquí no se rompe nada.`, readonly: "En el ejemplo no cambia nada. Para añadir personas e historias, crea tu propio árbol: es gratis.", start: "Crear mi árbol", exit: "Salir del ejemplo" },
};

/** Strip under the app header while a visitor looks at the sample family. */
export default function DemoBanner({ lang, family }: { lang: Lang; family: string }) {
  const t = T[lang] ?? T.en;
  const readonly = useSearchParams().get("readonly") === "1";
  return (
    <div className={`demo-banner${readonly ? " demo-banner-hl" : ""}`} role="status">
      <div className="wrap demo-banner-in">
        <p>{readonly ? t.readonly : t.what(family)}</p>
        <div className="demo-banner-actions">
          <a className="btn btn-primary btn-sm" href={`/demo/exit?start=1&lang=${lang}`}>{t.start}</a>
          <a className="btn btn-ghost btn-sm" href={`/demo/exit?lang=${lang}`}>{t.exit}</a>
        </div>
      </div>
    </div>
  );
}
