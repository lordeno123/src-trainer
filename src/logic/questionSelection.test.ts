import { describe, expect, it } from "vitest";
import { SAMPLE_QUESTIONS } from "../data/sampleQuestions";
import type { AppSettings, ProgressMap } from "../types/quiz";
import { filterByTopic, filterUnsafe, selectQuestions } from "./questionSelection";

describe("question selection", () => {
  it("filters unsafe questions", () => {
    const progress: ProgressMap = {
      1: { questionId: 1, correctSinceDontKnow: 2, timesCorrect: 2, timesWrong: 0, timesDontKnow: 0 },
    };
    expect(filterUnsafe(SAMPLE_QUESTIONS, progress).some((q) => q.id === 1)).toBe(false);
  });

  it("filters one topic", () => {
    expect(filterByTopic(SAMPLE_QUESTIONS, "III").map((q) => q.sectionId)).toEqual(["III"]);
  });

  it("sorts by topic and question id", () => {
    const settings: AppSettings = {
      questionOrder: "byTopic",
      learningScope: "all",
      showImmediateFeedback: true,
      recordExamResults: true,
      singleTopicShuffle: false,
    };
    const result = selectQuestions([...SAMPLE_QUESTIONS].reverse(), {}, settings);
    expect(result.map((q) => q.sectionOrder)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
