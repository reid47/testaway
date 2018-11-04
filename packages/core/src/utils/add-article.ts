const beginningVowel = /^[aeiou]/i;

export function addArticle(word: string): string {
  return beginningVowel.test(word) ? `an ${word}` : `a ${word}`;
}
