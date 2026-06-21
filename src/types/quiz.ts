export type Question = {
  id: number;
  sectionId: string;
  sectionOrder: number;
  sectionTitle: string;
  question: string;
  answers: string[];
  correctAnswer: string;
};

export type QuestionProgress = {
  questionId: number;
  correctSinceDontKnow: number;
  timesCorrect: number;
  timesWrong: number;
  timesDontKnow: number;
  lastAnsweredAt?: string;
  lastDontKnowAt?: string;
};

export type AppSettings = {
  questionOrder: "allMixed" | "byTopic" | "singleTopic";
  selectedSectionId?: string;
  learningScope: "all" | "unsafeOnly" | "wrongOrDontKnowOnly";
  showImmediateFeedback: boolean;
  recordExamResults: boolean;
  singleTopicShuffle: boolean;
};

export type AnswerKind = "correct" | "wrong" | "dontKnow";

export type ProgressMap = Record<number, QuestionProgress>;

export type Page =
  | "dashboard"
  | "learn"
  | "exam"
  | "settings"
  | "importExport";
