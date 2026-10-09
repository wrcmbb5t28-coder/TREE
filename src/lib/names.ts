type P = { id: string; firstName: string; lastName?: string | null; birthYear?: number | null };

/**
 * Short names that tell people apart: just the first name when it is unique in the family,
 * otherwise "Elena Ivanova", and if that still repeats, "Elena (1989)".
 */
export function distinctNames(people: P[]): Map<string, string> {
  const count = (key: (p: P) => string) => {
    const m = new Map<string, number>();
    for (const p of people) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
    return m;
  };
  const first = count((p) => p.firstName.trim().toLowerCase());
  const full = count((p) => `${p.firstName} ${p.lastName ?? ""}`.trim().toLowerCase());
  const out = new Map<string, string>();
  for (const p of people) {
    if (first.get(p.firstName.trim().toLowerCase()) === 1) { out.set(p.id, p.firstName); continue; }
    const fn = `${p.firstName} ${p.lastName ?? ""}`.trim();
    if (p.lastName && full.get(fn.toLowerCase()) === 1) { out.set(p.id, fn); continue; }
    out.set(p.id, p.birthYear ? `${fn} (${p.birthYear})` : fn);
  }
  return out;
}
