import { prettyPrint } from './utils/pretty-print';
import { Expectation } from './Expectation';

const stripIndent = (message: string) =>
  message
    .split('\n')
    .map(line => line.replace(/^      /, ''))
    .join('\n')
    .trim();

export class ExpectationError extends Error {
  constructor(
    expectation: Expectation,
    reason: 'incorrect-usage' | 'assertion-failed',
    matcherName: string,
    matcherPhrase: string,
    matcherParamNames: string[] | null,
    matcherArgs: any[],
    additionalLines?: any[]
  ) {
    const matcher = `${expectation.alreadyRejected ? '.rejects' : ''}${
      expectation.alreadyResolved ? '.resolves' : ''
    }${expectation.negated ? '.not' : ''}.${matcherName}`;

    const phrase = `${
      expectation.negated && reason === 'assertion-failed' ? 'not ' : ''
    }${matcherPhrase}`;

    const phraseEnd = matcherArgs.length === 0 ? '.' : `:\n        ${matcherArgs[0]}`;
    const additional = additionalLines ? `\n${additionalLines.join('\n')}` : '';
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
