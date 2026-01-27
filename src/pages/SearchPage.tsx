import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import MetricCard from '@/components/MetricCard';
import { useSearchMetrics, useInvalidateMetrics } from '@/hooks/useMetrics';
import { generateMetric, findExactMetricByTitle } from '@/lib/metrics';
import { toast } from 'sonner';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: results, isLoading } = useSearchMetrics(query);
  const invalidateMetrics = useInvalidateMetrics();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!query.trim() || query.length < 2) return;
    
    setIsGenerating(true);
    try {
      // First check for exact title match
      const existingMetric = await findExactMetricByTitle(query);
      if (existingMetric) {
        navigate(`/metric/${existingMetric.slug}`);
        return;
      }
      
      // No exact match - generate new metric
      const { metric, generated, error, requiresAuth } = await generateMetric(query);
      
      if (error) {
        toast.error(error);
        if (requiresAuth) {
          navigate('/auth');
        }
        return;
      }
      
      if (metric) {
        if (generated) {
          toast.success(`Generated: ${metric.title}`);
        }
        invalidateMetrics();
        navigate(`/metric/${metric.slug}`);
      }
    } catch (err) {
      toast.error('Failed to generate metric');
    } finally {
      setIsGenerating(false);
    }
  };

  const showGenerateOption = query.length >= 2 && !isLoading && (!results || results.length === 0);

  return (
    <AppShell>
      <Header title="Search" />
      <div className="px-4 py-4">
        <div className="mb-6">
          <SearchBar autoFocus onSearch={setQuery} />
        </div>

        {query.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Search Metrics</h3>
            <p className="text-sm text-muted-foreground">
              Type to search for startup metrics
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="metric-card animate-pulse">
                <div className="h-4 w-20 bg-muted rounded mb-2" />
                <div className="h-5 w-48 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
            {results.map((metric, index) => (
              <div 
                key={metric.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MetricCard metric={metric} />
              </div>
            ))}
          </div>
        ) : showGenerateOption ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-primary" size={28} />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No exact match found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Would you like to generate this metric using AI?
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 tap-highlight-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate "{query}"
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
};

export default SearchPage;
