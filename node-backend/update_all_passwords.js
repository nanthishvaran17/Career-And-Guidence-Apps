const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/career_advisor.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening db:', err.message);
        return;
    }
    db.run('UPDATE users SET password = ?', ['password123'], function(err) {
        if (err) {
            console.error('Error updating:', err.message);
        } else {
            console.log(`Updated ${this.changes} rows. All user passwords are now password123`);
        }
        db.close();
    });
});
