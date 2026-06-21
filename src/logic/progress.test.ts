import { describe, expect, it } from "vitest";
import { isSecure, updateProgress } from "./progress";

describe("progress rules", () => {
  it("marks a question secure after two correct answers", () => {
    const once = updateProgress(undefined, 1, "correct", "2026-01-01");
    const twice = updateProgress(once, 1, "correct", "2026-01-02");
    expect(isSecure(once)).toBe(false);
    expect(isSecure(twice)).toBe(true);
    expect(twice.timesCorrect).toBe(2);
  });

  it("resets the secure counter after a wrong answer", () => {
    const progress = updateProgress(
      { questionId: 1, correctSinceDontKnow: 2, timesCorrect: 2, timesWrong: 0, timesDontKnow: 0 },
      1,
      "wrong",
      "2026-01-03",
    );
    expect(progress.correctSinceDontKnow).toBe(0);
    expect(progress.timesWrong).toBe(1);
    expect(isSecure(progress)).toBe(false);
  });

  it("resets the counter and records weiß nicht", () => {
    const progress = updateProgress(
      { questionId: 1, correctSinceDontKnow: 1, timesCorrect: 1, timesWrong: 0, timesDontKnow: 0 },
      1,
      "dontKnow",
      "2026-01-04",
    );
    expect(progress.correctSinceDontKnow).toBe(0);
    expect(progress.timesDontKnow).toBe(1);
    expect(progress.lastDontKnowAt).toBe("2026-01-04");
  });
});
