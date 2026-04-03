import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Bell,
  User,
  BrainCircuit,
  X,
  KeyRound,
  LogOut,
  Activity,
  Video,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Career Recommendations', href: '/careers', icon: Compass },
  { name: 'Education Guidance', href: '/education', icon: GraduationCap },
  { name: 'Jobs & Skills', href: '/jobs', icon: Briefcase },
  { name: 'Experts & Podcasts', href: '/experts', icon: Video },
  { name: 'AI Chatbot', href: '/chatbot', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile-setup', icon: User },
  { name: 'Aptitude Test', href: '/aptitude-test', icon: BrainCircuit },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student';
  const userEmail = localStorage.getItem('userEmail') || 'nanthish@gmail.com';
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');
    const loginAt = localStorage.getItem('loginAt');

    // Log the logout event to DB before clearing session
    if (userId) {
      try {
        await fetch('/api/security/log-logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, email, loginTimestamp: loginAt }),
        });
      } catch (err) {
        console.error('Failed to log logout:', err);
      }
    }

    localStorage.clear();
    navigate('/login');
  };


  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text tracking-tight">CareerHub</span>
            </Link>
            <button onClick={onClose} className="lg:hidden">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Security Settings */}
          <div className="px-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Account Security</p>
            <Link
              to="/change-password"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                location.pathname === '/change-password'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </Link>
            <Link
              to="/activity-log"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                location.pathname === '/activity-log'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Activity Log</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm text-red-500 hover:bg-red-50 mt-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>


          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-card">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-white font-bold">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
