import Link from "next/link";
import { LANGS, LANG_LABEL, type Lang, type Dict } from "@/i18n";
import ThemeToggle from "./ThemeToggle";

/** Top navigation for marketing pages. `rest` is the path after the language, e.g. "/questions". */
export function SiteNav({ lang, t, rest = "" }: { lang: Lang; t: Dict; rest?: string }) {
  return (
    <nav className="top" aria-label="Main">
      <Link className="logo" href={`/${lang}`}>
        <b>Treename</b>
        <span>{t.nav.tagline}</span>
      </Link>
      <div className="row">
        <div className="langs" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <a key={l} href={`/${l}${rest}`} hrefLang={l} aria-current={l === lang ? "true" : undefined}>
              {LANG_LABEL[l]}
            </a>
          ))}
        </div>
        <Link className="btn btn-ghost btn-sm" href="/login">{t.nav.login}</Link>
      </div>
    </nav>
  );
}

export function SiteFooter({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <div className="wrap">
      <footer className="site">
        <span>{t.footer.place}</span>
        <span className="row">
          <Link href={`/${lang}/questions`}>{t.footer.questions}</Link>
          <Link href={`/${lang}/privacy`}>{t.footer.privacy}</Link>
          <ThemeToggle lang={lang} />
          <span>EN · DE · FR · IT · ES · RU</span>
        </span>
      </footer>
    </div>
  );
}
