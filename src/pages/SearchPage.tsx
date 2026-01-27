import { useState } from 'react';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import MetricCard from '@/components/MetricCard';
import { sampleMetrics } from '@/data/metrics';

const SearchPage = () => {
  const [query, setQuery] = useState('');

  const results = query.length > 0
    ? sampleMetrics.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.definition.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
        ) : results.length > 0 ? (
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
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤷</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default SearchPage;
