import { Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        {/* LEFT SECTION (LOGO) */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <Link to="/dashboard" className="lg:hidden flex items-center gap-1.5">
            <span className="text-xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text tracking-tight">CareerHub</span>
          </Link>
        </div>

        {/* CENTER SECTION (SEARCH) - Truly Centered */}
        <div className="hidden lg:flex flex-1 justify-center px-8">
          <div className="w-full max-w-2xl">
            <GlobalSearch />
          </div>
        </div>

        {/* RIGHT SECTION (ICONS) */}
        <div className="flex items-center justify-end gap-2 min-w-[200px]">
          <Link 
            to="/notifications"
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
        </div>
      </div>

      {/* Mobile search - High Visibility */}
      <div className="lg:hidden px-4 pb-4">
        <div className="max-w-md mx-auto">
          <GlobalSearch />
        </div>
      </div>
    </header>
  );
}
