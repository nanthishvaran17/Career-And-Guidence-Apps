const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all colleges with filters
router.get('/', (req, res) => {
    const { search, state, stream, district, course, maxFees, type } = req.query;

    let query = "SELECT * FROM colleges WHERE 1=1";
    const params = [];

    if (search) {
        let term = search.toLowerCase();
        // Handle common abbreviations
        term = term.replace(/\bengg\b/g, 'engineering');
        term = term.replace(/\btech\b/g, 'technology');
        
        const keywords = term.split(/\s+/).filter(Boolean);
        if (keywords.length > 0) {
            query += " AND (" + keywords.map(() => "(name LIKE ? OR location LIKE ? OR field LIKE ? OR district LIKE ?)").join(" AND ") + ")";
            keywords.forEach(kw => {
                const k = `%${kw}%`;
                params.push(k, k, k, k);
            });
        }
    }

    if (state) {
        query += " AND location LIKE ?";
        params.push(`%${state}%`);
    }

    if (district) {
        const districts = district.split(',').map(d => d.trim()).filter(Boolean);
        if (districts.length > 0) {
            query += " AND (" + districts.map(() => "district LIKE ?").join(" OR ") + ")";
            districts.forEach(d => params.push(`%${d}%`));
        }
    }

    if (stream) {
        // Map stream to fields (Broad Categories)
        if (stream.toLowerCase() === 'engineering') {
            query += " AND (field = 'Engineering' OR field = 'Computer Applications')";
        } else if (stream.toLowerCase() === 'medical') {
            query += " AND (field = 'Medical' OR field = 'Medicine')";
        } else if (stream.toLowerCase() === 'arts' || stream.toLowerCase() === 'science') {
            query += " AND field = 'Arts & Science'";
        } else {
            query += " AND field LIKE ?";
            params.push(`%${stream}%`);
        }
    }

    if (course) {
        // Search inside the departments JSON string
        query += " AND departments LIKE ?";
        params.push(`%${course}%`);
    }

    if (type) {
        const types = type.split(',').map(t => t.trim()).filter(Boolean);
        if (types.length > 0) {
            query += " AND (" + types.map(() => "type LIKE ?").join(" OR ") + ")";
            types.forEach(t => params.push(`%${t}%`));
        }
    }

    // Add ORDER BY: accredited colleges first, then by rating
    query += ` ORDER BY 
      CASE WHEN ranking IS NOT NULL AND ranking != '' THEN 0 ELSE 1 END ASC,
      rating DESC, 
      name ASC 
    LIMIT 100`;

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching colleges:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const safeParseJSON = (str, fallback) => {
            if (!str) return fallback;
            if (typeof str === 'object') return str;
            try { return JSON.parse(str); } catch { return fallback; }
        };

        const parsedRows = rows.map(college => ({
            ...college,
            departments: safeParseJSON(college.departments, []),
            placement_stats: safeParseJSON(college.placement_stats, {}),
            infrastructure: safeParseJSON(college.infrastructure, []),
            reviews: safeParseJSON(college.reviews, []),
            accreditations: safeParseJSON(college.accreditations, []),
            courses_offered: safeParseJSON(college.courses_offered, [])
        }));

        // Always send what we found
        return res.json(parsedRows);
    });
});

// POST: Add a new college (Fix for "Add College API")
router.post('/', (req, res) => {
    const {
        name, location, district, field, type, website, fees, rating
    } = req.body;

    if (!name || !district || !field) {
        return res.status(400).json({ error: "Name, District, and Field are required." });
    }

    const query = `
        INSERT INTO colleges (
            name, location, district, field, type, website, fees, rating, 
            city, affiliated_university, courses_offered, placement_stats, 
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    // Defaults for optional fields
    const params = [
        name,
        location || district,
        district,
        field,
        type || 'Private',
        website || '#',
        fees || 'N/A',
        rating || 0,
        req.body.city || district, // Default city to district if not provided
        req.body.affiliated_university || 'Anna University',
        req.body.courses_offered ? JSON.stringify(req.body.courses_offered) : '[]',
        req.body.placement_stats ? JSON.stringify(req.body.placement_stats) : '{}'
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error("Error adding college:", err);
            return res.status(500).json({ error: "Failed to add college" });
        }
        res.status(201).json({
            id: this.lastID,
            message: "College added successfully",
            college: { id: this.lastID, name, district }
        });
    });
});

module.exports = router;
