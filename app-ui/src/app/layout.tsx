import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AuthContextProvider } from "@/components/layout/AuthContext";
import { AuthHeaderWrapper } from "@/components/layout/AuthHeaderWrapper";

const displayFont = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worldcraftery UI",
  description:
    "A fantasy-inspired interface for crafting worlds, characters, quests, and artifacts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} antialiased`}
      >
        <div className="relative min-h-screen">
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(148,163,246,0.22),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(192,132,252,0.28),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(251,146,169,0.16),transparent_50%)]"
          />
          <div className="relative z-10 flex min-h-screen flex-col">
            <AuthContextProvider>
              <AuthHeaderWrapper />
              <main className="mt-5">{children}</main>
            </AuthContextProvider>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
