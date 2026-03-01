// Import contest data into Supabase for testing
// Run with: npm run import:contests

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && key.trim()) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample contest data
const sampleContests = [
  {
    id: 'cf-2204',
    platform: 'Codeforces',
    name: 'Educational Codeforces Round 188',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 7200,
    url: 'https://codeforces.com/contest/2204'
  },
  {
    id: 'lc-weekly-490',
    platform: 'LeetCode',
    name: 'Weekly Contest 490',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    durationSeconds: 5400,
    url: 'https://leetcode.com/contest/weekly-contest-490/'
  },
  {
    id: 'ac-abc450',
    platform: 'AtCoder',
    name: 'AtCoder Beginner Contest 450',
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 100 * 60 * 1000).toISOString(),
    durationSeconds: 6000,
    url: 'https://atcoder.jp/contests/abc450'
  },
  {
    id: 'cc-starters',
    platform: 'CodeChef',
    name: 'CodeChef Starters 229',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 7200,
    url: 'https://www.codechef.com/contests'
  }
];

async function importContests() {
  try {
    console.log('📥 Importing sample contests to Supabase...\n');

    const { data, error } = await supabase
      .from('contests')
      .insert(sampleContests);

    if (error) {
      console.error('❌ Error inserting data:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error);
      process.exit(1);
    }

    console.log('✅ Successfully inserted sample contests!');
    console.log(`   • Codeforces: ${sampleContests[0].name}`);
    console.log(`   • LeetCode: ${sampleContests[1].name}`);
    console.log(`   • AtCoder: ${sampleContests[2].name}`);
    console.log(`   • CodeChef: ${sampleContests[3].name}`);
    
    // Verify the insert
    const { data: verify, error: verifyError } = await supabase
      .from('contests')
      .select('*');

    if (!verifyError && verify) {
      console.log(`\n📊 Table now contains ${verify.length} contests`);
      console.log('\n✅ Check your Supabase dashboard:');
      console.log('   https://supabase.com/dashboard → Table Editor → contests');
    }
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  }
}

importContests();
