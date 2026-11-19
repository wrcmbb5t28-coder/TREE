import type { MetadataRoute } from "next";
import { LANGS, HREFLANG } from "@/i18n/config";
import { appUrl } from "@/lib/util";

const PATHS = ["", "/questions", "/privacy", "/imprint"];

// Russian pages are hidden and redirected for visitors from the EU and Switzerland
// (see middleware), so they are left out of the sitemap to avoid redirecting URLs.
const SITEMAP_LANGS = LANGS.filter((l) => l !== "ru");

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((p) =>
    SITEMAP_LANGS.map((lang) => ({
      url: appUrl(`/${lang}${p}`),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(SITEMAP_LANGS.map((l) => [HREFLANG[l], appUrl(`/${l}${p}`)])) },
    }))
  );
}
