"use client";

import { useRouter } from "next/navigation";

/** Choosing the storyteller reloads the page so the questions fit that person. */
export default function StorytellerSelect({ people, value }: { people: { id: string; label: string }[]; value: string }) {
  const router = useRouter();
  return (
    <select id="storytellerId" name="storytellerId" defaultValue={value}
      onChange={(e) => router.replace(`/app/ask?to=${e.target.value}`, { scroll: false })}>
      {people.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
    </select>
  );
}
