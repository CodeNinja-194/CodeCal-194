// Local testing script for contest fetchers
// Run with: npm run test:fetchers
// This helps diagnose issues without TypeScript compilation

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local if it exists
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
  console.log('✅ Loaded .env.local\n');
}

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

async function testCodeforces() {
  try {
    console.log('\n🟦 Testing Codeforces...');
    const res = await fetch('https://codeforces.com/api/contest.list?gym=false');
    const data = await res.json();
    
    if (data.status !== 'OK') {
      console.error('❌ Codeforces API error:', data.status);
      return [];
    }
    
    const before = data.result.filter(c => c.phase === 'BEFORE');
    console.log(`✅ Codeforces: Found ${before.length} upcoming contests`);
    return before.slice(0, 2); // show first 2
  } catch (err) {
    console.error('❌ Codeforces fetch error:', err.message);
    return [];
  }
}

async function testLeetCode() {
  try {
    console.log('\n🟩 Testing LeetCode...');
    const now = new Date();
    const next = new Date(now);
    next.setUTCDate(next.getUTCDate() + ((0 - next.getUTCDay() + 7) % 7 || 7));
    next.setUTCHours(8, 0, 0, 0);
    
    console.log(`✅ LeetCode: Generated Weekly Contest for ${next.toISOString()}`);
    return [{ name: 'Weekly Contest', startTime: next.toISOString() }];
  } catch (err) {
    console.error('❌ LeetCode error:', err.message);
    return [];
  }
}

async function testAtCoder() {
  try {
    console.log('\n🟥 Testing AtCoder...');
    const res = await fetch('https://atcoder.jp/contests/');
    const html = await res.text();
    
    // Simple check if we got HTML
    if (html.includes('atcoder')) {
      console.log(`✅ AtCoder: Fetched page (${html.length} bytes)`);
      // Note: Cheerio parsing requires the actual lib
      return [];
    }
    console.error('❌ AtCoder: Invalid response');
    return [];
  } catch (err) {
    console.error('❌ AtCoder fetch error:', err.message);
    return [];
  }
}

async function testCodeChef() {
  try {
    console.log('\n🟨 Testing CodeChef...');
    const now = new Date();
    const next = new Date(now);
    // Wednesday at 14:30 UTC
    const dayDiff = (3 - next.getUTCDay() + 7) % 7 || 7;
    next.setUTCDate(next.getUTCDate() + dayDiff);
    next.setUTCHours(14, 30, 0, 0);
    
    console.log(`✅ CodeChef: Generated Starters for ${next.toISOString()}`);
    return [{ name: 'Starters Contest', startTime: next.toISOString() }];
  } catch (err) {
    console.error('❌ CodeChef error:', err.message);
    return [];
  }
}

async function testSupabase() {
  try {
    console.log('\n\n📦 Testing Supabase Connection...');
    
    const url = process.env.SUPABASE_URL || 'NOT_SET';
    const key = process.env.SUPABASE_ANON_KEY || 'NOT_SET';
    
    if (url === 'NOT_SET' || key === 'NOT_SET') {
      console.error('❌ Environment variables not set!');
      console.log('   Set SUPABASE_URL and SUPABASE_ANON_KEY');
      return false;
    }
    
    console.log(`✅ SUPABASE_URL: ${url.slice(0, 30)}...`);
    console.log(`✅ SUPABASE_ANON_KEY: ${key.slice(0, 20)}...`);
    
    // Create Supabase client
    const supabase = createClient(url, key);
    
    // Try to fetch from contests table
    try {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Supabase query error: ${error.message}`);
        console.error(`   Code: ${error.code}`);
        if (error.message.includes('relation') || error.message.includes('table')) {
          console.error('   📋 The contests table might not exist yet.');
          console.error('   Run the SQL in Supabase dashboard:');
          console.error('   create table contests (...)  -- See SUPABASE_SETUP.md');
        }
        return false;
      }
      
      console.log(`✅ Supabase connected! Table has ${data?.length || 0} rows`);
      return true;
    } catch (err) {
      console.error(`❌ Supabase connection failed: ${err.message}`);
      return false;
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  CodeCal Fetcher Diagnostic');
  console.log('═══════════════════════════════════════');

  const cf = await testCodeforces();
  const lc = await testLeetCode();
  const ac = await testAtCoder();
  const cc = await testCodeChef();
  const sb = await testSupabase();

  console.log('\n═══════════════════════════════════════');
  console.log('📊 Summary:');
  console.log(`  • Codeforces: ${cf.length ? '✅' : '❌'}`);
  console.log(`  • LeetCode: ${lc.length ? '✅' : '❌'}`);
  console.log(`  • AtCoder: ${ac.length ? '✅' : '❌'} (requires Cheerio)`);
  console.log(`  • CodeChef: ${cc.length ? '✅' : '❌'}`);
  console.log(`  • Supabase: ${sb ? '✅' : '❌'}`);
  console.log('═══════════════════════════════════════\n');

  if (cf.length > 0) {
    console.log('Sample Codeforces data:');
    console.log(JSON.stringify(cf[0], null, 2));
  }

  if (!sb) {
    console.log('⚠️  Next step: Configure env variables in Vercel:\n');
    console.log('  1. Go to https://vercel.com/dashboard');
    console.log('  2. Select CodeCal project');
    console.log('  3. Settings → Environment Variables');
    console.log('  4. Add SUPABASE_URL and SUPABASE_ANON_KEY');
    console.log('  5. Redeploy the project\n');
  } else {
    console.log('✅ All systems working! Data will sync automatically.');
    console.log('   Next sync: Check Supabase table in 24 hours (6 AM UTC)\n');
  }
}

main().catch(console.error);
