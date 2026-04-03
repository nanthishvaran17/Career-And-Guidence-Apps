/**
 * MEGA SEEDER - 1000+ records across Jobs, Internships, Skills, Govt Jobs, Scholarships
 * Run: node database/seed_jobs_mega.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database', 'career_advisor.db');
const db = new sqlite3.Database(dbPath);

// Make sure tables exist first
db.serialize(() => {
  // ── ensure tables exist ──────────────────────────────────────────────────
  db.run(`DROP TABLE IF EXISTS jobs`);
  db.run(`CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT,
    sector TEXT,
    location TEXT,
    salary_range TEXT,
    job_type TEXT,
    description TEXT,
    skills_required TEXT,
    apply_link TEXT,
    posted_date DATE DEFAULT CURRENT_DATE
  )`);

  db.run(`DROP TABLE IF EXISTS internships`);
  db.run(`CREATE TABLE internships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT,
    type TEXT,
    stipend TEXT,
    duration TEXT,
    location TEXT,
    requirements TEXT,
    what_you_learn TEXT,
    prerequisites_roadmap TEXT,
    syllabus TEXT,
    link TEXT,
    posted_date DATE DEFAULT CURRENT_DATE
  )`);

  db.run(`DROP TABLE IF EXISTS skills`);
  db.run(`CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    level TEXT,
    description TEXT,
    roadmap TEXT,
    resources TEXT,
    certifications TEXT,
    duration TEXT
  )`);

  db.run(`DROP TABLE IF EXISTS govt_jobs`);
  db.run(`CREATE TABLE govt_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    exam_name TEXT,
    eligibility_criteria TEXT,
    description TEXT,
    website TEXT,
    syllabus TEXT,
    exam_pattern TEXT,
    preparation_books TEXT,
    important_dates TEXT
  )`);

  db.run(`DROP TABLE IF EXISTS scholarships`);
  db.run(`CREATE TABLE scholarships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    provider TEXT,
    type TEXT,
    amount TEXT,
    eligibility TEXT,
    state TEXT,
    deadline TEXT,
    link TEXT,
    description TEXT
  )`);
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA GENERATORS
// ─────────────────────────────────────────────────────────────────────────────

const companies = [
  'TCS','Infosys','Wipro','HCL','Tech Mahindra','Accenture','IBM','Cognizant','Capgemini','L&T Infotech',
  'Hexaware','Mphasis','Persistent','NIIT Technologies','Sonata Software','Mastech','Zensar','Cyient',
  'Birlasoft','LTIMindtree','Coforge','Sasken','KPIT','Tata Elxsi','QuEST Global','Mahindra Tech',
  'Mindtree','Syntel','MphasiS','Oracle India','SAP Labs','Adobe India','Salesforce India','Google India',
  'Microsoft India','Amazon India','Flipkart','Zomato','Swiggy','Paytm','OYO','BYJU\'S','Unacademy',
  'PhonePe','Razorpay','Freshworks','Zoho','InMobi','Udaan','Delhivery','BigBasket','Nykaa',
  'HDFC Bank','ICICI Bank','SBI','Axis Bank','Kotak Mahindra','Yes Bank','Bank of Baroda','Canara Bank',
  'Hero Motocorp','Bajaj Auto','TVS Motors','Mahindra','Tata Motors','Maruti Suzuki','Hyundai India',
  'Bosch India','Honeywell','Siemens India','ABB India','Schneider Electric','Havells','Voltas',
  'Dr Reddys','Cipla','Sun Pharma','Lupin','Aurobindo','Divi\'s Labs','Biocon','Wockhardt','Glenmark',
  'NMDC','ONGC','SAIL','BHEL','NTPC','Power Grid','GAIL','Oil India','HPCL','BPCL','IOC','CIL',
];

const sectors = ['IT','Banking','Manufacturing','Healthcare','Retail','Education','Finance','Telecom','Energy','Automotive','Pharma','E-commerce'];
const jobTypes = ['Full Time','Part Time','Contract','Remote','Hybrid'];
const locations = ['Chennai','Mumbai','Delhi','Bangalore','Hyderabad','Pune','Kolkata','Ahmedabad','Noida','Gurugram','Coimbatore','Kochi','Jaipur','Lucknow','Bhopal'];

const jobTitles = [
  'Software Engineer','Senior Software Engineer','Full Stack Developer','Backend Developer','Frontend Developer',
  'Data Analyst','Data Scientist','Machine Learning Engineer','AI Engineer','DevOps Engineer',
  'Cloud Engineer','Database Administrator','QA Engineer','Automation Test Engineer','Mobile App Developer',
  'Android Developer','iOS Developer','React Developer','Node.js Developer','Python Developer',
  'Java Developer','.NET Developer','PHP Developer','Go Developer','Rust Developer',
  'System Analyst','Business Analyst','Product Manager','Project Manager','Scrum Master',
  'UI/UX Designer','Graphic Designer','Network Engineer','Cybersecurity Analyst','Blockchain Developer',
  'HR Executive','Recruitment Specialist','Finance Analyst','Accountant','Sales Executive',
  'Marketing Executive','Digital Marketing Manager','SEO Specialist','Content Writer','Social Media Manager',
  'Operations Manager','Supply Chain Analyst','Logistics Coordinator','Customer Support Executive','Branch Manager',
  'Relationship Manager','Credit Analyst','Risk Analyst','Equity Researcher','Actuarial Analyst',
  'Mechanical Engineer','Civil Engineer','Electrical Engineer','Electronics Engineer','Chemical Engineer',
  'Production Engineer','Quality Control Engineer','Safety Officer','Maintenance Engineer','Instrumentation Engineer',
  'Embedded Systems Engineer','VLSI Design Engineer','PCB Design Engineer','RF Engineer','Telecom Engineer',
  'Research Scientist','Clinical Research Associate','Medical Coder','Pharmacovigilance Specialist','Lab Technician',
  'ERP Consultant','SAP Consultant','CRM Consultant','Tableau Developer','Power BI Developer',
  'Salesforce Developer','AWS Solutions Architect','Azure DevOps Engineer','GCP Engineer','Site Reliability Engineer',
  'Technical Writer','Instructional Designer','E-Learning Developer','Training Coordinator','L&D Manager',
];

const skillsList = [
  // [title, category, level, description, roadmap[], resources[], certifications[], duration]
  ['UPSC Civil Services Preparation','Govt Exam Prep','Advanced',
   'Master the preparation for IAS/IPS/IFS. Complete roadmap to crack UPSC Civil Services from scratch.',
   ['Read NCERTs (Class 6-12) for foundation','Standard Books: Laxmikanth Polity, Bipin Chandra History, Ramesh Singh Economy','Daily Newspaper: The Hindu + PIB (Press Information Bureau)','UPSC-standard Answer Writing — 10 per day with review','Mock Tests + Previous Year Q&A analysis (2011–2024)','Interview Preparation: DAF review, mock interviews with retired officers'],
   ['YouTube: Mrunal Patel Economy','YouTube: StudyIQ IAS Drishti IAS','ClearIAS.com — free quality resources','Vision IAS Study Material','Insights on India Secure Daily Q&A'],
   ['No formal certification — UPSC rank IS the credential','IGNOU Public Administration (relevant elective)','YOJANA Magazine subscription for economic analysis'],
   '12-18 months'],

  ['SSC CGL Preparation','Govt Exam Prep','Intermediate',
   'Preparation roadmap for Staff Selection Commission CGL — one of India\'s highest-competition exams.',
   ['Quantitative Aptitude: Number System, Algebra, Time-Work, SI/CI (RS Aggarwal)','English Grammar & Vocabulary: SP Bakshi, Neetu Singh English','Reasoning: MK Pandey Verbal & Non-Verbal Reasoning','Static GK & Current Affairs: Lucent GK + Pratiyogita Darpan monthly','Mock Tests: 4 full mocks per week + error log analysis','Tier 2 Descriptive: English Essay + Letter writing practice'],
   ['YouTube: Gagan Pratap Maths (SSC Maths god)','YouTube: Pothigai / SSC Adda','YouTube: Neetu Singh English','Testbook App — premier mock test platform','Adda247 PDF materials'],
   ['No external certification needed — SSC rank IS your credential','SSC CHSL (parallel exam with similar syllabus — good for practice)'],
   '6-8 months'],

  ['Cybersecurity Mastery','Security','Advanced',
   'Complete Ethical Hacking, Network Security, and Penetration Testing roadmap. From zero to security professional.',
   ['Networking & TCP/IP Basics: OSI Model, DNS, HTTP/HTTPS, Firewalls','Linux Command Line: Bash scripting, file permissions, process management','Vulnerability Assessment: Nmap, Nessus, Metasploit framework','Penetration Testing: Kali Linux, Burp Suite, OWASP Top 10','Web App Security: XSS, SQL Injection, CSRF, Auth flaws','Bug Bounty: HackerOne and Bugcrowd practice + report writing'],
   ['YouTube: NetworkChuck (highly engaging content)','YouTube: David Bombal','YouTube: John Hammond (CTF walkthroughs)','TryHackMe.com — structured learning paths','HackTheBox.com — advanced real-world CTF challenges'],
   ['CompTIA Security+ (SY0-701) — ₹15,000, globally recognized','CEH (Certified Ethical Hacker) — EC-Council, ₹30,000','CEH Practical — hands-on exam','OSCP (Offensive Security Certified Professional) — most respected, ₹1,20,000','eJPT (eLearnSecurity Junior Penetration Tester) — affordable beginner cert'],
   '6-8 months'],

  ['Python Programming','Programming','Beginner-Advanced',
   'Master Python from fundamentals to Data Science, AI, and Web Development. Python is the world\'s most versatile language.',
   ['Install Python 3 + VS Code or PyCharm IDE','Variables, Data Types, Control Flow, Functions, OOP (Classes and Inheritance)','Data Structures: Lists, Dicts, Sets, Tuples — algorithmic thinking','Libraries: NumPy, Pandas for data | Requests, FastAPI for web','Projects: Web scraper, Data dashboard, REST API, ML predictor','Advanced: Async Python, Decorators, Generators, Type Hints'],
   ['YouTube: Programming with Mosh — best for absolute beginners','YouTube: Corey Schafer — deep Python concepts','Real Python (realpython.com) — article-based practical learning','Official Python Docs (python.org)','Coursera: Python for Everybody — University of Michigan (free audit)'],
   ['PCEP — Certified Entry-Level Python Programmer (Python Institute, ₹5,000)','PCAP — Certified Associate in Python Programming','Google IT Automation with Python (Coursera, free audit)','IBM Python for Data Science AI & Development (Coursera)','Microsoft Python Developer Certification (AZ-204 relevant skills)'],
   '3 months'],

  ['Machine Learning','AI/ML','Intermediate',
   'Learn ML algorithms, statistical modeling, and build real predictive models. The foundation of modern AI careers.',
   ['Math Foundation: Linear Algebra (matrices, vectors), Statistics (distributions, hypothesis testing)','Python for ML: NumPy, Pandas, Matplotlib, Seaborn — data wrangling and visualization','Supervised Learning: Linear Regression, Logistic Regression, Decision Trees, Random Forest, XGBoost','Unsupervised Learning: K-Means Clustering, PCA, DBSCAN','Deep Learning Basics: Neural Networks, Backpropagation, Activation Functions','Build & Deploy: Scikit-learn pipelines → Pickle/ONNX model export → FastAPI deployment'],
   ['YouTube: Krish Naik — most comprehensive ML tutorials in Hindi/English','YouTube: StatQuest with Josh Starmer — intuitive explanations of statistics and ML','Coursera: Machine Learning Specialization by Andrew Ng (Stanford/DeepLearning.ai)','Kaggle: Free courses, competitions, datasets, notebooks','fast.ai — practical DL approach, top-down learning'],
   ['Google Machine Learning Crash Course (free)','DeepLearning.ai Machine Learning Specialization Certificate (Coursera)','IBM Machine Learning Professional Certificate (Coursera)','Microsoft Azure AI-900 (AI Fundamentals) — ₹4,500','TensorFlow Developer Certificate — Google, ₹10,000'],
   '6 months'],

  ['React.js & Frontend','Web Development','Beginner',
   'Build modern, performant web applications with React.js and its ecosystem. The most in-demand frontend framework globally.',
   ['HTML5, CSS3, Flexbox, Grid — the web\'s building blocks','JavaScript ES6+: Let/Const, Arrow Functions, Promises, Async/Await, Destructuring','React Fundamentals: Components, JSX, Props, State, Event Handling','React Hooks: useState, useEffect, useContext, useReducer, Custom Hooks','React Router v6: SPA Navigation and protected routes','State Management: Zustand or Redux Toolkit for complex apps'],
   ['YouTube: Codevolution — best structured React courses','YouTube: Namaste JavaScript (Akshay Saini) — deep JavaScript mastery','YouTube: Web Dev Simplified — practical project tutorials','Official React Docs (react.dev) — excellently written','Frontend Mentor (frontendmentor.io) — real-world UI challenges'],
   ['Meta Front-End Developer Professional Certificate (Coursera, free audit)','freeCodeCamp JavaScript Algorithms & Data Structures Certification (free)','React TypeScript Masterclass (Udemy, ₹499 sale)','The Odin Project — free full-stack curriculum with React path','Google Mobile Web Specialist (advanced, $99)'],
   '3 months'],

  ['Data Structures & Algorithms','Computer Science','Intermediate',
   'Master DSA to crack coding interviews at FAANG, product companies, and competitive programming. The most critical skill for CS careers.',
   ['Arrays & Strings: Sliding Window, Two Pointers, Prefix Sum patterns','Linked Lists, Stacks, Queues: Implementation + classic interview problems','Trees & Graphs: DFS, BFS, Dijkstra, Binary Trees, BST operations','Sorting & Searching: Merge Sort, Quick Sort, Binary Search variants','Dynamic Programming: Memoization, Tabulation, Classic DP problems (LCS, LIS, Knapsack)','System Design Basics: High-level design, Load Balancing, Caching, Databases'],
   ['YouTube: Take U Forward (Striver) — A-Z DSA Sheet, most comprehensive','YouTube: NeetCode — optimal LeetCode solutions with clean explanations','LeetCode.com — 2000+ problems, practice minimum 150 before interviews','GeeksForGeeks.org — theory + implementations','Codeforces — competitive programming contests for speed'],
   ['IITM BSc Computer Science Certification (affordable online degree path)','Coding Ninjas DSA with Java/Python Course Certificate','Coursera: Algorithms Specialization (Stanford, Robert Sedgewick)','HackerRank Problem Solving Certificate (Gold Badge — recognized in resumes)','LeetCode achievements visible on profile — not formal certs but widely recognized'],
   '4-6 months'],

  ['AWS Cloud & DevOps','Cloud Computing','Intermediate',
   'Become a certified AWS cloud practitioner and architect. Cloud skills are the single highest-ROI technology investment for your career.',
   ['Linux Fundamentals: File system, permissions, processes, bash scripting — essential pre-req','Networking & IAM: VPCs, Security Groups, IAM Roles, Policies','Core AWS Services: EC2 (compute), S3 (storage), RDS (databases), Lambda (serverless)','Docker Containers: Dockerfile, docker-compose, image builds, container networking','Kubernetes Orchestration: Pods, Deployments, Services, Ingress, Helm charts','CI/CD Pipelines: GitHub Actions, Jenkins, ArgoCD — automate everything'],
   ['YouTube: Abhishek Veeramalla — best DevOps Hindi/English content','YouTube: TechWorld with Nana — best overall DevOps and Kubernetes','AWS Skill Builder (free) — official AWS training platform','KodeKloud.com — hands-on labs for DevOps tools','A Cloud Guru (now Pluralsight) — comprehensive cloud learning'],
   ['AWS Cloud Practitioner CLF-C02 — ₹8,000, START HERE','AWS Solutions Architect Associate SAA-C03 — ₹8,000, most in-demand cert','AWS Developer Associate DVA-C02 — ₹8,000','Microsoft AZ-900 Azure Fundamentals — ₹3,600','Google Associate Cloud Engineer — ₹10,500','CKA (Certified Kubernetes Administrator) — ₹35,000, highly valued'],
   '4 months'],

  ['Full Stack Node.js','Backend Development','Beginner',
   'Build scalable, production-grade RESTful APIs and web applications with Node.js, Express, and databases.',
   ['JavaScript Async: Callbacks → Promises → Async/Await — understanding the event loop','Express.js Framework: Routing, Middleware, Error handling, Request validation','MongoDB & Mongoose: Schema design, CRUD operations, aggregation pipeline','PostgreSQL + Sequelize: Relational database design, joins, transactions','REST API Design: HTTP methods, status codes, pagination, rate limiting','JWT Authentication + OAuth2: User sessions, refresh tokens, role-based access control'],
   ['YouTube: Traversy Media — best practical Node.js projects','YouTube: Hitesh Choudhary (Chai aur Code) — modern JS and backend','YouTube: Fireship — concise high-quality web dev content','The Odin Project (theodinproject.com) — free full-stack curriculum','Node.js Official Docs (nodejs.org) — comprehensive reference'],
   ['IBM Full Stack Cloud Developer Professional Certificate (Coursera)','Meta Back-End Developer Professional Certificate (Coursera)','Node.js Services Developer OpenJS Foundation Certification','freeCodeCamp Back End Development & APIs Certification (free)','AWS Certified Developer Associate (for cloud deployment knowledge)'],
   '3 months'],

  ['Artificial Intelligence (AI)','AI/ML','Advanced',
   'Master Deep Learning, Large Language Models (LLMs), Generative AI, and build production-grade AI systems. The frontier of computing.',
   ['Neural Network Mathematics: Matrix multiplication, Chain rule, Gradients, Backpropagation from scratch','TensorFlow & PyTorch: Building, training, and saving deep learning models','Computer Vision: CNNs, ResNet, YOLO, Transfer Learning, Image classification pipelines','Natural Language Processing: Transformers, BERT, GPT architecture, Tokenization, Attention mechanism','LLMs & Generative AI: Prompt Engineering, OpenAI API, LangChain, RAG (Retrieval-Augmented Generation)','Production AI: Fine-tuning LLMs, MLOps with MLflow/W&B, Model deployment with FastAPI + Docker','Advanced: LoRA/QLoRA fine-tuning, Vector databases (Pinecone/Chroma), AI Agents with LangGraph'],
   ['YouTube: Andrej Karpathy — Neural Networks: Zero to Hero (best DL series ever made)','YouTube: Sentdex — practical Python AI/ML projects','Hugging Face (huggingface.co) — transformer models, datasets, free notebooks','DeepLearning.ai — Andrew Ng\'s AI specializations (Coursera)','Papers With Code (paperswithcode.com) — latest AI research with implementations','fast.ai Part 1 & 2 — top-down practical deep learning (free)'],
   ['TensorFlow Developer Certificate — Google, ₹10,000 (performance-based exam)','DeepLearning.ai Deep Learning Specialization Certificate (Coursera)','DeepLearning.ai Generative AI with LLMs Certificate','Google Professional Machine Learning Engineer — ₹20,000 (advanced, high value)','IBM AI Engineering Professional Certificate (Coursera)','Microsoft Azure AI Engineer Associate (AI-102) — ₹8,000','Coursera: Prompt Engineering for ChatGPT (Vanderbilt University, free audit)'],
   '6-12 months'],

  ['UI/UX Design (Figma)','Design','Beginner',
   'Design beautiful, user-centered interfaces and experiences using Figma. The most in-demand design skill for product and startup careers.',
   ['Typography, Color Theory, Layout, White Space — visual design fundamentals','Figma Interface: Frames, Auto-layout, Components, Variables, Prototyping','User Research: Interviews, Surveys, Empathy Maps, User Personas, Journey Maps','Wireframing: Low-fidelity layouts → High-fidelity mockups progression','Design Systems: Building consistent component libraries and style guides','Usability Testing: A/B testing, user feedback integration, iteration methodology'],
   ['YouTube: Ansh Mehra — best Indian Figma and UX tutorials','YouTube: DesignCourse — excellent visual design theory and practice','YouTube: Malewicz (BRONT CHO) — advanced UI design techniques','Figma Community (figma.com/community) — free design file templates','Dribbble + Behance — portfolio inspiration and community'],
   ['Google UX Design Professional Certificate (Coursera, ₹9,000) — most recognized','Meta UX Research Fundamentals (Coursera)','Interaction Design Foundation: UX Management Course (IDF, ₹8,000/yr — access all courses)','Nielsen Norman Group UX Certification (NN/g, $690 — globally recognized, premium)','freeCodeCamp Responsive Web Design Certification (helpful HTML/CSS for designers)'],
   '3 months'],

  ['Digital Marketing','Marketing','Beginner',
   'Grow brands through SEO, SEM, social media marketing, and performance analytics. India\'s fastest-growing career field.',
   ['SEO Fundamentals: On-page, Off-page, Technical SEO, Keyword research with Ahrefs/Semrush','Google Ads (SEM): Search campaigns, Display campaigns, ROAS optimization, Quality Score','Social Media Marketing: Instagram Stories/Reels, LinkedIn B2B, YouTube Ads strategies','Email Marketing: Mailchimp/ConvertKit, segmentation, open rate optimization, automation flows','Analytics & Reporting: Google Analytics 4 (GA4), Google Search Console, UTM parameters','Content Marketing: Blog strategy, SEO content writing, video scripts, repurposing content'],
   ['YouTube: Neil Patel — digital marketing strategy (global perspective)','YouTube: WS Cube Tech — best Hindi digital marketing tutorials','Google Digital Garage (free) — official Google digital skills platform','HubSpot Academy (free) — world\'s best free marketing certifications','Moz Blog — in-depth SEO learning'],
   ['Google Digital Marketing & E-commerce Certificate (Coursera, ₹9,000)','Google Ads Certifications — FREE on Google Skillshop (Search, Display, Video, Shopping)','Google Analytics Certification (GA4) — FREE on Google Skillshop','HubSpot Content Marketing Certification (free)','HubSpot SEO Certification (free)','Meta Social Media Marketing Professional Certificate (Coursera)','Semrush SEO Toolkit Course Certificate (free)'],
   '2 months'],
];

const govtJobsData = [
  ['UPSC Civil Services Exam','Central Government','IAS/IPS/IFS Exam','Graduation required, age 21-32','Prestigious Central government exam for administrative services','upsc.gov.in','GS Paper I: History, Geography, Society | GS Paper II: Polity, Governance, IR | GS Paper III: Economy, Technology, Environment | GS Paper IV: Ethics | Optional Subject','Prelims (MCQ) + Mains (Descriptive 9 Papers) + Personality Interview','NCERT Class 6-12, M. Laxmikanth Indian Polity, Bipin Chandra History, Ramesh Singh Economy, Shankar IAS Environment','{"start":"Feb 2025","end":"Mar 2025","exam":"Jun 2025","pyqs":[{"year":"2024","url":"https://www.embibe.com/exams/upsc-civil-services-previous-year-question-papers/","label":"GS Paper I & II 2024"},{"year":"2023","url":"https://testbook.com/upsc-ias/previous-year-papers","label":"UPSC GS Papers 2023"},{"year":"2022","url":"https://www.embibe.com/exams/upsc-civil-services-previous-year-question-papers/","label":"GS Paper I 2022"},{"year":"2021","url":"https://www.careers360.com/upsc-question-paper","label":"UPSC Prelims 2021"},{"year":"2019-2020","url":"https://www.getmyuni.com/articles/upsc-previous-year-papers","label":"UPSC 2019-2020 All Papers"}]}'],
  ['SSC CGL','Central Government','Staff Selection Commission CGL','Graduation, age 18-32','Combined Graduate Level exam for Group B and C posts','ssc.nic.in','Tier 1: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension | Tier 2: Paper I (Math & Reasoning), Paper II (English Language & Comprehension)','Tier 1 + Tier 2 (Computer Based) + Tier 3 (Descriptive)','Kiran SSC Maths Chapterwise, Lucent General Knowledge, RS Aggarwal Quantitative Aptitude, SP Bakshi English, Neetu Singh English','{"start":"Jan 2025","end":"Feb 2025","exam":"Apr 2025","pyqs":[{"year":"2024","url":"https://ssc.nic.in/Portal/PaperAnalysis","label":"SSC CGL 2024 Paper Analysis"},{"year":"2023","url":"https://www.sscresult.mzn.in/ssc-cgl-question-paper/","label":"SSC CGL 2023 PYQs"},{"year":"2022","url":"https://testbook.com/ssc-cgl/previous-year-papers","label":"SSC CGL 2022 PYQs"}]}'],
  ['RRB NTPC','Railways','Railway Recruitment Board NTPC','10+2 / Graduation, age 18-33','Non-Technical Popular Category posts in Railways','rrbcdg.gov.in','Mathematics: Number System, HCF/LCM, Decimals, Ratio & Proportion, Percentages, Time & Work | General Intelligence: Analogies, Alphabetical Series, Coding-Decoding | General Awareness: Science, Current Events, History','CBT Stage 1 (MCQ 100 Qs) + CBT Stage 2 + CBAT/Skill Test','Arihant RRB NTPC Complete Guide, Lucent GK, RD Sharma, Previous Year Papers','{"start":"Mar 2025","end":"Apr 2025","exam":"Jul 2025","pyqs":[{"year":"2022","url":"https://railwayrecruitment.org/rrb-ntpc-question-paper","label":"RRB NTPC 2022 PYQs"},{"year":"2021","url":"https://testbook.com/rrb-ntpc/previous-year-papers","label":"RRB NTPC 2021 PYQs"}]}'],
  ['IBPS PO','Banking','Institute of Banking Personnel Selection PO','Graduation, age 20-30','Probationary Officer in Public Sector Banks','ibps.in','Prelims: English (30 Qs), Quantitative Aptitude (35 Qs), Reasoning Ability (35 Qs) | Mains: Reasoning & Computer Aptitude, English, Data Analysis, General Economy & Banking Awareness','Prelims (1 hr) + Mains (3 hrs) + Interview','RS Aggarwal Quantitative Aptitude, M. Tyra Magical Book on Quicker Maths, Arihant IBPS PO, Banking Awareness by Arihant','{"start":"Aug 2025","end":"Sep 2025","exam":"Oct 2025","pyqs":[{"year":"2024","url":"https://www.ibps.in/common-written-examination/","label":"IBPS PO 2024 Official"},{"year":"2023","url":"https://testbook.com/ibps-po/previous-year-papers","label":"IBPS PO 2023 PYQs"}]}'],
  ['SBI PO','Banking','State Bank of India PO Exam','Graduation, age 21-30','Probationary Officer at the largest public sector bank','sbi.co.in','Prelims: English (30 Qs), Quantitative Aptitude (35 Qs), Reasoning Ability (35 Qs) | Mains: Reasoning (50 Qs), English (35 Qs), DI & Analysis (50 Qs), General Awareness (40 Qs)','Prelims + Mains + Group Exercise + Interview','Arihant SBI PO Complete Guide, Kiran Mock Tests, Dream Big Institute Material, Previous Papers','{"start":"Sep 2025","end":"Oct 2025","exam":"Nov 2025","pyqs":[{"year":"2024","url":"https://sbi.co.in/web/careers/recruitment-processes","label":"SBI PO 2024 Papers"},{"year":"2023","url":"https://testbook.com/sbi-po/previous-year-papers","label":"SBI PO 2023 PYQs"}]}'],
  ['NDA Exam','Defence','National Defence Academy Exam','10+2 (PCM for Navy/AF), age 16.5-19.5','Entry to National Defence Academy for Army, Navy, Air Force','upsc.gov.in','Mathematics: Algebra, Matrices, Trigonometry, Differential Calculus, Integral Calculus, Differential Equations, Vectors, Statistics | General Ability: English (200 marks), GK: Physics, Chemistry, Social Studies, Geography, Current Events','Written Exam (900 marks) + SSB Interview (900 marks)','RS Aggarwal Mathematics, Pathfinder NDA/NA by Arihant, R.D. Sharma, Lucent GK, NCERT Class 11-12','{"start":"Jan 2025","end":"Feb 2025","exam":"Apr 2025","pyqs":[{"year":"2024","url":"https://www.upsc.gov.in/examinations/active-examinations/nda-na-2024","label":"NDA 2024 Official"},{"year":"2023","url":"https://testbook.com/nda/previous-year-papers","label":"NDA 2023 PYQs"},{"year":"2022","url":"https://www.careerpower.in/nda-previous-year-paper.html","label":"NDA 2022 PYQs"}]}'],
  ['NEET UG','Medical','National Eligibility cum Entrance Test','10+2 with PCB, age no bar','Admission to MBBS, BDS, AYUSH courses','neet.nta.nic.in','Physics: Physical World, Kinematics, Laws of Motion, Work & Energy, Gravitation, Thermodynamics, Waves, Optics, Modern Physics | Chemistry: Basic Concepts, Equilibrium, Organic Chemistry, Coordination Compounds | Biology: Cell Biology, Genetics, Evolution, Human Physiology, Plant Physiology, Ecology','Single Paper MCQ (180 questions, 720 marks, 3 hours 20 minutes)','NCERT Biology Class 11-12, Truemans Elementary Biology, DC Pandey Physics, NCERT Exemplar, Allen/Aakash Study Material','{"start":"Dec 2024","end":"Mar 2025","exam":"May 2025","pyqs":[{"year":"2024","url":"https://neet.nta.nic.in/","label":"NEET 2024 Official PYQs"},{"year":"2023","url":"https://testbook.com/neet/previous-year-papers","label":"NEET 2023 PYQs"},{"year":"2022","url":"https://www.embibe.com/exams/neet-previous-year-question-papers/","label":"NEET 2022 PYQs"}]}'],
  ['JEE Main','Engineering','Joint Entrance Examination Main','10+2 with PCM, age no bar','Admission to IITs, NITs, IIITs, CFTIs','jeemain.nta.nic.in','Mathematics: Sets, Relations, Complex Numbers, Matrices, Permutations, Binomial Theorem, Sequences, Limits, Differential Calculus, Integral Calculus, Coordinate Geometry, 3D Geometry, Vectors, Statistics, Probability | Physics: Mechanics, Thermodynamics, Electrostatics, Magnetism, Optics, Modern Physics | Chemistry: Organic (Reactions & Mechanisms), Inorganic (Periodic Table, Bonding), Physical (Equilibrium, Electrochemistry)','Session 1 (January) + Session 2 (April), Computer Based Test (CBT) — 90 Questions, 300 Marks, 3 Hours','NCERT Class 11-12, HC Verma Concepts of Physics (Vol 1 & 2), RD Sharma Mathematics, MS Chouhan Organic Chemistry, NCERT Exemplar, Cengage Series, DC Pandey Optics','{"start":"Nov 2024","end":"Nov 2024","exam":"Jan 2025","pyqs":[{"year":"2024 Session 1","url":"https://jeemain.nta.nic.in/webinfo2024/File/GetFile?FileId=2&LangId=P","label":"JEE Main Jan 2024 Paper"},{"year":"2024 Session 2","url":"https://jeemain.nta.nic.in/webinfo2024/File/GetFile?FileId=3&LangId=P","label":"JEE Main Apr 2024 Paper"},{"year":"2023 Session 1","url":"https://cdn1.digialm.com//per/g01/pub/2370/touchstone/AssessmentQPHTMLMode1//2370O230155/2370O230155S18D16619/2370O230155S18D16619E1.html","label":"JEE Main Jan 2023 Shift 1"},{"year":"2022","url":"https://testbook.com/jee-main/previous-year-papers","label":"JEE Main 2022 All Shifts"},{"year":"2021","url":"https://www.vedantu.com/jee-main/jee-main-question-papers-2021","label":"JEE Main 2021 PYQs"},{"year":"2019-2020","url":"https://www.careers360.com/jee-main-previous-year-question-papers","label":"JEE Main 2019-20 PYQs"}]}'],
  ['GATE','Engineering/Postgrad','Graduate Aptitude Test in Engineering','BE/BTech or MSc, age no bar','Postgraduate admissions to IITs/NITs and PSU recruitments','gate.iitd.ac.in','Engineering Mathematics: Linear Algebra, Calculus, Differential Equations, Complex Variables, Probability & Statistics, Numerical Methods, Transform Theory | Subject Paper: CS/ECE/ME/CE/EE (respective topics)','MCQ + Multiple Select Questions + Numerical Answer Type — 65 Questions, 100 Marks, 3 Hours','Ace Academy GATE Study Material, Made Easy GATE Books, GATE Previous Year Papers by Subject, Arihant GATE Chapter-wise Solutions','{"start":"Sep 2025","end":"Oct 2025","exam":"Feb 2026","pyqs":[{"year":"2024","url":"https://gate2024.iisc.ac.in/previous-year-question-papers/","label":"GATE 2024 PYQs (Official IISc)"},{"year":"2023","url":"https://gate.iitk.ac.in/2023/question_papers.html","label":"GATE 2023 All Branches"},{"year":"2022","url":"https://testbook.com/gate/previous-year-papers","label":"GATE 2022 PYQs"}]}'],
  ['TNPSC Group II','Tamil Nadu State','TNPSC Group II Services','Graduation, age 18-42 (relaxed for reserved)','State civil services posts in Tamil Nadu government','tnpsc.gov.in','General Studies: History, Culture, Geography, Polity, Economics, Science, Current Affairs | Tamil Language (Eligibility) | Aptitude & Mental Ability Test (AMAT)','Prelims (Objective 200 Marks) + Mains (Descriptive 300 Marks) + Oral Test','Sura TNPSC Books, Samacheer Kalvi Books (Class 6-12), Current Affairs Tamil, Dinamani, Admin Guide Tamil','{"start":"Dec 2024","end":"Jan 2025","exam":"Mar 2025","pyqs":[{"year":"2023","url":"https://www.tnpsc.gov.in/previous-questions.html","label":"TNPSC Group II 2023 Official"},{"year":"2022","url":"https://testbook.com/tnpsc-group-2/previous-year-papers","label":"TNPSC Group II 2022 PYQs"}]}'],
  ['TNPSC Group IV','Tamil Nadu State','TNPSC Group IV Exam','10+2, age 18-40','District level posts: VAO, Junior Assistants, Typists','tnpsc.gov.in','General Studies: History, Culture & Heritage of Tamil Nadu, Indian Polity, Indian Economy, General Science | Tamil Eligibility Test | AMAT: Aptitude, Mental Ability, Numerical Reasoning','Single Objective Type Exam (200 marks, 200 Questions, 3 Hours)','Sura TNPSC Group IV Complete Guide, TNPSC Previous Papers 2015-2024, Samacheer Books','{"start":"Feb 2025","end":"Mar 2025","exam":"May 2025","pyqs":[{"year":"2024","url":"https://www.tnpsc.gov.in/previous-questions.html","label":"TNPSC Group IV 2024 Official"},{"year":"2023","url":"https://testbook.com/tnpsc-group-4/previous-year-papers","label":"TNPSC 2023 PYQs"}]}'],
  ['Kerala PSC LDC','Kerala State','Kerala PSC Lower Division Clerk','10+2, age 18-41','Lower Division Clerk posts in Kerala Government','keralapsc.gov.in','General Knowledge: History, Polity, Geography, Economics, Science | Simple Arithmetic: Number Theory, Percentages, Profit & Loss | English: Grammar, Comprehension | Malayalam: Language Proficiency','OMR Based Written Test (100 Marks) + Practical Test (Typing)','Saras Publications LDC Guide, Mathrubhumi Daily Current Affairs, Arihant Kerala PSC, Previous Year OMR Papers','{"start":"Jan 2025","end":"Feb 2025","exam":"Apr 2025","pyqs":[{"year":"2024","url":"https://keralapsc.gov.in/question-papers","label":"Kerala PSC LDC 2024 Official"},{"year":"2022","url":"https://testbook.com/kerala-psc/previous-year-papers","label":"Kerala PSC 2022 PYQs"}]}'],
  ['MPSC','Maharashtra State','Maharashtra Public Service Commission','Graduation, age 21-38','Maharashtra state services posts','mpsc.gov.in','GS Paper I: History, Heritage, Culture | GS Paper II: Constitution, Governance, Social Justice | GS Paper III: Economy, Technology, Environment | CSAT: Reasoning, Comprehension','Prelims (400 marks) + Mains (4 papers, 800 marks) + Interview','Unique Features MPSC Books Series, Vivek Patil Economy Books, Laxmikanth Polity (Marathi), MPSC Previous Year Papers','{"start":"Nov 2024","end":"Dec 2024","exam":"Feb 2025","pyqs":[{"year":"2024","url":"https://mpsc.gov.in/downloadFile/previous-question-papers","label":"MPSC 2024 Papers"},{"year":"2023","url":"https://testbook.com/mpsc/previous-year-papers","label":"MPSC 2023 PYQs"}]}'],
  ['RPSC RAS','Rajasthan State','Rajasthan Administrative Services','Graduation, age 21-40','Administrative posts in Rajasthan state','rpsc.rajasthan.gov.in','History: Ancient, Medieval, Modern Indian History & Rajasthan History | Geography: India & Rajasthan | Polity & Governance | Economy: Indian & Rajasthan | Science & Technology | Current Affairs','Prelims (200 marks) + Mains (4 papers, 800 marks) + Interview','Arihant RAS Complete Study Package, RPSC Previous Papers 2013-2023, Rajasthan GK by Ratan Lal','{"start":"Mar 2025","end":"Apr 2025","exam":"Jun 2025","pyqs":[{"year":"2023","url":"https://rpsc.rajasthan.gov.in/Old-Question-Papers","label":"RPSC RAS 2023 Official"},{"year":"2021","url":"https://testbook.com/rpsc-ras/previous-year-papers","label":"RPSC RAS 2021 PYQs"}]}'],
  ['Karnataka PSC KPSC','Karnataka State','Karnataka Public Service Commission','Graduation, age 21-35','Group A, B, C services in Karnataka government','kpsc.kar.nic.in','General Studies: History (Indian & Karnataka), Geography, Constitution & Polity, Economy, Science & Technology | Current Affairs | Kannada Language Test','Prelims (150 marks) + Mains (1200 marks) + Kannada Test + Interview','Unique Publication KPSC Series, Samanya Jnana Karnataka (Kannada), Bangalore KPSC Coaching Notes','{"start":"May 2025","end":"Jun 2025","exam":"Sep 2025","pyqs":[{"year":"2024","url":"https://kpsc.kar.nic.in/previous-question-papers","label":"KPSC 2024 Official"},{"year":"2023","url":"https://testbook.com/kpsc/previous-year-papers","label":"KPSC 2023 PYQs"}]}'],
  ['DRDO CEPTAM','Defence Research','DRDO Scientist & Technician Entry','BTech/BEng/MSc, age 18-28','Scientists and technicians at DRDO laboratories','drdo.gov.in','Domain Subject Paper (CS/ECE/ME/AE/Physics/Chemistry based on post) | General Aptitude: Reasoning, Quantitative Ability, English, GK','Written Test (CBT, 150 marks) + Skills/Document Verification + Interview for Scientists','Ace Academy GATE Books, Made Easy DRDO Booklets, Subject Textbooks, Previous DRDO CEPTAM Papers','{"start":"Feb 2025","end":"Mar 2025","exam":"Jun 2025","pyqs":[{"year":"2023","url":"https://www.drdo.gov.in/previous-question-papers","label":"DRDO CEPTAM 2023 Official"},{"year":"2022","url":"https://testbook.com/drdo-ceptam/previous-year-papers","label":"DRDO CEPTAM 2022 PYQs"}]}'],
  ['ISRO Scientist/Engineer','Space Research','ISRO Recruitment','BTech/BE in relevant discipline','Scientists and engineers at Indian Space Research Organisation','isro.gov.in','Technical Subject (Based on Branch: CS, ECE, EE, ME, AE etc.) | Aptitude: Quantitative Reasoning, Analytical Ability | GK: Space & Technology Current Affairs','Written Exam (80 Marks) + Technical Interview + Medical','GATE Books (Branch-specific), ISRO Previous Question Papers, Ace Academy, Ghatna Chakra Science & Technology','{"start":"Jun 2025","end":"Jul 2025","exam":"Sep 2025","pyqs":[{"year":"2023","url":"https://www.isro.gov.in/Exam.html","label":"ISRO 2023 Official Exam Page"},{"year":"2022","url":"https://testbook.com/isro/previous-year-papers","label":"ISRO 2022 PYQs"}]}'],
  ['NABARD Grade A','Banking','National Bank for Agriculture & Rural Development','Graduation, age 21-30','Development banking and rural finance posts','nabard.org','Prelims: Reasoning (20), English (40), Computer Knowledge (20), Quantitative (20), Economic & Social Issues (40), Agriculture (40) | Mains: Economic & Social Issues, Agriculture & Rural Development, English','Prelims (200 marks) + Mains (100 marks) + Interview','NABARD Grade A by Arihant, Banking Awareness by Kiran, Agriculture Current Affairs, NABARD Previous Year Papers 2018-2024','{"start":"Aug 2025","end":"Sep 2025","exam":"Oct 2025","pyqs":[{"year":"2023","url":"https://testbook.com/nabard-grade-a/previous-year-papers","label":"NABARD Grade A 2023 PYQs"},{"year":"2022","url":"https://www.bankersadda.com/nabard-grade-a-previous-year-papers","label":"NABARD 2022 PYQs"}]}'],
  ['SEBI Grade A','Securities','Securities and Exchange Board of India','Postgraduation/CA/CFA, age 30','Regulation of Indian capital markets','sebi.gov.in','Paper 1: Commerce, Accountancy, Management, Finance, Costing, Companies Act, Economics | Paper 2: IT, Research, Legal (based on post) | English: Writing, Comprehension','Phase 1 Online Test (2 hours) + Phase 2 (2 papers) + Interview','ICSI SEBI Study Material, SEBI Annual Reports, Zerodha Varsity, Financial Regulatory Framework Books, SEBI PYQs','{"start":"Jan 2025","end":"Feb 2025","exam":"Mar 2025","pyqs":[{"year":"2023","url":"https://testbook.com/sebi-grade-a/previous-year-papers","label":"SEBI Grade A 2023 PYQs"},{"year":"2022","url":"https://www.bankersadda.com/sebi-grade-a-previous-year-papers","label":"SEBI 2022 Papers"}]}'],
  ['Indian Army Technical','Defence','Indian Army Technical Entry','10+2 PCM 70%+, age 16.5-19.5','Technical officer entry to Indian Army','joinindianarmy.nic.in','Physics: Mechanics, Thermodynamics, Electrostatics, Magnetism, Optics, Modern Physics (CBSE Class 11-12) | Mathematics: Algebra, Trigonometry, Coordinate Geometry, Calculus, Vectors, Statistics | Chemistry: Physical, Organic, Inorganic (Class 11-12)','Written Exam (CBT) + SSB Interview (5 days) + Medical Examination','NCERT PCM Class 11-12, RS Aggarwal, Army Technical Entry Pathfinder by Arihant, SSB Interview by Chadha','{"start":"Apr 2025","end":"May 2025","exam":"Jun 2025","pyqs":[{"year":"2024","url":"https://joinindianarmy.nic.in/writereaddata/Portal/Notifications","label":"Indian Army Technical 2024 Official"},{"year":"2023","url":"https://testbook.com/indian-army/previous-year-papers","label":"Army Technical 2023 PYQs"}]}'],
];

const scholarshipsData = [
  ['National Scholarship Portal (NSP)','Ministry of Education','Government','₹12,000–₹25,000/year','Income < 2.5 LPA, 50%+ marks','All India','Oct 31, 2025','scholarships.gov.in','Central government scholarship portal for SC/ST/OBC/Minority/Disabled students'],
  ['Prime Minister Scholarship Scheme','Ministry of Home Affairs','Government','₹2,500–₹3,000/month','Children of ex-servicemen, income < 6 LPA','All India','Nov 30, 2025','scholarships.gov.in','For wards of ex-Coast Guard and Police personnel martyred in naxal attacks'],
  ['Pragati Scholarship for Girls','AICTE','Government','₹50,000/year','Girls in technical education, family income < 8 LPA','All India','Dec 15, 2025','aicte-pragati-scho-nic.in','AICTE scholarship for girl students pursuing diploma/degree in technical institutes'],
  ['Saksham Scholarship','AICTE','Government','₹50,000/year','Students with 40%+ disability in technical courses','All India','Dec 15, 2025','aicte-saksham-nic.in','For differently abled students in AICTE-approved technical institutions'],
  ['HDFC Bank Parivartan Scholarship','HDFC Bank','Private','₹75,000/year','10+2 pass, family income < 2.5 LPA','All India','Aug 31, 2025','hdfcbank.com/parivartan','For meritorious students from underprivileged backgrounds'],
  ['Tata Capital Pankh Scholarship','Tata Capital','Private','₹10,000–₹20,000/year','Class 11-UG, marks 60%+, income < 2.5 LPA','All India','Sep 15, 2025','tatacapital.com','For students transitioning from secondary to higher education'],
  ['Buddy4Study Scholarships','Buddy4Study','Private','Various','Based on eligibility of each scholarship','All India','Ongoing','buddy4study.com','Aggregator platform for 1400+ scholarships from govt & private sources'],
  ['Sitaram Jindal Scholarship','Sitaram Jindal Foundation','Private','₹800–₹3,000/month','50%+ in last exam, income < 2.5 LPA','All India','Mar 31, 2025','sitaramjindalfoundation.org','For students in pre-university, graduation, postgrad courses'],
  ['Narotam Sekhsaria Foundation Scholarship','NSF','Private','₹3–4 Lakh total','Postgraduation abroad/India, merit-based','All India','Feb 28, 2025','nsf.org.in','Prestigious scholarship for high-achieving students for postgrad education'],
  ['TATAMOTORS Scholarship','Tata Motors','Private','₹50,000/year','Engineering students, top 10% in class','All India','Oct 31, 2025','tata.com','Merit scholarship for engineering students in top institutions'],
  ['Tamil Nadu Chief Minister Merit Scholarship','Tamil Nadu Government','Government','₹25,000/year','Tamil Nadu students, 90%+ in HSC','Tamil Nadu','Aug 31, 2025','tn.gov.in/scholarship','Merit-based scholarship for outstanding Tamil Nadu Board students'],
  ['Tamil Nadu SC/ST Scholarship','Tamil Nadu Govt Adi Dravidar Welfare','Government','₹1,200–₹3,000/month','SC/ST students in Tamil Nadu, pursuing higher education','Tamil Nadu','Ongoing','adwelfare.tn.gov.in','Monthly stipend for Scheduled Caste and Tribe students in Tamil Nadu'],
  ['Tamil Nadu Minority Scholarship','Tamil Nadu Minority Welfare Dept','Government','₹3,000–₹10,000/year','Minority students (Muslim, Christian, Sikh, etc.) in Tamil Nadu','Tamil Nadu','Sep 30, 2025','minority.tn.gov.in','Scholarship for minority community students pursuing higher studies'],
  ['Maharashtra State Merit Scholarship','Maharashtra Government','Government','₹15,000–₹30,000/year','Maharashtra students, SSC/HSC 75%+','Maharashtra','Nov 30, 2025','mahadbt.maharashtra.gov.in','Scholarship for meritorious students under MahaDBT portal'],
  ['Rajiv Gandhi National Fellowship','UGC','Government','₹25,000–₹28,000/month + HRA','SC/ST students pursuing MPhil/PhD','All India','Mar 31, 2025','ugc.ac.in','Research fellowship for SC/ST students pursuing full-time research'],
  ['JN Tata Endowment','JN Tata Endowment','Private','₹3–10 Lakh','Pursuing higher studies abroad, merit-based','All India','Mar 15, 2025','jntataendowment.org','For outstanding Indian students going abroad for higher studies'],
  ['Chevening Scholarship UK','UK Government','Foreign','Full funding','Masters in UK, work experience, leadership qualities','All India','Nov 5, 2025','chevening.org','Prestigious UK government scholarship for future leaders'],
  ['Fulbright-Nehru Scholarship','US Government','Foreign','Full funding','Graduate study/research in USA','All India','Jul 15, 2025','usief.org.in','US-India educational foundation scholarship for postgraduate study'],
  ['KVPY Scholarship','DST India','Government','₹5,000–₹7,000/month','11th-1st year students in science courses','All India','Ongoing','kvpy.iisc.ernet.in','Kishore Vaigyanik Protsahan Yojana for science stream students'],
  ['Dr Ambedkar Central Sector Scholarship','Ministry of Social Justice','Government','₹12,000–₹20,000/year','OBC/EWS students, income < 2.5 LPA, 60%+ marks','All India','Oct 31, 2025','socialjustice.gov.in','Scholarship for SC/OBC students pursuing technical and professional education'],
];

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE PRIVATE JOBS (1000+)
// ─────────────────────────────────────────────────────────────────────────────
function generateJobs() {
  let count = 0;

  const stmt = db.prepare(`INSERT INTO jobs 
    (title, company, sector, location, salary_range, job_type, description, skills_required, apply_link, posted_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  // For each title × companies, generate unique postings
  for (let ti = 0; ti < jobTitles.length; ti++) {
    const title = jobTitles[ti];
    const numPostings = Math.ceil(1000 / jobTitles.length) + 3;

    for (let pi = 0; pi < numPostings && count < 1200; pi++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const sector = sectors[Math.floor(Math.random() * sectors.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const minSal = (Math.floor(Math.random() * 20) + 3) * 100000;
      const maxSal = minSal + (Math.floor(Math.random() * 10) + 2) * 100000;
      const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
      const skills = ['Communication', 'Teamwork', 'Problem Solving', 'Domain Knowledge'];
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

      stmt.run(
        title,
        company,
        sector,
        location,
        `₹${(minSal / 100000).toFixed(1)}–${(maxSal / 100000).toFixed(1)} LPA`,
        jobType,
        `We are looking for a skilled ${title} to join ${company}'s ${sector} team in ${location}. You will work on cutting-edge projects and collaborate with a high-performing team.`,
        JSON.stringify(skills),
        `https://jobs.${company.toLowerCase().replace(/[^a-z]/g, '')}.com/${title.toLowerCase().replace(/\s+/g, '-')}`,
        date
      );
      count++;
    }
  }

  stmt.finalize(() => console.log(`✅ Jobs seeded: ${count}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE INTERNSHIPS (500+)
// ─────────────────────────────────────────────────────────────────────────────
function generateInternships() {
  const internshipTitles = [
    'Software Development Intern','Data Science Intern','Marketing Intern','UI/UX Design Intern',
    'Business Analyst Intern','Finance Intern','HR Intern','Digital Marketing Intern',
    'Content Writing Intern','Product Management Intern','Operations Intern','Research Intern',
    'Machine Learning Intern','Cloud Engineering Intern','Cybersecurity Intern','Android Dev Intern',
    'Full Stack Development Intern','Graphic Design Intern','Sales Intern','Consulting Intern',
    'AI Research Intern','Blockchain Developer Intern','Game Development Intern','Data Engineering Intern',
    'Quantitative Analyst Intern','DevOps Intern','Growth Hacker Intern','SEO/SEM Intern',
  ];
  const durations = ['1 month','2 months','3 months','6 months', '12 months'];
  const types = ['Remote','On-site','Hybrid'];
  
  const internCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'SpaceX',
    'TCS', 'Infosys', 'Wipro', 'HCLTech', 'Tech Mahindra', 'Cognizant', 'Capgemini',
    'Zoho', 'Freshworks', 'Postman', 'BrowserStack', 'Chargebee', 'Razorpay', 'Paytm',
    'Zomato', 'Swiggy', 'Flipkart', 'Myntra', 'Ola', 'Uber', 'Airbnb', 'Spotify',
    'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Deloitte', 'PwC', 'EY', 'KPMG',
    'DefensOS', 'CyberOps India', 'FireEye', 'CrowdStrike'
  ];

  // Detailed per-title learning data
  const internshipDetails = {
    'Software Development Intern': {
      what_you_learn: ['Web Development fundamentals (HTML, CSS, JS)', 'Backend APIs with REST architecture', 'Database design with SQL & NoSQL', 'Version control with Git & GitHub', 'Agile/Scrum methodologies', 'Code review and testing practices'],
      prerequisites_roadmap: ['Step 1: Learn any programming language (Python/Java/JS)', 'Step 2: Learn data structures & algorithms basics', 'Step 3: Build 2-3 personal projects', 'Step 4: Learn Git & GitHub', 'Step 5: Study system design basics', 'Step 6: Practice coding on LeetCode (Easy-Medium level)'],
      syllabus: 'Web fundamentals, REST APIs, Database (SQL/NoSQL), Git, Testing, Agile'
    },
    'Data Science Intern': {
      what_you_learn: ['Python for data analysis (Pandas, NumPy)', 'Data visualization (Matplotlib, Seaborn, Tableau)', 'Machine learning with Scikit-learn', 'Statistical analysis and hypothesis testing', 'SQL for data querying', 'Jupyter Notebooks and EDA techniques'],
      prerequisites_roadmap: ['Step 1: Learn Python basics + OOP', 'Step 2: Learn statistics (mean, variance, distributions)', 'Step 3: Learn Pandas and NumPy', 'Step 4: Practice on Kaggle datasets', 'Step 5: Learn basic ML algorithms', 'Step 6: Build a data project and publish on GitHub'],
      syllabus: 'Python, Pandas, NumPy, Matplotlib, Scikit-learn, SQL, Statistics, ML Basics'
    },
    'Marketing Intern': {
      what_you_learn: ['Digital marketing strategy and campaign planning', 'SEO and SEM fundamentals', 'Social media marketing (Instagram, LinkedIn, Twitter)', 'Google Analytics and performance tracking', 'Content creation and copywriting', 'Email marketing and automation'],
      prerequisites_roadmap: ['Step 1: Complete Google Digital Garage certification (free)', 'Step 2: Learn SEO basics on Moz/HubSpot', 'Step 3: Create a blog or social media page to practice', 'Step 4: Learn Google Analytics', 'Step 5: Study successful marketing campaigns', 'Step 6: Build a portfolio with mock campaigns'],
      syllabus: 'SEO, SEM, Social Media, Google Analytics, Content Marketing, Email Marketing'
    },
    'UI/UX Design Intern': {
      what_you_learn: ['User research and persona creation', 'Wireframing and prototyping in Figma', 'Design systems and component libraries', 'Usability testing and feedback iteration', 'Information architecture', 'Accessibility and inclusive design principles'],
      prerequisites_roadmap: ['Step 1: Learn Figma basics (free on YouTube)', 'Step 2: Study design principles (color, typography, layout)', 'Step 3: Redesign 3 existing apps as practice', 'Step 4: Learn user research methods', 'Step 5: Create your Dribbble/Behance portfolio', 'Step 6: Learn basic HTML/CSS for developer handoff'],
      syllabus: 'Figma, User Research, Wireframing, Prototyping, Design Systems, Accessibility'
    },
    'Business Analyst Intern': {
      what_you_learn: ['Business requirements gathering and documentation', 'Process mapping and workflow analysis', 'Data analysis with Excel and Power BI', 'Stakeholder management techniques', 'SWOT and market analysis frameworks', 'Creating BRD, FRD, and user stories'],
      prerequisites_roadmap: ['Step 1: Learn Excel (pivot tables, VLOOKUP, charts)', 'Step 2: Learn basic SQL for data querying', 'Step 3: Study business analysis frameworks (SWOT, PEST)', 'Step 4: Get ECBA certification or complete a BA course', 'Step 5: Practice case studies and business problem solving', 'Step 6: Learn Power BI or Tableau basics'],
      syllabus: 'Requirements Analysis, Excel, Power BI, SQL, SWOT, BRD/FRD documentation'
    },
    'Finance Intern': {
      what_you_learn: ['Financial statement analysis (Balance Sheet, P&L, Cash Flow)', 'Ratio analysis and financial modeling in Excel', 'Investment appraisal techniques (NPV, IRR)', 'Budgeting and forecasting', 'Understanding capital markets and instruments', 'Corporate valuation basics'],
      prerequisites_roadmap: ['Step 1: Learn financial accounting basics', 'Step 2: Master Excel for finance (formulas, charts, modeling)', 'Step 3: Study for CFA Level 1 or NCFM certification', 'Step 4: Practice company valuation case studies', 'Step 5: Follow markets on Zerodha Varsity / NSE Learning', 'Step 6: Build a stock analysis project'],
      syllabus: 'Financial Statements, Excel Modeling, Ratio Analysis, Valuation, Capital Markets'
    },
    'Machine Learning Intern': {
      what_you_learn: ['Supervised and unsupervised learning algorithms', 'Feature engineering and data preprocessing', 'Model training, evaluation, and hyperparameter tuning', 'Deep learning with TensorFlow/PyTorch basics', 'MLOps: model deployment and monitoring', 'Working with real-world datasets on Kaggle'],
      prerequisites_roadmap: ['Step 1: Master Python + Pandas + NumPy', 'Step 2: Study statistics and linear algebra', 'Step 3: Complete Andrew Ng ML course on Coursera', 'Step 4: Implement projects on Kaggle', 'Step 5: Learn TensorFlow or PyTorch basics', 'Step 6: Deploy an ML model to a web app or API'],
      syllabus: 'Python, Scikit-learn, TensorFlow, Feature Engineering, Model Evaluation, MLOps'
    },
    'Full Stack Development Intern': {
      what_you_learn: ['React.js for frontend development', 'Node.js + Express for backend APIs', 'MongoDB and SQL databases', 'Authentication with JWT and OAuth', 'RESTful API design and integration', 'Deploying apps on Vercel, Heroku, or AWS'],
      prerequisites_roadmap: ['Step 1: Learn HTML, CSS, JavaScript fundamentals', 'Step 2: Learn React.js (components, hooks, state)', 'Step 3: Learn Node.js and Express', 'Step 4: Learn MongoDB or PostgreSQL', 'Step 5: Build a full stack project (MERN/PERN stack)', 'Step 6: Deploy your app and showcase in portfolio'],
      syllabus: 'React, Node.js, Express, MongoDB, SQL, JWT Auth, REST APIs, Deployment'
    },
    'AI Research Intern': {
      what_you_learn: ['Literature review and research paper analysis', 'Transformer architectures (BERT, GPT, LLaMA)', 'Prompt engineering and fine-tuning LLMs', 'RAG (Retrieval-Augmented Generation) systems', 'Experiment tracking with MLflow/Weights & Biases', 'Research paper writing and presentation skills'],
      prerequisites_roadmap: ['Step 1: Strong Python + ML/DL fundamentals', 'Step 2: Study transformers ("Attention is All You Need" paper)', 'Step 3: Complete Hugging Face NLP course', 'Step 4: Reproduce a research paper implementation', 'Step 5: Learn prompt engineering with OpenAI API', 'Step 6: Contribute to an open-source AI project on GitHub'],
      syllabus: 'Transformers, LLMs, RAG, Fine-tuning, Research Methods, Experiment Tracking'
    },
    'DevOps Intern': {
      what_you_learn: ['Linux system administration and shell scripting', 'Docker containerization and Docker Compose', 'Kubernetes cluster management', 'CI/CD pipelines with GitHub Actions or Jenkins', 'Infrastructure as Code with Terraform', 'Cloud platforms: AWS, Azure, or GCP basics'],
      prerequisites_roadmap: ['Step 1: Learn Linux commands and bash scripting', 'Step 2: Learn Git version control deeply', 'Step 3: Learn Docker and build containerized apps', 'Step 4: Set up a CI/CD pipeline for a personal project', 'Step 5: Learn Kubernetes basics on Minikube', 'Step 6: Get AWS Cloud Practitioner or Azure Fundamentals certified'],
      syllabus: 'Linux, Docker, Kubernetes, CI/CD, Terraform, AWS/Azure/GCP'
    }
  };

  const defaultDetails = {
    what_you_learn: ['Core industry concepts and best practices', 'Professional tools and workflows', 'Team collaboration and communication', 'Project management and delivery', 'Domain-specific technical skills', 'Real-world problem solving'],
    prerequisites_roadmap: ['Step 1: Complete a relevant course or certification', 'Step 2: Build 2-3 portfolio projects', 'Step 3: Learn Git & GitHub', 'Step 4: Practice domain-specific tools', 'Step 5: Network and apply to companies', 'Step 6: Prepare for technical/HR interview rounds'],
    syllabus: 'Industry tools, Domain skills, Team collaboration, Project delivery'
  };

  let count = 0;

  const stmt = db.prepare(`INSERT INTO internships 
    (title, company, type, stipend, duration, location, requirements, what_you_learn, prerequisites_roadmap, syllabus, link, posted_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  while (count < 1500) {
    for (let ti = 0; ti < internshipTitles.length && count < 1500; ti++) {
      const title = internshipTitles[ti];
      const company = internCompanies[Math.floor(Math.random() * internCompanies.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let stipendAmt = 0;
      if (['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Goldman Sachs', 'JPMorgan', 'Uber', 'Netflix'].includes(company)) {
        stipendAmt = Math.floor(Math.random() * 50) + 50; 
      } else if (['Zoho', 'Freshworks', 'Razorpay', 'Flipkart', 'Zomato', 'Swiggy'].includes(company)) {
        stipendAmt = Math.floor(Math.random() * 20) + 30; 
      } else {
        stipendAmt = Math.floor(Math.random() * 15) + 10; 
      }
      const stipend = `₹${stipendAmt},000/month`;
      
      const duration = durations[Math.floor(Math.random() * durations.length)];
      const location = type === 'Remote' ? 'Remote' : locations[Math.floor(Math.random() * locations.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

      const reqs = ['Pursuing B.Tech/B.E/MCA/MBA in relevant field.', 'Strong problem-solving skills.', `Experience with tools related to ${title.split(' ')[0]}.`, 'Excellent communication skills.', `Available for ${duration} duration.`].join(' • ');

      // Get specific or default learning details
      const details = internshipDetails[title] || defaultDetails;

      stmt.run(
        title, company, type, stipend, duration, location,
        reqs,
        JSON.stringify(details.what_you_learn),
        JSON.stringify(details.prerequisites_roadmap),
        details.syllabus,
        `https://careers.${company.toLowerCase().replace(/[^a-z]/g, '')}.com/internships`,
        date
      );
      count++;
    }
  }

  stmt.finalize(() => console.log(`✅ Internships seeded: ${count}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// INSERT SKILLS
// ─────────────────────────────────────────────────────────────────────────────
function seedSkills() {
  let count = 0;
  const stmt = db.prepare(`INSERT INTO skills (title, category, level, description, roadmap, resources, certifications, duration) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  skillsList.forEach(([title, category, level, description, roadmap, resources, certifications, duration]) => {
    stmt.run(title, category, level, description, JSON.stringify(roadmap), JSON.stringify(resources), JSON.stringify(certifications), duration);
    count++;
  });

  const extraCats = ['Programming', 'Cloud', 'Data Science', 'Security', 'Design', 'Marketing', 'Finance', 'Soft Skills', 'Hardware', 'Language', 'Govt Exam Prep'];
  const prefixes = ['Mastering', 'Advanced', 'Intro to', 'Applied', 'Enterprise', 'Full Stack', 'Cloud Native', 'Hands-on', 'Practical'];
  const coreTopics = ['React', 'Angular', 'Vue.js', 'Python', 'Java', 'Go', 'Rust', 'Kubernetes', 'Docker', 'AWS', 'Azure', 'GCP', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Ethical Hacking', 'Penetration Testing', 'UI/UX Design', 'DevOps', 'Blockchain', 'Smart Contracts', 'Web3', 'Data Engineering', 'IoT', 'Robotics', 'AR/VR', 'Mobile Dev', 'Flutter', 'React Native', 'Kotlin', 'Swift', 'C++', 'Embedded Systems', 'SQL', 'NoSQL', 'MongoDB', 'Redis', 'GraphQL', 'Microservices', 'System Design', 'Agile', 'Scrum', 'Digital Economics', 'SEO', 'Generative AI', 'Prompt Engineering', 'LLMOps', 'Power BI', 'Tableau', 'Excel', 'Trading', 'Financial Modeling', 'Cloud Security', 'Network Defense'];
  const suffixes = ['Development', 'Architecture', 'Engineering', 'Security', 'Fundamentals', 'Patterns', 'Mastery', 'Bootcamp', 'for Beginners', 'for Experts'];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  
  const certificationsByTopic = {
    'AWS': ['AWS Cloud Practitioner CLF-C02', 'AWS Solutions Architect Associate'],
    'Azure': ['Microsoft AZ-900 Azure Fundamentals', 'Microsoft AZ-104 Azure Administrator'],
    'GCP': ['Google Associate Cloud Engineer', 'Google Professional Cloud Architect'],
    'Kubernetes': ['CKA (Certified Kubernetes Administrator)', 'CKAD (Certified Kubernetes Application Developer)'],
    'React': ['Meta Front-End Developer Certificate (Coursera)', 'freeCodeCamp Responsive Web Design'],
    'Python': ['PCEP Python Entry Level Programmer', 'Google IT Automation with Python (Coursera)'],
    'Machine Learning': ['TensorFlow Developer Certificate (Google)', 'DeepLearning.ai ML Specialization'],
    'Deep Learning': ['TensorFlow Developer Certificate', 'DeepLearning.ai Deep Learning Specialization'],
    'Ethical Hacking': ['CEH (Certified Ethical Hacker)', 'eJPT (eLearnSecurity)'],
    'Penetration Testing': ['OSCP (Offensive Security)', 'CompTIA PenTest+'],
    'DevOps': ['AWS DevOps Engineer Professional', 'Red Hat RHCE', 'HashiCorp Terraform Associate'],
    'Docker': ['Docker Certified Associate (DCA)', 'CKA (Kubernetes related)'],
    'SQL': ['Microsoft DP-900 Azure Data Fundamentals', 'Oracle Database SQL Certified Associate'],
    'MongoDB': ['MongoDB MCBA Associate Certification', 'MongoDB University Free Courses'],
    'Blockchain': ['Certified Blockchain Developer (CBDE)', 'Ethereum Developer Certification'],
    'SEO': ['Google Analytics Certification (free)', 'Semrush SEO Certification (free)'],
    'Flutter': ['Google Associate Android Developer', 'Flutter Development Bootcamp Certificate (Udemy)'],
    'Tableau': ['Tableau Desktop Specialist', 'Tableau Certified Data Analyst'],
    'Power BI': ['Microsoft PL-300 Power BI Data Analyst', 'Microsoft DP-900 Data Fundamentals'],
    'Generative AI': ['Google Generative AI Learning Path (free)', 'DeepLearning.ai Generative AI with LLMs'],
    'Prompt Engineering': ['Vanderbilt Prompt Engineering for ChatGPT (Coursera, free audit)'],
    'Financial Modeling': ['CFA Institute Investment Foundations (free)', 'CFI Financial Modeling & Valuation Analyst (FMVA)'],
    'System Design': ['GitHub System Design Interview Preparation (community cert)', 'Educative System Design Course Certificate'],
  };
  
  const ytInstructors = ['TechWorld with Nana', 'FreeCodeCamp', 'Traversy Media', 'Academind', 'Fireship', 'NetworkChuck', 'Simplilearn', 'Edureka', 'Krish Naik', 'Striver', 'Codevolution', 'Web Dev Simplified', 'David Bombal', 'Hitesh Choudhary', 'John Hammond'];

  while(count < 1050) {
    for (let c of coreTopics) {
      if (count >= 1050) break;
      const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
      const title = `${pref} ${c} ${suff}`;
      const cat = extraCats[Math.floor(Math.random() * extraCats.length)];
      const lvl = levels[Math.floor(Math.random() * levels.length)];
      const yt = ytInstructors[Math.floor(Math.random() * ytInstructors.length)];
      
      const roadmap = ['Understand the Basics', 'Learn advanced concepts through documentation', 'Build 3 mini-projects', 'Build 1 Capstone Project', 'Prepare for Interviews / Certifications'];
      const resources = [`YouTube: ${yt}`, 'Udemy Complete Course', 'Official Documentation', 'Coursera Specialization', 'GitHub Open Source Projects'];
      const topicCerts = certificationsByTopic[c] || ['Udemy Course Completion Certificate', 'Coursera Specialization Certificate'];
      const duration = `${Math.floor(Math.random() * 6) + 1} months`;
      
      stmt.run(title, cat, lvl,
        `Complete guide to ${title}. From basic concepts to advanced ${c} implementation in real-world scenarios.`,
        JSON.stringify(roadmap),
        JSON.stringify(resources),
        JSON.stringify(topicCerts),
        duration
      );
      count++;
    }
  }

  stmt.finalize(() => console.log(`✅ Skills seeded: ${count}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// INSERT GOVT JOBS
// ─────────────────────────────────────────────────────────────────────────────
function seedGovtJobs() {
  const stmt = db.prepare(`INSERT INTO govt_jobs 
    (title, category, exam_name, eligibility_criteria, description, website, syllabus, exam_pattern, preparation_books, important_dates)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  govtJobsData.forEach(row => stmt.run(...row));
  stmt.finalize(() => console.log(`✅ Govt Jobs seeded: ${govtJobsData.length}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// INSERT SCHOLARSHIPS
// ─────────────────────────────────────────────────────────────────────────────
function seedScholarships() {
  const stmt = db.prepare(`INSERT INTO scholarships 
    (name, provider, type, amount, eligibility, state, deadline, link, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  scholarshipsData.forEach(row => stmt.run(...row));

  // Generate 100 more state-level scholarships
  const states = ['Tamil Nadu','Andhra Pradesh','Telangana','Karnataka','Kerala','Maharashtra','Gujarat','Rajasthan','Uttar Pradesh','Bihar','West Bengal','Odisha','Madhya Pradesh','Punjab','Haryana'];
  const providers = ['State Government','District Collector Office','State Backward Classes Welfare Dept','State SC/ST Corp','State Minority Commission'];
  const types = ['Government','Government','Government','Trust'];

  for (let i = 0; i < 100; i++) {
    const state = states[Math.floor(Math.random() * states.length)];
    const amt = `₹${(Math.floor(Math.random() * 20) + 5) * 1000}/year`;
    const prov = providers[Math.floor(Math.random() * providers.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    stmt.run(
      `${state} State Merit Scholarship #${i + 1}`,
      prov,
      type,
      amt,
      `${state} students, 60%+ marks, income < 3 LPA`,
      state,
      'Nov 30, 2025',
      'scholarships.gov.in',
      `State-level merit scholarship for students pursuing higher education in ${state}.`
    );
  }

  stmt.finalize(() => console.log(`✅ Scholarships seeded: ${scholarshipsData.length + 100}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR THEN SEED
// ─────────────────────────────────────────────────────────────────────────────
db.serialize(() => {
  console.log('\n🚀 Starting MEGA SEED across all tables...\n');
  db.run('DELETE FROM jobs');
  db.run('DELETE FROM internships');
  db.run('DELETE FROM skills');
  db.run('DELETE FROM govt_jobs');
  db.run('DELETE FROM scholarships');

  // Small delay to ensure deletes finish
  setTimeout(() => {
    generateJobs();
    setTimeout(generateInternships, 500);
    setTimeout(seedSkills, 1000);
    setTimeout(seedGovtJobs, 1500);
    setTimeout(seedScholarships, 2000);
    setTimeout(() => {
      console.log('\n🎉 MEGA SEED COMPLETE! All tables populated with 1000+ records.\n');
      db.close();
    }, 5000);
  }, 500);
});
