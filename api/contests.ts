import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from '../lib/db';
import { Contest } from '../lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .order('startTime', { ascending: true });

    if (error) {
      console.error('supabase select error', error);
      return res.status(500).json({ error: 'Failed to fetch contests' });
    }

    res.status(200).json({ contests: data || [], fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error('handler error', err);
    res.status(500).json({ error: 'Server error' });
  }
}
