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
} from "@/components/ui";
import { NoteTimelineItem } from "../note-timeline-item";
import type { NotesByMonth } from "@/lib/types";

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
