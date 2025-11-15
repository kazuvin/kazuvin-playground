import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/config";
import { AppHeader } from "./components/shared";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppHeader className="sticky top-0 z-20 mx-16 px-4" />
        <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 px-3 md:pb-24">
          {children}
        </div>
      </body>
    </html>
  );
}
