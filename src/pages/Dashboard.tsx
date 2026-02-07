import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
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
  Target
} from 'lucide-react';
import { careers } from '../data/mockData';

export function Dashboard() {
  const stats = [
    { label: 'Careers Explored', value: '12', icon: Compass, color: 'blue' },
    { label: 'Jobs Saved', value: '8', icon: Bookmark, color: 'green' },
    { label: 'Active Alerts', value: '5', icon: Bell, color: 'purple' },
    { label: 'Profile Match', value: '85%', icon: Target, color: 'orange' },
  ];

  const quickActions = [
    {
      title: 'Career Paths',
      description: 'Discover careers that match your profile',
      icon: Compass,
      href: '/careers',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Education Guidance',
      description: 'Find colleges and scholarships',
      icon: GraduationCap,
      href: '/education',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Jobs & Skills',
      description: 'Browse jobs and skill programs',
      icon: Briefcase,
      href: '/jobs',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'AI Chatbot',
      description: 'Get instant career guidance',
      icon: MessageSquare,
      href: '/chatbot',
      color: 'from-orange-500 to-orange-600'
    },
  ];

  const recentActivity = [
    { action: 'Viewed career', item: 'Software Engineer', time: '2 hours ago', icon: Compass },
    { action: 'Saved job', item: 'TCS - Software Developer', time: '5 hours ago', icon: Bookmark },
    { action: 'Scholarship deadline', item: 'PM Special Scholarship', time: '1 day ago', icon: Award },
    { action: 'New recommendation', item: 'Data Scientist path', time: '2 days ago', icon: TrendingUp },
  ];

  const topRecommendations = careers.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-xl p-6 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <h2 className="text-white mb-2">Welcome back, Student! 👋</h2>
          <p className="text-blue-100">
            You're on track to achieving your career goals. Let's continue your journey!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            <h3>Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className="p-5 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="mb-2">{action.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center text-sm text-blue-600">
                      Explore <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="mb-4">Recent Activity</h3>
              <Card className="divide-y">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="text-gray-600">{activity.action}:</span>{' '}
                          <span className="text-gray-900">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Recommended Careers Sidebar */}
          <div className="space-y-4">
            <h3>Top Recommendations</h3>
            <div className="space-y-3">
              {topRecommendations.map((career) => (
                <Card key={career.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="flex-1">{career.title}</h5>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Star className="w-4 h-4 fill-green-600" />
                      {career.matchPercentage}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{career.salaryRange}</p>
                  <Link to="/careers">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </Card>
              ))}
              <Link to="/careers">
                <Button variant="ghost" className="w-full text-blue-600">
                  View All Careers <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
