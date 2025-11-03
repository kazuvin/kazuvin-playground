import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesDirectory = path.join(process.cwd(), "content/notes");
const outputPath = path.join(process.cwd(), "app/data/notes.json");

function generateNotesData() {
  if (!fs.existsSync(notesDirectory)) {
    console.warn("Notes directory not found, creating empty notes data");
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    return;
  }

  const fileNames = fs.readdirSync(notesDirectory);
  const notes = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(notesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        metadata: data,
        content,
      };
    })
    .filter((note) => !note.metadata.draft)
    .sort((a, b) => {
      const dateA = new Date(a.metadata.date);
      const dateB = new Date(b.metadata.date);
      return dateB.getTime() - dateA.getTime();
    });

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(notes, null, 2));
  console.log(`✅ Generated notes data: ${notes.length} notes`);
}

generateNotesData();
