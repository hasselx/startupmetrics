import { Search, X, Loader2, Sparkles } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const invalidateMetrics = useInvalidateMetrics();
  const isSubmittingRef = useRef(false);

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

  // Check if exact match exists in results (for UI hint only)
  const hasExactMatch = searchResults?.some(
    (m) => m.title.toLowerCase() === query.trim().toLowerCase()
  );

  // Core search/generate logic - used by all input methods
  const executeSearch = async (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim();
    
    // Validation
    if (normalizedQuery.length < 2) {
      console.log('[SearchBar] Query too short:', normalizedQuery);
      return;
    }
    
    // Prevent double submissions
    if (isSubmittingRef.current) {
      console.log('[SearchBar] Already submitting, skipping');
      return;
    }
    
    console.log('[SearchBar] Executing search for:', normalizedQuery);
    isSubmittingRef.current = true;
    
    // If external handler provided, use it
    if (onSearch) {
      onSearch(normalizedQuery);
      isSubmittingRef.current = false;
      return;
    }
    
    setIsGenerating(true);
    setShowSuggestions(true); // Keep dropdown open to show loading state
    
    try {
      // Step 1: Strict exact title match from database (case-insensitive)
      console.log('[SearchBar] Checking for exact match in DB...');
      const existingMetric = await findExactMetricByTitle(normalizedQuery);
      
      if (existingMetric) {
        console.log('[SearchBar] Found exact match:', existingMetric.slug);
        setQuery('');
        setShowSuggestions(false);
        navigate(`/metric/${existingMetric.slug}`);
        return;
      }
      
      // Step 2: No exact match - generate new metric with exact query string
      console.log('[SearchBar] No exact match, generating metric...');
      const { metric, generated, error, requiresAuth } = await generateMetric(normalizedQuery);
      
      if (error) {
        console.error('[SearchBar] Generation error:', error);
        toast.error(error);
        if (requiresAuth) {
          setShowSuggestions(false);
          navigate('/auth');
        }
        return;
      }
      
      if (metric) {
        console.log('[SearchBar] Generated metric:', metric.slug);
        if (generated) {
          toast.success(`Generated: ${metric.title}`);
        }
        invalidateMetrics();
        setQuery('');
        setShowSuggestions(false);
        navigate(`/metric/${metric.slug}`);
      }
    } catch (err) {
      console.error('[SearchBar] Exception:', err);
      toast.error('Failed to generate metric');
    } finally {
      setIsGenerating(false);
      isSubmittingRef.current = false;
    }
  };

  const handleSelect = (slug: string) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/metric/${slug}`);
  };

  // Form submit handler - works for desktop Enter and mobile Search button
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[SearchBar] Form submitted with query:', query);
    executeSearch(query);
  };

  // Explicit keydown handler - fallback for mobile keyboards
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      // Read current input value directly for reliability
      const currentValue = inputRef.current?.value || query;
      console.log('[SearchBar] Enter key pressed with value:', currentValue);
      executeSearch(currentValue);
    }
  };

  // Search icon tap handler
  const handleSearchIconClick = () => {
    console.log('[SearchBar] Search icon clicked with query:', query);
    executeSearch(query);
  };

  const showDropdown = showSuggestions && query.length >= 2;

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} action="#">
        <div className="relative">
          <button
            type="button"
            onClick={handleSearchIconClick}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search metrics..."
            className="search-input pl-12 pr-10"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X size={18} />
            </button>
          )}
          {/* Hidden submit button for form submission */}
          <button type="submit" className="sr-only" aria-hidden="true">Search</button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-elevated border border-border overflow-hidden z-50 animate-scale-in">
          {isLoading || isGenerating ? (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 size={18} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {isGenerating ? `Generating "${query.trim()}"...` : 'Searching...'}
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
          ) : (
            <>
              {/* Hint to press Enter when no exact match */}
              {query.length >= 2 && !hasExactMatch && (
                <div className="px-4 py-2 text-xs text-muted-foreground bg-accent/30 border-b border-border flex items-center gap-2">
                  <Sparkles size={12} className="text-primary" />
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-medium">Enter</kbd> to generate "{query.trim()}"</span>
                </div>
              )}
              
              {/* Search results - suggestions only */}
              {searchResults && searchResults.length > 0 && (
                <>
                  {searchResults.slice(0, 6).map((metric) => {
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
                  })}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
