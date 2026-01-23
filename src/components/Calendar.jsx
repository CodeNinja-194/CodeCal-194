import { For, createMemo } from 'solid-js';

function Calendar(props) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarDays = createMemo(() => {
        const year = props.currentMonth.getFullYear();
        const month = props.currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Empty slots for days before first day
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, contests: [] });
        }
        // Actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const dayContests = props.contests.filter(c => {
                const cDate = c.time;
                return cDate.getFullYear() === year &&
                    cDate.getMonth() === month &&
                    cDate.getDate() === d;
            });
            days.push({ day: d, contests: dayContests });
        }
        return days;
    });

    const changeMonth = (delta) => {
        const newDate = new Date(props.currentMonth);
        newDate.setMonth(newDate.getMonth() + delta);
        props.onMonthChange(newDate);
    };

    return (
        <div class="calendar-container">
            <div class="calendar-header">
                <button class="glass-btn" onClick={() => changeMonth(-1)}>
                    <ion-icon name="chevron-back-outline"></ion-icon>
                </button>
                <h2>
                    {monthNames[props.currentMonth.getMonth()]} {props.currentMonth.getFullYear()}
                </h2>
                <button class="glass-btn" onClick={() => changeMonth(1)}>
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                </button>
            </div>

            <div class="calendar-weekdays">
                <For each={dayNames}>
                    {(day) => <div class="weekday">{day}</div>}
                </For>
            </div>

            <div class="calendar-grid">
                <For each={calendarDays()}>
                    {(dayData) => {
                        const isPast = dayData.day && new Date(props.currentMonth.getFullYear(), props.currentMonth.getMonth(), dayData.day) < new Date().setHours(0, 0, 0, 0);

                        return (
                            <div class={`calendar-day ${dayData.day ? '' : 'empty'} ${dayData.contests.length > 0 ? 'has-contest' : ''} ${isPast ? 'past-day' : ''}`}
                                onClick={() => dayData.day && console.log(`Selected day ${dayData.day}`)}>
                                {dayData.day && (
                                    <>
                                        <div class="day-header">
                                            <span class="day-number">{dayData.day}</span>
                                            {dayData.contests.length > 0 && <span class="contest-count-badge">{dayData.contests.length}</span>}
                                        </div>
                                        <div class="simple-contest-list">
                                            <For each={dayData.contests.slice(0, 4)}>
                                                {(contest) => (
                                                    <div class={`simple-marker marker-${contest.platform.toLowerCase()}`} title={contest.name}>
                                                        <span class="dot"></span>
                                                        <span class="name">{contest.name}</span>
                                                    </div>
                                                )}
                                            </For>
                                            {dayData.contests.length > 4 && (
                                                <div class="more-indicator">+{dayData.contests.length - 4}</div>
                                            )}
                                        </div>

                                        {/* Simplified Hover Info */}
                                        <div class="day-info-mini">
                                            <div class="mini-header">Contests on {dayData.day}</div>
                                            <div class="mini-list">
                                                <For each={dayData.contests}>
                                                    {(c) => (
                                                        <a href={c.url} target="_blank" class="mini-item">
                                                            <span class={`indicator indicator-${c.platform.toLowerCase()}`}></span>
                                                            <span class="m-name">{c.name}</span>
                                                        </a>
                                                    )}
                                                </For>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
}

export default Calendar;
