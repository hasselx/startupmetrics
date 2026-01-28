import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Metric } from '@/lib/metrics';

const PAGE_SIZE = 20;

interface MetricsPage {
  metrics: Metric[];
  nextCursor: number | null;
}

async function fetchMetricsPage(cursor: number): Promise<MetricsPage> {
  const from = cursor;
  const to = cursor + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('metrics')
    .select('*', { count: 'exact' })
    .order('title', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching metrics page:', error);
    throw error;
  }

  const metrics: Metric[] = (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category,
    definition: item.definition,
    formula: item.formula,
    visualization_type: item.visualization_type as Metric['visualization_type'],
    visualization_data: item.visualization_data as Metric['visualization_data'],
    example: item.example,
    why_it_matters: item.why_it_matters,
    source: item.source as Metric['source'],
    created_at: item.created_at,
  }));

  const totalCount = count || 0;
  const nextCursor = to + 1 < totalCount ? to + 1 : null;

  return { metrics, nextCursor };
}

export function useInfiniteMetrics() {
  return useInfiniteQuery({
    queryKey: ['metrics', 'infinite', 'alphabetical'],
    queryFn: ({ pageParam = 0 }) => fetchMetricsPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
}
