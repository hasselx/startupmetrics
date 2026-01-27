import { Home, Grid3X3, Search, Bookmark, Settings, TrendingUp, LogIn, UserPlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const publicNavItems = [
  { id: 'home', icon: Home, label: 'Home', path: '/' },
  { id: 'categories', icon: Grid3X3, label: 'Categories', path: '/categories' },
  { id: 'search', icon: Search, label: 'Search', path: '/search' },
];

const authNavItems = [
  { id: 'saved', icon: Bookmark, label: 'Saved', path: '/saved' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

const DesktopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = user ? [...publicNavItems, ...authNavItems] : publicNavItems;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-lg">Startup Metrics</span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Auth Buttons - Show when logged out */}
            {!loading && !user && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth?mode=signin')}
                  className="gap-2"
                >
                  <LogIn size={16} />
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/auth?mode=signup')}
                  className="gap-2"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DesktopNav;
