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
    videoUrl: "https://www.youtube.com/watch?v=R9OHn5ZF4Uo",
    salaryVideoUrl: "https://www.youtube.com/watch?v=3S0mPdM_p_Y",
    thumbnail: "https://img.youtube.com/vi/R9OHn5ZF4Uo/maxresdefault.jpg",
    rating: 4.9,
    avgSalary: "₹18 - 45 LPA"
  },
  {
    id: 2,
    name: "Priya Raman",
    role: "HR Lead @ TCS",
    department: "Human Resources",
    bestFor: "Cracking MNC Interviews & Resume Building",
    videoUrl: "https://www.youtube.com/watch?v=FcsY1YBAOTU",
    salaryVideoUrl: "https://www.youtube.com/watch?v=9D_rUre3XyQ",
    thumbnail: "https://img.youtube.com/vi/FcsY1YBAOTU/maxresdefault.jpg",
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
    videoUrl: "https://www.youtube.com/watch?v=Y8TKOsk6vYw",
    salaryVideoUrl: "https://www.youtube.com/watch?v=9_Cgnd1PAs8",
    thumbnail: "https://img.youtube.com/vi/Y8TKOsk6vYw/maxresdefault.jpg",
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
    videoUrl: "https://www.youtube.com/watch?v=7Eh8A1X6VzI",
    salaryVideoUrl: "https://www.youtube.com/watch?v=9Y_uWJbX6rM",
    thumbnail: "https://img.youtube.com/vi/7Eh8A1X6VzI/maxresdefault.jpg",
    rating: 4.9,
    avgSalary: "₹15 - 40 LPA"
  },
  ...Array.from({ length: 42 }).map((_, i) => {
    const depts = ["Engineering", "Medicine", "Arts", "Business"];
    const dept = depts[i % depts.length];
    const roles: Record<string, string> = {
      Engineering: "Staff Engineer @ Zoho",
      Medicine: "Specialist Physician",
      Arts: "UI/UX Design Director",
      Business: "Investment Banker @ Goldman Sachs"
    };
    const salaries: Record<string, string> = {
      Engineering: "10 - 30 LPA",
      Medicine: "15 - 45 LPA",
      Arts: "8 - 25 LPA",
      Business: "20 - 55 LPA"
    };
    
    return {
      id: i + 9,
      name: `Expert ${i + 9}`,
      role: (roles as any)[dept] || "Industry Expert",
      department: dept,
      bestFor: "Strategic Career Growth and Financial Planning",
      videoUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
      salaryVideoUrl: "https://www.youtube.com/watch?v=3S0mPdM_p_Y",
      thumbnail: `https://images.unsplash.com/photo-${1510000000 + i}?auto=format&fit=crop&w=800&q=80`,
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      avgSalary: `₹${(salaries as any)[dept] || "10 - 25 LPA"}`
    };
  })
];
