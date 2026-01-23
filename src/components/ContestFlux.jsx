import { createSignal, createMemo, For, onCleanup, onMount } from 'solid-js';

function ContestFlux(props) {
    const [hovered, setHovered] = createSignal(null);
    let containerRef;

    const upcomingContests = createMemo(() => {
        return (props.contests || [])
            .filter(c => c.time > new Date())
            .sort((a, b) => a.time - b.time)
            .slice(0, 15);
    });

    return (
        <div class="flux-section" id="flux-nexus">
            <div class="flux-header">
                <div class="flux-title-group">
                    <h2 class="section-title">The Chronos <span class="gradient-text">Trace</span></h2>
                    <p class="flux-subtitle">A vectorized stream of global competitive states</p>
                </div>
                <div class="flux-controls">
                    <div class="flux-indicator">
                        <span class="pulse-dot"></span>
                        LIVE SYNC
                    </div>
                </div>
            </div>

            <div class="flux-viewport" ref={containerRef}>
                <div class="flux-stream">
                    {/* Duplicate set for infinite scroll */}
                    <For each={[...upcomingContests(), ...upcomingContests()]}>
                        {(contest, i) => {
                            const date = new Date(contest.time);
                            const day = date.getDate();
                            const month = date.toLocaleString('default', { month: 'short' });

                            return (
                                <div
                                    class={`flux-node platform-${contest.platform.toLowerCase()}`}
                                    onMouseEnter={() => setHovered(contest)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => window.open(contest.url, '_blank')}
                                    style={{
                                        '--index': i() % upcomingContests().length,
                                        '--offset': `${Math.sin((i() % upcomingContests().length) * 0.5) * 40}px`
                                    }}
                                >
                                    <div class="node-glow"></div>
                                    <div class="node-content">
                                        <div class="node-date">
                                            <span class="n-day">{day}</span>
                                            <span class="n-month">{month}</span>
                                        </div>
                                        <div class="node-info">
                                            <div class="n-platform">{contest.platform}</div>
                                            <div class="n-name">{contest.name}</div>
                                        </div>
                                    </div>

                                    <Show when={hovered() === contest}>
                                        <div class="flux-detail-card">
                                            <div class="detail-header">
                                                <span class="detail-badge">{contest.platform}</span>
                                                <div class="detail-time-group">
                                                    <span class="detail-time">{date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                    <span class="detail-time">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div class="detail-title">{contest.name}</div>
                                            <div class="detail-footer">
                                                <span>Click to Participate</span>
                                                <ion-icon name="arrow-forward-outline"></ion-icon>
                                            </div>
                                        </div>
                                    </Show>
                                </div>
                            );
                        }}
                    </For>
                </div>

                <div class="flux-background-grid"></div>
                <div class="flux-timeline-axis">
                    <div class="axis-line"></div>
                    <div class="axis-labels">
                        <span>SOON</span>
                        <span>LATER</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContestFlux;
