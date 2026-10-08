import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/util";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private areas: the app, answer links, family pages, invites, API
        disallow: ["/app", "/a/", "/f/", "/join/", "/api/", "/login"],
      },
    ],
    sitemap: appUrl("/sitemap.xml"),
  };
}
