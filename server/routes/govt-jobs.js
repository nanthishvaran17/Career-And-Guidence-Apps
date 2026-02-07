const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/govt-jobs?educationLevel=undergraduate&age=21&category=General
router.get('/', (req, res) => {
    const { educationLevel, age, category } = req.query;

    db.all('SELECT * FROM govt_jobs', [], (err, jobs) => {
        if (err) return res.status(500).json({ error: 'DB Error' });

        const eligibleJobs = jobs.map(job => {
            let eligibility = {};
            try {
                eligibility = JSON.parse(job.eligibility_criteria || '{}');
            } catch (e) { }

            // Check Eligibility
            let isEligible = true;
            let reasons = [];

            // Education Check (Simplified)
            if (eligibility.education && educationLevel) {
                if (educationLevel !== eligibility.education && eligibility.education === 'undergraduate' && educationLevel !== 'postgraduate') {
                    isEligible = false;
                }
            }

            // Age Check
            if (age) {
                const userAge = parseInt(age);
                if (eligibility.age_min && userAge < eligibility.age_min) isEligible = false;
                if (eligibility.age_max && userAge > eligibility.age_max) isEligible = false;
            }

            return {
                ...job,
                isEligible,
                eligibility_criteria: eligibility
            };
        }); // For now, return all bit mark eligibility. Or filter? Input requirement says "Eligible government jobs".
        // Let's filter for "Eligible" list, but maybe frontend wants all?
        // User goal: "Recommend... Eligible government jobs".

        // Let's just return the processed list, frontend can tabulate "Eligible" vs "All".
        res.json(eligibleJobs);
    });
});

module.exports = router;
