const db = require('./server/database/db');

db.serialize(() => {
    console.log("🔍 CHECKING USER & COMPANY DATA...");

    const email = "nanthishvaran17@gmail.com";

    // Check User
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) console.error("DB Error:", err);
        if (row) {
            console.log(`✅ User Found: ${row.email} (ID: ${row.id})`);
            console.log(`   Password: ${row.password}`);
        } else {
            console.log(`❌ User NOT Found: ${email}`);
            // Auto-create for debugging?
            // db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", ["Nanthish", email, "password123"]);
            // console.log("   --> Created dummy user for testing.");
        }
    });

    // Check Company Count
    db.get("SELECT COUNT(*) as count FROM companies", (err, row) => {
        if (err) console.error(err);
        else console.log(`🏢 Companies Count: ${row.count}`);
    });
});
