const db = require('./db');

const createTables = () => {
  db.serialize(() => {
    // Only drop tables in development if explicitly requested or needed manually.
    // In production, we NEVER want to drop tables automatically.
    // db.run("DROP TABLE IF EXISTS users"); 
    // ... (commenting out all drops)

    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT, -- Added for login
      password TEXT, -- Added for auth
      phone TEXT, -- New
      gender TEXT, -- New
      age INTEGER, -- New
      dob DATE, -- Keep for legacy or more precise data
      preferred_language TEXT, -- New
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
      profile_data TEXT, -- New: JSON object for 11-dimension data (Academic, Hobbies, Traits, etc.)
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Schools Table (Comprehensive Expansion)
    // db.run("DROP TABLE IF EXISTS schools"); // Resetting for schema update
    db.run(`CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT, -- Govt, Private, Aided, Residential
      board TEXT, -- State Board, CBSE, ICSE, IB, IGCSE
      management TEXT, -- Govt, Trust, Society
      year_established INTEGER,
      location TEXT, -- City/Town/Village
      district TEXT, -- For filtering
      address_link TEXT, -- Google Maps Link
      website TEXT,
      contact_info TEXT, -- JSON { phone, email }
      
      -- Academic Details
      classes_offered TEXT, -- e.g., "Pre-KG to 12th"
      medium TEXT, -- Tamil, English, Both
      streams TEXT, -- JSON array ["Science", "Commerce", "Arts"]
      subjects TEXT, -- JSON array
      student_teacher_ratio TEXT,

      -- Fee Structure (JSON)
      fee_structure TEXT, -- JSON { admission, tuition_class_wise, transport, hostel, other }
      
      -- Facilities (JSON)
      infrastructure TEXT, -- JSON array [Smart Class, Library, Labs, Playground, etc.]
      facilities_details TEXT, -- JSON object for more detail if needed

      -- Results & Performance
      board_results TEXT, -- JSON { pass_percentage_10th, pass_percentage_12th, toppers }
      awards TEXT, -- JSON array

      -- Reviews
      rating REAL,
      reviews TEXT, -- JSON array [{ user, rating, comment }]
      strengths TEXT, -- JSON array
      
      -- Admission
      admission_process TEXT, -- JSON { criteria, age, timeline, documents }
      rte_available BOOLEAN DEFAULT 0,
      hostel_available BOOLEAN DEFAULT 0,
      total_students INTEGER,
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Careers Table
    // db.run("DROP TABLE IF EXISTS careers");
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

    // Colleges Table (Massive Expansion)
    // db.run("DROP TABLE IF EXISTS colleges");
    db.run(`CREATE TABLE IF NOT EXISTS colleges (

      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      district TEXT, 
      city TEXT,
      field TEXT, -- Engineering, Medical, Arts, etc.
      type TEXT, -- Govt, Private, Deemed, Autonomous
      affiliated_university TEXT, 
      approval_bodies TEXT, -- AICTE, UGC, NMC
      year_established INTEGER, 
      intake_capacity INTEGER, -- New
      
      -- Fee Structure (JSON)
      fees TEXT, -- Display text
      fee_structure TEXT, -- JSON { tuition, hostel, mess, other }
      
      -- Facilities
      hostel_available BOOLEAN DEFAULT 0,
      hostel_fees TEXT, -- JSON
      accommodation TEXT,
      infrastructure TEXT, -- JSON array
      
      -- Academic
      courses_offered TEXT, -- JSON array of objects { name, duration, intake }
      departments TEXT, -- JSON array (Simple list)
      admission_mode TEXT, 

      -- Stats
      rating REAL,
      ranking TEXT, 
      placement_stats TEXT, -- JSON { average_package, highest_package, placement_percentage }
      reviews TEXT, -- JSON array
      accreditations TEXT, -- JSON array (NAAC, NBA)

      -- Meta
      website TEXT,
      details_link TEXT,
      contact_info TEXT, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Skills Table (Missing previously)
    db.run(`CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      level TEXT,
      roadmap TEXT, -- JSON array
      resources TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Internships Table (Ensure exists)
    db.run(`CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT,
      type TEXT,
      stipend TEXT,
      location TEXT,
      link TEXT,
      requirements TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);


    // --- NEW MASTER DATA TABLES ---

    // Companies Table (API Ingestion Ready)
    // db.run("DROP TABLE IF EXISTS companies");
    db.run(`CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT UNIQUE, -- External API ID (e.g., CIN)
      name TEXT NOT NULL,
      type TEXT, -- Private, Public, PSU
      sector TEXT, -- IT, Manufacturing, Banking
      ownership TEXT, -- Central Govt, State Govt, Private
      
      -- Location
      headquarters_city TEXT,
      district TEXT,
      location TEXT,
      
      -- Details
      website TEXT,
      description TEXT,
      logo_url TEXT,
      year_established INTEGER,
      
      -- Meta
      data_source TEXT, -- 'MCA', 'TN_GOVT', 'Generated'
      last_synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Education Levels Master
    // db.run("DROP TABLE IF EXISTS education_levels");
    db.run(`CREATE TABLE IF NOT EXISTS education_levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE, -- 10th, 12th, UG, PG
      description TEXT
    )`);

    // Streams Master
    // db.run("DROP TABLE IF EXISTS streams");
    db.run(`CREATE TABLE IF NOT EXISTS streams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE, -- Science, Commerce, Engineering, Medical
      category TEXT -- Education/Job
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

    // Password History Table (prevent reuse of last 3 passwords)
    db.run(`CREATE TABLE IF NOT EXISTS password_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      password_hash TEXT NOT NULL,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Security Activity Log Table
    db.run(`CREATE TABLE IF NOT EXISTS security_activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,       -- 'password_changed', 'login_failed', etc.
      ip_address TEXT,
      user_agent TEXT,
      status TEXT DEFAULT 'success', -- 'success' | 'failed'
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // User Activity Log Table (Login / Logout events)
    db.run(`CREATE TABLE IF NOT EXISTS user_activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      email TEXT,
      action TEXT NOT NULL,        -- 'login' | 'logout'
      ip_address TEXT,
      user_agent TEXT,
      device_info TEXT,
      status TEXT DEFAULT 'success',
      details TEXT,
      session_duration_mins INTEGER, -- filled on logout
      logged_in_at TEXT,             -- ISO timestamp of paired login (set on logout)
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    console.log('Tables created/updated successfully.');
  });
};



// createTables(); // Removed auto-execution. Called from db.js

module.exports = createTables;
