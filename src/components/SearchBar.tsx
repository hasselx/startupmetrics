import { Search, X, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchMetrics, useInvalidateMetrics } from '@/hooks/useMetrics';
import { categories, generateMetric, findExactMetricByTitle } from '@/lib/metrics';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface SearchBarProps {
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

export interface SearchBarRef {
  focus: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ autoFocus = false, onSearch }, ref) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingQuery, setGeneratingQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const invalidateMetrics = useInvalidateMetrics();

  const { data: searchResults, isLoading } = useSearchMetrics(query);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-generate when no results found
  useEffect(() => {
    const shouldAutoGenerate = 
      query.length >= 2 && 
      !isLoading && 
      searchResults && 
      searchResults.length === 0 && 
      !isGenerating &&
      query !== generatingQuery;

    if (shouldAutoGenerate) {
      handleAutoGenerate();
    }
  }, [query, isLoading, searchResults, isGenerating, generatingQuery]);

  const handleAutoGenerate = async () => {
    if (query.length < 2) return;
    
    setIsGenerating(true);
    setGeneratingQuery(query);
    
    try {
      // First check for exact title match
      const existingMetric = await findExactMetricByTitle(query);
      if (existingMetric) {
        setQuery('');
        setShowSuggestions(false);
        navigate(`/metric/${existingMetric.slug}`);
        return;
      }
      
      // No exact match - generate new metric
      const { metric, generated, error, requiresAuth } = await generateMetric(query);
      if (error) {
        toast.error(error);
        if (requiresAuth) {
          setShowSuggestions(false);
          navigate('/auth');
        }
        return;
      }
      if (metric) {
        if (generated) {
          toast.success(`Generated: ${metric.title}`);
        }
        invalidateMetrics();
        setQuery('');
        setShowSuggestions(false);
        navigate(`/metric/${metric.slug}`);
      }
    } catch (err) {
      toast.error('Failed to generate metric');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (slug: string) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/metric/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else if (searchResults && searchResults.length > 0) {
      handleSelect(searchResults[0].slug);
    }
  };

  const showDropdown = showSuggestions && query.length >= 2;

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
            size={20} 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search metrics..."
            className="search-input pl-12 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-elevated border border-border overflow-hidden z-50 animate-scale-in">
          {isLoading || isGenerating ? (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 size={18} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {isGenerating ? `Generating "${query}"...` : 'Searching...'}
                </span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.slice(0, 6).map((metric) => {
              const category = categories.find(c => c.id === metric.category);
              return (
                <button
                  key={metric.id}
                  onClick={() => handleSelect(metric.slug)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center gap-3 tap-highlight-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm">
                    {category?.icon || '📊'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{metric.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{category?.name || metric.category}</p>
                  </div>
                </button>
              );
            })
          ) : null}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
