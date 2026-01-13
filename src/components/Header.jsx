import { createSignal, onMount, Show } from 'solid-js';

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
            <nav class="nav-container">
                <a href="/" class="brand">
                    <ion-icon name="code-slash-outline"></ion-icon>
                    <span>CodeCal</span>
                    <Show when={props.isSyncing}>
                        <div class="sync-indicator" title="Syncing contests...">
                            <div class="sync-dot"></div>
                        </div>
                    </Show>
                </a>

                <div class="nav-links">
                    <a href="https://whimsical.com/dsa-roadmap-JegsSL6nFr1b3V25bRzpYA" target="_blank" rel="noopener noreferrer" class="nav-item">
                        <ion-icon name="map-outline"></ion-icon>
                        <span>Roadmap</span>
                    </a>

                    <a href="https://github.com/Codeninja-194" target="_blank" rel="noopener noreferrer" class="nav-item">
                        <ion-icon name="logo-github"></ion-icon>
                        <span>GitHub</span>
                    </a>

                    <button class="nav-item" onClick={toggleTheme} title="Toggle theme" style="background: none; border: none; cursor: pointer;">
                        <ion-icon name={theme() === 'light' ? 'moon-outline' : 'sunny-outline'}></ion-icon>
                        <span>{theme() === 'light' ? 'Dark' : 'Light'}</span>
                    </button>

                    <button class="nav-item active" onClick={props.onEnableAlerts} style="border: none; cursor: pointer;">
                        <ion-icon name="notifications-outline"></ion-icon>
                        <span>{props.isSubscribed ? "Active" : "Alerts"}</span>
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Header;
