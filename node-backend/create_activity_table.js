const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'database', 'career_advisor.db'));

db.run(`CREATE TABLE IF NOT EXISTS user_activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  email TEXT,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_info TEXT,
  status TEXT DEFAULT 'success',
  details TEXT,
  session_duration_mins INTEGER,
  logged_in_at TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`, (err) => {
  if (err) console.error('Error:', err.message);
  else console.log('✅ user_activity_log table created/verified!');
  db.close();
});
