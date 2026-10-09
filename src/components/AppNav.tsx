"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN = [
  ["/app", "home"],
  ["/app/stories", "stories"],
  ["/app/family", "family"],
  ["/app/journey", "journey"],
  ["/app/invite", "invite"],
] as const;

type Labels = Record<"home" | "stories" | "family" | "journey" | "keep" | "invite" | "settings", string>;

/** Main sections in one line; Book & archive and Settings live in the header menu. */
export default function AppNav({ labels }: { labels: Labels }) {
  const path = usePathname();
  return (
    <nav className="appnav" aria-label="App">
      {MAIN.map(([href, key]) => {
        const on = href === "/app" ? path === "/app" : path.startsWith(href);
        return <Link key={href} href={href} aria-current={on ? "page" : undefined}>{labels[key]}</Link>;
      })}
    </nav>
  );
}
