import { PerformanceObserver, performance } from 'perf_hooks';

const shareArray = ['1.5','3','6','1.5'];

// Complexity O(n)
export const transformShareArray = (array: string[]): string[] => {
  const formattedArray = array.map(Number);
  const sum = formattedArray.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  const result: string[] = [];

  formattedArray.forEach((value) => {
    const percent = value / sum * 100;
    result.push(percent.toFixed(3));
  });

  return result;
};

const obs = new PerformanceObserver((items) => {
  console.log(`Time:   ${items.getEntries()[0].duration}ms`);
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

const memory = process.memoryUsage().heapUsed / 1024 / 1024;
performance.mark('start');
const transform = transformShareArray(shareArray);
performance.mark('end');
performance.measure('start to end', 'start', 'end');
const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
const used = memoryUsed - memory;
console.log(`Memory: ${Math.round(used * 100) / 100} MB`);
console.log(transform);
