import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Building2,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface DashboardViewProps {
  onOpenAddModal: (type: 'income' | 'expense') => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddModal, onNavigateTab }) => {
  const {
    transactions,
    selectedBranchId,
    branches,
    formatAmount,
    convertToUSD,
    deleteTransaction
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions by branch
  const filtered = transactions.filter((t) => {
    if (selectedBranchId !== 'b-all' && t.branchId !== selectedBranchId && t.branchId !== 'b-all') {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        t.createdByName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Totals in USD
  const totalIncomeUSD = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  const totalExpenseUSD = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  const netProfitUSD = totalIncomeUSD - totalExpenseUSD;
  const monthlySavingsUSD = Math.max(0, netProfitUSD * 0.4); // 40% target retention rate

  // Prepare monthly chart data
  const monthlyDataMap: Record<string, { month: string; Income: number; Expenses: number }> = {};
  
  // Last 6 months initialization
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleString('default', { month: 'short' });
    monthlyDataMap[key] = { month: key, Income: 0, Expenses: 0 };
  }

  filtered.forEach((t) => {
    const dateObj = new Date(t.date);
    const monthKey = dateObj.toLocaleString('default', { month: 'short' });
    if (monthlyDataMap[monthKey]) {
      const usdVal = convertToUSD(t.amount, t.currency);
      if (t.type === 'income') {
        monthlyDataMap[monthKey].Income += usdVal;
      } else {
        monthlyDataMap[monthKey].Expenses += usdVal;
      }
    }
  });

  const chartData = Object.values(monthlyDataMap);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-neutral-900 p-6 text-white shadow-xl">
        <div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
            {branches.find((b) => b.id === selectedBranchId)?.name || 'Global Operations'}
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Financial Dashboard
          </h2>
          <p className="mt-1 text-xs text-neutral-300 max-w-xl">
            Real-time partnership financial balance, multi-branch cash flow, and live operational metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenAddModal('income')}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Income Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Income</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {formatAmount(totalIncomeUSD)}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
              <span>Healthy revenue influx</span>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Expenses</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {formatAmount(totalExpenseUSD)}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="h-4 w-4" />
              <span>Operational costs</span>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Net Profit</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className={`text-2xl font-extrabold ${netProfitUSD >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatAmount(netProfitUSD)}
            </p>
            <p className="mt-2 text-xs font-medium text-neutral-500">
              Margin: {totalIncomeUSD > 0 ? Math.round((netProfitUSD / totalIncomeUSD) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Monthly Savings Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Monthly Savings Reserve</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <PiggyBank className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {formatAmount(monthlySavingsUSD)}
            </p>
            <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
              Retained capital reserve
            </p>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Income vs Expense Trends</h3>
            <p className="text-xs text-neutral-500">Monthly financial cash flow comparison</p>
          </div>
          <button
            onClick={() => onNavigateTab('analytics')}
            className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            View Full Analytics →
          </button>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: any) => formatAmount(Number(val))}
                contentStyle={{ borderRadius: '12px', border: '1px solid #374151', backgroundColor: '#111827', color: '#fff' }}
              />
              <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-neutral-500">Live feed across all partners and branches</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search description, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-64 rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-500 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400 whitespace-nowrap"
            >
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
              <tr>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold">Description</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Branch</th>
                <th className="py-3 px-3 font-semibold">Recorded By</th>
                <th className="py-3 px-3 font-semibold text-right">Amount</th>
                <th className="py-3 px-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.slice(0, 6).map((tx) => {
                const usdAmount = convertToUSD(tx.amount, tx.currency);
                const branchObj = branches.find((b) => b.id === tx.branchId);

                return (
                  <tr key={tx.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        tx.type === 'income'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-neutral-400" />
                        <span>{branchObj?.name || 'HQ'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-700 dark:text-neutral-300">
                      {tx.createdByName}
                    </td>
                    <td className={`py-3 px-3 text-right font-extrabold whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatAmount(usdAmount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="rounded-lg p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
