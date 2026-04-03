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

    const systemPrompt_base = `You are TrustPath AI, an expert AI Career Advisor for "AI Based One Stop Career Advisory System" — designed for students and job seekers in India.

Your task is to analyze the user's profile, assessment results, and verified certificates to recommend the most suitable careers.

---

WHEN USER DOESN'T KNOW WHAT DEGREE / CAREER TO CHOOSE:
Ask them 3-4 quick diagnostic questions:
1. What subjects do they enjoy (Science / Commerce / Arts / Computers)?
2. Do they prefer working with people, technology, creativity, or numbers?
3. What's their budget for education?
4. Do they prefer government job stability or private sector growth?
Then give a personalized recommendation.

---

STEP 1 — EDUCATION & CERTIFICATE ANALYSIS
Summarize the user's verified qualifications:
• Education level & Degree specialization
• Completed courses or certifications
• Internship experience
• Skill certifications

STEP 2 — USER CAPABILITY ANALYSIS
Evaluate strengths using:
• Academic performance
• Assessment scores (logical, technical, communication, creativity, problem-solving)
• Verified skills and project or internship experience

STEP 3 — CAREER MATCHING
Recommend 3–5 suitable careers that best match the profile. For each include:
• Career Name & Description
• Why this career suits them
• Required Skills
• Top Hiring Companies in India (TCS, Infosys, Google India, ISRO, Wipro, Zomato, etc.)
• Expected Salary Range in India (entry to senior, in LPA or ₹/month)
• Future Growth Rate

STEP 4 — RISK ANALYSIS
Evaluate each career for: Automation risk, Competition, Industry demand, Long-term stability.
Risk Level: 🟢 Low / 🟡 Medium / 🔴 High (with explanation)

STEP 5 — SUCCESS PROBABILITY
Estimate success % based on: Skill alignment, Interest level, Education match, Market demand.

STEP 6 — CAREER ROADMAP (India-focused)
• Skills to learn now
• Recommended certifications (mention free options: SWAYAM, NPTEL, Coursera audit)
• Internship platforms (Internshala, LinkedIn, Naukri)
• Year-by-year preparation plan

STEP 7 — SECURITY NOTE
All certificates and profile data are securely verified by the system. Base recommendations on the verified data provided.

---

OUTPUT FORMAT RULES:
- Use clear headings with emojis (🎯 📊 🗺️ ⚠️ 🏆)
- Use bullet points for easy reading
- Simple language for Class 12 students
- Respond in Tamil if user writes in Tamil
- Always end with an encouraging motivational line
- Give India-specific advice: mention Indian colleges (IITs, NITs, SRM, VIT, Anna University), Indian exams (JEE, NEET, GATE, CAT, UPSC), Indian salary ranges

IMPORTANT: If user gives partial info — give your best recommendation AND ask follow-up questions to refine it.`;

    // ── Multi-model fallback chain (verified working models) ─────────────────
    const modelsToTry = [
        'gemini-2.5-flash',       // Best: fast + smart, confirmed working
        'gemini-2.0-flash',       // Great fallback
        'gemini-2.0-flash-lite',  // Lightweight fallback
        'gemini-flash-latest',    // Alias fallback
        'gemini-pro-latest',      // Last resort
    ];

    try {
        const userContext = await getUserContext();
        const fullPrompt = `${systemPrompt_base}\n\n${userContext}\n\nUser question: ${message}`;

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
                console.log(`✅ Gemini responded using: ${modelName}`);
                break;
            } catch (err) {
                lastError = err;
                const isRateLimit = err.message?.includes('429') || err.status === 429;
                const isOverload  = err.message?.includes('503') || err.message?.includes('overloaded');
                const isNotFound  = err.status === 404 || err.message?.includes('404');
                console.warn(`⚠️  ${modelName} failed (${err.status || 'unknown'}): ${err.message?.slice(0, 80)}`);
                if (!isRateLimit && !isOverload && !isNotFound) break; // hard error — stop immediately
                await new Promise(r => setTimeout(r, 300));
            }
        }

        if (!aiReply) throw lastError;

        if (userId) {
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, message, 'user']);
            db.run('INSERT INTO chat_history (user_id, message, sender) VALUES (?, ?, ?)', [userId, aiReply, 'bot']);
        }
        return res.json({ reply: aiReply });

    } catch (error) {
        console.error("All Gemini models failed:", error?.message?.slice(0, 120));

        // ── COMPREHENSIVE SMART OFFLINE FALLBACK (30+ Topic Coverage) ────────
        const q = message.toLowerCase();
        let fallbackReply = '';

        const match = (keywords) => keywords.some(k => q.includes(k));

        if (match(['upsc', 'ias', 'ips', 'ifs', 'civil service', 'civil servant'])) {
            fallbackReply = `🏛️ **UPSC Civil Services Guide:**\n• 3 Stages: Prelims → Mains (9 papers) → Personality Interview\n• Foundation: NCERTs Class 6-12 across all subjects first\n• Key Books: M. Laxmikanth (Polity), Bipin Chandra (History), Ramesh Singh (Economy)\n• Daily: The Hindu / Indian Express + PIB\n• Best YouTube: Mrunal Patel, StudyIQ IAS, Drishti IAS, Vision IAS\n• Average attempts: 2-3. Eligibility: Any graduation, age 21-32 (General)`;

        } else if (match(['ssc', 'cgl', 'chsl', 'mts', 'staff selection'])) {
            fallbackReply = `📋 **SSC CGL/CHSL Preparation:**\n• Tiers: Tier 1 (CBT) → Tier 2 (CBT) → Tier 3 (Descriptive)\n• Maths: RS Aggarwal Quantitative Aptitude, Kiran SSC\n• English: SP Bakshi, Neetu Singh\n• GK: Lucent GK, Pratiyogita Darpan monthly\n• Mock Tests: Testbook, Adda247, Gradeup — minimum 4/week\n• Salary: ₹30,000–₹80,000/month (Group B/C posts)`;

        } else if (match(['jee', 'jee main', 'jee advanced', 'iit'])) {
            fallbackReply = `🔬 **JEE Main & Advanced Guide:**\n• JEE Main: 90 Qs, 300 marks, 3 hrs — 2 sessions (Jan + Apr)\n• JEE Advanced: For top ~2.5 lakh JEE Main qualifiers → IIT admission\n• Books: NCERT (must), HC Verma Physics, RD Sharma Maths, MS Chouhan Chemistry\n• Top IITs: IIT Bombay, IIT Madras, IIT Delhi, IIT Kharagpur\n• NITs via JEE Main: NIT Trichy, NIT Warangal, NIT Surathkal are top\n• Target: 98+ percentile for top NIT CSE; 99.5+ for IIT CSE`;

        } else if (match(['neet', 'mbbs', 'medical', 'doctor', 'aiims'])) {
            fallbackReply = `🏥 **NEET UG Medical Guide:**\n• 180 questions, 720 marks, 3h 20m — Biology (360) + Physics (180) + Chemistry (180)\n• Books: NCERT Biology (Class 11-12) is the Bible, Truemans Biology, DC Pandey Physics\n• Target: 650+ for AIIMS Delhi, 600+ for good govt MBBS colleges\n• Top Colleges: AIIMS Delhi, CMC Vellore, JIPMER Puducherry, KGMC Lucknow\n• Coaching: Allen, Aakash, FIITJEE, Physics Wallah (online, affordable)\n• After MBBS: NEET PG for MD/MS specialization`;

        } else if (match(['gate', 'gate exam', 'iit postgrad', 'psu', 'bhel', 'ntpc'])) {
            fallbackReply = `⚙️ **GATE Exam Guide:**\n• 65 Qs, 100 marks, 3 hrs — MCQ + MSQ + NAT (Numerical Answer Type)\n• Covers: Engineering Math + Subject-specific paper (CS/ECE/ME/CE/EE)\n• Resources: Ace Academy, Made Easy study material + previous 10 years papers\n• Score 700+ → Top IITs/NITs for M.Tech + TOP PSU jobs (BHEL, NTPC, IOCL, ONGC)\n• PSU Salary: ₹60,000–₹1.5 lakh/month + govt perks\n• Validity: 3 years for PSU applications`;

        } else if (match(['cat', 'mba', 'iim', 'management'])) {
            fallbackReply = `💼 **CAT & MBA Guide:**\n• CAT: 3 sections — VARC, DILR, QA — 2 hrs, 66 questions\n• 99+ percentile → IIM A, B, C (salary: ₹25-35 LPA starting)\n• 97+ percentile → IIM Ind, Koz, Luck, Shillong, ISB Hyderabad\n• Preparation: 3-6 months, TIME/IMS/Career Launcher mock series\n• Alternative: SNAP (Symbiosis), XAT (XLRI), NMAT (NMIMS), IIFT\n• Non-CAT MBA: ISB via GMAT 720+ — fees ₹35 lakh, avg salary ₹32 LPA`;

        } else if (match(['clat', 'law', 'lawyer', 'advocate', 'nlu', 'nlsiu'])) {
            fallbackReply = `⚖️ **CLAT & Law Career:**\n• CLAT: 5 sections — English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative\n• Top NLUs: NLSIU Bangalore, NALSAR Hyderabad, NLU Delhi, NUJS Kolkata\n• Preparation: CLAT Possible, Legal Edge, Career Launcher Law — 6 months\n• Career paths: Corporate law (₹12-25 LPA starting), Litigation, Judiciary, Legal Tech\n• Judiciary: Clear State PCS-J to become a magistrate/judge\n• LLM abroad (Harvard/Oxford) for international law careers`;

        } else if (match(['srm', 'srmist', 'srmjeee'])) {
            fallbackReply = `🎓 **SRM Institute of Science & Technology:**\n• Location: Kattankulathur, Chennai (Main Campus) + Delhi-NCR, Amaravati, Andhra\n• Admission: SRMJEEE (own exam) or JEE Main scores\n• NAAC A++ accredited, QS World University Rankings presence\n• Average Package: ₹8.5 LPA | Highest: ₹53 LPA\n• Top Recruiters: TCS, Infosys, Wipro, Amazon, Microsoft, Zoho\n• Fees: ₹3-4.5 lakh/year for B.Tech. Scholarships available on merit\n• Website: srmist.edu.in`;

        } else if (match(['vit', 'vellore institute', 'viteee'])) {
            fallbackReply = `🎓 **VIT University Guide:**\n• Campuses: Vellore (main), Chennai, Amaravati, Bhopal\n• Admission: VITEEE — No JEE required | 40,000+ seats\n• NAAC A++ | QS Asia Top 200\n• Average Package: ₹7 LPA | Highest: ₹44 LPA\n• Known for: Strong placement cell, industry tie-ups, diverse campus\n• Fees: ₹2.2-3.5 lakh/year | Scholarships for scores 90%+\n• Website: vit.ac.in`;

        } else if (match(['anna university', 'tnea', 'tamil nadu engineering', 'tamilnadu college'])) {
            fallbackReply = `🎓 **Anna University & TNEA:**\n• Anna University affiliates 500+ engineering colleges in Tamil Nadu\n• Admission: TNEA (Tamil Nadu Engineering Admission) — based on 12th marks only (no entrance exam!)\n• Cutoff: Class 12th PCM aggregate. Top colleges: MIT Chennai, CEG Chennai, ACE Guindy\n• Average Package: ₹4-6 LPA at top affiliated colleges\n• Government Colleges (CEG, MIT) are highly affordable: ₹40,000-60,000/year\n• Apply at: tneaonline.org during June-July`;

        } else if (match(['python', 'programming', 'coding', 'developer', 'software'])) {
            fallbackReply = `💻 **Python & Software Development Path:**\n• Start: Python basics → OOP → Data Structures → Libraries\n• Resources: CS50 (Harvard, free), YouTube: Programming with Mosh, Corey Schafer\n• DSA: Striver's DSA Sheet, NeetCode, LeetCode (150 problems minimum)\n• Web Dev: React + Node.js (MERN stack) — most in-demand\n• AI/ML path: NumPy → Pandas → Scikit-learn → TensorFlow → PyTorch\n• Salary: Junior ₹4-8 LPA | Mid ₹10-20 LPA | Senior ₹25-50 LPA`;

        } else if (match(['machine learning', 'ai', 'artificial intelligence', 'deep learning', 'data science', 'llm', 'chatgpt'])) {
            fallbackReply = `🤖 **AI / Machine Learning Career Path:**\n• Foundation: Python + Math (Linear Algebra, Statistics, Calculus)\n• Learn: Scikit-learn → TensorFlow/PyTorch → Hugging Face Transformers\n• Certifications: Google ML Certificate, DeepLearning.ai (Andrew Ng), Fast.ai\n• LLMs: Learn Prompt Engineering → RAG → Fine-tuning → LLMOps\n• Practice: Kaggle competitions, Hugging Face projects, Papers With Code\n• Salary: ML Engineer ₹12-50 LPA | AI Researcher ₹18-80 LPA\n• Top employers: Google, Microsoft, Amazon, Flipkart AI, startups`;

        } else if (match(['cloud', 'aws', 'azure', 'gcp', 'devops', 'kubernetes', 'docker'])) {
            fallbackReply = `☁️ **Cloud & DevOps Career:**\n• Start: Linux fundamentals → Git → Docker → Kubernetes → CI/CD\n• Certifications path: AWS Cloud Practitioner → Solutions Architect Associate → Professional\n• Azure: AZ-900 → AZ-104 → AZ-305 | GCP: Associate Cloud Engineer → Professional\n• DevOps tools: Jenkins, GitHub Actions, Terraform, Ansible, Prometheus, Grafana\n• YouTube: TechWorld with Nana, Abhishek Veeramalla, NetworkChuck\n• Salary: Cloud Engineer ₹8-30 LPA | DevOps Lead ₹20-50 LPA`;

        } else if (match(['cybersecurity', 'ethical hacking', 'penetration testing', 'security'])) {
            fallbackReply = `🔐 **Cybersecurity Career Path:**\n• Foundation: Networking (TCP/IP, DNS) → Linux → Python scripting\n• Practice: TryHackMe.com (beginner-friendly), HackTheBox (advanced)\n• Certifications: CompTIA Security+ → CEH → OSCP (most respected)\n• Bug Bounty: HackerOne, Bugcrowd — earn ₹10,000-10,00,000 per valid bug!\n• Specializations: Pentesting, SOC Analyst, Cloud Security, AppSec\n• YouTube: NetworkChuck, David Bombal, John Hammond\n• Salary: ₹8-40 LPA | Bug Bounty hunters earn $5,000-$100,000+ per vulnerability`;

        } else if (match(['design', 'ui', 'ux', 'figma', 'graphic design', 'product design'])) {
            fallbackReply = `🎨 **UI/UX & Design Career:**\n• Start: Learn Figma (free) → Design principles → User research → Prototyping\n• Course: Google UX Design Certificate (Coursera, ₹9,000) — industry recognized\n• Portfolio: Create 5+ case studies on Behance/Dribbble — this IS your resume\n• Top Design Schools: NID Ahmedabad, IDC IIT Bombay, NIFT, MIT Institute of Design\n• Specialize: SaaS product design, fintech UX, mobile app design, motion design\n• Salary: Junior ₹4-8 LPA | Senior ₹12-25 LPA | Freelance: $30-100/hr internationally`;

        } else if (match(['data analyst', 'data analytics', 'power bi', 'tableau', 'excel', 'sql'])) {
            fallbackReply = `📊 **Data Analytics Career:**\n• Core skills: Excel (advanced) → SQL → Python (Pandas) → Power BI/Tableau\n• Certifications: Google Data Analytics (Coursera), Microsoft PL-300 (Power BI), IBM Data Analyst\n• Practice: Kaggle datasets, Maven Analytics challenges, StrataScratch SQL\n• Tools timeline: Week 1-4: SQL → Month 2: Python + Pandas → Month 3: Power BI or Tableau\n• Entry role: Data Analyst (₹4-8 LPA) → Senior Analyst (₹10-18 LPA) → Data Lead (₹20-35 LPA)\n• Top hiring companies: TCS, Accenture Analytics, Flipkart, Meesho, Google India`;

        } else if (match(['nda', 'cds', 'army', 'navy', 'air force', 'defense', 'defence', 'military', 'ssb'])) {
            fallbackReply = `🎖️ **Indian Defense Career:**\n• Entry paths:\n  - After 12th: NDA exam (age 16.5-19.5) → 3 years at NDA Khadakwasla\n  - After graduation: CDS exam | AFCAT (Air Force) | Navy UES/SSC\n• SSB Interview (5 days): OIR Test → PPDT → Psychology Tests → GTO Tasks → Personal Interview\n• Physical: Run 5km < 25 min, 20+ pull-ups, 80+ push-ups (start 12-18 months before)\n• Books: Pathfinder NDA/CDS by Arihant, RS Aggarwal Maths\n• Salary: Lieutenant ₹56,100/month + allowances + pension. Army officers retire with dignity.`;

        } else if (match(['scholarship', 'financial aid', 'stipend', 'free education'])) {
            fallbackReply = `🎓 **Top Scholarships for Indian Students:**\n• NSP Portal (scholarships.gov.in): SC/ST/OBC/Minority — ₹12,000-25,000/yr\n• AICTE Pragati (Girls in Tech): ₹50,000/yr\n• PM Scholarship: Ex-servicemen wards — ₹2,500-3,000/month\n• HDFC Parivartan: ₹75,000/yr for income < 2.5 LPA\n• Tata Capital Pankh: Class 11-UG, 60%+ marks — ₹10,000-20,000/yr\n• KVPY: Science stream — ₹5,000-7,000/month from Class 11\n• Chevening UK: Full funding for Masters in UK\n• Fulbright-Nehru: Full funding for USA postgrad\n• Apply early! Most deadlines: August-November`;

        } else if (match(['internship', 'intern'])) {
            fallbackReply = `💼 **Finding Internships in India:**\n• Best platforms: Internshala, LinkedIn, Unstop, AngelList, Wellfound\n• When to apply: Start applying 3-4 months before internship season\n• Stipend range: ₹5,000-80,000/month depending on company and role\n• Top intern companies: Google ($6,000-8,000/month), Amazon, Microsoft, Zomato, Razorpay, Zoho\n• How to get: Cold email HR + optimize LinkedIn profile + get professor/alumni referrals\n• Skills that get internships fastest: Python, React, SQL, Data Analysis, Figma`;

        } else if (match(['resume', 'cv', 'interview', 'job apply', 'placement'])) {
            fallbackReply = `📄 **Resume & Interview Tips:**\n• Resume: 1 page (freshers), ATS-friendly format, quantify achievements ("Increased performance by 30%")\n• Tools: Overleaf (LaTeX resume), Resume.io, Canva (non-ATS roles)\n• LinkedIn: Complete profile (photo, headline, skills, projects) — recruiters message YOU\n• Interview prep: STAR method (Situation-Task-Action-Result) for behavioral Qs\n• Technical: LeetCode Easy-Medium (100+ problems), System Design Primer (GitHub)\n• Mock interviews: Pramp, Interviewing.io, Exponent (PM roles)\n• Dress: Business casuals for startups, formal for MNCs`;

        } else if (match(['ms abroad', 'masters abroad', 'usa ms', 'germany', 'canada', 'study abroad', 'gre', 'gmat'])) {
            fallbackReply = `✈️ **Masters Abroad Guide:**\n• USA: GRE 320+ | IELTS 7+ | TOEFL 100+. Top: MIT, Stanford, CMU, UIUC, Georgia Tech\n• Germany: Many programs FREE! Apply via uni-assist.de | IELTS/TestDaF needed\n• Canada: University of Toronto, UBC, Waterloo. Post-study work visa available\n• Australia: Monash, Melbourne, UNSW. 2+3 year work visa post-study\n• UK: 1-year MS. Russell Group: Imperial, UCL, Edinburgh. 2-year work visa post-study\n• Timeline: Start GRE/IELTS prep 12-18 months before intake target\n• Budget: USA ₹60-90 lakh/year | Germany ₹8-15 lakh/year | Canada ₹50-75 lakh/year`;

        } else if (match(['banking', 'ibps', 'sbi po', 'bank po', 'rbi', 'nabard'])) {
            fallbackReply = `🏦 **Banking Career Guide:**\n• Exams: IBPS PO/Clerk, SBI PO/Clerk, RBI Grade B, NABARD Grade A\n• Sections: Reasoning, Quant, English, Current Affairs/Banking Awareness\n• Books: RS Aggarwal (Maths), SP Bakshi (English), Lucent GK, Arihant Banking\n• Mock tests: Adda247, Testbook — minimum 3 full mocks/week\n• SBI PO salary: ₹52,000-63,000/month + perks worth ₹20,000+\n• RBI Grade B: One of the most prestigious banking roles — ₹75,000+/month`;

        } else if (match(['railway', 'rrb', 'loco pilot', 'ntpc', 'group d', 'station master'])) {
            fallbackReply = `🚂 **Railway Career Guide:**\n• Key exams: RRB NTPC (Graduate level), RRB Group D (10th level), RRB ALP (Loco Pilot)\n• Pattern: CBT Stage 1 → CBT Stage 2 → CBAT/Skill Test → Document Verification\n• Subjects: Maths, General Intelligence, General Awareness\n• Books: Arihant RRB Complete Guide, Lucent GK, RD Sharma, previous year papers\n• Salary: ₹21,000-90,000/month depending on post + job security + pension\n• Apply at: indianrailways.gov.in when notifications open`;

        } else if (match(['teaching', 'teacher', 'net', 'ctet', 'tet', 'professor'])) {
            fallbackReply = `📚 **Teaching Career Guide:**\n• School Teaching: B.Ed + CTET/State TET required\n• College Teaching: NET/SET (UGC NET) + Master's degree in subject\n• PhD + NET: Assistant Professor at government universities ₹57,700/month Level 10\n• KENDRIYA VIDYALAYA: One of the most respected school systems in India\n• EdTech: BYJU'S, Unacademy, Physics Wallah pay ₹15-80 LPA for top educators\n• CTET: Paper I (Class 1-5) | Paper II (Class 6-8). Both open career doors widely`;

        } else if (match(['tnpsc', 'tamil', 'tamilnadu government', 'group 2', 'group 4', 'vao'])) {
            fallbackReply = `🏛️ **TNPSC Exam Guide:**\n• Group I: Senior state civil services — District Collector level\n• Group II: Block Development Officer, District Educational Officer\n• Group IV: VAO, Junior Assistants, Typists — Most accessible entry\n• Syllabus: Tamil Nadu History, Culture, Geography + Indian Polity + Science + Aptitude\n• Books: Sura TNPSC Series, Samacheer Kalvi Class 6-12 books\n• Previous papers: tnpsc.gov.in/previous-questions.html\n• Coaching: Shankar IAS Academy, Suresh IAS Academy (Chennai) are top`;

        } else if (match(['freelancing', 'freelancer', 'upwork', 'fiverr', 'remote work', 'work from home'])) {
            fallbackReply = `💻 **Freelancing Career Guide:**\n• Best platforms: Upwork, Toptal, Fiverr, PeoplePerHour, Freelancer.com\n• High-paying niches: Web Dev ($40-150/hr), AI/ML consulting, UI/UX Design, Copywriting\n• Getting started: Complete 2-3 projects for free/low cost → build portfolio → raise rates\n• Indian freelancers earn: ₹30,000-5,00,000/month with the right skills\n• Payment: Payoneer, Wise, Razorpay for receiving international payments\n• LinkedIn + Contra platform — increasingly popular for premium freelance work\n• Key: Niche down, build a portfolio website, collect testimonials`;

        } else if (match(['stock', 'trading', 'invest', 'mutual fund', 'finance career', 'cfa', 'ca', 'chartered accountant'])) {
            fallbackReply = `💹 **Finance Career Guide:**\n• CA (Chartered Accountant): ICAI — Foundation → Inter → Final. One of India's most respected credentials. Salary: ₹8-40 LPA+\n• CFA: Institute of CFA — 3 levels, globally recognized for investment management. Salary: ₹12-60 LPA\n• Investment Banking: Target IIM/NMIMS MBA or CFA + networking. Top firms: Goldman Sachs, JP Morgan, Kotak IB\n• Stock Market: Learn on Zerodha Varsity (free) — basics to derivatives\n• NCFM Certifications: NSE's free/low-cost certifications for securities market knowledge`;

        } else if (match(['startup', 'entrepreneur', 'business idea', 'startup india'])) {
            fallbackReply = `🚀 **Startup & Entrepreneurship Guide:**\n• Ecosystem: India is world's 3rd largest startup ecosystem — 100+ unicorns\n• Funding sources: Friends & Family → Angel Investors → Seed funds → VC\n• Programs: Startup India (startupindia.gov.in) — tax exemptions, funding, mentoring\n• Incubators: IIT/IIM incubators, T-Hub Hyderabad, NASSCOM 10000 Startups, Zone Startups\n• Build: Validate idea → MVP → Product-Market Fit → Scale\n• Legal: Register as Pvt. Ltd. (₹5,000-15,000 via IndiaFilings or Razorpay Rize)\n• Recommended reading: "Zero to One", "The Lean Startup", "Start With Why"`;

        } else if (match(['drdo', 'isro', 'space', 'defence research', 'scientist', 'research'])) {
            fallbackReply = `🚀 **DRDO / ISRO Scientist Career:**\n• DRDO CEPTAM: Scientist 'B' entry for B.Tech graduates (age < 28)\n• ISRO Scientist/Engineer 'SC': Through ISRO centralized recruitment\n• Exam: Technical subject paper (based on branch) + General Aptitude CBT\n• Preparation: GATE study material (Ace Academy/Made Easy) + ISRO/DRDO PYQs\n• Selection: Written test → Technical Interview → Medical\n• Salary: Scientist 'B' ₹56,100/month + HRA + DA + research allowance\n• Life: Work on India's space missions, missile systems, defence technology — highly prestigious`;

        } else if (match(['hello', 'hi', 'hii', 'namaste', 'vanakkam', 'hai'])) {
            fallbackReply = `👋 **Hello! I'm TrustPath AI, your Career Advisor!**\n\nI can help you with:\n• 🎓 College admissions (JEE, NEET, CLAT, CAT)\n• 🏛️ Government exam prep (UPSC, SSC, Banking, Railways)\n• 💻 Career paths and skill development\n• 🌏 Higher studies abroad (MS, MBA)\n• 🎖️ Defense services (NDA, CDS, AFCAT)\n• 💰 Scholarships and financial aid\n\nWhat would you like guidance on today?`;

        } else if (match(['thank', 'thanks', 'thank you', 'nandri', 'romba nandri'])) {
            fallbackReply = `😊 You're welcome! Remember — every expert was once a beginner. Keep learning, stay consistent, and your career goals are absolutely achievable. 🌟\n\nFeel free to ask any other career, exam, or college questions anytime!`;

        } else {
            // Generic helpful fallback
            fallbackReply = `🤖 **TrustPath AI — Smart Offline Response**\n\nI'm currently in offline mode but I can still help! Here are some topics I cover:\n\n• 📚 **Exams**: JEE, NEET, GATE, CAT, UPSC, SSC, Banking, TNPSC, NDA\n• 🎓 **Colleges**: IIT, NIT, SRM, VIT, Anna University, AIIMS, NLU\n• 💻 **Skills**: Python, AI/ML, Cloud, Cybersecurity, UI/UX, Data Science\n• 💼 **Careers**: Engineering, Medicine, Law, Government, Defense, Finance\n• 🌏 **Abroad**: MS in USA/Germany/Canada, MBA, Scholarships\n\nPlease type your specific question and I'll give you detailed guidance! Also try again in a few minutes for full AI responses.`;
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
