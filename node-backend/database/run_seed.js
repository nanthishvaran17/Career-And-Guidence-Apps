/**
 * Run the full seed directly against the live DB
 * node database/run_seed.js
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'career_advisor.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) { console.error('DB Error:', err.message); return; }
    console.log('Connected to DB at:', dbPath);
    const seedData = require('./seed');
    seedData(db);
    setTimeout(() => {
        // Verify counts
        const tables = ['jobs', 'internships', 'skills', 'govt_jobs', 'scholarships', 'colleges', 'schools'];
        tables.forEach(t => {
            db.get(`SELECT COUNT(*) as c FROM ${t}`, [], (e, r) => {
                if (r) console.log(`📊 ${t}: ${r.c} records`);
            });
        });
        setTimeout(() => db.close(() => console.log('\n✅ Done! DB closed.')), 3000);
    }, 8000);
});
