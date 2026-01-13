import { createSignal, onMount, For, Show } from 'solid-js';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ContestGrid from './components/ContestGrid';
import Calendar from './components/Calendar';
import AuthModal from './components/AuthModal';
import AlertModal from './components/AlertModal';
import StatCards from './components/StatCards';
import Footer from './components/Footer';
import { fetchContests, fallbackContests } from './lib/contests';

function App() {
    // Show fallback data immediately for "milliseconds" load time
    const initialData = fallbackContests.map(c => ({ ...c, time: new Date(c.time) }));
    const [contests, setContests] = createSignal(initialData);
    const [filteredContests, setFilteredContests] = createSignal(initialData);
    const [activeFilter, setActiveFilter] = createSignal('all');
    const [view, setView] = createSignal('list');
    const [currentMonth, setCurrentMonth] = createSignal(new Date());
    const [showAuthModal, setShowAuthModal] = createSignal(false);
    const [alertMessage, setAlertMessage] = createSignal('');
    const [showAlert, setShowAlert] = createSignal(false);
    const [isSubscribed, setIsSubscribed] = createSignal(false);
    const [isSyncing, setIsSyncing] = createSignal(false);

    const showCustomAlert = (msg) => {
        setAlertMessage(msg);
        setShowAlert(true);
    };

    onMount(async () => {
        // Check if user is already subscribed
        const savedEmail = localStorage.getItem('codecal_subscribed');
        if (savedEmail) {
            setIsSubscribed(true);
        }

        // Fetch contests
        setIsSyncing(true);
        const data = await fetchContests();
        setContests(data);
        setFilteredContests(data);
        setIsSyncing(false);
    });

    const handleFilter = (platform) => {
        setActiveFilter(platform);
        if (platform === 'all') {
            setFilteredContests(contests());
        } else {
            setFilteredContests(contests().filter(c => c.platform === platform));
        }
    };

    const handleSubscribe = (user) => {
        setIsSubscribed(true);
        setShowAuthModal(false);
        showCustomAlert("Successfully subscribed!");
    };

    return (
        <>
            {/* Background Effects */}
            <div class="glow-orb orb-1"></div>
            <div class="glow-orb orb-2"></div>
            <div class="grid-overlay"></div>

            <div class="app-container">
                <Header
                    isSubscribed={isSubscribed()}
                    isSyncing={isSyncing()}
                    onEnableAlerts={() => isSubscribed() ? showCustomAlert("You are already subscribed!") : setShowAuthModal(true)}
                />

                <main>
                    <Hero />

                    <Filters
                        activeFilter={activeFilter()}
                        onFilter={handleFilter}
                        view={view()}
                        onViewChange={setView}
                        showPlatformFilters={false}
                    />

                    <Show when={view() === 'list'}>
                        <StatCards contests={contests()} />
                        <ContestGrid
                            contests={contests()}
                            activeFilter={activeFilter()}
                            onFilter={handleFilter}
                        />
                    </Show>

                    <Show when={view() === 'calendar'}>
                        <StatCards contests={contests()} />
                        <Calendar
                            contests={contests()}
                            currentMonth={currentMonth()}
                            onMonthChange={setCurrentMonth}
                        />
                    </Show>
                </main>

                <Footer />
            </div>

            <Show when={showAuthModal()}>
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={handleSubscribe}
                    showAlert={showCustomAlert}
                />
            </Show>

            <Show when={showAlert()}>
                <AlertModal
                    message={alertMessage()}
                    onClose={() => setShowAlert(false)}
                />
            </Show>
        </>
    );
}

export default App;
