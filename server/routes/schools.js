const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/schools
// Filters: search, district, board, type, medium, rating
router.get('/', (req, res) => {
    const { search, district, board, type, medium, rating } = req.query;

    let query = "SELECT * FROM schools WHERE 1=1";
    const params = [];

    if (search) {
        query += " AND (name LIKE ? OR location LIKE ? OR district LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term);
    }

    if (district) {
        const districts = district.split(',').map(d => d.trim()).filter(Boolean);
        if (districts.length > 0) {
            query += " AND (" + districts.map(() => "district LIKE ?").join(" OR ") + ")";
            districts.forEach(d => params.push(`%${d}%`));
        }
    }

    if (board) {
        const boards = board.split(',').map(b => b.trim()).filter(Boolean);
        if (boards.length > 0) {
            query += " AND (" + boards.map(() => "board LIKE ?").join(" OR ") + ")";
            boards.forEach(b => params.push(`%${b}%`));
        }
    }

    if (type) {
        const types = type.split(',').map(t => t.trim()).filter(Boolean);
        if (types.length > 0) {
            query += " AND (" + types.map(() => "type LIKE ?").join(" OR ") + ")";
            types.forEach(t => params.push(`%${t}%`));
        }
    }

    if (medium) {
        query += " AND medium LIKE ?";
        params.push(`%${medium}%`);
    }

    if (rating) {
        query += " AND rating >= ?";
        params.push(rating);
    }

    // Add ORDER BY and LIMIT for performance
    query += " ORDER BY rating DESC, name ASC LIMIT 100";

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching schools:", err);
            return res.status(500).json({ error: "Database error" });
        }

        // Parse JSON fields
        const parsedRows = rows.map(school => ({
            ...school,
            contact_info: JSON.parse(school.contact_info || '{}'),
            streams: JSON.parse(school.streams || '[]'),
            subjects: JSON.parse(school.subjects || '[]'),
            fee_structure: JSON.parse(school.fee_structure || '{}'),
            infrastructure: JSON.parse(school.infrastructure || '[]'),
            facilities_details: JSON.parse(school.facilities_details || '{}'),
            board_results: JSON.parse(school.board_results || '{}'),
            awards: JSON.parse(school.awards || '[]'),
            reviews: JSON.parse(school.reviews || '[]'),
            strengths: JSON.parse(school.strengths || '[]'),
            admission_process: JSON.parse(school.admission_process || '{}')
        }));

        // OUTPUT FORMAT Structure (as requested)
        // Grouping logic can be done here or frontend. 
        // The user asked for an API-style JSON response:
        // { state: "Tamil Nadu", total_schools: X, boards: { ... } }
        // BUT usually for a list API, we return the array. 
        // However, if the user explicitly wants that format for THIS endpoint, I should probably comply 
        // OR provide a wrapper. The prompt said "OUTPUT FORMAT (STRICT): ... Example: { state: ..., boards: ... }"

        // Let's Check if they want this structure for the *List* view or an *Analytics* view?
        // "Act as a data engine... data must be usable in real-time web/mobile applications"
        // Usually apps need a list. The structured format looks like a "Metadata" or "Summary" response.
        // I will return the list but WRAPPED in the requested structure to be safe.

        const response = {
            state: "Tamil Nadu",
            total_schools: parsedRows.length,
            schools: parsedRows, // The actual data list
            // Adding the categorized structure as requested
            boards: {
                state_board: parsedRows.filter(s => s.board && s.board.includes('State')),
                cbse: parsedRows.filter(s => s.board && s.board.includes('CBSE')),
                icse: parsedRows.filter(s => s.board && (s.board.includes('ICSE') || s.board.includes('ISC'))),
                international: parsedRows.filter(s => s.board && (s.board.includes('IB') || s.board.includes('IGCSE')))
            }
        };

        res.json(response);
    });
});

// GET /api/schools/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM schools WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "School not found" });

        const school = {
            ...row,
            contact_info: JSON.parse(row.contact_info || '{}'),
            streams: JSON.parse(row.streams || '[]'),
            subjects: JSON.parse(row.subjects || '[]'),
            fee_structure: JSON.parse(row.fee_structure || '{}'),
            infrastructure: JSON.parse(row.infrastructure || '[]'),
            facilities_details: JSON.parse(row.facilities_details || '{}'),
            board_results: JSON.parse(row.board_results || '{}'),
            awards: JSON.parse(row.awards || '[]'),
            reviews: JSON.parse(row.reviews || '[]'),
            strengths: JSON.parse(row.strengths || '[]'),
            admission_process: JSON.parse(row.admission_process || '{}')
        };
        res.json(school);
    });
});

module.exports = router;
