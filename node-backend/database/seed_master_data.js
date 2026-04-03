const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'career_advisor.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database for seeding: ' + err.message);
        return;
    }
    console.log('Connected to the SQLite database for Master Data seeding.');
    seedMasterData();
});

const educationLevels = [
    { name: "10th Standard", description: "Secondary School Certificate (SSLC)" },
    { name: "12th Standard", description: "Higher Secondary Certificate (HSC)" },
    { name: "Diploma", description: "Polytechnic / Diploma Courses (3 Years)" },
    { name: "Undergraduate (UG)", description: "Bachelor's Degree (B.E, B.Tech, B.Sc, B.Com, B.A)" },
    { name: "Postgraduate (PG)", description: "Master's Degree (M.E, M.Tech, M.Sc, MBA)" },
    { name: "Ph.D", description: "Doctorate / Research Level" }
];

const streams = [
    { name: "Science (PCM)", category: "Education" },
    { name: "Science (PCB)", category: "Education" },
    { name: "Commerce", category: "Education" },
    { name: "Arts / Humanities", category: "Education" },
    { name: "Computer Science Engineering", category: "Engineering" },
    { name: "Mechanical Engineering", category: "Engineering" },
    { name: "Civil Engineering", category: "Engineering" },
    { name: "Electronics & Communication", category: "Engineering" },
    { name: "Medicine (MBBS)", category: "Medical" },
    { name: "Nursing", category: "Medical" },
    { name: "Business Administration", category: "Management" },
    { name: "Law (LLB)", category: "Law" }
];

const skills = [
    // Tech
    { name: "Python Programming", category: "Technical", description: "General purpose programming and AI" },
    { name: "Java Programming", category: "Technical", description: "Enterprise software development" },
    { name: "React / Vite frontend", category: "Technical", description: "Modern web UI development" },
    { name: "SQL & Databases", category: "Technical", description: "Database design and querying" },
    { name: "Cloud Computing (AWS/Azure)", category: "Technical", description: "Managing cloud infrastructure" },
    { name: "Machine Learning / AI", category: "Technical", description: "Building predictive models" },
    // Soft Skills
    { name: "Communication Skills", category: "Soft Skill", description: "Effective verbal and written communication" },
    { name: "Leadership", category: "Soft Skill", description: "Ability to lead and manage teams" },
    { name: "Problem Solving", category: "Soft Skill", description: "Analytical and critical thinking" },
    // Core Engineering
    { name: "AutoCAD", category: "Engineering", description: "2D and 3D design drafting" },
    { name: "Circuit Design", category: "Engineering", description: "Electronics and board design" }
];

const companies = [
    // IT giants
    { name: "Tata Consultancy Services (TCS)", type: "Private", sector: "IT Services", hq: "Mumbai" },
    { name: "Infosys", type: "Private", sector: "IT Services", hq: "Bangalore" },
    { name: "Wipro", type: "Private", sector: "IT Services", hq: "Bangalore" },
    { name: "Cognizant", type: "Private", sector: "IT Services", hq: "Chennai" },
    { name: "Google India", type: "Private/MNC", sector: "Tech Product", hq: "Hyderabad" },
    { name: "Microsoft India", type: "Private/MNC", sector: "Tech Product", hq: "Hyderabad" },
    { name: "Amazon India", type: "Private/MNC", sector: "E-Commerce", hq: "Bangalore" },
    // Core/Manufacturing
    { name: "Larsen & Toubro (L&T)", type: "Private", sector: "Construction & Engineering", hq: "Mumbai" },
    { name: "Tata Motors", type: "Private", sector: "Automobile Manufacturing", hq: "Mumbai" },
    { name: "Reliance Industries", type: "Private", sector: "Conglomerate", hq: "Mumbai" },
    // Public Sector
    { name: "ISRO", type: "Government", sector: "Space Research", hq: "Bangalore" },
    { name: "DRDO", type: "Government", sector: "Defense", hq: "New Delhi" },
    { name: "ONGC", type: "Government/PSU", sector: "Oil & Gas", hq: "New Delhi" }
];

const careers = [
    { title: "Software Engineer", category: "IT", description: "Develop and maintain software applications.", salary: "4-15 LPA", min_edu: "UG in CSE/IT" },
    { title: "Data Scientist", category: "IT / Analytics", description: "Analyze large datasets to extract insights.", salary: "6-20 LPA", min_edu: "UG in Math/Stat/CS" },
    { title: "AI/ML Engineer", category: "IT / Emerging Tech", description: "Build artificial intelligence algorithms.", salary: "8-25 LPA", min_edu: "UG/PG in CS or AI" },
    { title: "Civil Engineer", category: "Engineering", description: "Design and oversee construction projects.", salary: "3-10 LPA", min_edu: "UG in Civil Engineering" },
    { title: "Mechanical Engineer", category: "Engineering", description: "Design and analyze mechanical systems.", salary: "3-9 LPA", min_edu: "UG in Mechanical Engineering" },
    { title: "Doctor (Physician)", category: "Healthcare", description: "Diagnose and treat medical conditions.", salary: "10-25+ LPA", min_edu: "MBBS" },
    { title: "Investment Banker", category: "Finance", description: "Help corporations raise capital.", salary: "15-30+ LPA", min_edu: "MBA or CF" },
    { title: "Product Manager", category: "Management/Tech", description: "Lead the strategy and development of a product.", salary: "12-30 LPA", min_edu: "UG + MBA preferred" },
    { title: "Graphic Designer", category: "Creative", description: "Create compelling visual concepts.", salary: "3-8 LPA", min_edu: "Diploma/UG in Design" },
    { title: "IAS Officer", category: "Government", description: "Administrate government duties at district/state level.", salary: "7-18 LPA + Perks", min_edu: "Any UG Degree (UPSC Exam)" }
];

function seedMasterData() {
    db.serialize(() => {
        // Education Levels
        let eduStmt = db.prepare("INSERT OR IGNORE INTO education_levels (name, description) VALUES (?, ?)");
        educationLevels.forEach(e => eduStmt.run([e.name, e.description]));
        eduStmt.finalize();

        // Streams
        let streamStmt = db.prepare("INSERT OR IGNORE INTO streams (name, category) VALUES (?, ?)");
        streams.forEach(s => streamStmt.run([s.name, s.category]));
        streamStmt.finalize();

        // Skills (Assume 'skills' table exists, checking schema)
        // Ensure table exists first if it was casually dropped
        db.run(`CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            category TEXT,
            description TEXT
        )`);
        let skillStmt = db.prepare("INSERT OR IGNORE INTO skills (name, category, description) VALUES (?, ?, ?)");
        skills.forEach(sk => skillStmt.run([sk.name, sk.category, sk.description]));
        skillStmt.finalize();

        // Companies
        let compStmt = db.prepare(`INSERT OR IGNORE INTO companies (name, type, sector, headquarters_city) VALUES (?, ?, ?, ?)`);
        companies.forEach(c => compStmt.run([c.name, c.type, c.sector, c.hq]));
        compStmt.finalize();

        // Careers
        let carStmt = db.prepare(`INSERT OR IGNORE INTO careers (title, category, description, salary_range, min_education) VALUES (?, ?, ?, ?, ?)`);
        careers.forEach(c => carStmt.run([c.title, c.category, c.description, c.salary, c.min_edu]));
        carStmt.finalize();

        console.log("Successfully seeded Master Data: Education Levels, Streams, Skills, Companies, and Careers!");
    });
}
