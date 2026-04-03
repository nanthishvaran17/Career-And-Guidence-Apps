const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const fs = require('fs');

// Render persistent disk or tmp (since Render files are ephemeral)
// In production, use process.env.RENDER_DISK_PATH if you attached a disk, 
// otherwise use /tmp for temporary storage (data lost on restart) or just local file for read-only.
// For this hackathon, we'll try to use a writable path.
const dbPath = (process.env.NODE_ENV === 'production' || process.env.RENDER)
    ? path.join('/tmp', 'career_advisor.db') // Writable Ephemeral Storage for Render
    : path.resolve(__dirname, 'career_advisor.db'); // Local Dev

console.log(`Using database file at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Use serialize to ensure tables are created BEFORE seeding
        db.serialize(() => {
            console.log("🛠️  Initializing Database Schema...");
            const createTables = require('./schema');
            createTables();

            // Only seed in production if not already seeded
            // For hackathon, we always try to seed (INSERT OR IGNORE handles it)
            console.log("🌱 Starting Auto-Seeding for Production...");
            try {
                const seedData = require('./seed');
                seedData(db);
            } catch (e) {
                console.error("❌ Auto-Seeding failed:", e);
            }
        });
    }
});

module.exports = db;
