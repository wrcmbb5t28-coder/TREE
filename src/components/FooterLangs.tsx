"use client";

import { usePathname } from "next/navigation";
import { LANGS, LANG_LABEL, isLang } from "@/i18n/config";

/** Language links in the footer: the same page in another language. */
export default function FooterLangs({ lang }: { lang: string }) {
  const path = usePathname() || "/";
  const parts = path.split("/");
  const rest = isLang(parts[1]) ? "/" + parts.slice(2).join("/") : "";
  return (
    <span className="foot-langs" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <span key={l} data-lang={l} className="foot-lang">
          <a href={`/${l}${rest === "/" ? "" : rest}`} hrefLang={l} aria-current={l === lang ? "true" : undefined}>{LANG_LABEL[l]}</a>
        </span>
      ))}
    </span>
  );
}
