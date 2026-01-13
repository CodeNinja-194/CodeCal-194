import { createSignal } from 'solid-js';

function AuthModal(props) {
    const [email, setEmail] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [reminders, setReminders] = createSignal({
        '24h': true,
        '1h': true,
        '10min': true
    });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const toggleReminder = (time) => {
        setReminders(prev => ({
            ...prev,
            [time]: !prev[time]
        }));
    };

    const handleSubscribe = async () => {
        const emailValue = email().trim();

        if (!emailValue) {
            props.showAlert("Please enter your email address.");
            return;
        }

        if (!validateEmail(emailValue)) {
            props.showAlert("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            // Send subscription request to API with reminder preferences
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailValue,
                    reminders: reminders()
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store subscription and preferences locally
                localStorage.setItem('codecal_subscribed', emailValue);
                localStorage.setItem('codecal_reminders', JSON.stringify(reminders()));
                props.onSuccess({ email: emailValue, reminders: reminders() });
            } else {
                props.showAlert(data.error || "Failed to subscribe. Please try again.");
            }
        } catch (error) {
            // If API fails, still save locally for now
            localStorage.setItem('codecal_subscribed', emailValue);
            localStorage.setItem('codecal_reminders', JSON.stringify(reminders()));
            props.onSuccess({ email: emailValue, reminders: reminders() });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="modal" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
            <div class="modal-content glass-panel">
                <span class="close-btn" onClick={props.onClose}>&times;</span>
                <h2>🔔 Get Notified</h2>
                <p style="text-align: center; color: var(--text-muted); margin-bottom: 2rem;">
                    Never miss a contest! Get smart reminders before they start.
                </p>

                <div class="input-group">
                    <ion-icon name="mail-outline"></ion-icon>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email()}
                        onInput={(e) => setEmail(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
                    />
                </div>

                {/* Reminder Preferences */}
                <div class="reminder-options">
                    <div class="reminder-label">⏰ Auto Reminders:</div>

                    <label class="reminder-checkbox">
                        <input
                            type="checkbox"
                            checked={reminders()['24h']}
                            onChange={() => toggleReminder('24h')}
                        />
                        <span>24 hours before</span>
                    </label>

                    <label class="reminder-checkbox">
                        <input
                            type="checkbox"
                            checked={reminders()['1h']}
                            onChange={() => toggleReminder('1h')}
                        />
                        <span>1 hour before</span>
                    </label>

                    <label class="reminder-checkbox">
                        <input
                            type="checkbox"
                            checked={reminders()['10min']}
                            onChange={() => toggleReminder('10min')}
                        />
                        <span>10 minutes before</span>
                    </label>
                </div>

                <button
                    class="glass-btn full-width primary-btn"
                    onClick={handleSubscribe}
                    disabled={loading()}
                >
                    {loading() ? 'Subscribing...' : '🚀 Enable Smart Alerts'}
                </button>

                <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 1.5rem;">
                    💡 Browser-based alerts. No login required!
                </p>
            </div>
        </div>
    );
}

export default AuthModal;
