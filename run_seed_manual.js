const db = require('./server/database/db');
const seedData = require('./server/database/seed');

// Wait for DB connection
setTimeout(() => {
    console.log("Running Seed from separate script...");
    seedData(db);
}, 2000);
