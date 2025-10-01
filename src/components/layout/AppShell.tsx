import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  User,
  BarChart3,
  Widget,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'dashboard';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: BarChart3 },
    { name: 'Widgets', href: '/widgets', icon: Widget },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (variant === 'default') {
    return (
      <div className="min-h-screen bg-white">
        {/* Top Navigation */}
        <nav className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-text">LiveTrack</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/projects/new">
                  <Button size="sm" icon={Plus}>
                    New Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text">LiveTrack</span>
          
          <button
            className="ml-auto lg:hidden p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:text-text hover:bg-bg-secondary'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-md">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">John Smith</p>
              <p className="text-xs text-text-muted">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md text-text-muted hover:text-text hover:bg-bg-secondary"
          >
            <Menu size={20} />
          </button>
          
          <Link to="/projects/new">
            <Button size="sm" icon={Plus}>
              New Project
            </Button>
          </Link>
        </div>
        
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}