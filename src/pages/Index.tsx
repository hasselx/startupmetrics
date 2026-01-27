import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import AppShell from '@/components/AppShell';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import MetricCard from '@/components/MetricCard';
import { categories } from '@/lib/metrics';
import { useMetrics, useCategoryCounts } from '@/hooks/useMetrics';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const navigate = useNavigate();
  const searchRef = useRef<{ focus: () => void }>(null);
  const { data: metrics, isLoading } = useMetrics();
  const { data: categoryCounts } = useCategoryCounts();
  const recentMetrics = (metrics || []).slice(0, 3);
  const totalMetrics = metrics?.length || 0;

  const handleSearchCTAClick = () => {
    searchRef.current?.focus();
  };

  return (
    <AppShell>
      <div className="px-4 pt-8 pb-4">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Startup Metrics
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
            Master your startup metrics
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Understand, calculate, and track the KPIs that matter for SaaS growth.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <SearchBar ref={searchRef} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in" style={{ animationDelay: '75ms' }}>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <p className="text-2xl font-bold text-foreground">{totalMetrics}</p>
            <p className="text-xs text-muted-foreground">Metrics</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <p className="text-2xl font-bold text-foreground">{categories.length}</p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50 flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs font-medium text-primary">AI-Powered</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Browse by Category
            </h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm font-medium text-primary tap-highlight-none flex items-center gap-1"
            >
              All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {categories.slice(0, 6).map((category) => (
              <CategoryChip
                key={category.id}
                name={category.name}
                icon={category.icon}
                onClick={() => navigate(`/categories/${category.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Recent Metrics */}
        <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Popular Metrics
            </h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm font-medium text-primary tap-highlight-none flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="metric-card">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentMetrics.map((metric, index) => (
                <div 
                  key={metric.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  <MetricCard metric={metric} />
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <button 
            onClick={handleSearchCTAClick}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl py-3 px-4 font-medium transition-colors tap-highlight-none"
          >
            <Sparkles className="w-4 h-4" />
            Search or generate any metric
          </button>
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
