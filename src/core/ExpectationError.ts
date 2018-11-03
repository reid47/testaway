import prettyPrint from './utils/pretty-print';

export class ExpectationError extends Error {
  private matcher: (...obj: any[]) => void;
  private negated: boolean;
  private actual: any;
  private matcherArgs: any[];
  private additionalInfo?: string;

  constructor(
    matcher: (...obj: any[]) => void,
    negated: boolean,
    actual: any,
    matcherArgs: any[],
    additionalInfo?: string
  ) {
    super();
    this.name = this.constructor.name;
    this.matcher = matcher;
    this.negated = negated;
    this.actual = actual;
    this.matcherArgs = matcherArgs;
    this.additionalInfo = additionalInfo;
    this.message = this.formatMessage();
    this.stack = (this.stack || '')
      .split('\n')
      .filter(line => /^[ ]*at/.test(line))
      .map(line => line.trim())
      .join('\n');
  }

  formatMessage(): string {
    const matcher = `${this.negated ? '.not' : ''}.${this.matcher.name}`;
    const matcherPhrase = `${this.negated ? 'not ' : ''}${this.matcher.name.replace(
      /[A-Z][a-z]/g,
      s => ` ${s.toLowerCase()}`
    )}`;

    return [
      `Expectation failed: expect(...)${matcher}(...)\n`,
      `\n`,
      `expected\n`,
      `${prettyPrint(this.actual, 1)}\n`,
      `${matcherPhrase}\n`,
      this.matcherArgs.length === 1 && `${prettyPrint(this.matcherArgs[0], 1)}\n`,
      this.additionalInfo && `\n${this.additionalInfo}`
    ]
      .filter(Boolean)
      .join('');
  }
}
