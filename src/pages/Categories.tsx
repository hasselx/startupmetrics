import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import CategoryPieChart from '@/components/CategoryPieChart';
import { categories } from '@/lib/metrics';
import { useCategoryCounts } from '@/hooks/useMetrics';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Categories = () => {
  const navigate = useNavigate();
  const { data: counts, isLoading } = useCategoryCounts();

  return (
    <AppShell>
      <Header title="Categories" />
      <div className="px-4 py-4 space-y-6">
        {/* Pie Chart Section */}
        <div className="animate-fade-in">
          {isLoading ? (
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ) : (
            <CategoryPieChart counts={counts || {}} />
          )}
        </div>

        {/* Category List */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            All Categories
          </h2>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => navigate(`/categories/${category.id}`)}
                className="metric-card w-full text-left tap-highlight-none group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      {isLoading ? (
                        <Skeleton className="h-4 w-16 mt-1" />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {counts?.[category.id] || 0} metrics
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight 
                    className="text-muted-foreground group-hover:text-primary transition-colors" 
                    size={20} 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Categories;
