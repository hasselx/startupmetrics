import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import BookIcon from '@/components/BookIcon';
import AppShell from '@/components/AppShell';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import MetricCard from '@/components/MetricCard';
import QuotesCarousel from '@/components/QuotesCarousel';
import { categories } from '@/lib/metrics';
import { useMetrics, useCategoryCounts } from '@/hooks/useMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const searchRef = useRef<{ focus: () => void }>(null);
  const { data: metrics, isLoading } = useMetrics();
  const { data: categoryCounts } = useCategoryCounts();
  const isMobile = useIsMobile();
  const recentMetrics = (metrics || []).slice(0, isMobile ? 3 : 6);
  const totalMetrics = metrics?.length || 0;

  const handleSearchCTAClick = () => {
    searchRef.current?.focus();
  };

  return (
    <AppShell>
      <div className={isMobile ? "px-4 pt-8 pb-4" : ""}>
        {/* Hero Section */}
        <div className={`mb-8 animate-fade-in ${!isMobile ? 'text-center max-w-2xl mx-auto pt-8' : ''}`}>
          <div className={`flex items-center gap-2 mb-3 ${!isMobile ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookIcon size={20} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Startup Metrics
            </span>
          </div>
          <h1 className={`font-bold text-foreground mb-2 leading-tight ${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'}`}>
            Master your startup metrics
          </h1>
          <p className={`text-muted-foreground leading-relaxed ${!isMobile ? 'text-lg' : ''}`}>
            Understand, calculate, and track the KPIs that matter for SaaS growth.
          </p>
        </div>

        {/* Search */}
        <div className={`mb-8 animate-fade-in ${!isMobile ? 'max-w-xl mx-auto' : ''}`} style={{ animationDelay: '50ms' }}>
          <SearchBar ref={searchRef} />
        </div>

        {/* Stats Row */}
        <div className={`grid gap-3 mb-8 animate-fade-in ${isMobile ? 'grid-cols-3' : 'grid-cols-3 max-w-xl mx-auto'}`} style={{ animationDelay: '75ms' }}>
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
          <div className={`flex gap-2 ${isMobile ? 'overflow-x-auto scrollbar-hide -mx-4 px-4' : 'flex-wrap'} pb-2`}>
            {categories.slice(0, isMobile ? 6 : categories.length).map((category) => (
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
            <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => (
                <div key={i} className="metric-card">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
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
            className={`w-full mt-6 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl py-3 px-4 font-medium transition-colors tap-highlight-none ${!isMobile ? 'max-w-xl mx-auto' : ''}`}
          >
            <Sparkles className="w-4 h-4" />
            Search or generate any metric
          </button>
        </div>

        {/* Quotes Carousel */}
        <div className={`mt-10 animate-fade-in ${!isMobile ? 'max-w-2xl mx-auto' : ''}`} style={{ animationDelay: '250ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Words of Wisdom
          </h2>
          <QuotesCarousel />
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
