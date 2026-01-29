// Vercel Serverless Function to scrape contests
// This helps bypass CORS and provides a "daily refresh" endpoint
export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log("Refreshing contests...");

        // Fetch from multiple sources for reliability
        const sources = [
            'https://kontests.net/api/v1/all',
            'https://codeforces.com/api/contest.list?gym=false'
        ];

        const results = await Promise.allSettled(sources.map(s => fetch(s).then(r => r.json())));

        const contests = [];

        // Process Kontests data
        if (results[0].status === 'fulfilled') {
            const data = results[0].value;
            data.forEach(c => {
                contests.push({
                    platform: c.site || 'Other',
                    name: c.name,
                    time: c.start_time,
                    url: c.url,
                    duration: c.duration
                });
            });
        }

        // Process CodeForces direct data
        if (results[1].status === 'fulfilled') {
            const data = results[1].value;
            if (data.status === 'OK') {
                data.result.filter(c => c.phase === 'BEFORE').forEach(c => {
                    contests.push({
                        platform: 'CodeForces',
                        name: c.name,
                        time: new Date(c.startTimeSeconds * 1000).toISOString(),
                        url: `https://codeforces.com/contest/${c.id}`,
                        duration: c.durationSeconds
                    });
                });
            }
        }

        // Remove duplicates and sort
        const uniqueContests = Array.from(new Map(contests.map(c => [c.name + c.time, c])).values())
            .sort((a, b) => new Date(a.time) - new Date(b.time));

        // In a real app, you'd save this to a database or KV store
        // For now, we return it to whoever called the cron/refresh
        res.status(200).json({
            updated_at: new Date().toISOString(),
            count: uniqueContests.length,
            contests: uniqueContests
        });
    } catch (error) {
        console.error("Refresh failed:", error);
        res.status(500).json({ error: 'Failed to refresh contests' });
    }
}
