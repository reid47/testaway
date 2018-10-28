import { Expectation } from './Expectation';

export default function expect(obj: any) {
  return new Expectation(obj);
}
