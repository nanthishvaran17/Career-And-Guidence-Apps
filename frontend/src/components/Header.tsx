import { Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <Link to="/dashboard" className="lg:hidden flex items-center gap-1.5">
            <span className="text-lg font-black bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text tracking-tight">CareerHub</span>
          </Link>

          {/* Desktop search */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <GlobalSearch />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Link 
            to="/notifications"
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-4">
        <GlobalSearch />
      </div>
    </header>
  );
}
