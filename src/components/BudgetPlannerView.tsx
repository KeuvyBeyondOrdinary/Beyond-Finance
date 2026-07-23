import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ExpenseCategory } from '../types';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

const CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Rent', 'Utilities', 'Shopping', 'Business', 'Entertainment', 'Other'];

export const BudgetPlannerView: React.FC = () => {
  const { budgets, transactions, setCategoryBudget, formatAmount, convertToUSD } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<ExpenseCategory>('Rent');
  const [limitAmount, setLimitAmount] = useState('');

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(limitAmount);
    if (!val || val <= 0) return;

    await setCategoryBudget(selectedCat, val);
    setIsModalOpen(false);
    setLimitAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              Monthly Budget Planner & Alerts
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Enforce spending limits and auto-notify when category costs exceed 80% threshold
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Set Monthly Budget</span>
        </button>
      </div>

      {/* Budget Categories Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const budget = budgets.find((b) => b.category === cat);
          const limitUSD = budget ? convertToUSD(budget.monthlyLimit, budget.currency) : 0;

          const spentUSD = transactions
            .filter((t) => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

          const percentage = limitUSD > 0 ? Math.min(100, Math.round((spentUSD / limitUSD) * 100)) : 0;
          const isWarning = percentage >= 80 && percentage < 100;
          const isExceeded = percentage >= 100;

          return (
            <div
              key={cat}
              className={`rounded-2xl border p-5 shadow-sm transition-all bg-white dark:bg-neutral-900 ${
                isExceeded
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : isWarning
                  ? 'border-amber-500 ring-2 ring-amber-500/20'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{cat}</span>
                {isExceeded ? (
                  <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    <AlertTriangle className="h-3 w-3" /> Exceeded 100%
                  </span>
                ) : isWarning ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <AlertTriangle className="h-3 w-3" /> Warning ({percentage}%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle className="h-3 w-3" /> On Track
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-neutral-500">Spent: {formatAmount(spentUSD)}</span>
                  <span className="text-neutral-900 dark:text-white">Limit: {limitUSD > 0 ? formatAmount(limitUSD) : 'Not Set'}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isExceeded ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCat(cat);
                    setLimitAmount(limitUSD > 0 ? limitUSD.toString() : '');
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Edit Limit →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Set Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Configure Category Budget</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleSaveBudget} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Expense Category</label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value as ExpenseCategory)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Monthly Spending Ceiling (USD)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 5000"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
