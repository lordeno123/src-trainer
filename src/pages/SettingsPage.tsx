import { SECTIONS } from "../data/sections";
import type { AppSettings } from "../types/quiz";

type Props = {
  settings: AppSettings;
  onSettings: (settings: AppSettings) => void;
  onResetProgress: () => void;
  onDeleteQuestions: () => void;
  onBack: () => void;
};

export function SettingsPage({
  settings,
  onSettings,
  onResetProgress,
  onDeleteQuestions,
  onBack,
}: Props) {
  const update = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => onSettings({ ...settings, [key]: value });

  return (
    <main className="page">
      <div className="page-toolbar">
        <button className="icon-button" onClick={onBack} aria-label="Zurück">←</button>
        <div>
          <span className="eyebrow">Konfiguration</span>
          <h1>Einstellungen</h1>
        </div>
      </div>

      <section className="settings-group">
        <h2>Lernumfang</h2>
        <label className="field">
          <span>Welche Fragen?</span>
          <select
            value={settings.learningScope}
            onChange={(event) =>
              update("learningScope", event.target.value as AppSettings["learningScope"])
            }
          >
            <option value="all">Alle Fragen</option>
            <option value="unsafeOnly">Nur nicht sichere Fragen</option>
            <option value="wrongOrDontKnowOnly">Je falsch oder „weiß nicht“ beantwortet</option>
          </select>
        </label>
      </section>

      <section className="settings-group">
        <h2>Reihenfolge</h2>
        <div className="radio-list">
          {[
            ["allMixed", "Alle gemischt", "Zufällige Reihenfolge über alle Themen"],
            ["byTopic", "Nach Themen", "Themen und Fragen der Reihe nach"],
            ["singleTopic", "Ein einzelnes Thema", "Nur den gewählten Bereich lernen"],
          ].map(([value, title, detail]) => (
            <label className="radio-card" key={value}>
              <input
                type="radio"
                name="questionOrder"
                value={value}
                checked={settings.questionOrder === value}
                onChange={() =>
                  update("questionOrder", value as AppSettings["questionOrder"])
                }
              />
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
            </label>
          ))}
        </div>
        {settings.questionOrder === "singleTopic" && (
          <>
            <label className="field">
              <span>Thema</span>
              <select
                value={settings.selectedSectionId ?? ""}
                onChange={(event) => update("selectedSectionId", event.target.value)}
              >
                <option value="" disabled>Thema auswählen</option>
                {SECTIONS.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.id}: {section.title} ({section.range})
                  </option>
                ))}
              </select>
            </label>
            <label className="switch-row">
              <span><strong>Im Thema mischen</strong><small>Sonst nach Fragennummer</small></span>
              <input
                type="checkbox"
                checked={settings.singleTopicShuffle}
                onChange={(event) => update("singleTopicShuffle", event.target.checked)}
              />
            </label>
          </>
        )}
      </section>

      <section className="settings-group">
        <h2>Verhalten</h2>
        <label className="switch-row">
          <span><strong>Sofortige Rückmeldung</strong><small>Richtige Antwort direkt anzeigen</small></span>
          <input
            type="checkbox"
            checked={settings.showImmediateFeedback}
            onChange={(event) => update("showImmediateFeedback", event.target.checked)}
          />
        </label>
        <label className="switch-row">
          <span><strong>Prüfungsergebnisse speichern</strong><small>Antworten verändern den Lernstand</small></span>
          <input
            type="checkbox"
            checked={settings.recordExamResults}
            onChange={(event) => update("recordExamResults", event.target.checked)}
          />
        </label>
      </section>

      <section className="settings-group danger-zone">
        <h2>Daten zurücksetzen</h2>
        <button className="button danger" onClick={onResetProgress}>
          Lernfortschritt löschen
        </button>
        <button className="button danger ghost" onClick={onDeleteQuestions}>
          Importierten Fragenkatalog löschen
        </button>
      </section>
    </main>
  );
}
