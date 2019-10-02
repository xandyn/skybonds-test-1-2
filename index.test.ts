import { transformShareArray } from './index';

const randomArray = (length: number, max: number) =>
  [...new Array(length)].map(() => Math.random() * max);

describe('Transform array of numbers to percents', () => {
  it('Returns sum of percents that equals 100', () => {
    const arr = randomArray(100000, 100).map(String);
    const result = transformShareArray(arr);
    const sum = Math.round(result.map(Number).reduce((a, b) => a + b, 0)); // This sum will never be the round number, since behavior of numbers in js

    expect(sum).toEqual(100);
  });
});
