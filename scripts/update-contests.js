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

// Helper: Shorten Name & Remove Dates
function shortenName(name) {
    if (!name) return '';

    // Remove (YYYY-MM-DD) or (YYYY-MM-DD HH:mm) patterns
    let clean = name.replace(/\(\d{4}-\d{2}-\d{2}.*?\)/gi, '').trim();

    // Remove common annoying prefixes/suffixes
    let short = clean
        .replace(/202[4-6]\s+/gi, '') // Remove year
        // Specific ICPC cleanup
        .replace(/ICPC/g, 'ICPC') // Normalize case
        .replace(/ICPC\s+ICPC/g, 'ICPC') // De-duplicate
        .replace(/Asia Pacific Championship - Online Mirror/gi, 'Asia Pacific (Mirror)')
        .replace(/\(Unrated, Online Mirror, ICPC Rules, Teams Preferred\)/gi, '')
        .replace(/\(Rated for Div. \d\)/gi, '')
        .replace(/\(Div. (\d) \+ Div. (\d)\)/gi, 'Div $1+$2')
        .replace(/\(Div. (\d)\)/gi, 'Div $1')
        .replace(/AtCoder Beginner Contest\s*/gi, 'ABC ')
        .replace(/AtCoder Regular Contest\s*/gi, 'ARC ')
        .replace(/AtCoder Grand Contest\s*/gi, 'AGC ')
        .replace(/AtCoder Heuristic Contest\s*/gi, 'AHC ')
        .replace(/Weekly Contest \(\d{4}-\d{2}-\d{2}\)/gi, 'Weekly Contest') // Extra fallback
        .replace(/Biweekly Contest \(\d{4}-\d{2}-\d{2}\)/gi, 'Biweekly Contest')
        .replace(/Starters Contest/gi, 'Starters')
        .replace(/\s+/g, ' ')
        .trim();

    // If still too long, cap it
    if (short.length > 50) {
        short = short.substring(0, 47) + '...';
    }

    return short;
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
                name: shortenName(c.name),
                time: new Date(c.startTimeSeconds * 1000).toISOString(),
                url: `https://codeforces.com/contest/${c.id}`,
                duration: (c.durationSeconds || 7200) * 1000
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

            const parts = durText.split(':').map(Number);
            let duration = 0;
            if (parts.length === 2) duration = (parts[0] * 3600 + parts[1] * 60) * 1000;
            else if (parts.length === 3) duration = (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;

            contests.push({
                platform: 'AtCoder',
                name: shortenName(name),
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

// 3. LeetCode Generator (Predictive with Numbering)
function generateLeetCode() {
    console.log('🟩 Generating LeetCode schedule with numbering...');
    const now = new Date();
    const contests = [];

    // Reference: Weekly 490 was 2026-02-22
    const weeklyBaselineDate = new Date(Date.UTC(2026, 1, 22, 8, 0, 0));
    const weeklyBaselineNum = 490;

    // Weekly: Sunday 8:00 UTC
    let weekly = new Date(weeklyBaselineDate);
    let weeklyNum = weeklyBaselineNum;

    while (weekly < now) {
        weekly.setUTCDate(weekly.getUTCDate() + 7);
        weeklyNum++;
    }

    for (let i = 0; i < 4; i++) {
        contests.push({
            platform: 'LeetCode',
            name: `Weekly Contest ${weeklyNum}`,
            time: weekly.toISOString(),
            url: 'https://leetcode.com/contest/',
            duration: 90 * 60 * 1000
        });
        weekly.setUTCDate(weekly.getUTCDate() + 7);
        weeklyNum++;
    }

    // Reference: Biweekly 177 was 2026-02-28
    const biweeklyBaselineDate = new Date(Date.UTC(2026, 1, 28, 8, 0, 0));
    const biweeklyBaselineNum = 177;

    let biweekly = new Date(biweeklyBaselineDate);
    let biweeklyNum = biweeklyBaselineNum;

    while (biweekly < now) {
        biweekly.setUTCDate(biweekly.getUTCDate() + 14);
        biweeklyNum++;
    }

    for (let i = 0; i < 2; i++) {
        contests.push({
            platform: 'LeetCode',
            name: `Biweekly Contest ${biweeklyNum}`,
            time: biweekly.toISOString(),
            url: 'https://leetcode.com/contest/',
            duration: 90 * 60 * 1000
        });
        biweekly.setUTCDate(biweekly.getUTCDate() + 14);
        biweeklyNum++;
    }
    return contests;
}

// 4. CodeChef Generator (Predictive with Numbering)
function generateCodeChef() {
    console.log('🟨 Generating CodeChef schedule with numbering...');
    const now = new Date();
    const contests = [];

    // Reference: Starters 227 was 2026-02-25
    const baselineDate = new Date(Date.UTC(2026, 1, 25, 14, 30, 0));
    const baselineNum = 227;

    let next = new Date(baselineDate);
    let nextNum = baselineNum;

    while (next < now) {
        next.setUTCDate(next.getUTCDate() + 7);
        nextNum++;
    }

    for (let i = 0; i < 4; i++) {
        contests.push({
            platform: 'CodeChef',
            name: `Starters ${nextNum}`,
            time: next.toISOString(),
            url: 'https://www.codechef.com/contests',
            duration: 2 * 60 * 60 * 1000
        });
        next.setUTCDate(next.getUTCDate() + 7);
        nextNum++;
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

    // Deduplicate by Platform + Time
    const unique = Array.from(new Map(all.map(c => [c.platform + c.time, c])).values());

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
