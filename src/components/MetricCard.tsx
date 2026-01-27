import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Metric, categories } from '@/data/metrics';

interface MetricCardProps {
  metric: Metric;
}

const MetricCard = ({ metric }: MetricCardProps) => {
  const navigate = useNavigate();
  const category = categories.find(c => c.id === metric.category);

  return (
    <button
      onClick={() => navigate(`/metric/${metric.slug}`)}
      className="metric-card w-full text-left tap-highlight-none group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">{category?.icon || '📊'}</span>
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {category?.name || metric.category}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1 truncate">
            {metric.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {metric.definition}
          </p>
        </div>
        <ChevronRight 
          className="text-muted-foreground group-hover:text-primary transition-colors mt-6 flex-shrink-0" 
          size={20} 
        />
      </div>
    </button>
  );
};

export default MetricCard;
