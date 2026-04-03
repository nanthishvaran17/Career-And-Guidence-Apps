import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Briefcase, MessageSquare, User } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Careers', href: '/careers', icon: Compass },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Chat', href: '/chatbot', icon: MessageSquare },
  { name: 'Profile', href: '/profile-setup', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0
                ${isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className="text-xs truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
