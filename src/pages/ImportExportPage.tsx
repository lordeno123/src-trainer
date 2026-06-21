import { useRef, useState } from "react";
import { validateProgress, validateQuestions } from "../logic/validation";
import type { ProgressMap, Question } from "../types/quiz";

type Props = {
  questions: Question[];
  progress: ProgressMap;
  usingSample: boolean;
  onQuestions: (questions: Question[]) => void;
  onProgress: (progress: ProgressMap) => void;
  onBack: () => void;
};

async function readJsonFile(file: File): Promise<unknown> {
  return JSON.parse(await file.text());
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ImportExportPage({
  questions,
  progress,
  usingSample,
  onQuestions,
  onProgress,
  onBack,
}: Props) {
  const questionInput = useRef<HTMLInputElement>(null);
  const progressInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);

  const importQuestions = async (file?: File) => {
    if (!file) return;
    try {
      const result = validateQuestions(await readJsonFile(file));
      if (!result.ok) {
        setErrors(result.errors);
        setMessage(undefined);
        return;
      }
      onQuestions(result.value);
      setErrors([]);
      setMessage(`${result.value.length} Fragen wurden erfolgreich importiert.`);
    } catch {
      setErrors(["Die Datei enthält kein gültiges JSON."]);
      setMessage(undefined);
    } finally {
      if (questionInput.current) questionInput.current.value = "";
    }
  };

  const importProgress = async (file?: File) => {
    if (!file) return;
    try {
      const result = validateProgress(await readJsonFile(file));
      if (!result.ok) {
        setErrors(result.errors);
        setMessage(undefined);
        return;
      }
      onProgress(result.value);
      setErrors([]);
      setMessage("Der Lernfortschritt wurde erfolgreich importiert.");
    } catch {
      setErrors(["Die Datei enthält kein gültiges JSON."]);
      setMessage(undefined);
    } finally {
      if (progressInput.current) progressInput.current.value = "";
    }
  };

  return (
    <main className="page">
      <div className="page-toolbar">
        <button className="icon-button" onClick={onBack} aria-label="Zurück">←</button>
        <div>
          <span className="eyebrow">Lokale Daten</span>
          <h1>Import / Export</h1>
        </div>
      </div>

      <aside className="notice">
        <strong>Nur auf diesem Gerät.</strong> Fragen, Einstellungen und
        Lernfortschritt bleiben im Browser. Erstelle regelmäßig eine Sicherung.
      </aside>

      {message && <div className="message success" role="status">{message}</div>}
      {errors.length > 0 && (
        <div className="message error" role="alert">
          <strong>Import nicht möglich</strong>
          <ul>{errors.slice(0, 12).map((error) => <li key={error}>{error}</li>)}</ul>
          {errors.length > 12 && <p>… und {errors.length - 12} weitere Fehler.</p>}
        </div>
      )}

      <section className="import-card">
        <span className="import-icon">↓</span>
        <div>
          <h2>Fragenkatalog importieren</h2>
          <p>
            Erwartet wird eine JSON-Datei mit genau vier Antworten je Frage.
            Aktuell: {usingSample ? "7 Demo-Fragen" : `${questions.length} importierte Fragen`}.
          </p>
        </div>
        <input
          ref={questionInput}
          className="visually-hidden"
          id="question-import"
          type="file"
          accept="application/json,.json"
          onChange={(event) => importQuestions(event.target.files?.[0])}
        />
        <label className="button primary" htmlFor="question-import">JSON auswählen</label>
      </section>

      <section className="import-card">
        <span className="import-icon">↑</span>
        <div>
          <h2>Fortschritt sichern</h2>
          <p>Exportiere alle Zähler und Zeitstempel als lesbare JSON-Datei.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => downloadJson("src-fortschritt.json", progress)}
        >
          Fortschritt exportieren
        </button>
      </section>

      <section className="import-card">
        <span className="import-icon">↺</span>
        <div>
          <h2>Fortschritt wiederherstellen</h2>
          <p>Der importierte Stand ersetzt den derzeit gespeicherten Fortschritt.</p>
        </div>
        <input
          ref={progressInput}
          className="visually-hidden"
          id="progress-import"
          type="file"
          accept="application/json,.json"
          onChange={(event) => importProgress(event.target.files?.[0])}
        />
        <label className="button secondary" htmlFor="progress-import">Sicherung auswählen</label>
      </section>
    </main>
  );
}
