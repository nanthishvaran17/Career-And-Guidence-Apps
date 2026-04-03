const fs = require('fs');
const path = require('path');

const seedPath = path.resolve(__dirname, 'seed.js');
let seedContent = fs.readFileSync(seedPath, 'utf8');

const nandhaCollege = `
        { 
            name: "Nandha Engineering College", 
            location: "Erode, Tamil Nadu", 
            field: "Engineering (CSE, IT, ECE, Mech, Civil, AGRI, BME, CHEM)", 
            fees: "₹50k - ₹85k/year", 
            rating: 4.5, 
            type: "Private (Autonomous)", 
            website: "https://nandhaengg.org/", 
            accommodation: "Hostel & Day Scholar Available", 
            details_link: "https://nandhaengg.org/",
            placement_stats: JSON.stringify({ 
                average_package: "₹4.5 LPA", 
                highest_package: "₹12 LPA", 
                placement_percentage: "92%" 
            }),
            reviews: JSON.stringify([
                { user: "Student", rating: 4.5, comment: "Excellent infrastructure and supportive faculty." },
                { user: "Alumni", rating: 4.0, comment: "Good placement support for circuit branches." }
            ]),
            ranking: "NAAC 'A' Grade | NBA Accredited"
        },`;

// 1. Add College Data (Reliable)
const collegesEndIndex = seedContent.lastIndexOf('    ];');
if (collegesEndIndex !== -1) {
    const collegesBlockRegex = /const colleges = \[\s*([\s\S]*?)(\s*\}\s*,\s*)?(\s*\];)/;
    const match = seedContent.match(collegesBlockRegex);
    if (match) {
        const fullMatch = match[0];
        if (!fullMatch.includes("Nandha Engineering College")) {
            const newCollegesBlock = fullMatch.replace(/\];$/, `,${nandhaCollege}\n    ];`);
            seedContent = seedContent.replace(fullMatch, newCollegesBlock);
            console.log("Successfully added Nandha Engineering College data");
        } else {
            console.log("Nandha already in data array");
        }
    }
}

// 2. Update SQL Prepare Statement (Exact Match)
const oldSql = 'const insertCollege = db.prepare("INSERT INTO colleges (name, location, field, fees, rating, type, website, details_link, accommodation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");';
const newSql = 'const insertCollege = db.prepare("INSERT INTO colleges (name, location, field, fees, rating, type, website, details_link, accommodation, placement_stats, reviews, ranking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");';

if (seedContent.includes(oldSql)) {
    seedContent = seedContent.replace(oldSql, newSql);
    console.log("Updated SQL Prepare Statement");
} else {
    console.log("SQL Prepare Statement already updated or not found");
}

// 3. Update Loop (Exact Match from viewing file)
const oldLoop = 'colleges.forEach(college => insertCollege.run(college.name, college.location, college.field, college.fees, college.rating, college.type, college.website, college.details_link, college.accommodation));';
const newLoop = `colleges.forEach(college => {
            insertCollege.run(
                college.name, 
                college.location, 
                college.field, 
                college.fees, 
                college.rating, 
                college.type, 
                college.website, 
                college.details_link, 
                college.accommodation,
                college.placement_stats || null,
                college.reviews || null,
                college.ranking || null
            );
        });`;

if (seedContent.includes(oldLoop)) {
    seedContent = seedContent.replace(oldLoop, newLoop);
    console.log("Updated SQL Execution Loop");
} else {
    // Try without trailing semicolon in case
    const oldLoopNoSemi = oldLoop.slice(0, -1);
    if (seedContent.includes(oldLoopNoSemi)) {
        seedContent = seedContent.replace(oldLoopNoSemi, newLoop);
        console.log("Updated SQL Execution Loop (No Semi)");
    } else {
        console.log("SQL Execution Loop already updated or not found");
    }
}

fs.writeFileSync(seedPath, seedContent);
