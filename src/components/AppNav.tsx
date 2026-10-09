"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HREFS = ["/app", "/app/stories", "/app/family", "/app/journey", "/app/keep", "/app/invite", "/app/settings"] as const;
const KEYS = ["home", "stories", "family", "journey", "keep", "invite", "settings"] as const;

export default function AppNav({ labels }: { labels: Record<(typeof KEYS)[number], string> }) {
  const path = usePathname();
  return (
    <nav className="appnav" aria-label="App">
      {HREFS.map((href, i) => {
        const on = href === "/app" ? path === "/app" : path.startsWith(href);
        return <Link key={href} href={href} aria-current={on ? "page" : undefined}>{labels[KEYS[i]]}</Link>;
      })}
    </nav>
  );
}
