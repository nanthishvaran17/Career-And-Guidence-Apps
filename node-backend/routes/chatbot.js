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

    const systemPrompt_base = `You are TrustPath AI, an expert AI Career Advisor for the "AI Based One Stop Career Advisory System" in India.
    
    ---
    PERSONALIZATION:
    - The conversation is already in progress. DO NOT repeat greetings (e.g., "Hello [Name]!") if you have already said hello earlier in the chat history.
    - Be conversational, concise, and helpful.
    - Respond in Tamil if the user writes in Tamil.
    ---`;

    // ── Multi-model fallback chain ──────────────────────────────────────────
    const modelsToTry = [
        'gemini-2.0-flash',       // Best: fast + smart
        'gemini-flash-latest',    // Alias fallback
        'gemini-pro-latest',      // Last resort
    ];

    try {
        const userContext = await getUserContext();
        const history = await getChatHistory();
        const historyText = history.length ? `Recent Conversation History:\n${history.join('\n')}\n` : '';
        
        const fullPrompt = `${systemPrompt_base}\n\n${userContext}\n\n${historyText}\n\nNew User question: ${message}`;

        let aiReply = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
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

        // ── ENHANCED OFFLINE FALLBACK (Regional Knowledge Added) ─────────────
        const q = message.toLowerCase();
        let fallbackReply = '';
        const match = (keywords) => keywords.some(k => q.includes(k));

        if (match(['nandha', 'nanda', 'erode college', 'nec'])) {
            fallbackReply = `🎓 **Nandha Engineering College (NEC), Erode:**\n• **Location:** Perundurai Main Road, Erode, Tamil Nadu.\n• **Status:** Autonomous institution affiliated with Anna University. NAAC 'A' Grade.\n• **Top Courses:** Computer Science (CSE), AI & Data Science, EEE, Mechanical.\n• **Placements:** Good track record with companies like Zoho, TCS, CTS, and Wipro. Average package: ₹4-6 LPA.\n• **Facilities:** Strong library, innovation labs, and active career guidance cell.\n• **Nearby:** Known as one of the top choices in the Erode/Western TN region alongside KEC and BIT.`;

        } else if (match(['erode', 'perundurai', 'kongu', 'kec', 'bit', 'sathy'])) {
            fallbackReply = `🎓 **Top Institutions in Erode Region:**\n1. **Kongu Engineering College (KEC):** Perundurai (Premier autonomous college)\n2. **Bannari Amman Institute (BIT):** Sathyamangalam (Excellent infra/placements)\n3. **Nandha Engineering College:** (Strong regional presence)\n4. **Velalar College of Engineering:** Erode thindal\n\nAdmissions are mostly via TNEA (Anna University Counseling) based on 12th marks. Focus on 185+ cutoff for CSE/IT in these colleges.`;

        } else if (match(['upsc', 'ias', 'ips', 'ifs', 'civil service'])) {
            fallbackReply = `🏛️ **UPSC Civil Services Guide:**\n• 3 Stages: Prelims → Mains → Interview\n• Key subjects: History, Polity, Geography, Economy, CSAT\n• Resources: NCERTs (6-12), Laxmikanth (Polity), Ramesh Singh (Economy)\n• Best YouTube: Mrunal Patel, Vision IAS, StudyIQ.`;

        } else if (match(['jee', 'iit', 'nit'])) {
            fallbackReply = `🔬 **JEE Main & Advanced:**\n• JEE Main: Entry to NITs/IIITs. 2 attempts/year.\n• JEE Advanced: For IIT admission (Top 2.5L JEE Main qualifiers).\n• Books: NCERT (must), HC Verma, RD Sharma.\n• Target: 98+ percentile for NIT Trichy/Surathkal.`;

        } else if (match(['neet', 'mbbs', 'aiims'])) {
            fallbackReply = `🏥 **NEET UG Medical:**\n• 720 Marks total. Biology (360) + Physics (180) + Chemistry (180).\n• Books: NCERT Biology Class 11/12 (Must).\n• Target: 600+ for govt MBBS in Tamil Nadu. 700+ for AIIMS.`;

        } else if (match(['python', 'programming', 'coding', 'software'])) {
            fallbackReply = `💻 **Software Development Path:**\n• Week 1-4: Python basics + Logic building.\n• Month 2: Data Structures (DSA) on LeetCode.\n• Month 3: Web Dev (React/Node) or ML basics.\n• Salary: Freshers ₹4-10 LPA in top MNCs & Product firms.`;

        } else if (match(['scholarship', 'financial aid'])) {
            fallbackReply = `💰 **Top Scholarships:**\n• NSP (Central Govt): Pre/Post Matric scholarships.\n• AICTE Pragati: For girls in engineering (₹50,000/yr).\n• HDFC Parivartan: Merit-based for low-income families.\n• 7.5% Govt School Reservation (TN): Full fee waiver for eligible students in colleges.`;

        } else if (match(['hello', 'hi', 'namaste', 'vanakkam'])) {
            fallbackReply = `👋 **Vanakkam! I'm TrustPath AI!**\n\nI can help you with:\n• 🏠 Erode & Tamil Nadu Colleges (Nandha, Kongu, VIT, SRM)\n• 🏛️ Govt Exams (UPSC, TNPSC, Banking, SSC)\n• 💻 IT Careers (AI, Python, Cloud, Data Science)\n• 💰 Scholarship advice\n\nWhat would you like to know today?`;

        } else if (match(['thank', 'thanks', 'nandri'])) {
            fallbackReply = `😊 You're welcome! My goal is to make your career path clear and successful. Keep dreaming big! 🌟`;

        } else {
            fallbackReply = `🤖 **Smart Offline Support**:\nI'm currently in light-advice mode. I can tell you about:\n- **Colleges**: Nandha, Kongu, VIT, SRM, IIT/NIT\n- **Exams**: UPSC, JEE, NEET, TNEA, TNPSC\n- **Skills**: Python, AI/ML, Software Dev\n\nPlease ask a specific question about these topics!`;
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
