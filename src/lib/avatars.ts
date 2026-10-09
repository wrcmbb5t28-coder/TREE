/**
 * Preset avatars for people without a photo: a calm symbol on a colour,
 * so a family can pick something that fits the person (a tree for the
 * founder of the family, waves for a sailor, a book for a teacher...).
 * Icons are simple stroke paths in a 24×24 box.
 */
export type AvatarPreset = { id: string; label: string; bg: string; d: string };

export const AVATARS: AvatarPreset[] = [
  { id: "tree", label: "Tree", bg: "#2F6B5E", d: "M12 21v-7M7 9a5 5 0 1 0 10 0a5 5 0 1 0-10 0" },
  { id: "leaf", label: "Leaf", bg: "#5E7A3A", d: "M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l8-8" },
  { id: "flower", label: "Flower", bg: "#9C4F5A", d: "M10 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0M9 7a3 3 0 1 0 6 0a3 3 0 1 0-6 0M14 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0M9 17a3 3 0 1 0 6 0a3 3 0 1 0-6 0M4 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0" },
  { id: "sun", label: "Sun", bg: "#B4774A", d: "M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" },
  { id: "moon", label: "Moon", bg: "#3F5E6B", d: "M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z" },
  { id: "mountain", label: "Mountains", bg: "#4F6D8F", d: "M3 19l6-10 4 6 2-3 6 7z" },
  { id: "wave", label: "Sea", bg: "#4D7F7A", d: "M3 9c3-3 6 3 9 0s6 3 9 0M3 14c3-3 6 3 9 0s6 3 9 0M3 19c3-3 6 3 9 0s6 3 9 0" },
  { id: "star", label: "Star", bg: "#8C6A2F", d: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5l-5.3 2.9 1.2-6-4.5-4.1 6-.7z" },
  { id: "home", label: "Home", bg: "#8A5A44", d: "M4 11l8-7 8 7v9h-5v-6H9v6H4z" },
  { id: "book", label: "Book", bg: "#7A5C8E", d: "M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z" },
  { id: "music", label: "Music", bg: "#6B6B4F", d: "M9 18V6l10-2v12M5 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0M15 16a2 2 0 1 0 4 0a2 2 0 1 0-4 0" },
  { id: "anchor", label: "Anchor", bg: "#A0663A", d: "M12 7v13M8 11h8M5 14a7 7 0 0 0 14 0M10 5a2 2 0 1 0 4 0a2 2 0 1 0-4 0" },
];

export const avatarById = (id?: string | null) => AVATARS.find((a) => a.id === id);
