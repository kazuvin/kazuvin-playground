import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-6 mb-3 text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href || "#"}
        className="text-blue-600 hover:underline dark:text-blue-400"
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
      <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-gray-600 italic dark:border-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:bg-gray-800 dark:text-pink-400">
            {children}
          </code>
        );
      }
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100">
        {children}
      </pre>
    ),
    img: ({ src, alt }) => (
      <span className="my-6 block">
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
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold dark:border-gray-600 dark:bg-gray-800">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
        {children}
      </td>
    ),
    ...components,
  };
}
