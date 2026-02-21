const db = require('./database/db');

db.all("SELECT name FROM colleges WHERE name LIKE '%Kongu%'", (err, rows) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Found Colleges:", rows);
    }
});
