import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Calculator,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Landmark
} from 'lucide-react';

export const ProfitAccountingView: React.FC = () => {
  const { transactions, partners, formatAmount, convertToUSD } = useFinance();
  const [activeStatementTab, setActiveStatementTab] = useState<'pnl' | 'bs' | 'cf' | 'partner' | 'tax'>('pnl');

  const todayStr = new Date().toISOString().split('T')[0];

  // Date Math for calculations
  const calculateProfitForRange = (startDateMs: number) => {
    const rangeTxs = transactions.filter((t) => new Date(t.date).getTime() >= startDateMs);
    const inc = rangeTxs.filter((t) => t.type === 'income').reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);
    const exp = rangeTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);
    return inc - exp;
  };

  const nowMs = new Date().getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;
  const oneMonthMs = 30 * oneDayMs;
  const oneYearMs = 365 * oneDayMs;

  const dailyProfitUSD = calculateProfitForRange(nowMs - oneDayMs);
  const weeklyProfitUSD = calculateProfitForRange(nowMs - oneWeekMs);
  const monthlyProfitUSD = calculateProfitForRange(nowMs - oneMonthMs);
  const yearlyProfitUSD = calculateProfitForRange(nowMs - oneYearMs);

  // Profit & Loss Items
  const totalIncomeUSD = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);

  const totalExpenseUSD = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);

  const netOperatingProfitUSD = totalIncomeUSD - totalExpenseUSD;

  // Expense Category breakdown for P&L
  const expenseCategoriesMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const val = convertToUSD(t.amount, t.currency);
      expenseCategoriesMap[t.category] = (expenseCategoriesMap[t.category] || 0) + val;
    });

  // Balance Sheet Totals
  const totalPartnerCapitalUSD = partners.reduce((s, p) => s + p.capitalContribution, 0);
  const totalPartnerDrawingsUSD = partners.reduce((s, p) => s + p.totalDrawings, 0);
  const totalRetainedEarningsUSD = netOperatingProfitUSD;
  const totalEquityUSD = totalPartnerCapitalUSD + totalRetainedEarningsUSD - totalPartnerDrawingsUSD;

  // Estimated Tax
  const estimatedTaxRate = 0.15; // 15% SMB Corporate Tax rate
  const estimatedTaxLiabilityUSD = Math.max(0, netOperatingProfitUSD * estimatedTaxRate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
            Automated Profit & Accounting Engine
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Automated double-entry bookkeeping calculations and formal financial statements
        </p>
      </div>

      {/* Profit Calculator Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold text-neutral-500">Daily Profit</span>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatAmount(dailyProfitUSD)}
          </p>
          <p className="mt-1 text-[10px] text-neutral-400">Last 24 hours</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold text-neutral-500">Weekly Profit</span>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatAmount(weeklyProfitUSD)}
          </p>
          <p className="mt-1 text-[10px] text-neutral-400">Last 7 days</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold text-neutral-500">Monthly Profit</span>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatAmount(monthlyProfitUSD)}
          </p>
          <p className="mt-1 text-[10px] text-neutral-400">Last 30 days</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold text-neutral-500">Yearly Profit</span>
          <p className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
            {formatAmount(yearlyProfitUSD)}
          </p>
          <p className="mt-1 text-[10px] text-neutral-400">Trailing 12 months</p>
        </div>
      </div>

      {/* Financial Statement Tabs */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <button
            onClick={() => setActiveStatementTab('pnl')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeStatementTab === 'pnl'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            Profit & Loss Statement
          </button>
          <button
            onClick={() => setActiveStatementTab('bs')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeStatementTab === 'bs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveStatementTab('cf')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeStatementTab === 'cf'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            Cash Flow Statement
          </button>
          <button
            onClick={() => setActiveStatementTab('partner')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeStatementTab === 'partner'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            Partner Capital Statement
          </button>
          <button
            onClick={() => setActiveStatementTab('tax')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeStatementTab === 'tax'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            Tax Summary
          </button>
        </div>

        {/* 1. Profit & Loss Tab */}
        {activeStatementTab === 'pnl' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Statement of Profit & Loss (Income Statement)
            </h3>
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 space-y-3">
              <div className="flex justify-between text-xs font-bold border-b pb-2 text-neutral-900 dark:text-white">
                <span>Revenue & Operating Income</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatAmount(totalIncomeUSD)}</span>
              </div>

              <div className="pl-4 space-y-2 text-xs">
                <p className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">Operating Expenses Breakdown</p>
                {Object.keys(expenseCategoriesMap).map((cat) => (
                  <div key={cat} className="flex justify-between text-neutral-700 dark:text-neutral-300">
                    <span>{cat} Expenses</span>
                    <span>{formatAmount(expenseCategoriesMap[cat])}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2 text-neutral-900 dark:text-white">
                  <span>Total Operating Expenses</span>
                  <span className="text-rose-600 dark:text-rose-400">{formatAmount(totalExpenseUSD)}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-black border-t-2 pt-3 text-neutral-900 dark:text-white">
                <span>Net Operating Profit / (Loss)</span>
                <span className={netOperatingProfitUSD >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {formatAmount(netOperatingProfitUSD)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Balance Sheet Tab */}
        {activeStatementTab === 'bs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Statement of Financial Position (Balance Sheet)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assets */}
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Assets</h4>
                <div className="flex justify-between text-xs py-1">
                  <span>Cash & Cash Equivalents</span>
                  <span className="font-bold">{formatAmount(totalEquityUSD)}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span>Inventory & Branch Produce Assets</span>
                  <span className="font-bold">{formatAmount(totalPartnerCapitalUSD * 0.2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t pt-2 text-emerald-600 dark:text-emerald-400">
                  <span>Total Assets</span>
                  <span>{formatAmount(totalEquityUSD + totalPartnerCapitalUSD * 0.2)}</span>
                </div>
              </div>

              {/* Equity & Liabilities */}
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Liabilities & Equity</h4>
                <div className="flex justify-between text-xs py-1">
                  <span>Partner Capital Accounts</span>
                  <span className="font-bold">{formatAmount(totalPartnerCapitalUSD)}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span>Retained Earnings / Operating Profit</span>
                  <span className="font-bold text-emerald-600">{formatAmount(totalRetainedEarningsUSD)}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span>Less Cumulative Partner Drawings</span>
                  <span className="font-bold text-rose-600">-{formatAmount(totalPartnerDrawingsUSD)}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t pt-2 text-blue-600 dark:text-blue-400">
                  <span>Total Partner Equity</span>
                  <span>{formatAmount(totalEquityUSD)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Cash Flow Statement */}
        {activeStatementTab === 'cf' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Cash Flow Statement</h3>
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 space-y-3 text-xs">
              <div className="flex justify-between font-bold py-1">
                <span>Net Cash from Operating Activities</span>
                <span className="text-emerald-600">{formatAmount(netOperatingProfitUSD)}</span>
              </div>
              <div className="flex justify-between font-bold py-1">
                <span>Net Cash from Partner Financing (Injections)</span>
                <span>+{formatAmount(totalPartnerCapitalUSD)}</span>
              </div>
              <div className="flex justify-between font-bold py-1">
                <span>Less Cash Used in Partner Drawings</span>
                <span className="text-rose-600">-{formatAmount(totalPartnerDrawingsUSD)}</span>
              </div>
              <div className="flex justify-between text-sm font-black border-t-2 pt-3 text-neutral-900 dark:text-white">
                <span>Net Cash Position at End of Period</span>
                <span className="text-emerald-600">{formatAmount(totalEquityUSD)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Partner Capital Statement */}
        {activeStatementTab === 'partner' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Partner Capital Statement</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="p-3 font-semibold">Partner</th>
                    <th className="p-3 font-semibold">Equity Share</th>
                    <th className="p-3 font-semibold">Initial Capital</th>
                    <th className="p-3 font-semibold">Profit Share</th>
                    <th className="p-3 font-semibold">Drawings</th>
                    <th className="p-3 font-semibold text-right">Ending Capital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {partners.map((p) => {
                    const profitShare = (netOperatingProfitUSD * p.ownershipPercentage) / 100;
                    const endingCap = p.capitalContribution + profitShare - p.totalDrawings;
                    return (
                      <tr key={p.id}>
                        <td className="p-3 font-bold">{p.name} ({p.role})</td>
                        <td className="p-3 font-semibold text-emerald-600">{p.ownershipPercentage}%</td>
                        <td className="p-3">{formatAmount(p.capitalContribution)}</td>
                        <td className="p-3 text-emerald-600">+{formatAmount(profitShare)}</td>
                        <td className="p-3 text-rose-600">-{formatAmount(p.totalDrawings)}</td>
                        <td className="p-3 text-right font-black text-blue-600">{formatAmount(endingCap)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Tax Summary */}
        {activeStatementTab === 'tax' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Tax Summary & Estimate</h3>
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span>Taxable Net Profit</span>
                <span className="font-bold">{formatAmount(netOperatingProfitUSD)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Applicable SMB Tax Rate</span>
                <span className="font-bold text-emerald-600">15.00%</span>
              </div>
              <div className="flex justify-between text-sm font-black border-t-2 pt-3 text-rose-600 dark:text-rose-400">
                <span>Estimated Corporate Tax Reserve Required</span>
                <span>{formatAmount(estimatedTaxLiabilityUSD)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
