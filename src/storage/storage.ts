import type {
  AppSettings,
  ProgressMap,
  Question,
} from "../types/quiz";

const KEYS = {
  questions: "src-trainer.questions.v1",
  progress: "src-trainer.progress.v1",
  settings: "src-trainer.settings.v1",
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  questionOrder: "allMixed",
  learningScope: "unsafeOnly",
  showImmediateFeedback: true,
  recordExamResults: true,
  singleTopicShuffle: true,
};

export interface QuizStorage {
  loadQuestions(): Question[] | null;
  saveQuestions(questions: Question[]): void;
  deleteQuestions(): void;
  loadProgress(): ProgressMap;
  saveProgress(progress: ProgressMap): void;
  clearProgress(): void;
  loadSettings(): AppSettings;
  saveSettings(settings: AppSettings): void;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const browserStorage: QuizStorage = {
  loadQuestions: () => readJson<Question[] | null>(KEYS.questions, null),
  saveQuestions: (questions) =>
    localStorage.setItem(KEYS.questions, JSON.stringify(questions)),
  deleteQuestions: () => localStorage.removeItem(KEYS.questions),
  loadProgress: () => readJson<ProgressMap>(KEYS.progress, {}),
  saveProgress: (progress) =>
    localStorage.setItem(KEYS.progress, JSON.stringify(progress)),
  clearProgress: () => localStorage.removeItem(KEYS.progress),
  loadSettings: () => ({
    ...DEFAULT_SETTINGS,
    ...readJson<Partial<AppSettings>>(KEYS.settings, {}),
  }),
  saveSettings: (settings) =>
    localStorage.setItem(KEYS.settings, JSON.stringify(settings)),
};
