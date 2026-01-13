import { createSignal } from 'solid-js';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer class="app-footer">
            <div class="footer-main">
                <div class="footer-brand">
                    <div class="brand">
                        <ion-icon name="code-slash-outline"></ion-icon>
                        <span>CodeCal</span>
                    </div>
                    <p class="footer-tagline">
                        The ultimate destination for competitive programmers to track and never miss a contest again.
                    </p>
                </div>

                <div class="footer-section">
                    <h4>Resources</h4>
                    <ul class="footer-list">
                        <li>
                            <a href="https://whimsical.com/dsa-roadmap-JegsSL6nFr1b3V25bRzpYA" target="_blank" rel="noopener noreferrer">
                                <ion-icon name="map-outline"></ion-icon>
                                DSA Roadmap
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/Codeninja-194/CodeCal-194" target="_blank" rel="noopener noreferrer">
                                <ion-icon name="star-outline"></ion-icon>
                                Star on GitHub
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Connect</h4>
                    <ul class="footer-list">
                        <li>
                            <a href="https://github.com/Codeninja-194" target="_blank" rel="noopener noreferrer">
                                <ion-icon name="logo-github"></ion-icon>
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="#" class="nav-item">
                                <ion-icon name="mail-outline"></ion-icon>
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p class="copyright">© {year} CodeNinja-194. Designed with ❤️ for the community.</p>
            </div>
        </footer>
    );
}

export default Footer;
