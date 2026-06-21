export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function shuffleAnswers<T extends { answers: string[]; correctAnswer: string }>(
  question: T,
  random = Math.random,
): string[] {
  const shuffled = shuffle(question.answers, random);
  if (!shuffled.includes(question.correctAnswer)) {
    throw new Error("Die richtige Antwort ging beim Mischen verloren.");
  }
  return shuffled;
}
