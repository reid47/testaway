const beginningVowel = /^[aeiou]/i;

export default function addArticle(word: string): string {
  return beginningVowel.test(word) ? `an ${word}` : `a ${word}`;
}
