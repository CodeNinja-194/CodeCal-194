import { For, Show } from 'solid-js';

const platforms = ['all', 'LeetCode', 'CodeChef', 'CodeForces', 'AtCoder'];

function Filters(props) {
    return (
        <div class="filters-bar">
            <div class="search-container">
                <ion-icon name="search-outline"></ion-icon>
                <input
                    type="text"
                    placeholder="Search contests..."
                    onInput={(e) => props.onSearch(e.currentTarget.value)}
                    class="search-input"
                />
            </div>

            <div class="filters-actions">
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
            </div>
        </div>
    );
}

export default Filters;
