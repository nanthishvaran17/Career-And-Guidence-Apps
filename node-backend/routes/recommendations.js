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

        console.log('DEBUG: Received user profile:', user);

        if (careers && careers.length > 0) {
            console.log('DEBUG CAREER[0] ROADMAP:', careers[0].roadmap);
            console.log('DEBUG CAREER[0] COMPANIES:', careers[0].top_companies);
        }

        if (!user || typeof user !== 'object') {

            return res.status(400).json({ error: 'Invalid user profile data' });
        }

        // High-Precision Keyword Mapping for tech and other sectors
        const interestKeywords = {
            'Technology': [
                'software', 'developer', 'web', 'app', 'data', 'computer', 'tech', 'cyber', 'ai', 'machine learning',
                'full-stack', 'backend', 'frontend', 'coding', 'programming', 'devops', 'cloud', 'system architect', 'software engineer'
            ],
            'Healthcare': ['medical', 'doctor', 'health', 'clinic', 'patient', 'pharma', 'biology', 'medicine', 'dental', 'nursing'],
            'Business': ['finance', 'account', 'management', 'marketing', 'sales', 'money', 'bank', 'corporate', 'business', 'mba', 'startup'],
            'Arts': ['design', 'creative', 'media', 'writing', 'visual', 'art', 'journalist', 'music', 'dance', 'ui/ux', 'animation'],
            'Science': ['research', 'biology', 'physics', 'chemistry', 'lab', 'scientist', 'biotech', 'space', 'astronomy'],
            'Engineering': ['engineer', 'civil', 'mechanical', 'structure', 'machine', 'electrical', 'building', 'robotics', 'automation'],
            'Teaching': ['teacher', 'education', 'professor', 'school', 'academic', 'student', 'professor', 'mentor'],
            'Sports': ['sport', 'athlete', 'fitness', 'coach', 'training', 'gym', 'yoga'],
            'Writing': ['content', 'writer', 'editor', 'journalism', 'blog', 'copy', 'storytelling'],
            'Music': ['music', 'audio', 'sound', 'compose', 'instrument', 'production']
        };


        // 2. "AI" Scoring Logic
        const scoredCareers = careers.map(career => {
            let score = 0;
            let reasons = [];

            // Safely parse JSON fields from the database with Case-Insensitive keys
            const safeParse = (obj, key, fallback) => {
                const val = obj[key] || obj[key.charAt(0).toUpperCase() + key.slice(1)] || obj[key.toUpperCase()];
                if (!val) return fallback;
                if (typeof val !== 'string') return Array.isArray(val) ? val : fallback;
                try {
                    const parsed = JSON.parse(val);
                    return Array.isArray(parsed) ? parsed : fallback;
                } catch (e) {
                    return fallback;
                }
            };

            const reqSkills = safeParse(career, 'required_skills', []);
            const roadmap = safeParse(career, 'roadmap', []);
            const topCompanies = safeParse(career, 'top_companies', []);

            // Parse required_stream - can be JSON array OR plain text
            let reqStreams = [];
            const rawStream = career.required_stream;
            if (rawStream) {
                try { reqStreams = JSON.parse(rawStream); } catch(e) { reqStreams = [rawStream]; }
                if (!Array.isArray(reqStreams)) reqStreams = [reqStreams];
            }

            // A. Stream Match (Weight: 30%)
            const userStream = (user.stream || '').toLowerCase();
            const careerCategory = (career.category || '').toLowerCase();
            const streamMatches = reqStreams.map(s => String(s).toLowerCase());

            // Match by stream name or by category (STEM, Healthcare, etc.)
            const streamMap = {
                'science': ['stem', 'healthcare', 'science', 'engineering'],
                'commerce': ['business', 'legal', 'finance'],
                'arts': ['media', 'design', 'teaching', 'legal'],
                'engineering': ['stem', 'defense', 'government'],
                'medical': ['healthcare'],
            };
            const userStreamCategories = streamMap[userStream] || [];

            if (streamMatches.includes('any') || streamMatches.includes(userStream) || userStreamCategories.includes(careerCategory)) {
                score += 30;
                reasons.push('Matches your education stream');
            } else {
                // Partial match - give some score anyway to show all categories
                score += 10;
            }

            // B. Interest/Skill Match (Weight: 50% - INCREASED per user request)
            const userInterests = Array.isArray(user.interests) ? user.interests : [];
            let matchCount = 0;

            // Prepare expanded keywords based on user interests
            let searchTerms = [];
            userInterests.forEach(interest => {
                searchTerms.push(String(interest).toLowerCase());
                if (interestKeywords[interest]) {
                    searchTerms.push(...interestKeywords[interest]);
                }
            });

            // Check against title, category, description, and skills
            const careerText = (
                (career.title || '') + ' ' +
                (career.category || '') + ' ' +
                (career.description || '') + ' ' +
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
            const userLevel = (user.educationLevel || '').toLowerCase();
            const minEdu = (career.min_education || '').toLowerCase();
            
            const userLevelIdx = levels.indexOf(userLevel);
            const reqLevelIdx = levels.indexOf(minEdu);

            if (userLevelIdx >= reqLevelIdx && reqLevelIdx !== -1) {
                score += 20; // Eligible
            }

            return {
                ...career,
                matchPercentage: Math.min(Math.max(score, 15), 100), // Minimum 15% so all careers show
                matchReasons: reasons.length > 0 ? reasons : ['Explore this career path'],
                required_stream: reqStreams,
                required_skills: reqSkills,
                roadmap: roadmap,
                top_companies: topCompanies
            };


        });

        // 3. Sort by match score and return ALL careers
        const recommendations = scoredCareers
            .sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json(recommendations);
    });
});

module.exports = router;
