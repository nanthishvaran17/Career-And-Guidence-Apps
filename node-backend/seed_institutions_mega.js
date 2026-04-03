const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database', 'career_advisor.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Starting MEGA SEED for Institutions (Schools & Colleges)...');

db.serialize(() => {
  // 1. CLEAR EXISTING DATA
  db.run("DELETE FROM schools");
  db.run("DELETE FROM colleges");
  // We won't delete scholarships as they are populated by seed_jobs_mega, but we'll add more just in case.
  // Actually, let's add 500 more scholarships too.
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 2. SEED 500+ SCHOOLS
  // ─────────────────────────────────────────────────────────────────────────────
  const schoolStmt = db.prepare(`INSERT INTO schools 
    (name, type, board, location, district, rating, website, infrastructure, fee_structure) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const schoolTypes = ['Private', 'Govt', 'Residential', 'Aided'];
  const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'];
  const schoolNames = ['Vidya Mandir', 'St. Johns', 'Dav Public', 'Kendriya Vidyalaya', 'Ryan International', 'DPS', 'Bharatiya Vidya Bhavan', 'Don Bosco', 'Saraswati Vidya Mandir', 'Maharishi Vidya Mandir'];
  const locations = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'];
  
  let schoolCount = 0;
  for (let i = 1; i <= 500; i++) {
    const baseName = schoolNames[Math.floor(Math.random() * schoolNames.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const board = boards[Math.floor(Math.random() * boards.length)];
    
    // Some real website logic based on name
    const websiteSlug = baseName.toLowerCase().replace(/[\s\.]/g, '');
    const website = `https://www.${websiteSlug}-${loc.toLowerCase()}.edu.in`;

    schoolStmt.run(
      `${baseName} Senior Secondary School, ${loc} #${i}`,
      schoolTypes[Math.floor(Math.random() * schoolTypes.length)],
      board,
      loc, // location
      loc, // district
      (3.5 + Math.random() * 1.5).toFixed(1), // rating 3.5 to 5.0
      website,
      JSON.stringify(['Smart Classrooms', 'AC Labs', 'Library', 'Sports Ground', 'Auditorium']),
      JSON.stringify({ tuition: `₹${Math.floor(Math.random() * 50 + 20)},000/yr`, other: '₹10,000' })
    );
    schoolCount++;
  }
  schoolStmt.finalize();
  console.log(`✅ Seeded ${schoolCount} Schools with websites and infra.`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. SEED 500+ COLLEGES including SRM and Nandha
  // ─────────────────────────────────────────────────────────────────────────────
  const collegeStmt = db.prepare(`INSERT INTO colleges 
    (name, location, district, city, field, type, affiliated_university, fees, fee_structure, hostel_available, accommodation, infrastructure, courses_offered, departments, admission_mode, rating, ranking, placement_stats, reviews, accreditations, website, details_link) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  // Insert SRM IST specifically
  collegeStmt.run(
    'SRM Institute of Science and Technology (SRM IST)',
    'Kattankulathur, Chennai', 'Chengalpattu', 'Chennai', 'Engineering', 'Deemed', 'SRM University',
    '₹2,50,000 - ₹4,50,000 / year',
    JSON.stringify({ tuition: '₹3,00,000/yr', hostel: '₹1,20,000/yr', mess: '₹60,000/yr' }),
    1,
    'Premium AC/Non-AC Hostels available with WiFi and Mess Food (North & South Indian)',
    JSON.stringify(['Supercomputer Access', 'Robotics Lab', 'Huge Central Library', 'Gym', 'Swimming Pool', 'Food Court']),
    JSON.stringify([{name: 'B.Tech CSE', duration: '4 Years', intake: 1200}, {name: 'B.Tech ECE', duration: '4 Years', intake: 600}]),
    JSON.stringify(['CSE', 'ECE', 'EEE', 'Mechanical', 'AI & Data Science', 'Biomedical']),
    'SRMJEEE Entrance Exam / Management Quota',
    4.5,
    'NIRF #18 | QS World Ranked',
    JSON.stringify({ average_package: '₹8.5 LPA', highest_package: '₹53 LPA', placement_percentage: '96%' }),
    JSON.stringify([
      { user: 'Student A', rating: 5, comment: 'Amazing infrastructure and top-notch placements. Best campus life!' },
      { user: 'Student B', rating: 4, comment: 'Great exposure, but fees are on the higher side.' }
    ]),
    JSON.stringify(['NAAC A++', 'NBA', 'ABET']),
    'https://www.srmist.edu.in/',
    'https://www.srmist.edu.in/admissions/'
  );

  // Insert Nandha Engineering College specifically
  collegeStmt.run(
    'Nandha Engineering College (Autonomous)',
    'Erode, Tamil Nadu', 'Erode', 'Erode', 'Engineering', 'Autonomous', 'Anna University',
    '₹50,000 - ₹90,000 / year',
    JSON.stringify({ tuition: '₹55,000/yr (Govt Quota) / ₹85,000/yr (Mgmt)', hostel: '₹60,000/yr' }),
    1,
    'Separate Boys and Girls hostels with hygienic food and secure environment',
    JSON.stringify(['Modern Computer Labs', 'TCS iON Zone', 'Library', 'Sports Complex', 'Transport Facility']),
    JSON.stringify([{name: 'B.E CSE', duration: '4 Years', intake: 180}, {name: 'B.E ECE', duration: '4 Years', intake: 120}, {name: 'B.Tech IT', duration: '4 Years', intake: 120}]),
    JSON.stringify(['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Agri', 'Civil']),
    'TNEA Counseling / Management Quota',
    4.1,
    'NIRF Top 200 Band',
    JSON.stringify({ average_package: '₹4.5 LPA', highest_package: '₹12 LPA', placement_percentage: '90%' }),
    JSON.stringify([
      { user: 'Alumni', rating: 4, comment: 'Good placement training provided from 2nd year onwards.' },
      { user: 'Current Student', rating: 4, comment: 'Excellent faculties and peaceful environment for studying.' }
    ]),
    JSON.stringify(['NAAC A', 'NBA Accredited']),
    'https://www.nandhaengg.org/',
    'https://www.nandhaengg.org/admissions.html'
  );

  let collegeCount = 2;
  const collegePrefix = ['Institute of Technology', 'College of Engineering', 'Arts and Science College', 'Medical College', 'University'];
  const fields = ['Engineering', 'Medical', 'Arts', 'Science', 'Management'];
  
  for(let i = 1; i <= 500; i++) {
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const field = fields[Math.floor(Math.random() * fields.length)];
    const cType = schoolTypes[Math.floor(Math.random() * schoolTypes.length)]; // just reusing names
    
    // Mock placements
    const avg = 3.5 + Math.random() * 5;
    const high = avg * 2 + Math.random() * 20;

    collegeStmt.run(
      `National ${collegePrefix[Math.floor(Math.random() * collegePrefix.length)]} ${loc} #${i}`,
      loc, loc, loc, field, 'Private', 'State University',
      `₹${Math.floor(Math.random() * 100) + 50},000 / year`,
      JSON.stringify({ tuition: `₹${Math.floor(Math.random() * 100) + 50},000/yr`, hostel: '₹80,000/yr' }),
      1,
      'Hostel availability for boys and girls.',
      JSON.stringify(['Labs', 'Library', 'Hostel', 'Cafeteria', 'WiFi']),
      JSON.stringify([{name: `B.Tech ${field}`, duration: '4 Years'}]),
      JSON.stringify(['CS', 'IT', 'ECE', 'Mech']),
      'Entrance Exam / Merit',
      (3.5 + Math.random() * 1.5).toFixed(1),
      Math.random() > 0.5 ? `NIRF #${Math.floor(Math.random() * 150) + 1}` : '',
      JSON.stringify({ average_package: `₹${avg.toFixed(1)} LPA`, highest_package: `₹${high.toFixed(1)} LPA`, placement_percentage: `${Math.floor(Math.random() * 20) + 80}%` }),
      JSON.stringify([{ user: 'Student', rating: 4, comment: 'Good college overall.' }]),
      JSON.stringify([Math.random() > 0.5 ? 'NAAC A' : 'NAAC B', 'NBA']),
      `https://www.nationaltech-${Math.floor(Math.random()*1000)}.edu.in`,
      `https://www.nationaltech-${Math.floor(Math.random()*1000)}.edu.in/admissions`
    );
    collegeCount++;
  }
  collegeStmt.finalize();
  console.log(`✅ Seeded ${collegeCount} Colleges including SRM and Nandha with comprehensive details.`);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. SEED MORE SCHOLARSHIPS
  // ─────────────────────────────────────────────────────────────────────────────
  const scholarStmt = db.prepare(`INSERT INTO scholarships 
    (name, provider, type, amount, deadline, link) 
    VALUES (?, ?, ?, ?, ?, ?)`);
  
  for(let i=0; i<300; i++){
    scholarStmt.run(
      `Merit Scholarship Program 2026 #${i}`,
      `Educational Trust ${i}`,
      'Private',
      `₹${Math.floor(Math.random() * 50) + 10},000`,
      'Dec 31, 2026',
      'https://scholarships.gov.in/'
    );
  }
  scholarStmt.finalize();
  console.log(`✅ Seeded 300 additional Scholarships.`);

});

setTimeout(() => {
  db.close();
  console.log('🎉 INSTITUTIONS MEGA SEED COMPLETE!');
}, 2000);
