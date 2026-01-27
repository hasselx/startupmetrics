import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import { ChevronRight, Info, FileText, Share2, Mail } from 'lucide-react';

const settingsItems = [
  { icon: Info, label: 'About', description: 'Learn more about SML' },
  { icon: FileText, label: 'Terms of Service', description: 'Read our terms' },
  { icon: Share2, label: 'Share App', description: 'Share with friends' },
  { icon: Mail, label: 'Contact', description: 'Get in touch' },
];

const SettingsPage = () => {
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
        <div className="text-center py-8 mt-6">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for founders
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
