// Mock data for Career & Education Advisor Platform

export interface Career {
  id: string;
  title: string;
  matchPercentage: number;
  salaryRange: string;
  requiredSkills: string[];
  jobGrowth: string;
  roadmap: string[];
  topCompanies: string[];
  category: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  field: string;
  fees: string;
  rating: number;
  type: string;
}

export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  eligibility: string;
  deadline: string;
  type: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'job' | 'scholarship' | 'general';
  date: string;
  read: boolean;
}

export const careers: Career[] = [
  {
    id: '1',
    title: 'Software Engineer',
    matchPercentage: 92,
    salaryRange: '₹6-15 LPA',
    requiredSkills: ['Programming', 'Problem Solving', 'Data Structures', 'Web Development'],
    jobGrowth: '22% (Very High)',
    roadmap: [
      'Complete 12th with PCM',
      'Pursue B.Tech in Computer Science',
      'Learn programming languages (Python, Java, C++)',
      'Build projects and contribute to open source',
      'Complete internships',
      'Apply for jobs or higher studies'
    ],
    topCompanies: ['TCS', 'Infosys', 'Google', 'Microsoft', 'Amazon'],
    category: 'STEM'
  },
  {
    id: '2',
    title: 'Data Scientist',
    matchPercentage: 88,
    salaryRange: '₹8-20 LPA',
    requiredSkills: ['Statistics', 'Python', 'Machine Learning', 'Data Analysis'],
    jobGrowth: '31% (Very High)',
    roadmap: [
      'Complete 12th with PCM',
      'Pursue B.Tech/B.Sc in relevant field',
      'Learn Python and statistics',
      'Master machine learning algorithms',
      'Work on data projects',
      'Pursue M.Sc or certifications'
    ],
    topCompanies: ['Flipkart', 'Google', 'Amazon', 'Accenture', 'Deloitte'],
    category: 'STEM'
  },
  {
    id: '3',
    title: 'Civil Services (IAS/IPS)',
    matchPercentage: 85,
    salaryRange: '₹56,100 - ₹2,50,000/month',
    requiredSkills: ['General Knowledge', 'Current Affairs', 'Essay Writing', 'Critical Thinking'],
    jobGrowth: 'Stable (Govt)',
    roadmap: [
      'Complete Graduation in any stream',
      'Start UPSC preparation',
      'Clear Prelims exam',
      'Clear Mains exam',
      'Pass Interview',
      'Join training academy'
    ],
    topCompanies: ['UPSC', 'Government of India'],
    category: 'Government'
  },
  {
    id: '4',
    title: 'Doctor (MBBS)',
    matchPercentage: 80,
    salaryRange: '₹6-25 LPA',
    requiredSkills: ['Biology', 'Chemistry', 'Patient Care', 'Medical Knowledge'],
    jobGrowth: '15% (High)',
    roadmap: [
      'Complete 12th with PCB',
      'Clear NEET exam',
      'Pursue MBBS (5.5 years)',
      'Complete internship',
      'Pursue MD/MS for specialization',
      'Practice or join hospital'
    ],
    topCompanies: ['AIIMS', 'Government Hospitals', 'Apollo', 'Fortis', 'Max Healthcare'],
    category: 'Healthcare'
  },
  {
    id: '5',
    title: 'Digital Marketing Specialist',
    matchPercentage: 78,
    salaryRange: '₹3-10 LPA',
    requiredSkills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
    jobGrowth: '18% (High)',
    roadmap: [
      'Complete 12th in any stream',
      'Pursue BBA/B.Com/Mass Communication',
      'Learn digital marketing tools',
      'Get certified (Google, HubSpot)',
      'Build portfolio with campaigns',
      'Apply for marketing roles'
    ],
    topCompanies: ['Ogilvy', 'WPP', 'Dentsu', 'Flipkart', 'Amazon'],
    category: 'Business'
  }
];

export const colleges: College[] = [
  // --- ENGINEERING (Tamil Nadu) ---
  { id: '1', name: 'IIT Madras', location: 'Chennai', field: 'Engineering', fees: '₹2-2.5 LPA', rating: 4.9, type: 'Government' },
  { id: '2', name: 'Anna University (CEG)', location: 'Chennai', field: 'Engineering', fees: '₹50,000-1 LPA', rating: 4.8, type: 'Government' },
  { id: '3', name: 'NIT Trichy', location: 'Trichy', field: 'Engineering', fees: '₹1.5-2 LPA', rating: 4.8, type: 'Government' },
  { id: '4', name: 'PSG College of Technology', location: 'Coimbatore', field: 'Engineering', fees: '₹1-2 LPA', rating: 4.7, type: 'Private' },
  { id: '5', name: 'SSN College of Engineering', location: 'Chennai', field: 'Engineering', fees: '₹2-3 LPA', rating: 4.6, type: 'Private' },
  { id: '6', name: 'Thiagarajar College of Engineering', location: 'Madurai', field: 'Engineering', fees: '₹50,000-1 LPA', rating: 4.6, type: 'Private' },
  { id: '7', name: 'Coimbatore Institute of Technology (CIT)', location: 'Coimbatore', field: 'Engineering', fees: '₹50,000-1 LPA', rating: 4.5, type: 'Government' },
  { id: '8', name: 'Madras Institute of Technology (MIT)', location: 'Chennai', field: 'Engineering', fees: '₹50,000-1 LPA', rating: 4.7, type: 'Government' },
  { id: '9', name: 'Kumaraguru College of Technology', location: 'Coimbatore', field: 'Engineering', fees: '₹1.5-2.5 LPA', rating: 4.5, type: 'Private' },
  { id: '10', name: 'Sri Krishna College of Engineering', location: 'Coimbatore', field: 'Engineering', fees: '₹1.5-2 LPA', rating: 4.4, type: 'Private' },
  { id: '11', name: 'Sastra Deemed University', location: 'Thanjavur', field: 'Engineering', fees: '₹1.5-2 LPA', rating: 4.6, type: 'Private' },
  { id: '12', name: 'Vellore Institute of Technology (VIT)', location: 'Vellore', field: 'Engineering', fees: '₹2-4 LPA', rating: 4.7, type: 'Private' },
  { id: '13', name: 'SRM Institute of Science and Technology', location: 'Chennai', field: 'Engineering', fees: '₹2.5-4 LPA', rating: 4.5, type: 'Private' },
  { id: '14', name: 'Sona College of Technology', location: 'Salem', field: 'Engineering', fees: '₹1-2 LPA', rating: 4.3, type: 'Private' },
  { id: '15', name: 'Mepco Schlenk Engineering College', location: 'Sivakasi', field: 'Engineering', fees: '₹1-2 LPA', rating: 4.4, type: 'Private' },
  { id: '16', name: 'Bannari Amman Institute of Technology', location: 'Erode', field: 'Engineering', fees: '₹1.5-2 LPA', rating: 4.4, type: 'Private' },
  { id: '17', name: 'Kongu Engineering College', location: 'Erode', field: 'Engineering', fees: '₹1-2 LPA', rating: 4.3, type: 'Private' },
  { id: '18', name: 'Government College of Technology (GCT)', location: 'Coimbatore', field: 'Engineering', fees: '₹20,000-50,000', rating: 4.5, type: 'Government' },
  { id: '19', name: 'Alagappa Chettiar Govt College', location: 'Karaikudi', field: 'Engineering', fees: '₹20,000-50,000', rating: 4.2, type: 'Government' },
  { id: '20', name: 'Government College of Engineering', location: 'Salem', field: 'Engineering', fees: '₹20,000-50,000', rating: 4.1, type: 'Government' },

  // --- ARTS & SCIENCES (Tamil Nadu) ---
  { id: '21', name: 'Loyola College', location: 'Chennai', field: 'Arts & Science', fees: '₹25,000-50,000', rating: 4.8, type: 'Private' },
  { id: '22', name: 'Madras Christian College (MCC)', location: 'Chennai', field: 'Arts & Science', fees: '₹30,000-60,000', rating: 4.7, type: 'Private' },
  { id: '23', name: 'Presidency College', location: 'Chennai', field: 'Arts & Science', fees: '₹5,000-15,000', rating: 4.5, type: 'Government' },
  { id: '24', name: 'PSG College of Arts and Science', location: 'Coimbatore', field: 'Arts & Science', fees: '₹30,000-60,000', rating: 4.6, type: 'Private' },
  { id: '25', name: 'Stella Maris College', location: 'Chennai', field: 'Arts & Science', fees: '₹30,000-60,000', rating: 4.6, type: 'Private' },
  { id: '26', name: 'The American College', location: 'Madurai', field: 'Arts & Science', fees: '₹20,000-50,000', rating: 4.4, type: 'Private' },
  { id: '27', name: 'Lady Doak College', location: 'Madurai', field: 'Arts & Science', fees: '₹25,000-55,000', rating: 4.5, type: 'Private' },
  { id: '28', name: 'St. Joseph\'s College', location: 'Trichy', field: 'Arts & Science', fees: '₹20,000-50,000', rating: 4.5, type: 'Private' },
  { id: '29', name: 'Bishop Heber College', location: 'Trichy', field: 'Arts & Science', fees: '₹25,000-55,000', rating: 4.4, type: 'Private' },
  { id: '30', name: 'Fatima College', location: 'Madurai', field: 'Arts & Science', fees: '₹20,000-50,000', rating: 4.3, type: 'Private' },
  { id: '31', name: 'Jamal Mohamed College', location: 'Trichy', field: 'Arts & Science', fees: '₹20,000-50,000', rating: 4.4, type: 'Private' },
  { id: '32', name: 'Ayya Nadar Janaki Ammal College', location: 'Sivakasi', field: 'Arts & Science', fees: '₹15,000-40,000', rating: 4.3, type: 'Private' },
  { id: '33', name: 'Sri Krishna Arts and Science College', location: 'Coimbatore', field: 'Arts & Science', fees: '₹30,000-60,000', rating: 4.5, type: 'Private' },
  { id: '34', name: 'Ethiraj College for Women', location: 'Chennai', field: 'Arts & Science', fees: '₹30,000-60,000', rating: 4.6, type: 'Private' },
  { id: '35', name: 'Women\'s Christian College', location: 'Chennai', field: 'Arts & Science', fees: '₹35,000-70,000', rating: 4.7, type: 'Private' },
  { id: '36', name: 'Government Arts College', location: 'Coimbatore', field: 'Arts & Science', fees: '₹2,000-10,000', rating: 4.2, type: 'Government' },
  { id: '37', name: 'Government Arts College', location: 'Salem', field: 'Arts & Science', fees: '₹2,000-10,000', rating: 4.0, type: 'Government' },
  { id: '38', name: 'Periyar University', location: 'Salem', field: 'Arts & Science', fees: '₹10,000-30,000', rating: 4.1, type: 'Government' },
  { id: '39', name: 'Bharathiar University', location: 'Coimbatore', field: 'Arts & Science', fees: '₹10,000-30,000', rating: 4.3, type: 'Government' },
  { id: '40', name: 'Madurai Kamaraj University', location: 'Madurai', field: 'Arts & Science', fees: '₹10,000-30,000', rating: 4.2, type: 'Government' },

  // --- MEDICAL (Tamil Nadu) ---
  { id: '41', name: 'Madras Medical College (MMC)', location: 'Chennai', field: 'Medical', fees: '₹15,000/year', rating: 4.9, type: 'Government' },
  { id: '42', name: 'Christian Medical College (CMC)', location: 'Vellore', field: 'Medical', fees: '₹50,000/year', rating: 4.9, type: 'Private' },
  { id: '43', name: 'Stanley Medical College', location: 'Chennai', field: 'Medical', fees: '₹15,000/year', rating: 4.7, type: 'Government' },
  { id: '44', name: 'Coimbatore Medical College', location: 'Coimbatore', field: 'Medical', fees: '₹15,000/year', rating: 4.6, type: 'Government' },
  { id: '45', name: 'Madurai Medical College', location: 'Madurai', field: 'Medical', fees: '₹15,000/year', rating: 4.6, type: 'Government' },
  { id: '46', name: 'Thanjavur Medical College', location: 'Thanjavur', field: 'Medical', fees: '₹15,000/year', rating: 4.5, type: 'Government' },
  { id: '47', name: 'Kilpauk Medical College', location: 'Chennai', field: 'Medical', fees: '₹15,000/year', rating: 4.5, type: 'Government' },
  { id: '48', name: 'Tirunelveli Medical College', location: 'Tirunelveli', field: 'Medical', fees: '₹15,000/year', rating: 4.4, type: 'Government' },
  { id: '49', name: 'Sri Ramachandra Medical College', location: 'Chennai', field: 'Medical', fees: '₹20-25 LPA', rating: 4.7, type: 'Private' },
  { id: '50', name: 'SRM Medical College', location: 'Chennai', field: 'Medical', fees: '₹20-25 LPA', rating: 4.5, type: 'Private' },
  { id: '51', name: 'PSG Institute of Medical Sciences', location: 'Coimbatore', field: 'Medical', fees: '₹15-20 LPA', rating: 4.6, type: 'Private' },

  // --- COMPUTER APPLICATIONS (BCA) ---
  { id: '52', name: 'Madras Christian College (BCA)', location: 'Chennai', field: 'Computer Applications', fees: '₹40,000-80,000', rating: 4.7, type: 'Private' },
  { id: '53', name: 'Loyola College (BCA)', location: 'Chennai', field: 'Computer Applications', fees: '₹40,000-80,000', rating: 4.8, type: 'Private' },
  { id: '54', name: 'Vellore Institute of Technology (BCA)', location: 'Vellore', field: 'Computer Applications', fees: '₹1-1.5 LPA', rating: 4.6, type: 'Private' },
  { id: '55', name: 'SRM Institute (BCA)', location: 'Chennai', field: 'Computer Applications', fees: '₹1-1.5 LPA', rating: 4.5, type: 'Private' },
  { id: '56', name: 'PSG College of Arts (BCA)', location: 'Coimbatore', field: 'Computer Applications', fees: '₹40,000-80,000', rating: 4.6, type: 'Private' },
  { id: '57', name: 'Bishop Heber College (BCA)', location: 'Trichy', field: 'Computer Applications', fees: '₹40,000-70,000', rating: 4.4, type: 'Private' },
  { id: '58', name: 'Jamal Mohamed College (BCA)', location: 'Trichy', field: 'Computer Applications', fees: '₹30,000-60,000', rating: 4.3, type: 'Private' },
  { id: '59', name: 'Sri Krishna Arts (BCA)', location: 'Coimbatore', field: 'Computer Applications', fees: '₹40,000-80,000', rating: 4.5, type: 'Private' },
];

export const scholarships: Scholarship[] = [
  {
    id: '1',
    name: 'Prime Minister Special Scholarship Scheme',
    amount: '₹30,000 - ₹3,00,000',
    eligibility: 'Students of J&K pursuing higher education',
    deadline: '31st December 2025',
    type: 'Government'
  },
  {
    id: '2',
    name: 'National Scholarship Portal',
    amount: 'Varies',
    eligibility: 'Pre-matric to post-matric students',
    deadline: '31st January 2026',
    type: 'Government'
  },
  {
    id: '3',
    name: 'INSPIRE Scholarship',
    amount: '₹80,000/year',
    eligibility: 'Top 1% students in 12th board exams',
    deadline: '15th December 2025',
    type: 'Government'
  },
  {
    id: '4',
    name: 'Post Matric Scholarship for Minorities',
    amount: '₹1,000 - ₹10,000',
    eligibility: 'Minority community students',
    deadline: '28th February 2026',
    type: 'Government'
  },
  {
    id: '5',
    name: 'Central Sector Scheme of Scholarship',
    amount: '₹10,000 - ₹20,000',
    eligibility: 'Students with family income < ₹4.5 LPA',
    deadline: '20th January 2026',
    type: 'Government'
  }
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Software Developer',
    company: 'TCS',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹3.5-6 LPA',
    deadline: '30th November 2025',
    category: 'job'
  },
  {
    id: '2',
    title: 'Junior Engineer (Civil)',
    company: 'JKPDD',
    location: 'Jammu & Kashmir',
    type: 'Government',
    salary: '₹35,400 - ₹1,12,400',
    deadline: '15th December 2025',
    category: 'job'
  },
  {
    id: '3',
    title: 'Marketing Intern',
    company: 'Flipkart',
    location: 'Remote',
    type: 'Internship',
    salary: '₹10,000 - ₹15,000/month',
    deadline: '25th November 2025',
    category: 'internship'
  },
  {
    id: '4',
    title: 'Data Analytics Bootcamp',
    company: 'Skill India',
    location: 'Online',
    type: 'Training',
    salary: 'Free',
    deadline: '10th December 2025',
    category: 'skill'
  },
  {
    id: '5',
    title: 'Banking Assistant',
    company: 'J&K Bank',
    location: 'J&K',
    type: 'Government',
    salary: '₹25,000 - ₹40,000',
    deadline: '20th December 2025',
    category: 'job'
  },
  {
    id: '6',
    title: 'Web Development Intern',
    company: 'Infosys',
    location: 'Hybrid',
    type: 'Internship',
    salary: '₹15,000/month',
    deadline: '5th December 2025',
    category: 'internship'
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'NEET 2026 Registration Open',
    message: 'Registration for NEET 2026 has started. Last date: 20th December 2025',
    type: 'exam',
    date: '2025-11-10',
    read: false
  },
  {
    id: '2',
    title: 'New Scholarship Available',
    message: 'Prime Minister Special Scholarship deadline extended to 31st Dec',
    type: 'scholarship',
    date: '2025-11-12',
    read: false
  },
  {
    id: '3',
    title: 'Job Alert: TCS Hiring',
    message: 'TCS is hiring for Software Developer positions. Apply before 30th Nov',
    type: 'job',
    date: '2025-11-14',
    read: true
  },
  {
    id: '4',
    title: 'JEE Main 2026 Schedule Released',
    message: 'JEE Main 2026 will be conducted in January and April 2026',
    type: 'exam',
    date: '2025-11-08',
    read: false
  },
  {
    id: '5',
    title: 'Profile Completion Reminder',
    message: 'Complete your profile to get better career recommendations',
    type: 'general',
    date: '2025-11-15',
    read: false
  }
];

export const testimonials = [
  {
    id: '1',
    name: 'Aarav Sharma',
    location: 'Jammu',
    message: 'This platform helped me discover my passion for software engineering. Got into NIT Srinagar!',
    avatar: 'AS'
  },
  {
    id: '2',
    name: 'Priya Koul',
    location: 'Srinagar',
    message: 'Found the perfect scholarship that covered my entire college fees. Grateful!',
    avatar: 'PK'
  },
  {
    id: '3',
    name: 'Ravi Kumar',
    location: 'Leh',
    message: 'The AI chatbot guided me through career options I never knew existed. Highly recommend!',
    avatar: 'RK'
  }
];

export const stats = {
  studentsGuided: '50,000+',
  careersAvailable: '500+',
  jobsListed: '10,000+',
  scholarships: '200+'
};
