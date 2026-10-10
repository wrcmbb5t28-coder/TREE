"use client";

import { useSearchParams } from "next/navigation";
import type { Lang } from "@/i18n/config";

const T: Record<Lang, { what: string; readonly: string; start: string; exit: string }> = {
  ru: { what: "Это пример: семья Мюллеров, 15 поколений от мельницы под Берном до Цуга. Смотрите всё, что хотите, сломать ничего нельзя.", readonly: "В примере ничего не меняется. Чтобы добавлять людей и истории, заведите своё древо — это бесплатно.", start: "Создать своё древо", exit: "Выйти из примера" },
  en: { what: "This is a sample: the Müller family, 15 generations from a mill near Bern to Zug. Look around, nothing here can break.", readonly: "Nothing changes in the sample. To add people and stories, start your own tree — it's free.", start: "Start your own tree", exit: "Leave the sample" },
  de: { what: "Das ist ein Beispiel: Familie Müller, 15 Generationen von einer Mühle bei Bern bis nach Zug. Schauen Sie sich um, kaputt machen kann man nichts.", readonly: "Im Beispiel lässt sich nichts ändern. Um Menschen und Geschichten hinzuzufügen, legen Sie Ihren eigenen Stammbaum an – kostenlos.", start: "Eigenen Stammbaum anlegen", exit: "Beispiel verlassen" },
  fr: { what: "Ceci est un exemple : la famille Müller, 15 générations, d'un moulin près de Berne jusqu'à Zoug. Explorez librement, rien ne peut casser.", readonly: "Rien ne change dans l'exemple. Pour ajouter des personnes et des histoires, créez votre propre arbre — c'est gratuit.", start: "Créer mon arbre", exit: "Quitter l'exemple" },
  it: { what: "Questo è un esempio: la famiglia Müller, 15 generazioni da un mulino vicino a Berna fino a Zugo. Guardate pure, non si può rompere nulla.", readonly: "Nell'esempio non cambia nulla. Per aggiungere persone e storie, create il vostro albero: è gratuito.", start: "Crea il tuo albero", exit: "Esci dall'esempio" },
  es: { what: "Esto es un ejemplo: la familia Müller, 15 generaciones desde un molino cerca de Berna hasta Zug. Mira todo lo que quieras, aquí no se rompe nada.", readonly: "En el ejemplo no cambia nada. Para añadir personas e historias, crea tu propio árbol: es gratis.", start: "Crear mi árbol", exit: "Salir del ejemplo" },
};

/** Strip under the app header while a visitor looks at the sample family. */
export default function DemoBanner({ lang }: { lang: Lang }) {
  const t = T[lang] ?? T.en;
  const readonly = useSearchParams().get("readonly") === "1";
  return (
    <div className={`demo-banner${readonly ? " demo-banner-hl" : ""}`} role="status">
      <div className="wrap demo-banner-in">
        <p>{readonly ? t.readonly : t.what}</p>
        <div className="demo-banner-actions">
          <a className="btn btn-primary btn-sm" href={`/demo/exit?start=1&lang=${lang}`}>{t.start}</a>
          <a className="btn btn-ghost btn-sm" href={`/demo/exit?lang=${lang}`}>{t.exit}</a>
        </div>
      </div>
    </div>
  );
}
