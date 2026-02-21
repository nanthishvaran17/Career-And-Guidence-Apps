const db = require('./database/db');

db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Current Columns in 'users' table:");
        console.log(rows.map(r => r.name));
    }
});
