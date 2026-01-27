import { Home, Grid3X3, Search, Bookmark, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'home', icon: Home, label: 'Home', path: '/' },
  { id: 'categories', icon: Grid3X3, label: 'Categories', path: '/categories' },
  { id: 'search', icon: Search, label: 'Search', path: '/search' },
  { id: 'saved', icon: Bookmark, label: 'Saved', path: '/saved' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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
