import { createSignal, onMount, For, Show, createMemo } from 'solid-js';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ContestGrid from './components/ContestGrid';
import Calendar from './components/Calendar';
import StatCards from './components/StatCards';
import ContestFlux from './components/ContestFlux';
import PlatformIntensity from './components/PlatformIntensity';
import PracticeZenith from './components/PracticeZenith';
import Footer from './components/Footer';
import { fetchContests, fallbackContests } from './lib/contests';

function App() {
    const initialData = fallbackContests.map(c => ({ ...c, time: new Date(c.time) }));
    const [contests, setContests] = createSignal(initialData);
    const [activeFilter, setActiveFilter] = createSignal('all');
    const [view, setView] = createSignal('list');
    const [currentMonth, setCurrentMonth] = createSignal(new Date());
    const [isSyncing, setIsSyncing] = createSignal(false);
    const [searchQuery, setSearchQuery] = createSignal('');

    const refreshData = async () => {
        setIsSyncing(true);
        localStorage.removeItem('codecal_cache'); // Clear cache
        const data = await fetchContests();
        setContests(data);
        setIsSyncing(false);
    };

    onMount(async () => {
        setIsSyncing(true);
        const data = await fetchContests();
        setContests(data);
        setIsSyncing(false);
    });

    const handleFilter = (platform) => {
        setActiveFilter(platform);
    };

    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    };

    const displayedContests = createMemo(() => {
        let filtered = contests();

        if (activeFilter() !== 'all') {
            filtered = filtered.filter(c => c.platform === activeFilter());
        }

        if (searchQuery()) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(searchQuery()) ||
                c.platform.toLowerCase().includes(searchQuery())
            );
        }

        return filtered;
    });

    return (
        <>
            <div class="glow-orb orb-1"></div>
            <div class="glow-orb orb-2"></div>
            <div class="grid-overlay"></div>

            <div class="app-container">
                <Header isSyncing={isSyncing()} onRefresh={refreshData} />

                <main>
                    <Hero />

                    <Filters
                        activeFilter={activeFilter()}
                        onFilter={handleFilter}
                        onSearch={handleSearch}
                        view={view()}
                        onViewChange={setView}
                        showPlatformFilters={true}
                    />

                    <Show when={view() === 'list'}>
                        <StatCards contests={displayedContests()} />
                        <ContestGrid
                            contests={displayedContests()}
                            activeFilter={activeFilter()}
                        />
                    </Show>

                    <Show when={view() === 'calendar'}>
                        <StatCards contests={displayedContests()} />
                        <Calendar
                            contests={displayedContests()}
                            currentMonth={currentMonth()}
                            onMonthChange={setCurrentMonth}
                        />
                    </Show>

                    <ContestFlux contests={contests()} />
                    <PracticeZenith contests={contests()} />
                    <PlatformIntensity contests={contests()} />
                </main>

                <Footer />
            </div>
        </>
    );
}

export default App;
