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
import "@fontsource/caveat/700.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/400-italic.css";
import "@fontsource/lora/500.css";
import "@fontsource/lora/600.css";
import "@fontsource/literata/500.css";
import "@fontsource/literata/600.css";
import "@fontsource/literata/700.css";
import "@fontsource/literata/500-italic.css";
import "@fontsource/golos-text/400.css";
import "@fontsource/golos-text/500.css";
import "@fontsource/golos-text/600.css";
import "@fontsource/golos-text/700.css";
import "@fontsource/pangolin/400.css";
import "./globals.css";
import "./book.css";
import "./comic.css";
import { appUrl } from "@/lib/util";
import { DEFAULT_THEME, THEME_COOKIE } from "@/lib/theme";
import SmartCrop from "@/components/SmartCrop";

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
    <html lang={lang} data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        {/* The look chosen in this browser (comic, book or classic), applied before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: `try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(comic|book|classic)/);if(m)document.documentElement.dataset.theme=m[1]}catch(e){}` }} />
      </head>
      <body>{children}<SmartCrop /></body>
    </html>
  );
}
