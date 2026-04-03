const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const db = require('../database/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { reply: "Too many messages sent. Please try again in 15 minutes." }
});

router.post('/', chatLimiter, async (req, res) => {
    const { userId, message } = req.body;

    if (!message) return res.status(400).json({ reply: "Please say something!" });

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
                } catch (e) { /* ignore */ }
                resolve(context);
            });
        });
    };

    const getChatHistory = () => {
        return new Promise((resolve) => {
            if (!userId) return resolve([]);
            db.all('SELECT message, sender FROM chat_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10', [userId], (err, rows) => {
                if (err) return resolve([]);
                const history = rows.reverse().map(row => `${row.sender === 'user' ? 'User' : 'Assistant'}: ${row.message}`);
                resolve(history);
            });
        });
    };

    const systemPrompt_base = `You are TrustPath AI, a world-class AI Career Advisor for the "AI Based One Stop Career Advisory System" in India.
    
    ---
    CRITICAL CONVERSATION RULES:
    1. CONTEXT AWARENESS: If there is "Recent Conversation History" provided below, DO NOT greet the user (e.g., No "Hello", "Hi", "Welcome back"). Jump STRAIGHT to the answer.
    2. LANGUAGE: Respond in the same language the user uses (English or Tamil).
    3. India Focus: Mention Indian colleges (IIT, NIT, Anna Univ, etc.), Indian exams (JEE, NEET, TNEA), and salaries in LPA.
    ---

    YOUR CORE CAPABILITIES (Always include these in roadmaps):
    STEP 1 — CAPABILITY ANALYSIS: Evaluate user strengths based on profile/marks.
    STEP 2 — CAREER MATCHING: Recommend 3–5 careers with Description, Skills, Top Hiring Companies, and Salary (LPA).
    STEP 3 — RISK ANALYSIS: Evaluation of Automation risk, Competition, and Market demand (🟢 Low / 🟡 Medium / 🔴 High).
    STEP 4 — DETAILED ROADMAP: Year-by-year plan, specific certifications (NPTEL, Coursera), and internship platforms.
    STEP 5 — SUCCESS PROBABILITY: Estimate % chance based on profile alignment.

    Always use clear headings with emojis (🎯 📊 🗺️ ⚠️ 🏆) and bullet points.`;

    // ── Multi-model fallback chain ──────────────────────────────────────────
    const modelsToTry = [
        'gemini-2.0-flash',       // Best: fast + smart
        'gemini-flash-latest',    // Alias fallback
    ];

    try {
        const userContext = await getUserContext();
        const history = await getChatHistory();
        const historyText = history.length ? `\n--- RECENT CONVERSATION HISTORY (DO NOT REPEAT GREETINGS) ---\n${history.join('\n')}\n` : '';
        
        const fullPrompt = `${systemPrompt_base}\n\n${userContext}${historyText}\n\nCURRENT USER QUESTION: ${message}\n\n(Remember: If history exists above, start your response DIRECTLY with the answer, no greetings.)`;

        let aiReply = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
                });
                const result = await model.generateContent(fullPrompt);
                aiReply = result.response.text();
                console.log(`✅ Gemini context-aware response using: ${modelName}`);
                break;
            } catch (err) {
                lastError = err;
                console.warn(`⚠️  ${modelName} failed`);
            }
        }

        if (!aiReply) throw lastError;

        if (userId) {
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, message, 'user']);
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, aiReply, 'bot']);
        }
        return res.json({ reply: aiReply });

    } catch (error) {
        console.error("All Gemini models failed:", error?.message?.slice(0, 80));

        // ── ENHANCED OFFLINE FALLBACK (Added Cyber Security & More) ──────────
        const q = message.toLowerCase();
        let fallbackReply = '';
        const match = (keywords) => keywords.some(k => q.includes(k));

        if (match(['cyber', 'security', 'ethical hacking', 'hacking', 'network security'])) {
            fallbackReply = `🛡️ **Cyber Security Roadmap (2024-25):**\n• **Step 1: Fundamentals** — Learn Networking (TCP/IP), Linux Basics, and Python.\n• **Step 2: Security Basics** — CompTIA Security+ (Foundation certification).\n• **Step 3: Hands-on Lab** — Practice on TryHackMe or HackTheBox.\n• **Step 4: Advanced Certs** — Aim for CEH (Ethical Hacking) or OSCP (Gold standard).\n• **Top Hiring firms:** Deloitte, KPMG, Cisco, Infosys, FireEye.\n• **Salary in India:** Freshers ₹4-8 LPA | Experts ₹15-40 LPA.\n• **Risk:** 🟢 Low (Extreme high demand for security pros).`;

        } else if (match(['nandha', 'nanda', 'nec', 'erode college'])) {
            fallbackReply = `🎓 **Nandha Engineering College (NEC), Erode:**\n• **Status:** Autonomous, NAAC 'A' Grade, Perundurai.\n• **Top Courses:** CSE, AI & Data Science, EEE.\n• **Placements:** Strong regional presence. Companies: Zoho, TCS, CTS, Wipro.\n• **Salary:** ₹4-6 LPA avg. \n• **Admission:** Via TNEA Counseling (Anna University).`;

        } else if (match(['upsc', 'ias', 'ips'])) {
            fallbackReply = `🏛️ **UPSC Civil Services:**\n• Stages: Prelims (GS + CSAT) → Mains (9 Papers) → Interview.\n• Prep: Start with NCERTs Class 6-12.\n• Salary: Lieutenant/DM Level ₹56,100 base + Perks + High Authority.`;

        } else if (match(['jee', 'iit', 'nit'])) {
            fallbackReply = `🔬 **JEE Main/Advanced:**\n• NIT Entry: JEE Main 98+ percentile.\n• IIT Entry: JEE Advanced top rank.\n• Recommended: NCERT + HC Verma + RD Sharma.`;

        } else if (match(['python', 'programming', 'software', 'developer'])) {
            fallbackReply = `💻 **Software Developer Road:**\n• Learn DSA (Data Structures) → Pick a stack (MERN: React/Node) → Build Projects → LeetCode.\n• Salary: ₹5-12 LPA (MNCs) | ₹15-50 LPA (Product/Startups).`;

        } else if (match(['hello', 'hi', 'vanakkam'])) {
            fallbackReply = `👋 **Vanakkam! I'm TrustPath AI.**\n\nI can help with:\n• 🛡️ Cyber Security Roadmaps\n• 🏠 Erode/TN Colleges (Nandha, Kongu, VIT)\n• 🏛️ Govt Exams (UPSC, SSC)\n• 💰 Scholarships\n\nHow can I help you today?`;

        } else {
            fallbackReply = `🤖 **TrustPath AI (Offline Mode)**:\nI can provide roadmaps for **Cyber Security**, **Python**, **Medecine (NEET)**, or details on **Nandha Engineering College**. Please ask a specific question!`;
        }

        if (userId) {
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, message, 'user']);
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, fallbackReply, 'bot']);
        }
        res.json({ reply: fallbackReply });
    }
});

// GET Chat History
router.get('/history/:userId', (req, res) => {
    const { userId } = req.params;
    db.all('SELECT id, message, sender, timestamp FROM chat_history WHERE user_id = ? ORDER BY timestamp ASC', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const history = rows.map(row => ({
            id: row.id.toString(),
            text: row.message,
            sender: row.sender,
            timestamp: row.timestamp
        }));
        res.json(history);
    });
});

// DELETE Chat History
router.delete('/history/:userId', (req, res) => {
    const { userId } = req.params;
    db.run('DELETE FROM chat_history WHERE user_id = ?', [userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Chat history cleared", deleted: this.changes });
    });
});

module.exports = router;
