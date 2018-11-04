export function pluralize(amount: number, word: string, pluralSuffix: string = 's'): string {
  const plural = amount !== 1;
  return plural ? `${word}${pluralSuffix}` : word;
}
