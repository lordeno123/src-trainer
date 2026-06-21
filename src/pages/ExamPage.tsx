import { useMemo, useState } from "react";
import { QuestionCard } from "../components/QuestionCard";
import { ProgressBar } from "../components/ProgressBar";
import { applyProgressAnswer } from "../logic/progress";
import { shuffle, shuffleAnswers } from "../logic/shuffle";
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
};

type ExamAnswer = { questionId: number; kind: AnswerKind; answer?: string };

export function ExamPage({
  questions,
  progress,
  settings,
  onProgress,
  onBack,
}: Props) {
  const [amount, setAmount] = useState<number | "all">(
    questions.length >= 20 ? 20 : "all",
  );
  const [examQuestions, setExamQuestions] = useState<Question[]>();
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [finished, setFinished] = useState(false);

  const question = examQuestions?.[position];
  const shuffledAnswers = useMemo(
    () => (question ? shuffleAnswers(question) : []),
    [question, position],
  );

  const start = () => {
    const shuffled = shuffle(questions);
    setExamQuestions(amount === "all" ? shuffled : shuffled.slice(0, amount));
    setAnswers([]);
    setPosition(0);
    setFinished(false);
  };

  const record = (value?: string) => {
    if (!question || !examQuestions) return;
    const kind: AnswerKind =
      value === undefined
        ? "dontKnow"
        : value === question.correctAnswer
          ? "correct"
          : "wrong";
    const nextAnswers = [
      ...answers,
      { questionId: question.id, kind, answer: value },
    ];
    setAnswers(nextAnswers);

    if (position + 1 < examQuestions.length) {
      setPosition(position + 1);
      return;
    }

    if (settings.recordExamResults) {
      const nextProgress = nextAnswers.reduce(
        (state, item) =>
          applyProgressAnswer(state, item.questionId, item.kind),
        progress,
      );
      onProgress(nextProgress);
    }
    setFinished(true);
  };

  if (!examQuestions) {
    return (
      <main className="page">
        <div className="page-toolbar">
          <button className="icon-button" onClick={onBack} aria-label="Zurück">←</button>
          <div>
            <span className="eyebrow">Prüfungsmodus</span>
            <h1>Wie viele Fragen?</h1>
          </div>
        </div>
        <section className="panel">
          <p>
            Während der Prüfung gibt es keine Rückmeldung. Die Auswertung folgt
            erst am Ende.
          </p>
          <div className="choice-grid">
            {[10, 20, 30].map((value) => (
              <button
                key={value}
                className={`choice-chip ${amount === value ? "active" : ""}`}
                onClick={() => setAmount(value)}
                disabled={questions.length < value}
              >
                {value}
              </button>
            ))}
            <button
              className={`choice-chip ${amount === "all" ? "active" : ""}`}
              onClick={() => setAmount("all")}
            >
              Alle ({questions.length})
            </button>
          </div>
          <div className="notice compact">
            Ergebnisse werden {settings.recordExamResults ? "" : "nicht "}
            in deinen Lernfortschritt übernommen.
          </div>
          <button className="button primary full" onClick={start}>
            Prüfung starten
          </button>
        </section>
      </main>
    );
  }

  if (finished) {
    const correct = answers.filter((answer) => answer.kind === "correct").length;
    const wrong = answers.filter((answer) => answer.kind === "wrong");
    const dontKnow = answers.filter((answer) => answer.kind === "dontKnow");
    return (
      <main className="page">
        <div className="page-toolbar">
          <button className="icon-button" onClick={onBack} aria-label="Zurück">←</button>
          <div>
            <span className="eyebrow">Auswertung</span>
            <h1>Prüfung beendet</h1>
          </div>
        </div>
        <section className="score-card">
          <strong>{correct} / {examQuestions.length}</strong>
          <span>richtig beantwortet</span>
          <ProgressBar value={(correct / examQuestions.length) * 100} />
        </section>
        <section className="result-grid">
          <article><strong>{wrong.length}</strong><span>Falsch</span></article>
          <article><strong>{dontKnow.length}</strong><span>Weiß nicht</span></article>
        </section>
        {[...wrong, ...dontKnow].length > 0 && (
          <section className="panel">
            <h2>Noch einmal ansehen</h2>
            <div className="review-list">
              {[...wrong, ...dontKnow].map((item) => {
                const itemQuestion = questions.find((q) => q.id === item.questionId)!;
                return (
                  <article key={item.questionId}>
                    <span className={`status-dot ${item.kind}`} />
                    <div>
                      <strong>Frage {String(item.questionId).padStart(3, "0")}</strong>
                      <p>{itemQuestion.question}</p>
                      <small>Richtig: {itemQuestion.correctAnswer}</small>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        <div className="button-stack">
          <button className="button primary" onClick={start}>Neue Prüfung</button>
          <button className="button secondary" onClick={onBack}>Zur Übersicht</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page learn-page">
      <div className="page-toolbar">
        <button className="icon-button" onClick={onBack} aria-label="Prüfung verlassen">×</button>
        <div>
          <span className="eyebrow">Prüfungsmodus</span>
          <strong>{position + 1} / {examQuestions.length}</strong>
        </div>
      </div>
      <ProgressBar value={(position / examQuestions.length) * 100} />
      {question && (
        <QuestionCard
          question={question}
          answers={shuffledAnswers}
          answered={false}
          showFeedback={false}
          onAnswer={record}
          onDontKnow={() => record()}
        />
      )}
    </main>
  );
}
