import { getNoteSlugs } from "@/lib/notes";

/**
 * すべてのノートスラッグを取得する
 * generateStaticParams で使用
 */
export async function getAllNoteSlugs(): Promise<string[]> {
  return await getNoteSlugs();
}
