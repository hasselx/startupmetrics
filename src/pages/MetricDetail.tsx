import { useParams } from 'react-router-dom';
import { Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import MetricChart from '@/components/MetricChart';
import { categories } from '@/lib/metrics';
import { useMetric } from '@/hooks/useMetrics';
import { useSavedMetrics } from '@/hooks/useSavedMetrics';
import { Skeleton } from '@/components/ui/skeleton';

const MetricDetail = () => {
  const { slug } = useParams();
  const { data: metric, isLoading } = useMetric(slug || '');
  const category = metric ? categories.find(c => c.id === metric.category) : null;
  const [copied, setCopied] = useState(false);
  const { isSaved, toggleSave } = useSavedMetrics();

  const handleCopyFormula = async () => {
    if (metric) {
      await navigator.clipboard.writeText(metric.formula);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <Header showBack />
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-64" />
          <div className="section-card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="section-card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="section-card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!metric) {
    return (
      <AppShell>
        <Header title="Metric" showBack />
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">Metric not found</p>
        </div>
      </AppShell>
    );
  }

  const saved = isSaved(metric.id);

  return (
    <AppShell>
      <Header 
        showBack 
        rightElement={
          <button
            onClick={() => toggleSave(metric.id)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors tap-highlight-none"
          >
            {saved ? (
              <BookmarkCheck size={22} className="text-primary" />
            ) : (
              <Bookmark size={22} className="text-muted-foreground" />
            )}
          </button>
        }
      />
      
      <div className="px-4 py-4 space-y-4">
        {/* Title Section */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-3">
            <span>{category?.icon || '📊'}</span>
            <span>{category?.name || metric.category}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {metric.title}
          </h1>
        </div>

        {/* Definition */}
        <div className="section-card animate-slide-up" style={{ animationDelay: '50ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Definition
          </h2>
          <p className="text-foreground leading-relaxed">
            {metric.definition}
          </p>
        </div>

        {/* Formula */}
        <div className="section-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Formula
          </h2>
          <div className="formula-block">
            <code className="text-foreground">{metric.formula}</code>
            <button
              onClick={handleCopyFormula}
              className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-primary" />
              ) : (
                <Copy size={16} className="text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Visualization */}
        <div className="section-card animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Visualization
          </h2>
          <MetricChart metric={metric} />
        </div>

        {/* Example */}
        <div className="section-card animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Example
          </h2>
          <p className="text-foreground leading-relaxed">
            {metric.example}
          </p>
        </div>

        {/* Why It Matters */}
        <div className="section-card animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Why It Matters
          </h2>
          <p className="text-foreground leading-relaxed">
            {metric.why_it_matters}
          </p>
        </div>

        {/* Source Badge */}
        <div className="flex justify-center pt-2 pb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted">
            Source: {metric.source === 'human' ? 'Verified' : 'AI Generated'}
          </span>
        </div>
      </div>
    </AppShell>
  );
};

export default MetricDetail;
