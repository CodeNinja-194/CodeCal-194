import { For, createMemo } from 'solid-js';

function StatCards(props) {
    const stats = createMemo(() => {
        const now = new Date();
        const contests = props.contests || [];

        // Find live contests
        const live = contests.filter(c => {
            const duration = c.duration || 2 * 60 * 60 * 1000;
            const endTime = new Date(c.time.getTime() + duration);
            return c.time <= now && now <= endTime;
        });

        // Find next upcoming contest
        const upcoming = contests.filter(c => c.time > now).sort((a, b) => a.time - b.time);
        const nextContest = upcoming[0];

        // Find today's contests
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

        const todaysContests = contests.filter(c => c.time >= todayStart && c.time <= todayEnd);

        // Calculate time until next contest
        let timeUntilNext = '';
        if (nextContest) {
            const diff = nextContest.time - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                timeUntilNext = `in ${hours}h ${mins}m`;
            } else {
                timeUntilNext = `in ${mins}m`;
            }
        }

        return {
            liveCount: live.length,
            nextContest,
            timeUntilNext,
            todaysCount: todaysContests.length
        };
    });

    return (
        <div class="stat-cards">
            {/* Live Now Card */}
            <div class={`stat-card ${stats().liveCount > 0 ? 'live-active' : ''}`}>
                <div class="stat-icon live-icon">
                    <ion-icon name="radio-outline"></ion-icon>
                </div>
                <div class="stat-info">
                    <div class="stat-label">LIVE NOW</div>
                    <div class="stat-value">
                        {stats().liveCount > 0 ? `${stats().liveCount} Contest${stats().liveCount > 1 ? 's' : ''}` : 'No Live Contests'}
                    </div>
                </div>
            </div>

            {/* Next Contest Card */}
            <div class="stat-card">
                <div class="stat-icon next-icon">
                    <ion-icon name="play-forward-outline"></ion-icon>
                </div>
                <div class="stat-info">
                    <div class="stat-label">NEXT CONTEST</div>
                    <div class="stat-value">
                        {stats().nextContest ? (
                            <>
                                <div class="next-platform">{stats().nextContest.platform}</div>
                                <div class="next-time">{stats().timeUntilNext}</div>
                            </>
                        ) : 'None Scheduled'}
                    </div>
                </div>
            </div>

            {/* Today's Contests Card */}
            <div class="stat-card">
                <div class="stat-icon today-icon">
                    <ion-icon name="calendar-outline"></ion-icon>
                </div>
                <div class="stat-info">
                    <div class="stat-label">TODAY'S CONTESTS</div>
                    <div class="stat-value">{stats().todaysCount} Total</div>
                </div>
            </div>
        </div>
    );
}

export default StatCards;
