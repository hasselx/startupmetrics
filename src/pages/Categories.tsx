import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import CategoryPieChart from '@/components/CategoryPieChart';
import { categories } from '@/lib/metrics';
import { useCategoryCounts } from '@/hooks/useMetrics';
import { ChevronRight, PieChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Categories = () => {
  const navigate = useNavigate();
  const [showChart, setShowChart] = useState(false);
  const { data: counts, isLoading } = useCategoryCounts();

  return (
    <AppShell>
      <Header 
        title="Categories" 
        rightElement={
          <button
            onClick={() => setShowChart(!showChart)}
            className={`p-2 rounded-xl transition-colors tap-highlight-none ${
              showChart ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'
            }`}
          >
            <PieChart size={20} />
          </button>
        }
      />
      <div className="px-4 py-4 space-y-6">
        {/* Pie Chart Section - Collapsible */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {isLoading ? (
                <div className="bg-card rounded-2xl p-4 border border-border/50">
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-48 w-full rounded-xl" />
                </div>
              ) : (
                <CategoryPieChart counts={counts || {}} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category List */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            All Categories
          </h2>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => navigate(`/categories/${category.id}`)}
                className="metric-card w-full text-left tap-highlight-none group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      {isLoading ? (
                        <Skeleton className="h-4 w-16 mt-1" />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {counts?.[category.id] || 0} metrics
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight 
                    className="text-muted-foreground group-hover:text-primary transition-colors" 
                    size={20} 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Categories;
