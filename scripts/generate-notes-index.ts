import { getAllNoteMetadata } from "../lib/notes";
import fs from "fs/promises";
import path from "path";
import type { SearchableItem } from "../lib/types";

/**
 * ビルド時にノートのインデックスをJSONとして生成
 * CDNから配信できるように public ディレクトリに出力
 */
async function generateNotesIndex() {
  console.log("📝 Generating notes index...");

  try {
    const notes = await getAllNoteMetadata();

    // SearchableItem形式に変換
    const searchableItems: SearchableItem[] = notes.map((note) => ({
      type: "note",
      url: `/notes/${note.slug}`,
      metadata: {
        title: note.metadata.title,
        date: note.metadata.date,
        description: note.metadata.description,
        tags: note.metadata.tags,
      },
    }));

    // public ディレクトリに出力
    const outputDir = path.join(process.cwd(), "public");
    const outputPath = path.join(outputDir, "notes-index.json");

    // public ディレクトリがなければ作成
    await fs.mkdir(outputDir, { recursive: true });

    // JSONファイルとして書き出し
    await fs.writeFile(
      outputPath,
      JSON.stringify(searchableItems, null, 2),
      "utf-8"
    );

    console.log(
      `✅ Generated ${searchableItems.length} notes to ${outputPath}`
    );
  } catch (error) {
    console.error("❌ Error generating notes index:", error);
    process.exit(1);
  }
}

generateNotesIndex();
