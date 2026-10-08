import en, { type Dict } from "./en";
import de from "./de";
import fr from "./fr";
import it from "./it";
import es from "./es";
import ru from "./ru";
import { type Lang, isLang, DEFAULT_LANG } from "./config";
import { applyRegion } from "./region";

const DICTS: Record<Lang, Dict> = { en, de, fr, it, es, ru };

export function getDict(lang: string | undefined | null): Dict {
  const l = isLang(lang) ? lang : DEFAULT_LANG;
  return applyRegion(DICTS[l], l);
}

/** Replace {placeholders} in a string. */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export type { Dict };
export * from "./config";
