import type {
  AppSettings,
  ProgressMap,
  Question,
} from "../types/quiz";
import { isSecure } from "./progress";
import { shuffle } from "./shuffle";

export function filterUnsafe(
  questions: Question[],
  progress: ProgressMap,
): Question[] {
  return questions.filter((question) => !isSecure(progress[question.id]));
}

export function filterByTopic(
  questions: Question[],
  sectionId: string | undefined,
): Question[] {
  if (!sectionId) return [];
  return questions.filter((question) => question.sectionId === sectionId);
}

export function selectQuestions(
  questions: Question[],
  progress: ProgressMap,
  settings: AppSettings,
  random = Math.random,
): Question[] {
  let selected = [...questions];

  if (settings.learningScope === "unsafeOnly") {
    selected = filterUnsafe(selected, progress);
  } else if (settings.learningScope === "wrongOrDontKnowOnly") {
    selected = selected.filter((question) => {
      const item = progress[question.id];
      return (item?.timesWrong ?? 0) > 0 || (item?.timesDontKnow ?? 0) > 0;
    });
  }

  if (settings.questionOrder === "singleTopic") {
    selected = filterByTopic(selected, settings.selectedSectionId);
    return settings.singleTopicShuffle
      ? shuffle(selected, random)
      : selected.sort((a, b) => a.id - b.id);
  }

  if (settings.questionOrder === "byTopic") {
    return selected.sort(
      (a, b) => a.sectionOrder - b.sectionOrder || a.id - b.id,
    );
  }

  return shuffle(selected, random);
}
