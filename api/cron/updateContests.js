import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import cheerio from 'cheerio';

let supabase = null;

function getSupabaseClient() {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variable');
  }

  supabase = createClient(url, key);
  return supabase;
}

// Helper: deduplicate and sort
function dedupe(contests) {
  const map = new Map();
  contests.forEach((c) => {
    const key = `${c.platform}|${c.name}|${c.startTime}`;
    if (!map.has(key)) {
      map.set(key, c);
    }
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

async function fetchCodeforces() {
  try {
    const res = await fetch('https://codeforces.com/api/contest.list?gym=false');
    const data = await res.json();

    if (data.status !== 'OK' || !Array.isArray(data.result)) {
      throw new Error('Unexpected Codeforces response');
    }

    return data.result
      .filter((c) => c.phase === 'BEFORE')
      .map((c) => ({
        id: String(c.id),
        platform: 'Codeforces',
        name: c.name,
        startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
        endTime: new Date((c.startTimeSeconds + c.durationSeconds) * 1000).toISOString(),
        durationSeconds: c.durationSeconds,
        url: `https://codeforces.com/contest/${c.id}`
      }));
  } catch (err) {
    console.error('fetchCodeforces error:', err);
    return [];
  }
}

async function fetchLeetCode() {
  try {
    const now = new Date();
    const events = [];

    // Weekly: Sunday 8 UTC
    let weekly = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      8,
      0,
      0
    ));
    const diffWeekly = (0 - weekly.getUTCDay() + 7) % 7;
    if (diffWeekly === 0 && weekly <= now) {
      weekly.setUTCDate(weekly.getUTCDate() + 7);
    } else if (diffWeekly > 0) {
      weekly.setUTCDate(weekly.getUTCDate() + diffWeekly);
    }

    for (let i = 0; i < 10; i++) {
      events.push({ date: new Date(weekly), type: 'weekly' });
      weekly.setUTCDate(weekly.getUTCDate() + 7);
    }

    // Biweekly: Second Saturday 8 UTC (anchor: Jan 3 2026)
    const BIWEEKLY_ANCHOR = new Date(Date.UTC(2026, 0, 3, 8, 0, 0));
    let biweekly = new Date(BIWEEKLY_ANCHOR);
    while (biweekly <= now) {
      biweekly.setUTCDate(biweekly.getUTCDate() + 14);
    }

    // Generate weekly and biweekly events for the next ~90 days to ensure month coverage
    const horizon = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    let w = new Date(weekly);
    while (w <= horizon) {
      events.push({ date: new Date(w), type: 'weekly' });
      w.setUTCDate(w.getUTCDate() + 7);
    }

    let b = new Date(biweekly);
    while (b <= horizon) {
      events.push({ date: new Date(b), type: 'biweekly' });
      b.setUTCDate(b.getUTCDate() + 14);
    }

    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    const selected = events.slice(0, 4);

    return selected.map((evt) => {
      const startTime = evt.date.toISOString();
      const nameBase = evt.type === 'weekly' ? 'Weekly Contest' : 'Biweekly Contest';
      const name = `LeetCode ${nameBase}`;
      const durationSeconds = 90 * 60;
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
  } catch (err) {
    console.error('fetchLeetCode error:', err);
    return [];
  }
}

async function fetchAtCoder() {
  try {
    const res = await fetch('https://atcoder.jp/contests/');
    const html = await res.text();
    const $ = cheerio.load(html);
    const contests = [];

    // Parse upcoming table (#contest-table-upcoming)
    $('#contest-table-upcoming tbody tr').each((i, row) => {
      const cols = $(row).find('td');
      if (cols.length < 3) return;

      const timeText = $(cols[0]).text().trim(); // e.g. "2026-03-01 21:00"
      const nameEl = $(cols[1]).find('a');
      const name = nameEl.text().trim();
      const href = nameEl.attr('href');
      const url = href ? 'https://atcoder.jp' + href : null;
      const durText = $(cols[2]).text().trim();

      const timeMatch = /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/.exec(timeText);
      if (!timeMatch) return;
      const [_, datePart, timePart] = timeMatch;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);

      // AtCoder shows times in JST (UTC+9)
      const startUTC = Date.UTC(year, month - 1, day, hour - 9, minute);
      // parse duration like '2:00' or '5:00:00'
      const parseDuration = (str) => {
        const parts = str.split(':').map(Number);
        if (parts.length === 2) return (parts[0] * 3600 + parts[1] * 60);
        if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]);
        return 0;
      };

      const durationSeconds = parseDuration(durText) || 0;
      const endUTC = startUTC + durationSeconds * 1000;

      contests.push({
        id: url || `${name}-${datePart}-${timePart}`,
        platform: 'AtCoder',
        name,
        startTime: new Date(startUTC).toISOString(),
        endTime: new Date(endUTC).toISOString(),
        durationSeconds,
        url: url || 'https://atcoder.jp/contests/'
      });
    });

    return contests;
  } catch (err) {
    console.error('fetchAtCoder error:', err);
    return [];
  }
}

async function fetchCodeChef() {
  try {
    const res = await fetch('https://www.codechef.com/contests');
    const html = await res.text();
    const $ = cheerio.load(html);
    const contests = [];

    // Heuristic: find tables or sections containing 'Upcoming' or 'Future' contests
    $('table').each((i, table) => {
      const heading = $(table).prev('h3, h2').text().toLowerCase();
      if (!heading.includes('future') && !heading.includes('upcoming') && !heading.includes('present')) return;

      $(table)
        .find('tbody tr')
        .each((j, row) => {
          const cols = $(row).find('td');
          if (cols.length < 2) return;
          const nameEl = $(cols[0]).find('a');
          const name = nameEl.text().trim() || $(cols[0]).text().trim();
          const href = nameEl.attr('href');
          const url = href && href.startsWith('http') ? href : href ? `https://www.codechef.com${href}` : 'https://www.codechef.com/contests';
          const timeText = $(cols[1]).text().trim();

          // Try to parse a date from timeText
          const parsed = Date.parse(timeText);
          if (!isNaN(parsed)) {
            const startTime = new Date(parsed).toISOString();
            const durationSeconds = 2 * 60 * 60; // default
            contests.push({
              id: url || `${name}-${startTime}`,
              platform: 'CodeChef',
              name,
              startTime,
              endTime: new Date(parsed + durationSeconds * 1000).toISOString(),
              durationSeconds,
              url
            });
          }
        });
    });

    // If no contests found via scraping, fallback to weekly Starters generation
    if (contests.length === 0) {
      const now = new Date();
      let next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 14, 30, 0));
      const dayDiff = (3 - next.getUTCDay() + 7) % 7 || 7;
      next.setUTCDate(next.getUTCDate() + dayDiff);
      const durationSeconds = 2 * 60 * 60;
      for (let i = 0; i < 8; i++) {
        const startTime = next.toISOString();
        contests.push({
          id: `starters-${startTime}`,
          platform: 'CodeChef',
          name: `CodeChef Starters (${startTime.slice(0,10)})`,
          startTime,
          endTime: new Date(next.getTime() + durationSeconds * 1000).toISOString(),
          durationSeconds,
          url: 'https://www.codechef.com/contests'
        });
        next = new Date(next.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
    }

    return contests;
  } catch (err) {
    console.error('fetchCodeChef error:', err);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = getSupabaseClient();
  const updateTimestamp = new Date().toISOString();

  // Determine target month/year to fetch. Accepts query params ?year=YYYY&month=MM (1-12).
  // Defaults to current month in UTC.
  const url = new URL(req.url, 'http://localhost');
  const q = url.searchParams;
  const targetYear = q.has('year') ? Number(q.get('year')) : new Date().getUTCFullYear();
  const targetMonth = q.has('month') ? Number(q.get('month')) - 1 : new Date().getUTCMonth();

  try {
    const results = await Promise.allSettled([
      fetchCodeforces(),
      fetchLeetCode(),
      fetchAtCoder(),
      fetchCodeChef()
    ]);

    const allContests = [];
    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        allContests.push(...r.value);
      } else {
        console.error(`fetcher ${idx} failed:`, r.reason);
      }
    });

    const unique = dedupe(allContests);

    // Filter contests to only include those in the target month/year
    const filtered = unique.filter((c) => {
      if (!c.startTime) return false;
      const d = new Date(c.startTime);
      return d.getUTCFullYear() === targetYear && d.getUTCMonth() === targetMonth;
    });

    // Upsert to Supabase (only month-specific contests)
    const { data, error } = await client.from('contests').upsert(filtered, {
      onConflict: 'id'
    });

    if (error) {
      console.error('supabase upsert error', error);
    }

    // remove expired contests
    const now = new Date().toISOString();
    const { error: delErr } = await client
      .from('contests')
      .delete()
      .lt('endTime', now);

    if (delErr) {
      console.error('supabase delete error', delErr);
    }

    return res.status(200).json({
      updated_at: updateTimestamp,
      requested_year: targetYear,
      requested_month_index: targetMonth,
      total_fetched: allContests.length,
      unique_total: unique.length,
      upserted_for_month: filtered.length
    });
  } catch (err) {
    console.error('updateContests handler error', err);
    return res.status(500).json({ error: 'Update failed' });
  }
}
