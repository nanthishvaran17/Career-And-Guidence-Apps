const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'server/database/career_advisor.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.get("SELECT * FROM colleges WHERE name LIKE '%Nandha%'", (err, row) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Nandha College Found:", row);
            if (row) {
                console.log("Placement Stats:", row.placement_stats);
                console.log("Departments:", row.departments);
            }
        }
    });

    db.get("SELECT count(*) as count FROM schools", (err, row) => {
        if (err) console.error(err);
        else console.log("Total Schools:", row.count);
    });
});

db.close();
