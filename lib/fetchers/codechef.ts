import { Contest } from '../types';

// We'll generate a weekly CodeChef Starters contest for stability.
// Choose Wednesday 14:30 UTC as the anchor time (adjustable).

function getNextWeekdayTime(date: Date, weekday: number, hour: number, minute: number): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute, 0));
  const diff = (weekday - d.getUTCDay() + 7) % 7;
  if (diff === 0 && d <= date) {
    d.setUTCDate(d.getUTCDate() + 7);
  } else {
    d.setUTCDate(d.getUTCDate() + diff);
  }
  return d;
}

export async function fetchCodeChef(): Promise<Contest[]> {
  try {
    const now = new Date();
    const events: Contest[] = [];
    let next = getNextWeekdayTime(now, 3, 14, 30); // Wednesday
    const durationSeconds = 2 * 60 * 60; // assume 2 hours

    for (let i = 0; i < 4; i++) {
      const startTime = next.toISOString();
      events.push({
        id: `starters-${startTime}`,
        platform: 'CodeChef',
        name: `Starters Contest (${startTime.slice(0, 10)})`, 
        startTime,
        endTime: new Date(next.getTime() + durationSeconds * 1000).toISOString(),
        durationSeconds,
        url: 'https://www.codechef.com/contests'
      });
      next = new Date(next.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    return events;
  } catch (err) {
    console.error('fetchCodeChef error:', err);
    return [];
  }
}
