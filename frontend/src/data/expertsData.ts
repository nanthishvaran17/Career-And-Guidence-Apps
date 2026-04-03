export interface Expert {
  id: number;
  name: string;
  role: string;
  department: string;
  bestFor: string;
  videoUrl: string;
  thumbnail: string;
  rating: number;
}

export const EXPERTS: Expert[] = [
  {
    id: 1,
    name: "Dr. S. Karthick",
    role: "Senior AI Researcher",
    department: "Computer Science (AI/ML)",
    bestFor: "Mastering Machine Learning & Neural Networks",
    videoUrl: "https://www.youtube.com/watch?v=R9OHn5ZF4Uo",
    thumbnail: "https://img.youtube.com/vi/R9OHn5ZF4Uo/maxresdefault.jpg",
    rating: 4.9
  },
  {
    id: 2,
    name: "Priya Raman",
    role: "HR Lead @ TCS",
    department: "Human Resources",
    bestFor: "Cracking MNC Interviews & Resume Building",
    videoUrl: "https://www.youtube.com/watch?v=FcsY1YBAOTU",
    thumbnail: "https://img.youtube.com/vi/FcsY1YBAOTU/maxresdefault.jpg",
    rating: 4.8
  },
  {
    id: 3,
    name: "Arun Kumar",
    role: "Cloud Architect @ AWS",
    department: "Information Technology",
    bestFor: "AWS Cloud Practitioner & DevOps Roadmap",
    videoUrl: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    thumbnail: "https://img.youtube.com/vi/SOTamWNgDKc/maxresdefault.jpg",
    rating: 4.7
  },
  {
    id: 4,
    name: "Dr. Anjali Menon",
    role: "Senior Surgeon",
    department: "Medicine (MBBS)",
    bestFor: "NEET UG/PG Preparation & Clinical Skills",
    videoUrl: "https://www.youtube.com/watch?v=XvG0L_L2XwE",
    thumbnail: "https://img.youtube.com/vi/XvG0L_L2XwE/maxresdefault.jpg",
    rating: 5.0
  },
  {
    id: 5,
    name: "Rahul Sharma",
    role: "Product Manager @ Google",
    department: "Management (MBA)",
    bestFor: "Product Management Strategy and Tech Career",
    videoUrl: "https://www.youtube.com/watch?v=Y8TKOsk6vYw",
    thumbnail: "https://img.youtube.com/vi/Y8TKOsk6vYw/maxresdefault.jpg",
    rating: 4.9
  },
  {
    id: 6,
    name: "Sneha Kapoor",
    role: "Full Stack Developer",
    department: "Software Engineering",
    bestFor: "MERN Stack - From Hero to Zero",
    videoUrl: "https://www.youtube.com/watch?v=nu_pCVPKzTk",
    thumbnail: "https://img.youtube.com/vi/nu_pCVPKzTk/maxresdefault.jpg",
    rating: 4.8
  },
  {
    id: 7,
    name: "Vikram Sethi",
    role: "IAS Officer (Air 14)",
    department: "Civil Services",
    bestFor: "UPSC Strategy & Ethics Preparation",
    videoUrl: "https://www.youtube.com/watch?v=qM79_itR0Nc",
    thumbnail: "https://img.youtube.com/vi/qM79_itR0Nc/maxresdefault.jpg",
    rating: 5.0
  },
  {
    id: 8,
    name: "Nanthish",
    role: "Data Scientist @ Meta",
    department: "Data Engineering",
    bestFor: "Advanced Python for Data Science and Big Data",
    videoUrl: "https://www.youtube.com/watch?v=7Eh8A1X6VzI",
    thumbnail: "https://img.youtube.com/vi/7Eh8A1X6VzI/maxresdefault.jpg",
    rating: 4.9
  },
  // Adding more entries to reach the target...
  ...Array.from({ length: 42 }).map((_, i) => ({
    id: i + 9,
    name: `Expert Profile ${i + 9}`,
    role: "Industry Veteran",
    department: ["Engineering", "Medicine", "Arts", "Business"][i % 4],
    bestFor: "Career Growth and Skill Mastery",
    videoUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
    thumbnail: `https://images.unsplash.com/photo-${1500000000 + i}?auto=format&fit=crop&w=800&q=80`,
    rating: Number((4.5 + Math.random() * 0.5).toFixed(1))
  }))
];
