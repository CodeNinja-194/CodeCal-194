import fs from 'fs';
import nodemailer from 'nodemailer';

const SUBSCRIBERS_FILE = '/tmp/subscribers.json';

// Email config from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Helper to read subscribers
function getSubscribers() {
    try {
        if (fs.existsSync(SUBSCRIBERS_FILE)) {
            const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading subscribers:', error);
    }
    return [];
}

export default async function handler(request, response) {
    try {
        // Get all subscribers
        const subscribers = getSubscribers();

        if (subscribers.length === 0) {
            return response.status(200).json({ status: 'No subscribers to notify.' });
        }

        // Fetch upcoming contests
        const res = await fetch('https://kontests.net/api/v1/all');
        const allContests = await res.json();
        const now = new Date();

        // Find contests starting in ~30 minutes
        const upcoming = allContests.filter(c => {
            const start = new Date(c.start_time);
            const diff = (start - now) / 1000 / 60; // minutes
            const is30Min = diff > 25 && diff < 35;
            return is30Min && ['LeetCode', 'CodeChef', 'CodeForces', 'AtCoder'].includes(c.site);
        });

        if (upcoming.length === 0) {
            return response.status(200).json({ status: 'No contests starting soon.' });
        }

        // Check if email credentials are configured
        if (!EMAIL_USER || !EMAIL_PASS) {
            return response.status(500).json({
                error: 'Email credentials not configured. Set EMAIL_USER and EMAIL_PASS environment variables.'
            });
        }

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });

        const log = [];

        for (const contest of upcoming) {
            const startTime = new Date(contest.start_time).toLocaleString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });

            const emailHtml = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #6366f1;">🚀 Contest Alert!</h2>
                    <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius: 12px; padding: 24px; color: white;">
                        <h3 style="margin: 0 0 12px 0; color: #a5b4fc;">${contest.site}</h3>
                        <h2 style="margin: 0 0 16px 0;">${contest.name}</h2>
                        <p style="margin: 0 0 8px 0; opacity: 0.9;">🕐 Starts: ${startTime}</p>
                        <p style="margin: 0 0 20px 0; opacity: 0.9;">⏳ Starting in ~30 minutes!</p>
                        <a href="${contest.url}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                            Join Contest →
                        </a>
                    </div>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center;">
                        You received this because you subscribed to CodeCal contest alerts.
                    </p>
                </div>
            `;

            // Send to all subscribers
            for (const email of subscribers) {
                try {
                    await transporter.sendMail({
                        from: `"CodeCal" <${EMAIL_USER}>`,
                        to: email,
                        subject: `🔔 ${contest.name} starts in 30 minutes!`,
                        html: emailHtml
                    });
                    log.push(`✅ Email sent to ${email}`);
                } catch (e) {
                    log.push(`❌ Failed for ${email}: ${e.message}`);
                }
            }
        }

        return response.status(200).json({
            status: 'Notifications processed',
            contestsFound: upcoming.length,
            subscribersNotified: subscribers.length,
            log
        });

    } catch (error) {
        console.error('Notify error:', error);
        return response.status(500).json({ error: error.message });
    }
}
