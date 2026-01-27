import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import { ChevronRight, Info, FileText, Share2, Mail, LogOut, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useState } from 'react';

const settingsItems = [
  { icon: Info, label: 'About', description: 'Learn more about SML' },
  { icon: FileText, label: 'Terms of Service', description: 'Read our terms' },
  { icon: Share2, label: 'Share App', description: 'Share with friends' },
  { icon: Mail, label: 'Contact', description: 'Get in touch' },
];

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/auth');
    }
    setIsSigningOut(false);
  };

  return (
    <AppShell>
      <Header title="Settings" />
      <div className="px-4 py-4">
        {/* App Info */}
        <div className="text-center py-6 mb-6 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">📊</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Startup Metrics Library</h2>
          <p className="text-sm text-muted-foreground mt-1">Version 1.0.0</p>
        </div>

        {/* Settings List */}
        <div className="space-y-2">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="metric-card w-full text-left tap-highlight-none group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-8 mt-6 space-y-4">
          <p className="text-sm text-muted-foreground italic">
            SML v1.0.0
          </p>
          <a 
            href="https://www.heypage.online/hasselx?referrer=sml&type=redirect" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Built by @hasselx
            <ExternalLink size={14} />
          </a>
          <div className="pt-2">
            {user ? (
              <Button 
                variant="outline" 
                className="rounded-full px-8"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="rounded-full px-8"
                onClick={() => navigate('/auth')}
              >
                <LogOut size={18} />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
