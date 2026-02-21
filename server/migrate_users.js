const db = require('./database/db');

const alterTable = async () => {
    const columns = [
        "phone TEXT",
        "dob DATE",
        "education_level TEXT",
        "stream TEXT",
        "marks REAL",
        "interests TEXT",
        "location TEXT",
        "state TEXT",
        "category TEXT",
        "family_income TEXT",
        "career_preference TEXT",
        "target_exams TEXT",
        "disability BOOLEAN",
        "institution_name TEXT",
        "board_university TEXT",
        "completion_year TEXT",
        "skills TEXT",
        "preferred_courses TEXT",
        "preferred_locations TEXT",
        "languages TEXT",
        "profile_data TEXT",
        "gender TEXT"
    ];

    db.serialize(() => {
        columns.forEach(col => {
            const colName = col.split(' ')[0];
            // Check if column exists, if not add it
            db.all(`PRAGMA table_info(users)`, (err, rows) => {
                if (err) {
                    console.error("Error checking schema:", err);
                    return;
                }
                const exists = rows.some(r => r.name === colName);
                if (!exists) {
                    console.log(`Adding missing column: ${colName}`);
                    db.run(`ALTER TABLE users ADD COLUMN ${col}`, (err) => {
                        if (err) console.error(`Failed to add ${colName}:`, err.message);
                        else console.log(`✓ Added ${colName}`);
                    });
                } else {
                    console.log(`- Column ${colName} already exists.`);
                }
            });
        });
    });
};

alterTable();
