const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/career_advisor.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening db:', err.message);
        return;
    }
    db.run('UPDATE users SET password = ? WHERE email = ?', ['12345678', 'nanthishvaran17@gmail.com'], function(err) {
        if (err) {
            console.error('Error updating:', err.message);
        } else {
            console.log(`Updated ${this.changes} rows. Password for nanthishvaran17@gmail.com is now 12345678`);
        }
        db.close();
    });
});
