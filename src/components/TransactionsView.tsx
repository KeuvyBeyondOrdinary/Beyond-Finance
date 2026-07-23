import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Search,
  Plus,
  Building2,
  Trash2,
  Receipt,
  Download
} from 'lucide-react';
import { TransactionType } from '../types';

interface TransactionsViewProps {
  onOpenAddModal: (type: TransactionType) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onOpenAddModal }) => {
  const {
    transactions,
    selectedBranchId,
    setSelectedBranchId,
    branches,
    formatAmount,
    convertToUSD,
    deleteTransaction
  } = useFinance();

  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filtered = transactions.filter((t) => {
    if (activeTypeFilter !== 'all' && t.type !== activeTypeFilter) return false;
    if (selectedBranchId !== 'b-all' && t.branchId !== selectedBranchId && t.branchId !== 'b-all') return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;

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

  const totalFilteredIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  const totalFilteredExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              Income & Expense Entries
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Comprehensive audit record of all branch revenues and expenditure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal('income')}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold text-neutral-500">Filtered Revenue</p>
          <p className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">
            {formatAmount(totalFilteredIncome)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold text-neutral-500">Filtered Expense</p>
          <p className="mt-1 text-xl font-black text-rose-600 dark:text-rose-400">
            {formatAmount(totalFilteredExpense)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold text-neutral-500">Net Flow</p>
          <p className={`mt-1 text-xl font-black ${totalFilteredIncome - totalFilteredExpense >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatAmount(totalFilteredIncome - totalFilteredExpense)}
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Type Toggle Tabs */}
          <div className="flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              onClick={() => setActiveTypeFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                activeTypeFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setActiveTypeFilter('income')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                activeTypeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setActiveTypeFilter('expense')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                activeTypeFilter === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Expenses
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search description, payee, payment method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
        </div>

        {/* Second Row Filters: Branch, Category, Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Branch</label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 outline-none focus:border-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 outline-none focus:border-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <option value="all">All Categories</option>
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Investments">Investments</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 outline-none focus:border-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-800 outline-none focus:border-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
              <tr>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold">Description</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Payment Method</th>
                <th className="py-3 px-3 font-semibold">Branch</th>
                <th className="py-3 px-3 font-semibold">Recorded By</th>
                <th className="py-3 px-3 font-semibold text-right">Amount</th>
                <th className="py-3 px-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    No matching transaction records found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
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
                        <span className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                        {tx.category}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-neutral-400" />
                          <span>{branchObj?.name || 'All HQ'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
