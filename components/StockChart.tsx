
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { StockData, ValuationMetric } from '../types';

interface StockChartProps {
  data: StockData[];
  metric: ValuationMetric;
  title: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, metric, title }) => {
  // Sort data based on the metric. 
  // For margins and upside, higher is usually "better" but we'll stick to numerical sort.
  const sortedData = [...data].sort((a, b) => (a[metric] as number) - (b[metric] as number));
  
  // Find the minimum value (excluding 0/negative)
  const minVal = Math.min(...sortedData.map(d => d[metric] as number).filter(v => v > 0));
  // Find the maximum value
  const maxVal = Math.max(...sortedData.map(d => d[metric] as number));

  // Determine which bar to highlight green based on the metric type
  const isValueMetric = [ValuationMetric.PE, ValuationMetric.PS, ValuationMetric.PB, ValuationMetric.FORWARD_PE].includes(metric);
  const highlightValue = isValueMetric ? minVal : maxVal;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-[400px]">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <i className="fas fa-chart-bar text-blue-400"></i>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="symbol" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            itemStyle={{ color: '#60A5FA' }}
          />
          <Legend />
          <Bar dataKey={metric} name={title}>
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={(entry[metric] as number) === highlightValue ? '#10B981' : '#3B82F6'} 
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-2 text-center">
        * Green indicates the {isValueMetric ? '"cheapest"' : '"highest"'} stock for this metric.
      </p>
    </div>
  );
};

export default StockChart;
