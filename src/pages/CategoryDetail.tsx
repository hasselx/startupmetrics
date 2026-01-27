import { useParams } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import { categories, sampleMetrics } from '@/data/metrics';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id === categoryId);
  const metrics = sampleMetrics.filter(m => m.category === categoryId);

  if (!category) {
    return (
      <AppShell>
        <Header title="Category" showBack />
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">Category not found</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header title={category.name} showBack />
      <div className="px-4 py-4">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-3xl">
            {category.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">
              {metrics.length} metric{metrics.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Metrics List */}
        {metrics.length > 0 ? (
          <div className="space-y-3">
            {metrics.map((metric, index) => (
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">No metrics in this category yet</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CategoryDetail;
