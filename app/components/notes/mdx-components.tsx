import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <Link
      href={href || "#"}
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="my-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    <span className="block my-6">
      <Image
        src={src || ""}
        alt={alt || ""}
        width={800}
        height={400}
        className="rounded-lg"
      />
    </span>
  ),
  hr: () => <hr className="my-8 border-gray-300 dark:border-gray-600" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
      {children}
    </td>
  ),
};
