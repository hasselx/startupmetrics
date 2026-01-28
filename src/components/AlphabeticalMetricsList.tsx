import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useInfiniteMetrics } from '@/hooks/useInfiniteMetrics';
import { categories } from '@/lib/metrics';
import { Skeleton } from '@/components/ui/skeleton';

const AlphabeticalMetricsList = () => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteMetrics();

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allMetrics = data?.pages.flatMap((page) => page.metrics) || [];

  // Group metrics by first letter
  const groupedMetrics: Record<string, typeof allMetrics> = {};
  allMetrics.forEach((metric) => {
    const firstLetter = metric.title.charAt(0).toUpperCase();
    if (!groupedMetrics[firstLetter]) {
      groupedMetrics[firstLetter] = [];
    }
    groupedMetrics[firstLetter].push(metric);
  });

  const sortedLetters = Object.keys(groupedMetrics).sort();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load metrics. Please try again.
      </div>
    );
  }

  if (allMetrics.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No metrics found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedLetters.map((letter, letterIndex) => (
        <motion.div
          key={letter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: letterIndex * 0.02 }}
        >
          <h3 className="text-sm font-bold text-primary mb-2 sticky top-0 bg-background/95 backdrop-blur-sm py-1 z-10">
            {letter}
          </h3>
          <div className="space-y-2">
            {groupedMetrics[letter].map((metric, index) => {
              const category = categories.find((c) => c.id === metric.category);
              return (
                <button
                  key={metric.id}
                  onClick={() => navigate(`/metric/${metric.slug}`)}
                  className="metric-card w-full text-left tap-highlight-none group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${category?.color || 'hsl(var(--muted))'}20` }}
                      >
                        {category?.icon || '📊'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-foreground truncate">
                          {metric.title}
                        </h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {category?.name || metric.category}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                      size={18}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        )}
        {!hasNextPage && allMetrics.length > 0 && (
          <p className="text-xs text-muted-foreground">All metrics loaded</p>
        )}
      </div>
    </div>
  );
};

export default AlphabeticalMetricsList;
