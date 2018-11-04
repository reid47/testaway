import { prettyPrint } from './utils/pretty-print';
import { Expectation } from './Expectation';

const stripIndent = (message: string) =>
  message
    .split('\n')
    .map(line => line.replace(/^      /, '  '))
    .join('\n')
    .trim();

export class ExpectationError extends Error {
  static create(
    expectation: Expectation,
    matcherName: string,
    matcherPhrase: string,
    matcherParamNames: string[],
    matcherArgs: any[],
    additionalInfo?: any[]
  ): ExpectationError {
    const err = new ExpectationError();
    const matcher = `${expectation.negated ? '.not' : ''}.${matcherName}`;
    const phrase = `${expectation.negated ? 'not ' : ''}${matcherPhrase}`;
    const phraseEnd = matcherArgs.length === 0 ? '.' : `:\n        ${prettyPrint(matcherArgs[0])}`;

    let additional = '';
    if (additionalInfo) {
      additional += additionalInfo
        .map(([label, value]) => {
          return `\n  ${label}:\n        ${prettyPrint(value)}`;
        })
        .join('');
    }

    err.message = stripIndent(`
      Expectation failed: expect(received)${matcher}(${matcherParamNames.join(', ')})

      Expected:
        ${prettyPrint(expectation.actual)}
      ${phrase}${phraseEnd}${additional}
    `);

    return err;
  }
}
