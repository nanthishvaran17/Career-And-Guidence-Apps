const db = require('./db');

const createTables = () => {
  db.serialize(() => {
    // Drop tables to apply new schema (Development only - allows simple updates)
    db.run("DROP TABLE IF EXISTS users");
    db.run("DROP TABLE IF EXISTS careers");
    db.run("DROP TABLE IF EXISTS govt_jobs");
    db.run("DROP TABLE IF EXISTS scholarships");
    db.run("DROP TABLE IF EXISTS internships");
    db.run("DROP TABLE IF EXISTS colleges");

    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT, -- Added for login
      password TEXT, -- Added for auth
      phone TEXT, -- New
      dob DATE, -- New
      education_level TEXT,
      stream TEXT,
      marks REAL,
      interests TEXT, -- JSON string
      location TEXT,
      state TEXT, -- New
      category TEXT,
      family_income TEXT,
      career_preference TEXT,
      target_exams TEXT, -- New: JSON array
      disability BOOLEAN, -- New
      institution_name TEXT, -- New for Expanded Profile
      board_university TEXT, -- New for Expanded Profile
      completion_year TEXT, -- New for Expanded Profile
      skills TEXT, -- New: JSON array
      preferred_courses TEXT, -- New: JSON array
      preferred_locations TEXT, -- New: JSON array
      languages TEXT, -- New: JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Schools Table
    db.run(`CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      board TEXT, -- CBSE, State, ICSE
      medium TEXT, -- Tamil, English
      location TEXT,
      rating REAL,
      fees TEXT,
      facilities TEXT, -- JSON
      contact TEXT,
      website TEXT
    )`);

    // Careers Table
    db.run(`CREATE TABLE IF NOT EXISTS careers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      salary_range TEXT,
      job_growth TEXT,
      required_stream TEXT,
      required_skills TEXT,
      roadmap TEXT,
      top_companies TEXT,
      min_education TEXT
    )`);

    // Colleges Table
    db.run(`CREATE TABLE IF NOT EXISTS colleges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      field TEXT,
      fees TEXT,
      rating REAL,
      type TEXT,
      website TEXT,
      details_link TEXT,
      accommodation TEXT, -- New: 'Hostel Available', 'Day Scholar', etc.
      placement_stats TEXT, -- New: JSON { average_package, highest_package, placement_percentage }
      reviews TEXT, -- New: JSON array of objects { user, rating, comment }
      ranking TEXT -- New: e.g. "NIRF Rank 12"
    )`);

    // Govt Jobs Table
    db.run(`CREATE TABLE IF NOT EXISTS govt_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      exam_name TEXT,
      eligibility_criteria TEXT,
      description TEXT,
      website TEXT,
      syllabus TEXT, -- New: Detailed syllabus text or JSON
      exam_pattern TEXT, -- New: JSON string
      preparation_books TEXT, -- New: JSON string or text
      important_dates TEXT -- New: JSON { start, end, exam }
    )`);

    // Scholarships Table
    db.run(`CREATE TABLE IF NOT EXISTS scholarships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      provider TEXT,
      amount TEXT,
      eligibility_criteria TEXT,
      deadline DATE,
      link TEXT
    )`);

    // Skills Table
    db.run(`CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      level TEXT,
      roadmap TEXT, -- JSON array of steps
      resources TEXT -- JSON array of links
    )`);

    // Internships Table
    db.run(`CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT,
        type TEXT,
        stipend TEXT,
        duration TEXT,
        requirements TEXT,
        link TEXT -- Added link field
      )`);

    // Chat History Table
    db.run(`CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      message TEXT,
      sender TEXT, -- 'user' or 'bot'
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    console.log('Tables created/updated successfully.');
  });
};

createTables();

module.exports = createTables;
