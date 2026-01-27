import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import { useMetrics } from '@/hooks/useMetrics';
import { useSavedMetrics } from '@/hooks/useSavedMetrics';
import { Skeleton } from '@/components/ui/skeleton';

const SavedPage = () => {
  const { savedIds } = useSavedMetrics();
  const { data: allMetrics, isLoading } = useMetrics();
  const savedMetrics = (allMetrics || []).filter(m => savedIds.includes(m.id));

  return (
    <AppShell>
      <Header title="Saved" />
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="metric-card">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : savedMetrics.length > 0 ? (
          <div className="space-y-3">
            {savedMetrics.map((metric, index) => (
              <div 
                key={metric.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MetricCard metric={metric} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📑</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">No saved metrics</h3>
            <p className="text-sm text-muted-foreground">
              Bookmark metrics to see them here
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default SavedPage;
