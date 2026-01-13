import { createSignal, onMount } from 'solid-js';

function Header(props) {
    const [theme, setTheme] = createSignal('light');

    onMount(() => {
        // Check saved theme preference
        const savedTheme = localStorage.getItem('codecal_theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    });

    const toggleTheme = () => {
        const newTheme = theme() === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('codecal_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <header>
            <div class="brand">
                <ion-icon name="code-slash-outline"></ion-icon>
                <span>CodeCal</span>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center;">
                <a href="https://whimsical.com/dsa-roadmap-JegsSL6nFr1b3V25bRzpYA" target="_blank" rel="noopener noreferrer" class="glass-btn" title="DSA Roadmap">
                    <ion-icon name="map-outline"></ion-icon>
                    <span>Roadmap</span>
                </a>

                <a href="https://github.com/Codeninja-194" target="_blank" rel="noopener noreferrer" class="glass-btn" title="GitHub Profile">
                    <ion-icon name="logo-github"></ion-icon>
                </a>

                <button class="glass-btn theme-toggle" onClick={toggleTheme} title="Toggle theme">
                    <ion-icon name={theme() === 'light' ? 'moon-outline' : 'sunny-outline'}></ion-icon>
                </button>

                <button class="glass-btn" onClick={props.onEnableAlerts}>
                    <ion-icon name="notifications-outline"></ion-icon>
                    <span>{props.isSubscribed ? "Alerts Active" : "Enable Alerts"}</span>
                </button>
            </div>
        </header>
    );
}

export default Header;
