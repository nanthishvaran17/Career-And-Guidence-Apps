const fs = require('fs');
const path = require('path');

const seedPath = path.resolve(__dirname, 'seed.js');
const patchedPath = path.resolve(__dirname, 'seed_internships.js');

let seedContent = fs.readFileSync(seedPath, 'utf8');

// 1. Update Internship Data with Links
const internshipStartMarker = 'const internships = [';
const newInternshipData = `
const internships = [
    { 
        title: "Web Development Intern", 
        company: "TechSolutions Inc", 
        type: "Remote", 
        stipend: "₹10,000 / month", 
        duration: "3 Months", 
        requirements: "HTML, CSS, JS, React",
        link: "https://example.com/apply/web-dev"
    },
    { 
        title: "Content Writing Intern", 
        company: "MediaBuzz", 
        type: "Remote", 
        stipend: "₹5,000 / month", 
        duration: "2 Months", 
        requirements: "English proficiency, SEO basics",
        link: "https://example.com/apply/content"
    },
    { 
        title: "Data Science Intern", 
        company: "Analytics Co", 
        type: "On-site (Bangalore)", 
        stipend: "₹25,000 / month", 
        duration: "6 Months", 
        requirements: "Python, SQL, ML",
        link: "https://example.com/apply/data-science"
    },
    { 
        title: "Digital Marketing Intern", 
        company: "GrowthHackers", 
        type: "Remote", 
        stipend: "₹8,000 / month", 
        duration: "3 Months", 
        requirements: "Social Media, Analytics",
        link: "https://example.com/apply/digital-marketing"
    },
     { 
        title: "Mobile App Dev Intern", 
        company: "AppWorks", 
        type: "Remote", 
        stipend: "₹12,000 / month", 
        duration: "3 Months", 
        requirements: "React Native / Flutter",
        link: "https://example.com/apply/app-dev"
    }
];
`;

// Replace the array
const arrayRegex = /const internships = \[.*?\];/s;
if (arrayRegex.test(seedContent)) {
    seedContent = seedContent.replace(arrayRegex, newInternshipData.trim());
    console.log("Updated Internship Data");
} else {
    console.log("Could not find Internship Data array");
}

// 2. Update SQL Insert Logic
const oldSql = 'const stmtIntern = db.prepare("INSERT INTO internships (title, company, type, stipend, duration, requirements) VALUES (?, ?, ?, ?, ?, ?)");';
const newSql = 'const stmtIntern = db.prepare("INSERT INTO internships (title, company, type, stipend, duration, requirements, link) VALUES (?, ?, ?, ?, ?, ?, ?)");';

if (seedContent.includes(oldSql)) {
    seedContent = seedContent.replace(oldSql, newSql);
    console.log("Updated SQL Prepare Statement");
} else {
    console.log("Could not find SQL Prepare Statement");
}

// Update the loop execution
const loopRegex = /stmtIntern\.run\(i\.title, i\.company, i\.type, i\.stipend, i\.duration, i\.requirements\);/;
const newLoop = 'stmtIntern.run(i.title, i.company, i.type, i.stipend, i.duration, i.requirements, i.link || "https://linkedin.com/jobs");';

if (loopRegex.test(seedContent)) {
    seedContent = seedContent.replace(loopRegex, newLoop);
    console.log("Updated SQL Execution Loop");
} else {
    console.log("Could not find SQL Loop");
}

fs.writeFileSync(patchedPath, seedContent);
console.log(`Created ${patchedPath}`);
