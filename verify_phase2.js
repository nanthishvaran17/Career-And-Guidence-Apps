const db = require('./server/database/db');

db.serialize(() => {
    const tables = ["schools", "colleges", "jobs", "internships", "skills", "companies", "streams", "education_levels", "govt_jobs"];

    tables.forEach(table => {
        db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
            if (err) console.error(err);
            else console.log(`${table.toUpperCase()}: ${row.count}`);
        });
    });

    // Check specific data quality
    db.get("SELECT name, field, departments FROM colleges WHERE field = 'Law' LIMIT 1", (err, row) => {
        if (row) console.log("\nSample Law College:", row);
    });

    db.get("SELECT name, type, board FROM schools WHERE type='Government' LIMIT 1", (err, row) => {
        if (row) console.log("\nSample Govt School:", row);
    });

    db.get("SELECT * FROM companies LIMIT 1", (err, row) => {
        if (row) console.log("\nSample Company:", row);
    });
});
