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
import notesIndex from "@/public/notes-index.json";
import Link from "next/link";

interface NoteMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

interface NoteItem {
  type: string;
  url: string;
  metadata: NoteMetadata;
}

export default function Home() {
  const notes = notesIndex as NoteItem[];

  const notesByMonth = notes.reduce((acc, note) => {
    const date = new Date(note.metadata.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        label: monthLabel,
        notes: []
      };
    }
    acc[monthKey].notes.push(note);
    return acc;
  }, {} as Record<string, { label: string; notes: NoteItem[] }>);

  const sortedMonths = Object.entries(notesByMonth).sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="space-y-12">
      <div className="space-y-1 leading-7">
        <p className="animate-fade-slide-up animation-forwards opacity-0">
          Hello, my name is Kazuvin.
        </p>
        <p className="animate-fade-slide-up animation-delay-200 animation-forwards opacity-0">
          This is my playground for experimenting with new web technologies
        </p>
        <p className="animate-fade-slide-up animation-delay-400 animation-forwards opacity-0">
          Please take a look around and enjoy your stay!
        </p>
      </div>

      <section className="animate-fade-slide-up animation-delay-600 animation-forwards opacity-0">
        <Timeline>
          {sortedMonths.map(([monthKey, { label, notes: monthNotes }], index) => (
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
                  <div className="space-y-3">
                    {monthNotes.map((note) => (
                      <Link
                        key={note.url}
                        href={note.url}
                        className="block bg-muted rounded-md p-3 hover:bg-muted/80 transition-colors"
                      >
                        <h3 className="font-medium text-sm mb-1">
                          {note.metadata.title}
                        </h3>
                        <p className="text-muted-foreground text-xs mb-2">
                          {note.metadata.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {note.metadata.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-background text-muted-foreground px-2 py-0.5 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </TimelineBody>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </section>
    </div>
  );
}
