import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";

interface NoteMetadata {
  title: string;
  description: string;
  tags: string[];
}

interface NoteItem {
  url: string;
  metadata: NoteMetadata;
}

export interface NoteTimelineItemProps {
  note: NoteItem;
}

/**
 * タイムライン内の個別のノートカード
 * プレゼンテーションコンポーネント - props を受け取って UI を描画
 */
export function NoteTimelineItem({ note }: NoteTimelineItemProps) {
  return (
    <Link href={note.url}>
      <Card className="hover:bg-accent transition-colors">
        <CardHeader>
          <CardTitle className="text-sm">{note.metadata.title}</CardTitle>
          <CardDescription className="text-xs">
            {note.metadata.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {note.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
