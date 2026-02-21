const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all jobs with filtering
router.get('/', (req, res) => {
    const { sector, location, job_type } = req.query;

    let sql = "SELECT * FROM jobs WHERE 1=1";
    const params = [];

    if (sector) {
        sql += " AND sector LIKE ?";
        params.push(`%${sector}%`);
    }
    if (location) {
        sql += " AND location LIKE ?";
        params.push(`%${location}%`);
    }
    if (job_type) {
        sql += " AND job_type = ?";
        params.push(job_type);
    }

    sql += " ORDER BY posted_date DESC LIMIT 100";

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Error fetching jobs:", err);
            return res.status(500).json({ error: "Failed to fetch jobs" });
        }

        // Parse JSON fields
        const jobs = rows.map(job => ({
            ...job,
            skills_required: job.skills_required ? JSON.parse(job.skills_required) : []
        }));

        res.json(jobs);
    });
});

// GET job by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM jobs WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Job not found" });

        res.json({
            ...row,
            skills_required: row.skills_required ? JSON.parse(row.skills_required) : []
        });
    });
});

module.exports = router;
