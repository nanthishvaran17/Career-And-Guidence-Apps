const path = require('path');
const db = require('./db');

console.log("🛠️ PATCHING SCHOOL DATA FOR PREMIUM COMPARISON...");

db.serialize(() => {
    // 1. Ensure the column exists (just in case schema update didn't run yet)
    db.run("ALTER TABLE schools ADD COLUMN total_students INTEGER", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error("Column Add Error:", err.message);
        }
    });

    // 2. Fetch all schools to update them with realistic data
    db.all("SELECT id, name, type FROM schools", [], (err, rows) => {
        if (err) {
            console.error("Fetch error:", err);
            return;
        }

        console.log(`Found ${rows.length} schools to patch.`);

        const stmt = db.prepare(`UPDATE schools SET 
            total_students = ?, 
            board_results = ?, 
            fee_structure = ?,
            infrastructure = ?,
            student_teacher_ratio = ?
            WHERE id = ?`);

        rows.forEach((school, index) => {
            const isGovt = school.type === 'Government';
            const totalStudents = 400 + Math.floor(Math.random() * 2000);
            const passRate = 85 + Math.floor(Math.random() * 14); // 85-99%
            
            const boardResults = JSON.stringify({
                pass_percentage_12th: `${passRate}%`,
                pass_percentage_10th: `${passRate + 1}%`,
                toppers: ["Nanthish S", "Priya K"]
            });

            const tuition = isGovt ? "Free" : `₹${20 + Math.floor(Math.random() * 100)},000/yr`;
            const feeStructure = JSON.stringify({
                tuition: tuition,
                admission: isGovt ? "₹0" : "₹5,000",
                hostel: school.type === 'Residential' ? "₹35,000/yr" : "N/A"
            });

            const infra = ["Smart Classrooms", "AC Labs", "Library", "Sports Ground", "Auditorium", "WiFi", "Cafeteria"];
            const infrastructure = JSON.stringify(infra.sort(() => .5 - Math.random()).slice(0, 5));

            const ratio = isGovt ? "45:1" : "25:1";

            stmt.run([
                totalStudents,
                boardResults,
                feeStructure,
                infrastructure,
                ratio,
                school.id
            ]);
        });

        stmt.finalize();
        console.log("✅ ALL SCHOOLS PATCHED SUCCESSFULLY!");
        
        // Small delay to ensure DB writes finish before script exits
        setTimeout(() => {
            console.log("Checking randomized sample...");
            db.get("SELECT id, name, total_students, fee_structure FROM schools ORDER BY RANDOM() LIMIT 1", (err, row) => {
                if (row) console.log("Sample Match:", JSON.stringify(row, null, 2));
                process.exit(0);
            });
        }, 1000);
    });
});
