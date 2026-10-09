"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LANGS, LANG_LABEL, LANG_NAME, type Lang } from "@/i18n/config";

/** Interface language for the signed-in person (saved on their account). */
export default function LangSwitch({ value, label, action }: { value: Lang; label: string; action: (lang: string) => Promise<void> }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <select
      aria-label={label}
      title={label}
      className="lang-switch"
      value={value}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value;
        start(async () => {
          try {
            await action(v);
          } catch {
            window.location.reload();
            return;
          }
          router.refresh();
        });
      }}
    >
      {LANGS.map((l) => <option key={l} value={l} title={LANG_NAME[l]}>{LANG_LABEL[l]}</option>)}
    </select>
  );
}
