import { Contest } from '../types';

// LeetCode does not provide a public contest API, so we generate the schedule
// Weekly contests: every Sunday at 08:00 UTC
// Biweekly contests: every 2nd Saturday at 08:00 UTC (starting from a known anchor)

const WEEKLY_HOUR_UTC = 8;
const BIWEEKLY_HOUR_UTC = 8;
// anchor date for a biweekly contest (Saturday)
const BIWEEKLY_ANCHOR = new Date(Date.UTC(2026, 0, 3, BIWEEKLY_HOUR_UTC, 0, 0)); // Jan 3 2026 08:00 UTC - assumed starter

function getNextWeekday(date: Date, weekday: number, hourUTC: number): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hourUTC, 0, 0));
  const diff = (weekday - d.getUTCDay() + 7) % 7;
  if (diff === 0 && d <= date) {
    d.setUTCDate(d.getUTCDate() + 7);
  } else {
    d.setUTCDate(d.getUTCDate() + diff);
  }
  return d;
}

function getNextBiweekly(date: Date): Date {
  // find the next anchor that is >= date
  let candidate = new Date(BIWEEKLY_ANCHOR);
  while (candidate <= date) {
    candidate.setUTCDate(candidate.getUTCDate() + 14);
  }
  return candidate;
}

export async function fetchLeetCode(): Promise<Contest[]> {
  try {
    const now = new Date();
    const events: { date: Date; type: 'weekly' | 'biweekly' }[] = [];

    let weekly = getNextWeekday(now, 0, WEEKLY_HOUR_UTC); // Sunday
    for (let i = 0; i < 10; i++) {
      events.push({ date: new Date(weekly), type: 'weekly' });
      weekly.setUTCDate(weekly.getUTCDate() + 7);
    }

    let biweekly = getNextBiweekly(now);
    for (let i = 0; i < 10; i++) {
      events.push({ date: new Date(biweekly), type: 'biweekly' });
      biweekly.setUTCDate(biweekly.getUTCDate() + 14);
    }

    // sort and pick first 4
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    const selected = events.slice(0, 4);

    // map to Contest format
    const contests: Contest[] = selected.map((evt) => {
      const startTime = evt.date.toISOString();
      const nameBase = evt.type === 'weekly' ? 'Weekly Contest' : 'Biweekly Contest';
      const name = `LeetCode ${nameBase} (${startTime.slice(0, 10)})`;
      const durationSeconds = 90 * 60; // LeetCode contests are 90 minutes
      return {
        id: `${evt.type}-${startTime}`,
        platform: 'LeetCode',
        name,
        startTime,
        endTime: new Date(evt.date.getTime() + durationSeconds * 1000).toISOString(),
        durationSeconds,
        url: 'https://leetcode.com/contest/'
      };
    });

    return contests;
  } catch (err) {
    console.error('fetchLeetCode error:', err);
    return [];
  }
}
