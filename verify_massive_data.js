const db = require('./server/database/db');

db.serialize(() => {
    console.log("📊 VERIFYING MASSIVE DATASET...");

    db.get("SELECT COUNT(*) as count FROM colleges", (err, row) => {
        if (err) console.error(err);
        else console.log(`🏫 Colleges Count: ${row.count} (Target: >4200)`);
    });

    db.get("SELECT COUNT(*) as count FROM companies", (err, row) => {
        if (err) console.error(err);
        else console.log(`🏢 Companies Count: ${row.count} (Target: >5000)`);
    });

    // Check if 'Add College' API fields exist
    db.get("SELECT * FROM colleges LIMIT 1", (err, row) => {
        if (row) {
            const keys = Object.keys(row);
            const hasNewFields = keys.includes('intake_capacity') && keys.includes('courses_offered');
            console.log(`✅ Schema Check: New fields present? ${hasNewFields ? 'YES' : 'NO'}`);
        }
    });

    // Check Company fields
    db.get("SELECT * FROM companies LIMIT 1", (err, row) => {
        if (row) {
            const keys = Object.keys(row);
            const hasSource = keys.includes('data_source');
            console.log(`✅ Company Schema: 'data_source' present? ${hasSource ? 'YES' : 'NO'}`);
            console.log(`   Sample Source: ${row.data_source}`);
        }
    });
});
