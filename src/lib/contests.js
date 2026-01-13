export const fallbackContests = [
    // Week 1-2 (Jan 8-17)
    { id: 1, platform: 'AtCoder', name: 'Beginner Contest 440', time: new Date("2026-01-10T21:00:00"), url: 'https://atcoder.jp/contests/abc440' },
    { id: 2, platform: 'LeetCode', name: 'Weekly Contest 484', time: new Date("2026-01-11T08:00:00"), url: 'https://leetcode.com/contest/weekly-contest-484/' },
    { id: 3, platform: 'AtCoder', name: 'Regular Contest 212', time: new Date("2026-01-11T21:00:00"), url: 'https://atcoder.jp/contests/arc212' },
    { id: 4, platform: 'CodeForces', name: 'Div 3 Round 1072', time: new Date("2026-01-12T17:35:00"), url: 'https://codeforces.com/contests' },
    { id: 5, platform: 'CodeChef', name: 'Starters 221', time: new Date("2026-01-14T20:00:00"), url: 'https://www.codechef.com/contests' },
    { id: 6, platform: 'CodeForces', name: 'Div 2 Round 1073', time: new Date("2026-01-15T20:35:00"), url: 'https://codeforces.com/contests' },
    { id: 7, platform: 'LeetCode', name: 'Biweekly Contest 174', time: new Date("2026-01-17T07:30:00"), url: 'https://leetcode.com/contest/biweekly-contest-174/' },
    { id: 8, platform: 'AtCoder', name: 'Beginner Contest 441', time: new Date("2026-01-17T21:00:00"), url: 'https://atcoder.jp/contests/abc441' },

    // Week 3 (Jan 18-24)
    { id: 9, platform: 'LeetCode', name: 'Weekly Contest 485', time: new Date("2026-01-18T08:00:00"), url: 'https://leetcode.com/contest/weekly-contest-485/' },
    { id: 10, platform: 'CodeForces', name: 'Educational Round 178', time: new Date("2026-01-19T17:35:00"), url: 'https://codeforces.com/contests' },
    { id: 11, platform: 'CodeChef', name: 'Starters 222', time: new Date("2026-01-21T20:00:00"), url: 'https://www.codechef.com/contests' },
    { id: 12, platform: 'CodeForces', name: 'Div 1+2 Round 1074', time: new Date("2026-01-22T20:35:00"), url: 'https://codeforces.com/contests' },
    { id: 13, platform: 'AtCoder', name: 'Beginner Contest 442', time: new Date("2026-01-24T21:00:00"), url: 'https://atcoder.jp/contests/abc442' },

    // Week 4 (Jan 25-31)
    { id: 14, platform: 'LeetCode', name: 'Weekly Contest 486', time: new Date("2026-01-25T08:00:00"), url: 'https://leetcode.com/contest/weekly-contest-486/' },
    { id: 15, platform: 'CodeForces', name: 'Div 2 Round 1075', time: new Date("2026-01-26T17:35:00"), url: 'https://codeforces.com/contests' },
    { id: 16, platform: 'CodeChef', name: 'Starters 223', time: new Date("2026-01-28T20:00:00"), url: 'https://www.codechef.com/contests' },
    { id: 17, platform: 'LeetCode', name: 'Biweekly Contest 175', time: new Date("2026-01-31T07:30:00"), url: 'https://leetcode.com/contest/biweekly-contest-175/' },
    { id: 18, platform: 'AtCoder', name: 'Beginner Contest 443', time: new Date("2026-01-31T21:00:00"), url: 'https://atcoder.jp/contests/abc443' },

    // February Week 1 (Feb 1-7)
    { id: 19, platform: 'LeetCode', name: 'Weekly Contest 487', time: new Date("2026-02-01T08:00:00"), url: 'https://leetcode.com/contest/weekly-contest-487/' },
    { id: 20, platform: 'CodeForces', name: 'Div 3 Round 1076', time: new Date("2026-02-02T17:35:00"), url: 'https://codeforces.com/contests' },
    { id: 21, platform: 'CodeChef', name: 'Starters 224', time: new Date("2026-02-04T20:00:00"), url: 'https://www.codechef.com/contests' },
    { id: 22, platform: 'AtCoder', name: 'Regular Contest 213', time: new Date("2026-02-07T21:00:00"), url: 'https://atcoder.jp/contests/arc213' },
    { id: 23, platform: 'AtCoder', name: 'Beginner Contest 444', time: new Date("2026-02-07T21:00:00"), url: 'https://atcoder.jp/contests/abc444' }
];

export async function fetchContests() {
    const ONE_HOUR = 60 * 60 * 1000;
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    // Check cache first
    const cachedData = localStorage.getItem('codecal_cache');
    const cacheTime = localStorage.getItem('codecal_cache_time');

    if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime) < ONE_HOUR)) {
        const contests = JSON.parse(cachedData);
        contests.forEach(c => c.time = new Date(c.time));
        return filterContestsByTimeRange(contests);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch('https://kontests.net/api/v1/all', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        const apiContests = data.filter(c =>
            ['LeetCode', 'CodeChef', 'CodeForces', 'AtCoder'].includes(c.site) ||
            c.url.includes('leetcode') || c.url.includes('codechef') ||
            c.url.includes('codeforces') || c.url.includes('atcoder')
        ).map((c, index) => ({
            id: index + 100,
            platform: c.site || 'Other',
            name: c.name,
            time: new Date(c.start_time),
            duration: parseDuration(c.duration), // Store duration for accurate status
            url: c.url
        }));

        // Filter and sort contests
        const contests = filterContestsByTimeRange(apiContests);

        // Cache results
        localStorage.setItem('codecal_cache', JSON.stringify(apiContests));
        localStorage.setItem('codecal_cache_time', Date.now().toString());

        return contests;
    } catch (error) {
        console.error("Fetch failed:", error);
        // Use fallback and filter
        const filtered = filterContestsByTimeRange(fallbackContests);
        localStorage.setItem('codecal_cache', JSON.stringify(fallbackContests));
        localStorage.setItem('codecal_cache_time', Date.now().toString());
        return filtered;
    }
}

// Parse duration string to milliseconds (e.g., "02:00:00" -> 7200000)
function parseDuration(durationStr) {
    if (!durationStr) return 2 * 60 * 60 * 1000; // Default 2 hours
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 3) {
        return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    }
    return 2 * 60 * 60 * 1000; // Default 2 hours
}

// Filter contests: show upcoming (within 30 days) and recently ended (within 24 hours)
function filterContestsByTimeRange(contests) {
    const now = new Date();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    return contests.filter(c => {
        const contestTime = c.time instanceof Date ? c.time : new Date(c.time);
        const timeDiff = contestTime - now;
        const duration = c.duration || 2 * 60 * 60 * 1000;
        const contestEndTime = new Date(contestTime.getTime() + duration);
        const timeSinceEnd = now - contestEndTime;

        // Include if: upcoming within 30 days OR ended within last 24 hours
        const isUpcoming = timeDiff > 0 && timeDiff <= THIRTY_DAYS;
        const isRecentlyEnded = timeSinceEnd > 0 && timeSinceEnd <= TWENTY_FOUR_HOURS;
        const isLive = timeDiff <= 0 && timeSinceEnd <= 0;

        return isUpcoming || isRecentlyEnded || isLive;
    }).sort((a, b) => {
        // Sort: Live first, then upcoming by time, then ended
        const now = new Date();
        const aTime = a.time instanceof Date ? a.time : new Date(a.time);
        const bTime = b.time instanceof Date ? b.time : new Date(b.time);
        const aDuration = a.duration || 2 * 60 * 60 * 1000;
        const bDuration = b.duration || 2 * 60 * 60 * 1000;

        const aEnded = now > new Date(aTime.getTime() + aDuration);
        const bEnded = now > new Date(bTime.getTime() + bDuration);
        const aLive = aTime <= now && !aEnded;
        const bLive = bTime <= now && !bEnded;

        // Live contests first
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;

        // Ended contests last
        if (aEnded && !bEnded) return 1;
        if (!aEnded && bEnded) return -1;

        // Sort by time
        return aTime - bTime;
    });
}
