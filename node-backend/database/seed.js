const seedData = (db) => {
    console.log("🌱 STARTING GOVERNMENT-GRADE DATABASE SEEDING - PHASE 2...");

    // --- UTILITIES ---
    const districtsList = [
        "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Kanyakumari",
        "Dindigul", "Cuddalore", "Kanchipuram", "Tiruvallur", "Tiruppur", "Virudhunagar", "Namakkal", "Thoothukudi"
    ];

    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomJSON = (arr) => JSON.stringify(arr.sort(() => .5 - Math.random()).slice(0, randomInt(1, arr.length)));
    const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

    const generateReviews = (count) => {
        const reviews = [];
        const names = ["Nanthish", "Priya", "Rahul", "Swetha", "Karthik", "Anjali", "Vikram", "Divya"];
        const comments = {
            good: ["Excellent infrastructure.", "Great faculty.", "Good placement record.", "Campus life is amazing.", "Best in the city."],
            avg: ["Decent college.", "Needs improvement in labs.", "Average placements.", "Fees is a bit high."],
            bad: ["Not recommended.", "Poor facilities.", "Management is strict."]
        };

        for (let i = 0; i < count; i++) {
            const rating = randomInt(3, 5);
            let type = rating >= 4 ? 'good' : (rating === 3 ? 'avg' : 'bad');
            reviews.push({
                user: random(names),
                rating: rating,
                comment: random(comments[type]),
                date: new Date().toISOString().split('T')[0]
            });
        }
        return JSON.stringify(reviews);
    };

    db.serialize(() => {
        // CLEANUP
        const tables = ["schools", "colleges", "skills", "internships", "scholarships", "jobs", "govt_jobs", "careers", "companies", "education_levels", "streams"];
        tables.forEach(t => db.run(`DELETE FROM ${t}`));

        db.run("BEGIN TRANSACTION");

        // --- 0. MASTER DATA ---
        console.log("... Seeding Master Data");
        const eduLevels = ["10th", "12th", "Diploma", "UG", "PG", "PhD"];
        const eduStmt = db.prepare("INSERT INTO education_levels (name) VALUES (?)");
        eduLevels.forEach(l => eduStmt.run(l));
        eduStmt.finalize();

        const streams = [
            { n: "Science", c: "School" }, { n: "Commerce", c: "School" }, { n: "Arts", c: "School" },
            { n: "Engineering", c: "Higher Ed" }, { n: "Medical", c: "Higher Ed" }, { n: "Law", c: "Higher Ed" },
            { n: "Agriculture", c: "Higher Ed" }, { n: "Management", c: "Higher Ed" }
        ];
        const streamStmt = db.prepare("INSERT INTO streams (name, category) VALUES (?, ?)");
        streams.forEach(s => streamStmt.run(s.n, s.c));
        streamStmt.finalize();

        // --- 1. COMPANIES ---
        console.log("... Seeding Companies");
        const compStmt = db.prepare("INSERT INTO companies (name, sector, location, website) VALUES (?, ?, ?, ?)");
        const companies = [
            { n: "Zoho", s: "IT", l: "Chennai" }, { n: "TCS", s: "IT", l: "Chennai" }, { n: "Freshworks", s: "IT", l: "Chennai" },
            { n: "Hyundai", s: "Manufacturing", l: "Kanchipuram" }, { n: "Apollo Hospitals", s: "Healthcare", l: "Chennai" },
            { n: "Titan", s: "Manufacturing", l: "Hosur" }, { n: "L&T", s: "Construction", l: "Chennai" }
        ];
        companies.forEach(c => compStmt.run(c.n, c.s, c.l, `https://${c.n.toLowerCase()}.com`));
        compStmt.finalize();


        // --- 2. SCHOOLS (500+ Entries) ---
        console.log("... Seeding Schools");
        const stmtSchools = db.prepare(`INSERT INTO schools (
            name, type, board, management, year_established, location, district, city, address_link, website, contact_info,
            classes_offered, medium, streams, subjects, student_teacher_ratio, fee_structure, infrastructure,
            board_results, awards, rating, reviews, strengths, admission_process, rte_available, hostel_available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        const schoolTypes = ["Government", "Private", "Aided", "Residential"];
        const boards = ["State Board", "CBSE", "ICSE", "Matriculation"];
        const schoolNames = ["Vidhyalaya", "Public School", "Matriculation School", "Higher Secondary School", "Academy"];
        const prefixes = ["Sri", "St.", "The", "National", "Royal", "Global", "Velammal", "Chettinad", "DAV", "Maharishi"];

        // Manual High-Quality Entries
        const manualSchools = [
            { name: "Padma Seshadri Bala Bhavan (PSBB)", location: "Nungambakkam", district: "Chennai", type: "Private", board: "CBSE" },
            { name: "SBOA School & Junior College", location: "Anna Nagar", district: "Chennai", type: "Private", board: "CBSE" },
            { name: "Chettinad Vidyashram", location: "R.A. Puram", district: "Chennai", type: "Private", board: "CBSE" },
            { name: "St. Patrick's AIHr Sec School", location: "Adyar", district: "Chennai", type: "Aided", board: "State Board" },
            { name: "TVS Lakshmi School", location: "Madurai", district: "Madurai", type: "Private", board: "Matriculation" }
        ];

        manualSchools.forEach(s => {
            stmtSchools.run(
                s.name, s.type, s.board, "Trust", 1980 + randomInt(-20, 20), s.location, s.district, s.district,
                "#", "https://schools.org.in", JSON.stringify({ phone: "044-12345678" }),
                "LKG - 12th", "English", JSON.stringify(["Science", "Commerce"]), JSON.stringify(["Math", "Physics"]),
                "30:1", JSON.stringify({ tuition: "₹60,000/year" }), JSON.stringify(["Labs", "Transport", "Smart Class", "Auditorium"]),
                JSON.stringify({ pass_percentage_12th: "100%" }), JSON.stringify([]), (4.5 + Math.random() * 0.5).toFixed(1),
                generateReviews(5), JSON.stringify(["Academic Excellence", "Sports"]), "{}", 0, 0
            );
        });

        // Programmatic Generation
        for (let i = 0; i < 500; i++) {
            const dist = random(districtsList);
            const type = random(schoolTypes);
            const board = random(boards);
            const name = `${random(prefixes)} ${random(schoolNames)}, ${dist}`;

            stmtSchools.run(
                name, type, board, type === "Government" ? "Govt" : "Private Trust",
                1950 + randomInt(0, 70), `${dist} City`, dist, dist,
                "#", "https://schools.org.in", JSON.stringify({ phone: `044-${randomInt(20000000, 29999999)}` }),
                "1st - 12th", "English/Tamil", JSON.stringify(["Science", "Commerce"]),
                JSON.stringify(["Maths", "Science", "Social"]), "40:1",
                JSON.stringify({ tuition: type === "Government" ? "Free" : `₹${randomInt(10, 150)}k / year` }),
                JSON.stringify(["Library", "Playground", "Smart Class"]),
                JSON.stringify({ pass_percentage_12th: `${randomInt(70, 100)}%` }),
                JSON.stringify([]), (3.0 + Math.random() * 2.0).toFixed(1),
                generateReviews(randomInt(0, 3)), JSON.stringify([]), JSON.stringify({}),
                (i % 5 === 0) ? 1 : 0, (type === "Residential") ? 1 : 0
            );
        }
        stmtSchools.finalize();

        // --- 3. COLLEGES (300+ Entries) ---
        console.log("... Seeding Colleges");
        // --- 3. COLLEGES (MASSIVE SEEDING - 4000+ Records) ---
        console.log("... Seeding Colleges (Massive Dataset)");
        const stmtColleges = db.prepare(`INSERT INTO colleges (
            name, location, district, city, field, type, affiliated_university, approval_bodies, 
            year_established, intake_capacity, fees, fee_structure, hostel_available, 
            courses_offered, departments, infrastructure,
            placement_stats, rating, website, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`);

        const districts = [
            "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode",
            "Kallakurichi", "Kancheepuram", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
            "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
            "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
            "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
        ];

        const collegeTypes = ["Government", "Private", "Aided", "Autonomous", "Deemed University"];
        const fields = ["Engineering", "Arts & Science", "Medical", "Law", "Agriculture", "Polytechnic", "Education", "Management"];

        // Helper to generate courses based on field
        const getCourses = (field) => {
            if (field === "Engineering") return [{ name: "B.E. CSE", intake: 120 }, { name: "B.E. ECE", intake: 60 }, { name: "B.Tech IT", intake: 60 }, { name: "B.E. Mech", intake: 60 }];
            if (field === "Medical") return [{ name: "MBBS", intake: 150 }, { name: "BDS", intake: 50 }];
            if (field === "Arts & Science") return [{ name: "B.Sc CS", intake: 60 }, { name: "B.Com", intake: 100 }, { name: "B.A. English", intake: 60 }];
            return [{ name: "General Course", intake: 60 }];
        };

        // Generate ~120 colleges per district to reach >4000
        districts.forEach(dist => {
            // Weights: Cities get more colleges
            let count = ["Chennai", "Coimbatore", "Kancheepuram", "Tiruvallur", "Madurai"].includes(dist) ? 250 : 100;

            for (let i = 1; i <= count; i++) {
                const type = collegeTypes[Math.floor(Math.random() * collegeTypes.length)];
                const field = fields[Math.floor(Math.random() * fields.length)];
                const isGovt = type === "Government";
                const name = isGovt
                    ? `Government ${field} College, ${dist}`
                    : `${dist} Institute of ${field} & Technology`; // Simplified naming

                const courses = getCourses(field);
                const placement = {
                    average_package: `${Math.floor(Math.random() * 12 + 3)} LPA`,
                    highest_package: `${Math.floor(Math.random() * 35 + 15)} LPA`,
                    placement_percentage: `${Math.floor(Math.random() * 40 + 60)}%`
                };

                const infra = ["Library", "Lab", "Hostel", "Transport", "WiFi", "Auditorium"].sort(() => .5 - Math.random()).slice(0, 4);

                stmtColleges.run(
                    name + (i > 1 ? ` - ${i}` : ""), // Uniqufy names
                    dist, dist, dist, field, type,
                    "Anna University", "AICTE/UGC",
                    1950 + Math.floor(Math.random() * 70),
                    300 + Math.floor(Math.random() * 2000), // Intake
                    isGovt ? "₹10,000/year" : `₹${Math.floor(Math.random() * 150 + 50)}k/year`,
                    JSON.stringify({ tuition: isGovt ? 2000 : 50000, hostel: 20000 }),
                    1, // Hostel available
                    JSON.stringify(courses),
                    JSON.stringify(courses.map(c => c.name)), // Departments
                    JSON.stringify(infra),
                    JSON.stringify(placement),
                    (Math.random() * 2 + 3).toFixed(1), // Rating 3.0 - 5.0
                    `https://${name.replace(/[^a-zA-Z]/g, '').toLowerCase()}.edu.in`
                );
            }
        });
        stmtColleges.finalize();

        // --- 4. JOBS (250+ Entries) ---
        console.log("... Seeding Private Jobs (Massive)");
        const stmtJobs = db.prepare(`INSERT INTO jobs (
           title, company, sector, location, salary_range, description, apply_link, skills_required, job_type
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        const sectors = ["IT", "Core", "Banking", "Healthcare", "Teaching", "Marketing", "Finance", "Legal", "Retail"];
        const roles = ["Developer", "Engineer", "Analyst", "Manager", "Consultant", "Executive", "Director", "Specialist"];

        for (let i = 0; i < 300; i++) {
            const sector = random(sectors);
            const company = random(companies) || { n: "Generic Corp" };
            stmtJobs.run(
                `${random(["Junior", "Senior", "Lead", "Chief"])} ${sector} ${random(roles)}`,
                company.n, sector, random(districtsList),
                `₹${randomInt(3, 25)} LPA`, "Great opportunity with competitive salary and benefits.", "#",
                JSON.stringify([`Skill ${i}`, "Communication"]), "Full-time"
            );
        }
        stmtJobs.finalize();

        // --- 5. SCHOLARSHIPS (50 Entries) ---
        console.log("... Seeding Scholarships");
        const stmtSch = db.prepare(`INSERT INTO scholarships (
           title, provider, amount, eligibility_criteria, category, deadline, link
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`);

        for (let i = 0; i < 50; i++) {
            stmtSch.run(
                `${random(["Merit", "Sports", "Minority", "Women", "PhD"])} Scholarship 2025`, "Govt of India", `₹${randomInt(10, 100)}k`, "Merit based", "General", "2025-12-31", "#"
            );
        }
        stmtSch.finalize();


        // --- 6. GOVT JOBS (250+ Entries) ---
        console.log("... Seeding Govt Jobs (Massive)");
        const stmtGovt = db.prepare(`INSERT INTO govt_jobs (
            title, category, exam_name, eligibility_criteria, description, website
        ) VALUES (?, ?, ?, ?, ?, ?)`);

        const govtRoles = ["TNPSC Group 1", "TNPSC Group 2", "TNPSC Group 4", "Banking PO", "Railway JE", "SSC CGL", "UPSC Civil Services", "RBI Assistant", "LIC AAO", "IBPS Clerk", "RRB NTPC", "Police Constable", "Sub Inspector", "VAO"];
        const govtDepts = ["Tamil Nadu Govt", "Central Govt", "Indian Railways", "SBI", "RBI", "LIC", "India Post", "Police Dept", "Revenue Dept"];

        for (let i = 0; i < 300; i++) {
            const role = random(govtRoles);
            const dept = random(govtDepts);
            stmtGovt.run(
                `${role} Officer`, dept, role, "Degree / 12th / 10th", `Prestigious opportunity in ${dept}. Secure your future with good perks.`, "https://tnpsc.gov.in"
            );
        }
        stmtGovt.finalize();

        // --- 7. INTERNSHIPS (500+ Entries) ---
        console.log("... Seeding Internships (Massive)");
        const stmtIntern = db.prepare(`INSERT INTO internships (
            title, company, type, stipend, duration, requirements, link, domain, mode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        const internRoles = ["Web Dev", "Data Science", "Content Writer", "Marketing", "HR", "Graphic Design", "Video Editing", "Cyber Security", "Cloud Computing"];
        const internModes = ["Remote", "On-site", "Hybrid"];

        for (let i = 0; i < 600; i++) {
            const company = random(companies) || { n: "Startup Inc" };
            const role = random(internRoles);
            const domain = role;

            stmtIntern.run(
                `${role} Intern`, company.n, "Paid", `₹${randomInt(5, 30)}k / month`, `${randomInt(1, 6)} Months`,
                "Basic knowledge required.", "#", domain, random(internModes)
            );
        }
        stmtIntern.finalize();

        // --- 8. SKILLS (1000+ Entries) ---
        console.log("... Seeding Skills (Massive)");
        const stmtSkills = db.prepare(`INSERT INTO skills (
            title, category, description, level, domain, roadmap, resources
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`);

        const skillCats = {
            "Tech": ["Python", "Java", "C++", "React", "Node.js", "AWS", "Docker", "Kubernetes", "SQL", "NoSQL", "Git", "Linux", "TensorFlow", "Pandas", "Flutter"],
            "Business": ["Marketing", "Sales", "Finance", "Accounting", "Project Mgmt", "Leadership", "Negotiation", "Public Speaking"],
            "Design": ["Photoshop", "Illustrator", "Figma", "UI/UX", "Video Editing", "3D Modeling", "Animation"],
            "Soft": ["Communication", "Teamwork", "Problem Solving", "Time Mgmt", "Critical Thinking", "Adaptability"]
        };

        const levels = ["Beginner", "Intermediate", "Advanced"];

        // Generate 1000+ Skills by combining Category + Level + Variant
        let skillCount = 0;
        Object.keys(skillCats).forEach(cat => {
            skillCats[cat].forEach(baseSkill => {
                // Base
                stmtSkills.run(baseSkill, cat, `Master ${baseSkill} for ${cat} roles.`, "All Levels", cat, JSON.stringify(["Basics", "Advanced"]), JSON.stringify(["Documentation"]));
                skillCount++;

                // Variants
                for (let i = 1; i <= 15; i++) { // Generate variants to reach 1000+
                    const variant = `${baseSkill} - Level ${i}`;
                    stmtSkills.run(
                        variant,
                        cat,
                        `Advanced module ${i} for ${baseSkill}.`,
                        random(levels),
                        cat,
                        JSON.stringify([`Step 1: Learn ${baseSkill}`, `Step 2: Master Module ${i}`]),
                        JSON.stringify(["Course Link", "Tutorial"])
                    );
                    skillCount++;
                }
            });
        });
        console.log(`   -> Generated ${skillCount} skills.`);
        stmtSkills.finalize();

        // --- 9. CAREERS (1000+ Entries) ---
        console.log("... Seeding Careers (Massive Dataset)");
        const stmtCareers = db.prepare(`INSERT INTO careers (
            title, category, description, salary_range, job_growth, 
            required_stream, required_skills, roadmap, top_companies, min_education
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        const careerCategories = ["STEM", "Healthcare", "Business", "Design", "Media", "Legal", "Defense", "Teaching", "Government", "Sports"];
        const careerRoles = {
            "STEM": ["Data Scientist", "AI Engineer", "Full Stack Developer", "Cybersecurity Analyst", "Cloud Architect", "Robotics Engineer"],
            "Healthcare": ["General Physician", "Surgeon", "Nurse", "Pharmacist", "Physiotherapist", "Dentist"],
            "Business": ["Product Manager", "Financial Analyst", "HR Manager", "Marketing Executive", "Entrepreneur", "Investment Banker"],
            "Design": ["UX/UI Designer", "Graphic Designer", "Fashion Designer", "Interior Architect", "Game Designer"],
            "Media": ["Journalist", "Content Creator", "Video Editor", "Digital Marketer", "Public Relations Specialist"],
            "Legal": ["Corporate Lawyer", "Civil Judge", "Legal Advisor", "Criminal Lawyer"],
            "Defense": ["Army Officer", "Navy Officer", "Air Force Pilot", "DRDO Scientist"],
            "Teaching": ["Professor", "School Teacher", "EdTech Instructor", "Research Scholar"],
            "Government": ["IAS Officer", "IPS Officer", "IFS Officer", "IRS Officer", "MRO"],
            "Sports": ["Cricketer", "Athlete", "Coach", "Sports Physiologist"]
        };

        const streamsMap = {
            "STEM": "Engineering",
            "Healthcare": "Medical",
            "Business": "Commerce",
            "Design": "Arts",
            "Media": "Arts",
            "Legal": "Law",
            "Defense": "Any",
            "Teaching": "B.Ed",
            "Government": "Any",
            "Sports": "Any"
        };

        // Generate 1000+ Careers
        let careerCount = 0;
        for (let i = 1; i <= 100; i++) { // Loop to generate multiples
            Object.keys(careerRoles).forEach(cat => {
                careerRoles[cat].forEach(role => {
                    const title = i === 1 ? role : `${role} (${random(["Senior", "Lead", "Chief", "Junior", "Specialist"])}) - Type ${i}`;

                    stmtCareers.run(
                        title,
                        cat,
                        `Exciting career in ${cat} as a ${title}.`,
                        `₹${randomInt(4, 25)} LPA`,
                        `${randomInt(5, 20)}% Growth`,
                        streamsMap[cat],
                        JSON.stringify(["Skill A", "Skill B", "Skill C"]),
                        JSON.stringify(["Step 1: Degree", "Step 2: Internship", "Step 3: Job"]),
                        JSON.stringify(["Top Company 1", "Top Company 2"]),
                        "Bachelor's Degree"
                    );
                    careerCount++;
                });
            });
        }
        console.log(`   -> Generated ${careerCount} career paths.`);
        stmtCareers.finalize();

        db.run("COMMIT");
        console.log("✅ SEEDING PHASE 2 COMPLETE WITH RICH DATA.");
    });
};

module.exports = seedData;
