import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import { sampleMetrics } from '@/data/metrics';
import { useSavedMetrics } from '@/hooks/useSavedMetrics';

const SavedPage = () => {
  const { savedIds } = useSavedMetrics();
  const savedMetrics = sampleMetrics.filter(m => savedIds.includes(m.id));

  return (
    <AppShell>
      <Header title="Saved" />
      <div className="px-4 py-4">
        {savedMetrics.length > 0 ? (
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
