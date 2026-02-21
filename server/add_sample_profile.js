const db = require('./database/db');

// Sample Profile Data from User
const sampleProfile = {
    // Basic Info
    name: 'Nanthish S',
    email: 'nanthish@gmail.com',
    password: 'password123', // You should change this
    phone: '9042020879',
    dob: '2007-01-06',
    gender: 'Male',

    // Education
    education_level: 'UG',
    institution_name: '', // College name will be in profile_data
    marks: 8.9,

    // Profile Data (JSON)
    profile_data: {
        educationHistory: {
            class10: {
                schoolName: '',
                board: '',
                marks: ''
            },
            class12: {
                schoolName: '',
                stream: '',
                board: '',
                marks: ''
            },
            ug: {
                degree: '',
                specialization: '',
                collegeName: ''
            }
        },
        subjectGrades: {
            math: '',
            science: '',
            english: '',
            cs: ''
        },
        interestSignals: {
            programming: 3,
            ai: 1,
            cyberSecurity: 1,
            dataAnalysis: 1,
            electronics: 1,
            research: 1,
            management: 1,
            design: 1,
            teaching: 1,
            publicSector: 1
        },
        traits: {
            analytical: 3,
            creativity: 3,
            leadership: 3,
            stressHandling: 3
        },
        learningStyle: 'visual',
        learningSpeed: 'medium',
        workEnvironment: 'hybrid',
        shortTermGoal: '',
        longTermGoal: '',
        financialConstraint: 'medium',
        hobbies: []
    }
};

// Insert into database
const sql = `INSERT INTO users (
    name, email, password, phone, dob, gender, 
    education_level, institution_name, marks, 
    profile_data, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`;

const params = [
    sampleProfile.name,
    sampleProfile.email,
    sampleProfile.password,
    sampleProfile.phone,
    sampleProfile.dob,
    sampleProfile.gender,
    sampleProfile.education_level,
    sampleProfile.institution_name,
    sampleProfile.marks,
    JSON.stringify(sampleProfile.profile_data)
];

db.run(sql, params, function (err) {
    if (err) {
        console.error('❌ Error inserting sample profile:', err.message);
    } else {
        console.log('✅ Sample profile created successfully!');
        console.log('📝 User ID:', this.lastID);
        console.log('👤 Name:', sampleProfile.name);
        console.log('📧 Email:', sampleProfile.email);
        console.log('📞 Phone:', sampleProfile.phone);
        console.log('🎂 DOB:', sampleProfile.dob);
        console.log('🎓 Education Level:', sampleProfile.education_level);
        console.log('📊 CGPA:', sampleProfile.marks);

        // Verify the data
        db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                console.error('Error verifying:', err);
            } else {
                console.log('\n📋 Stored Data:');
                console.log('- Name:', row.name);
                console.log('- Email:', row.email);
                console.log('- Phone:', row.phone);
                console.log('- DOB:', row.dob);
                console.log('- Gender:', row.gender);
                console.log('- Education Level:', row.education_level);
                console.log('- CGPA:', row.marks);
                console.log('- Profile Data:', JSON.parse(row.profile_data || '{}'));
            }
            process.exit(0);
        });
    }
});
