import { describe, expect, it } from "vitest";
import { SAMPLE_QUESTIONS } from "../data/sampleQuestions";
import { shuffleAnswers } from "./shuffle";

describe("answer shuffling", () => {
  it("keeps the correct answer identity", () => {
    const question = SAMPLE_QUESTIONS[0];
    const answers = shuffleAnswers(question, () => 0);
    expect(answers).toHaveLength(4);
    expect(answers).toContain(question.correctAnswer);
    expect(new Set(answers)).toEqual(new Set(question.answers));
  });
});
