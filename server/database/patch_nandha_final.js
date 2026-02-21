const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = require('./db');

const nandha = {
    name: "Nandha Engineering College",
    location: "Erode, Tamil Nadu",
    district: "Erode",
    city: "Erode",
    field: "Engineering",
    type: "Private (Autonomous)",
    affiliated_university: "Anna University",
    approval_bodies: "AICTE, NBA",
    year_established: 2001,
    fees: "₹50k - ₹85k/year",
    accommodation: "Hostel & Day Scholar Available",
    hostel_available: 1,
    website: "https://nandhaengg.org/",
    details_link: "https://nandhaengg.org/",
    rating: 4.5,
    ranking: "NAAC 'A' Grade | NBA Accredited",
    accreditations: JSON.stringify(["NAAC 'A' Grade", "NBA Accredited", "AICTE Approved"]),
    departments: JSON.stringify(["CSE", "IT", "ECE", "Mech", "Civil", "AGRI", "BME", "CHEM"]),
    courses_offered: JSON.stringify([
        { name: "B.E. Computer Science", duration: "4 years", intake: 120 },
        { name: "B.E. Electronics & Communication", duration: "4 years", intake: 120 },
        { name: "B.E. Mechanical", duration: "4 years", intake: 60 },
        { name: "B.E. Civil", duration: "4 years", intake: 60 },
        { name: "B.Tech. Information Technology", duration: "4 years", intake: 60 },
        { name: "B.E. Agricultural Engineering", duration: "4 years", intake: 60 },
        { name: "B.E. Biomedical Engineering", duration: "4 years", intake: 30 },
        { name: "B.E. Chemical Engineering", duration: "4 years", intake: 30 }
    ]),
    placement_stats: JSON.stringify({
        average_package: "₹4.5 LPA",
        highest_package: "₹12 LPA",
        placement_percentage: "92%"
    }),
    reviews: JSON.stringify([
        { user: "Student", rating: 4.5, comment: "Excellent infrastructure and supportive faculty." },
        { user: "Alumni", rating: 4.0, comment: "Good placement support for circuit branches." }
    ]),
    infrastructure: JSON.stringify([
        "Smart Classrooms", "Central Library", "Computer Labs", "Physics Lab",
        "Chemistry Lab", "Sports Ground", "Hostel", "Canteen", "Wi-Fi Campus",
        "Seminar Hall", "Research Center", "Medical Center"
    ]),
    admission_mode: "TNEA Counselling / Management Quota",
    contact_info: JSON.stringify({ phone: "04294-220555", email: "info@nandhaengg.org" })
};

// Wait for DB to be ready
setTimeout(() => {
    db.get("SELECT id FROM colleges WHERE name = ?", [nandha.name], (err, row) => {
        if (err) { console.error("DB Error:", err); return; }

        if (row) {
            // Update existing
            db.run(`UPDATE colleges SET
        location=?, district=?, city=?, field=?, type=?, affiliated_university=?,
        approval_bodies=?, year_established=?, fees=?, accommodation=?, hostel_available=?,
        website=?, details_link=?, rating=?, ranking=?, accreditations=?,
        departments=?, courses_offered=?, placement_stats=?, reviews=?,
        infrastructure=?, admission_mode=?, contact_info=?
        WHERE name=?`,
                [
                    nandha.location, nandha.district, nandha.city, nandha.field, nandha.type,
                    nandha.affiliated_university, nandha.approval_bodies, nandha.year_established,
                    nandha.fees, nandha.accommodation, nandha.hostel_available,
                    nandha.website, nandha.details_link, nandha.rating, nandha.ranking,
                    nandha.accreditations, nandha.departments, nandha.courses_offered,
                    nandha.placement_stats, nandha.reviews, nandha.infrastructure,
                    nandha.admission_mode, nandha.contact_info,
                    nandha.name
                ],
                function (err) {
                    if (err) { console.error("Update Error:", err); return; }
                    console.log(`✅ Updated Nandha Engineering College (id: ${row.id})`);
                    verifyAndExit();
                }
            );
        } else {
            // Insert new
            db.run(`INSERT INTO colleges (
        name, location, district, city, field, type, affiliated_university,
        approval_bodies, year_established, fees, accommodation, hostel_available,
        website, details_link, rating, ranking, accreditations,
        departments, courses_offered, placement_stats, reviews,
        infrastructure, admission_mode, contact_info
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    nandha.name, nandha.location, nandha.district, nandha.city, nandha.field, nandha.type,
                    nandha.affiliated_university, nandha.approval_bodies, nandha.year_established,
                    nandha.fees, nandha.accommodation, nandha.hostel_available,
                    nandha.website, nandha.details_link, nandha.rating, nandha.ranking,
                    nandha.accreditations, nandha.departments, nandha.courses_offered,
                    nandha.placement_stats, nandha.reviews, nandha.infrastructure,
                    nandha.admission_mode, nandha.contact_info
                ],
                function (err) {
                    if (err) { console.error("Insert Error:", err); return; }
                    console.log(`✅ Inserted Nandha Engineering College (id: ${this.lastID})`);
                    verifyAndExit();
                }
            );
        }
    });
}, 1000);

function verifyAndExit() {
    db.get("SELECT id, name, rating, ranking, departments, placement_stats FROM colleges WHERE name = ?",
        ["Nandha Engineering College"],
        (err, row) => {
            if (row) {
                console.log("✅ Verification:", JSON.stringify(row, null, 2));
            }
            setTimeout(() => process.exit(0), 500);
        }
    );
}
