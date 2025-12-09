import { describe, it, expect } from "vitest";
import { groupNotesByMonth, sortMonthsDescending } from "./utils";
import type { NoteItem } from "./types";

describe("groupNotesByMonth", () => {
  it("should group notes by month correctly", () => {
    const notes: NoteItem[] = [
      {
        type: "note",
        url: "/notes/note1",
        metadata: {
          title: "Note 1",
          date: "2024-01-15",
          description: "First note",
          tags: ["tag1"],
        },
      },
      {
        type: "note",
        url: "/notes/note2",
        metadata: {
          title: "Note 2",
          date: "2024-01-20",
          description: "Second note",
          tags: ["tag2"],
        },
      },
      {
        type: "note",
        url: "/notes/note3",
        metadata: {
          title: "Note 3",
          date: "2024-02-10",
          description: "Third note",
          tags: ["tag3"],
        },
      },
    ];

    const result = groupNotesByMonth(notes);

    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2024-01"]).toBeDefined();
    expect(result["2024-01"].label).toBe("2024年1月");
    expect(result["2024-01"].notes).toHaveLength(2);
    expect(result["2024-02"]).toBeDefined();
    expect(result["2024-02"].label).toBe("2024年2月");
    expect(result["2024-02"].notes).toHaveLength(1);
  });

  it("should handle empty array", () => {
    const notes: NoteItem[] = [];
    const result = groupNotesByMonth(notes);

    expect(Object.keys(result)).toHaveLength(0);
  });

  it("should handle single note", () => {
    const notes: NoteItem[] = [
      {
        type: "note",
        url: "/notes/note1",
        metadata: {
          title: "Note 1",
          date: "2024-03-15",
          description: "Single note",
          tags: ["tag1"],
        },
      },
    ];

    const result = groupNotesByMonth(notes);

    expect(Object.keys(result)).toHaveLength(1);
    expect(result["2024-03"]).toBeDefined();
    expect(result["2024-03"].label).toBe("2024年3月");
    expect(result["2024-03"].notes).toHaveLength(1);
  });

  it("should pad month numbers with zero", () => {
    const notes: NoteItem[] = [
      {
        type: "note",
        url: "/notes/note1",
        metadata: {
          title: "Note 1",
          date: "2024-09-15",
          description: "September note",
          tags: ["tag1"],
        },
      },
    ];

    const result = groupNotesByMonth(notes);

    expect(result["2024-09"]).toBeDefined();
    expect(result["2024-09"].label).toBe("2024年9月");
  });

  it("should handle notes from different years", () => {
    const notes: NoteItem[] = [
      {
        type: "note",
        url: "/notes/note1",
        metadata: {
          title: "Note 1",
          date: "2023-12-15",
          description: "2023 note",
          tags: ["tag1"],
        },
      },
      {
        type: "note",
        url: "/notes/note2",
        metadata: {
          title: "Note 2",
          date: "2024-01-10",
          description: "2024 note",
          tags: ["tag2"],
        },
      },
    ];

    const result = groupNotesByMonth(notes);

    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2023-12"]).toBeDefined();
    expect(result["2023-12"].label).toBe("2023年12月");
    expect(result["2024-01"]).toBeDefined();
    expect(result["2024-01"].label).toBe("2024年1月");
  });
});

describe("sortMonthsDescending", () => {
  it("should sort months in descending order", () => {
    const notesByMonth = {
      "2024-01": { label: "2024年1月", notes: [] },
      "2024-03": { label: "2024年3月", notes: [] },
      "2024-02": { label: "2024年2月", notes: [] },
    };

    const result = sortMonthsDescending(notesByMonth);

    expect(result).toHaveLength(3);
    expect(result[0][0]).toBe("2024-03");
    expect(result[1][0]).toBe("2024-02");
    expect(result[2][0]).toBe("2024-01");
  });

  it("should handle empty object", () => {
    const notesByMonth = {};
    const result = sortMonthsDescending(notesByMonth);

    expect(result).toHaveLength(0);
  });

  it("should handle single month", () => {
    const notesByMonth = {
      "2024-01": { label: "2024年1月", notes: [] },
    };

    const result = sortMonthsDescending(notesByMonth);

    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe("2024-01");
  });

  it("should sort across different years correctly", () => {
    const notesByMonth = {
      "2023-12": { label: "2023年12月", notes: [] },
      "2024-02": { label: "2024年2月", notes: [] },
      "2024-01": { label: "2024年1月", notes: [] },
      "2023-11": { label: "2023年11月", notes: [] },
    };

    const result = sortMonthsDescending(notesByMonth);

    expect(result).toHaveLength(4);
    expect(result[0][0]).toBe("2024-02");
    expect(result[1][0]).toBe("2024-01");
    expect(result[2][0]).toBe("2023-12");
    expect(result[3][0]).toBe("2023-11");
  });

  it("should preserve note data in sorted result", () => {
    const notes: NoteItem[] = [
      {
        type: "note",
        url: "/notes/note1",
        metadata: {
          title: "Note 1",
          date: "2024-01-15",
          description: "First note",
          tags: ["tag1"],
        },
      },
    ];

    const notesByMonth = {
      "2024-01": { label: "2024年1月", notes },
    };

    const result = sortMonthsDescending(notesByMonth);

    expect(result[0][1].notes).toEqual(notes);
    expect(result[0][1].label).toBe("2024年1月");
  });
});
