import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import { ChevronRight, Info, FileText, Share2, Mail, LogOut, ExternalLink, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

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

  const handleShare = async () => {
    const shareData = {
      title: 'Startup Metrics Library',
      text: 'Check out this awesome app for startup metrics!',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(window.location.origin);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleContact = () => {
    setContactOpen(true);
  };

  const settingsItems = [
    { icon: Info, label: 'About', description: 'Learn more about SML', action: () => setAboutOpen(true) },
    { icon: FileText, label: 'Terms of Service', description: 'Read our terms', action: () => setTermsOpen(true) },
    { icon: Share2, label: 'Share App', description: 'Share with friends', action: handleShare },
    { icon: Mail, label: 'Contact', description: 'Get in touch', action: handleContact },
  ];

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <AppShell>
      <Header title="Settings" />
      <div className="px-4 py-4">
        {/* App Info */}
        <div className="text-center py-6 mb-6 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M21.5 5.134a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -7.5 -.266v-15.174a10 10 0 0 1 8.5 .708m-10.5 -.707l.001 15.174a8 8 0 0 0 -7.234 .117l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -13.068a1 1 0 0 1 .5 -.866a10 10 0 0 1 8.5 -.707" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Startup Metrics Library</h2>
          <p className="text-sm text-muted-foreground mt-1">Version 1.0.0</p>
        </div>

        {/* Profile Section - Now below app icon */}
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="w-full metric-card mb-6 animate-fade-in"
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">
                  {profile?.display_name || 'Your Profile'}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </button>
        )}

        {/* Settings List */}
        <div className="space-y-2">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
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

      {/* About Dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>About Startup Metrics</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-6 pt-4 text-left">
                {/* Our Purpose */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Our Purpose</h4>
                  <p>Startup Metrics Library (SML) is your comprehensive guide to understanding and tracking the key metrics that drive startup success.</p>
                </div>

                {/* Founder */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Founder & Creator</h4>
                  <p><span className="font-medium text-primary">Naveen Krishnan R</span> is the founder and creator of Startup Metrics.</p>
                  <p className="mt-1 text-sm">Developer passionate about creating tools that simplify digital experiences.</p>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-16 font-medium text-primary">2025</span>
                      <span>Idea conceptualized</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-16 font-medium text-primary">2026</span>
                      <span>Web app launched</span>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Comprehensive metric definitions & formulas</li>
                    <li>Interactive visualizations</li>
                    <li>Save & organize your favorite metrics</li>
                    <li>Search across all categories</li>
                  </ul>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                  <p className="text-sm text-muted-foreground">© 2024 Startup Metrics Library</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4 text-left">
                <h4 className="font-semibold text-foreground">1. Acceptance of Terms</h4>
                <p>By accessing and using Startup Metrics Library, you agree to be bound by these Terms of Service.</p>
                
                <h4 className="font-semibold text-foreground">2. Use of Service</h4>
                <p>The content provided is for informational purposes only. We do not guarantee the accuracy of any metric definitions or calculations.</p>
                
                <h4 className="font-semibold text-foreground">3. User Accounts</h4>
                <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
                
                <h4 className="font-semibold text-foreground">4. Intellectual Property</h4>
                <p>All content, features, and functionality are owned by Startup Metrics Library.</p>
                
                <h4 className="font-semibold text-foreground">5. Limitation of Liability</h4>
                <p>SML shall not be liable for any indirect, incidental, or consequential damages.</p>
                
                <p className="text-sm text-muted-foreground pt-4">Last updated: January 2024</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <p>We'd love to hear from you! Reach out with any questions, feedback, or suggestions.</p>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Email</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Send us an email and we'll respond as soon as possible.</p>
                  <div className="flex items-center gap-2">
                    <a 
                      href="https://mail.google.com/mail/u/0/?fs=1&to=ihasselx@gmail.com&tf=cm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg font-medium text-center transition-colors"
                    >
                      Send Email
                    </a>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('ihasselx@gmail.com');
                        toast.success('Email copied to clipboard!');
                      }}
                      className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-primary mt-2">ihasselx@gmail.com</p>
                </div>
                <a 
                  href="https://www.heypage.online/hasselx?referrer=sml&type=redirect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <span className="text-foreground">@hasselx on HeyPage</span>
                </a>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default SettingsPage;
