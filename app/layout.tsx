import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

// Serif font for headings - Editorial style
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Sans-serif font for body text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monospace font for code
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Korean serif font for headings
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Korean sans-serif font for body text
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Garden",
  description: "컴퓨터 과학, 인공지능, 소프트웨어 엔지니어링에 대한 기록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${geistSans.variable} ${geistMono.variable} ${notoSerifKR.variable} ${notoSansKR.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
