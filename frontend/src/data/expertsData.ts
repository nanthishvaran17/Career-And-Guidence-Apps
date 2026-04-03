export interface Expert {
  id: number;
  name: string;
  role: string;
  department: string;
  bestFor: string;
  videoUrl: string; // Career Podcast
  salaryVideoUrl?: string; // Salary Guide/Roadmap
  thumbnail: string;
  rating: number;
  avgSalary: string;
}

export const EXPERTS: Expert[] = [
  {
    id: 1,
    name: "Dr. S. Karthick",
    role: "Senior AI Researcher",
    department: "Computer Science (AI/ML)",
    bestFor: "Mastering Machine Learning & Neural Networks",
    videoUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    avgSalary: "₹18 - 45 LPA"
  },
  {
    id: 2,
    name: "Priya Raman",
    role: "HR Lead @ TCS",
    department: "Human Resources",
    bestFor: "Cracking MNC Interviews & Resume Building",
    videoUrl: "https://www.youtube.com/watch?v=nu_pCVPKzTk",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    avgSalary: "₹8 - 22 LPA"
  },
  {
    id: 3,
    name: "Arun Kumar",
    role: "Cloud Architect @ AWS",
    department: "Information Technology",
    bestFor: "AWS Cloud Practitioner & DevOps Roadmap",
    videoUrl: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    salaryVideoUrl: "https://www.youtube.com/watch?v=R_fT6E8r-qM",
    thumbnail: "https://img.youtube.com/vi/SOTamWNgDKc/maxresdefault.jpg",
    rating: 4.7,
    avgSalary: "₹12 - 35 LPA"
  },
  {
    id: 4,
    name: "Dr. Anjali Menon",
    role: "Senior Surgeon",
    department: "Medicine (MBBS)",
    bestFor: "NEET UG/PG Preparation & Clinical Skills",
    videoUrl: "https://www.youtube.com/watch?v=XvG0L_L2XwE",
    salaryVideoUrl: "https://www.youtube.com/watch?v=pGvA57C4c30",
    thumbnail: "https://img.youtube.com/vi/XvG0L_L2XwE/maxresdefault.jpg",
    rating: 5.0,
    avgSalary: "₹12 - 50 LPA"
  },
  {
    id: 5,
    name: "Rahul Sharma",
    role: "Product Manager @ Google",
    department: "Management (MBA)",
    bestFor: "Product Management Strategy and Tech Career",
    videoUrl: "https://www.youtube.com/watch?v=R9OHn5ZF4Uo",
    thumbnail: "https://img.youtube.com/vi/R9OHn5ZF4Uo/maxresdefault.jpg",
    rating: 4.9,
    avgSalary: "₹25 - 60 LPA"
  },
  {
    id: 6,
    name: "Sneha Kapoor",
    role: "Full Stack Developer",
    department: "Software Engineering",
    bestFor: "MERN Stack - From Hero to Zero",
    videoUrl: "https://www.youtube.com/watch?v=nu_pCVPKzTk",
    salaryVideoUrl: "https://www.youtube.com/watch?v=N6uUonp6xps",
    thumbnail: "https://img.youtube.com/vi/nu_pCVPKzTk/maxresdefault.jpg",
    rating: 4.8,
    avgSalary: "₹6 - 28 LPA"
  },
  {
    id: 7,
    name: "Vikram Sethi",
    role: "IAS Officer (Air 14)",
    department: "Civil Services",
    bestFor: "UPSC Strategy & Ethics Preparation",
    videoUrl: "https://www.youtube.com/watch?v=qM79_itR0Nc",
    salaryVideoUrl: "https://www.youtube.com/watch?v=7E2T8f_k47o",
    thumbnail: "https://img.youtube.com/vi/qM79_itR0Nc/maxresdefault.jpg",
    rating: 5.0,
    avgSalary: "₹56,100 - 2,50,000 /mo"
  },
  {
    id: 8,
    name: "Nanthish",
    role: "Data Scientist @ Meta",
    department: "Data Engineering",
    bestFor: "Advanced Python for Data Science and Big Data",
    videoUrl: "https://www.youtube.com/watch?v=y3_jCst-u7Q",
    thumbnail: "https://img.youtube.com/vi/y3_jCst-u7Q/maxresdefault.jpg",
    rating: 4.9,
    avgSalary: "₹15 - 40 LPA"
  },
  {
    id: 9,
    name: "Aditi Rao",
    role: "Digital Marketing Lead @ Meta",
    department: "Marketing",
    bestFor: "Mastering Performance Marketing & Brand Strategy",
    videoUrl: "https://www.youtube.com/watch?v=nu_pCVPKzTk",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    avgSalary: "₹10 - 25 LPA"
  },
  {
    id: 10,
    name: "Karthik S",
    role: "Senior Corporate Lawyer",
    department: "Law",
    bestFor: "Corporate Law Entrance & Career Roadmap",
    videoUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    avgSalary: "₹12 - 40 LPA"
  }
];
