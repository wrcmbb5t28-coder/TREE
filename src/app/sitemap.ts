import type { MetadataRoute } from "next";
import { LANGS, HREFLANG } from "@/i18n/config";
import { appUrl } from "@/lib/util";

const PATHS = ["", "/questions", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((p) =>
    LANGS.map((lang) => ({
      url: appUrl(`/${lang}${p}`),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [HREFLANG[l], appUrl(`/${l}${p}`)])) },
    }))
  );
}
