const db = require('./db');

const pythonSkill = {
    title: "Python Programming",
    category: "Programming",
    description: "Versatile language for Web, Data Science, and AI.",
    level: "Beginner to Advanced",
    roadmap: JSON.stringify([
        "Basics (Syntax, Loops)",
        "Data Structures (Lists, Dicts)",
        "OOP Concepts",
        "Libraries (NumPy, Pandas)",
        "Web Frameworks (Flask/Django)"
    ]),
    resources: JSON.stringify([
        "Official Docs (python.org)",
        "CodeWithHarry (YouTube)",
        "Real Python"
    ])
};

const insertSkill = db.prepare("INSERT INTO skills (title, category, description, level, roadmap, resources) VALUES (?, ?, ?, ?, ?, ?)");

db.serialize(() => {
    insertSkill.run(
        pythonSkill.title,
        pythonSkill.category,
        pythonSkill.description,
        pythonSkill.level,
        pythonSkill.roadmap,
        pythonSkill.resources,
        (err) => {
            if (err) {
                console.error("Error inserting Python skill:", err.message);
            } else {
                console.log("Successfully added Python Programming skill.");
            }
        }
    );
    insertSkill.finalize();
});
