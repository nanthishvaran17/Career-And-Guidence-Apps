import { Bell, Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from './ui/input';

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

          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search careers, colleges, jobs..." 
                className="pl-9 rounded-full"
              />
            </div>
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-9 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
