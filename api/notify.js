import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// --- SUPABASE CONFIG ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role key for server side
const supabase = createClient(supabaseUrl, supabaseKey);

// --- TWILIO & EMAIL CONFIG (unchanged) ---
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE;

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export default async function handler(request, response) {
    try {
        // 1. Fetch Users from Supabase
        const { data: users, error: usersErr } = await supabase.from('users').select('*');
        if (usersErr) {
            return response.status(500).json({ error: 'Supabase users fetch error: ' + usersErr.message });
        }

        // 2. Fetch Contests
        const res = await fetch('https://kontests.net/api/v1/all');
        const allContests = await res.json();
        const now = new Date();
        const upcoming = allContests.filter(c => {
            const start = new Date(c.start_time);
            const diff = (start - now) / 1000 / 60; // minutes
            const is30Min = diff > 25 && diff < 35;
            const is10Min = diff > 5 && diff < 15;
            return (is30Min || is10Min) && ['LeetCode', 'CodeChef', 'CodeForces', 'AtCoder'].includes(c.site);
        });

        if (upcoming.length === 0) {
            return response.status(200).json({ status: 'No contests starting soon.' });
        }

        const log = [];
        for (const contest of upcoming) {
            const msg = `🔔 ALERT: ${contest.name} (${contest.site}) starts soon! Link: ${contest.url}`;
            for (const user of users) {
                // SMS via Twilio
                if (user.phoneNumber && TWILIO_SID) {
                    try {
                        const client = twilio(TWILIO_SID, TWILIO_TOKEN);
                        await client.messages.create({
                            body: msg,
                            from: TWILIO_PHONE,
                            to: user.phoneNumber
                        });
                        log.push(`SMS sent to ${user.phoneNumber}`);
                    } catch (e) {
                        log.push(`SMS failed for ${user.phoneNumber}: ${e.message}`);
                    }
                }
                // Email via Nodemailer
                if (user.email && EMAIL_USER) {
                    try {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: { user: EMAIL_USER, pass: EMAIL_PASS }
                        });
                        await transporter.sendMail({
                            from: `"CodeCal Bot" <${EMAIL_USER}>`,
                            to: user.email,
                            subject: `🚀 Contest Alert: ${contest.name}`,
                            text: msg
                        });
                        log.push(`Email sent to ${user.email}`);
                    } catch (e) {
                        log.push(`Email failed for ${user.email}: ${e.message}`);
                    }
                }
            }
        }
        return response.status(200).json({ status: 'Notifications processed', log });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
