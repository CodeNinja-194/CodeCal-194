import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchCodeforces } from '../../lib/fetchers/codeforces';
import { fetchLeetCode } from '../../lib/fetchers/leetcode';
import { fetchAtCoder } from '../../lib/fetchers/atcoder';
import { fetchCodeChef } from '../../lib/fetchers/codechef';
import { getSupabaseClient } from '../../lib/db';
import { Contest } from '../../lib/types';

// Helper: deduplicate and sort
function dedupe(contests: Contest[]): Contest[] {
  const map = new Map<string, Contest>();
  contests.forEach((c) => {
    const key = `${c.platform}|${c.name}|${c.startTime}`;
    if (!map.has(key)) {
      map.set(key, c);
    }
  });
  return Array.from(map.values()).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const supabase = getSupabaseClient();
  const updateTimestamp = new Date().toISOString();

  try {
    const results = await Promise.allSettled([
      fetchCodeforces(),
      fetchLeetCode(),
      fetchAtCoder(),
      fetchCodeChef()
    ]);

    const allContests: Contest[] = [];
    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        allContests.push(...r.value);
      } else {
        console.error(`fetcher ${idx} failed:`, r.reason);
      }
    });

    const unique = dedupe(allContests);

    // Upsert to Supabase
    const { data, error } = await supabase.from('contests').upsert(unique, {
      onConflict: 'id'
    });

    if (error) {
      console.error('supabase upsert error', error);
      // continue, not fatal
    }

    // remove expired contests (endTime in past)
    const now = new Date().toISOString();
    const { error: delErr } = await supabase
      .from('contests')
      .delete()
      .lt('endTime', now);

    if (delErr) {
      console.error('supabase delete error', delErr);
    }

    res.status(200).json({
      updated_at: updateTimestamp,
      total_fetched: allContests.length,
      unique: unique.length
    });
  } catch (err) {
    console.error('updateContests handler error', err);
    res.status(500).json({ error: 'Update failed' });
  }
}
