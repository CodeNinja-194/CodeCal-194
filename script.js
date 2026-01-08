// Step 1: Data Source
let contests = [];

// Fetch real data from Kontests API
async function fetchContests() {
    const grid = document.getElementById('contestGrid');
    if (grid) grid.innerHTML = '<div class="loading-spinner">Fetching live contests...</div>';

    try {
        const response = await fetch('https://kontests.net/api/v1/all');
        const data = await response.json();

        // Map API data to our format
        const apiContests = data.filter(c =>
            ['LeetCode', 'CodeChef', 'CodeForces', 'AtCoder'].includes(c.site) ||
            c.url.includes('leetcode') || c.url.includes('codechef') ||
            c.url.includes('codeforces') || c.url.includes('atcoder')
        ).map((c, index) => ({
            id: index + 100,
            platform: c.site || (c.url.includes('leetcode') ? 'LeetCode' : 'Other'),
            name: c.name,
            time: new Date(c.start_time),
            url: c.url
        }));

        // Manually ensure LeetCode Biweekly is present (API might miss it if far out)
        const manualLeetCode = {
            id: 998,
            platform: 'LeetCode',
            name: 'Biweekly Contest 174',
            time: new Date("2026-01-17T07:30:00"), // Saturday
            url: 'https://leetcode.com/contest/biweekly-contest-174/'
        };

        // Combine and sort (GFG removed as requested)
        contests = [...apiContests, manualLeetCode];
        contests.sort((a, b) => a.time - b.time);

        renderContests();
    } catch (error) {
        console.error("Failed to fetch contests:", error);
        // Fallback Data
        contests = [
            {
                id: 1,
                platform: 'AtCoder',
                name: 'Beginner Contest 440',
                time: new Date("2026-01-10T21:00:00"),
                url: 'https://atcoder.jp/contests/abc440'
            },
            {
                id: 2,
                platform: 'LeetCode',
                name: 'Weekly Contest 484',
                time: new Date("2026-01-11T08:00:00"),
                url: 'https://leetcode.com/contest/weekly-contest-484/'
            },
            {
                id: 3,
                platform: 'AtCoder',
                name: 'Regular Contest 212',
                time: new Date("2026-01-11T21:00:00"),
                url: 'https://atcoder.jp/contests/arc212'
            },
            {
                id: 5,
                platform: 'CodeForces',
                name: 'Div 3 Round 1072',
                time: new Date("2026-01-12T17:35:00"),
                url: 'https://codeforces.com/contests'
            },
            {
                id: 6,
                platform: 'CodeChef',
                name: 'Starters 221',
                time: new Date("2026-01-14T20:00:00"),
                url: 'https://www.codechef.com/contests'
            },
            {
                id: 7,
                platform: 'LeetCode',
                name: 'Biweekly Contest 174',
                time: new Date("2026-01-17T07:30:00"),
                url: 'https://leetcode.com/contest/biweekly-contest-174/'
            }
        ];
        renderContests();
    }
}

let notificationsEnabled = false;

// Step 2: Render Contests
function renderContests(filter = 'all') {
    const grid = document.getElementById('contestGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filter === 'all'
        ? contests
        : contests.filter(c => c.platform === filter);

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-muted)">No contests found.</div>';
        return;
    }

    filtered.forEach(contest => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="platform-badge">${contest.platform}</span>
            <div class="contest-title">${contest.name}</div>
            <div class="timer" id="timer-${contest.id}">Loading...</div>
            <div class="card-footer">
                <span class="date-text">${contest.time.toLocaleDateString()} ${contest.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <a href="${contest.url}" target="_blank" class="glass-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                    Register <ion-icon name="arrow-forward-outline"></ion-icon>
                </a>
            </div>
        `;
        grid.appendChild(card);
        startTimer(contest);
    });
}

// Step 3: Countdown Logic
function startTimer(contest) {
    const update = () => {
        const now = new Date().getTime();
        const distance = contest.time - now;
        const elem = document.getElementById(`timer-${contest.id}`);

        if (!elem) return;

        if (distance < 0) {
            elem.innerHTML = "LIVE NOW";
            elem.style.color = "#4ade80"; // Green
            if (notificationsEnabled) sendNotification(contest);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        elem.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    update();
    setInterval(update, 1000);
}

// Step 4: Notification Logic
function toggleNotifications() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
        return;
    }

    if (Notification.permission === "granted") {
        notificationsEnabled = !notificationsEnabled;
        updateNotifyUI();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                notificationsEnabled = true;
                updateNotifyUI();
                new Notification("CodeCal", { body: "You will now be notified for contests!" });
            }
        });
    }
}

function updateNotifyUI() {
    const btn = document.getElementById('notifyBtn');
    const icon = document.getElementById('notifyIcon');
    const text = document.getElementById('notifyText');

    if (notificationsEnabled) {
        btn.style.borderColor = 'var(--primary)';
        btn.style.background = 'rgba(139, 92, 246, 0.2)';
        icon.setAttribute('name', 'notifications-outline');
        text.innerText = "Alerts Active";
    } else {
        btn.style.borderColor = 'var(--glass-border)';
        btn.style.background = 'var(--glass-bg)';
        icon.setAttribute('name', 'notifications-off-outline');
        text.innerText = "Enable Alerts";
    }
}

function sendNotification(contest) {
    const noteId = `notified-${contest.id}`;
    if (sessionStorage.getItem(noteId)) return;

    // Student-focused notification
    const notification = new Notification(`🔔 Contest Alert: ${contest.platform}`, {
        body: `Attention Students! ${contest.name} has started. Click here to join the contest now!`,
        icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png',
        tag: contest.id
    });

    notification.onclick = function () {
        window.open(contest.url, '_blank');
    };

    sessionStorage.setItem(noteId, 'true');
}

// Step 6: View Switching Logic
let currentCalendarDate = new Date();

function switchView(view) {
    const listBtn = document.getElementById('listViewBtn');
    const calBtn = document.getElementById('calendarViewBtn');
    const listView = document.getElementById('contestGrid');
    const calView = document.getElementById('calendarView');
    const filterChips = document.querySelectorAll('.filter-chip');

    if (view === 'list') {
        listBtn.classList.add('active');
        calBtn.classList.remove('active');
        listView.classList.remove('hidden');
        calView.classList.add('hidden');
        listView.style.display = 'grid'; // Restore grid layout

        // Show filters
        filterChips.forEach(c => c.style.display = 'block');
    } else {
        listBtn.classList.remove('active');
        calBtn.classList.add('active');
        listView.classList.add('hidden');
        listView.style.display = 'none'; // Fully hide to prevent layout issues
        calView.classList.remove('hidden');
        renderCalendar();

        // Hide filters in calendar mode
        filterChips.forEach(c => c.style.display = 'none');
    }
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
}

function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    // Update Header
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const headerEl = document.getElementById('currentMonthYear');
    if (headerEl) headerEl.innerText = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    grid.innerHTML = '';

    // Day Headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.innerText = d;
        grid.appendChild(header);
    });

    // Calendar Days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        grid.appendChild(emptyCell);
    }

    // Days with data
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';

        // Highlight Today
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        cell.innerHTML = `<span class="day-number">${i}</span>`;

        // Find contests for this day
        const cellDate = new Date(year, month, i); // Midnight
        const nextDate = new Date(year, month, i + 1);

        contests.forEach(contest => {
            if (contest.time >= cellDate && contest.time < nextDate) {
                const badge = document.createElement('div');
                badge.className = `contest-marker marker-${contest.platform.toLowerCase()}`;
                if (contest.platform === 'GeeksforGeeks') badge.classList.add('marker-geeksforgeeks');

                badge.innerText = contest.platform;
                badge.title = `${contest.name} at ${contest.time.toLocaleTimeString()}`;

                badge.onclick = (e) => {
                    e.stopPropagation();
                    window.open(contest.url, '_blank');
                };

                cell.appendChild(badge);
            }
        });

        grid.appendChild(cell);
    }
}

// Step 8: Initialize & Auth Check
document.addEventListener('DOMContentLoaded', () => {
    // Check Login removed as requested - functionality moved to "Enable Alerts" modal

    // Initialize App if on dashboard
    if (document.getElementById('contestGrid')) {
        fetchContests();
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelector('.filter-chip.active').classList.remove('active');
                e.target.classList.add('active');
                renderContests(e.target.dataset.filter);
            });
        });
    }
});