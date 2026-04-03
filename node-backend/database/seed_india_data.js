const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'career_advisor.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database for seeding: ' + err.message);
        return;
    }
    console.log('Connected to the SQLite database for massive seeding.');
    seedColleges();
});

const statesAndDistricts = {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Erode", "Vellore"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Navi Mumbai"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Davangere"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Ghaziabad", "Prayagraj"],
    "Kerala": ["Trivandrum", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
    "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Rohtak"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"]
};

const collegeArchetypes = [
    { type: 'Govt', field: 'Engineering', suffix: 'Government College of Engineering, %D' },
    { type: 'Govt', field: 'Arts & Science', suffix: 'Government Arts and Science College, %D' },
    { type: 'Govt', field: 'Medical', suffix: 'Government Medical College, %D' },
    { type: 'Govt', field: 'Polytechnic', suffix: 'Government Polytechnic College, %D' },
    { type: 'Private', field: 'Engineering', suffix: 'Sri Institute of Technology, %D' },
    { type: 'Private', field: 'Engineering', suffix: '%D Institute of Engineering and Management' },
    { type: 'Private', field: 'Arts & Science', suffix: 'National College of Arts, %D' },
    { type: 'Private', field: 'Medical', suffix: '%D Institute of Medical Sciences' },
    { type: 'Deemed', field: 'University', suffix: '%D Global University' },
    { type: 'Autonomous', field: 'Engineering', suffix: 'Excel Engineering College, %D' }
];

function seedColleges() {
    console.log("Starting massive generation of 1000+ colleges...");
    
    let stmt = db.prepare(`INSERT INTO colleges 
        (name, location, district, city, field, type, affiliated_university, approval_bodies, year_established, intake_capacity, fees)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    let count = 0;

    db.serialize(() => {
        // Clear old auto-generated or dummy ones to avoid infinite bloat? (optional, let's just insert)
        
        // Add Elite Institutes First
        const elite = [
            ["Indian Institute of Technology (IIT)", "Chennai", "Chennai", "Chennai", "Engineering", "Govt", "Autonomous", "UGC, AICTE", 1959, 1500, "2 Lakhs/year"],
            ["Indian Institute of Technology (IIT)", "Mumbai", "Mumbai", "Mumbai", "Engineering", "Govt", "Autonomous", "UGC, AICTE", 1958, 1200, "2 Lakhs/year"],
            ["Indian Institute of Management (IIM)", "Ahmedabad", "Ahmedabad", "Ahmedabad", "Management", "Govt", "Autonomous", "UGC", 1961, 500, "25 Lakhs/course"],
            ["All India Institute of Medical Sciences (AIIMS)", "New Delhi", "New Delhi", "New Delhi", "Medical", "Govt", "Autonomous", "NMC", 1956, 125, "6000/year"],
            ["National Institute of Technology (NIT)", "Trichy", "Trichy", "Trichy", "Engineering", "Govt", "Autonomous", "UGC, AICTE", 1964, 1000, "1.5 Lakhs/year"]
        ];

        elite.forEach(e => {
            stmt.run(e);
            count++;
        });

        // Loop through states and districts to generate the rest
        for (const [state, districts] of Object.entries(statesAndDistricts)) {
            for (const district of districts) {
                // Generate around 15 colleges per district to reach ~1000
                for (let i = 0; i < 15; i++) {
                    let arc = collegeArchetypes[i % collegeArchetypes.length];
                    let name = arc.suffix.replace(/%D/g, district);
                    // Add slight variations for uniqueness if looping more than archetypes
                    if (i >= collegeArchetypes.length) name = `${name} (Campus ${i-collegeArchetypes.length+2})`;

                    let location = `${district}, ${state}`;
                    let affiliated = arc.type === 'Govt' ? `State University of ${state}` : `Deemed University ${state}`;
                    let year = 1950 + Math.floor(Math.random() * 70); // 1950 to 2020
                    let intake = 300 + Math.floor(Math.random() * 1000);
                    let fees = arc.type === 'Govt' ? `${10000 + Math.floor(Math.random()*20000)}/year` : `${100000 + Math.floor(Math.random()*200000)}/year`;

                    stmt.run([name, location, district, district, arc.field, arc.type, affiliated, "AICTE, UGC", year, intake, fees]);
                    count++;
                }
            }
        }

        stmt.finalize();
        console.log(`Successfully generated and queued ${count} colleges!`);
    });
}
