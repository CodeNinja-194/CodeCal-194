import { For, Show } from 'solid-js';

const platforms = ['all', 'LeetCode', 'CodeChef', 'CodeForces', 'AtCoder'];

function Filters(props) {
    return (
        <div class="filters">
            <Show when={props.showPlatformFilters}>
                <div class="platform-filters">
                    <For each={platforms}>
                        {(platform) => (
                            <button
                                class={`filter-chip ${props.activeFilter === platform ? 'active' : ''}`}
                                onClick={() => props.onFilter(platform)}
                            >
                                {platform === 'all' ? 'All' : platform}
                            </button>
                        )}
                    </For>
                </div>
            </Show>

            <Show when={props.view === 'list'}>
                <div class="view-toggle">
                    <button
                        class={`toggle-btn ${props.view === 'list' ? 'active' : ''}`}
                        onClick={() => props.onViewChange('list')}
                    >
                        <ion-icon name="list-outline"></ion-icon>
                    </button>
                    <button
                        class={`toggle-btn ${props.view === 'calendar' ? 'active' : ''}`}
                        onClick={() => props.onViewChange('calendar')}
                    >
                        <ion-icon name="calendar-outline"></ion-icon>
                    </button>
                </div>
            </Show>

            <Show when={props.view === 'calendar'}>
                <div class="view-toggle">
                    <button
                        class="toggle-btn"
                        onClick={() => props.onViewChange('list')}
                    >
                        <ion-icon name="list-outline"></ion-icon>
                    </button>
                    <button
                        class="toggle-btn active"
                        onClick={() => props.onViewChange('calendar')}
                    >
                        <ion-icon name="calendar-outline"></ion-icon>
                    </button>
                </div>
            </Show>
        </div>
    );
}

export default Filters;
