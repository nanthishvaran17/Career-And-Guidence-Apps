const seedData = (db) => {
    // EXPANDED DATASET

    const careers = [
        // --- STEM (Existing + New) ---
        {
            title: "Data Scientist",
            category: "STEM",
            description: "Analyze complex data to help organizations make better decisions. Involves machine learning and big data analytics.",
            salary_range: "₹8L - ₹25L",
            job_growth: "High (28%)",
            required_stream: JSON.stringify(["science", "engineering", "mathematics"]),
            required_skills: JSON.stringify(["Python", "Machine Learning", "SQL", "Statistics", "Data Visualization"]),
            roadmap: JSON.stringify(["Bachelor's in CS/Stats", "Master Python & SQL", "Learn ML Algorithms", "Build Projects on Kaggle", "Apply for Junior Data Roles"]),
            top_companies: JSON.stringify(["Google", "Microsoft", "Amazon", "Flipkart", "MuSigma"]),
            min_education: "undergraduate"
        },
        {
            title: "Full Stack Developer",
            category: "STEM",
            description: "Build both frontend and backend of web applications. You will work with databases, servers, and clients.",
            salary_range: "₹5L - ₹20L",
            job_growth: "High (22%)",
            required_stream: JSON.stringify(["science", "engineering", "commerce", "arts"]),
            required_skills: JSON.stringify(["JavaScript", "React", "Node.js", "MongoDB/SQL", "Git"]),
            roadmap: JSON.stringify(["Learn HTML/CSS/JS", "Master a Frontend Framework (React)", "Learn Backend (Node/Django)", "Full Stack Projects", "Build Portfolio"]),
            top_companies: JSON.stringify(["Startups", "MNCs", "TCS", "Infosys", "Remote Roles"]),
            min_education: "diploma"
        },
        {
            title: "Biotechnologist",
            category: "STEM",
            description: "Use living systems and organisms to develop or make products, especially in medicine and agriculture.",
            salary_range: "₹4L - ₹12L",
            job_growth: "Steady (8%)",
            required_stream: JSON.stringify(["science", "biology"]),
            required_skills: JSON.stringify(["Lab Techniques", "Genetics", "Data Analysis", "Research"]),
            roadmap: JSON.stringify(["12th Science (PCB)", "B.Sc/B.Tech Biotechnology", "M.Sc/M.Tech for R&D roles", "PhD for Scientist roles"]),
            top_companies: JSON.stringify(["Biocon", "Serum Institute", "Dr. Reddy's"]),
            min_education: "undergraduate"
        },

        // --- MEDICAL (Existing + New) ---
        {
            title: "Medical Doctor (MBBS)",
            category: "Healthcare",
            description: "Diagnose and treat illnesses. A highly respected and responsible profession.",
            salary_range: "₹10L - ₹50L+",
            job_growth: "Steady",
            required_stream: JSON.stringify(["biology", "medical"]),
            required_skills: JSON.stringify(["Empathy", "Diagnosis", "Patience", "Clinical Knowledge"]),
            roadmap: JSON.stringify(["12th Science (PCB)", "Clear NEET", "MBBS (5.5 yrs)", "Internship", "NEET PG for Specialization"]),
            top_companies: JSON.stringify(["Apollo", "AIIMS", "Fortis", "Govt Hospitals"]),
            min_education: "undergraduate"
        },
        {
            title: "Pharmacist",
            category: "Healthcare",
            description: "Dispense medications and advise patients on their use.",
            salary_range: "₹3L - ₹8L",
            job_growth: "Stable",
            required_stream: JSON.stringify(["science", "medical"]),
            required_skills: JSON.stringify(["Pharmacology", "Detail-oriented", "Communication"]),
            roadmap: JSON.stringify(["12th Science (PCB/PCM)", "B.Pharm or D.Pharm", "Register with Pharmacy Council", "Open Store or Join Hospital"]),
            top_companies: JSON.stringify(["Cipla", "Sun Pharma", "Apollo Pharmacy"]),
            min_education: "undergraduate"
        },

        // --- COMMERCE & BUSINESS (New) ---
        {
            title: "Chartered Accountant",
            category: "Business",
            description: "Manage financial accounts, auditing, taxation, and financial strategy.",
            salary_range: "₹7L - ₹30L",
            job_growth: "High",
            required_stream: JSON.stringify(["commerce"]),
            required_skills: JSON.stringify(["Accounting", "Taxation", "Law", "Audit", "Finance"]),
            roadmap: JSON.stringify(["12th Commerce", "Register for CA Foundation", "Clear Intermediate Groups", "3 Years Articleship", "Clear CA Final"]),
            top_companies: JSON.stringify(["Deloitte", "KPMG", "EY", "PwC"]),
            min_education: "12th"
        },
        {
            title: "Investment Banker",
            category: "Business",
            description: "Help companies raise capital and provide financial consultancy for mergers and acquisitions.",
            salary_range: "₹12L - ₹50L+",
            job_growth: "High",
            required_stream: JSON.stringify(["commerce", "mathematics"]),
            required_skills: JSON.stringify(["Financial Modeling", "Valuation", "Excel", "Analysis"]),
            roadmap: JSON.stringify(["B.Com/BBA/B.Tech", "MBA in Finance from Top B-School", "CFA Certification (Bonus)", "Internship in Finance"]),
            top_companies: JSON.stringify(["Goldman Sachs", "JP Morgan", "Morgan Stanley"]),
            min_education: "postgraduate"
        },
        {
            title: "Digital Marketing Specialist",
            category: "Business",
            description: "Promote brands using digital channels like social media, SEO, email, and ads.",
            salary_range: "₹3L - ₹12L",
            job_growth: "Explosive",
            required_stream: JSON.stringify(["any"]),
            required_skills: JSON.stringify(["SEO", "Content Marketing", "Analytics", "Social Media"]),
            roadmap: JSON.stringify(["Any Graduate", "Learn Digital Marketing Tools (Google Ads, Curtis)", "Certifications (HubSpot/Google)", "Freelance/Internship"]),
            top_companies: JSON.stringify(["Agencies", "Startups", "E-commerce Companies"]),
            min_education: "diploma"
        },

        // --- ARTS & DESIGN (New) ---
        {
            title: "UX/UI Designer",
            category: "Design",
            description: "Design user-friendly interfaces for digital products like apps and websites.",
            salary_range: "₹6L - ₹20L",
            job_growth: "High",
            required_stream: JSON.stringify(["any", "design"]),
            required_skills: JSON.stringify(["Figma", "User Research", "Wireframing", "Prototyping"]),
            roadmap: JSON.stringify(["Any Graduate", "Learn Design Principles", "Master Figma/Adobe XD", "Build Design Portfolio", "Internship"]),
            top_companies: JSON.stringify(["Tech Companies", "Design Studios", "Startups"]),
            min_education: "diploma"
        },
        {
            title: "Graphic Designer",
            category: "Design",
            description: "Create visual concepts to communicate ideas that inspire, inform, or captivate consumers.",
            salary_range: "₹3L - ₹10L",
            job_growth: "Stable",
            required_stream: JSON.stringify(["arts", "any"]),
            required_skills: JSON.stringify(["Photoshop", "Illustrator", "Creativity", "Typography"]),
            roadmap: JSON.stringify(["12th Any Stream", "B.Des or Certification", "Build Portfolio", "Freelance/Agency Work"]),
            top_companies: JSON.stringify(["Advertising Agencies", "Media Houses", "Freelance"]),
            min_education: "12th"
        },
        {
            title: "Journalist / News Anchor",
            category: "Media",
            description: "Research, write, and report news stories for print, broadcast, or digital media.",
            salary_range: "₹3L - ₹15L",
            job_growth: "Moderate",
            required_stream: JSON.stringify(["arts", "humanities"]),
            required_skills: JSON.stringify(["Communication", "Writing", "Research", "Public Speaking"]),
            roadmap: JSON.stringify(["12th Arts", "BJMC (Bachelor of Journalism)", "Internship in Media House", "Field Reporting"]),
            top_companies: JSON.stringify(["NDTV", "Times of India", "Indian Express", "BBC"]),
            min_education: "undergraduate"
        },

        // --- LEGAL (New) ---
        {
            title: "Corporate Lawyer",
            category: "Legal",
            description: "Specialize in corporation law, helping companies with legal obligations and transactions.",
            salary_range: "₹6L - ₹25L",
            job_growth: "High",
            required_stream: JSON.stringify(["humanities", "commerce"]),
            required_skills: JSON.stringify(["Drafting", "Corporate Law", "Negotiation", "Research"]),
            roadmap: JSON.stringify(["12th Any Stream", "CLAT Exam", "5-Year BA LLB", "Internships in Law Firms", "Bar Council Registration"]),
            top_companies: JSON.stringify(["Khaitan & Co", "Shardul Amarchand Mangaldas", "AZB & Partners"]),
            min_education: "undergraduate"
        },

        // --- GOVERNMENT & DEFENSE (New) ---
        {
            title: "Civil Services (IAS/IPS)",
            category: "Government",
            description: "Serve the nation in top administrative/police roles via the toughest competitive exam.",
            salary_range: "₹56k - ₹2.5L / month + perks",
            job_growth: "Stable",
            required_stream: JSON.stringify(["any"]),
            required_skills: JSON.stringify(["General Awareness", "Decision Making", "Leadership", "Ethics"]),
            roadmap: JSON.stringify(["Graduate in any stream", "Prepare for UPSC CSE (Prelims + Mains)", "Personality Test (Interview)"]),
            top_companies: JSON.stringify(["Government of India"]),
            min_education: "undergraduate"
        },
        {
            title: "Army Officer (NDA)",
            category: "Defense",
            description: "Join the Indian Armed Forces as an officer right after school.",
            salary_range: "₹56k - ₹2L / month",
            job_growth: "Stable",
            required_stream: JSON.stringify(["science", "any"]), // Air Force/Navy need Physics/Maths
            required_skills: JSON.stringify(["Physical Fitness", "Leadership", "Discipline"]),
            roadmap: JSON.stringify(["12th Appearing/Passed", "Clear NDA Exam (UPSC)", "SSB Interview", "3-Year Training at NDA"]),
            top_companies: JSON.stringify(["Indian Army", "Indian Navy", "Indian Air Force"]),
            min_education: "12th"
        },
        // --- BCA / Computer Applications (New) ---
        {
            title: "System Administrator",
            category: "Technology",
            description: "Install, upgrade, and monitor software and hardware. maintain operating systems.",
            salary_range: "₹3L - ₹8L",
            job_growth: "Steady",
            required_stream: JSON.stringify(["science", "computer applications"]),
            required_skills: JSON.stringify(["Linux", "Networking", "Scripting", "Cloud"]),
            roadmap: JSON.stringify(["12th Science/Commerce", "BCA or B.Sc CS", "Certifications (Red Hat, Cisco)", "Junior System Admin"]),
            top_companies: JSON.stringify(["TCS", "Wipro", "HCL", "Tech Mahindra"]),
            min_education: "undergraduate"
        },
        {
            title: "Network Engineer",
            category: "Technology",
            description: "Design and implement computer networks (LAN, WAN, Internet, Intranet).",
            salary_range: "₹4L - ₹10L",
            job_growth: "High",
            required_stream: JSON.stringify(["science", "computer applications"]),
            required_skills: JSON.stringify(["Networking", "Cisco Packet Tracer", "Firewalls", "Security"]),
            roadmap: JSON.stringify(["BCA/B.Tech", "CCNA Certification", "CCNP Certification", "Network Engineer Role"]),
            top_companies: JSON.stringify(["Cisco", "Juniper", "Airtel", "Jio"]),
            min_education: "undergraduate"
        },

        // --- B.Sc / Science (New) ---
        {
            title: "Lab Technician",
            category: "Healthcare",
            description: "Perform medical tests in hospitals and clinics to help doctors diagnose diseases.",
            salary_range: "₹2.5L - ₹6L",
            job_growth: "Stable",
            required_stream: JSON.stringify(["science", "medical"]),
            required_skills: JSON.stringify(["Pathology", "Microbiology", "Attention to Detail"]),
            roadmap: JSON.stringify(["12th Science", "DMLT or B.Sc MLT", "Internship in Lab", "Govt/Private Lab Job"]),
            top_companies: JSON.stringify(["Dr Lal PathLabs", "Metropolis", "Hospitals"]),
            min_education: "diploma"
        },
        {
            title: "Research Assistant",
            category: "Science",
            description: "Assist scientists in experiments, data collection, and analysis.",
            salary_range: "₹3L - ₹7L",
            job_growth: "Moderate",
            required_stream: JSON.stringify(["science"]),
            required_skills: JSON.stringify(["Research", "Data Analysis", "Lab Safety", "Reporting"]),
            roadmap: JSON.stringify(["B.Sc in Subject", "M.Sc (Preferred)", "Join Research Project", "PhD (for growth)"]),
            top_companies: JSON.stringify(["CSIR Labs", "Universities", "Pharma R&D"]),
            min_education: "undergraduate"
        },

        // --- Arts / Humanities (New) ---
        {
            title: "Content Writer",
            category: "Media",
            description: "Write engaging content for websites, blogs, articles, and marketing materials.",
            salary_range: "₹2.5L - ₹8L",
            job_growth: "High",
            required_stream: JSON.stringify(["arts", "any"]),
            required_skills: JSON.stringify(["Writing", "Editing", "SEO", "Research"]),
            roadmap: JSON.stringify(["Any Graduate (BA English helps)", "Start a Blog", "Freelance Projects", "Join Agency/Company"]),
            top_companies: JSON.stringify(["Media Houses", "Tech Companies", "Ad Agencies", "Freelance"]),
            min_education: "undergraduate"
        },
        {
            title: "Psychologist",
            category: "Healthcare",
            description: "Study human mind and behavior to help people overcome mental challenges.",
            salary_range: "₹4L - ₹12L",
            job_growth: "High",
            required_stream: JSON.stringify(["arts", "science"]),
            required_skills: JSON.stringify(["Empathy", "Listening", "Analysis", "Patience"]),
            roadmap: JSON.stringify(["12th Any Stream", "BA/B.Sc Psychology", "MA/M.Sc Psychology", "M.Phil/PhD (for Clinical)", "License"]),
            top_companies: JSON.stringify(["Hospitals", "NGOs", "Corporate Wellness", "Private Practice"]),
            min_education: "postgraduate"
        }
    ];

    const colleges = [
        // --- ENGINEERING (Top Institutes & Govt Colleges) ---
        { name: "IIT Madras", location: "Chennai, Tamil Nadu", field: "Engineering (CSE, IT, ECE, Mech, Civil)", fees: "₹2.2L/year", rating: 4.9, type: "Government", website: "https://www.iitm.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.iitm.ac.in/academics" },
        { name: "IIT Bombay", location: "Mumbai", field: "Engineering (CSE, IT, ECE, Mech)", fees: "₹2.3L/year", rating: 4.9, type: "Government", website: "https://www.iitb.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.iitb.ac.in/en/education/academic-programmes" },
        { name: "IIT Delhi", location: "Delhi", field: "Engineering (CSE, IT, ECE, Mech)", fees: "₹2.2L/year", rating: 4.9, type: "Government", website: "https://home.iitd.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://home.iitd.ac.in/" },
        { name: "NIT Trichy", location: "Trichy, Tamil Nadu", field: "Engineering (CSE, IT, ECE, Mech)", fees: "₹1.5L/year", rating: 4.8, type: "Government", website: "https://www.nitt.edu/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.nitt.edu/home/academics/" },
        { name: "Anna University (CEG)", location: "Chennai, Tamil Nadu", field: "Engineering (CSE, IT, ECE, Mech, Civil)", fees: "₹50k/year", rating: 4.8, type: "Government", website: "https://www.annauniv.edu/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.annauniv.edu/" },
        { name: "Madras Institute of Technology (MIT)", location: "Chennai, Tamil Nadu", field: "Engineering (Aero, Auto, CSE, IT, ECE)", fees: "₹50k/year", rating: 4.7, type: "Government", website: "https://www.mitindia.edu/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.mitindia.edu/" },
        { name: "PSG College of Technology", location: "Coimbatore, Tamil Nadu", field: "Engineering (CSE, IT, Mech, EEE, Civil)", fees: "₹80k/year", rating: 4.7, type: "Private", website: "https://www.psgtech.edu/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.psgtech.edu/" },
        { name: "Thiagarajar College of Engineering", location: "Madurai, Tamil Nadu", field: "Engineering", fees: "₹60k/year", rating: 4.6, type: "Private", website: "https://www.tce.edu/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.tce.edu/" },
        { name: "Coimbatore Institute of Technology", location: "Coimbatore, Tamil Nadu", field: "Engineering", fees: "₹60k/year", rating: 4.6, type: "Government", website: "https://www.cit.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.cit.edu.in/" },
        { name: "Government College of Technology", location: "Coimbatore, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.5, type: "Government", website: "https://gct.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://gct.ac.in/" },
        { name: "Government College of Engineering", location: "Salem, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.4, type: "Government", website: "https://gcesalem.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://gcesalem.edu.in/" },
        { name: "Government College of Engineering", location: "Tirunelveli, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.4, type: "Government", website: "https://www.gcetly.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.gcetly.ac.in/" },
        { name: "Alagappa Chettiar Govt College of Engg", location: "Karaikudi, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.4, type: "Government", website: "https://accet.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://accet.edu.in/" },
        { name: "Thanthai Periyar Govt Institute of Tech", location: "Vellore, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.3, type: "Government", website: "https://tpgit.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://tpgit.edu.in/" },
        { name: "Government College of Engineering", location: "Bargur, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.2, type: "Government", website: "https://www.gcebargur.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.gcebargur.ac.in/" },
        { name: "Government College of Engineering", location: "Thanjavur, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.3, type: "Government", website: "https://gcetj.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://gcetj.edu.in/" },
        { name: "Government College of Engineering", location: "Dharmapuri, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.2, type: "Government", website: "https://gcedpi.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://gcedpi.edu.in/" },
        { name: "Government College of Engineering", location: "Erode, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.2, type: "Government", website: "https://www.gceerode.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.gceerode.ac.in/" },
        { name: "Government College of Engineering", location: "Bodinayakkanur, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.1, type: "Government", website: "http://www.gcebodi.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "http://www.gcebodi.ac.in/" },
        { name: "University College of Engineering", location: "Villupuram, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.0, type: "Government", website: "https://ucev.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://ucev.in/" },
        { name: "University College of Engineering", location: "Tindivanam, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.0, type: "Government", website: "http://www.ucet.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "http://www.ucet.in/" },
        { name: "University College of Engineering", location: "Arni, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.0, type: "Government", website: "https://www.auceq.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://www.auceq.edu.in/" },
        { name: "University College of Engineering", location: "Kanchipuram, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.1, type: "Government", website: "https://aucek.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://aucek.in/" },
        { name: "University College of Engineering", location: "Trichy, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.2, type: "Government", website: "http://www.aubit.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "http://www.aubit.edu.in/" },
        { name: "University College of Engineering", location: "Dindigul, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.0, type: "Government", website: "http://www.ucedindigul.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "http://www.ucedindigul.ac.in/" },
        { name: "University College of Engineering", location: "Nagercoil, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.1, type: "Government", website: "http://www.ucen.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "http://www.ucen.ac.in/" },
        { name: "University College of Engineering", location: "Ramanathapuram, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 4.0, type: "Government", website: "http://www.aucramnad.ac.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "http://www.aucramnad.ac.in/" },
        { name: "University College of Engineering", location: "Thirukkuvalai, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 3.9, type: "Government", website: "http://www.aucce.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "http://www.aucce.in/" },
        { name: "University College of Engineering", location: "Pattukkottai, Tamil Nadu", field: "Engineering", fees: "₹40k/year", rating: 3.9, type: "Government", website: "https://ucep.edu.in/", accommodation: "Hostel Limited / Day Scholar", details_link: "https://ucep.edu.in/" },
        { name: "SSN College of Engineering", location: "Chennai, Tamil Nadu", field: "Engineering", fees: "₹2.5L/year", rating: 4.6, type: "Private", website: "https://www.ssn.edu.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.ssn.edu.in/" },
        { name: "Sastra University", location: "Thanjavur, Tamil Nadu", field: "Engineering", fees: "₹1.5L/year", rating: 4.7, type: "Private", website: "https://www.sastra.edu/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.sastra.edu/" },
        { name: "VIT University", location: "Vellore, Tamil Nadu", field: "Engineering", fees: "₹3L/year", rating: 4.7, type: "Private", website: "https://vit.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://vit.ac.in/" },
        { name: "SRM Institute of Science and Tech", location: "Chennai, Tamil Nadu", field: "Engineering", fees: "₹3.5L/year", rating: 4.5, type: "Private", website: "https://www.srmist.edu.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.srmist.edu.in/" },
        { name: "Amrita Vishwa Vidyapeetham", location: "Coimbatore, Tamil Nadu", field: "Engineering", fees: "₹2.5L/year", rating: 4.6, type: "Private", website: "https://www.amrita.edu/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.amrita.edu/" },
        { name: "Kumaraguru College of Technology", location: "Coimbatore, Tamil Nadu", field: "Engineering", fees: "₹1.5L/year", rating: 4.5, type: "Private", website: "https://www.kct.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.kct.ac.in/" },
        { name: "Sri Krishna College of Engg", location: "Coimbatore, Tamil Nadu", field: "Engineering", fees: "₹1.5L/year", rating: 4.4, type: "Private", website: "https://www.skcet.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.skcet.ac.in/" },
        { name: "Kongu Engineering College", location: "Erode", field: "Engineering", fees: "₹1.2L/year", rating: 4.3, type: "Private", website: "https://www.kongu.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.kongu.ac.in/" },
        { name: "Bannari Amman Institute of Tech", location: "Sathyamangalam", field: "Engineering", fees: "₹1.2L/year", rating: 4.4, type: "Private", website: "https://www.bitsathy.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.bitsathy.ac.in/" },
        { name: "Mepco Schlenk Engineering College", location: "Sivakasi", field: "Engineering", fees: "₹1L/year", rating: 4.4, type: "Private", website: "https://www.mepcoeng.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.mepcoeng.ac.in/" },
        { name: "Sona College of Technology", location: "Salem", field: "Engineering", fees: "₹1L/year", rating: 4.3, type: "Private", website: "https://www.sonatech.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.sonatech.ac.in/" },
        { name: "RMK Engineering College", location: "Chennai", field: "Engineering", fees: "₹1.5L/year", rating: 4.2, type: "Private", website: "https://www.rmkec.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.rmkec.ac.in/" },
        { name: "Rajalakshmi Engineering College", location: "Chennai", field: "Engineering", fees: "₹1.5L/year", rating: 4.3, type: "Private", website: "https://www.rajalakshmi.org/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.rajalakshmi.org/" },
        { name: "Easwari Engineering College", location: "Chennai", field: "Engineering", fees: "₹1.2L/year", rating: 4.2, type: "Private", website: "https://www.easwari.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.easwari.ac.in/" },
        { name: "Loyola-ICAM College of Engg", location: "Chennai", field: "Engineering", fees: "₹1.5L/year", rating: 4.4, type: "Private", website: "https://www.licet.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.licet.ac.in/" },
        { name: "St. Joseph's College of Engg", location: "Chennai", field: "Engineering", fees: "₹1.2L/year", rating: 4.2, type: "Private", website: "https://stjosephs.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://stjosephs.ac.in/" },
        { name: "Panimalar Engineering College", location: "Chennai", field: "Engineering", fees: "₹1.2L/year", rating: 4.1, type: "Private", website: "https://www.panimalar.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.panimalar.ac.in/" },
        { name: "Vel Tech University", location: "Chennai", field: "Engineering", fees: "₹2L/year", rating: 4.1, type: "Private", website: "https://www.veltech.edu.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://www.veltech.edu.in/" },
        { name: "Hindustan Institute of Tech", location: "Chennai", field: "Engineering", fees: "₹2L/year", rating: 4.0, type: "Private", website: "https://hindustanuniv.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://hindustanuniv.ac.in/" },
        { name: "BS Abdur Rahman Crescent", location: "Chennai", field: "Engineering", fees: "₹2L/year", rating: 4.2, type: "Private", website: "https://crescent.education/", accommodation: "Hostel & Day Scholar Available", details_link: "https://crescent.education/" },
        { name: "Kalasalingam University", location: "Virudhunagar", field: "Engineering", fees: "₹1.2L/year", rating: 4.1, type: "Private", website: "https://kalsalingam.ac.in/", accommodation: "Hostel & Day Scholar Available", details_link: "https://kalsalingam.ac.in/" },

        // --- MEDICAL (Govt & Top Private) ---
        { name: "AIIMS Delhi", location: "Delhi", field: "Medical", fees: "₹2k/year", rating: 5.0, type: "Government" },
        { name: "Madras Medical College (MMC)", location: "Chennai, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.9, type: "Government" },
        { name: "Stanley Medical College", location: "Chennai, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.8, type: "Government" },
        { name: "Kilpauk Medical College", location: "Chennai, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.7, type: "Government" },
        { name: "Christian Medical College (CMC)", location: "Vellore, Tamil Nadu", field: "Medical", fees: "₹50k/year", rating: 4.9, type: "Private" },
        { name: "Madurai Medical College", location: "Madurai, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.7, type: "Government" },
        { name: "Thanjavur Medical College", location: "Thanjavur, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.7, type: "Government" },
        { name: "Coimbatore Medical College", location: "Coimbatore, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.7, type: "Government" },
        { name: "Tirunelveli Medical College", location: "Tirunelveli, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.6, type: "Government" },
        { name: "Chengalpattu Medical College", location: "Chengalpattu, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.6, type: "Government" },
        { name: "Govt Mohan Kumaramangalam MC", location: "Salem, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.5, type: "Government" },
        { name: "KAP Viswanatham Govt MC", location: "Trichy, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.6, type: "Government" },
        { name: "Thoothukudi Medical College", location: "Tuticorin, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.5, type: "Government" },
        { name: "Kanyakumari Govt Medical College", location: "Kanyakumari, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.5, type: "Government" },
        { name: "Vellore Govt Medical College", location: "Vellore, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.6, type: "Government" },
        { name: "Theni Govt Medical College", location: "Theni, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.4, type: "Government" },
        { name: "Dharmapuri Govt Medical College", location: "Dharmapuri, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.4, type: "Government" },
        { name: "Villupuram Govt Medical College", location: "Villupuram, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.4, type: "Government" },
        { name: "Tiruvannamalai Govt Medical College", location: "Tiruvannamalai, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.3, type: "Government" },
        { name: "Thiruvarur Govt Medical College", location: "Thiruvarur, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.3, type: "Government" },
        { name: "Sivagangai Govt Medical College", location: "Sivaganga, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.3, type: "Government" },
        { name: "Govt Erode Medical College", location: "Erode, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.4, type: "Government" },
        { name: "Govt Pudukkottai Medical College", location: "Pudukkottai, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.3, type: "Government" },
        { name: "Govt Karur Medical College", location: "Karur, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.2, type: "Government" },
        { name: "Govt Tiruppur Medical College", location: "Tiruppur, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.2, type: "Government" },
        { name: "Govt Namakkal Medical College", location: "Namakkal, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.1, type: "Government" },
        { name: "Govt Nilgiris Medical College", location: "Ooty, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.1, type: "Government" },
        { name: "Govt Ramanathapuram Medical College", location: "Ramanathapuram, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.1, type: "Government" },
        { name: "Govt Dindigul Medical College", location: "Dindigul, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.1, type: "Government" },
        { name: "Govt Virudhunagar Medical College", location: "Virudhunagar, Tamil Nadu", field: "Medical", fees: "₹13.6k/year", rating: 4.1, type: "Government" },
        { name: "ESIC Medical College", location: "Chennai, Tamil Nadu", field: "Medical", fees: "₹1L/year", rating: 4.5, type: "Government" },
        { name: "Sri Ramachandra Medical College", location: "Chennai, Tamil Nadu", field: "Medical", fees: "₹25L/year", rating: 4.7, type: "Private" },
        { name: "SRM Medical College", location: "Chennai, Tamil Nadu", field: "Medical", fees: "₹22L/year", rating: 4.5, type: "Private" },
        { name: "PSG Institute of Medical Sciences", location: "Coimbatore, Tamil Nadu", field: "Medical", fees: "₹18L/year", rating: 4.6, type: "Private" },
        { name: "KMCH Institute of Health Services", location: "Coimbatore, Tamil Nadu", field: "Medical", fees: "₹18L/year", rating: 4.5, type: "Private" },
        { name: "Chettinad Hospital & Research Institute", location: "Kanchipuram, Tamil Nadu", field: "Medical", fees: "₹20L/year", rating: 4.4, type: "Private" },
        { name: "Saveetha Medical College", location: "Chennai, Tamil Nadu", field: "Medical", fees: "₹22L/year", rating: 4.4, type: "Private" },

        // --- ARTS & SCIENCE (Govt) - Adding ALL major districts ---
        { name: "Presidency College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.7, type: "Government" },
        { name: "Queen Mary's College (Women)", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.6, type: "Government" },
        { name: "Loyola College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹30k/year", rating: 4.8, type: "Private" },
        { name: "Madras Christian College (MCC)", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹40k/year", rating: 4.7, type: "Private" },
        { name: "Stella Maris College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹40k/year", rating: 4.6, type: "Private" },
        { name: "Ethiraj College for Women", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹40k/year", rating: 4.6, type: "Private" },
        { name: "DG Vaishnav College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹30k/year", rating: 4.5, type: "Private" },
        { name: "Women's Christian College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹40k/year", rating: 4.7, type: "Private" },
        { name: "Guru Nanak College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },
        { name: "Government Arts College", location: "Coimbatore, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.5, type: "Government" },
        { name: "PSG College of Arts & Science", location: "Coimbatore, Tamil Nadu", field: "Arts & Science", fees: "₹40k/year", rating: 4.6, type: "Private" },
        { name: "Government Arts College", location: "Salem, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.4, type: "Government" },
        { name: "Periyar University", location: "Salem, Tamil Nadu", field: "Arts & Science", fees: "₹10k/year", rating: 4.1, type: "Government" },
        { name: "Government Arts College", location: "Trichy, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.4, type: "Government" },
        { name: "St. Joseph's College", location: "Trichy, Tamil Nadu", field: "Arts & Science", fees: "₹30k/year", rating: 4.5, type: "Private" },
        { name: "Bishop Heber College", location: "Trichy, Tamil Nadu", field: "Arts & Science", fees: "₹35k/year", rating: 4.5, type: "Private" },
        { name: "Jamal Mohamed College", location: "Trichy, Tamil Nadu", field: "Arts & Science", fees: "₹25k/year", rating: 4.4, type: "Private" },
        { name: "Holy Cross College", location: "Trichy, Tamil Nadu", field: "Arts & Science", fees: "₹25k/year", rating: 4.4, type: "Private" },
        { name: "Government Arts College", location: "Kumbakonam, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.5, type: "Government" },
        { name: "Government Arts College", location: "Thanjavur, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.4, type: "Government" },
        { name: "Rajah Serfoji Govt College", location: "Thanjavur, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.3, type: "Government" },
        { name: "Sethupathy Govt Arts College", location: "Ramanathapuram, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "Rani Anna Govt College (Women)", location: "Tirunelveli, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.3, type: "Government" },
        { name: "St. Xavier's College", location: "Tirunelveli, Tamil Nadu", field: "Arts & Science", fees: "₹25k/year", rating: 4.4, type: "Private" },
        { name: "M.D.T. Hindu College", location: "Tirunelveli, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.2, type: "Private" },
        { name: "Government Arts College (Men)", location: "Nandanam, Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Bharati Women's College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.3, type: "Government" },
        { name: "Quaid-E-Millath Govt College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Ambedkar Govt Arts College", location: "Vyasarpadi, Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "Government Arts College", location: "Tiruvannamalai, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Arignar Anna Govt Arts College", location: "Villupuram, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "Thiru A. Govindasamy Govt Arts College", location: "Tindivanam, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.0, type: "Government" },
        { name: "Periyar Arts College", location: "Cuddalore, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Government Arts College", location: "Chidambaram, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "Government Arts College", location: "Karur, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.3, type: "Government" },
        { name: "Government Arts College", location: "Ariyalur, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.0, type: "Government" },
        { name: "Government Arts College", location: "Perambalur, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.0, type: "Government" },
        { name: "Government Arts College", location: "Dharmapuri, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Government Arts College", location: "Krishnagiri, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "Chikkanna Govt Arts College", location: "Tiruppur, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "LRG Government Arts College (Women)", location: "Tiruppur, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Government Arts College", location: "Udumalpet, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "Government Arts College", location: "Ooty, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Muthurangam Govt Arts College", location: "Vellore, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Arignar Anna Govt Arts College", location: "Cheyyar, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.0, type: "Government" },
        { name: "Loganatha Narayanasamy Govt College", location: "Ponneri, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.0, type: "Government" },
        { name: "Sri Subramaniya Swamy Govt Arts College", location: "Tiruttani, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.0, type: "Government" },
        { name: "Rajeswari Vedachalam Govt Arts College", location: "Chengalpattu, Tamil Nadu", field: "Arts & Science", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "Pachaiyappa's College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹5k/year", rating: 4.1, type: "Private" },
        { name: "New College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹10k/year", rating: 4.2, type: "Private" },
        { name: "Ayya Nadar Janaki Ammal College", location: "Sivakasi, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },
        { name: "Vivekananda College", location: "Madurai, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },
        { name: "Madura College", location: "Madurai, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.2, type: "Private" },
        { name: "Fatima College", location: "Madurai, Tamil Nadu", field: "Arts & Science", fees: "₹25k/year", rating: 4.4, type: "Private" },
        { name: "Lady Doak College", location: "Madurai, Tamil Nadu", field: "Arts & Science", fees: "₹30k/year", rating: 4.5, type: "Private" },
        { name: "American College", location: "Madurai, Tamil Nadu", field: "Arts & Science", fees: "₹30k/year", rating: 4.5, type: "Private" },
        { name: "Thiagarajar College", location: "Madurai, Tamil Nadu", field: "Arts & Science", fees: "₹25k/year", rating: 4.5, type: "Private" },
        { name: "Scott Christian College", location: "Nagercoil, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },
        { name: "ST Hindu College", location: "Nagercoil, Tamil Nadu", field: "Arts & Science", fees: "₹15k/year", rating: 4.2, type: "Private" },
        { name: "Women's Christian College", location: "Nagercoil, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.2, type: "Private" },
        { name: "Sarah Tucker College", location: "Tirunelveli, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },
        { name: "Sadakathullah Appa College", location: "Tirunelveli, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },
        { name: "V.O. Chidambaram College", location: "Tuticorin, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.2, type: "Private" },
        { name: "St. Mary's College", location: "Tuticorin, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },
        { name: "Kamaraj College", location: "Tuticorin, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.2, type: "Private" },
        { name: "Virudhunagar Hindu Nadars' Senthikumara Nadar College", location: "Virudhunagar, Tamil Nadu", field: "Arts & Science", fees: "₹20k/year", rating: 4.3, type: "Private" },

        // --- AGRICULTURE (Govt - TNAU) ---
        { name: "Agricultural College & Research Institute", location: "Coimbatore, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.9, type: "Government" },
        { name: "Agricultural College & Research Institute", location: "Madurai, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.8, type: "Government" },
        { name: "Agricultural College & Research Institute", location: "Killikulam, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.6, type: "Government" },
        { name: "Anbil Dharmalingam Agri College", location: "Trichy, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.7, type: "Government" },
        { name: "Agricultural College & Research Institute", location: "Tiruvannamalai, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.5, type: "Government" },
        { name: "Horticultural College & Research Institute", location: "Periyakulam, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.6, type: "Government" },
        { name: "Horticultural College & Govt Arts (Women)", location: "Trichy, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.6, type: "Government" },
        { name: "Forest College & Research Institute", location: "Mettupalayam, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.7, type: "Government" },
        { name: "Agricultural College & Research Institute", location: "Kudumiyanmalai, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.4, type: "Government" },
        { name: "Agricultural College & Research Institute", location: "Thanjavur, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.5, type: "Government" },
        { name: "Agricultural College", location: "Karur, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.3, type: "Government" },
        { name: "Agricultural College", location: "Nagapattinam, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.3, type: "Government" },
        { name: "Agricultural College", location: "Chettinad, Tamil Nadu", field: "Agriculture", fees: "₹40k/year", rating: 4.3, type: "Government" },
        { name: "Vanavarayar Institute of Agriculture", location: "Pollachi, Tamil Nadu", field: "Agriculture", fees: "₹80k/year", rating: 4.2, type: "Private" },
        { name: "Kumaraguru Institute of Agriculture", location: "Erode, Tamil Nadu", field: "Agriculture", fees: "₹80k/year", rating: 4.3, type: "Private" },
        { name: "Imayam Institute of Agriculture", location: "Trichy, Tamil Nadu", field: "Agriculture", fees: "₹70k/year", rating: 4.0, type: "Private" },

        // --- LAW (Govt) ---
        { name: "Dr. Ambedkar Govt Law College", location: "Chennai, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.6, type: "Government" },
        { name: "Govt Law College", location: "Madurai, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.5, type: "Government" },
        { name: "Govt Law College", location: "Trichy, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.5, type: "Government" },
        { name: "Govt Law College", location: "Coimbatore, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.5, type: "Government" },
        { name: "Govt Law College", location: "Tirunelveli, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.4, type: "Government" },
        { name: "Govt Law College", location: "Chengalpattu, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.3, type: "Government" },
        { name: "Govt Law College", location: "Vellore, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.3, type: "Government" },
        { name: "Govt Law College", location: "Dharmapuri, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Govt Law College", location: "Ramanathapuram, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Govt Law College", location: "Viluppuram, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Govt Law College", location: "Salem, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.2, type: "Government" },
        { name: "Govt Law College", location: "Namakkal, Tamil Nadu", field: "Law", fees: "₹2k/year", rating: 4.1, type: "Government" },
        { name: "School of Excellence in Law (SOEL)", location: "Chennai, Tamil Nadu", field: "Law", fees: "₹40k/year", rating: 4.7, type: "Government" },
        // --- NEW COLLEGES ADDED ---
        { name: "Saveetha Law College", location: "Chennai, Tamil Nadu", field: "Law", fees: "₹2L/year", rating: 4.4, type: "Private" },
        { name: "VIT School of Law", location: "Chennai, Tamil Nadu", field: "Law", fees: "₹1.5L/year", rating: 4.5, type: "Private" },
        { name: "SASTRA School of Law", location: "Thanjavur, Tamil Nadu", field: "Law", fees: "₹1.2L/year", rating: 4.6, type: "Private" },
        { name: "Bharat Law College", location: "Chennai, Tamil Nadu", field: "Law", fees: "₹1L/year", rating: 4.0, type: "Private" },
        { name: " SRM School of Law", location: "Chennai, Tamil Nadu", field: "Law", fees: "₹2L/year", rating: 4.3, type: "Private" },
        { name: "Hindustan College of Arts & Science", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹50k/year", rating: 4.2, type: "Private" },
        { name: "Mohamed Sathak College", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹40k/year", rating: 4.1, type: "Private" },
        { name: "Vels University", location: "Chennai, Tamil Nadu", field: "Arts & Science", fees: "₹60k/year", rating: 4.3, type: "Private" },
        { name: "Sathyabama Institute of Science and Tech", location: "Chennai, Tamil Nadu", field: "Engineering", fees: "₹2L/year", rating: 4.5, type: "Private" },
        { name: "Velammal Engineering College", location: "Chennai, Tamil Nadu", field: "Engineering", fees: "₹1.2L/year", rating: 4.2, type: "Private" },
        // --- COMMERCE (Top Colleges) ---
        { name: "Shri Ram College of Commerce (SRCC)", location: "Delhi", field: "Commerce", fees: "₹30k/year", rating: 4.9, type: "Government" },
        { name: "Lady Shri Ram College", location: "Delhi", field: "Commerce (Women)", fees: "₹20k/year", rating: 4.8, type: "Government" },
        { name: "Loyola College", location: "Chennai, Tamil Nadu", field: "Commerce", fees: "₹50k/year", rating: 4.8, type: "Private" },
        { name: "St. Xavier's College", location: "Mumbai", field: "Commerce", fees: "₹7k/year", rating: 4.8, type: "Private" },
        { name: "Christ University", location: "Bangalore", field: "Commerce", fees: "₹1.5L/year", rating: 4.7, type: "Private" },
        { name: "Narsee Monjee (NMIMS)", location: "Mumbai", field: "Commerce", fees: "₹3L/year", rating: 4.6, type: "Private" },
        { name: "Madras Christian College (MCC)", location: "Chennai, Tamil Nadu", field: "Commerce", fees: "₹40k/year", rating: 4.7, type: "Private" },
        { name: "Hindu College", location: "Delhi", field: "Commerce", fees: "₹20k/year", rating: 4.8, type: "Government" },
        { name: "Hansraj College", location: "Delhi", field: "Commerce", fees: "₹20k/year", rating: 4.7, type: "Government" },
        { name: "Symbiosis College of Arts & Commerce", location: "Pune", field: "Commerce", fees: "₹80k/year", rating: 4.6, type: "Private" },

        // --- ARTS & HUMANITIES (Top Colleges) ---
        { name: "St. Stephen's College", location: "Delhi", field: "Arts", fees: "₹40k/year", rating: 4.9, type: "Private" },
        { name: "Miranda House", location: "Delhi", field: "Arts (Women)", fees: "₹15k/year", rating: 4.9, type: "Government" },
        { name: "Presidency College", location: "Kolkata", field: "Arts", fees: "₹2k/year", rating: 4.8, type: "Government" },
        { name: "Tata Institute of Social Sciences (TISS)", location: "Mumbai", field: "Arts (Social Work)", fees: "₹1L/year", rating: 4.9, type: "Government" },
        { name: "Jawaharlal Nehru University (JNU)", location: "Delhi", field: "Arts", fees: "₹500/year", rating: 4.9, type: "Government" },

        // --- BANGALORE (Top Colleges) ---
        { name: "IISc Bangalore", location: "Bangalore, Karnataka", field: "Science & Research", fees: "₹30k/year", rating: 5.0, type: "Government" },
        { name: "IIIT Bangalore", location: "Bangalore, Karnataka", field: "Engineering (CSE/ECE)", fees: "₹3.5L/year", rating: 4.8, type: "Private" },
        { name: "RV College of Engineering", location: "Bangalore, Karnataka", field: "Engineering", fees: "₹2L/year", rating: 4.6, type: "Private" },
        { name: "BMS College of Engineering", location: "Bangalore, Karnataka", field: "Engineering", fees: "₹1.5L/year", rating: 4.5, type: "Private" },
        { name: "Ramaiah Institute of Technology", location: "Bangalore, Karnataka", field: "Engineering", fees: "₹1.8L/year", rating: 4.5, type: "Private" },
        { name: "Christ University (Kengeri Campus)", location: "Bangalore, Karnataka", field: "Engineering/Management", fees: "₹2.2L/year", rating: 4.4, type: "Private" },
        { name: "St. Joseph's College", location: "Bangalore, Karnataka", field: "Arts & Science", fees: "₹40k/year", rating: 4.4, type: "Private" },
        { name: "Mount Carmel College", location: "Bangalore, Karnataka", field: "Arts & Science (Women)", fees: "₹50k/year", rating: 4.5, type: "Private" },

        // --- HYDERABAD (Top Colleges) ---
        { name: "IIT Hyderabad", location: "Hyderabad, Telangana", field: "Engineering", fees: "₹2.2L/year", rating: 4.8, type: "Government" },
        { name: "IIIT Hyderabad", location: "Hyderabad, Telangana", field: "Engineering (CSE/Research)", fees: "₹3.5L/year", rating: 4.9, type: "Private" },
        { name: "BITS Pilani (Hyderabad Campus)", location: "Hyderabad, Telangana", field: "Engineering", fees: "₹4.5L/year", rating: 4.7, type: "Private" },
        { name: "JNTU Hyderabad", location: "Hyderabad, Telangana", field: "Engineering", fees: "₹30k/year", rating: 4.4, type: "Government" },
        { name: "Osmania University", location: "Hyderabad, Telangana", field: "Arts & Science", fees: "₹10k/year", rating: 4.3, type: "Government" },
        { name: "Chaitanya Bharathi Institute of Tech (CBIT)", location: "Hyderabad, Telangana", field: "Engineering", fees: "₹1.4L/year", rating: 4.3, type: "Private" },

        // --- MUMBAI & PUNE (West India) ---
        { name: "ICT Mumbai", location: "Mumbai, Maharashtra", field: "Chemical Engineering", fees: "₹80k/year", rating: 4.8, type: "Government" },
        { name: "VJTI Mumbai", location: "Mumbai, Maharashtra", field: "Engineering", fees: "₹85k/year", rating: 4.7, type: "Government" },
        { name: "SP Jain (SPJMRI)", location: "Mumbai, Maharashtra", field: "Management", fees: "₹15L/year", rating: 4.8, type: "Private" },
        { name: "Mithibai College", location: "Mumbai, Maharashtra", field: "Arts/Commerce", fees: "₹20k/year", rating: 4.5, type: "Private" },
        { name: "Fergusson College", location: "Pune, Maharashtra", field: "Arts & Science", fees: "₹10k/year", rating: 4.7, type: "Private" },
        { name: "College of Engineering Pune (COEP)", location: "Pune, Maharashtra", field: "Engineering", fees: "₹1.2L/year", rating: 4.8, type: "Government" },
        { name: "Symbiosis Institute of Technology", location: "Pune, Maharashtra", field: "Engineering", fees: "₹3L/year", rating: 4.4, type: "Private" },

        // --- KOLKATA & EAST (East India) ---
        { name: "IIT Kharagpur", location: "Kharagpur, West Bengal", field: "Engineering", fees: "₹2.2L/year", rating: 4.9, type: "Government" },
        { name: "Jadavpur University", location: "Kolkata, West Bengal", field: "Engineering/Arts", fees: "₹3k/year", rating: 4.9, type: "Government" },
        { name: "St. Xavier's College", location: "Kolkata, West Bengal", field: "Arts/Science/Commerce", fees: "₹40k/year", rating: 4.8, type: "Private" },
        { name: "IIEST Shibpur", location: "Howrah, West Bengal", field: "Engineering", fees: "₹1.4L/year", rating: 4.5, type: "Government" },
        { name: "NIT Rourkela", location: "Rourkela, Odisha", field: "Engineering", fees: "₹1.5L/year", rating: 4.6, type: "Government" },
        { name: "KIIT University", location: "Bhubaneswar, Odisha", field: "Engineering/Medical", fees: "₹3.5L/year", rating: 4.4, type: "Private" },

        // --- DELHI & NORTH (Expanded) ---
        { name: "DTU (Delhi Technological Univ)", location: "Delhi", field: "Engineering", fees: "₹1.8L/year", rating: 4.7, type: "Government" },
        { name: "NSUT (Netaji Subhas Univ)", location: "Delhi", field: "Engineering (CSE/ECE)", fees: "₹2L/year", rating: 4.7, type: "Government" },
        { name: "IIIT Delhi", location: "Delhi", field: "Engineering (CSE + Maths)", fees: "₹4L/year", rating: 4.8, type: "Government" },
        { name: "BITS Pilani (Pilani Campus)", location: "Pilani, Rajasthan", field: "Engineering", fees: "₹4.5L/year", rating: 4.9, type: "Private" },
        { name: "Thapar Institute", location: "Patiala, Punjab", field: "Engineering", fees: "₹3.5L/year", rating: 4.5, type: "Private" },
        { name: "Chandigarh University", location: "Chandigarh", field: "Engineering/Management", fees: "₹2L/year", rating: 4.1, type: "Private" },

        // --- MEDICAL & OTHERS (Diverse) ---
        { name: "AFMC Pune", location: "Pune, Maharashtra", field: "Medical", fees: "Low (Service Bond)", rating: 4.9, type: "Government" },
        { name: "Kasturba Medical College (KMC)", location: "Manipal, Karnataka", field: "Medical", fees: "₹18L/year", rating: 4.7, type: "Private" },
        { name: "St. John's Medical College", location: "Bangalore, Karnataka", field: "Medical", fees: "₹6L/year", rating: 4.7, type: "Private" },
        { name: "NIFT Delhi", location: "Delhi", field: "Fashion Design", fees: "₹2L/year", rating: 4.8, type: "Government" },
        { name: "NID Ahmedabad", location: "Ahmedabad, Gujarat", field: "Design", fees: "₹2.5L/year", rating: 4.9, type: "Government" }
        ,
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
        },
    ];

    const govtJobs = [
        // --- UPSC & CIVIL SERVICES ---
        {
            title: "Civil Services Exam (CSE)",
            category: "UPSC",
            exam_name: "UPSC CSE",
            eligibility_criteria: JSON.stringify({ age_min: 21, age_max: 32, education: "undergraduate" }),
            description: "Gateway to IAS, IPS, IFS. The most prestigious exam in India.",
            website: "upsc.gov.in",
            syllabus: "Prelims: General Studies (History, Geography, Polity, Economy, Environment), CSAT. Mains: Essay, 4 GS Papers, 2 Optional Papers.",
            exam_pattern: "Prelims (Obj), Mains (Subj), Interview",
            preparation_books: "M. Laxmikanth (Polity), Spectrum (History), GC Leong (Geography), Nitin Singhania (Art & Culture)",
            important_dates: JSON.stringify({ start: "Feb", end: "Mar", exam: "May/June" })
        },
        {
            title: "Indian Forest Service (IFS)",
            category: "UPSC",
            exam_name: "UPSC IFS",
            eligibility_criteria: JSON.stringify({ age_min: 21, age_max: 32, education: "science_graduate" }),
            description: "Manage India's forests and wildlife.",
            website: "upsc.gov.in",
            syllabus: "General English, General Knowledge. Optional Subjects: Botany, Chemistry, Forestry, Geology, Mathematics, Physics, Statistics, Zoology.",
            exam_pattern: "Prelims (Same as CSE), Mains, Interview",
            preparation_books: "Standard UPSC Books + Specialization in Forestry/Botany",
            important_dates: JSON.stringify({ start: "Feb", end: "Mar", exam: "May/June" })
        },
        {
            title: "NDA (National Defence Academy)",
            category: "Defense",
            exam_name: "UPSC NDA",
            eligibility_criteria: JSON.stringify({ age_min: 16.5, age_max: 19.5, education: "12th" }),
            description: "Join Army, Navy, or Air Force as an officer after 12th.",
            website: "upsc.gov.in",
            syllabus: "Mathematics (Algebra, Trig, Calculus), General Ability Test (English, GK, Physics, Chem, Current Affairs).",
            exam_pattern: "Written Exam (900 Marks) + SSB Interview (900 Marks)",
            preparation_books: "Pathfinder for NDA (Arihant), R.S. Aggarwal (Maths)",
            important_dates: JSON.stringify({ start: "Dec/Jun", end: "Jan/Jul", exam: "Apr/Sep" })
        },
        {
            title: "CDS (Combined Defence Services)",
            category: "Defense",
            exam_name: "UPSC CDS",
            eligibility_criteria: JSON.stringify({ education: "undergraduate" }),
            description: "Entry for graduates into IMA, INA, AFA, and OTA.",
            website: "upsc.gov.in",
            syllabus: "English, General Knowledge, Elementary Mathematics.",
            exam_pattern: "Written Exam + SSB Interview",
            preparation_books: "Pathfinder CDS (Arihant), Manorama Yearbook",
            important_dates: JSON.stringify({ start: "Dec/May", end: "Jan/Jun", exam: "Apr/Sep" })
        },

        // --- SSC EXAMS ---
        {
            title: "SSC CGL (Combined Graduate Level)",
            category: "SSC",
            exam_name: "SSC CGL",
            eligibility_criteria: JSON.stringify({ education: "undergraduate" }),
            description: "Inspector, Assistant, Auditor roles in Central Ministries.",
            website: "ssc.nic.in",
            syllabus: "General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension.",
            exam_pattern: "Tier 1 (CBT), Tier 2 (CBT - Math/Eng/Reasoning/GA)",
            preparation_books: "R.S. Aggarwal (Quant/Reasoning), Lucent's GK, SP Bakshi (English)",
            important_dates: JSON.stringify({ start: "April", end: "May", exam: "July" })
        },
        {
            title: "SSC CHSL (Combined Higher Secondary)",
            category: "SSC",
            exam_name: "SSC CHSL",
            eligibility_criteria: JSON.stringify({ education: "12th" }),
            description: "LDC, JSA, DEO posts for 12th pass students.",
            website: "ssc.nic.in",
            syllabus: "English Language, General Intelligence, Quantitative Aptitude, General Awareness.",
            exam_pattern: "Tier 1 (CBT), Tier 2 (CBT + Typing Test)",
            preparation_books: "Kiran Prakashan, R.S. Aggarwal",
            important_dates: JSON.stringify({ start: "May", end: "June", exam: "August" })
        },
        {
            title: "SSC GD Constable",
            category: "SSC",
            exam_name: "SSC GD",
            eligibility_criteria: JSON.stringify({ education: "10th" }),
            description: "Constable in BSF, CISF, CRPF, ITBP, SSB, SSF, etc.",
            website: "ssc.nic.in",
            syllabus: "General Intelligence & Reasoning, GK & Awareness, Elementary Maths, English/Hindi.",
            exam_pattern: "CBT + Physical Efficiency Test (PET)",
            preparation_books: "Arihant SSC GD Constable Guide",
            important_dates: JSON.stringify({ start: "Nov", end: "Dec", exam: "Feb/Mar" })
        },

        // --- BANKING & INSURANCE ---
        {
            title: "SBI Probationary Officer (PO)",
            category: "Banking",
            exam_name: "SBI PO",
            eligibility_criteria: JSON.stringify({ education: "undergraduate" }),
            description: "Prestigious entry-level officer role in SBI.",
            website: "sbi.co.in",
            syllabus: "Reasoning Ability, Quantitative Aptitude, English Language, General/Banking Awareness.",
            exam_pattern: "Prelims, Mains (Obj + Desc), Interview",
            preparation_books: "Arun Sharma (Quant), Word Power Made Easy (English), Banking Awareness by Arihant",
            important_dates: JSON.stringify({ start: "Sep", end: "Oct", exam: "Dec" })
        },
        {
            title: "IBPS Clerk",
            category: "Banking",
            exam_name: "IBPS Clerk",
            eligibility_criteria: JSON.stringify({ education: "undergraduate" }),
            description: "Clerical cadre posts in public sector banks.",
            website: "ibps.in",
            syllabus: "English Language, Numerical Ability, Reasoning Ability.",
            exam_pattern: "Prelims, Mains (No Interview)",
            preparation_books: "Kiran Prakashan Bank Clerk Guide",
            important_dates: JSON.stringify({ start: "July", end: "Aug", exam: "Sep" })
        },
        {
            title: "LIC AAO (Assistant Administrative Officer)",
            category: "Insurance",
            exam_name: "LIC AAO",
            eligibility_criteria: JSON.stringify({ education: "undergraduate" }),
            description: "Officer role in Life Insurance Corporation.",
            website: "licindia.in",
            syllabus: "Reasoning, Quant, English, General Awareness, Insurance & Financial Market Awareness.",
            exam_pattern: "Prelims, Mains, Interview",
            preparation_books: "Insurance Awareness by Arihant",
            important_dates: JSON.stringify({ start: "Jan", end: "Feb", exam: "Mar" })
        },

        // --- RAILWAYS (RRB) ---
        {
            title: "RRB NTPC (Non-Technical Popular Categories)",
            category: "Railways",
            exam_name: "RRB NTPC",
            eligibility_criteria: JSON.stringify({ education: "12th/undergraduate" }),
            description: "Station Master, Goods Guard, Account Assistant, Clerk, Typist.",
            website: "indianrailways.gov.in",
            syllabus: "General Awareness, Mathematics, General Intelligence & Reasoning.",
            exam_pattern: "CBT-1, CBT-2, Typing/Aptitude Test (post-wise)",
            preparation_books: "RRB NTPC Guide by Arihant, Lucent GK",
            important_dates: JSON.stringify({ start: "Variable", end: "Variable", exam: "Variable" })
        },
        {
            title: "RRB Group D",
            category: "Railways",
            exam_name: "RRB Group D",
            eligibility_criteria: JSON.stringify({ education: "10th" }),
            description: "Track Maintainer, Helper, Assistant Pointsman, etc.",
            website: "indianrailways.gov.in",
            syllabus: "General Science (10th level), Mathematics, Reasoning, General Awareness.",
            exam_pattern: "CBT + Physical Efficiency Test (PET)",
            preparation_books: "Speedy Railway Science",
            important_dates: JSON.stringify({ start: "Variable", end: "Variable", exam: "Variable" })
        },
        {
            title: "RRB ALP (Assistant Loco Pilot)",
            category: "Railways",
            exam_name: "RRB ALP",
            eligibility_criteria: JSON.stringify({ education: "10th + ITI/Diploma" }),
            description: "Drive and maintain trains.",
            website: "indianrailways.gov.in",
            syllabus: "Maths, Reasoning, General Science, CA. Part B: Relevant Trade.",
            exam_pattern: "CBT-1, CBT-2, CBAT (Psycho Test)",
            preparation_books: "Rukmini Prakashan Platform Series",
            important_dates: JSON.stringify({ start: "Variable", end: "Variable", exam: "Variable" })
        },

        // --- TEACHING (CTET/NET) ---
        {
            title: "CTET (Central Teacher Eligibility Test)",
            category: "Teaching",
            exam_name: "CTET",
            eligibility_criteria: JSON.stringify({ education: "B.Ed/D.El.Ed" }),
            description: "Eligibility for teaching jobs in Central Govt schools (KVS, NVS).",
            website: "ctet.nic.in",
            syllabus: "Child Development & Pedagogy, Language I & II, Maths, EVS (Paper 1) / Maths & Science or Social Studies (Paper 2).",
            exam_pattern: "Offline/Online MCQ (150 Marks)",
            preparation_books: "Pearson CTET Guide, Arihant",
            important_dates: JSON.stringify({ start: "July/Dec", end: "Aug/Jan", exam: "Aug/Jan" })
        },
        {
            title: "UGC NET (National Eligibility Test)",
            category: "Teaching",
            exam_name: "UGC NET",
            eligibility_criteria: JSON.stringify({ education: "postgraduate" }),
            description: "For Assistant Professor or Junior Research Fellowship (JRF).",
            website: "ugcnet.nta.nic.in",
            syllabus: "Paper 1: Teaching & Research Aptitude. Paper 2: Subject Specific.",
            exam_pattern: "CBT (3 Hours, 300 Marks)",
            preparation_books: "KVS Madaan (Paper 1), R. Gupta's (Subject)",
            important_dates: JSON.stringify({ start: "Mar/Sep", end: "Apr/Oct", exam: "Jun/Dec" })
        },

        // --- GATE (Engineering) ---
        {
            title: "GATE (Graduate Aptitude Test in Engineering)",
            category: "Engineering",
            exam_name: "GATE",
            eligibility_criteria: JSON.stringify({ education: "undergraduate_engineering" }),
            description: "For M.Tech admissions and PSU recruitment (ONGC, IOCL, NTPC).",
            website: "gate.iisc.ac.in",
            syllabus: "General Aptitude, Engineering Mathematics, Core Engineering Subject.",
            exam_pattern: "CBT (65 Questions, 100 Marks)",
            preparation_books: "Made Easy Series, Ace Academy Notes",
            important_dates: JSON.stringify({ start: "Aug/Sep", end: "Oct", exam: "Feb" })
        }
    ];
    const scholarships = [
        // --- CENTRAL GOVT SCHOLARSHIPS ---
        {
            title: "Post Matric Scholarship (SC/ST)",
            provider: "Govt of India",
            amount: "Full Tuition + Maintenance",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 2.5, category: ["SC", "ST"] }),
            deadline: "2025-11-30",
            link: "https://scholarships.gov.in"
        },
        {
            title: "Central Sector Scheme of Scholarship",
            provider: "Dept of Higher Education",
            amount: "₹10,000 - ₹20,000 / year",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 8, category: ["General", "OBC", "SC", "ST"], min_marks: 80 }),
            deadline: "2025-10-31",
            link: "https://scholarships.gov.in"
        },
        {
            title: "Merit-cum-Means Scholarship",
            provider: "Ministry of Minority Affairs",
            amount: "₹25,000 - ₹30,000",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 2.5, min_marks: 50, category: ["Minority", "Muslim", "Christian", "Sikh"] }),
            deadline: "2025-11-15",
            link: "https://scholarships.gov.in"
        },
        {
            title: "PM YASASVI Scheme",
            provider: "Govt of India",
            amount: "₹75,000 - ₹1,25,000",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 2.5, category: ["OBC", "EBC", "DNT"] }),
            deadline: "2025-08-31",
            link: "https://yet.nta.ac.in"
        },
        {
            title: "AICTE Pragati Scholarship",
            provider: "AICTE",
            amount: "₹50,000 / year",
            eligibility_criteria: JSON.stringify({ gender: "Female", income_limit_lakhs: 8, category: ["All"] }),
            deadline: "2025-12-31",
            link: "aicte-india.org"
        },
        {
            title: "AICTE Saksham Scholarship",
            provider: "AICTE",
            amount: "₹50,000 / year",
            eligibility_criteria: JSON.stringify({ disability: true, income_limit_lakhs: 8, category: ["All"] }),
            deadline: "2025-12-31",
            link: "aicte-india.org"
        },
        {
            title: "INSPIRE SHE Scholarship",
            provider: "DST, Govt of India",
            amount: "₹80,000 / year",
            eligibility_criteria: JSON.stringify({ min_marks: 90, category: ["All"] }), // Top 1%
            deadline: "2025-12-31",
            link: "online-inspire.gov.in"
        },

        // --- TAMIL NADU STATE SCHOLARSHIPS ---
        {
            title: "Pudhumai Penn Scheme",
            provider: "Govt of Tamil Nadu",
            amount: "₹1,000 / month",
            eligibility_criteria: JSON.stringify({ gender: "Female", education_mode: "Govt School 6th-12th", category: ["All"] }),
            deadline: "Open all year",
            link: "https://pudhumaipenn.tn.gov.in"
        },
        {
            title: "First Graduate Fee Concession",
            provider: "Govt of Tamil Nadu",
            amount: "Tuition Fee Waiver (approx ₹25k)",
            eligibility_criteria: JSON.stringify({ first_graduate: true, category: ["All"] }),
            deadline: "During Counseling",
            link: "https://www.tneaonline.org"
        },
        {
            title: "BC/MBC Scholarship",
            provider: "Govt of Tamil Nadu",
            amount: "Free Education + Hostel",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 2, category: ["BC", "MBC", "DNC"] }),
            deadline: "2025-09-30",
            link: "https://bcmbcmw.tn.gov.in"
        },
        {
            title: "Thanthai Periyar EVR Nagammai Scheme",
            provider: "Govt of Tamil Nadu",
            amount: "Tuition Fee Waiver",
            eligibility_criteria: JSON.stringify({ gender: "Female", income_limit_lakhs: 1, category: ["All"] }),
            deadline: "2025-10-15",
            link: "dce.tn.gov.in"
        },
        {
            title: "CM Merit Scholarship (69% Rule)",
            provider: "Govt of Tamil Nadu",
            amount: "₹1,00,000 / year",
            eligibility_criteria: JSON.stringify({ min_marks: 95, category: ["SC", "ST"] }),
            deadline: "2025-08-30",
            link: "adw.tn.gov.in"
        },

        // --- PRIVATE SCHOLARSHIPS ---
        {
            title: "HDFC Badhte Kadam",
            provider: "HDFC Bank",
            amount: "Up to ₹1,00,000",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 6, min_marks: 60, category: ["All"] }),
            deadline: "2025-09-30",
            link: "https://www.buddy4study.com"
        },
        {
            title: "Reliance Foundation Undergraduate",
            provider: "Reliance Foundation",
            amount: "Up to ₹2,00,000",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 15, min_marks: 60, category: ["All"] }),
            deadline: "2025-10-15",
            link: "https://reliancefoundation.org"
        },
        {
            title: "Tata Trust Medical/Healthcare",
            provider: "Tata Trusts",
            amount: "Variable",
            eligibility_criteria: JSON.stringify({ stream: "medical", min_marks: 60, category: ["All"] }),
            deadline: "2025-11-01",
            link: "https://www.tatatrusts.org"
        },
        {
            title: "Keep India Smiling Check",
            provider: "Colgate",
            amount: "₹30,000 - ₹50,000 / year",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 5, min_marks: 60, category: ["All"] }),
            deadline: "2025-12-31",
            link: "https://www.buddy4study.com"
        },
        {
            title: "Santoor Scholarship",
            provider: "Wipro Consumer Care",
            amount: "₹24,000 / year",
            eligibility_criteria: JSON.stringify({ gender: "Female", region: "South India", category: ["All"] }),
            deadline: "2025-09-15",
            link: "santoorscholarship.com"
        },
        {
            title: "Aditya Birla Capital Scholarship",
            provider: "Aditya Birla Group",
            amount: "Up to ₹60,000",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 6, category: ["All"] }),
            deadline: "2025-10-31",
            link: "https://www.buddy4study.com"
        },
        {
            title: "Kind Circle Scholarship",
            provider: "Kind Circle",
            amount: "Variable",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 4, min_marks: 75, category: ["All"] }),
            deadline: "2025-12-31",
            link: "kindcircle.org"
        },
        {
            title: "L'Oréal India For Young Women",
            provider: "L'Oréal",
            amount: "₹2,50,000",
            eligibility_criteria: JSON.stringify({ gender: "Female", stream: "science", min_marks: 85, category: ["All"] }),
            deadline: "2025-07-31",
            link: "loreal.com"
        },
        // --- NEW SCHOLARSHIPS ADDED ---
        {
            title: "Fair & Lovely Foundation Scholarship",
            provider: "HUL",
            amount: "₹25,000 - ₹50,000",
            eligibility_criteria: JSON.stringify({ gender: "Female", min_marks: 60, income_limit_lakhs: 6, category: ["All"] }),
            deadline: "2025-11-30",
            link: "https://www.fairandlovelyfoundation.in"
        },
        {
            title: "Indian Oil Sports Scholarship",
            provider: "IOCL",
            amount: "₹12,000 - ₹19,000 / month",
            eligibility_criteria: JSON.stringify({ category: ["Sports"], age_min: 13, age_max: 19 }),
            deadline: "2025-09-30",
            link: "https://iocl.com"
        },
        {
            title: "Rolls-Royce Unnati Scholarship",
            provider: "Rolls-Royce India",
            amount: "₹35,000",
            eligibility_criteria: JSON.stringify({ gender: "Female", stream: "engineering", category: ["All"] }),
            deadline: "2025-08-31",
            link: "https://www.buddy4study.com"
        },
        {
            title: "OakNorth STEM Scholarship",
            provider: "OakNorth",
            amount: "₹30,000",
            eligibility_criteria: JSON.stringify({ gender: "Female", stream: "STEM", category: ["All"] }),
            deadline: "2025-09-30",
            link: "https://www.buddy4study.com"
        },
        {
            title: "LIC HFL Vidyadhan Scholarship",
            provider: "LIC Housing Finance",
            amount: "₹10,000 - ₹20,000",
            eligibility_criteria: JSON.stringify({ income_limit_lakhs: 3.6, category: ["All"] }),
            deadline: "2025-09-30",
            link: "https://www.buddy4study.com"
        },
        {
            title: "G.P. Birla Scholarship",
            provider: "G.P. Birla Trust",
            amount: "₹50,000 / year",
            eligibility_criteria: JSON.stringify({ min_marks: 80, state: "West Bengal", category: ["All"] }),
            deadline: "2025-08-31",
            link: "https://gpbirlaedufoundation.com"
        },
        {
            title: "Sitaram Jindal Scholarship",
            provider: "Sitaram Jindal Foundation",
            amount: "₹500 - ₹2500 / month",
            eligibility_criteria: JSON.stringify({ category: ["All"], income_limit_lakhs: 4 }),
            deadline: "Open all year",
            link: "https://www.sitaramjindalfoundation.org"
        },
        {
            title: "NSDL Shiksha Sahyog Scholarship",
            provider: "NSDL",
            amount: "₹10,000",
            eligibility_criteria: JSON.stringify({ min_marks: 60, income_limit_lakhs: 3, category: ["All"] }),
            deadline: "2025-09-30",
            link: "https://www.vidyasaarathi.co.in"
        },
        {
            title: "Schindler Igniting Minds Scholarship",
            provider: "Schindler India",
            amount: "₹20,000",
            eligibility_criteria: JSON.stringify({ education: "Diploma", category: ["All"] }),
            deadline: "2025-10-15",
            link: "https://www.buddy4study.com"
        },
        {
            title: "Kotak Kanya Scholarship",
            provider: "Kotak Education Foundation",
            amount: "₹1,00,000 / year",
            eligibility_criteria: JSON.stringify({ gender: "Female", income_limit_lakhs: 3.2, min_marks: 75 }),
            deadline: "2025-09-30",
            link: "https://kotakeducation.org"
        },
        {
            title: "Dr. Abdul Kalam Scholarship",
            provider: "Buddy4Study",
            amount: "₹20,000",
            eligibility_criteria: JSON.stringify({ category: ["All"] }),
            deadline: "2025-10-31",
            link: "https://www.buddy4study.com"
        },
        {
            title: "Timken Scholarship",
            provider: "Timken India",
            amount: "Variable",
            eligibility_criteria: JSON.stringify({ category: ["All"] }),
            deadline: "2025-10-31",
            link: "https://www.buddy4study.com"
        },
        {
            title: "Legrand Empowering Scholarship",
            provider: "Legrand",
            amount: "₹60,000 / year",
            eligibility_criteria: JSON.stringify({ gender: "Female", stream: "Engineering/Architecture", category: ["All"] }),
            deadline: "2025-08-31",
            link: "https://www.buddy4study.com"
        }
    ];

    // Add Internship Data as well to handle the full reset
    const internships = [
        {
            title: "Web Development Intern",
            company: "TechSolutions Inc",
            type: "Remote",
            stipend: "₹10,000 / month",
            duration: "3 Months",
            requirements: JSON.stringify(["HTML", "CSS", "JS"])
        },
        {
            title: "Content Writing Intern",
            company: "MediaBuzz",
            type: "Remote",
            stipend: "₹5,000 / month",
            duration: "2 Months",
            requirements: JSON.stringify(["English Proficiency", "Creativity"])
        },
        {
            title: "Data Science Intern",
            company: "Analytics Co",
            type: "On-site (Bangalore)",
            stipend: "₹25,000 / month",
            duration: "6 Months",
            requirements: JSON.stringify(["Python", "SQL"])
        },
        {
            title: "Digital Marketing Intern",
            company: "GrowthHackers",
            type: "Remote",
            stipend: "₹8,000 / month",
            duration: "3 Months",
            requirements: JSON.stringify(["SEO", "Social Media", "Canva"])
        },
        {
            title: "HR Intern",
            company: "PeopleFirst",
            type: "On-site (Mumbai)",
            stipend: "₹12,000 / month",
            duration: "3 Months",
            requirements: JSON.stringify(["Communication", "Management", "Excel"])
        },
        {
            title: "Graphic Design Intern",
            company: "Creative Studio",
            type: "Remote",
            stipend: "₹7,000 / month",
            duration: "2 Months",
            requirements: JSON.stringify(["Photoshop", "Illustrator", "Creativity"])
        },
        {
            title: "Finance Intern",
            company: "FinCorp",
            type: "On-site (Delhi)",
            stipend: "₹15,000 / month",
            duration: "6 Months",
            requirements: JSON.stringify(["Accounting", "Excel", "Finance"])
        },
        {
            title: "Business Analytics Intern",
            company: "DataInsights",
            type: "Remote",
            stipend: "₹18,000 / month",
            duration: "4 Months",
            requirements: JSON.stringify(["SQL", "Tableau", "Data Analysis"])
        },
        {
            title: "Mobile App Dev Intern",
            company: "AppWorks",
            type: "Remote",
            stipend: "₹12,000 / month",
            duration: "3 Months",
            requirements: JSON.stringify(["React Native/Flutter", "API Integration"])
        },
        {
            title: "Social Media Intern",
            company: "ViralTrends",
            type: "Hybrid",
            stipend: "₹10,000 / month",
            duration: "3 Months",
            requirements: JSON.stringify(["Instagram Trends", "Reels Creation", "Copywriting"])
        },
        {
            title: "Product Management Intern",
            company: "SoftProducts",
            type: "On-site (Bangalore)",
            stipend: "₹20,000 / month",
            duration: "6 Months",
            requirements: JSON.stringify(["Product Thinking", "Jira", "Market Research"])
        },
        {
            title: "Sales & Marketing Intern",
            company: "EduTech Pro",
            type: "On-site (Chennai)",
            stipend: "₹15,000 + Incentives",
            duration: "3 Months",
            requirements: JSON.stringify(["Communication", "Negotiation", "Sales"])
        },
        {
            title: "Cyber Security Intern",
            company: "SecureNet",
            type: "Remote",
            stipend: "₹15,000 / month",
            duration: "4 Months",
            requirements: JSON.stringify(["Network Security", "Ethical Hacking", "Linux"])
        }
    ];


    const skills = [
        {
            title: "Python Programming",
            category: "Programming",
            description: "Versatile language for Web, Data Science, and AI.",
            level: "Beginner to Advanced",
            roadmap: JSON.stringify(["Basics (Syntax, Loops)", "Data Structures (Lists, Dicts)", "OOP Concepts", "Libraries (NumPy, Pandas)", "Web Frameworks (Flask/Django)"]),
            resources: JSON.stringify(["Official Docs (python.org)", "CodeWithHarry (YouTube)", "Real Python"])
        },
        {
            title: "Java Development",
            category: "Programming",
            description: "Robust language for Enterprise and Android apps.",
            level: "Intermediate",
            roadmap: JSON.stringify(["Core Java (Syntax, OOP)", "Collections Framework", "Multithreading", "JDBC & Databases", "Spring Boot (Framework)"]),
            resources: JSON.stringify(["Oracle Java Docs", "Telusko (YouTube)", "Udemy Java Masterclass"])
        },
        {
            title: "Full Stack Web Dev (MERN)",
            category: "Web Development",
            description: "Build complete web apps using MongoDB, Express, React, Node.",
            level: "Advanced",
            roadmap: JSON.stringify(["HTML/CSS/JS", "React.js (Frontend)", "Node.js & Express (Backend)", "MongoDB (Database)", "Deployment (Vercel/Heroku)"]),
            resources: JSON.stringify(["MDN Web Docs", "FreeCodeCamp", "The Odin Project"])
        },
        {
            title: "App Development (Flutter)",
            category: "Mobile Dev",
            description: "Build iOS and Android apps with a single codebase.",
            level: "Intermediate",
            roadmap: JSON.stringify(["Dart Language", "Flutter Widgets", "State Management (Provider/Bloc)", "API Integration", "Publishing to Stores"]),
            resources: JSON.stringify(["Flutter.dev", "Net Ninja (YouTube)"])
        },
        {
            title: "Data Science & AI",
            category: "Data Science",
            description: "Analyze data and build machine learning models.",
            level: "Advanced",
            roadmap: JSON.stringify(["Python & SQL", "Data Analysis (Pandas)", "Visualization (Matplotlib)", "Machine Learning (Scikit-Learn)", "Deep Learning (TensorFlow)"]),
            resources: JSON.stringify(["Kaggle", "Coursera Andrew Ng", "Towards Data Science"])
        },
        {
            title: "Cyber Security",
            category: "Security",
            description: "Protect systems from digital attacks.",
            level: "Intermediate",
            roadmap: JSON.stringify(["Networking Basics", "Linux OS", "Ethical Hacking Tools", "Cryptography", "Network Defense"]),
            resources: JSON.stringify(["TryHackMe", "Hack The Box", "Cybrary"])
        }
    ];

    db.serialize(() => {

        // Clear existing data to avoid duplicates on re-seeding
        db.run("DELETE FROM careers");
        db.run("DELETE FROM govt_jobs");
        db.run("DELETE FROM scholarships");
        db.run("DELETE FROM internships");
        db.run("DELETE FROM skills");
        db.run("DELETE FROM colleges");

        const stmtCareer = db.prepare("INSERT INTO careers (title, category, description, salary_range, job_growth, required_stream, required_skills, roadmap, top_companies, min_education) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        careers.forEach(c => {
            stmtCareer.run(c.title, c.category, c.description, c.salary_range, c.job_growth, c.required_stream, c.required_skills, c.roadmap, c.top_companies, c.min_education);
        });
        stmtCareer.finalize();

        const insertCollege = db.prepare("INSERT INTO colleges (name, location, field, fees, rating, type, website, details_link, accommodation, placement_stats, reviews, ranking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        colleges.forEach(college => {
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
        });
        insertCollege.finalize();

        const stmtGovt = db.prepare("INSERT INTO govt_jobs (title, category, exam_name, eligibility_criteria, description, website, syllabus, exam_pattern, preparation_books, important_dates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        govtJobs.forEach(j => {
            stmtGovt.run(
                j.title,
                j.category,
                j.exam_name,
                j.eligibility_criteria,
                j.description,
                j.website,
                j.syllabus || "General Awareness, Reasoning, Quant", // Default if missing
                j.exam_pattern || "MCQ based",
                j.preparation_books || "NCERT Books",
                j.important_dates || JSON.stringify({ start: "TBD", end: "TBD", exam: "TBD" })
            );
        });
        stmtGovt.finalize();

        const stmtSch = db.prepare("INSERT INTO scholarships (title, provider, amount, eligibility_criteria, deadline, link) VALUES (?, ?, ?, ?, ?, ?)");
        scholarships.forEach(s => {
            stmtSch.run(s.title, s.provider, s.amount, s.eligibility_criteria, s.deadline, s.link);
        });
        stmtSch.finalize();

        const stmtIntern = db.prepare("INSERT INTO internships (title, company, type, stipend, duration, requirements) VALUES (?, ?, ?, ?, ?, ?)");
        internships.forEach(i => {
            stmtIntern.run(i.title, i.company, i.type, i.stipend, i.duration, i.requirements);
        });
        stmtIntern.finalize();


        const stmtSkills = db.prepare("INSERT INTO skills (title, category, description, level, roadmap, resources) VALUES (?, ?, ?, ?, ?, ?)");
        skills.forEach(s => {
            stmtSkills.run(s.title, s.category, s.description, s.level, s.roadmap, s.resources);
        });
        stmtSkills.finalize();

        console.log("Database seeded with expanded dataset successfully.");
    });
};

// setTimeout(seedData, 1000); // Wait for table creation
module.exports = seedData;
