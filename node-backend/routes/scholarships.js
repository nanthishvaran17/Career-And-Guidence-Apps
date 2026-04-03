const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
    const { income, category, marks, gender, disability } = req.query; // income in Lakhs

    db.all('SELECT * FROM scholarships', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'DB Error' });

        const results = rows.map(s => {
            let isEligible = true;
            let crit = {};
            try { crit = JSON.parse(s.eligibility_criteria); } catch (e) { }

            // Income Check
            if (income && crit.income_limit_lakhs) {
                if (parseFloat(income) > crit.income_limit_lakhs) isEligible = false;
            }

            // Category Check
            if (category && crit.category && crit.category.length > 0) {
                if (!crit.category.includes('All') && !crit.category.includes(category)) isEligible = false;
            }

            // Marks Check
            if (marks && crit.min_marks) {
                if (parseFloat(marks) < crit.min_marks) isEligible = false;
            }

            // Gender Check
            if (crit.gender) {
                if (gender && crit.gender.toLowerCase() !== gender.toLowerCase()) isEligible = false;
            }

            // Disability Check
            if (crit.disability === true) {
                if (disability !== 'true') isEligible = false;
            }

            return { ...s, isEligible };
        });

        // Sort: Eligible first
        results.sort((a, b) => (a.isEligible === b.isEligible) ? 0 : a.isEligible ? -1 : 1);

        res.json(results);
    });
});

module.exports = router;
