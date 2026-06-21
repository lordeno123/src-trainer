# SRC Trainer

Mobile-first Progressive Web App zum Lernen des deutschen Fragenkatalogs für das beschränkt gültige Funkbetriebszeugnis (SRC).

Die App arbeitet vollständig lokal im Browser, ist nach dem ersten Laden offline nutzbar und benötigt kein Benutzerkonto oder Backend.

## Lernregel

Eine Frage wird erst dann **sicher**, wenn sie seit dem letzten Fehler oder „Weiß ich nicht“ mindestens zweimal richtig beantwortet wurde.

- Richtige Antwort: Sicherheitszähler +1
- Falsche Antwort: Sicherheitszähler zurück auf 0
- „Weiß ich nicht“: Sicherheitszähler zurück auf 0

## Installation und Entwicklung

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

Vite zeigt anschließend die lokale Entwicklungsadresse an.

## Tests und Build

```bash
npm test
npm run build
npm run preview
```

Der Produktions-Build liegt danach in `dist/`.

## GitHub Pages

Die Vite-Basis ist relativ (`./`) konfiguriert und eignet sich deshalb für eine Veröffentlichung unter einem Repository-Unterpfad.

1. `npm run build` ausführen.
2. Den Inhalt von `dist/` über eine GitHub-Actions-Workflow-Datei oder einen `gh-pages`-Branch veröffentlichen.
3. In den Repository-Einstellungen unter **Pages** die entsprechende Quelle auswählen.

Wichtig: Nur den App-Code und Demo-Daten veröffentlichen, nicht den amtlichen Fragenkatalog.

## Fragen importieren

Unter **Import / Export** kann eine lokale JSON-Datei importiert werden. Beispiel:

```json
[
  {
    "id": 1,
    "sectionId": "I",
    "sectionOrder": 1,
    "sectionTitle": "Mobiler Seefunkdienst und GMDSS",
    "question": "Dummy-Frage?",
    "answers": [
      "Richtige Antwort",
      "Falsche Antwort 1",
      "Falsche Antwort 2",
      "Falsche Antwort 3"
    ],
    "correctAnswer": "Richtige Antwort"
  }
]
```

Jede Frage braucht genau vier nicht-leere Antworten. `correctAnswer` muss exakt einer dieser vier Antworten entsprechen. Die Anzeige mischt die Antworten für jede neue Darstellung und verlässt sich nie auf ihre ursprüngliche Position.

## Lokale Speicherung

Fragen, Fortschritt und Einstellungen werden derzeit über eine gekapselte `localStorage`-Schnittstelle gespeichert. Dadurch kann die Implementierung später gegen IndexedDB ausgetauscht werden. Der Fortschritt lässt sich als JSON exportieren und wieder importieren.

## Urheberrecht

Der bereitgestellte Fragenkatalog weist ausdrücklich darauf hin, dass Abdruck, Vervielfältigung und Veröffentlichung nur mit Genehmigung zulässig sind. Deshalb enthält dieses Repository ausschließlich frei formulierte Demo-Fragen.

**Veröffentliche den vollständigen Katalogtext nicht in einem öffentlichen Repository.** Nutze die Importfunktion nur mit Daten, die du rechtmäßig verwenden darfst.
