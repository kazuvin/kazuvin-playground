import {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline'
import type { NotesByMonth } from '@/lib/types'
import { NoteTimelineItem } from './note-timeline-item'

export interface NotesTimelineProps {
  sortedMonths: [string, NotesByMonth][]
}

/**
 * ノートのタイムライン表示
 * プレゼンテーションコンポーネント - props を受け取って UI を描画
 */
export function NotesTimeline({ sortedMonths }: NotesTimelineProps) {
  return (
    <section className="animation-delay-600 animation-forwards animate-fade-slide-up opacity-0">
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
  )
}
