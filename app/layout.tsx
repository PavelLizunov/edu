import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/i18n/lang-provider";
import { Marquee } from "@/components/layout/marquee";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { getAllTopics } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";

// Self-hosted by next/font at build time — no runtime CDN.
// Все три шрифта имеют кириллицу (важно для русского контента).
const unbounded = Unbounded({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edu.ninitux.com"),
  title: {
    default: "edu.ninitux ★ Шпаргалка инженера для Middle+",
    template: "%s ★ edu.ninitux",
  },
  description:
    "Шпаргалка для инженеров уровня Middle+: аналогии → концепции → рабочие команды → проверка себя. Личный конспект по DevOps.",
  applicationName: "edu.ninitux",
  authors: [{ name: "Pavel Lizunov", url: "https://ninitux.com" }],
  keywords: [
    "devops",
    "kubernetes",
    "ansible",
    "docker",
    "terraform",
    "postgresql",
    "mongodb",
    "wiki",
    "шпаргалка",
  ],
  openGraph: {
    type: "website",
    siteName: "edu.ninitux",
    title: "edu.ninitux ★ Шпаргалка инженера",
    description:
      "Аналогии → концепции → рабочие команды → проверка. Личный конспект.",
    url: "https://edu.ninitux.com",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary",
    title: "edu.ninitux",
    description:
      "Аналогии → концепции → рабочие команды → проверка. Личный конспект.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFBEC",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topics = await getAllTopics();
  const fontVars = `${unbounded.variable} ${manrope.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="ru" data-lang="ru" suppressHydrationWarning className={fontVars}>
      <body>
        <LangProvider>
          {/* Marquee and Topbar live OUTSIDE .wrap so their backgrounds stretch
              edge-to-edge across the viewport. Each one centers its OWN content
              via an internal .wrap. */}
          <Marquee />
          <Topbar topics={topics} categories={CATEGORIES} />
          <div className="wrap">
            <main>{children}</main>
            <Footer />
          </div>
        </LangProvider>
      </body>
    </html>
  );
}
