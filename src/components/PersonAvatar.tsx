import { avatarById, type AvatarPreset } from "@/lib/avatars";

type P = { firstName: string; lastName?: string | null; photoPath?: string | null; avatar?: string | null };

/** Round picture of a person: their photo, else the chosen preset, else initials. */
export default function PersonAvatar({ person, size = 48 }: { person: P; size?: number }) {
  const style = { width: size, height: size, borderRadius: "50%", flex: "none" } as const;
  if (person.photoPath) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/api/files/${person.photoPath}`} alt="" width={size} height={size} loading="lazy" style={{ ...style, objectFit: "cover", background: "var(--tint)" }} />;
  }
  const preset = avatarById(person.avatar);
  if (preset) return <PresetAvatar preset={preset} size={size} />;
  const initials = ((person.firstName?.[0] ?? "") + (person.lastName?.[0] ?? "")).toUpperCase() || "?";
  return (
    <span aria-hidden style={{ ...style, display: "inline-grid", placeItems: "center", background: "var(--tint)", color: "var(--accent)", fontFamily: "var(--display)", fontWeight: 600, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}

export function PresetAvatar({ preset, size = 48 }: { preset: AvatarPreset; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden style={{ flex: "none", borderRadius: "50%" }}>
      <circle cx="24" cy="24" r="24" fill={preset.bg} />
      <g transform="translate(12 12)">
        <path d={preset.d} fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
