const express = require('express');
const router = express.Router();
const db = require('../database/db');

// POST /api/recommendations
// Body: { educationLevel, stream, marks, interests: [], location, ... }
router.post('/', (req, res) => {
    const user = req.body;

    // 1. Fetch all careers
    db.all('SELECT * FROM careers', [], (err, careers) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user || typeof user !== 'object') {
            return res.status(400).json({ error: 'Invalid user profile data' });
        }

        // Keyword Mapping for broader matching
        const interestKeywords = {
            'Technology': ['software', 'developer', 'web', 'app', 'data', 'computer', 'tech', 'cyber', 'ai', 'machine learning'],
            'Healthcare': ['medical', 'doctor', 'health', 'clinic', 'patient', 'pharma', 'biology', 'medicine', 'dental'],
            'Business': ['finance', 'account', 'management', 'marketing', 'sales', 'money', 'bank', 'corporate', 'business', 'mba'],
            'Arts': ['design', 'creative', 'media', 'writing', 'visual', 'art', 'journalist', 'music', 'dance'],
            'Science': ['research', 'biology', 'physics', 'chemistry', 'lab', 'scientist', 'biotech', 'space'],
            'Engineering': ['engineer', 'civil', 'mechanical', 'structure', 'machine', 'electrical', 'building'],
            'Teaching': ['teacher', 'education', 'professor', 'school', 'academic', 'student'],
            'Sports': ['sport', 'athlete', 'fitness', 'coach', 'training'],
            'Writing': ['content', 'writer', 'editor', 'journalism', 'blog', 'copy'],
            'Music': ['music', 'audio', 'sound', 'compose']
        };

        // 2. "AI" Scoring Logic
        const scoredCareers = careers.map(career => {
            let score = 0;
            let reasons = [];

            // Parse JSON fields safely
            let reqStreams = [];
            let reqSkills = [];
            let roadmap = [];
            let topCompanies = [];

            try {
                reqStreams = JSON.parse(career.required_stream || '[]');
                reqSkills = JSON.parse(career.required_skills || '[]');
                roadmap = JSON.parse(career.roadmap || '[]');
                topCompanies = JSON.parse(career.top_companies || '[]');
            } catch (e) {
                console.error(`JSON parse error for career ID ${career.id}:`, e.message);
            }

            // A. Stream Match (Weight: 30%)
            const userStream = (user.stream || '').toLowerCase();
            if (reqStreams.includes('any') || reqStreams.includes(userStream)) {
                score += 30;
                reasons.push('Matches your education stream');
            }

            // B. Interest/Skill Match (Weight: 50% - INCREASED per user request)
            const userInterests = Array.isArray(user.interests) ? user.interests : [];
            let matchCount = 0;

            // Prepare expanded keywords based on user interests
            let searchTerms = [];
            userInterests.forEach(interest => {
                searchTerms.push(interest.toLowerCase());
                if (interestKeywords[interest]) {
                    searchTerms.push(...interestKeywords[interest]);
                }
            });

            // Check against title, category, description, and skills
            const careerText = (
                career.title + ' ' +
                career.category + ' ' +
                career.description + ' ' +
                reqSkills.join(' ')
            ).toLowerCase();

            // Count unique term matches
            const uniqueMatches = new Set();
            searchTerms.forEach(term => {
                if (careerText.includes(term.toLowerCase())) {
                    uniqueMatches.add(term);
                }
            });

            matchCount = uniqueMatches.size;

            // Scoring: 10 points per matched concept, max 50
            const interestScore = Math.min(matchCount * 10, 50);
            score += interestScore;

            if (matchCount > 0) {
                reasons.push(`Matches your interest areas (${matchCount} key overlaps)`);
            }

            // C. Education Level Eligibility (Weight: 20%)
            const levels = ['10th', '12th', 'diploma', 'undergraduate', 'postgraduate'];
            const userLevelIdx = levels.indexOf(user.educationLevel);
            const reqLevelIdx = levels.indexOf(career.min_education);

            if (userLevelIdx >= reqLevelIdx) {
                score += 20; // Eligible
            } else {
                // Determine strictness. If completely unqualified (e.g. 10th for Doctor), fail?
                // For now, allow seeing it but with lower score
            }

            return {
                ...career,
                matchPercentage: Math.min(score, 100),
                matchReasons: reasons,
                required_stream: reqStreams,
                required_skills: reqSkills,
                roadmap: roadmap,
                top_companies: topCompanies
            };
        });

        // 3. Filter and Sort
        const recommendations = scoredCareers
            .filter(c => c.matchPercentage > 10) // Show only if at least some relevance
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 50);

        res.json(recommendations);
    });
});

module.exports = router;
