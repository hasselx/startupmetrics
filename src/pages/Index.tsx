import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import MetricCard from '@/components/MetricCard';
import { categories } from '@/lib/metrics';
import { useMetrics } from '@/hooks/useMetrics';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const navigate = useNavigate();
  const { data: metrics, isLoading } = useMetrics();
  const recentMetrics = (metrics || []).slice(0, 4);

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-4">
        {/* App Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Startup Metrics
          </h1>
          <p className="text-muted-foreground">
            Your library of SaaS & startup metrics
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <SearchBar />
        </div>

        {/* Categories */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Categories
          </h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                name={category.name}
                icon={category.icon}
                onClick={() => navigate(`/categories/${category.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Popular Metrics */}
        <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Popular Metrics
            </h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm font-medium text-primary tap-highlight-none"
            >
              See all
            </button>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
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
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
