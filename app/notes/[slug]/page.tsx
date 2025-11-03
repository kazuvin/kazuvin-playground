import { getNoteBySlug, getNoteSlugs } from "@/lib/notes";
import { mdxComponents } from "@/app/components/notes/mdx-components";
import { formatDate } from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface NotePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  return {
    title: note.metadata.title,
    description: note.metadata.description,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const formattedDate = formatDate(note.metadata.date);

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {note.metadata.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <time dateTime={note.metadata.date}>{formattedDate}</time>
          {note.metadata.tags && note.metadata.tags.length > 0 && (
            <div className="flex gap-2">
              {note.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote
          source={note.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </div>
    </article>
  );
}
