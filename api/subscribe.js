import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Configure transporter using environment variables
        // For Vercel, ensure these env vars are set in your project settings
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        try {
            // Send notification to admin (or self)
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Default to sender if admin not set
                subject: 'New CodeCal Subscriber',
                text: `A new user has subscribed to CodeCal notifications: ${email}`,
                html: `<p>A new user has subscribed to CodeCal notifications:</p><h3>${email}</h3>`,
            });

            // Optionally send a welcome email to the user
            // await transporter.sendMail({ ... });

            return res.status(200).json({ message: 'Subscribed successfully' });
        } catch (error) {
            console.error('Email error:', error);
            return res.status(500).json({ error: 'Failed to send email notification' });
        }
    } else {
        // Handle other HTTP methods
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
