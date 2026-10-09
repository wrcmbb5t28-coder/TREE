"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Header menu: family name, Book & archive, Settings, upgrade and the language switcher. */
export default function AppMenu({
  label,
  familyName,
  links,
  children,
}: {
  label: string;
  familyName: string;
  links: { href: string; label: string; accent?: boolean }[];
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <div className="appmenu" ref={box}>
      <button type="button" className="appmenu-btn" aria-expanded={open} aria-label={label} title={label} onClick={() => setOpen((v) => !v)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {open && (
        <div className="appmenu-panel" role="menu">
          <p className="appmenu-family">{familyName}</p>
          {links.map((l) => (
            <Link key={l.href} href={l.href} role="menuitem" className={l.accent ? "is-accent" : undefined} aria-current={path.startsWith(l.href) ? "page" : undefined}>{l.label}</Link>
          ))}
          {children && <div className="appmenu-extra">{children}</div>}
        </div>
      )}
    </div>
  );
}
