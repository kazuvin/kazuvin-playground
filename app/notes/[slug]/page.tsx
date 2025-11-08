import { getNoteSlugs } from "@/lib/notes";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Note } = await import(`@/content/notes/${slug}.mdx`);

  return (
    <article>
      <Note />
    </article>
  );
}

export async function generateStaticParams() {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
