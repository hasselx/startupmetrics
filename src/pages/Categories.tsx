import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import { categories, sampleMetrics } from '@/data/metrics';
import { ChevronRight } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();

  const getCategoryCount = (categoryId: string) => {
    return sampleMetrics.filter(m => m.category === categoryId).length;
  };

  return (
    <AppShell>
      <Header title="Categories" />
      <div className="px-4 py-4">
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
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryCount(category.id)} metrics
                    </p>
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
    </AppShell>
  );
};

export default Categories;
