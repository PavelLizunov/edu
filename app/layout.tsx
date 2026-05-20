import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { getAllTopics } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  metadataBase: new URL("https://edu.ninitux.com"),
  title: {
    default: "edu.ninitux — инженерная шпаргалка",
    template: "%s — edu.ninitux",
  },
  description:
    "Шпаргалка для инженеров уровня Middle+: аналогии, концепции, рабочие команды, мини-квизы. DevOps, базы, бэкенд.",
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
    title: "edu.ninitux — инженерная шпаргалка",
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070A14" },
    { media: "(prefers-color-scheme: light)", color: "#FBFCFD" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topics = await getAllTopics();

  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <div className="layout">
            <DesktopSidebar />
            <main className="article">{children}</main>
          </div>
          <MobileBottomNav topics={topics} categories={CATEGORIES} />
        </ThemeProvider>
      </body>
    </html>
  );
}
