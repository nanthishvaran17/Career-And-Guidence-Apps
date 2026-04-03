const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const db = require('../database/db');

const SALT_ROUNDS = 12;

// ─── Rate Limiter: max 5 attempts per 15 min per IP ───────────────────────────
const passwordChangeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many password change attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Helper: log security activity
const logActivity = (userId, action, status, details, req) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';
    db.run(
        `INSERT INTO security_activity_log (user_id, action, ip_address, user_agent, status, details) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, action, ip, ua, status, details]
    );
};

// Helper: sanitize input to prevent XSS/injection
const sanitize = (str) => {
    if (!str) return '';
    return String(str).replace(/[<>"'%;()&]/g, '').trim();
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
router.post('/change-password', passwordChangeLimiter, async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // 1. Input presence check
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const safeUserId = sanitize(String(userId));
        const safeNew = String(newPassword); // Don't sanitize password chars

        // 2. Password strength validation (backend)
        const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!strengthRegex.test(safeNew)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
            });
        }

        // 3. Fetch current user record
        db.get('SELECT id, password FROM users WHERE id = ?', [safeUserId], async (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error.' });
            if (!user) return res.status(404).json({ error: 'User not found.' });

            // 4. Verify current password
            // Support both plain text (legacy) and bcrypt-hashed passwords
            let currentPasswordValid = false;
            if (user.password && user.password.startsWith('$2b$')) {
                currentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            } else {
                // Legacy plain text comparison
                currentPasswordValid = (user.password === currentPassword);
            }

            if (!currentPasswordValid) {
                logActivity(user.id, 'password_change_attempt', 'failed', 'Incorrect current password', req);
                return res.status(401).json({ error: 'Current password is incorrect.' });
            }

            // 5. Check last 3 passwords (prevent reuse)
            db.all(
                'SELECT password_hash FROM password_history WHERE user_id = ? ORDER BY changed_at DESC LIMIT 3',
                [user.id],
                async (err, history) => {
                    if (!err && history) {
                        for (const record of history) {
                            const reused = await bcrypt.compare(safeNew, record.password_hash);
                            if (reused) {
                                return res.status(400).json({
                                    error: 'You cannot reuse one of your last 3 passwords. Please choose a different password.'
                                });
                            }
                        }
                    }

                    // 6. Hash the new password with bcrypt + salt
                    const newHash = await bcrypt.hash(safeNew, SALT_ROUNDS);

                    // 7. Update password in users table
                    db.run('UPDATE users SET password = ? WHERE id = ?', [newHash, user.id], (err) => {
                        if (err) return res.status(500).json({ error: 'Failed to update password.' });

                        // 8. Store in password history
                        db.run(
                            'INSERT INTO password_history (user_id, password_hash) VALUES (?, ?)',
                            [user.id, newHash]
                        );

                        // 9. Prune history to last 3 only
                        db.run(`
                            DELETE FROM password_history 
                            WHERE user_id = ? AND id NOT IN (
                                SELECT id FROM password_history WHERE user_id = ? ORDER BY changed_at DESC LIMIT 3
                            )
                        `, [user.id, user.id]);

                        // 10. Log success activity
                        logActivity(user.id, 'password_changed', 'success', 'Password changed successfully via settings page', req);

                        res.json({
                            success: true,
                            message: 'Password updated successfully! A confirmation has been recorded.'
                        });
                    });
                }
            );
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// ─── GET SECURITY ACTIVITY LOG ────────────────────────────────────────────────
router.get('/security-log', (req, res) => {
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    db.all(
        `SELECT action, status, details, timestamp FROM security_activity_log WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        }
    );
});

// ─── LOG LOGOUT EVENT ─────────────────────────────────────────────────────────
router.post('/log-logout', (req, res) => {
    const { userId, email, loginTimestamp } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    // Calculate session duration if loginTimestamp provided
    let sessionDurationMins = null;
    if (loginTimestamp) {
        const loginTime = new Date(loginTimestamp).getTime();
        const now = Date.now();
        if (!isNaN(loginTime)) {
            sessionDurationMins = Math.round((now - loginTime) / 60000);
        }
    }

    db.run(
        `INSERT INTO user_activity_log 
         (user_id, email, action, ip_address, user_agent, status, details, session_duration_mins, logged_in_at)
         VALUES (?, ?, 'logout', ?, ?, 'success', 'User logged out', ?, ?)`,
        [userId, email || null, ip, ua, sessionDurationMins, loginTimestamp || null],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Logout logged successfully' });
        }
    );
});

// ─── GET FULL ACTIVITY LOG (Login + Logout history) ──────────────────────────
router.get('/activity-log', (req, res) => {
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    db.all(
        `SELECT id, action, email, ip_address, user_agent, status, details, 
                session_duration_mins, logged_in_at, timestamp
         FROM user_activity_log 
         WHERE user_id = ? 
         ORDER BY timestamp DESC 
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        }
    );
});

// ─── GET ACTIVITY LOG SUMMARY (stats) ─────────────────────────────────────────
router.get('/activity-summary', (req, res) => {
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    db.get(
        `SELECT 
            COUNT(*) as total_sessions,
            SUM(CASE WHEN action = 'login' THEN 1 ELSE 0 END) as total_logins,
            SUM(CASE WHEN action = 'logout' THEN 1 ELSE 0 END) as total_logouts,
            AVG(session_duration_mins) as avg_session_mins,
            MAX(timestamp) as last_activity,
            MIN(timestamp) as first_activity
         FROM user_activity_log 
         WHERE user_id = ?`,
        [userId],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row || {});
        }
    );
});

module.exports = router;

