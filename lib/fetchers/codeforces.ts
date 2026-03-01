import fetch from 'node-fetch';
import { Contest } from '../types';

const API_URL = 'https://codeforces.com/api/contest.list?gym=false';

export async function fetchCodeforces(): Promise<Contest[]> {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (data.status !== 'OK' || !Array.isArray(data.result)) {
      throw new Error('Unexpected Codeforces response');
    }

    const contests: Contest[] = data.result
      .filter((c: any) => c.phase === 'BEFORE')
      .map((c: any) => ({
        id: String(c.id),
        platform: 'Codeforces',
        name: c.name,
        startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
        endTime: new Date((c.startTimeSeconds + c.durationSeconds) * 1000).toISOString(),
        durationSeconds: c.durationSeconds,
        url: `https://codeforces.com/contest/${c.id}`
      }));

    return contests;
  } catch (err) {
    console.error('fetchCodeforces error:', err);
    return [];
  }
}
