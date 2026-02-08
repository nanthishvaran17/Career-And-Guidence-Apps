const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const fs = require('fs');

// Render persistent disk or tmp (since Render files are ephemeral)
// In production, use process.env.RENDER_DISK_PATH if you attached a disk, 
// otherwise use /tmp for temporary storage (data lost on restart) or just local file for read-only.
// For this hackathon, we'll try to use a writable path.
const dbPath = process.env.NODE_ENV === 'production'
    ? path.join('/tmp', 'career_advisor.db') // Writable Ephemeral Storage
    : path.resolve(__dirname, 'career_advisor.db'); // Local Dev

console.log(`Using database file at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Initialize tables if new DB file is created in /tmp
        const createTables = require('./schema');
        createTables();

        // Seed Data if needed (checks happen inside)
        const seedData = require('./seed');
        // Small delay to ensure table creation commands are queued/processed
        setTimeout(() => {
            try {
                seedData(db);
            } catch (e) {
                console.error("Seeding failed:", e);
            }
        }, 1000);
    }
});

module.exports = db;
