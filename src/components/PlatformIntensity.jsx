import { createMemo, For } from 'solid-js';

function PlatformIntensity(props) {
    const intensityData = createMemo(() => {
        const platforms = ['LeetCode', 'CodeForces', 'CodeChef', 'AtCoder'];
        const counts = {};
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const nextMonth = (currentMonth + 1) % 12;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

        platforms.forEach(p => counts[p] = 0);
        
        // Filter contests for current month and next month only
        const filteredContests = props.contests.filter(c => {
            const contestDate = new Date(c.time);
            const contestMonth = contestDate.getMonth();
            const contestYear = contestDate.getFullYear();
            
            return (contestMonth === currentMonth && contestYear === currentYear) ||
                   (contestMonth === nextMonth && contestYear === nextYear);
        });

        filteredContests.forEach(c => {
            if (counts.hasOwnProperty(c.platform)) {
                counts[c.platform]++;
            }
        });

        // Limit to 6 contests per platform
        Object.keys(counts).forEach(platform => {
            counts[platform] = Math.min(counts[platform], 6);
        });

        const total = Math.max(...Object.values(counts), 1);

        return platforms.map(p => ({
            name: p,
            count: counts[p],
            intensity: (counts[p] / total),
            level: Math.ceil((counts[p] / total) * 5)
        }));
    });

    const getRecommendation = () => {
        const sorted = [...intensityData()].sort((a, b) => b.count - a.count);
        const top = sorted[0];
        if (!top || top.count === 0) return "Global quiet period. Perfect for base training!";
        if (top.name === 'CodeForces') return "High CodeForces activity. Focus on speed and math-heavy problems.";
        if (top.name === 'LeetCode') return "LeetCode surge! Master DP and Tree patterns today.";
        if (top.name === 'CodeChef') return "CodeChef rounds ahead. Practice constructive and logic-heavy rounds.";
        return "AtCoder focus. Brush up on accuracy and clean implementations.";
    };

    return (
        <div class="intensity-nexus">
            <div class="intensity-header-new">
                <div class="title-wrap">
                    <h2 class="section-title">Platform <span class="gradient-text">Intensity</span></h2>
                    <p class="section-subtitle">Real-time activity matrix</p>
                </div>
                <div class="rec-banner">
                    <ion-icon name="bulb-outline"></ion-icon>
                    <span>{getRecommendation()}</span>
                </div>
            </div>

            <div class="intensity-matrix">
                <For each={intensityData()}>
                    {(platform) => (
                        <div class={`matrix-cell platform-${platform.name.toLowerCase()}`}>
                            <div class="cell-glow" style={{ opacity: platform.intensity * 0.3 }}></div>
                            <div class="cell-content">
                                <div class="cell-label">{platform.name}</div>
                                <div class="cell-grid">
                                    <For each={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
                                        {(i) => (
                                            <div
                                                class="grid-dot"
                                                style={{
                                                    opacity: i <= platform.level * 2 ? 1 : 0.1,
                                                    '--delay': `${i * 0.1}s`
                                                }}
                                            ></div>
                                        )}
                                    </For>
                                </div>
                                <div class="cell-stats">
                                    <span class="c-count">{platform.count}</span>
                                    <span class="c-label">CONTESTS (CURRENT & NEXT MONTH)</span>
                                </div>
                            </div>
                        </div>
                    )}
                </For>
            </div>

            <div class="roadmap-stream">
                <div class="roadmap-track">
                    <For each={[1, 2]}>
                        {() => (
                            <>
                                <div class="roadmap-bit">
                                    <div class="bit-icon"><ion-icon name="notifications-outline"></ion-icon></div>
                                    <div class="bit-info">
                                        <h5>Smart Alerts</h5>
                                        <p>Contextual push notifications</p>
                                    </div>
                                </div>
                                <div class="roadmap-bit">
                                    <div class="bit-icon"><ion-icon name="medal-outline"></ion-icon></div>
                                    <div class="bit-info">
                                        <h5>Rank Tracker</h5>
                                        <p>Global ranking aggregator</p>
                                    </div>
                                </div>
                                <div class="roadmap-bit">
                                    <div class="bit-icon"><ion-icon name="people-outline"></ion-icon></div>
                                    <div class="bit-info">
                                        <h5>Team Arena</h5>
                                        <p>Collaborative contest prep</p>
                                    </div>
                                </div>
                                <div class="roadmap-bit">
                                    <div class="bit-icon"><ion-icon name="analytics-outline"></ion-icon></div>
                                    <div class="bit-info">
                                        <h5>ELITE TRACK</h5>
                                        <p>Elite practice track</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </For>
                </div>
            </div>
        </div>
    );
}

export default PlatformIntensity;

