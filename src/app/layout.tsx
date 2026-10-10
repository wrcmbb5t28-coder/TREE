import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource/spectral/400.css";
import "@fontsource/spectral/400-italic.css";
import "@fontsource/spectral/500.css";
import "@fontsource/spectral/500-italic.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/caveat/500.css";
import "./globals.css";
import { appUrl } from "@/lib/util";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: { default: "Treename", template: "%s" },
  applicationName: "Treename",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF6EE",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = (await headers()).get("x-tn-lang") || "en";
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
