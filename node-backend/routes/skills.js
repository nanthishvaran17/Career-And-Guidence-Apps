const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all skills with optional search
router.get('/', (req, res) => {
    const { q } = req.query;
    let sql = "SELECT * FROM skills";
    const params = [];
    if (q) {
        sql += " WHERE title LIKE ? OR category LIKE ? OR description LIKE ?";
        const term = `%${q}%`;
        params.push(term, term, term);
    }
    sql += " ORDER BY category, title LIMIT 500";

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const skills = (rows || []).map(s => ({
            ...s,
            title: s.title || 'Unknown Skill',
            roadmap: s.roadmap ? (() => { try { return JSON.parse(s.roadmap); } catch(e) { return []; } })() : ['Learn Basics', 'Practice Projects', 'Build Portfolio', 'Get Certified'],
            resources: s.resources ? (() => { try { return JSON.parse(s.resources); } catch(e) { return []; } })() : ['YouTube', 'Udemy', 'Coursera', 'Official Documentation'],
            certifications: s.certifications ? (() => { try { return JSON.parse(s.certifications); } catch(e) { return []; } })() : [],
            level: s.level || 'Beginner',
        }));

        res.json(skills);
    });
});

module.exports = router;

