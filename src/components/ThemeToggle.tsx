"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const L: Record<string, { comic: string; book: string }> = {
  en: { comic: "New look", book: "Previous look" },
  ru: { comic: "Новый вид", book: "Прежний вид" },
  de: { comic: "Neue Ansicht", book: "Bisherige Ansicht" },
  fr: { comic: "Nouvel aspect", book: "Aspect précédent" },
  it: { comic: "Nuovo aspetto", book: "Aspetto precedente" },
  es: { comic: "Aspecto nuevo", book: "Aspecto anterior" },
};

/** A link that switches between the new look and the previous one (kept for a quick rollback). */
export default function ThemeToggle({ lang, className }: { lang: string; className?: string }) {
  const path = usePathname() || "/";
  const [current, setCurrent] = useState<string>("comic");
  useEffect(() => setCurrent(document.documentElement.dataset.theme || "comic"), []);
  const to = current === "comic" ? "book" : "comic";
  const t = L[lang] ?? L.en;
  return (
    <a className={className} href={`/api/theme?to=${to}&back=${encodeURIComponent(path)}`} rel="nofollow">
      {to === "comic" ? t.comic : t.book}
    </a>
  );
}
