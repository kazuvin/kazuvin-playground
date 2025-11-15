import type { Metadata } from "next";
import { PageHeader } from "@/app/components/shared";

export const metadata: Metadata = {
  title: "Playgrounds",
  description: "A collection of playgrounds",
};

export default async function PlaygroundsPage() {
  return (
    <div>
      <PageHeader title="Playgrounds" description="遊び場・実験場" />
    </div>
  );
}
