import { SECTIONS } from "../data/sections";
import { isSecure } from "../logic/progress";
import type { ProgressMap, Question } from "../types/quiz";
import { ProgressBar } from "./ProgressBar";

type Props = {
  questions: Question[];
  progress: ProgressMap;
};

export function SectionProgress({ questions, progress }: Props) {
  return (
    <div className="section-list">
      {SECTIONS.map((section) => {
        const sectionQuestions = questions.filter(
          (question) => question.sectionId === section.id,
        );
        const secure = sectionQuestions.filter((question) =>
          isSecure(progress[question.id]),
        ).length;
        const percentage = sectionQuestions.length
          ? (secure / sectionQuestions.length) * 100
          : 0;
        return (
          <article className="section-row" key={section.id}>
            <div>
              <span className="eyebrow">
                Thema {section.id} · {section.range}
              </span>
              <h3>{section.title}</h3>
              <p>
                {secure} von {sectionQuestions.length} sicher
              </p>
            </div>
            <ProgressBar value={percentage} />
          </article>
        );
      })}
    </div>
  );
}
