/**
 * DEFINITIVE MEGA SEEDER - Uses exact column names from actual DB
 * node database/final_seed.js
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'career_advisor.db'));

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const companies = [
  'TCS','Infosys','Wipro','HCL','Tech Mahindra','Accenture','IBM','Cognizant','Capgemini','LTIMindtree',
  'Hexaware','Mphasis','Persistent','Zoho','Freshworks','Oracle India','SAP Labs','Adobe India',
  'Salesforce','Google India','Microsoft India','Amazon India','Flipkart','Zomato','Swiggy','Paytm',
  'PhonePe','Razorpay','HDFC Bank','ICICI Bank','SBI','Axis Bank','Kotak Mahindra','Yes Bank',
  'Hero Motocorp','Bajaj Auto','TVS Motors','Mahindra','Tata Motors','Maruti Suzuki','Hyundai India',
  'Bosch India','Honeywell','Siemens India','ABB India','Schneider Electric','Havells','Voltas',
  'Dr Reddys','Cipla','Sun Pharma','Lupin','Biocon','NMDC','ONGC','SAIL','BHEL','NTPC',
  'Power Grid','GAIL','HPCL','BPCL','IOC','Tata Elxsi','Mindtree','KPIT','Cyient','Coforge',
  'Birlasoft','Zensar','Syntel','Mastech','Sonata Software','NIIT Technologies','Tata Steel',
  'JSW Steel','ArcelorMittal','Vedanta','Hindalco','Ultratech Cement','Grasim','Shree Cement',
  'Dabur','Emami','ITC','Hindustan Unilever','P&G India','Colgate','Nestle India','Britannia',
  'Asian Paints','Berger Paints','Pidilite','Titan','Minda Industries','Varroc Engineering',
  'Wabco India','Motherson Sumi','Bharat Forge','Cummins India','Thermax','Kirloskar Brothers',
];

const locations = [
  'Chennai','Mumbai','Delhi','Bangalore','Hyderabad','Pune','Kolkata','Ahmedabad',
  'Noida','Gurugram','Coimbatore','Kochi','Jaipur','Lucknow','Bhopal','Indore',
  'Surat','Vadodara','Nagpur','Patna','Chandigarh','Bhubaneswar','Visakhapatnam',
  'Tiruchirappalli','Madurai','Salem','Erode','Vellore','Dharmapuri','Tiruppur',
  'Thiruvananthapuram','Kozhikode','Thrissur','Mysuru','Hubli','Mangaluru','Belagavi',
];

const sectors = ['IT','Banking','Manufacturing','Healthcare','Retail','Education','Finance','Telecom','Energy','Automotive','Pharma','E-commerce','FMCG','Infrastructure','Real Estate'];
const jobTypes = ['Full Time','Part Time','Contract','Remote','Hybrid'];

const jobTitles = [
  'Software Engineer','Senior Software Engineer','Full Stack Developer','Backend Developer','Frontend Developer',
  'React Developer','Node.js Developer','Python Developer','Java Developer','.NET Developer',
  'Data Analyst','Data Scientist','Machine Learning Engineer','AI Engineer','Business Intelligence Analyst',
  'DevOps Engineer','Cloud Engineer','AWS Solutions Architect','Site Reliability Engineer','Platform Engineer',
  'QA Engineer','Automation Test Engineer','Performance Test Engineer','Mobile App Developer','Android Developer',
  'iOS Developer','Flutter Developer','React Native Developer','Database Administrator','MongoDB Engineer',
  'System Analyst','Business Analyst','Product Manager','Project Manager','Scrum Master','Agile Coach',
  'UI/UX Designer','Graphic Designer','Motion Designer','Product Designer','Brand Designer',
  'Network Engineer','Cybersecurity Analyst','Penetration Tester','Information Security Analyst','SOC Analyst',
  'Blockchain Developer','Web3 Developer','Solidity Developer','Smart Contract Auditor',
  'HR Executive','Talent Acquisition Specialist','Recruitment Manager','Payroll Specialist',
  'Finance Analyst','Accountant','Tax Consultant','Chartered Accountant','CFO Assistant',
  'Sales Executive','Account Manager','Business Development Manager','Pre-Sales Consultant',
  'Marketing Executive','Digital Marketing Manager','SEO Specialist','Content Writer','Social Media Manager',
  'Operations Manager','Supply Chain Analyst','Logistics Manager','Procurement Specialist',
  'Customer Support Executive','Technical Support Engineer','Service Desk Analyst',
  'Mechanical Engineer','Civil Engineer','Electrical Engineer','Electronics Engineer','Chemical Engineer',
  'Production Engineer','Quality Control Engineer','Safety Officer','Maintenance Engineer',
  'Embedded Systems Engineer','VLSI Design Engineer','RF Engineer','Signal Processing Engineer',
  'Research Scientist','Clinical Research Associate','Pharmacovigilance Specialist','Lab Technician',
  'ERP Consultant','SAP Consultant','Salesforce Developer','Power BI Developer','Tableau Developer',
  'Technical Writer','Documentation Engineer','Instructional Designer','Training Coordinator',
  'Investment Banker','Equity Researcher','Risk Analyst','Credit Analyst','Actuarial Analyst',
  'Angular Developer','Vue.js Developer','Django Developer','Flask Developer','Go Developer',
  'Kotlin Developer','Swift Developer','Rust Developer','PHP Developer','Ruby on Rails Developer',
];

const skillTitles = [
  ['Python Programming','Tech','Master Python from basics to advanced AI/ML applications including web scraping, Flask, Django, pandas, and NumPy.'],
  ['Machine Learning','AI/ML','Learn supervised, unsupervised, and reinforcement learning algorithms. Build predictive models with scikit-learn.'],
  ['Deep Learning','AI/ML','Neural networks, CNNs, RNNs, Transformers, and attention mechanisms using TensorFlow and PyTorch.'],
  ['React.js','Web Dev','Build modern, reactive UIs using React hooks, context API, Redux, React Router, and performance optimization.'],
  ['Node.js & Express','Web Dev','Server-side JavaScript with Express.js, REST APIs, middleware, authentication, and database integration.'],
  ['AWS Cloud Computing','Cloud','EC2, S3, Lambda, RDS, VPC, IAM, CloudFront, ELB, and CloudFormation for scalable cloud infrastructure.'],
  ['Docker & Kubernetes','DevOps','Containerize applications with Docker and orchestrate deployments with Kubernetes (K8s) clusters.'],
  ['Data Structures & Algorithms','CS Fundamentals','Arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming for coding interviews.'],
  ['SQL & Database Design','Database','Relational database design, normalization, complex joins, indexing, stored procedures, and optimization.'],
  ['Java Programming','Programming','OOP with Java, collections framework, multithreading, JDBC, Spring Boot, and microservices.'],
  ['TypeScript','Web Dev','Strongly typed JavaScript with interfaces, generics, decorators, and advanced type patterns.'],
  ['UI/UX Design with Figma','Design','End-to-end product design: wireframes, prototyping, user research, design systems, and Figma mastery.'],
  ['Cybersecurity Fundamentals','Security','Network security, OWASP Top 10, ethical hacking basics, vulnerability assessment, and security tools.'],
  ['Digital Marketing','Marketing','SEO, SEM, Google Ads, Meta Ads, email marketing, content strategy, and analytics reporting.'],
  ['Data Analytics & Excel','Analytics','Advanced Excel, Power Query, pivot tables, data visualization, statistical analysis, and business reporting.'],
  ['Blockchain & Web3','Emerging Tech','Blockchain architecture, smart contracts with Solidity, DeFi protocols, NFTs, and Web3.js/ethers.js.'],
  ['Flutter Mobile Development','Mobile','Cross-platform mobile app development with Flutter/Dart for iOS and Android deployment.'],
  ['Android Development (Kotlin)','Mobile','Native Android apps with Kotlin, Jetpack Compose, MVVM architecture, Room DB, and Firebase.'],
  ['System Design','CS Fundamentals','High-level and low-level design of scalable distributed systems, microservices, caching, and load balancing.'],
  ['Power BI & Data Visualization','Analytics','Create interactive dashboards with Power BI, DAX formulas, Power Query, and data modeling.'],
  ['DevOps CI/CD Pipeline','DevOps','Git, Jenkins, GitHub Actions, ArgoCD, Terraform, monitoring with Prometheus and Grafana.'],
  ['Public Speaking & Communication','Soft Skills','Overcome stage fright, structure speeches, business presentations, group discussions, and interview skills.'],
  ['Project Management (PMP)','Management','Agile, Scrum, Waterfall methodologies, risk management, stakeholder communication, and PMP certification prep.'],
  ['Financial Modeling','Finance','DCF valuation, LBO modeling, merger models, comparable analysis, and advanced Excel for finance.'],
  ['Graphic Design (Photoshop)','Design','Photo editing, compositing, retouching, branding, typography, and print/digital design with Adobe Photoshop.'],
  ['Leadership & Team Management','Soft Skills','Leadership styles, conflict resolution, team motivation, performance management, and delegation skills.'],
  ['C & C++ Programming','Programming','Pointers, memory management, OOP in C++, STL, data structures implementation, and competitive programming.'],
  ['Natural Language Processing','AI/ML','Text preprocessing, NLP pipelines, BERT, GPT, named entity recognition, sentiment analysis, and text generation.'],
  ['Cloud Security','Security','IAM policies, security groups, VPC security, encryption, compliance (SOC2, GDPR), and WAF configuration.'],
  ['Agile & Scrum','Management','Sprint planning, daily standups, retrospectives, Jira/Confluence, product backlog grooming, and velocity tracking.'],
  ['PostgreSQL & Advanced SQL','Database','Window functions, CTEs, JSON support, partitioning, replication, and query performance tuning in PostgreSQL.'],
  ['React Native','Mobile','Build truly native cross-platform apps with React Native, Expo, navigation, and native module integration.'],
  ['Tableau & Business Intelligence','Analytics','Connect data sources, build calculated fields, create interactive dashboards with storytelling in Tableau.'],
  ['Prompt Engineering & LLMs','AI/ML','Craft effective prompts for GPT/Claude, RAG systems, LangChain, vector databases, and AI application building.'],
  ['Git & Version Control','DevOps','Git branching strategies, rebasing, merge conflicts, GitHub Actions, code reviews, and open source contribution.'],
  ['Ethical Hacking & VAPT','Security','Reconnaissance, scanning, exploitation, post-exploitation, penetration testing methodology, and report writing.'],
  ['Angular Framework','Web Dev','TypeScript-first Angular framework with components, services, dependency injection, RxJS, and NgRx state.'],
  ['Spring Boot & Microservices','Backend','Spring MVC, Spring Security, JPA/Hibernate, REST APIs, service discovery, API gateway patterns.'],
  ['Content Writing & SEO','Marketing','Research-driven content creation, on-page SEO, keyword strategy, blog writing, and Google ranking techniques.'],
  ['Business Communication','Soft Skills','Email writing, report writing, presentation skills, meeting facilitation, and cross-cultural communication.'],
  ['Vue.js','Web Dev','Progressive JavaScript framework with Composition API, Vuex, Vue Router, and Nuxt.js for SSR.'],
  ['Kubernetes & Container Orchestration','DevOps','Pod management, deployments, services, ingress controllers, Helm charts, and production Kubernetes operations.'],
  ['Go (Golang) Programming','Programming','Concurrent programming in Go, goroutines, channels, HTTP servers, CLI tools, and microservice architecture.'],
  ['Rust Programming','Programming','Systems programming in Rust, ownership & borrowing, concurrency, WebAssembly, and high-performance code.'],
  ['MongoDB & NoSQL','Database','Document modeling, aggregation pipelines, indexing strategies, replica sets, sharding, and Atlas cloud database.'],
  ['iOS Development (Swift)','Mobile','Native iOS apps with SwiftUI, UIKit, Core Data, networking, push notifications, and App Store deployment.'],
  ['GraphQL APIs','Web Dev','Schema design, resolvers, mutations, subscriptions, Apollo Client/Server, and GraphQL performance patterns.'],
  ['Elasticsearch & Search','Backend','Full-text search, indexing, aggregations, Kibana dashboards, and Elasticsearch performance optimization.'],
  ['TensorFlow & Keras','AI/ML','Build, train, and deploy deep learning models using TensorFlow 2.x and Keras high-level API.'],
  ['Competitive Programming','CS Fundamentals','Algorithmic problem solving for ICPC, CodeForces, Leetcode, AtCoder with math, graphs, and segment trees.'],
];

// --- COLLEGE MASTER DATA ---
const collegeFields = ['Engineering', 'Medical', 'Arts & Science', 'Commerce', 'Management', 'Law', 'Agriculture', 'Design', 'Architecture'];
const collegeTypes = ['Government', 'Private', 'Autonomous', 'Deemed University'];
const universities = ['Anna University', 'University of Madras', 'Mumbai University', 'Delhi University', 'KTU', 'VTU', 'JNTU', 'SRM', 'VIT'];
const approvalBodiesArr = ['AICTE, UGC', 'UGC, NAAC A++', 'NMC, UGC', 'AICTE, NBA'];

// --- CAREER MASTER DATA ---
const careerCategories = ['Technology', 'Healthcare', 'Finance', 'Creative Arts', 'Public Service', 'Engineering', 'Education', 'Legal'];

const careerDetails = [
  { title: 'AI Architect', category: 'Technology', min_ed: 'B.Tech/M.Tech', sal: '₹15–45 LPA' },
  { title: 'Cardiologist', category: 'Healthcare', min_ed: 'MBBS, MD/DM', sal: '₹20–60 LPA' },
  { title: 'Investment Banker', category: 'Finance', min_ed: 'MBA Finance/CA', sal: '₹12–50 LPA' },
  { title: 'UX Research Lead', category: 'Creative Arts', min_ed: 'Bachelors in Design', sal: '₹10–35 LPA' },
  { title: 'Cybersecurity Consultant', category: 'Technology', min_ed: 'B.Tech CS', sal: '₹8–30 LPA' },
  { title: 'Chartered Accountant', category: 'Finance', min_ed: 'CA', sal: '₹7–25 LPA' },
  { title: 'Data Scientist', category: 'Technology', min_ed: 'B.Stats/B.Tech', sal: '₹9–40 LPA' },
  { title: 'Civil Judge', category: 'Legal', min_ed: 'LLB/LLM', sal: '₹8–20 LPA' },
  { title: 'Aerospace Engineer', category: 'Engineering', min_ed: 'B.E. Aerospace', sal: '₹8–35 LPA' },
  { title: 'Professor', category: 'Education', min_ed: 'PhD / NET', sal: '₹7–25 LPA' }
];


const govtJobs = [
  ['UPSC Civil Services (IAS/IPS/IFS)','Central Government','UPSC CSE','Bachelor\'s degree, age 21-32 (Gen), 21-35 (OBC), 21-37 (SC/ST)','India\'s most prestigious exam for IAS, IPS, IFS, and allied services administered by UPSC','upsc.gov.in','General Studies I-IV, CSAT, Optional Subject','Prelims (MCQ) + Mains (9 Written Papers) + Interview','Laxmikanth Polity, Bipin Chandra History, NCERT Books, Vision IAS','{"start":"Feb 2025","end":"Mar 2025","exam":"Jun 2025"}'],
  ['SSC CGL (Combined Graduate Level)','Central Government','SSC CGL','Graduation from recognized university, age 18-32','Recruitment for Group B and C posts in central government ministries and departments','ssc.nic.in','General Intelligence, General Awareness, Quantitative Aptitude, English Comprehension','Tier I (CBT) + Tier II (CBT) + Tier III (Descriptive) + Tier IV (Computer Skill)','Kiran SSC CGL Guide, Rakesh Yadav Math, Lucent GK, Neetu Singh English','{"start":"Jan 2025","end":"Feb 2025","exam":"Apr 2025"}'],
  ['RRB NTPC (Railways)','Indian Railways','RRB NTPC','10th/12th/Graduation based on post, age 18-33','Non-Technical Popular Category recruitment for Junior Clerk, Commercial Apprentice, Traffic Apprentice posts','rrbcdg.gov.in','Mathematics, General Intelligence & Reasoning, General Awareness','CBT Stage 1 (100 Q) + CBT Stage 2 (120 Q) + Typing/CBAT Skill Test','Arihant RRB NTPC, Lucent General Science, Mirror of Common Errors English','{"start":"Mar 2025","end":"Apr 2025","exam":"Jul 2025"}'],
  ['IBPS PO (Bank PO)','Banking Sector','IBPS PO','Graduation, age 20-30','Probationary Officer recruitment across 11 participating public sector banks across India','ibps.in','Reasoning Ability & Computer Aptitude, English Language, DI & Analysis','Prelims (60Q) + Mains (155Q) + Interview','Bankersadda Mock Tests, M. Tyra Magical Book, Arihant IBPS PO','{"start":"Aug 2025","end":"Sep 2025","exam":"Oct 2025"}'],
  ['SBI PO','Banking Sector','SBI PO Exam','Graduation, age 21-30','Probationary Officer at State Bank of India - India\'s largest public sector bank','sbi.co.in','Reasoning, Quantitative Aptitude, General Awareness, English Language','Phase I Prelims + Phase II Mains + Phase III (GE/PI)','Kiran SBI PO Mock Tests, RS Aggarwal Quantitative, Arihant GK','{"start":"Sep 2025","end":"Oct 2025","exam":"Nov 2025"}'],
  ['UPSC NDA/NA Exam','Defence Services','NDA Exam','10+2 (PCM for Navy/AF), age 16.5-19.5','Entry into National Defence Academy (Army, Navy, Air Force) careers for unmarried males/females','upsc.gov.in','Mathematics (300 marks), General Ability Test (600 marks)','Written Exam (900 marks) + SSB Interview (900 marks) + Medical Exam','Pathfinder NDA by Arihant, R.S. Aggarwal Maths, Spectrum GK','{"start":"Jan 2025","end":"Feb 2025","exam":"Apr 2025"}'],
  ['NEET UG (Medical)','Medical Education','NEET UG 2025','10+2 with PCB (50% min), age no bar (Indian nationals)','Unified entrance examination for MBBS, BDS, AYUSH, and allied health courses in India','neet.nta.nic.in','Physics (45 Q), Chemistry (45 Q), Biology (90 Q) - Total 720 marks','Single Paper MCQ exam (3.5 hours), computer and pen-paper mode','NCERT Class 11-12, Trueman\'s Biology, DC Pandey Physics, MS Chouhan Chemistry','{"start":"Dec 2024","end":"Mar 2025","exam":"May 2025"}'],
  ['JEE Main (Engineering)','Technical Education','JEE Main 2025','10+2 with PCM (75%+), age no bar','Admission to NITs, IIITs, CFTIs, and qualifying exam for JEE Advanced (IITs)','jeemain.nta.nic.in','Mathematics, Physics, Chemistry - 90 questions, 300 marks','Session 1 (Jan) + Session 2 (Apr) - Computer Based Test','HC Verma Physics, RD Sharma Maths, NCERT Chemistry, JEE PYQ Banks','{"start":"Nov 2024","end":"Nov 2024","exam":"Jan 2025"}'],
  ['GATE 2026 (Postgraduate)','Higher Education/PSU','GATE 2026','BE/BTech/MSc/MCA, age no bar','Gateway to IIT/NIT M.Tech admissions + PSU recruitments (ONGC, BHEL, NTPC, IOCL etc.)','gate.iitk.ac.in','General Aptitude (15 marks) + Engineering/Science Subject (85 marks)','3-hour Online Exam with MCQ + MSQ + NAT questions','Made Easy GATE Guide, ACE Academy Workbooks, Previous 10-Year Question Papers','{"start":"Sep 2025","end":"Oct 2025","exam":"Feb 2026"}'],
  ['TNPSC Group I','Tamil Nadu Government','TNPSC Group I Exam','Graduation from recognized university, age 21-42','District Collector, DSP, DCTO, and senior Tamil Nadu state service posts','tnpsc.gov.in','General Studies (History, Polity, Geography, Economy, Science, Current Affairs), Tamil','Prelims (MCQ 150Q) + Mains (6 Papers Descriptive) + Oral Interview','Sura TNPSC Materials, Samacheer Books, The Hindu Current Affairs, Pothi.com','{"start":"Jun 2025","end":"Jul 2025","exam":"Sep 2025"}'],
  ['TNPSC Group II & IIA','Tamil Nadu Government','TNPSC Group 2 & 2A','Graduation, age 18-32 (Group II) / 18-42 (Group IIA)','Assistant Section Officer, Junior Employment Officer, Revenue Assistant posts in Tamil Nadu','tnpsc.gov.in','General Studies and Tamil, Aptitude and Mental Ability','Combined (CBT) Written Exam for Group IIA, + Oral Test for Group II','Sura TNPSC Group II Guide, Tamil Nadu History, Daily Current Affairs App','{"start":"Nov 2024","end":"Dec 2024","exam":"Feb 2025"}'],
  ['TNPSC Group IV (VAO)','Tamil Nadu Government','TNPSC Group IV Exam','10+2, age 18-40','Village Administrative Officer, Junior Assistant, Typist in Tamil Nadu Government','tnpsc.gov.in','General Studies, Tamil Language and Literature, Aptitude & Mental Ability','Single Written Exam - OMR Based - 200 Questions','TNPSC Group IV Study Material by Sura, Navamani, Pothi.com','{"start":"Feb 2025","end":"Mar 2025","exam":"May 2025"}'],
  ['Kerala PSC LDC','Kerala Government','Kerala PSC LDC Exam','10+2 (SSLC for some posts), age 18-41','Lower Division Clerk and other entry-level posts in Kerala State Government departments','keralapsc.gov.in','General Knowledge, Simple Arithmetic, English, Malayalam Language','OMR Based Written Test (100 Marks) + Practical Test','Saras Publications PSC Guide, Mathrubhumi Current Affairs, Kerala PSC Previous Papers','{"start":"Jan 2025","end":"Feb 2025","exam":"Apr 2025"}'],
  ['DRDO Scientist B','Defence Research','DRDO CEPTAM/Scientist B','BE/BTech or MSc in relevant discipline, age 18-28','Scientist and Senior Technical Assistant recruitment at DRDO laboratories pan-India','drdo.gov.in','Domain Subject Knowledge + General Science + Quantitative Aptitude','Written Exam (Objective) + Technical Interview for Scientists','GATE Study Material, DRDO Previous Papers, Kiran Publications Technical Books','{"start":"Feb 2025","end":"Mar 2025","exam":"Jun 2025"}'],
  ['ISRO Scientist/Engineer SC','Space Research','ISRO Recruitment 2025','BE/BTech from AICTE-approved institute with CGPA 6.5+ or 65% marks','Scientists and Engineers for India\'s premier space agency across its centres (VSSC, ISAC, SAC etc.)','isro.gov.in','Computer Science/Electronics/Mechanical Engineering + Aptitude + GK','Online Written Test (Subject + Aptitude) + Technical Interview','GATE Books (Made Easy), ISRO Previous Papers, Subject Textbooks','{"start":"Jun 2025","end":"Jul 2025","exam":"Sep 2025"}'],
  ['SBI Clerk (Junior Associate)','Banking Sector','SBI Junior Associates','Graduation, age 20-28','Customer Support and Sales role (Clerical cadre) at State Bank of India branches','sbi.co.in','English Language, Numerical Ability, Reasoning Ability, General/Financial Awareness','Phase-I Prelims (CBT) + Phase-II Mains (CBT)','Kiran SBI Clerk Chapterwise, Arihant GK Manual, IBPS Guide Mock Tests','{"start":"Oct 2025","end":"Nov 2025","exam":"Dec 2025"}'],
  ['RRB JE (Junior Engineer)','Indian Railways','RRB JE 2025','Diploma/BE/BTech in Engineering, age 18-33','Junior Engineer posts across Civil, Mechanical, Electrical, Electronics, IT departments in Railways','rrbcdg.gov.in','CBT 1: Math, GI, GS, Awareness | CBT 2: Technical Subject Specific','Two-stage CBT + Document Verification; no personal interview required','Arihant RRB JE Technical, Kiran CBT 1 Guide, Previous Papers 2014-2024','{"start":"Apr 2025","end":"May 2025","exam":"Aug 2025"}'],
  ['NABARD Grade A & B','Agriculture Finance','NABARD Recruitment 2025','Graduation/Postgrad, age 21-30','Development banking and rural credit roles at National Bank for Agriculture & Rural Development','nabard.org','Economic & Social Issues, Agriculture, Rural Development, Hindi, GAAP, English','Preliminary Phase 1 (Objective) + Phase 2 (Objective + Descriptive) + Interview','NABARD Previous Papers, The Hindu Economy Articles, Economic Survey Summary','{"start":"Aug 2025","end":"Sep 2025","exam":"Oct 2025"}'],
  ['UPSC CDS (Army/Navy/AF)','Defence Services','CDS Exam','Graduation (for IMA, AFA, Naval), age 19-25','Officer Entry into Indian Military Academy, Air Force Academy, Naval Academy, Officers Training','upsc.gov.in','English, General Knowledge, Elementary Mathematics (for IMA/Navy/AFA only)','Written Test + SSB Interview (5-day programme) + Medical Board','Pathfinder CDS, R.S. Aggarwal, Arihant GK, NCERT History & Geography','{"start":"Sep 2025","end":"Oct 2025","exam":"Nov 2025"}'],
  ['MPSC State Services Exam','Maharashtra Government','MPSC State Services','Graduation, age 19-38 (Gen), 19-43 (reserved)','Maharashtra civil services including Deputy Collector, PSI, Assistant Commissioner posts','mpsc.gov.in','GS Paper I (History, Geography), GS Paper II (Polity, Economy), CSAT','Prelims (Objective) + Mains (6 Descriptive Papers) + Interview/Viva Voce','Laxmikanth Polity, Unique Publication MPSC, Vivek Patil Maharashtra GS Books','{"start":"Nov 2024","end":"Dec 2024","exam":"Feb 2025"}'],
];

const scholarships = [
  ['National Scholarship Portal (NSP) Central Scheme','Ministry of Education, Govt of India','Government','₹12,000–₹25,000 per year','Students from SC/ST/OBC/Minority/Disabled categories; family income < 2.5 LPA; 50%+ marks in last exam','All India','Oct 31, 2025','scholarships.gov.in','Central government\'s flagship scholarship portal covering Pre-Matric, Post-Matric, and Merit-cum-Means scholarships'],
  ['Prime Minister\'s Special Scholarship Scheme (PMSSS) J&K','Ministry of Education','Government','Tuition + ₹1 Lakh maintenance per year','Students domiciled in J&K and Ladakh, admission in central/state universities outside J&K','All India','Aug 15, 2025','aicte-jk-nic.in','Full scholarship for students from J&K to study in institutions across India in technical/non-technical courses'],
  ['AICTE Pragati Scholarship (Girls in Technical Education)','AICTE','Government','₹50,000 per year','Girl students enrolled in diploma or degree technical programs in AICTE-approved colleges; income < 8 LPA','All India','Dec 15, 2025','aicte-pragati-scho-nic.in','Empowers girl students to pursue technical education through annual financial support from AICTE'],
  ['AICTE Saksham Scholarship (Specially-Abled Students)','AICTE','Government','₹50,000 per year','Students with 40%+ disability in AICTE diploma/degree programs; income < 8 LPA','All India','Dec 15, 2025','aicte-saksham-nic.in','Supports specially-abled students in technical institutions to overcome financial barriers to education'],
  ['HDFC Bank Parivartan ECS Scholarship','HDFC Bank CSR','Private','₹75,000 per year (renewable)','Pursuing UG/PG/Professional courses; family income < 2.5 LPA; minimum 55% marks','All India','Aug 31, 2025','hdfcbank.com/parivartan','HDFC Bank\'s CSR scholarship initiative for meritorious students from economically disadvantaged families'],
  ['Tata Capital Pankh Scholarship Program','Tata Capital Limited','Private','₹10,000–₹20,000 per year','Class 11, 12, or first-year UG; income < 2.5 LPA; minimum 60% in previous exam','All India','Sep 15, 2025','tatacapital.com/scholarship','Supports students during the critical transition from secondary to higher education'],
  ['Sitaram Jindal Foundation Scholarship','Sitaram Jindal Foundation','Private','₹800–₹3,000 per month','Studying in Class 10 to postgraduation; income < 2.5 LPA; 50%+ marks; merit-based','All India','Mar 31, 2025','sitaramjindalfoundation.org','One of India\'s largest private scholarship programs supporting 12,000+ students annually'],
  ['Narotam Sekhsaria Foundation Postgraduate Scholarship','NSF','Private','₹3–4 Lakhs (Total)','Outstanding candidates pursuing postgraduate education in India or abroad; merit-based selection','All India','Jan 31, 2025','nsf.org.in','Prestigious scholarship for high achievers with exceptional academic records and leadership potential'],
  ['JN Tata Endowment for Higher Education Abroad','JN Tata Endowment','Private','Loan scholarship ₹3–10 Lakhs','Indian nationals under 45 pursuing postgrad/research abroad; merit and need based','All India','Mar 15, 2025','jntataendowment.org','Prestigious endowment for Indian students pursuing quality postgraduate education outside India'],
  ['Wipro Cares Scholarship','Wipro Limited','Corporate','₹1.2 Lakh per year','Engineering students in 2nd/3rd year; merit + need criteria; selected colleges','All India','Oct 31, 2025','wipro.com/cares','Wipro\'s CSR initiative to support bright engineering students facing financial challenges'],
  ['TCS iON Scholarship','Tata Consultancy Services','Corporate','₹50,000 per year','BE/BTech final year students; minimum 7.0 CGPA; participating TCS campus colleges','All India','Sep 30, 2025','tcs.com/ion-scholarship','Merit-based scholarship for top engineering graduates from TCS-partnered universities'],
  ['Google Generation Scholarship (South Asia)','Google','Corporate/International','$10,000 USD equivalent','UG/PG in Computer Science/related; demonstrated financial need; strong academic record','All India','Dec 1, 2025','buildyourfuture.withgoogle.com','Google\'s program to support underrepresented students in computer science careers'],
  ['Tamil Nadu Chief Minister\'s Merit Scholarship','Tamil Nadu Government','Government','₹25,000 per year','Tamil Nadu Board students scoring 90%+ in HSC; first-generation college students preferred','Tamil Nadu','Aug 31, 2025','tn.gov.in/scholarship','State government scholarship for outstanding Tamil Nadu school students entering higher education'],
  ['TN Dr Ambedkar Law University Scholarship','Tamil Nadu Government','Government','Fee waiver + ₹2,000/month','SC/ST students pursuing LLB at Tamil Nadu Dr Ambedkar Law University','Tamil Nadu','Sep 15, 2025','tndalu.ac.in','Full fee waiver and monthly stipend for SC/ST law students in Tamil Nadu\'s premier law university'],
  ['Tamil Nadu Minority Welfare Scholarship','TN Minority Welfare Dept','Government','₹3,000–₹10,000 per year','Muslim, Christian, Sikh, Buddhist, Zoroastrian students in Tamil Nadu; income < 3 LPA','Tamil Nadu','Sep 30, 2025','minority.tn.gov.in','Supporting minority community students in Tamil Nadu pursuing college and professional courses'],
  ['Tamil Nadu BC Scholarship on Merit','TN BC/MBC Welfare Dept','Government','₹5,000–₹15,000 per year','BC/MBC/DNT community students in Tamil Nadu with 60%+ marks; pursuing UG/PG courses','Tamil Nadu','Oct 31, 2025','bcmbcmnu.tn.gov.in','Scholarship for Backward Class and Most Backward Class students in Tamil Nadu to encourage higher education'],
  ['Rajiv Gandhi National Fellowship (RGNF)','University Grants Commission (UGC)','Government','₹25,000 (JRF) / ₹28,000 (SRF) per month + HRA','SC/ST students pursuing full-time MPhil/PhD in UGC-recognized universities','All India','Mar 31, 2025','ugc.ac.in','Research fellowship to supplement SC/ST students pursuing doctoral and postdoctoral degrees in India'],
  ['KVPY Fellowship (Kishore Vaigyanik Protsahan Yojana)','DST, Government of India','Government','₹5,000–₹7,000 per month + contingency grant','11th standard to 1st year BSc/BS/B.Stat/B.Math/Int.MSc/Int.MS students in basic sciences','All India','Ongoing','kvpy.iisc.ernet.in','National fellowship to nurture the best scientific minds of India for a career in research'],
  ['Chevening Scholarship (UK Government)','UK Foreign Commonwealth Development Office','Foreign Government','Full tuition + living costs + flights','1-year Master\'s at UK university; minimum 2 years work experience; leadership qualities','All India','Nov 5, 2025','chevening.org','Prestigious UK government scholarship for future leaders from over 160 countries including India'],
  ['Fulbright-Nehru Master\'s Fellowship','US-India Educational Foundation (USIEF)','Foreign Government','Full funding (tuition + stipend + travel)','Master\'s degree study in USA in non-engineering fields; minimum 3 years work experience','All India','Jul 15, 2025','usief.org.in','US-India bilateral scholarship for leaders and professionals to study in the United States'],
];

// ─────────────────────────────────────────────────────────────────────────────
// RUN SEEDING
// ─────────────────────────────────────────────────────────────────────────────
db.serialize(() => {
  console.log('\n🚀 Starting Definitive Mega Seed...\n');
  console.log('Clearing existing data...');
  db.run('DELETE FROM jobs');
  db.run('DELETE FROM skills');
  db.run('DELETE FROM internships');
  db.run('DELETE FROM govt_jobs');
  db.run('DELETE FROM scholarships');
  db.run('DELETE FROM colleges');
  db.run('DELETE FROM careers');
  db.run('DELETE FROM companies');
  db.run("DELETE FROM sqlite_sequence WHERE name IN ('jobs','skills','internships','govt_jobs','scholarships','colleges','careers','companies')");


  // ── 1. JOBS (1200+ records) ──────────────────────────────────────────────
  console.log('Seeding Jobs...');
  const jobStmt = db.prepare(`INSERT INTO jobs
    (title, company, sector, location, salary_range, job_type, description, skills_required, apply_link, posted_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  let jobCount = 0;
  jobTitles.forEach(title => {
    const postsPerTitle = Math.ceil(1200 / jobTitles.length) + 2;
    for (let i = 0; i < postsPerTitle; i++) {
      const company = rand(companies);
      const sector = rand(sectors);
      const location = rand(locations);
      const minSal = randInt(3, 22);
      const maxSal = minSal + randInt(2, 10);
      const jobType = rand(jobTypes);
      const skills = ['Problem Solving', 'Communication', 'Team Collaboration', sector + ' Knowledge'];
      const daysAgo = randInt(0, 29);
      const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

      jobStmt.run(
        title,
        company,
        sector,
        location,
        `₹${minSal}–${maxSal} LPA`,
        jobType,
        `${company} is hiring a ${title} to join our ${location} ${sector} team. ${jobType} role with excellent growth prospects and benefits. Collaborative environment with mentorship opportunities.`,
        JSON.stringify(skills),
        `https://careers.${company.toLowerCase().replace(/[^a-z]/g, '').substring(0,10)}.com/apply`,
        date
      );
      jobCount++;
    }
  });
  jobStmt.finalize(() => console.log(`✅ Jobs: ${jobCount} records`));

  // ── 2. SKILLS (using 'name' column) ─────────────────────────────────────
  setTimeout(() => {
    console.log('Seeding Skills...');
    const skillStmt = db.prepare(`INSERT INTO skills (name, category, description) VALUES (?, ?, ?)`);

    skillTitles.forEach(([name, category, description]) => {
      skillStmt.run(name, category, description);
    });

    // Add 50 more domain skills
    const extras = [
      ['Communication Skills','Soft Skills','Master verbal and written communication for professional environments.'],
      ['Critical Thinking','Soft Skills','Analyze problems systematically and develop evidence-based solutions.'],
      ['Time Management','Soft Skills','Prioritize tasks, meet deadlines, and manage workload efficiently.'],
      ['Emotional Intelligence','Soft Skills','Understand and manage emotions to build stronger professional relationships.'],
      ['Negotiation Skills','Soft Skills','Influence outcomes through effective negotiation in business and personal contexts.'],
      ['Tableau','Analytics','Create compelling data visualizations and interactive dashboards with Tableau Desktop.'],
      ['Apache Spark','Big Data','Distributed computing with Spark for processing large-scale datasets.'],
      ['Hadoop','Big Data','Big data storage and processing using the Hadoop ecosystem.'],
      ['Redis','Database','In-memory data structure store for caching, pub/sub, and session management.'],
      ['Kafka','Backend','Distributed event streaming platform for building real-time data pipelines.'],
      ['Jenkins','DevOps','Automate CI/CD pipelines with Jenkins for continuous integration and delivery.'],
      ['Terraform','DevOps','Infrastructure as code for provisioning cloud resources across AWS, Azure, GCP.'],
      ['Ansible','DevOps','Automation tool for configuration management, application deployment, and task automation.'],
      ['Linux Administration','Systems','Manage Linux servers, file systems, networking, shell scripting, and security.'],
      ['Nginx & Apache','Backend','Configure web and proxy servers for high-traffic production environments.'],
      ['Statistics & Probability','Analytics','Foundation of data science: distributions, hypothesis testing, regression, Bayesian methods.'],
      ['A/B Testing','Analytics','Design and analyze controlled experiments to optimize products and marketing campaigns.'],
      ['JIRA & Confluence','Management','Use Atlassian tools for agile project management, sprint tracking, and documentation.'],
      ['Canva Design','Design','Create professional presentations, social media graphics, and documents using Canva.'],
      ['Video Editing (Premiere Pro)','Design','Professional video editing, color grading, audio mixing, and motion graphics with Adobe Premiere.'],
      ['UX Research Methods','Design','User interviews, surveys, usability testing, persona creation, and journey mapping.'],
      ['WordPress Development','Web Dev','Build and customize WordPress websites with themes, plugins, and WooCommerce.'],
      ['SEO & SEM','Marketing','Improve organic search rankings and manage paid search campaigns on Google.'],
      ['Google Analytics 4','Analytics','Track, analyze, and report on website and app user behavior using GA4.'],
      ['CRM Tools (Salesforce, HubSpot)','Management','Manage customer relationships, sales pipelines, and marketing automation.'],
      ['Supply Chain Management','Operations','End-to-end supply chain: procurement, inventory, logistics, and vendor management.'],
      ['Six Sigma & Quality Management','Operations','Reduce process defects using DMAIC methodology and Six Sigma tools.'],
      ['AutoCAD','Engineering','Computer-aided design for mechanical, civil, and electrical engineering drawings.'],
      ['SolidWorks','Engineering','3D CAD modeling, simulation, and manufacturing process planning for product design.'],
      ['MATLAB & Simulink','Engineering','Numerical computing, signal processing, control systems, and simulation modeling.'],
      ['ANSYS Simulation','Engineering','Finite element analysis and computational fluid dynamics for engineering simulations.'],
      ['IoT Development','Emerging Tech','Build connected devices with Arduino, Raspberry Pi, MQTT, and cloud IoT platforms.'],
      ['AR/VR Development','Emerging Tech','Create augmented and virtual reality experiences using Unity, ARKit, and WebXR.'],
      ['Computer Vision','AI/ML','Image classification, object detection, face recognition using OpenCV and YOLO.'],
      ['Reinforcement Learning','AI/ML','Train agents to make decisions through reward-based learning with OpenAI Gym and Stable Baselines.'],
      ['MLOps','AI/ML','Deploy, monitor, and maintain machine learning models in production with MLflow and Kubeflow.'],
      ['Generative AI (GANs, Diffusion)','AI/ML','Build image generation models with GANs, VAEs, and Stable Diffusion architecture.'],
      ['Pharmacy & Drug Regulatory','Healthcare','Understand pharmaceutical regulations, drug approval processes, and pharmacovigilance systems.'],
      ['Medical Coding (ICD-10, CPT)','Healthcare','Translate medical diagnoses and procedures into standard codes for billing and insurance claims.'],
      ['Clinical Data Management','Healthcare','Design, validate, and manage clinical trial databases following GCP/ICH guidelines.'],
      ['Tally ERP','Finance','Accounting software for small businesses: ledger management, GST filing, and payroll.'],
      ['Advanced Excel (VBA & Macros)','Analytics','Automate repetitive tasks and build complex financial models using VBA macros in Excel.'],
      ['QuickBooks','Finance','Accounting platform for small business financial management, invoicing, and tax preparation.'],
      ['French Language (A1-B2)','Languages','Learn French from beginner to intermediate level for international career opportunities.'],
      ['German Language (A1-B1)','Languages','Learn German language for engineering and research opportunities in German-speaking countries.'],
      ['Japanese Language (JLPT N5-N3)','Languages','Japanese language course for IT professionals and students pursuing education in Japan.'],
      ['Aptitude & Reasoning (Placement Prep)','Placement','Quantitative aptitude, logical reasoning, verbal ability, and puzzles for campus placements.'],
      ['HR Analytics','Management','Apply data analytics to HR metrics: attrition prediction, performance analysis, talent acquisition insights.'],
      ['Corporate Finance','Finance','Capital budgeting, WACC, dividend policy, IPO process, M&A valuation, and corporate restructuring.'],
      ['Interview Preparation (Technical + HR)','Placement','Crack technical interviews with DSA, system design, and behavioral questions with STAR method.'],
    ];

    extras.forEach(([name, category, description]) => skillStmt.run(name, category, description));
    skillStmt.finalize(() => console.log(`✅ Skills: ${skillTitles.length + extras.length} records`));
  }, 1000);

  // ── 3. INTERNSHIPS (600+ records) ────────────────────────────────────────
  setTimeout(() => {
    console.log('Seeding Internships...');
    const internTitles = [
      'Software Development Intern','Frontend Development Intern','Backend Development Intern',
      'Full Stack Development Intern','Machine Learning Intern','Data Science Intern',
      'Data Analytics Intern','AI Research Intern','Cybersecurity Intern','Cloud Computing Intern',
      'DevOps Intern','Mobile App Development Intern','Android App Intern','iOS App Intern',
      'UI/UX Design Intern','Graphic Design Intern','Product Design Intern','Digital Marketing Intern',
      'Content Writing Intern','SEO Intern','Social Media Marketing Intern','Video Editing Intern',
      'Business Development Intern','Sales Intern','HR & Recruitment Intern','Operations Intern',
      'Finance & Accounts Intern','Investment Banking Intern','Market Research Intern',
      'Supply Chain Intern','Consulting Intern','Legal Research Intern','Policy Intern',
      'Research & Development Intern','Biotech Lab Intern','Pharmaceutical Intern','Clinical Research Intern',
    ];
    const durations = ['1 month','2 months','3 months','6 months','Summer (2 months)','Winter (1 month)'];
    const types = ['Remote','On-site','Hybrid'];

    const internStmt = db.prepare(`INSERT INTO internships
      (title, company, type, stipend, duration, location, requirements, link, posted_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    let internCount = 0;
    internTitles.forEach(title => {
      const postsPerTitle = Math.ceil(600 / internTitles.length) + 2;
      for (let i = 0; i < postsPerTitle; i++) {
        const company = rand(companies);
        const type = rand(types);
        const stipend = `₹${randInt(5, 30) * 1000}/month`;
        const duration = rand(durations);
        const location = type === 'Remote' ? 'Remote (Work from Anywhere in India)' : rand(locations);
        const daysAgo = randInt(0, 20);
        const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

        internStmt.run(
          title, company, type, stipend, duration, location,
          'Currently pursuing BE/BTech/BCA/BBA/MBA or equivalent. Strong fundamentals in the relevant domain. Good communication skills. Enthusiastic learner ready to contribute from Day 1.',
          `https://internshala.com/internship/${title.toLowerCase().replace(/\s+/g, '-')}-at-${company.toLowerCase().replace(/[^a-z]/g, '')}`,
          date
        );
        internCount++;
      }
    });
    internStmt.finalize(() => console.log(`✅ Internships: ${internCount} records`));
  }, 2000);

  // ── 4. GOVT JOBS (20 detailed records) ───────────────────────────────────
  setTimeout(() => {
    console.log('Seeding Govt Jobs...');
    const govtStmt = db.prepare(`INSERT INTO govt_jobs
      (title, category, exam_name, eligibility_criteria, description, website, syllabus, exam_pattern, preparation_books, important_dates)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    govtJobs.forEach(row => govtStmt.run(...row));

    // Add 80 more auto-generated govt jobs
    const depts = ['Tamil Nadu Govt','Maharashtra Govt','Karnataka Govt','UP Govt','Bihar Govt','Rajasthan Govt','Gujarat Govt','Andhra Pradesh Govt','Telangana Govt','Kerala Govt'];
    const govtRoles = ['Constable','Sub Inspector','Revenue Inspector','Village Officer','Junior Assistant','Senior Assistant','Grade II Officer','Block Development Officer','Gram Panchayat Secretary','Agricultural Officer'];
    const exams = ['State PSC Exam','Police Recruitment','Revenue Department Exam','Local Body Exam','Health Department Exam','Education Department Exam'];

    for (let i = 0; i < 80; i++) {
      const dept = rand(depts);
      const role = rand(govtRoles);
      const exam = rand(exams);
      govtStmt.run(
        `${role} - ${dept.replace(' Govt', '')}`,
        dept,
        `${exam} ${2024 + Math.floor(Math.random() * 2)}`,
        '10th/12th/Graduation as per post requirements; age 18-40 years; state domicile required',
        `Recruitment for ${role} posts in ${dept}. Secure government job with job security, pension benefits, and service perks.`,
        dept.toLowerCase().replace(/\s+/g, '') + '.gov.in',
        'General Knowledge, Aptitude, Regional Language, Subject-Specific Topics as per notification',
        'Written Objective Test (OMR/CBT) + Physical Test (for Police) + Document Verification',
        'State-specific Study Materials, Previous Year Question Papers, Lucent GK, RS Aggarwal',
        `{"start":"${['Jan','Feb','Mar','Apr','May','Jun'][Math.floor(Math.random()*6)]} 2025","end":"${['Feb','Mar','Apr','May','Jun','Jul'][Math.floor(Math.random()*6)]} 2025","exam":"${['Apr','May','Jun','Jul','Aug','Sep'][Math.floor(Math.random()*6)]} 2025"}`
      );
    }
    govtStmt.finalize(() => console.log(`✅ Govt Jobs: ${govtJobs.length + 80} records`));
  }, 3000);

  // ── 5. SCHOLARSHIPS (120+ records) ──────────────────────────────────────
  setTimeout(() => {
    console.log('Seeding Scholarships...');
    const schStmt = db.prepare(`INSERT INTO scholarships
      (name, provider, type, amount, eligibility, state, deadline, link, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    scholarships.forEach(row => schStmt.run(...row));

    // Generate 100 more state-level scholarships
    const states = ['Tamil Nadu','Andhra Pradesh','Telangana','Karnataka','Kerala','Maharashtra','Gujarat','Rajasthan','Uttar Pradesh','Bihar','West Bengal','Odisha','Madhya Pradesh','Punjab','Haryana','Himachal Pradesh','Uttarakhand','Assam','Jharkhand','Chhattisgarh'];
    const typesArr = ['Government','Government','Government','Corporate','Trust'];
    const schProviders = ['State Government','District Collector Office','State Backward Classes Welfare Dept','State SC/ST Corporation','State Minority Commission','University Grants Commission'];

    for (let i = 0; i < 100; i++) {
      const state = rand(states);
      const amt = `₹${(randInt(5, 25)) * 1000}/year`;
      const prov = rand(schProviders);
      const type = rand(typesArr);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      schStmt.run(
        `${state} ${rand(['Merit Scholarship','District Scholarship','State Excellence Award','Post-Matric Scholarship','Pre-Matric Scholarship','Technical Education Scholarship'])} ${2025 + Math.floor(Math.random()*2)}`,
        prov,
        type,
        amt,
        `${state} domicile students; ${randInt(50,75)}%+ marks in previous exam; family income < ${randInt(2,8)} LPA; pursuing UG/PG courses`,
        state,
        `${rand(months)} ${randInt(25,31)}, 2025`,
        'scholarships.gov.in',
        `State-level scholarship for students from ${state} pursuing higher education. Covers tuition fees and provides maintenance allowance for eligible students.`
      );
    }
    schStmt.finalize(() => console.log(`✅ Scholarships: ${scholarships.length + 100} records`));
  }, 5000);

  // ── 6. COLLEGES (1200+ records) ──────────────────────────────────────────
  setTimeout(() => {
    console.log('Seeding Colleges...');
    const collegeStmt = db.prepare(`INSERT INTO colleges 
      (name, location, district, city, field, type, affiliated_university, approval_bodies, year_established, fees, rating, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    let collegeCount = 0;
    const prefixes = ['Vibrant', 'Royal', 'Modern', 'Global', 'National', 'Premier', 'Elite', 'Central', 'Asian', 'State'];
    const suffixes = ['Institute of Technology', 'College of Engineering', 'Medical College', 'Arts & Science College', 'Business School', 'University', 'Law School'];

    for (let i = 0; i < 1200; i++) {
      const location = rand(locations);
      const name = `${rand(prefixes)} ${location} ${rand(suffixes)} #${i + 1}`;
      const field = rand(collegeFields);
      const type = rand(collegeTypes);
      const univ = rand(universities);
      const body = rand(approvalBodiesArr);
      const year = randInt(1950, 2015);
      const fees = field === 'Medical' ? `₹50,000 - 15,00,000` : `₹40,000 - 3,00,000`;
      const rating = (randInt(35, 50) / 10).toFixed(1);

      collegeStmt.run(name, location, location, location, field, type, univ, body, year, fees, rating, `https://www.${name.toLowerCase().replace(/\s+/g, '')}.edu.in`);
      collegeCount++;
    }
    collegeStmt.finalize(() => console.log(`✅ Colleges: ${collegeCount} records`));
  }, 6000);

  // ── 7. CAREERS (1000+ records) ───────────────────────────────────────────
  setTimeout(() => {
    console.log('Seeding Careers...');
    const careerStmt = db.prepare(`INSERT INTO careers 
      (title, category, description, salary_range, job_growth, required_stream, required_skills, roadmap, top_companies, min_education)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const roadmaps = {
      'Technology': ['Learn Programming (Python/JS)', 'Data Structures & Algorithms', 'Build Projects (Portfolio)', 'Internships (Zoho/TechM)', 'Junior Role', 'Specialization (AI/Cloud)'],
      'Healthcare': ['10+2 Biology (PCB)', 'Entrance Exam (NEET)', 'Degree (MBBS/BDS)', 'Internship', 'Specialization (MD/MS)', 'License/Practice'],
      'Finance': ['Commerce/Math Degree', 'Pro Certification (CA/CFA)', 'Financial Modeling', 'Internship', 'Associate Role', 'VP/Director'],
      'Creative Arts': ['Art Foundations', 'Design Tools Mastery', 'Portfolio Dev', 'Freelancing', 'Junior Designer', 'Creative Director'],
      'Engineering': ['10+2 PCM', 'JEE/Entrance', 'B.E./B.Tech Degree', 'Tech Internships', 'Graduate Engineer', 'Sr Engineer'],
      'Legal': ['Law Entrance (CLAT)', 'B.A. LLB / LLB Degree', 'Interships at Law Firms', 'Bar Council Exam', 'Associate Lawyer', 'Senior Advocate/Judge'],
      'Education': ['Bachelors Degree', 'Pro Certification (B.Ed/NET)', 'Masters/PhD for Higher Ed', 'Practice Teaching', 'Asst Professor', 'Dean/Principal'],
      'Defense': ['Physical Training', 'Entrance Exams (NDA/CDS)', 'SSB Interview', 'Academy Training', 'Commissioned Officer'],
      'Government': ['Competitive Exam Prep (UPSC/SSC)', 'Tier 1 & 2 Exams', 'Interview', 'Training Period', 'Gazetted Officer'],
      'Business': ['Business degree (BBA)', 'Internships', 'MBA Specialization', 'Junior Management', 'Strategic Lead', 'Founder/CEO']
    };

    const topCompanies = {
      'Technology': ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Zoho', 'Freshworks'],
      'Healthcare': ['Apollo Hospitals', 'Fortis', 'Max Healthcare', 'AIIMS', 'Aster DM'],
      'Finance': ['Goldman Sachs', 'J.P. Morgan', 'HDFC Bank', 'ICICI Bank', 'SBI'],
      'Creative Arts': ['Adobe', 'Canva', 'Disney', 'DreamWorks', 'Ogilvy'],
      'Engineering': ['L&T', 'Tata Projects', 'Reliance Industries', 'Siemens', 'Bosch'],
      'Legal': ['Shardul Amarchand', 'AZB & Partners', 'Trilegal', 'Cyril Amarchand'],
      'Education': ['IITs/NITs', 'Delhi University', 'SRM', 'VIT', 'Byjus', 'Unacademy'],
      'Defense': ['Indian Army', 'Indian Navy', 'Indian Air Force', 'DRDO', 'ISRO'],
      'Government': ['Central Govt', 'State Govt', 'PSUs', 'NITI Aayog'],
      'Business': ['Reliance', 'Adani', 'Tata Group', 'Mahindra', 'Unilever']
    };

    const seniorities = ['Junior', 'Senior', 'Lead', 'Associate', 'Principal', 'Consultant', 'Expert', 'Specialist', 'Director', 'Head of'];
    let careerCount = 0;
    careerDetails.forEach(detail => {
      const postsPerTitle = Math.ceil(1000 / careerDetails.length) + 1;
      const roadmapArr = roadmaps[detail.category] || ['Study Fundamentals', 'Practical Projects', 'Certification', 'Internship', 'Professional Role'];
      const companiesArr = topCompanies[detail.category] || ['Global Solutions', 'Regional Partners', 'Industry Leaders', 'Consulting Firms'];
      const growth = randInt(10, 35) + '%';



      for (let i = 0; i < postsPerTitle; i++) {
        const seniority = seniorities[i % seniorities.length];
        const title = `${seniority} ${detail.title}`;
        careerStmt.run(
          title,
          detail.category,
          `Exciting career path in ${detail.category} as a ${title}. High demand role with global opportunities.`,
          detail.sal,
          growth,
          rand(['Science', 'Commerce', 'Arts', 'Any']),
          JSON.stringify(['Analytical Thinking', 'Problem Solving', 'Soft Skills', 'Domain Expertise']),
          JSON.stringify(roadmapArr),
          JSON.stringify(companiesArr),
          detail.min_ed
        );
        careerCount++;
      }
    });

    careerStmt.finalize(() => console.log(`✅ Careers: ${careerCount} records`));
  }, 7000);


  // ── 8. COMPANIES (1000+ records) ─────────────────────────────────────────
  setTimeout(() => {
    console.log('Seeding Companies...');
    const companyStmt = db.prepare(`INSERT INTO companies 
      (name, type, sector, headquarters_city, description, website)
      VALUES (?, ?, ?, ?, ?, ?)`);

    let companyCount = 0;
    const baseCompanies = [...companies, 'Wipro', 'HCL', 'ZOHO', 'Freshworks', 'Swiggy', 'Zomato', 'Paytm', 'PhonePe', 'ICICI', 'HDFC'];

    for (let i = 0; i < 1100; i++) {
      const name = `${rand(baseCompanies)} ${rand(['Global', 'India', 'Tech', 'Services', 'Systems', 'Ventures'])} ${i + 1}`;
      const type = rand(['Private', 'Public', 'PSU']);
      const sector = rand(sectors);
      const hq = rand(locations);

      companyStmt.run(
        name, type, sector, hq,
        `${name} is a leading player in the ${sector} industry with global operations.`,
        `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`
      );
      companyCount++;
    }
    companyStmt.finalize(() => console.log(`✅ Companies: ${companyCount} records`));
  }, 8000);


  // ── Final verification ───────────────────────────────────────────────────
  setTimeout(() => {
    console.log('\n📊 Final Record Counts:');
    const tables = ['jobs', 'skills', 'internships', 'govt_jobs', 'scholarships', 'colleges', 'careers', 'companies'];
    tables.forEach(t => {
      db.get(`SELECT COUNT(*) as c FROM ${t}`, [], (e, r) => {
        if (r) console.log(`   ${t}: ${r.c} records`);
      });
    });
    setTimeout(() => {
      console.log('\n🎉 MEGA SEED COMPLETE! All tables are fully populated.\n');
      db.close();
    }, 2000);
  }, 12000);
});

