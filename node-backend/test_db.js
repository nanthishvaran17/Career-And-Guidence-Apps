const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/career_advisor.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening db:', err.message);
        return;
    }
    db.all('SELECT id, email, password FROM users;', [], (err, rows) => {
        if (err) {
            console.error('Error querying:', err.message);
        } else {
            console.log(rows);
        }
        db.close();
    });
});
