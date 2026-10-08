import { ImageResponse } from "next/og";
import { getDict, LANGS } from "@/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

/** Social preview for WhatsApp, Facebook, LinkedIn etc. — one per language. */
export default async function OG({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F4F6F1", padding: 72, color: "#1B2523" }}>
        <div style={{ fontSize: 40, fontFamily: "serif" }}>Treename</div>
        <div style={{ fontSize: 72, lineHeight: 1.1, fontFamily: "serif", maxWidth: 980 }}>{t.hero.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {Array.from({ length: 28 }, (_, i) => (
              <div key={i} style={{ width: 8, height: 16 + ((i * 37) % 44), background: "#B06F22", borderRadius: 4 }} />
            ))}
          </div>
          <div style={{ fontSize: 28, color: "#58645F", marginLeft: 16 }}>{t.nav.tagline}</div>
        </div>
      </div>
    ),
    size
  );
}
