import { Geist_Mono, Noto_Sans_JP, Source_Sans_3 } from "next/font/google";
import "./globals.css";

/* Kotoba loads two families: Source Sans 3 for Latin, Noto Sans JP for CJK.
   There are no system-font tokens, so nothing silently falls back to
   SF Pro or Roboto. */
const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans3.variable} ${notoSansJp.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
