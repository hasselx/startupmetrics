import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
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
      percentage: totalMetrics > 0 ? ((counts[category.id] || 0) / totalMetrics * 100).toFixed(1) : '0',
      percentageNum: totalMetrics > 0 ? (counts[category.id] || 0) / totalMetrics * 100 : 0,
      color: category.color,
      icon: category.icon,
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.percentageNum - a.percentageNum);

  if (data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-2xl p-6 border border-border/50 text-center"
      >
        <p className="text-muted-foreground">No metrics yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card rounded-2xl p-4 border border-border/50"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-2"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Distribution
        </h3>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="relative h-48"
      >
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
              animationBegin={200}
              animationDuration={800}
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
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-popover text-popover-foreground rounded-lg px-3 py-2 shadow-elevated border border-border text-sm"
                    >
                      <span>{item.icon} {item.name}: {item.percentage}%</span>
                    </motion.div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3, type: "spring", stiffness: 200 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalMetrics}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Legend with percentages - all categories sorted by contribution */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="flex flex-wrap gap-2 mt-3 justify-center"
      >
        {data.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.03 }}
            className="flex items-center gap-1.5 text-xs"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name} ({item.percentage}%)</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CategoryPieChart;
