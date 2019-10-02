import { getBondsData, payload, response } from './caching';

describe('Sending fake http request `getBondsData`', () => {
  it('Sum of percents equals 100', async () => {
    expect.assertions(1);
    const data = await getBondsData(payload);
    expect(data).toEqual(response);
  });
});
