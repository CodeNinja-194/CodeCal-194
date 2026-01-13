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
                    {(dayData) => (
                        <div class={`calendar-day ${dayData.day ? '' : 'empty'} ${dayData.contests.length > 0 ? 'has-contest' : ''}`}>
                            {dayData.day && (
                                <>
                                    <span class="day-number">{dayData.day}</span>
                                    <For each={dayData.contests.slice(0, 3)}>
                                        {(contest) => (
                                            <div class="contest-marker-container">
                                                <div class={`contest-marker marker-${contest.platform.toLowerCase()}`}>
                                                    {contest.name.substring(0, 15)}...
                                                </div>
                                                <div class="contest-tooltip">
                                                    <div class="tooltip-title">{contest.name}</div>
                                                    <div class="tooltip-time">
                                                        <ion-icon name="time-outline"></ion-icon>
                                                        {contest.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <a href={contest.url} target="_blank" rel="noopener noreferrer" class="tooltip-link">
                                                        View Contest
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </For>
                                    {dayData.contests.length > 3 && (
                                        <div class="more-contests">+{dayData.contests.length - 3} more</div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}

export default Calendar;
