import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { categories } from '@/lib/metrics';

interface CategoryPieChartProps {
  counts: Record<string, number>;
}

const CategoryPieChart = ({ counts }: CategoryPieChartProps) => {
  const totalMetrics = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  const data = categories
    .map(category => ({
      name: category.name,
      value: counts[category.id] || 0,
      color: category.color,
      icon: category.icon,
    }))
    .filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border/50 text-center">
        <p className="text-muted-foreground">No metrics yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Distribution
        </h3>
      </div>
      
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg px-3 py-2 shadow-elevated border border-border text-sm">
                      <span>{item.icon} {item.name}: {item.value}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalMetrics}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {data.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
          </div>
        ))}
        {data.length > 5 && (
          <span className="text-xs text-muted-foreground">+{data.length - 5} more</span>
        )}
      </div>
    </div>
  );
};

export default CategoryPieChart;
