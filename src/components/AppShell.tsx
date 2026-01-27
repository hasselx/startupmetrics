import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
}

const AppShell = ({ children, showNav = true }: AppShellProps) => {
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
