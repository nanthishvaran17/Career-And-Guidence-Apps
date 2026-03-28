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


// Update User Profile
router.post('/profile', (req, res) => {
    let {
        id, // Passed from frontend OR we find it
        name, phone, dob, educationLevel, stream, marks,
        interests, location, state, category, familyIncome,
        careerPreference, targetExams, disability, gender
    } = req.body;

    const performUpdate = (userId) => {
        const sql = `UPDATE users SET 
            name=?, phone=?, dob=?, education_level=?, stream=?, marks=?, 
            interests=?, location=?, state=?, category=?, family_income=?, 
            career_preference=?, target_exams=?, disability=?, gender=?,
            institution_name=?, board_university=?, completion_year=?,
            skills=?, preferred_courses=?, preferred_locations=?, languages=?,
            profile_data=?
            WHERE id=?`;

        const params = [
            name, phone, dob, educationLevel, stream, marks,
            JSON.stringify(interests || []), location, state, category, familyIncome,
            careerPreference, JSON.stringify(targetExams || []), disability ? 1 : 0, gender,
            req.body.institutionName, req.body.boardUniversity, req.body.completionYear,
            JSON.stringify(req.body.skills || []),
            JSON.stringify(req.body.preferredCourses || []),
            JSON.stringify(req.body.preferredLocations || []),
            JSON.stringify(req.body.languages || []),
            JSON.stringify(req.body.profileData || {}),
            userId
        ];

        db.run(sql, params, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Profile updated', id: userId });
        });
    };

    const performInsert = () => {
        const sql = `INSERT INTO users (
            name, phone, dob, education_level, stream, marks, 
            interests, location, state, category, family_income, 
            career_preference, target_exams, disability, gender,
            institution_name, board_university, completion_year,
            skills, preferred_courses, preferred_locations, languages, profile_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            name, phone, dob, educationLevel, stream, marks,
            JSON.stringify(interests || []), location, state, category, familyIncome,
            careerPreference, JSON.stringify(targetExams || []), disability ? 1 : 0, gender,
            req.body.institutionName, req.body.boardUniversity, req.body.completionYear,
            JSON.stringify(req.body.skills || []),
            JSON.stringify(req.body.preferredCourses || []),
            JSON.stringify(req.body.preferredLocations || []),
            JSON.stringify(req.body.skills || []),
            JSON.stringify(req.body.preferredCourses || []),
            JSON.stringify(req.body.preferredLocations || []),
            JSON.stringify(req.body.languages || []),
            JSON.stringify(req.body.profileData || {})
        ];

        db.run(sql, params, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Profile created', id: this.lastID });
        });
    };

    if (id) {
        performUpdate(id);
    } else {
        // Fallback: Check if ANY user exists (Single User Mode)
        db.get('SELECT id FROM users LIMIT 1', [], (err, row) => {
            if (err) return res.status(500).json({ error: 'DB Error' });
            if (row) {
                performUpdate(row.id);
            } else {
                performInsert();
            }
        });
    }
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
                institutionName: row.institution_name,
                boardUniversity: row.board_university,
                completionYear: row.completion_year,
                skills: safeJSON(row.skills),
                preferredCourses: safeJSON(row.preferred_courses),
                preferredLocations: safeJSON(row.preferred_locations),
                languages: safeJSON(row.languages)
            };
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

module.exports = router;
