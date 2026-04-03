const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database/career_advisor.db');

const email = 'nanthish_test@gmail.com';

const profileData = {
    name: 'Nanthish S',
    age: '19',
    gender: 'Male',
    email: email,
    phone: '9876543210',
    location: 'Salem, TN',
    preferredLanguage: 'Tamil',
    
    // Academic (Step 2)
    educationLevel: 'Undergraduate',
    stream: 'Computer Science & Engineering',
    institutionName: 'SRM Institute of Science and Technology',
    completionYear: '2027',
    cgpa: '8.8',
    favoriteSubjects: 'Artificial Intelligence, Data Structures',
    weakSubjects: 'Chemistry',
    interestedExams: 'GATE, GRE',
    prepLevel: 'Intermediate',
    
    // Skills (Step 3)
    techSkills: 'Python, JavaScript, React, SQL, Machine Learning',
    softSkills: 'Communication, Team Leadership, Problem Solving',
    skillLevel: 'Intermediate',
    interestedFields: ['Technology', 'AI Architect', 'Software Engineering', 'Data Science'],
    hobbies: 'Coding, Tech Blogging',
    passionAreas: 'Building AI tools for social impact',
    
    // Goals (Step 4)
    shortTermGoal: 'Land a high-paying AI internship',
    longTermGoal: 'Chief Technology Officer (CTO)',
    dreamJob: 'AI Architect at Google/OpenAI',
    workEnvironment: 'Hybrid',
    studyLocation: 'India',
    studyCity: 'Bangalore/Chennai',
    courseMode: 'Online',
    
    // Professional/Financial (Step 5)
    familyIncome: '2.5 - 5 LPA',
    educationBudget: '5 - 10 Lakhs',
    scholarshipRequired: true,
    internships: 'Web Dev Intern at Tech Solutions',
    jobExperience: 'Fresher',
    projects: 'AI-Powered Career Guidance System, E-commerce Bot',
    resumeLink: 'https://nanthish-portfolio.example.com/resume.pdf',
    certificateLink: 'https://coursera.org/verify/ai-cert',
    portfolioLink: 'https://github.com/nanthish-dev'
};

const sql = `UPDATE users SET 
    name=?, phone=?, age=?, gender=?, preferred_language=?, 
    education_level=?, stream=?, marks=?, 
    interests=?, location=?, family_income=?, 
    career_preference=?, target_exams=?,
    institution_name=?, completion_year=?,
    skills=?, profile_data=?
    WHERE email=?`;

const params = [
    profileData.name, 
    profileData.phone, 
    profileData.age, 
    profileData.gender, 
    profileData.preferredLanguage,
    profileData.educationLevel, 
    profileData.stream, 
    profileData.cgpa,
    JSON.stringify(profileData.interestedFields), 
    profileData.location, 
    profileData.familyIncome,
    profileData.workEnvironment, 
    JSON.stringify(['GATE', 'GRE']),
    profileData.institutionName, 
    profileData.completionYear,
    JSON.stringify(['Python', 'React', 'AI', 'SQL']),
    JSON.stringify(profileData),
    email
];

db.run(sql, params, function(err) {
    if (err) {
        console.error('Error updating profile:', err.message);
    } else if (this.changes === 0) {
        // User might not exist yet, let's insert
        const insertSql = `INSERT INTO users (name, email, phone, age, gender, preferred_language, profile_data) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(insertSql, [profileData.name, email, profileData.phone, profileData.age, profileData.gender, profileData.preferredLanguage, JSON.stringify(profileData)], function(err2) {
            if (err2) console.error('Insert error:', err2.message);
            else console.log('Created new profile for Nanthish!');
            db.close();
        });
    } else {
        console.log('Successfully completed profile for Nanthish!');
        db.close();
    }
});
