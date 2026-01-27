import { supabase } from "@/integrations/supabase/client";

export interface Metric {
  id: string;
  title: string;
  slug: string;
  category: string;
  definition: string;
  formula: string;
  visualization_type: 'line' | 'bar' | 'funnel' | 'pie';
  visualization_data: {
    labels: string[];
    values: number[];
  };
  example: string;
  why_it_matters: string;
  source: 'human' | 'ai';
  created_at: string;
}

export const categories = [
  { id: 'financial', name: 'Financial', icon: '💰', color: 'hsl(168, 80%, 32%)' },
  { id: 'growth', name: 'Growth', icon: '📈', color: 'hsl(262, 80%, 50%)' },
  { id: 'retention', name: 'Retention', icon: '🔄', color: 'hsl(340, 80%, 50%)' },
  { id: 'product', name: 'Product', icon: '📦', color: 'hsl(200, 80%, 50%)' },
  { id: 'marketing', name: 'Marketing', icon: '📣', color: 'hsl(30, 80%, 50%)' },
  { id: 'sales', name: 'Sales', icon: '🎯', color: 'hsl(150, 80%, 40%)' },
  { id: 'unit-economics', name: 'Unit Economics', icon: '⚖️', color: 'hsl(280, 70%, 50%)' },
  { id: 'saas', name: 'SaaS', icon: '☁️', color: 'hsl(220, 80%, 50%)' },
  { id: 'operational', name: 'Operational', icon: '⚙️', color: 'hsl(45, 80%, 50%)' },
  { id: 'valuation', name: 'Valuation', icon: '💎', color: 'hsl(300, 70%, 50%)' },
];

// Fetch all metrics from database
export async function fetchMetrics(): Promise<Metric[]> {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .order('title');

  if (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }

  return (data || []).map(mapDbMetric);
}

// Fetch metrics by category
export async function fetchMetricsByCategory(categoryId: string): Promise<Metric[]> {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('category', categoryId)
    .order('title');

  if (error) {
    console.error('Error fetching metrics by category:', error);
    return [];
  }

  return (data || []).map(mapDbMetric);
}

// Fetch a single metric by slug
export async function fetchMetricBySlug(slug: string): Promise<Metric | null> {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching metric:', error);
    return null;
  }

  return data ? mapDbMetric(data) : null;
}

// Search metrics - only match on title
export async function searchMetrics(query: string): Promise<Metric[]> {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .ilike('title', `%${query}%`)
    .order('title')
    .limit(20);

  if (error) {
    console.error('Error searching metrics:', error);
    return [];
  }

  return (data || []).map(mapDbMetric);
}

// Check for exact title match
export async function findExactMetricByTitle(title: string): Promise<Metric | null> {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .ilike('title', title)
    .maybeSingle();

  if (error) {
    console.error('Error finding exact metric:', error);
    return null;
  }

  return data ? mapDbMetric(data) : null;
}

// Generate a new metric using AI
export async function generateMetric(query: string): Promise<{ metric: Metric | null; generated: boolean; error?: string; requiresAuth?: boolean }> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-metric', {
      body: { query },
    });

    if (error) {
      console.error('Error generating metric:', error);
      const status = (error as any)?.context?.status ?? (error as any)?.status;
      const body = (error as any)?.context?.body;
      const bodyError = typeof body === 'object' && body && 'error' in body ? (body as any).error : undefined;
      if (status === 401) {
        return { metric: null, generated: false, requiresAuth: true, error: 'Please sign in to generate metrics.' };
      }
      return { metric: null, generated: false, error: bodyError ?? error.message };
    }

    if (data.error) {
      return { metric: null, generated: false, error: data.error };
    }

    return {
      metric: data.metric ? mapDbMetric(data.metric) : null,
      generated: data.generated || false,
    };
  } catch (err) {
    console.error('Failed to generate metric:', err);
    return { metric: null, generated: false, error: 'Failed to generate metric' };
  }
}

// Get category counts
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('metrics')
    .select('category');

  if (error) {
    console.error('Error fetching category counts:', error);
    return {};
  }

  const counts: Record<string, number> = {};
  (data || []).forEach((m) => {
    counts[m.category] = (counts[m.category] || 0) + 1;
  });
  return counts;
}

// Map database record to Metric interface
function mapDbMetric(data: any): Metric {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    category: data.category,
    definition: data.definition,
    formula: data.formula,
    visualization_type: data.visualization_type as Metric['visualization_type'],
    visualization_data: data.visualization_data as Metric['visualization_data'],
    example: data.example,
    why_it_matters: data.why_it_matters,
    source: data.source as Metric['source'],
    created_at: data.created_at,
  };
}
