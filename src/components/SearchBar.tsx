import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleMetrics } from '@/data/metrics';

interface SearchBarProps {
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ autoFocus = false, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const suggestions = query.length > 0
    ? sampleMetrics
        .filter(m => 
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.slug.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSelect = (slug: string) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/metric/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else if (suggestions.length > 0) {
      handleSelect(suggestions[0].slug);
    }
  };

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

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-elevated border border-border overflow-hidden z-50 animate-scale-in">
          {suggestions.map((metric) => (
            <button
              key={metric.id}
              onClick={() => handleSelect(metric.slug)}
              className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center gap-3 tap-highlight-none"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm">
                📊
              </div>
              <div>
                <p className="font-medium text-sm">{metric.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{metric.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
