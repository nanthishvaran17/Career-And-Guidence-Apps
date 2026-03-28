const db = require('./server/database/db');
setTimeout(() => {
    db.get('SELECT id, name, field, rating, ranking FROM colleges WHERE name LIKE "%Nandha%"', [], (err, row) => {
        if (err) { console.error(err); process.exit(1); }
        console.log('Nandha record:', JSON.stringify(row, null, 2));
        process.exit(0);
    });
}, 1000);
