jest.mock('query-string', () => ({
  parse: jest.fn(),
  stringifyUrl: jest.fn(),
}));

import { formatDateTime } from '@/lib/utils';

describe('formatDateTime - Asia/Kolkata (IST) formatting tests', () => {
  it('formats UTC midday correctly in IST (UTC 06:45 -> IST 12:15 pm)', () => {
    const utcDate = new Date('2026-10-19T06:45:00.000Z');
    const result = formatDateTime(utcDate);

    // Verify time is 12:15 pm
    expect(result.timeOnly).toMatch(/12:15\s*(pm|PM)/);
    // Verify date is 19 Oct, 2026
    expect(result.dateOnly).toMatch(/19\s+Oct,?\s+2026/);
    expect(result.dateTime).toMatch(/19\s+Oct,?\s+2026.*12:15\s*(pm|PM)/);
  });

  it('formats timestamp near midnight UTC correctly in IST (UTC 00:05 -> IST 05:35 am)', () => {
    // 5 minutes past midnight UTC
    const nearMidnightUTC = '2026-10-19T00:05:00.000Z';
    const result = formatDateTime(nearMidnightUTC);

    expect(result.timeOnly).toMatch(/5:35\s*(am|AM)/);
    expect(result.dateOnly).toMatch(/19\s+Oct,?\s+2026/);
  });

  it('formats timestamp right before midnight UTC with date rollover into IST (UTC 23:55 -> next day IST 05:25 am)', () => {
    // 23:55 UTC on 18 Oct -> 05:25 IST on 19 Oct (+5:30)
    const lateUtcDate = '2026-10-18T23:55:00.000Z';
    const result = formatDateTime(lateUtcDate);

    // Date in IST rolls over to 19 Oct
    expect(result.dateOnly).toMatch(/19\s+Oct,?\s+2026/);
    expect(result.timeOnly).toMatch(/5:25\s*(am|AM)/);
  });

  it('formats late evening UTC crossing midnight into next morning in IST (UTC 20:00 -> IST 01:30 am)', () => {
    // 20:00 UTC on 18 Oct -> 01:30 IST on 19 Oct
    const eveningUtc = new Date('2026-10-18T20:00:00.000Z');
    const result = formatDateTime(eveningUtc);

    expect(result.dateOnly).toMatch(/19\s+Oct,?\s+2026/);
    expect(result.timeOnly).toMatch(/1:30\s*(am|AM)/);
  });

  it('handles epoch millisecond numeric timestamps', () => {
    const timestampMs = new Date('2026-10-19T00:00:00.000Z').getTime();
    const result = formatDateTime(timestampMs);

    expect(result.dateOnly).toMatch(/19\s+Oct,?\s+2026/);
    expect(result.timeOnly).toMatch(/5:30\s*(am|AM)/);
  });
});
