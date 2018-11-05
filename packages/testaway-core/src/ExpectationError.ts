import { prettyPrint } from './utils/pretty-print';
import { Expectation } from './Expectation';

const stripIndent = (message: string) =>
  message
    .split('\n')
    .map(line => line.replace(/^      /, '  '))
    .join('\n')
    .trim();

export class ExpectationError extends Error {
  constructor(
    expectation: Expectation,
    matcherName: string,
    matcherPhrase: string,
    matcherParamNames: string[] | null,
    matcherArgs: any[],
    additionalInfo?: any[]
  ) {
    const matcher = `${expectation.alreadyRejected ? '.rejects' : ''}${
      expectation.alreadyResolved ? '.resolves' : ''
    }${expectation.negated ? '.not' : ''}.${matcherName}`;
    const phrase = `${expectation.negated ? 'not ' : ''}${matcherPhrase}`;
    const phraseEnd = matcherArgs.length === 0 ? '.' : `:\n        ${prettyPrint(matcherArgs[0])}`;

    let additional = '';
    if (additionalInfo) {
      additional += additionalInfo
        .map(info => {
          if (typeof info === 'string') return `\n  ${info}`;
          const label = info[0];
          const value = info[1];
          return `\n  ${label}:\n        ${prettyPrint(value)}`;
        })
        .join('');
    }

    const matcherParams = matcherParamNames ? `(${matcherParamNames.join(', ')})` : '';
    const message = stripIndent(`
      Expectation failed: expect(received)${matcher}${matcherParams}

      Expected:
        ${prettyPrint(expectation.actual)}
      ${phrase}${phraseEnd}${additional}
    `);

    super(message + '\n');
  }
}
