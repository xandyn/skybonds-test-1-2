import { PerformanceObserver, performance } from 'perf_hooks';

const sleep = async (ms = 0) => new Promise<void>(r => setTimeout(() => r(), ms));

function memoize<F extends Function>(func: F) {
  const cache: { [key: string]: any } = {};

  return function(...args: any[]) {
    const key = JSON.stringify(args);

    cache[key] = cache[key] || func(args);

    return cache[key];
  }
}

interface Params {
  url: string;
  body: string[];
}

export const response = [{ isin: 'XS0971721963', data: {} }, { isin: 'RU000A0JU4L3', data: {} }];

class Http {
  public async post(_: Params) {
    await sleep(2000);
    return response;
  }
}

const http = new Http();

interface Payload {
  date: string;
  isins: string[];
}

export const payload: Payload = {
  date: '20180120',
  isins: ['XS0971721963', 'RU000A0JU4L3']
};

// Complexity O(1)
export const getBondsData = memoize(async ({ date, isins }: Payload) => {
  const result = await http.post({
    url: `/bonds/${date}`,
    body: isins
  });

  return result;
});

const obs = new PerformanceObserver((items) => {
  const entries = items.getEntries();

  entries.forEach((entry) => {
    console.log(`${entry.name} time:   ${entry.duration}ms`);
  });

  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

const runFirstCall = async () => {
  const memory = process.memoryUsage().heapUsed / 1024 / 1024;
  performance.mark('first-start');
  const bondsData = await getBondsData(payload);
  performance.mark('first-end');
  performance.measure('First call', 'first-start', 'first-end');
  const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  const used = memoryUsed - memory;
  console.log(`Memory: ${Math.round(used * 100) / 100} MB`);
  console.log('Result: ');
  console.log(bondsData);
}

const runSecondCall = async () => {
  const memory = process.memoryUsage().heapUsed / 1024 / 1024;
  performance.mark('second-start');
  const bondsData = await getBondsData(payload);
  performance.mark('second-end');
  performance.measure('Second call', 'second-start', 'second-end');
  const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  const used = memoryUsed - memory;
  console.log(`Memory: ${Math.round(used * 100) / 100} MB`);
  console.log('Result: ');
  console.log(bondsData);
}

const run = async () => {
  await runFirstCall();
  await runSecondCall();
}

run();
