import type { Question } from "../types/quiz";

type Props = {
  question: Question;
  answers: string[];
  selectedAnswer?: string;
  answered: boolean;
  showFeedback: boolean;
  onAnswer: (answer: string) => void;
  onDontKnow: () => void;
};

export function QuestionCard({
  question,
  answers,
  selectedAnswer,
  answered,
  showFeedback,
  onAnswer,
  onDontKnow,
}: Props) {
  const classFor = (answer: string) => {
    if (!answered || !showFeedback) {
      return selectedAnswer === answer ? "answer selected" : "answer";
    }
    if (answer === question.correctAnswer) return "answer correct";
    if (answer === selectedAnswer) return "answer incorrect";
    return "answer muted";
  };

  return (
    <article className="question-card">
      <div className="question-meta">
        <span>Thema {question.sectionId}</span>
        <span>Frage {String(question.id).padStart(3, "0")}</span>
      </div>
      <h2>{question.question}</h2>
      <div className="answer-list">
        {answers.map((answer, index) => (
          <button
            type="button"
            className={classFor(answer)}
            key={`${index}-${answer}`}
            disabled={answered}
            onClick={() => onAnswer(answer)}
          >
            <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
            <span>{answer}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="button secondary full"
        disabled={answered}
        onClick={onDontKnow}
      >
        Weiß ich nicht
      </button>
    </article>
  );
}
