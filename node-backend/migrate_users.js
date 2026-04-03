const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database', 'career_advisor.db');
const db = new sqlite3.Database(dbPath);

const columnsToAdd = [
    { name: 'gender', type: 'TEXT' },
    { name: 'age', type: 'INTEGER' },
    { name: 'preferred_language', type: 'TEXT' }
];

db.serialize(() => {
    columnsToAdd.forEach(col => {
        db.run(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`, (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log(`✅ Column ${col.name} already exists.`);
                } else {
                    console.error(`❌ Error adding ${col.name}:`, err.message);
                }
            } else {
                console.log(`✅ Added column ${col.name}.`);
            }
        });
    });
});

db.close((err) => {
    if (err) console.error(err.message);
    else console.log('✅ Database migration complete.');
});
