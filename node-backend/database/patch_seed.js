const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed.js');
const patchedPath = path.join(__dirname, 'seed_patched.js');

let seedContent = fs.readFileSync(seedPath, 'utf8');

// 1. Insert Helper Functions and Nandha Engineering College
const collegeStartMarker = 'const colleges = [';
const newCollegeData = `
    // Helper for reviews and placement
    const getPlacement = (isTop) => JSON.stringify({
        average_package: isTop ? "₹15L PA" : "₹4.5L PA",
        highest_package: isTop ? "₹1.2Cr PA" : "₹12L PA",
        placement_percentage: isTop ? "98%" : "85%"
    });

    const getReviews = () => JSON.stringify([
        { user: "Student A", rating: 5, comment: "Excellent infrastructure." },
        { user: "Alumni B", rating: 4, comment: "Good placement support." }
    ]);

    const colleges = [
        // NANDHA ENGINEERING COLLEGE
        { 
            name: "Nandha Engineering College", 
            location: "Erode, Tamil Nadu", 
            field: "Engineering (Autonomous)", 
            fees: "₹55k/year", 
            rating: 4.5, 
            type: "Private", 
            website: "https://nandhaengg.org/", 
            accommodation: "Hostel & Day Scholar Available", 
            details_link: "https://nandhaengg.org/",
            placement_stats: JSON.stringify({
                average_package: "₹4.5L PA",
                highest_package: "₹12L PA", 
                placement_percentage: "90%"
            }),
            reviews: JSON.stringify([
                { user: "Ravi Kumar", rating: 5, comment: "Best autonomous college in Erode region." },
                { user: "Priya S", rating: 4, comment: "Placement training is very good from 3rd year." },
                { user: "Arun M", rating: 4.5, comment: "Eco-friendly campus." }
            ]),
            ranking: "NAAC 'A' Grade"
        },
`;

if (seedContent.includes(collegeStartMarker)) {
    seedContent = seedContent.replace(collegeStartMarker, newCollegeData);
    console.log('Successfully injected college data.');
} else {
    console.error('Could not find college start marker');
}

// 2. Update SQL Insert Logic
const sqlStartMarker = 'const insertCollege = db.prepare("INSERT INTO colleges';
const sqlEndMarker = 'insertCollege.finalize();';

// We need to find the block to replace.
const regex = /const insertCollege = db\.prepare\("INSERT INTO colleges.*?insertCollege\.finalize\(\);/s;

const newSqlLogic = `
        const insertCollege = db.prepare("INSERT INTO colleges (name, location, field, fees, rating, type, website, details_link, accommodation, placement_stats, reviews, ranking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        colleges.forEach(c => {
            insertCollege.run(
                c.name, 
                c.location, 
                c.field, 
                c.fees, 
                c.rating, 
                c.type, 
                c.website, 
                c.details_link, 
                c.accommodation,
                c.placement_stats || getPlacement(c.rating > 4.7),
                c.reviews || getReviews(),
                c.ranking || "Top Rated"
            );
        });
        insertCollege.finalize();
`;

if (regex.test(seedContent)) {
    seedContent = seedContent.replace(regex, newSqlLogic);
    console.log('Successfully updated SQL logic.');
} else {
    console.error('Could not find SQL block');
    // Fallback simple replace if regex fails due to newlines

}

fs.writeFileSync(patchedPath, seedContent);
console.log('Created seed_patched.js');
