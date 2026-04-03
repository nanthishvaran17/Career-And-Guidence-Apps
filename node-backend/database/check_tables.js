const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const db = new sqlite3.Database(path.resolve(__dirname, 'career_advisor.db'));

const tables = ['jobs', 'internships', 'skills', 'govt_jobs', 'scholarships'];
let results = '';
let done = 0;
tables.forEach(t => {
    db.all(`PRAGMA table_info(${t})`, [], (e, cols) => {
        if (e) results += `\n${t}: ERROR: ${e.message}\n`;
        else results += `\n--- ${t} ---\n${cols ? cols.map(c => c.name).join(', ') : 'EMPTY'}\n`;
        if (++done === tables.length) {
            fs.writeFileSync(path.resolve(__dirname, 'schema_output.txt'), results);
            console.log('Written to schema_output.txt');
            db.close();
        }
    });
});
