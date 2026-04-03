const db = require('./db');

const allSkills = [
    {
        title: "Java Programming",
        category: "Programming",
        description: "Robust, object-oriented language used for enterprise applications and Android dev.",
        level: "Beginner to Advanced",
        roadmap: JSON.stringify(["Syntax & OOP", "Collections Framework", "Multithreading", "JDBC & Database", "Spring Boot Framework"]),
        resources: JSON.stringify(["Oracle Java Docs", "Telusko (YouTube)", "Java Brains"])
    },
    {
        title: "Full Stack Web Development",
        category: "Development",
        description: "Build complete web applications using frontend and backend technologies.",
        level: "Intermediate",
        roadmap: JSON.stringify(["HTML/CSS/JS", "React.js / Angular", "Node.js & Express", "MongoDB / SQL", "Deployment (Vercel/Netlify)"]),
        resources: JSON.stringify(["MDN Web Docs", "FreeCodeCamp", "The Odin Project"])
    },
    {
        title: "Data Science & ML",
        category: "Data Science",
        description: "Extract insights from data and build predictive models.",
        level: "Advanced",
        roadmap: JSON.stringify(["Python/R", "Statistics & Probability", "Data Visualization", "Scikit-Learn", "Deep Learning (TensorFlow/PyTorch)"]),
        resources: JSON.stringify(["Kaggle", "Coursera (Andrew Ng)", "Fast.ai"])
    },
    {
        title: "Cloud Computing (AWS)",
        category: "Cloud",
        description: "Learn to design and deploy scalable systems on the cloud.",
        level: "Intermediate",
        roadmap: JSON.stringify(["Cloud Basics", "EC2, S3, RDS", "IAM & Security", "Serverless (Lambda)", "AWS Certification"]),
        resources: JSON.stringify(["AWS Documentation", "A Cloud Guru", "Stephane Maarek (Udemy)"])
    },
    {
        title: "Cyber Security",
        category: "Security",
        description: "Protect systems and networks from digital attacks.",
        level: "Advanced",
        roadmap: JSON.stringify(["Networking Basics", "Linux & Scripting", "Ethical Hacking", "Vulnerability Assessment", "CISSP/CEH Certification"]),
        resources: JSON.stringify(["TryHackMe", "Hack The Box", "Professor Messer"])
    },
    {
        title: "UI/UX Design",
        category: "Design",
        description: "Design user-friendly and aesthetically pleasing interfaces.",
        level: "Beginner",
        roadmap: JSON.stringify(["Design Principles", "Typography & Color Theory", "Figma / Adobe XD", "Prototyping", "User Research"]),
        resources: JSON.stringify(["Figma Community", "Laws of UX", "Google UX Course"])
    }
];

const insertSkill = db.prepare("INSERT INTO skills (title, category, description, level, roadmap, resources) VALUES (?, ?, ?, ?, ?, ?)");

db.serialize(() => {
    allSkills.forEach(skill => {
        insertSkill.run(
            skill.title,
            skill.category,
            skill.description,
            skill.level,
            skill.roadmap,
            skill.resources,
            (err) => {
                if (err) {
                    console.error(`Error inserting ${skill.title}:`, err.message);
                } else {
                    console.log(`Successfully added ${skill.title}`);
                }
            }
        );
    });
    insertSkill.finalize();
});
