import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
