import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMetrics, fetchMetricsByCategory, fetchMetricBySlug, searchMetrics, getCategoryCounts, Metric } from '@/lib/metrics';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMetricsByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['metrics', 'category', categoryId],
    queryFn: () => fetchMetricsByCategory(categoryId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMetric(slug: string) {
  return useQuery({
    queryKey: ['metric', slug],
    queryFn: () => fetchMetricBySlug(slug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchMetrics(query: string) {
  return useQuery({
    queryKey: ['metrics', 'search', query],
    queryFn: () => searchMetrics(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCategoryCounts() {
  return useQuery({
    queryKey: ['metrics', 'category-counts'],
    queryFn: getCategoryCounts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInvalidateMetrics() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['metrics'] });
  };
}
