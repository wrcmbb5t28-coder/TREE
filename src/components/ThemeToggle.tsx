"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const L: Record<string, { book: string; classic: string }> = {
  en: { book: "Book look", classic: "Classic look" },
  ru: { book: "Вид книги", classic: "Классический вид" },
  de: { book: "Buch-Ansicht", classic: "Klassische Ansicht" },
  fr: { book: "Aspect livre", classic: "Aspect classique" },
  it: { book: "Aspetto libro", classic: "Aspetto classico" },
  es: { book: "Aspecto de libro", classic: "Aspecto clásico" },
};

/** A link that switches between the book look and the classic one (kept for a quick rollback). */
export default function ThemeToggle({ lang, className }: { lang: string; className?: string }) {
  const path = usePathname() || "/";
  const [current, setCurrent] = useState<string>("book");
  useEffect(() => setCurrent(document.documentElement.dataset.theme || "book"), []);
  const to = current === "book" ? "classic" : "book";
  const t = L[lang] ?? L.en;
  return (
    <a className={className} href={`/api/theme?to=${to}&back=${encodeURIComponent(path)}`} rel="nofollow">
      {to === "classic" ? t.classic : t.book}
    </a>
  );
}
