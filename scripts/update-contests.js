// Automated script to fetch contest data from platforms and update public/contests.json
// This script runs on GitHub Actions and skips the database dependency.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'contests.json');

// Helper: Ensure directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 1. Codeforces Fetcher
async function fetchCodeforces() {
    try {
        console.log('🟦 Fetching Codeforces...');
        const res = await fetch('https://codeforces.com/api/contest.list?gym=false');
        const data = await res.json();
        if (data.status !== 'OK') return [];
        return data.result
            .filter(c => c.phase === 'BEFORE')
            .map(c => ({
                platform: 'CodeForces',
                name: c.name,
                time: new Date(c.startTimeSeconds * 1000).toISOString(),
                url: `https://codeforces.com/contest/${c.id}`,
                duration: c.durationSeconds
            }));
    } catch (err) {
        console.error('❌ Codeforces error:', err.message);
        return [];
    }
}

// 2. AtCoder Fetcher (Cheerio)
async function fetchAtCoder() {
    try {
        console.log('🟥 Fetching AtCoder...');
        const res = await fetch('https://atcoder.jp/contests/');
        const html = await res.text();
        const $ = cheerio.load(html);
        const contests = [];

        $('#contest-table-upcoming tbody tr').each((i, row) => {
            const cols = $(row).find('td');
            if (cols.length < 3) return;

            const timeText = $(cols[0]).text().trim();
            const nameEl = $(cols[1]).find('a');
            const name = nameEl.text().trim();
            const url = 'https://atcoder.jp' + nameEl.attr('href');
            const durText = $(cols[2]).text().trim();

            const timeMatch = /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/.exec(timeText);
            if (!timeMatch) return;
            const [_full, datePart, timePart] = timeMatch;
            const [year, month, day] = datePart.split('-').map(Number);
            const [hour, minute] = timePart.split(':').map(Number);

            // JST to UTC conversion (UTC+9)
            const startUTC = new Date(Date.UTC(year, month - 1, day, hour - 9, minute));

            // Basic duration parsing "02:00" -> 7200
            const parts = durText.split(':').map(Number);
            const duration = parts.length === 2 ? parts[0] * 3600 + parts[1] * 60 : parts[0] * 3600 + parts[1] * 60 + parts[2];

            contests.push({
                platform: 'AtCoder',
                name,
                time: startUTC.toISOString(),
                url,
                duration
            });
        });
        return contests;
    } catch (err) {
        console.error('❌ AtCoder error:', err.message);
        return [];
    }
}

// 3. LeetCode Generator (Predictive)
function generateLeetCode() {
    console.log('🟩 Generating LeetCode schedule...');
    const now = new Date();
    const contests = [];

    // Weekly: Sunday 8:00 UTC
    let weekly = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 8, 0, 0));
    weekly.setUTCDate(weekly.getUTCDate() + (7 - weekly.getUTCDay()) % 7);
    if (weekly < now) weekly.setUTCDate(weekly.getUTCDate() + 7);

    for (let i = 0; i < 4; i++) {
        contests.push({
            platform: 'LeetCode',
            name: `Weekly Contest (${weekly.toISOString().split('T')[0]})`,
            time: weekly.toISOString(),
            url: 'https://leetcode.com/contest/',
            duration: 5400 // 90 min
        });
        weekly.setUTCDate(weekly.getUTCDate() + 7);
    }

    // Biweekly: Sat 8:00 UTC (Anchor: Jan 3 2026)
    const anchor = new Date(Date.UTC(2026, 0, 3, 8, 0, 0));
    let biweekly = new Date(anchor);
    while (biweekly < now) {
        biweekly.setUTCDate(biweekly.getUTCDate() + 14);
    }
    for (let i = 0; i < 2; i++) {
        contests.push({
            platform: 'LeetCode',
            name: `Biweekly Contest (${biweekly.toISOString().split('T')[0]})`,
            time: biweekly.toISOString(),
            url: 'https://leetcode.com/contest/',
            duration: 5400
        });
        biweekly.setUTCDate(biweekly.getUTCDate() + 14);
    }
    return contests;
}

// 4. CodeChef Generator (Predictive)
function generateCodeChef() {
    console.log('🟨 Generating CodeChef schedule...');
    const now = new Date();
    const contests = [];

    // Starters: Wednesday 14:30 UTC
    let next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 14, 30, 0));
    next.setUTCDate(next.getUTCDate() + (3 - next.getUTCDay() + 7) % 7);
    if (next < now) next.setUTCDate(next.getUTCDate() + 7);

    for (let i = 0; i < 4; i++) {
        contests.push({
            platform: 'CodeChef',
            name: `Starters Contest (${next.toISOString().split('T')[0]})`,
            time: next.toISOString(),
            url: 'https://www.codechef.com/contests',
            duration: 7200 // 2 hours
        });
        next.setUTCDate(next.getUTCDate() + 7);
    }
    return contests;
}

async function run() {
    console.log('🚀 Starting Manual Sync...');

    const [cf, ac] = await Promise.all([fetchCodeforces(), fetchAtCoder()]);
    const lc = generateLeetCode();
    const cc = generateCodeChef();

    const all = [...cf, ...ac, ...lc, ...cc];

    // Sort by time
    all.sort((a, b) => new Date(a.time) - new Date(b.time));

    // Deduplicate by Name + Time
    const unique = Array.from(new Map(all.map(c => [c.name + c.time, c])).values());

    const result = {
        updated_at: new Date().toISOString(),
        count: unique.length,
        contests: unique
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ Success! Written ${unique.length} contests to ${OUTPUT_FILE}`);
}

run().catch(err => {
    console.error('💥 Sync failed:', err);
    process.exit(1);
});
