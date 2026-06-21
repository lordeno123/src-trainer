import { ProgressBar } from "../components/ProgressBar";
import { SectionProgress } from "../components/SectionProgress";
import { isSecure } from "../logic/progress";
import type { Page, ProgressMap, Question } from "../types/quiz";

type Props = {
  questions: Question[];
  progress: ProgressMap;
  usingSample: boolean;
  navigate: (page: Page) => void;
};

export function DashboardPage({
  questions,
  progress,
  usingSample,
  navigate,
}: Props) {
  const secure = questions.filter((question) =>
    isSecure(progress[question.id]),
  ).length;
  const unsafe = questions.length - secure;
  const percentage = questions.length ? (secure / questions.length) * 100 : 0;

  return (
    <main className="page dashboard">
      <section className="hero">
        <div>
          <span className="eyebrow">Dein Lernstand</span>
          <h1>Klar funken. Sicher antworten.</h1>
          <p>
            Zwei richtige Antworten in Folge machen eine Frage sicher. Ein Fehler
            oder „Weiß ich nicht“ setzt sie zurück.
          </p>
        </div>
        <div className="hero-progress">
          <strong>{Math.round(percentage)} %</strong>
          <span>des Katalogs sicher</span>
        </div>
      </section>

      {usingSample && (
        <aside className="notice">
          <strong>Demo-Fragen aktiv.</strong> Importiere deinen rechtmäßig
          bezogenen Fragenkatalog als JSON, um mit allen Fragen zu lernen.
        </aside>
      )}

      <section className="stats-grid" aria-label="Gesamtfortschritt">
        <article className="stat">
          <span>Fragen</span>
          <strong>{questions.length}</strong>
        </article>
        <article className="stat secure-stat">
          <span>Sicher</span>
          <strong>{secure}</strong>
        </article>
        <article className="stat unsafe-stat">
          <span>Noch offen</span>
          <strong>{unsafe}</strong>
        </article>
      </section>

      <ProgressBar value={percentage} label="Gesamtfortschritt" />

      <section className="action-grid">
        <button className="action-card primary-action" onClick={() => navigate("learn")}>
          <span className="action-icon">↗</span>
          <strong>Lernen</strong>
          <small>Offene Fragen gezielt wiederholen</small>
        </button>
        <button className="action-card" onClick={() => navigate("exam")}>
          <span className="action-icon">✓</span>
          <strong>Prüfungsmodus</strong>
          <small>Ohne Hinweise bis zur Auswertung</small>
        </button>
        <button className="action-card" onClick={() => navigate("settings")}>
          <span className="action-icon">⚙</span>
          <strong>Einstellungen</strong>
          <small>Lernumfang und Reihenfolge</small>
        </button>
        <button className="action-card" onClick={() => navigate("importExport")}>
          <span className="action-icon">⇄</span>
          <strong>Import / Export</strong>
          <small>Fragen und Fortschritt sichern</small>
        </button>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Themen</span>
            <h2>Fortschritt nach Bereich</h2>
          </div>
        </div>
        <SectionProgress questions={questions} progress={progress} />
      </section>
    </main>
  );
}
