import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';

import {
  Compass,
  GraduationCap,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Bookmark,
  Bell,
  ArrowRight,
  Star,
  Award,
  Target,
  ArrowRightLeft,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  User,
  BookOpen,
  FileText,
  Zap,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { careers } from '../data/mockData';

interface TrustData {
  trustScore: number;
  level: string;
  levelColor: string;
  message: string;
  suggestions: string[];
  breakdown: {
    profileCompletion: number;
    educationDetails: number;
    documentUpload: number;
    skillAssessment: number;
  };
}

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Student');
  const [trustData, setTrustData] = useState<TrustData | null>(null);
  const [trustLoading, setTrustLoading] = useState(true);

  useEffect(() => {
    const fetchTrustScore = async () => {
      try {
        const storedName = localStorage.getItem('userName');
        if (storedName) setUserName(storedName);

        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`${API_BASE_URL}/api/users/trust-score?id=${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
              setTrustData(data);
            }
          }

        }
      } catch (err) {
        console.error('Failed to fetch trust score:', err);

      } finally {
        setTrustLoading(false);
      }
    };
    fetchTrustScore();
  }, []);

  const stats = [
    { label: 'Careers Explored', value: '12', icon: Compass, iconColor: 'text-blue-600', iconBg: 'bg-blue-100', trend: 'text-green-500' },
    { label: 'Jobs Saved', value: '8', icon: Bookmark, iconColor: 'text-green-600', iconBg: 'bg-green-100', trend: 'text-green-500' },
    { label: 'Active Alerts', value: '5', icon: Bell, iconColor: 'text-purple-600', iconBg: 'bg-purple-100', trend: 'text-green-500' },
    { label: 'Profile Match', value: '85%', icon: Target, iconColor: 'text-orange-600', iconBg: 'bg-orange-100', trend: 'text-green-500' },
  ];

  const quickActions = [
    { title: 'Career Paths', description: 'Discover careers that match your profile', icon: Compass, href: '/careers', iconColor: 'text-white', iconBg: 'bg-blue-600' },
    { title: 'Education Guidance', description: 'Find colleges and scholarships', icon: GraduationCap, href: '/education', iconColor: 'text-white', iconBg: 'bg-emerald-600' },
    { title: 'Jobs & Skills', description: 'Browse jobs and skill programs', icon: Briefcase, href: '/jobs', iconColor: 'text-white', iconBg: 'bg-purple-600' },
    { title: 'AI Chatbot', description: 'Get instant career guidance', icon: MessageSquare, href: '/chatbot', iconColor: 'text-white', iconBg: 'bg-orange-600' },
  ];

  const recentActivity = [
    { action: 'Viewed career', item: 'Software Engineer', time: '2 hours ago', icon: Compass },
    { action: 'Saved job', item: 'TCS - Software Developer', time: '5 hours ago', icon: Bookmark },
    { action: 'Scholarship deadline', item: 'PM Special Scholarship', time: '1 day ago', icon: Award },
    { action: 'New recommendation', item: 'Data Scientist path', time: '2 days ago', icon: TrendingUp },
  ];

  const exploreMore = [
    { title: 'Career Path', subtitle: 'Discover your ideal role', icon: Compass, iconColor: 'text-blue-600', iconBg: 'bg-blue-50', route: '/careers' },
    { title: 'Education', subtitle: 'Find colleges & streams', icon: GraduationCap, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', route: '/education' },
    { title: 'Compare & Decide', subtitle: 'Colleges, Schools, Jobs', icon: ArrowRightLeft, iconColor: 'text-purple-600', iconBg: 'bg-purple-50', route: '/compare' },
  ];

  const topRecommendations = careers.slice(0, 3);

  const getLevelStyle = (level: string) => {
    if (level === 'High Trust') return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', stroke: '#22c55e', emoji: '✅' };
    if (level === 'Medium Trust') return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', stroke: '#eab308', emoji: '⚠️' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', stroke: '#ef4444', emoji: '🔴' };
  };

  const breakdownItems = trustData ? [
    { label: 'Profile Completion', score: trustData.breakdown.profileCompletion, max: 40, icon: User, color: 'bg-blue-500' },
    { label: 'Education Details', score: trustData.breakdown.educationDetails, max: 20, icon: BookOpen, color: 'bg-indigo-500' },
    { label: 'Document Upload', score: trustData.breakdown.documentUpload, max: 20, icon: FileText, color: 'bg-purple-500' },
    { label: 'Skill Assessment', score: trustData.breakdown.skillAssessment, max: 20, icon: Zap, color: 'bg-orange-500' },
  ] : [];

  const levelStyle = trustData ? getLevelStyle(trustData.level) : null;
  const circumference = 314.2;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-6"
      >

        {/* ── WELCOME BANNER ── */}
        <motion.div variants={fadeUp}
          className="relative overflow-hidden p-6"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
            border: '2px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '32px',
            boxShadow: '0 0 0 1px rgba(251,191,36,0.15), 0 8px 32px rgba(37,99,235,0.35), 0 0 24px rgba(251,191,36,0.12)'
          }}>
          {/* Amber corner glow top-right */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-16 -mt-16 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 shrink-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-amber-400/50">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-white mb-1 font-extrabold text-2xl sm:text-3xl tracking-tight">
                Welcome back, <span className="text-amber-300">{userName}</span>! 👋
              </h2>
              <p className="text-white/80 font-medium text-sm sm:text-base mt-1 max-w-2xl">
                Ready to take the next step in your career journey? Let's explore your personalized matches.
              </p>
            </div>
          </div>
        </motion.div>






        {/* ── PROFILE TRUST SCORE COMPACT CARD ── */}
        <motion.div variants={fadeUp}>
          <Card className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl bg-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-2xl" />
            
            <div className="relative p-5 flex flex-wrap items-center gap-6">

              {/* Progress Circle (Smaller) */}
              <div className="relative shrink-0 w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" stroke="#f8fafc" strokeWidth="5" fill="white" />
                  <circle cx="28" cy="28" r="24"
                    stroke="#f59e0b" // Medium Trust Amber
                    strokeWidth="5" fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray="150.8"
                    strokeDashoffset={150.8 - (150.8 * 70) / 100} // Hardcoded 70
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg leading-none">70</span>
                </div>
              </div>

              {/* Status Info */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-inter">Profile Trust</p>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-bold border border-yellow-200">
                    ⚠️ Medium Trust
                  </span>
                </div>
                <div className="flex items-end gap-3 justify-between">
                   <div className="flex-1">
                      <div className="h-2 bg-gray-50 rounded-full border border-gray-100 mb-1 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{ width: '70%' }} />
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Only <span className="text-blue-600 font-bold">30 points</span> to reach High Trust
                      </p>
                   </div>
                </div>
              </div>

              {/* CTA Action (Compact) */}
              <button 
                onClick={() => navigate('/profile-setup')}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                Update Profile
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </Card>
        </motion.div>

        {/* ── STATS CARDS ── */}
        <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div key={index} whileHover={{ y: -4 }}>
            <Card className="p-4 h-full hover:shadow-md transition-shadow border border-gray-100 bg-white">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <TrendingUp className={`w-4 h-4 ${stat.trend}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-4 leading-none">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">

            {/* ── QUICK ACTIONS ── */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to={action.href}>
                    <Card className="p-4 transition-all bg-white border border-gray-100 h-full flex flex-col justify-between">
                      <div>
                        <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${action.iconBg}`}>
                          <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{action.title}</h4>
                        <p className="text-sm text-gray-500 mb-4">{action.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-blue-600 font-medium text-sm mt-auto">
                        <span>Explore Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Card>
                  </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── EXPLORE MORE ── */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Explore More</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {exploreMore.map((item, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Card className="p-4 cursor-pointer bg-white border border-gray-100" onClick={() => navigate(item.route)}>
                    <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${item.iconBg}`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── RECENT ACTIVITY ── */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <Card className="bg-white border border-gray-100 overflow-hidden">
                {recentActivity.map((activity, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <activity.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="text-gray-500">{activity.action}:</span>{' '}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </Card>
            </div>
          </motion.div>

          {/* ── TOP RECOMMENDATIONS SIDEBAR ── */}
          <motion.div variants={fadeUp} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Top Recommendations</h3>
            <div className="space-y-4">
              {topRecommendations.map((career) => (
                <motion.div key={career.id} whileHover={{ x: 5 }}>
                <Card className="p-4 transition-shadow bg-white border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-gray-900">{career.title}</h5>
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-emerald-600" />
                      <span className="text-xs font-bold">{career.matchPercentage}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{career.salaryRange}</p>
                  <Link to="/careers">
                    <button className="w-full text-sm font-semibold text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-lg py-2 transition-colors">
                      View Details
                    </button>
                  </Link>
                </Card>
                </motion.div>
              ))}
              <Link to="/careers" className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg py-3 mt-4 transition-colors">
                View All Careers
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
