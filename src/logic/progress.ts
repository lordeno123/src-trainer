import type {
  AnswerKind,
  ProgressMap,
  QuestionProgress,
} from "../types/quiz";

export function isSecure(progress: QuestionProgress | undefined): boolean {
  return (progress?.correctSinceDontKnow ?? 0) >= 2;
}

export function createEmptyProgress(questionId: number): QuestionProgress {
  return {
    questionId,
    correctSinceDontKnow: 0,
    timesCorrect: 0,
    timesWrong: 0,
    timesDontKnow: 0,
  };
}

export function updateProgress(
  current: QuestionProgress | undefined,
  questionId: number,
  answer: AnswerKind,
  now = new Date().toISOString(),
): QuestionProgress {
  const progress = current ?? createEmptyProgress(questionId);

  if (answer === "correct") {
    return {
      ...progress,
      correctSinceDontKnow: progress.correctSinceDontKnow + 1,
      timesCorrect: progress.timesCorrect + 1,
      lastAnsweredAt: now,
    };
  }

  if (answer === "wrong") {
    return {
      ...progress,
      correctSinceDontKnow: 0,
      timesWrong: progress.timesWrong + 1,
      lastAnsweredAt: now,
    };
  }

  return {
    ...progress,
    correctSinceDontKnow: 0,
    timesDontKnow: progress.timesDontKnow + 1,
    lastDontKnowAt: now,
    lastAnsweredAt: now,
  };
}

export function applyProgressAnswer(
  progress: ProgressMap,
  questionId: number,
  answer: AnswerKind,
  now?: string,
): ProgressMap {
  return {
    ...progress,
    [questionId]: updateProgress(progress[questionId], questionId, answer, now),
  };
}
