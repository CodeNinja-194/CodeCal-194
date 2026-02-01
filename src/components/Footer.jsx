import { createSignal } from 'solid-js';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer class="app-footer">
            <div class="footer-container">
                <div class="footer-top">
                    <div class="footer-brand-section">
                        <div class="brand">
                            <ion-icon name="code-slash-outline"></ion-icon>
                            <span>CodeCal</span>
                        </div>
                        <p class="footer-bio">
                            Track, analyze, and dominate with the world's most elegant coding contest calendar. Built for the elite, by the community.
                        </p>
                        <div class="footer-socials">
                            <a href="https://github.com/Codeninja-194" target="_blank" title="GitHub"><ion-icon name="logo-github"></ion-icon></a>
                            <a href="https://www.linkedin.com/in/sri-ram-prasad-adusumilli/" target="_blank" title="LinkedIn"><ion-icon name="logo-linkedin"></ion-icon></a>
                        </div>
                    </div>

                    <div class="footer-grid">
                        <div class="footer-col">
                            <h4>Platform</h4>
                            <ul class="footer-links">
                                <li><a href="/">Challenges</a></li>
                                <li><a href="/practice">Mastery Track</a></li>
                                <li><a href="https://codeninja-194.online/" target="_blank">Creator Portfolio</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Resources</h4>
                            <ul class="footer-links">
                                <li><a href="https://whimsical.com/dsa-roadmap-JegsSL6nFr1b3V25bRzpYA" target="_blank">DSA Roadmap</a></li>
                                {/* <li><a href="https://github.com/Codeninja-194/CodeCal-194" target="_blank">Source Code</a></li> */}
                                <li><a href="https://github.com/Codeninja-194/CodeCal-194/stargazers" target="_blank">Star on GitHub</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Contact</h4>
                            <ul class="footer-links">
                                <li><a href="mailto:sriramadusumilli98@gmail.com"><ion-icon name="mail-outline"></ion-icon> Email Me</a></li>
                                <li><a href="https://github.com/Codeninja-194/CodeCal-194/issues" target="_blank">Report Bug</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="footer-copyright">
                        © {year} <span>CodeNinja-194</span>. Designed with ❤️ for the global community.
                    </div>
                    <div class="footer-status">
                        <span class="status-dot"></span> All Systems Operational
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
