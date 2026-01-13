import { For, Show, createMemo } from 'solid-js';

function ContestCard(props) {
    const contest = props.contest;
    const timeStr = contest.time.toLocaleString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate End Time
    const duration = contest.duration || 2 * 60 * 60 * 1000;
    const endTime = new Date(contest.time.getTime() + duration);
    const endTimeStr = endTime.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric' // Show day if it spans across days? Usually just time if same day.
    });

    const getContestStatus = () => {
        const now = new Date();
        const diff = contest.time - now;
        const timeSinceStart = now - contest.time;

        // Contest has ended
        if (timeSinceStart > duration) {
            return { text: 'Ended', class: 'status-ended' };
        }
        // Contest is live
        if (diff < 0 && timeSinceStart <= duration) {
            return { text: 'Live Now', class: 'status-live' };
        }
        // Contest is upcoming
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return { text: `${days}d ${hours}h`, class: 'status-upcoming' };
        if (hours > 0) return { text: `${hours}h ${mins}m`, class: 'status-upcoming' };
        return { text: `${mins}m`, class: 'status-soon' };
    };

    const status = getContestStatus();

    return (
        <div class={`contest-card ${contest.platform.toLowerCase()}`}>
            <div class="card-header">
                <span class={`platform-badge ${contest.platform.toLowerCase()}`}>
                    {contest.platform}
                </span>
                <span class={`countdown ${status.class}`}>{status.text}</span>
            </div>
            <h3 class="contest-name">{contest.name}</h3>
            <div class="contest-time">
                <ion-icon name="time-outline"></ion-icon>
                <span>{timeStr}</span>
            </div>
            {/* Show End Time, especially when filtered or generically useful */}
            <div class="end-time">
                <ion-icon name="hourglass-outline"></ion-icon>
                <span>Ends: {endTimeStr}</span>
            </div>

            <a href={contest.url} target="_blank" rel="noopener" class="join-btn">
                <ion-icon name="open-outline"></ion-icon>
                {status.class === 'status-ended' ? 'View Problems' : 'Join Contest'}
            </a>
        </div>
    );
}

function ContestGrid(props) {
    const platforms = ['all', 'LeetCode', 'CodeChef', 'CodeForces', 'AtCoder'];

    const categorized = createMemo(() => {
        const live = [];
        const upcoming = [];
        const ended = [];
        const now = new Date();

        // Sort by time
        const sorted = [...props.contests].sort((a, b) => a.time - b.time);

        sorted.forEach(c => {
            // Apply Filter Logic Here
            if (props.activeFilter !== 'all' && c.platform !== props.activeFilter) return;

            const duration = c.duration || 2 * 60 * 60 * 1000;
            const endTime = new Date(c.time.getTime() + duration);

            if (now > endTime) {
                ended.push(c);
            } else if (c.time <= now && now <= endTime) {
                live.push(c);
            } else {
                upcoming.push(c);
            }
        });
        return { live, upcoming, ended };
    });

    return (
        <div class="split-layout">
            <div class="upcoming-side">
                <div class="platform-filters-inline">
                    <For each={platforms}>
                        {(platform) => (
                            <button
                                class={`filter-chip ${props.activeFilter === platform ? 'active' : ''}`}
                                onClick={() => props.onFilter(platform)}
                            >
                                {platform === 'all' ? 'All' : platform}
                            </button>
                        )}
                    </For>
                </div>

                <Show when={categorized().live.length > 0}>
                    <h2 class="section-title">Live Now</h2>
                    <div class="contest-grid">
                        <For each={categorized().live}>
                            {(c) => <ContestCard contest={c} />}
                        </For>
                    </div>
                </Show>

                <Show when={categorized().upcoming.length > 0}>
                    <h2 class="section-title">Upcoming</h2>
                    <div class="contest-grid">
                        <For each={categorized().upcoming}>
                            {(c) => <ContestCard contest={c} />}
                        </For>
                    </div>
                </Show>

                <Show when={
                    categorized().live.length === 0 &&
                    categorized().upcoming.length === 0 &&
                    (props.activeFilter !== 'all' || props.contests.length > 0)
                }>
                    <div class="no-contests">No upcoming contests found.</div>
                </Show>
            </div>

            <div class="ended-side">
                <Show when={categorized().ended.length > 0}>
                    <h2 class="section-title">Ended Automatically Today</h2>
                    <div class="contest-grid ended-grid">
                        <For each={categorized().ended}>
                            {(c) => <ContestCard contest={c} />}
                        </For>
                    </div>
                </Show>
                <Show when={categorized().ended.length === 0 && (props.activeFilter !== 'all' || props.contests.length > 0)}>
                    <div class="no-contests">No ended contests today.</div>
                </Show>
            </div>
        </div>
    );
}

export default ContestGrid;
