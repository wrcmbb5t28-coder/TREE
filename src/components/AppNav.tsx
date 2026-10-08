"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/app", label: "Home" },
  { href: "/app/stories", label: "Stories" },
  { href: "/app/family", label: "Family" },
  { href: "/app/journey", label: "Journey" },
  { href: "/app/keep", label: "Keep" },
  { href: "/app/invite", label: "Invite" },
  { href: "/app/settings", label: "Settings" },
];

export default function AppNav() {
  const path = usePathname();
  return (
    <nav className="appnav" aria-label="App">
      {ITEMS.map((i) => {
        const on = i.href === "/app" ? path === "/app" : path.startsWith(i.href);
        return <Link key={i.href} href={i.href} aria-current={on ? "page" : undefined}>{i.label}</Link>;
      })}
    </nav>
  );
}
