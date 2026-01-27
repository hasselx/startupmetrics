import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Metric } from '@/lib/metrics';

interface MetricChartProps {
  metric: Metric;
}

const MetricChart = ({ metric }: MetricChartProps) => {
  const data = metric.visualization_data.labels.map((label, index) => ({
    name: label,
    value: metric.visualization_data.values[index],
  }));

  const primaryColor = 'hsl(168, 80%, 32%)';

  if (metric.visualization_type === 'line') {
    return (
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }}
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Value']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={primaryColor} 
              strokeWidth={2.5}
              dot={{ fill: primaryColor, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (metric.visualization_type === 'bar' || metric.visualization_type === 'funnel') {
    return (
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }}
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Value']}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={primaryColor} 
                  opacity={metric.visualization_type === 'funnel' ? 1 - (index * 0.15) : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default MetricChart;
