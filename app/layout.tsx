import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { A11yProvider } from "../components/Accessibility";
import BottomNav from "../components/BottomNav";
import { LanguageProvider } from "../components/LanguageProvider";

export const viewport: Viewport = {
  themeColor: '#006b5f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Family Grocery List',
  description: 'Shared shopping list for the family',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Grocery' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f9f9f9] text-[#1a1c1c]">
        <LanguageProvider>
          <A11yProvider>
            {children}
            <BottomNav />
          </A11yProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
