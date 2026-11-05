"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-renders the current page every few seconds while something runs on the server. */
export default function AutoRefresh({ everyMs = 6000 }: { everyMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), everyMs);
    return () => clearInterval(id);
  }, [router, everyMs]);
  return null;
}
