import { useMemo, useState } from "react";
import { QuestionCard } from "../components/QuestionCard";
import { ProgressBar } from "../components/ProgressBar";
import { applyProgressAnswer, isSecure } from "../logic/progress";
import { selectQuestions } from "../logic/questionSelection";
import { shuffleAnswers } from "../logic/shuffle";
import type {
  AnswerKind,
  AppSettings,
  ProgressMap,
  Question,
} from "../types/quiz";

type Props = {
  questions: Question[];
  progress: ProgressMap;
  settings: AppSettings;
  onProgress: (progress: ProgressMap) => void;
  onBack: () => void;
  onShowAll: () => void;
};

export function LearnPage({
  questions,
  progress,
  settings,
  onProgress,
  onBack,
  onShowAll,
}: Props) {
  const [queue, setQueue] = useState(() =>
    selectQuestions(questions, progress, settings).map((question) => question.id),
  );
  const [position, setPosition] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [answerKind, setAnswerKind] = useState<AnswerKind>();
  const [currentProgress, setCurrentProgress] = useState(progress);

  const currentId = queue[position];
  const question = questions.find((item) => item.id === currentId);
  const answers = useMemo(
    () => (question ? shuffleAnswers(question) : []),
    [question, position],
  );

  const answer = (value?: string) => {
    if (!question || answerKind) return;
    const kind: AnswerKind =
      value === undefined
        ? "dontKnow"
        : value === question.correctAnswer
          ? "correct"
          : "wrong";
    const next = applyProgressAnswer(currentProgress, question.id, kind);
    setSelectedAnswer(value);
    setAnswerKind(kind);
    setCurrentProgress(next);
    onProgress(next);
  };

  const nextQuestion = () => {
    if (!question || !answerKind) return;
    if (!isSecure(currentProgress[question.id])) {
      setQueue((items) => [...items, question.id]);
    }
    setPosition((value) => value + 1);
    setSelectedAnswer(undefined);
    setAnswerKind(undefined);
  };

  if (!question) {
    const allSecure = questions.every((item) => isSecure(currentProgress[item.id]));
    return (
      <main className="page centered-page">
        <section className="completion-card">
          <span className="completion-mark">{allSecure ? "✓" : "↻"}</span>
          <span className="eyebrow">Lerneinheit beendet</span>
          <h1>{allSecure ? "Alle Fragen sind sicher." : "Auswahl abgeschlossen."}</h1>
          <p>
            {allSecure
              ? "Stark. Du hast jede Frage seit dem letzten Fehler mindestens zweimal richtig beantwortet."
              : "Für diesen Lernumfang sind aktuell keine weiteren Fragen vorhanden."}
          </p>
          <div className="button-stack">
            <button
              className="button primary"
              onClick={() => {
                setQueue(selectQuestions(questions, currentProgress, settings).map((q) => q.id));
                setPosition(0);
              }}
            >
              Auswahl neu starten
            </button>
            <button className="button secondary" onClick={onShowAll}>
              Mit allen Fragen lernen
            </button>
            <button className="text-button" onClick={onBack}>
              Zur Übersicht
            </button>
          </div>
        </section>
      </main>
    );
  }

  const completed = Math.min(position, queue.length);
  const feedbackText =
    answerKind === "correct"
      ? "Richtig – ein Schritt näher an „sicher“."
      : answerKind === "wrong"
        ? "Leider falsch. Der Sicherheitszähler wurde zurückgesetzt."
        : "Kein Problem. Die Frage kommt wieder.";

  return (
    <main className="page learn-page">
      <div className="page-toolbar">
        <button className="icon-button" onClick={onBack} aria-label="Zurück">
          ←
        </button>
        <div>
          <span className="eyebrow">Lernmodus</span>
          <strong>
            {position + 1} / {queue.length}
          </strong>
        </div>
      </div>
      <ProgressBar value={(completed / Math.max(queue.length, 1)) * 100} />
      <QuestionCard
        question={question}
        answers={answers}
        selectedAnswer={selectedAnswer}
        answered={Boolean(answerKind)}
        showFeedback={settings.showImmediateFeedback}
        onAnswer={answer}
        onDontKnow={() => answer()}
      />
      {answerKind && (
        <section
          className={`feedback ${settings.showImmediateFeedback ? answerKind : "neutral"}`}
          aria-live="polite"
        >
          <strong>
            {settings.showImmediateFeedback ? feedbackText : "Antwort gespeichert."}
          </strong>
          {settings.showImmediateFeedback && answerKind !== "correct" && (
            <p>Richtig ist: {question.correctAnswer}</p>
          )}
          <button className="button primary full" onClick={nextQuestion} autoFocus>
            Nächste Frage
          </button>
        </section>
      )}
    </main>
  );
}
