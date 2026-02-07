const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all colleges with filters
router.get('/', (req, res) => {
    const { search, state, stream } = req.query;

    let query = "SELECT * FROM colleges WHERE 1=1";
    const params = [];

    if (search) {
        query += " AND (name LIKE ? OR location LIKE ? OR field LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term);
    }

    if (state) {
        query += " AND location LIKE ?";
        params.push(`%${state}%`);
    }

    if (stream) {
        // Map stream to fields (similar to frontend logic, but can be broader)
        if (stream.toLowerCase() === 'engineering') {
            query += " AND (field = 'Engineering' OR field = 'Computer Applications')";
        } else if (stream.toLowerCase() === 'medical') {
            query += " AND (field = 'Medical' OR field = 'Medicine')";
        } else if (stream.toLowerCase() === 'arts' || stream.toLowerCase() === 'science') {
            query += " AND field = 'Arts & Science'";
        }
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching colleges:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const parsedRows = rows.map(college => ({
            ...college,
            placement_stats: college.placement_stats ? JSON.parse(college.placement_stats) : null,
            reviews: college.reviews ? JSON.parse(college.reviews) : []
        }));

        // Fallback: If no colleges found with filters, return generic list (top 50)
        if (parsedRows.length === 0) {
            db.all("SELECT * FROM colleges LIMIT 50", [], (err2, allRows) => {
                if (err2) return res.status(500).json({ error: "Database error" });
                const parsedAllRows = allRows.map(college => ({
                    ...college,
                    placement_stats: college.placement_stats ? JSON.parse(college.placement_stats) : null,
                    reviews: college.reviews ? JSON.parse(college.reviews) : []
                }));
                return res.json(parsedAllRows);
            });
        } else {
            res.json(parsedRows);
        }
    });
});

module.exports = router;
