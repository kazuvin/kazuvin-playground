import { Hero, NotesTimeline } from "@/app/components/home";
import { getNotes } from "./actions";
import { groupNotesByMonth, sortMonthsDescending } from "./utils";

export default async function Home() {
  const notes = await getNotes();
  const notesByMonth = groupNotesByMonth(notes);
  const sortedMonths = sortMonthsDescending(notesByMonth);

  return (
    <div className="space-y-12">
      <Hero />
      <NotesTimeline sortedMonths={sortedMonths} />
    </div>
  );
}
