import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/config";
import { AppHeader } from "../components/shared";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader className="sticky top-0 z-20 mx-16 px-4" />
      <main className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 px-3 md:pb-24">
        {children}
      </main>
    </>
  );
}
