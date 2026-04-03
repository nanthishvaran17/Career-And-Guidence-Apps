const db = require('./database/db');

// Wait a bit for connection
setTimeout(() => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            console.error("Error querying users:", err);
            return;
        }

        console.log(`Found ${rows.length} users.`);

        if (rows.length === 0) {
            console.log("No users found. Creating test user...");
            const sql = "INSERT INTO users (name, email, phone, password, interests, target_exams) VALUES (?, ?, ?, ?, ?, ?)";
            const params = ['Test User', 'test@example.com', '1234567890', 'password123', '[]', '[]'];

            db.run(sql, params, function (err) {
                if (err) {
                    console.error("Error creating test user:", err);
                } else {
                    console.log("Test user created successfully:");
                    console.log("Email: test@example.com");
                    console.log("Password: password123");
                }
            });
        } else {
            console.log("Existing users found. You can log in with:");
            console.log(`Email: ${rows[0].email}`);
            console.log(`Password: ${rows[0].password}`);
        }
    });
}, 1000);
