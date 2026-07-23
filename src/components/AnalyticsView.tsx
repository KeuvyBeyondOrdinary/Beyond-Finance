import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { LineChart, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  CartesianGrid
} from 'recharts';

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

export const AnalyticsView: React.FC = () => {
  const { transactions, formatAmount, convertToUSD } = useFinance();

  // Monthly data map
  const monthsMap: Record<string, { month: string; Income: number; Expenses: number; Profit: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleString('default', { month: 'short' });
    monthsMap[key] = { month: key, Income: 0, Expenses: 0, Profit: 0 };
  }

  // Expense Category Map
  const categoryExpensesMap: Record<string, number> = {};

  transactions.forEach((t) => {
    const usdVal = convertToUSD(t.amount, t.currency);
    const d = new Date(t.date);
    const monthKey = d.toLocaleString('default', { month: 'short' });

    if (monthsMap[monthKey]) {
      if (t.type === 'income') {
        monthsMap[monthKey].Income += usdVal;
      } else {
        monthsMap[monthKey].Expenses += usdVal;
      }
      monthsMap[monthKey].Profit = monthsMap[monthKey].Income - monthsMap[monthKey].Expenses;
    }

    if (t.type === 'expense') {
      categoryExpensesMap[t.category] = (categoryExpensesMap[t.category] || 0) + usdVal;
    }
  });

  const barData = Object.values(monthsMap);
  const pieData = Object.keys(categoryExpensesMap).map((cat) => ({
    name: cat,
    value: categoryExpensesMap[cat]
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <LineChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
            Advanced Financial Analytics
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Interactive graphs, spending trends, category distributions, and profitability forecasts
        </p>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Bar Chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
            Monthly Income vs Expense Bar Comparison
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: any) => formatAmount(Number(v))} />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
            Expense Share by Category
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatAmount(Number(v))} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Net Profit Trend Line Chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
            Net Operating Profit Trend
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: any) => formatAmount(Number(v))} />
                <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6 }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
