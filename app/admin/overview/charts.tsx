'use client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useState } from 'react';

const COLORS = ['#d4af37', '#8b0000', '#2e8b57', '#4682b4', '#d2691e', '#800080'];

const Charts = ({
  data: { salesData, categoryData },
}: {
  data: { 
    salesData: { name: string; total: number }[];
    categoryData: { name: string; value: number }[];
  };
}) => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'category'>('revenue');

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4 border-b border-outline-variant/30 pb-2">
        <button 
          className={`text-sm font-semibold ${activeTab === 'revenue' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant'}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
        <button 
          className={`text-sm font-semibold ${activeTab === 'category' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant'}`}
          onClick={() => setActiveTab('category')}
        >
          By Category
        </button>
      </div>

      <div className="h-[350px]">
        {activeTab === 'revenue' ? (
          <ResponsiveContainer width='100%' height="100%">
            <BarChart data={salesData}>
              <XAxis
                dataKey='name'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip formatter={(value) => `₹${value}`} cursor={{fill: 'transparent'}} />
              <Bar
                dataKey='total'
                fill='#d4af37'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width='100%' height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Charts;