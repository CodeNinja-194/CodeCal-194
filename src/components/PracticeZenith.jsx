import { createMemo } from 'solid-js';

function PracticeZenith(props) {
    const masterPlan = {
        title: 'Top 300 Mastery Problems',
        desc: 'A curated selection of the most impactful competitive programming problems across all platforms.',
        motivation: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        target: '300 PROBLEMS'
    };

    const navigateToPractice = () => {
        window.history.pushState({}, '', '/practice');
        window.dispatchEvent(new Event('navigation'));
    };

    return (
        <div class="zenith-nexus codeninja-section">
            <div class="zenith-header">
                <h6 class="section-title codeninja-title">CodeNinja-<span class="gradient-text">194</span></h6>
                <p class="section-subtitle">Elite mastery track for global arena dominance</p>
            </div>

            <div class="zenith-mastery-hull">
                <div class="mastery-prism">
                    <div class="prism-base"></div>
                    <div class="prism-glow"></div>

                    <div class="mastery-content-layer">
                        <div class="elite-badge-glow">
                            <span class="elite-text">ELITE TRACK</span>
                        </div>

                        <h3 class="mastery-headline">{masterPlan.title}</h3>
                        <p class="mastery-summary">{masterPlan.desc}</p>

                        <div class="mastery-quote-box">
                            <p>"{masterPlan.motivation}"</p>
                        </div>

                        <div class="mastery-metrics">
                            <div class="metric-item">
                                <span class="metric-val">{masterPlan.target}</span>
                                <span class="metric-key">CURATED FOR YOU</span>
                            </div>
                        </div>

                        <button class="mastery-launch-btn" onClick={navigateToPractice}>
                            <span>Begin Practice Session</span>
                            <div class="btn-flare"></div>
                        </button>
                    </div>

                    <div class="orbital-ring ring-1"></div>
                    <div class="orbital-ring ring-2"></div>
                    <div class="data-point p1"></div>
                    <div class="data-point p2"></div>
                    <div class="data-point p3"></div>
                </div>
            </div>
        </div>
    );
}

export default PracticeZenith;
