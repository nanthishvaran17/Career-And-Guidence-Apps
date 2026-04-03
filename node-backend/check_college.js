const db = require('./db');

db.all("SELECT * FROM colleges WHERE name LIKE '%Nandha%'", (err, rows) => {
    if (err) {
        console.error("Error querying colleges:", err.message);
    } else {
        console.log("Found Colleges:", rows);
    }
});
