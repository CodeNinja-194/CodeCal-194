import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { Contest } from '../types';

const URL = 'https://atcoder.jp/contests/';

function parseDuration(str: string): number {
  // format could be "2:00" or "5:00:00"
  const parts = str.trim().split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 3600 + parts[1] * 60;
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export async function fetchAtCoder(): Promise<Contest[]> {
  try {
    const res = await fetch(URL);
    const html = await res.text();
    const $ = cheerio.load(html);
    const contests: Contest[] = [];

    // Upcoming contests table has id "contest-table-upcoming"
    $('#contest-table-upcoming tbody tr').each((i, row) => {
      const cols = $(row).find('td');
      if (cols.length < 3) return;

      const timeText = $(cols[0]).text().trim(); // e.g. "2026-03-01 21:00"
      const nameEl = $(cols[1]).find('a');
      const name = nameEl.text().trim();
      const url = 'https://atcoder.jp' + nameEl.attr('href');
      const durText = $(cols[2]).text().trim();

      const timeMatch = /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/.exec(timeText);
      if (!timeMatch) return;
      const [_full, datePart, timePart] = timeMatch;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);

      // AtCoder times displayed in JST (UTC+9). Convert to UTC.
      const startUTC = Date.UTC(year, month - 1, day, hour - 9, minute);
      const durationSeconds = parseDuration(durText);
      const endUTC = startUTC + durationSeconds * 1000;

      contests.push({
        id: url, // url is unique enough
        platform: 'AtCoder',
        name,
        startTime: new Date(startUTC).toISOString(),
        endTime: new Date(endUTC).toISOString(),
        durationSeconds,
        url
      });
    });

    return contests;
  } catch (err) {
    console.error('fetchAtCoder error:', err);
    return [];
  }
}
