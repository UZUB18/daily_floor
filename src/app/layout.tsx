import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daily Floor | Your Minimum Momentum",
  description: "Make daily consistency effortless with a small, non-negotiable minimum workout. 3-5 minutes to keep the streak alive.",
  keywords: ["workout", "fitness", "daily", "streak", "minimal", "exercise"],
  authors: [{ name: "Daily Floor" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Floor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#33057F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <main className="safe-top safe-bottom">
          {children}
        </main>
      </body>
    </html>
  );
}
