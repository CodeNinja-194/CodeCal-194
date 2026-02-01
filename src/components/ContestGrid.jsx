import { For, Show, createMemo, createSignal, onMount, onCleanup } from 'solid-js';

function ContestCard(props) {
    const contest = props.contest;
    const [now, setNow] = createSignal(new Date());

    onMount(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        onCleanup(() => clearInterval(timer));
    });

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
        day: 'numeric'
    });

    const getContestStatus = () => {
        const currentTime = now();
        const diff = contest.time - currentTime;
        const timeSinceStart = currentTime - contest.time;

        // Contest has ended
        if (timeSinceStart > duration) {
            return { text: 'Ended', class: 'status-ended' };
        }
        // Contest is live
        if (diff < 0 && timeSinceStart <= duration) {
            return { text: 'Live Now', class: 'status-live' };
        }

        // Contest is upcoming
        const totalSecs = Math.floor(diff / 1000);
        if (totalSecs < 0) return { text: 'Starting...', class: 'status-soon' };

        const days = Math.floor(totalSecs / (60 * 60 * 24));
        const hours = Math.floor((totalSecs % (60 * 60 * 24)) / (60 * 60));
        const mins = Math.floor((totalSecs % (60 * 60)) / 60);
        const secs = totalSecs % 60;

        if (days > 0) return { text: `📅 ${days}d ${hours}h`, class: 'status-upcoming' };
        if (hours > 0) return { text: `⏳ ${hours}h ${mins}m`, class: 'status-upcoming' };

        // Starting soon (last 10 mins)
        if (mins < 10) {
            return { text: `🔥 Starting soon: ${mins}m ${secs}s`, class: 'status-soon' };
        }

        return { text: `⏭ ${mins}m ${secs}s`, class: 'status-upcoming' };
    };

    const getDifficulty = () => {
        const name = contest.name.toLowerCase();
        if (name.includes('div 3') || name.includes('beginner') || name.includes('starter')) return { text: 'Easy', class: 'difficulty-easy' };
        if (name.includes('div 2') || name.includes('regular') || name.includes('educational')) return { text: 'Medium', class: 'difficulty-medium' };
        if (name.includes('div 1') || name.includes('grand prix') || name.includes('combined')) return { text: 'Hard', class: 'difficulty-hard' };
        return { text: 'Advanced', class: 'difficulty-medium' };
    };

    const dLevel = getDifficulty();
    const status = getContestStatus; // Use as getter in JSX or call it

    const displayStatusText = () => {
        const s = status();
        if (s.text === 'Live Now') return 'LIVE NOW 🔥 ';
        if (s.text === 'Ended') return 'Ended ⌛ ';
        return s.text;
    };

    const handleClick = () => {
        window.open(contest.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            class={`contest-card ${contest.platform.toLowerCase()} clickable-card`}
            onClick={handleClick}
            title={`Click to join ${contest.name}`}
        >
            <div class="card-header">
                <div class="header-main">
                    <span class={`platform-badge ${contest.platform.toLowerCase()}`}>
                        {contest.platform}
                    </span>
                    <span class={`difficulty-tag ${dLevel.class}`}>{dLevel.text}</span>
                </div>
                <span class={`countdown ${status().class}`}>{displayStatusText()}</span>
            </div>
            <h3 class="contest-name">{contest.name}</h3>
            <div class="contest-time">
                <ion-icon name="time-outline"></ion-icon>
                <span>{timeStr}</span>
            </div>
            <div class="end-time">
                <ion-icon name="hourglass-outline"></ion-icon>
                <span>Ends: {endTimeStr}</span>
            </div>

            <div class="join-btn-placeholder">
                <button class="join-btn">
                    <ion-icon name="open-outline"></ion-icon>
                    {status().class === 'status-ended' ? 'View Problems' : 'Join Challenge'}
                </button>
            </div>
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

        // Filter for display: Contests ended in last 7 days
        // We use a more generous window to keep the "Previous Challenges" section populated
        let displayEnded = ended.filter(c => {
            const contestEndTime = new Date(c.time.getTime() + (c.duration || 2 * 60 * 60 * 1000));
            return (now - contestEndTime) < 7 * 24 * 60 * 60 * 1000;
        });

        // Always ensure we have at least TWO most recent ones for each platform if 'all' is selected
        // to make the "Previous Challenges" section look populated and helpful across all sites.
        const majorPlatforms = ['LeetCode', 'CodeForces', 'CodeChef', 'AtCoder'];
        const targetPlatforms = props.activeFilter === 'all'
            ? majorPlatforms
            : [props.activeFilter];

        targetPlatforms.forEach(p => {
            // Find all past contests for this specific platform (case-insensitive)
            const platformPastAll = ended.filter(c => c.platform.toLowerCase() === p.toLowerCase())
                .sort((a, b) => b.time - a.time);

            // Ensure we show at least 2 past contests for each major platform
            for (let i = 0; i < 2; i++) {
                if (platformPastAll[i]) {
                    // Avoid duplicates if they were already added by the 7-day filter
                    if (!displayEnded.some(c => c.id === platformPastAll[i].id)) {
                        displayEnded.push(platformPastAll[i]);
                    }
                }
            }
        });

        return {
            live,
            upcoming,
            ended: displayEnded.sort((a, b) => b.time - a.time)
        };
    });

    return (
        <div class="split-layout" id="contests-section">
            <div class="upcoming-side">
                <Show when={categorized().live.length > 0}>
                    <h2 class="section-title">Live Now</h2>
                    <div class="contest-grid">
                        <For each={categorized().live}>
                            {(c) => <ContestCard contest={c} />}
                        </For>
                    </div>
                </Show>

                <Show when={categorized().upcoming.length > 0}>
                    <h2 class="section-title">Upcoming Challenges</h2>
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
                    <div class="no-contests">No upcoming challenges found.</div>
                </Show>
            </div>

            <div class="ended-side" id="ended-section">
                <h2 class="section-title">Previous Challenges</h2>
                <div class="contest-grid ended-grid">
                    <For each={categorized().ended}>
                        {(c) => <ContestCard contest={c} />}
                    </For>
                    <Show when={categorized().ended.length === 0}>
                        <div class="no-contests">No previous contest data.</div>
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default ContestGrid;
