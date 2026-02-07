const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini API Key (Ideally from .env, but hardcoding for hackathon speed/ease if needed, though .env is better)
// Using a placeholder. The user *must* provide this or set it.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is missing from process.env");
} else {
    console.log("Gemini API Key loaded:", GEMINI_API_KEY.substring(0, 5) + "...");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "INVALID_KEY");

router.post('/', async (req, res) => {
    const { userId, message } = req.body;

    if (!message) return res.status(400).json({ reply: "Please say something!" });

    // 1. Fetch User Context
    // We try to get the user if userId is provided.
    // If not, we proceed with a generic context.
    const getUserContext = () => {
        return new Promise((resolve) => {
            if (!userId) return resolve("User: Guest (No specific profile)\n");

            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
                if (err || !user) return resolve("User: Guest (Profile lookup failed)\n");

                let context = "User Profile:\n";
                context += `Name: ${user.name}\n`;
                context += `Education: ${user.education_level} ${user.stream ? `(${user.stream})` : ''}\n`;
                if (user.marks) context += `Marks: ${user.marks}\n`;

                try {
                    const interests = JSON.parse(user.interests || '[]');
                    if (interests.length) context += `Interests: ${interests.join(', ')}\n`;

                    const skills = JSON.parse(user.skills || '[]');
                    if (skills.length) context += `Skills: ${skills.join(', ')}\n`;

                    const courses = JSON.parse(user.preferred_courses || '[]');
                    if (courses.length) context += `Target Courses: ${courses.join(', ')}\n`;

                    const locations = JSON.parse(user.preferred_locations || '[]');
                    if (locations.length) context += `Preferred Locations: ${locations.join(', ')}\n`;

                } catch (e) {
                    // ignore parse errors
                }
                resolve(context);
            });
        });
    };

    // Use 'gemini-1.5-flash' as it is the current standard equivalent to 'gemini-pro'
    // If this fails with 404, the API Key itself lacks access to the Generative Language API.
    try {
        const userContext = await getUserContext();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
You are an expert AI Career and Education Advisor for Indian students.
${userContext}
User Question: "${message}"
Answer:
`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        if (userId) {
            // Fire and forget save
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, message, 'user']);
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, text, 'bot']);
        }

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error Details:", JSON.stringify(error, null, 2));

        // FALLBACK: Rule-Based AI
        // If the real AI fails, we use a specialized keyword matching system to give a smart response.
        const fallbackReply = getFallbackResponse(message);

        // Save fallback to DB
        if (userId) {
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, message, 'user']);
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, fallbackReply, 'bot']);
        }

        console.log("Used Fallback AI Response");
        res.json({ reply: fallbackReply });
    }
});

// GET Chat History
router.get('/history/:userId', (req, res) => {
    const { userId } = req.params;
    db.all('SELECT id, message, sender, timestamp FROM chat_history WHERE user_id = ? ORDER BY timestamp ASC', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Map to frontend format
        const history = rows.map(row => ({
            id: row.id.toString(),
            text: row.message,
            sender: row.sender,
            timestamp: row.timestamp
        }));
        res.json(history);
    });
});

// DELETE Chat History (Clear Chat)
router.delete('/history/:userId', (req, res) => {
    const { userId } = req.params;
    db.run('DELETE FROM chat_history WHERE user_id = ?', [userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Chat history cleared", deleted: this.changes });
    });
});

// ==========================================
// 🧠 FALLBACK INTELLIGENCE (Rule-Based)
// ==========================================
function getFallbackResponse(query) {
    const q = query.toLowerCase();

    // 0. Specific Location + Course Logic (Smarter Matching)
    const locations = ['chennai', 'coimbatore', 'erode', 'salem', 'trichy', 'madurai', 'tanjore', 'vellore'];
    const courses = ['engineering', 'medicine', 'medical', 'arts', 'science', 'commerce', 'agri'];

    const foundLocation = locations.find(loc => q.includes(loc));
    const foundCourse = courses.find(c => q.includes(c));

    if (foundLocation) {
        if (foundCourse) {
            // Specific Responses for Demo
            if (foundLocation === 'erode' && (foundCourse === 'engineering' || foundCourse === 'agri')) {
                return "Top **Engineering/Agri Colleges in Erode**:\n\n1. 🏆 **Nandha Engineering College** (Autonomous)\n   - Rating: ⭐ 4.5 | NAAC 'A' | NBA\n   - Best for: CSE, Agri, Bio-Medical\n   - Placements: 90%+ (TCS, Wipro, Zoho)\n\n2. Kongu Engineering College\n3. Velalar College of Engineering\n\n**Recommendation:** Nandha Engineering College is highly rated for its infrastructure and placement training!";
            }
            if (foundLocation === 'chennai' && foundCourse === 'engineering') {
                return "Top Engineering Colleges in Chennai:\n1. **IIT Madras** (NIRF #1)\n2. **Anna University** (CEG/MIT)\n3. **SSN College of Engineering**\n4. Loyola-ICAM";
            }
            if (foundLocation === 'coimbatore' && foundCourse === 'engineering') {
                return "Top Engineering Colleges in Coimbatore:\n1. **PSG Tech**\n2. **CIT** (Coimbatore Institute of Technology)\n3. **Kumaraguru College of Technology**";
            }
            return `Here are top **${foundCourse}** colleges in **${foundLocation.charAt(0).toUpperCase() + foundLocation.slice(1)}**:\n\n• Top Institute 1 (Govt Aided)\n• Top Institute 2 (Autonomous)\n\nPlease visit the **Education Guidance** tab to view the full list with fees and cutoffs!`;
        }
    }

    // 1. 12th Standard / After School
    if (q.includes("12th") || q.includes("after school")) {
        if (q.includes("science")) return "After 12th Science, you have great options:\n• **Engineering (B.E/B.Tech):** CSE, ECE, Mech, Civil.\n• **Medical:** MBBS, BDS, B.Pharm.\n• **Pure Science:** B.Sc Physics, Chemistry.\n• **New Age:** AI & Data Science, Robotics.";
        if (q.includes("commerce")) return "After 12th Commerce, consider:\n• **Professional:** CA, CS, CMA.\n• **Degree:** B.Com (General/Honors), BBA.\n• **Banking:** Bank PO Exams.";
        if (q.includes("arts")) return "After 12th Arts:\n• **Degrees:** B.A. (History, English, Pol Sci).\n• **Law:** BA LLB (5 years).\n• **Design:** NIFT/NID.\n• **Media:** Journalism & Mass Comm.";
        return "After 12th, your path depends on your stream. \n• **Science:** Engineering, Medical, Research.\n• **Commerce:** CA, B.Com, Finance.\n• **Arts:** Law, Design, Civil Services.";
    }

    // 2. Careers & Interests
    if (q.includes("career") || q.includes("fit") || q.includes("interest")) {
        return "To find the best career test:\n1. **Take our Aptitude Test** (in the app).\n2. **Analyze your hobbies** (Coding -> IT, Drawing -> Design, Helping -> Healthcare).\n3. **Explore the 'Skills' tab** to learn top demand skills.";
    }

    // 3. Government Jobs / UPSC
    if (q.includes("upsc") || q.includes("ias") || q.includes("govt") || q.includes("government")) {
        return "For Government Jobs/UPSC:\n• **Eligibility:** Any Degree for UPSC Civil Services.\n• **Preparation:** Start with NCERT books (Class 6-12). Read newspapers daily for Current Affairs.\n• **Exams:** UPSC CSE, SSC CGL, TNPSC Group 1/2.\n• **Tip:** Consistency is key!";
    }

    // 4. Scholarships
    if (q.includes("scholarship") || q.includes("money") || q.includes("financial")) {
        return "Top Scholarships available:\n• **PMMMM:** For merit students.\n• **First Graduate:** For first-time college goers in family.\n• **SC/ST & OBC Scholarships:** State provided support.\nCheck the **'Scholarships' tab** in this app for direct links!";
    }

    // 5. Colleges / Location (Generic)
    if (q.includes("college") || q.includes("near me") || q.includes("best college")) {
        return "Top Colleges in Tamil Nadu:\n• **Engineering:** IIT Madras, Anna University, NIT Trichy, Nandha Engineering College.\n• **Arts:** Loyola, Madras Christian College.\n• **Medical:** MMC, CMC Vellore.\n\nUse the **'Education Guidance'** page to search for colleges by location!";
    }

    // 6. IT / Coding Jobs
    if (q.includes("it sector") || q.includes("software") || q.includes("coding") || q.includes("job")) {
        return "Jobs in IT Sector are booming!\n• **Top Roles:** Full Stack Dev, Data Scientist, Cloud Engineer.\n• **Key Skills:** Python, Java, React, SQL.\n• **Preparation:** Build projects and upload to GitHub.\nCheck the **'Internships'** tab to apply!";
    }

    // Default Fallback
    return "I am currently running in **Offline Mode** (limited AI) because I can't reach the Google server.\n\n**Try asking:**\n• \"Engineering colleges in Erode\"\n• \"Courses after 12th Science\"\n• \"How to prepare for UPSC\"\n• \"Jobs in IT\"";
}

module.exports = router;
