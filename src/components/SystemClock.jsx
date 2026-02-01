import { createSignal, onMount, onCleanup } from 'solid-js';

function SystemClock() {
    const [time, setTime] = createSignal(new Date());

    onMount(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        onCleanup(() => clearInterval(timer));
    });

    const formatLocalDateTime = (date) => {
        const pad = (num) => String(num).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[date.getDay()];

        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        // Get GMT offset
        const offsetMinutes = date.getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
        const offsetMins = Math.abs(offsetMinutes % 60);
        const sign = offsetMinutes <= 0 ? '+' : '-';
        const formattedOffset = `${sign}${pad(offsetHours)}:${pad(offsetMins)}`;

        return {
            dateLine: `${year}-${month}-${day} (${dayName})`,
            timeLine: `${hours}:${minutes}:${seconds} ${formattedOffset}`
        };
    };

    return (
        <div class="atcoder-clock-container">
            <div class="atcoder-monitor">
                <div class="monitor-screen">
                    <div class="time-row date">{formatLocalDateTime(time()).dateLine}</div>
                    <div class="time-row time">{formatLocalDateTime(time()).timeLine}</div>
                </div>
                <div class="monitor-stand"></div>
            </div>
        </div>
    );
}

export default SystemClock;
