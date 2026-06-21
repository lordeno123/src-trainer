import { useState } from "react";
import { SAMPLE_QUESTIONS } from "../data/sampleQuestions";
import { DashboardPage } from "../pages/DashboardPage";
import { ExamPage } from "../pages/ExamPage";
import { ImportExportPage } from "../pages/ImportExportPage";
import { LearnPage } from "../pages/LearnPage";
import { SettingsPage } from "../pages/SettingsPage";
import { browserStorage } from "../storage/storage";
import type {
  AppSettings,
  Page,
  ProgressMap,
  Question,
} from "../types/quiz";

export function App() {
  const storedQuestions = browserStorage.loadQuestions();
  const [page, setPage] = useState<Page>("dashboard");
  const [questions, setQuestions] = useState<Question[]>(
    storedQuestions ?? SAMPLE_QUESTIONS,
  );
  const [usingSample, setUsingSample] = useState(storedQuestions === null);
  const [progress, setProgress] = useState<ProgressMap>(
    browserStorage.loadProgress(),
  );
  const [settings, setSettings] = useState<AppSettings>(
    browserStorage.loadSettings(),
  );

  const navigate = (next: Page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(next);
  };

  const saveProgress = (next: ProgressMap) => {
    setProgress(next);
    browserStorage.saveProgress(next);
  };

  const saveSettings = (next: AppSettings) => {
    setSettings(next);
    browserStorage.saveSettings(next);
  };

  const importQuestions = (next: Question[]) => {
    setQuestions(next);
    setUsingSample(false);
    browserStorage.saveQuestions(next);
  };

  const resetProgress = () => {
    if (!window.confirm("Wirklich den gesamten Lernfortschritt löschen?")) return;
    setProgress({});
    browserStorage.clearProgress();
  };

  const deleteQuestions = () => {
    if (!window.confirm("Importierten Fragenkatalog löschen und Demo-Fragen verwenden?")) return;
    browserStorage.deleteQuestions();
    setQuestions(SAMPLE_QUESTIONS);
    setUsingSample(true);
  };

  const learnAll = () => {
    saveSettings({ ...settings, learningScope: "all" });
    navigate("learn");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand" onClick={() => navigate("dashboard")}>
          <span className="brand-mark">⚓</span>
          <span><strong>SRC Trainer</strong><small>Seefunk sicher lernen</small></span>
        </button>
        <span className="offline-badge">Offline bereit</span>
      </header>

      {page === "dashboard" && (
        <DashboardPage
          questions={questions}
          progress={progress}
          usingSample={usingSample}
          navigate={navigate}
        />
      )}
      {page === "learn" && (
        <LearnPage
          key={`${settings.questionOrder}-${settings.learningScope}-${settings.selectedSectionId ?? ""}`}
          questions={questions}
          progress={progress}
          settings={settings}
          onProgress={saveProgress}
          onBack={() => navigate("dashboard")}
          onShowAll={learnAll}
        />
      )}
      {page === "exam" && (
        <ExamPage
          questions={questions}
          progress={progress}
          settings={settings}
          onProgress={saveProgress}
          onBack={() => navigate("dashboard")}
        />
      )}
      {page === "settings" && (
        <SettingsPage
          settings={settings}
          onSettings={saveSettings}
          onResetProgress={resetProgress}
          onDeleteQuestions={deleteQuestions}
          onBack={() => navigate("dashboard")}
        />
      )}
      {page === "importExport" && (
        <ImportExportPage
          questions={questions}
          progress={progress}
          usingSample={usingSample}
          onQuestions={importQuestions}
          onProgress={saveProgress}
          onBack={() => navigate("dashboard")}
        />
      )}

      <footer className="app-footer">
        <span>SRC Trainer</span>
        <span>Daten bleiben lokal auf deinem Gerät.</span>
      </footer>
    </div>
  );
}
