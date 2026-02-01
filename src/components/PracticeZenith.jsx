function PracticeZenith() {
    const masteryPlan = {
        title: "Ram's DSA Sheet",
        description: 'Elite technical interview prep curated for global arena dominance.',
        quote: 'Success is not final, failure is not fatal: it is the courage to continue.',
        goal: '300 PROBLEMS'
    };

    const goToPractice = () => {
        window.history.pushState({}, '', '/practice');
        window.dispatchEvent(new Event('navigation'));
    };

    return (
        <section class="zenith-nexus">
            <div class="zenith-mastery-hull">
                <div class="mastery-prism horizontal">
                    <div class="prism-base" />
                    <div class="prism-glow" />

                    <div class="mastery-layout">
                        {/* Info Section */}
                        <div class="mastery-info">
                            <div class="elite-badge-glow">
                                <span class="elite-text">DSA TRACK</span>
                            </div>
                            <h3 class="mastery-headline">{masteryPlan.title}</h3>
                            <p class="mastery-summary">{masteryPlan.description}</p>
                        </div>

                        {/* Divider */}
                        <div class="mastery-divider" />

                        {/* Quote Section */}
                        <div class="mastery-quote-mini">
                            <p>“{masteryPlan.quote}”</p>
                        </div>

                        {/* CTA Section */}
                        <div class="mastery-cta">
                            <div class="metric-item">
                                <span class="metric-val">{masteryPlan.goal}</span>
                                <span class="metric-key">CURATED FOR YOU</span>
                            </div>
                            <button class="mastery-launch-btn compact" onClick={goToPractice}>
                                <span>Begin Session</span>
                                <ion-icon name="rocket-sharp"></ion-icon>
                                <div class="btn-flare" />
                            </button>
                        </div>
                    </div>

                    {/* Subtle Decors */}
                    <div class="orbital-ring ring-1" />
                </div>
            </div>
        </section>
    );
}

export default PracticeZenith;