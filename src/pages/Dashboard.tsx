import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
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
  MapPin,
  Zap
} from 'lucide-react';
import { careers } from '../data/mockData';

export function Dashboard() {
  const navigate = useNavigate();

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

  return (
    <Layout>
      <div className="space-y-6">

        {/* ── WELCOME BANNER ── */}
        <div className="rounded-xl p-6 bg-gradient-to-r from-blue-500 to-green-500 text-white mb-6">
          <h2 className="text-white mb-2 font-bold text-2xl">Welcome back, Student! 👋</h2>
          <p className="text-blue-100 font-medium">
            You're on track to achieving your career goals. Let's continue your journey!
          </p>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow border border-gray-100 bg-white">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <TrendingUp className={`w-4 h-4 ${stat.trend}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-4 leading-none">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* ── QUICK ACTIONS ── */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Card className="p-4 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer bg-white border border-gray-100 h-full flex flex-col justify-between">
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
                ))}
              </div>
            </div>

            {/* ── EXPLORE MORE ── */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Explore More</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {exploreMore.map((item, i) => (
                  <Card key={i} className="p-4 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 bg-white border border-gray-100" onClick={() => navigate(item.route)}>
                    <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${item.iconBg}`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* ── RECENT ACTIVITY ── */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <Card className="bg-white border border-gray-100 overflow-hidden">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
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
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* ── TOP RECOMMENDATIONS SIDEBAR ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Top Recommendations</h3>
            <div className="space-y-4">
              {topRecommendations.map((career) => (
                <Card key={career.id} className="p-4 hover:shadow-md transition-shadow bg-white border border-gray-100">
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
              ))}
              <Link to="/careers" className="block text-center text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg py-3 mt-4 transition-colors">
                View All Careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
