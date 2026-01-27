import { Home, Grid3X3, Search, Bookmark, Settings, LogIn, UserPlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const publicNavItems = [
  { id: 'home', icon: Home, label: 'Home', path: '/' },
  { id: 'categories', icon: Grid3X3, label: 'Categories', path: '/categories' },
  { id: 'search', icon: Search, label: 'Search', path: '/search' },
];

const authNavItems = [
  { id: 'saved', icon: Bookmark, label: 'Saved', path: '/saved' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

const guestNavItems = [
  { id: 'signin', icon: LogIn, label: 'Sign In', path: '/auth?mode=signin' },
  { id: 'signup', icon: UserPlus, label: 'Sign Up', path: '/auth?mode=signup' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/auth')) return location.pathname === '/auth';
    return location.pathname.startsWith(path);
  };

  const navItems = user 
    ? [...publicNavItems, ...authNavItems] 
    : [...publicNavItems, ...guestNavItems];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app-max bg-card/95 backdrop-blur-lg border-t border-border shadow-nav z-50">
      <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`nav-item tap-highlight-none ${active ? 'active' : ''}`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
