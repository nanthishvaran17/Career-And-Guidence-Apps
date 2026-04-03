const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Register / Signup
router.post('/signup', (req, res) => {
    const { fullName, phone, password } = req.body;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

    console.log(`[Signup] Checking email: '${email}'`);

    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error("DB Error in Signup Check:", err.message);
            return res.status(500).json({ error: 'DB Error: ' + err.message });
        }
        if (row) return res.status(400).json({ error: 'User already exists' });

        const sql = `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`;
        db.run(sql, [fullName, email, phone, password], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User registered successfully', userId: this.lastID });
        });
    });
});


// Update User Profile (MERGE Strategy)
router.post('/profile', (req, res) => {
    let { id, email } = req.body;

    // 1. Find the user first to merge data
    const query = id ? 'SELECT * FROM users WHERE id = ?' : 'SELECT * FROM users WHERE email = ? OR name = ? LIMIT 1';
    const params = id ? [id] : [email, req.body.name];

    db.get(query, params, (err, existingUser) => {
        if (err) return res.status(500).json({ error: 'DB Error finding user' });

        if (!existingUser) {
            // INSERT New
            const sql = `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`;
            db.run(sql, [req.body.name, req.body.email, req.body.phone], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                return res.json({ message: 'Profile created', id: this.lastID });
            });
            return;
        }

        // UPDATE Existing - Merge Data
        const userId = existingUser.id;
        
        // Helper to take new value if it's NOT undefined/null, else keep old
        const val = (newVal, oldVal) => (newVal !== undefined && newVal !== null) ? newVal : oldVal;

        // Special handling for JSON fields (Merge them or replace them?)
        // For Step-based forms, we usually replace the array if it's sent, else keep old
        const jsonField = (newVal, oldVal) => {
            if (newVal === undefined || newVal === null) return oldVal;
            // If it's already a string, keep it, if not, stringify it
            return typeof newVal === 'string' ? newVal : JSON.stringify(newVal);
        };

        const sql = `UPDATE users SET 
            name=?, phone=?, dob=?, age=?, gender=?, preferred_language=?, 
            education_level=?, stream=?, marks=?, 
            interests=?, location=?, state=?, category=?, family_income=?, 
            career_preference=?, target_exams=?, disability=?,
            institution_name=?, board_university=?, completion_year=?,
            skills=?, preferred_courses=?, preferred_locations=?, languages=?,
            profile_data=?
            WHERE id=?`;

        const updateParams = [
            val(req.body.name, existingUser.name),
            val(req.body.phone, existingUser.phone),
            val(req.body.dob, existingUser.dob),
            val(req.body.age, existingUser.age),
            val(req.body.gender, existingUser.gender),
            val(req.body.preferredLanguage, existingUser.preferred_language),
            val(req.body.educationLevel, existingUser.education_level),
            val(req.body.stream, existingUser.stream),
            val(req.body.marks, existingUser.marks),
            jsonField(req.body.interests, existingUser.interests),
            val(req.body.location, existingUser.location),
            val(req.body.state, existingUser.state),
            val(req.body.category, existingUser.category),
            val(req.body.familyIncome, existingUser.family_income),
            val(req.body.careerPreference, existingUser.career_preference),
            jsonField(req.body.targetExams, existingUser.target_exams),
            val(req.body.disability !== undefined ? (req.body.disability ? 1 : 0) : null, existingUser.disability),
            val(req.body.institutionName, existingUser.institution_name),
            val(req.body.boardUniversity, existingUser.board_university),
            val(req.body.completionYear, existingUser.completion_year),
            jsonField(req.body.skills, existingUser.skills),
            jsonField(req.body.preferredCourses, existingUser.preferred_courses),
            jsonField(req.body.preferredLocations, existingUser.preferred_locations),
            jsonField(req.body.languages, existingUser.languages),
            jsonField(req.body.profileData, existingUser.profile_data),
            userId
        ];

        db.run(sql, updateParams, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Profile merged and updated', id: userId });
        });
    });
});


// Get Profile
router.get('/profile', (req, res) => {
    const userId = req.query.id;
    const sql = userId ? 'SELECT * FROM users WHERE id = ?' : 'SELECT * FROM users LIMIT 1';
    const params = userId ? [userId] : [];

    db.get(sql, params, (err, row) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        if (!row) return res.json(null);

        // Parse JSON fields
        try { row.interests = JSON.parse(row.interests); } catch (e) { row.interests = []; }
        try { row.target_exams = JSON.parse(row.target_exams); } catch (e) { row.target_exams = []; }
        try { row.skills = JSON.parse(row.skills); } catch (e) { row.skills = []; }
        try { row.preferred_courses = JSON.parse(row.preferred_courses); } catch (e) { row.preferred_courses = []; }
        try { row.preferred_locations = JSON.parse(row.preferred_locations); } catch (e) { row.preferred_locations = []; }
        try { row.languages = JSON.parse(row.languages); } catch (e) { row.languages = []; }
        try { row.profile_data = JSON.parse(row.profile_data); } catch (e) { row.profile_data = {}; }
        row.disability = !!row.disability;

        res.json(row);
    });
});

// ==========================================
// 2-FACTOR AUTHENTICATION (Password + OTP)
// ==========================================

// Store OTPs in memory for simplicity (in production use Redis/DB)
const otpStore = new Map();

// 1. Initial Login Check: Verify Password & Send OTP
router.post('/login-init', (req, res) => {
    const password = req.body.password ? req.body.password.trim() : '';
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

    console.log(`[Login] Attempt for email: '${email}'`);

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ error: 'DB Error' });

        // If user exists, check password
        if (row) {
            // In a real app, use bcrypt.compare here
            if (row.password !== password) {
                console.log(`[Login] Invalid credentials for email: '${email}'. Required: '${row.password}', provided: '${password}'`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Password correct - Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

            console.log(`\n === LOGIN OTP for ${email} ===\nCode: ${otp} \n ==============================\n`);

            return res.json({ step: 'otp', message: 'Password verified. OTP sent.', otp });
        } else {
            // For this hackathon/demo, if user doesn't exist, we can treat it as a new signup attempt
            // OR specifically ask them to sign up. 
            return res.status(404).json({ error: 'User not found. Please Sign Up.' });
        }
    });
});

// 2. Final Login Step: Verify OTP
router.post('/login-verify', (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore.get(email);

    if (!record) return res.status(400).json({ error: 'OTP expired or not requested' });
    if (Date.now() > record.expires) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP expired' });
    }
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    // OTP Verified - Clear it
    otpStore.delete(email);

    // Get User Data
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ error: 'DB Error' });

        if (row) {
            const safeJSON = (str) => { try { return JSON.parse(str); } catch { return []; } };
            const user = {
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                dob: row.dob,
                educationLevel: row.education_level,
                stream: row.stream,
                marks: row.marks,
                interests: safeJSON(row.interests),
                location: row.location,
                state: row.state,
                category: row.category,
                familyIncome: row.family_income,
                careerPreference: row.career_preference,
                targetExams: safeJSON(row.target_exams),
                disability: !!row.disability,
                gender: row.gender,
                age: row.age,
                preferredLanguage: row.preferred_language,
                institutionName: row.institution_name,

                boardUniversity: row.board_university,
                completionYear: row.completion_year,
                skills: safeJSON(row.skills),
                preferredCourses: safeJSON(row.preferred_courses),
                preferredLocations: safeJSON(row.preferred_locations),
                languages: safeJSON(row.languages)
            };

            // ── AUTO-LOG LOGIN EVENT ─────────────────────────────────────────
            const ip = req.ip || req.connection?.remoteAddress || 'unknown';
            const ua = req.headers['user-agent'] || 'unknown';
            db.run(
                `INSERT INTO user_activity_log (user_id, email, action, ip_address, user_agent, status, details)
                 VALUES (?, ?, 'login', ?, ?, 'success', 'OTP-verified login successful')`,
                [row.id, row.email, ip, ua],
                (logErr) => { if (logErr) console.error('Login log error:', logErr.message); }
            );
            // ────────────────────────────────────────────────────────────────

            res.json({ message: 'Login successful', user });
        } else {
            res.status(404).json({ error: 'User record missing.' });
        }
    });
});

// Send OTP (Generic use case / Signup)
router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
    console.log(`\n === GENERAL OTP for ${email} ===\nCode: ${otp} \n ==============================\n`);
    res.json({ message: 'OTP sent', otp });
});

// Verify OTP (Generic / Signup)
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ error: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    otpStore.delete(email);

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        // If user exists, fine. If not, REGISTER.
        if (row) {
            const safeJSON = (str) => { try { return JSON.parse(str); } catch { return []; } };
            const user = {
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                dob: row.dob,
                educationLevel: row.education_level,
                stream: row.stream,
                marks: row.marks,
                interests: safeJSON(row.interests),
                location: row.location,
                state: row.state,
                category: row.category,
                familyIncome: row.family_income,
                careerPreference: row.career_preference,
                targetExams: safeJSON(row.target_exams),
                disability: !!row.disability,
                gender: row.gender,
                age: row.age,
                preferredLanguage: row.preferred_language,
                institutionName: row.institution_name,

                boardUniversity: row.board_university,
                completionYear: row.completion_year,
                skills: safeJSON(row.skills),
                preferredCourses: safeJSON(row.preferred_courses),
                preferredLocations: safeJSON(row.preferred_locations),
                languages: safeJSON(row.languages)
            };
            res.json({ message: 'Verified', user });
        } else {
            // Register new
            const sql = `INSERT INTO users(name, email, phone, password) VALUES(?, ?, ?, ?)`;
            const name = email.split('@')[0];
            db.run(sql, [name, email, '', 'otp-verified'], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                const user = { id: this.lastID, email, name, interests: [], targetExams: [] };
                res.json({ message: 'Registered', user, isNewUser: true });
            });
        }
    });
});

// ==========================================
// TRUST SCORE - 4 Factor Formula (100 pts)
// ==========================================
router.get('/trust-score', (req, res) => {
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const sql = `SELECT name, email, phone, location, education_level, stream, marks,
                 institution_name, skills, profile_data, created_at FROM users WHERE id = ?`;

    db.get(sql, [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'User not found' });

        let score = 0;
        const suggestions = [];
        const breakdown = {};

        // ── FACTOR 1: Profile Completion (40 points) ──
        const profileFields = [
            { key: 'name',     label: 'Full Name' },
            { key: 'email',    label: 'Email' },
            { key: 'phone',    label: 'Mobile Number' },
            { key: 'location', label: 'Location / City' },
        ];
        const profilePointsEach = 10; // 4 fields x 10 = 40
        let profileScore = 0;
        const missingProfile = [];
        profileFields.forEach(f => {
            if (row[f.key] && String(row[f.key]).trim().length > 0) {
                profileScore += profilePointsEach;
            } else {
                missingProfile.push(f.label);
            }
        });
        score += profileScore;
        breakdown.profileCompletion = profileScore;
        if (missingProfile.length > 0) {
            suggestions.push(`Complete your profile: Missing ${missingProfile.join(', ')}`);
        }

        // ── FACTOR 2: Education Details (20 points) ──
        let eduScore = 0;
        const eduFields = [row.education_level, row.stream, row.marks, row.institution_name];
        const filledEdu = eduFields.filter(v => v && String(v).trim().length > 0).length;
        eduScore = Math.round((filledEdu / eduFields.length) * 20);
        score += eduScore;
        breakdown.educationDetails = eduScore;
        if (eduScore < 20) {
            suggestions.push('Add your Education Details (course, college, CGPA) to gain up to 20 points.');
        }

        // ── FACTOR 3: Document Upload (20 points) ──
        let docScore = 0;
        try {
            const profileData = typeof row.profile_data === 'string'
                ? JSON.parse(row.profile_data) : (row.profile_data || {});
            const hasResume = profileData.resumeLink && String(profileData.resumeLink).startsWith('http');
            const hasCert   = profileData.certificateLink && String(profileData.certificateLink).startsWith('http');
            const hasPortfolio = profileData.portfolioLink && String(profileData.portfolioLink).startsWith('http');
            if (hasResume)    docScore += 10;
            if (hasCert || hasPortfolio) docScore += 10;
        } catch (e) { /* profile_data not parseable */ }
        score += docScore;
        breakdown.documentUpload = docScore;
        if (docScore < 20) {
            suggestions.push('Upload your Resume and Certificate links to earn up to 20 points.');
        }

        // ── FACTOR 4: Skill Assessment (20 points) ──
        let skillScore = 0;
        try {
            const skills = typeof row.skills === 'string' ? JSON.parse(row.skills) : (row.skills || []);
            if (Array.isArray(skills) && skills.length > 0) {
                skillScore = Math.min(20, skills.length * 5); // 5 pts per skill, max 20
            }
        } catch (e) { /* skip */ }
        score += skillScore;
        breakdown.skillAssessment = skillScore;
        if (skillScore < 20) {
            suggestions.push('Add your Skills or complete the Aptitude Test to gain up to 20 points.');
        }

        // ── Level Classification ──
        let level = 'Low Trust';
        let levelColor = 'red';
        if (score > 70) { level = 'High Trust'; levelColor = 'green'; }
        else if (score > 40) { level = 'Medium Trust'; levelColor = 'yellow'; }

        res.json({
            status: 'success',
            userId: parseInt(userId),
            trustScore: Math.min(100, score),
            level,
            levelColor,
            breakdown,
            suggestions: suggestions.slice(0, 3), // Top 3 suggestions
            message: suggestions.length === 0
                ? 'Excellent! Your profile is complete and trusted.'
                : suggestions[0],
        });
    });
});

module.exports = router;

