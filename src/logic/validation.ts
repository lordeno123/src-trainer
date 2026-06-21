import type { ProgressMap, Question } from "../types/quiz";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function validateQuestions(input: unknown): ValidationResult<Question[]> {
  if (!Array.isArray(input)) {
    return { ok: false, errors: ["Die JSON-Datei muss ein Array enthalten."] };
  }

  const errors: string[] = [];
  const ids = new Set<number>();

  input.forEach((entry, index) => {
    const label = `Eintrag ${index + 1}`;
    if (!entry || typeof entry !== "object") {
      errors.push(`${label}: muss ein Objekt sein.`);
      return;
    }

    const item = entry as Record<string, unknown>;
    if (typeof item.id !== "number" || !Number.isFinite(item.id)) {
      errors.push(`${label}: „id“ muss eine Zahl sein.`);
    } else if (ids.has(item.id)) {
      errors.push(`${label}: doppelte ID ${item.id}.`);
    } else {
      ids.add(item.id);
    }
    if (!isNonEmptyString(item.question)) {
      errors.push(`${label}: „question“ darf nicht leer sein.`);
    }
    if (
      !Array.isArray(item.answers) ||
      item.answers.length !== 4 ||
      item.answers.some((answer) => !isNonEmptyString(answer))
    ) {
      errors.push(`${label}: „answers“ muss genau 4 nicht-leere Texte enthalten.`);
    }
    if (!isNonEmptyString(item.correctAnswer)) {
      errors.push(`${label}: „correctAnswer“ fehlt.`);
    } else if (
      Array.isArray(item.answers) &&
      !item.answers.includes(item.correctAnswer)
    ) {
      errors.push(`${label}: die richtige Antwort muss in „answers“ vorkommen.`);
    }
    if (!isNonEmptyString(item.sectionId)) {
      errors.push(`${label}: „sectionId“ fehlt.`);
    }
    if (typeof item.sectionOrder !== "number") {
      errors.push(`${label}: „sectionOrder“ muss eine Zahl sein.`);
    }
    if (!isNonEmptyString(item.sectionTitle)) {
      errors.push(`${label}: „sectionTitle“ fehlt.`);
    }
  });

  return errors.length
    ? { ok: false, errors }
    : { ok: true, value: input as Question[] };
}

export function validateProgress(input: unknown): ValidationResult<ProgressMap> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["Der Fortschritt muss ein JSON-Objekt sein."] };
  }

  const errors: string[] = [];
  for (const [key, entry] of Object.entries(input)) {
    if (!entry || typeof entry !== "object") {
      errors.push(`Fortschritt ${key}: ungültiger Eintrag.`);
      continue;
    }
    const item = entry as Record<string, unknown>;
    for (const field of [
      "questionId",
      "correctSinceDontKnow",
      "timesCorrect",
      "timesWrong",
      "timesDontKnow",
    ]) {
      if (typeof item[field] !== "number" || (item[field] as number) < 0) {
        errors.push(`Fortschritt ${key}: „${field}“ muss eine positive Zahl sein.`);
      }
    }
  }

  return errors.length
    ? { ok: false, errors }
    : { ok: true, value: input as ProgressMap };
}
