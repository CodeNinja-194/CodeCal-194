import { createSignal } from 'solid-js';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer class="app-footer">
            <div class="footer-content">
                <div class="footer-left">
                    <div class="brand">
                        <ion-icon name="code-slash-outline"></ion-icon>
                        <span>CodeCal</span>
                    </div>
                    <p>Track all your coding contests in one place.</p>
                </div>

                <div class="footer-right">
                    <div class="footer-links">
                        <a href="https://github.com/Codeninja-194" target="_blank" rel="noopener noreferrer">
                            <ion-icon name="logo-github"></ion-icon>
                            GitHub
                        </a>
                        <a href="https://whimsical.com/dsa-roadmap-JegsSL6nFr1b3V25bRzpYA" target="_blank" rel="noopener noreferrer">
                            <ion-icon name="map-outline"></ion-icon>
                            Roadmap
                        </a>
                    </div>
                    <p class="copyright">© {year} CodeNinja-194. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
