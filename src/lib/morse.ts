const CODE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',
  J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
};

/** "OI" → ["---", ".."] */
export function toMorse(word: string): string[] {
  return [...word.toUpperCase()].map((ch) => CODE[ch] ?? '').filter(Boolean);
}

/**
 * Sequência de [ligado, duração em unidades] seguindo a norma:
 * ponto = 1, traço = 3, intervalo entre sinais = 1, entre letras = 3, fim da palavra = 7.
 */
export function morseTimeline(word: string): Array<[on: boolean, units: number]> {
  const steps: Array<[boolean, number]> = [];
  toMorse(word).forEach((letter, li, letters) => {
    [...letter].forEach((sign, si) => {
      steps.push([true, sign === '-' ? 3 : 1]);
      if (si < letter.length - 1) steps.push([false, 1]);
    });
    steps.push([false, li < letters.length - 1 ? 3 : 7]);
  });
  return steps;
}
