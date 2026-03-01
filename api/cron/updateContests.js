import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

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

    for (let i = 0; i < 10; i++) {
      events.push({ date: new Date(biweekly), type: 'biweekly' });
      biweekly.setUTCDate(biweekly.getUTCDate() + 14);
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
    
    // Basic check - if page loads, return empty (requires Cheerio for full parsing)
    if (html.includes('atcoder')) {
      console.log('AtCoder page fetched but requires Cheerio for parsing');
      return [];
    }
    return [];
  } catch (err) {
    console.error('fetchAtCoder error:', err);
    return [];
  }
}

async function fetchCodeChef() {
  try {
    const now = new Date();
    const events = [];
    let next = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      14,
      30,
      0
    ));
    const dayDiff = (3 - next.getUTCDay() + 7) % 7 || 7;
    next.setUTCDate(next.getUTCDate() + dayDiff);
    const durationSeconds = 2 * 60 * 60;

    for (let i = 0; i < 4; i++) {
      const startTime = next.toISOString();
      events.push({
        id: `starters-${startTime}`,
        platform: 'CodeChef',
        name: `CodeChef Starters`,
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

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = getSupabaseClient();
  const updateTimestamp = new Date().toISOString();

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

    // Upsert to Supabase
    const { data, error } = await client.from('contests').upsert(unique, {
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
      total_fetched: allContests.length,
      unique: unique.length
    });
  } catch (err) {
    console.error('updateContests handler error', err);
    return res.status(500).json({ error: 'Update failed' });
  }
}
