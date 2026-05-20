import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/i18n/lang-provider";
import { Marquee } from "@/components/layout/marquee";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { getAllTopics } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";

// Self-hosted by next/font at build time — no runtime CDN.
// Note: Bricolage/Space Grotesk/Space Mono on Google Fonts ship Latin only.
// Russian glyphs fall through to system-ui via the CSS variable stack in globals.css.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edu.ninitux.com"),
  title: {
    default: "edu.ninitux ★ Шпаргалка инженера для Middle+",
    template: "%s ★ edu.ninitux",
  },
  description:
    "Шпаргалка для инженеров уровня Middle+: аналогии → концепции → рабочие команды → проверка себя. DevOps, без воды.",
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
      "Аналогии → концепции → рабочие команды → проверка. Без воды.",
    url: "https://edu.ninitux.com",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary",
    title: "edu.ninitux",
    description:
      "Аналогии → концепции → рабочие команды → проверка. Без воды.",
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
  const fontVars = `${bricolage.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`;

  return (
    <html lang="ru" data-lang="ru" suppressHydrationWarning className={fontVars}>
      <body>
        <LangProvider>
          <Marquee />
          <div className="wrap">
            <Topbar topics={topics} categories={CATEGORIES} />
            <main>{children}</main>
            <Footer />
          </div>
        </LangProvider>
      </body>
    </html>
  );
}
