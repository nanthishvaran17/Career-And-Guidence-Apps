const db = require('./server/database/db');

const TARGET_USER = {
    email: 'nanthishsaravanan17@gmail.com',
    password: '123456789', // The password user wants (as per user request "Next pass 123456789")
    name: 'Nanthish Saravanan'
};

setTimeout(() => {
    console.log(`Checking for user: ${TARGET_USER.email}...`);

    db.get('SELECT * FROM users WHERE email = ?', [TARGET_USER.email], (err, row) => {
        if (err) {
            console.error("DB Error:", err);
            return;
        }

        if (row) {
            console.log("User found.");
            if (row.password !== TARGET_USER.password) {
                console.log("Password mismatch. Updating password...");
                db.run('UPDATE users SET password = ? WHERE email = ?', [TARGET_USER.password, TARGET_USER.email], (err) => {
                    if (err) console.error("Update failed:", err);
                    else console.log("✅ Password updated successfully to: " + TARGET_USER.password);
                });
            } else {
                console.log("✅ User exists with correct password.");
            }
        } else {
            console.log("User not found. Creating user...");
            const sql = `INSERT INTO users (name, email, phone, password, interests, target_exams) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [TARGET_USER.name, TARGET_USER.email, '9876543210', TARGET_USER.password, '["Coding"]', '["GATE"]'];

            db.run(sql, params, function (err) {
                if (err) {
                    console.error("Insert failed:", err);
                } else {
                    console.log(`✅ User created successfully. ID: ${this.lastID}`);
                    console.log(`Email: ${TARGET_USER.email}`);
                    console.log(`Password: ${TARGET_USER.password}`);
                }
            });
        }
    });
}, 1000);
