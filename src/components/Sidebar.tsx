import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  GraduationCap, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  User,
  X
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
  { name: 'AI Chatbot', href: '/chatbot', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile-setup', icon: User },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

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
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg text-gradient">CareerHub</span>
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

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-card">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-white">SK</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">Student Name</p>
                <p className="text-xs text-gray-500 truncate">student@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
