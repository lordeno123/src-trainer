import type { Question } from "../types/quiz";
import { SECTIONS } from "./sections";

const dummy = (
  id: number,
  sectionIndex: number,
  question: string,
  correctAnswer: string,
  wrongAnswers: string[],
): Question => {
  const section = SECTIONS[sectionIndex];
  return {
    id,
    sectionId: section.id,
    sectionOrder: section.order,
    sectionTitle: section.title,
    question,
    answers: [correctAnswer, ...wrongAnswers],
    correctAnswer,
  };
};

export const SAMPLE_QUESTIONS: Question[] = [
  dummy(1, 0, "Beispielfrage: Wofür steht die Abkürzung SRC?", "Short Range Certificate", [
    "Sea Radio Channel",
    "Safety Rescue Code",
    "Ship Range Control",
  ]),
  dummy(24, 1, "Beispielfrage: Welche Einrichtung gehört zu einer Seefunkstelle?", "Ein zugelassenes UKW-Funkgerät", [
    "Ein Autoradio",
    "Ein Echolot ohne Funkteil",
    "Eine Taschenlampe",
  ]),
  dummy(53, 2, "Beispielfrage: Wofür steht DSC?", "Digital Selective Calling", [
    "Direct Safety Channel",
    "Digital Sea Control",
    "Distress Signal Code",
  ]),
  dummy(69, 3, "Beispielfrage: In welchem Bereich arbeitet UKW-Seefunk?", "Im VHF-Bereich", [
    "Im Langwellenbereich",
    "Nur über Satellit",
    "Im Infrarotbereich",
  ]),
  dummy(85, 4, "Beispielfrage: Welche Meldung hat die höchste Priorität?", "Eine Notmeldung", [
    "Eine Routinemeldung",
    "Eine Wetteranfrage",
    "Ein Privatgespräch",
  ]),
  dummy(116, 5, "Beispielfrage: Wozu dient NAVTEX?", "Zum Empfang nautischer und meteorologischer Warnungen", [
    "Zur Sprachverschlüsselung",
    "Zur Radarbildanzeige",
    "Zur Abrechnung von Funkgesprächen",
  ]),
  dummy(125, 6, "Beispielfrage: Wozu dient eine EPIRB?", "Zur Alarmierung und Ortung im Seenotfall", [
    "Zur Messung der Wassertiefe",
    "Zur Anzeige des Windwinkels",
    "Zur Unterhaltung an Bord",
  ]),
];
