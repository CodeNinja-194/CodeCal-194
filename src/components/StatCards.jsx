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

        // Find recently ended contests
        let finished = contests.filter(c => {
            const duration = typeof c.duration === 'number' ? c.duration : 2 * 60 * 60 * 1000;
            const endTime = new Date(c.time.getTime() + duration);
            return endTime < now;
        }).sort((a, b) => b.time - a.time);

        // Ensure we show at least one from each major platform if possible
        const recentlyEnded = [];
        const platforms = ['LeetCode', 'CodeForces', 'CodeChef', 'AtCoder'];

        // Strategy: First add all that ended today
        const endedToday = finished.filter(c => now - new Date(c.time.getTime() + (c.duration || 2 * 60 * 60 * 1000)) < 24 * 60 * 60 * 1000);
        recentlyEnded.push(...endedToday);

        // If still fewer than 4, add the most recent ones from major platforms
        if (recentlyEnded.length < 4) {
            platforms.forEach(p => {
                if (!recentlyEnded.find(c => c.platform === p)) {
                    const last = finished.find(c => c.platform === p);
                    if (last) recentlyEnded.push(last);
                }
            });
        }

        const finalRecentlyEnded = recentlyEnded.sort((a, b) => b.time - a.time).slice(0, 4);

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
            todaysCount: todaysContests.length,
            recentlyEnded: finalRecentlyEnded
        };
    });

    return (
        <div class="stat-cards">
            {/* Live Now Card - Pulse Central */}
            <div class={`stat-card card-live ${stats().liveCount > 0 ? 'is-live' : 'is-idle'}`}>
                <div class="card-glass"></div>
                <div class="card-accent"></div>
                <div class="stat-card-inner">
                    <div class="card-top">
                        <span class="live-status-tag">
                            <span class="status-dot"></span>
                            {stats().liveCount > 0 ? 'ACTIVE NOW' : 'IDLE'}
                        </span>
                        <div class="stat-icon-new">
                            <ion-icon name="radio-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="card-main">
                        <div class="stat-value-big">{stats().liveCount}</div>
                        <div class="stat-label-new">ONGOING CHALLENGES</div>
                    </div>
                    <div class="card-bg-icon">
                        <ion-icon name="pulse"></ion-icon>
                    </div>
                </div>
            </div>

            {/* Next Contest Card - Countdown Style */}
            <div class="stat-card card-next">
                <div class="card-glass"></div>
                <div class="stat-card-inner">
                    <div class="card-top">
                        <div class="next-badge">UPCOMING</div>
                        <div class="stat-icon-new">
                            <ion-icon name="time-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="card-main">
                        <Show when={stats().nextContest} fallback={<div class="stat-value-mid">NONE</div>}>
                            <div class="next-platform-row">
                                <span class={`p-dot p-dot-${stats().nextContest.platform.toLowerCase()}`}></span>
                                {stats().nextContest.platform}
                            </div>
                            <div class="next-countdown">{stats().timeUntilNext}</div>
                        </Show>
                    </div>
                    <div class="card-bg-icon">
                        <ion-icon name="hourglass-outline"></ion-icon>
                    </div>
                </div>
            </div>

            {/* Recently Ended Card - Hall of Fame Style */}
            <div class="stat-card card-ended clickable-stat" onClick={() => document.getElementById('ended-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <div class="card-glass"></div>
                <div class="stat-card-inner">
                    <div class="card-top">
                        <div class="ended-badge">RECENT FINISH</div>
                        <div class="stat-icon-new">
                            <ion-icon name="ribbon-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="card-main">
                        <div class="mini-hall-of-fame">
                            <For each={stats().recentlyEnded.slice(0, 3)}>
                                {(c) => (
                                    <div class="hall-item">
                                        <span class={`hall-dot dot-${c.platform.toLowerCase()}`}></span>
                                        <span class="hall-name">{c.name.substring(0, 24)}</span>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                    <div class="card-bg-icon">
                        <ion-icon name="medal-outline"></ion-icon>
                    </div>
                </div>
            </div>

            {/* Today's Card - Agenda Style */}
            <div class="stat-card card-today">
                <div class="card-glass"></div>
                <div class="stat-card-inner">
                    <div class="card-top">
                        <div class="today-badge">TODAY</div>
                        <div class="stat-icon-new">
                            <ion-icon name="calendar-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="card-main">
                        <div class="stat-value-big">{stats().todaysCount}</div>
                        <div class="stat-label-new">CHALLENGES SCHEDULED</div>
                    </div>
                    <div class="card-bg-icon">
                        <ion-icon name="rocket-outline"></ion-icon>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatCards;
