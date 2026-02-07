const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all skills
router.get('/', (req, res) => {
    db.all("SELECT * FROM skills", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Parse JSON fields
        const skills = rows.map(s => ({
            ...s,
            roadmap: JSON.parse(s.roadmap || '[]'),
            resources: JSON.parse(s.resources || '[]')
        }));
        res.json(skills);
    });
});

module.exports = router;
