import { createClient } from '@supabase/supabase-js';

let supabase = null;

function getSupabaseClient() {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variable');
  }

  supabase = createClient(url, anonKey);
  return supabase;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('contests')
      .select('*')
      .order('startTime', { ascending: true });

    if (error) {
      console.error('supabase select error', error);
      return res.status(500).json({ error: 'Failed to fetch contests' });
    }

    return res.status(200).json({ 
      contests: data || [], 
      fetchedAt: new Date().toISOString() 
    });
  } catch (err) {
    console.error('handler error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
