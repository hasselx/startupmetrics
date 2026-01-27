import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import DesktopNav from './DesktopNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
}

const AppShell = ({ children, showNav = true }: AppShellProps) => {
  const isMobile = useIsMobile();

  // Desktop layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {showNav && <DesktopNav />}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    );
  }

  // Mobile layout (app-like)
  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      <div className="app-shell bg-background flex flex-col w-full">
        <main className={`flex-1 overflow-y-auto scrollbar-hide ${showNav ? 'pb-nav' : ''}`}>
          {children}
        </main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
};

export default AppShell;
