import { createSignal, onMount, Show, createEffect } from 'solid-js';

function Header(props) {
    const [theme, setTheme] = createSignal('light');
    const [currentPath, setCurrentPath] = createSignal(window.location.pathname);
    const [isMenuOpen, setIsMenuOpen] = createSignal(false);

    onMount(() => {
        // Check saved theme preference
        const savedTheme = localStorage.getItem('codecal_theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Listen for path changes
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
            setIsMenuOpen(false); // Close menu on navigation
        };
        window.addEventListener('popstate', handlePopState);

        // Also listen for custom navigation events
        window.addEventListener('navigation', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('navigation', handlePopState);
        };
    });

    createEffect(() => {
        setCurrentPath(window.location.pathname);
    });

    const toggleTheme = () => {
        const newTheme = theme() === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('codecal_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen());

    const navigateTo = (path) => {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
        setIsMenuOpen(false);
        window.dispatchEvent(new Event('navigation'));
    };

    return (
        <header>
            <nav class="nav-container">
                <a href="/" class="brand" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
                    <ion-icon name="code-slash-outline"></ion-icon>
                    <span>CodeCal</span>
                    <Show when={props.isSyncing}>
                        <div class="sync-indicator" title="Syncing contests...">
                            <div class="sync-dot"></div>
                        </div>
                    </Show>
                </a>

                {/* Hamburger Toggle */}
                <button class="hamburger-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                    <ion-icon name={isMenuOpen() ? "close-outline" : "menu-outline"}></ion-icon>
                </button>

                <div class={`nav-links ${isMenuOpen() ? 'mobile-show' : ''}`}>
                    <a
                        href="/"
                        class={`nav-item ${currentPath() === '/' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); navigateTo('/'); }}
                    >
                        <ion-icon name="calendar-outline"></ion-icon>
                        <span>Challenges</span>
                    </a>

                    <a
                        href="/practice"
                        class={`nav-item practice-link ${currentPath() === '/practice' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); navigateTo('/practice'); }}
                    >
                        <ion-icon name="library-outline"></ion-icon>
                        <span>Ram's Sheet</span>
                    </a>

                    <a
                        href="https://whimsical.com/dsa-roadmap-JegsSL6nFr1b3V25bRzpYA"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="nav-item roadmap-link"
                        title="DSA Roadmap"
                    >
                        <ion-icon name="map-outline"></ion-icon>
                        <span>Roadmap</span>
                    </a>

                    <div class="nav-actions">
                        <a href="https://github.com/Codeninja-194" target="_blank" rel="noopener noreferrer" class="nav-item github-icon" title="GitHub">
                            <ion-icon name="logo-github"></ion-icon>
                            <span class="mobile-only-text">GitHub</span>
                        </a>

                        <a href="https://codeninja194.vercel.app/" target="_blank" rel="noopener noreferrer" class="nav-item portfolio-icon" title="Portfolio">
                            <img src="https://codeninja194.vercel.app/favicon.png" alt="Portfolio" class="portfolio-favicon" onError={(e) => { e.target.src = '/favicon.png'; }} />
                            <span class="mobile-only-text">Portfolio</span>
                        </a>

                        <button class="nav-item theme-btn icon-only" onClick={toggleTheme} title={theme() === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} style="background: none; border: none; cursor: pointer;">
                            <ion-icon name={theme() === 'light' ? 'moon-outline' : 'sunny-outline'}></ion-icon>
                            <span class="mobile-only-text">Theme</span>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
