const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/career_advisor.db');
const db = new sqlite3.Database(dbPath);

console.log('Targeting DB at:', dbPath);

db.serialize(() => {
    // 1. Schools - India Top 150
    db.run("DELETE FROM schools");
    const schoolStmt = db.prepare("INSERT INTO schools (name, type, board, location, rating) VALUES (?, ?, ?, ?, ?)");
    const boards = ["CBSE", "ICSE", "State Board"];
    for (let i = 1; i <= 150; i++) {
        schoolStmt.run(
            `Top School ${i} India`,
            i % 2 === 0 ? "Private" : "Govt",
            boards[i % 3],
            i % 2 === 0 ? "Mumbai" : "Chennai",
            (4.0 + (i % 10) / 10).toFixed(1)
        );
    }
    schoolStmt.finalize();

    // 2. Colleges - India Top 150
    db.run("DELETE FROM colleges");
    const collegeStmt = db.prepare("INSERT INTO colleges (name, location, field, type, ranking) VALUES (?, ?, ?, ?, ?)");
    const collegesList = ["IIT Madras", "IIT Delhi", "IIT Bombay", "NIT Trichy", "BITS Pilani", "VIT Vellore", "SRM IST", "IIM Ahmedabad", "AIIMS Delhi", "CMC Vellore"];
    for (let i = 1; i <= 150; i++) {
        collegeStmt.run(
            i <= collegesList.length ? collegesList[i-1] : `College ${i} India`,
            i % 2 === 0 ? "Bangalore" : "Hyderabad",
            i % 3 === 0 ? "Engineering" : "Medical",
            i % 2 === 0 ? "Govt" : "Private",
            `NIRF #${i}`
        );
    }
    collegeStmt.finalize();

    // 3. Internships - Exactly 703
    db.run("DELETE FROM internships");
    const internStmt = db.prepare("INSERT INTO internships (title, company, type, stipend, link) VALUES (?, ?, ?, ?, ?)");
    for (let i = 1; i <= 703; i++) {
        internStmt.run(`Internship ${i}`, "Tech Corp", "Full-time", "₹20,000/mo", "https://internshala.com");
    }
    internStmt.finalize();

    // 4. Skills - Exactly 100
    db.run("DELETE FROM skills");
    const skillStmt = db.prepare("INSERT INTO skills (title, category, description, level) VALUES (?, ?, ?, ?)");
    for (let i = 1; i <= 100; i++) {
        skillStmt.run(`Skill ${i}`, "IT", "Professional Roadmap", i % 2 === 0 ? "Beginner" : "Advanced");
    }
    skillStmt.finalize();

    // 5. User Profile Update (Identity Sync)
    db.run("UPDATE users SET name = 'Nanthish S', phone = '9042020879' WHERE email = 'nanthishvaran17@gmail.com' OR email = 'nanthish_test@gmail.com'");

    console.log("Master Seed Success: 150 Schools, 150 Colleges, 703 Internships, 100 Skills.");
});

db.close();
