import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineIndicator,
  TimelineHeader,
  TimelineTitle,
  TimelineContent,
  TimelineSeparator,
  TimelineBody,
} from "@/app/components/ui";
import { NoteTimelineItem } from "../note-timeline-item";

interface NoteMetadata {
  title: string;
  description: string;
  tags: string[];
}

interface NoteItem {
  url: string;
  metadata: NoteMetadata;
}

interface NotesByMonth {
  label: string;
  notes: NoteItem[];
}

export interface NotesTimelineProps {
  sortedMonths: [string, NotesByMonth][];
}

/**
 * ノートのタイムライン表示
 * プレゼンテーションコンポーネント - props を受け取って UI を描画
 */
export function NotesTimeline({ sortedMonths }: NotesTimelineProps) {
  return (
    <section className="animate-fade-slide-up animation-delay-600 animation-forwards opacity-0">
      <Timeline>
        {sortedMonths.map(([monthKey, { label, notes }], index) => (
          <TimelineItem key={monthKey}>
            <TimelineHeader>
              <TimelineIndicator>
                <TimelineDot isCompleted />
              </TimelineIndicator>
              <TimelineTitle>{label}</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <TimelineSeparator>
                {index < sortedMonths.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineBody>
                <div className="flex flex-col gap-2">
                  {notes.map((note) => (
                    <NoteTimelineItem key={note.url} note={note} />
                  ))}
                </div>
              </TimelineBody>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
