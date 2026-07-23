import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ReportsView: React.FC = () => {
  const { transactions, branches, selectedBranchId, formatAmount, convertToUSD } = useFinance();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportBranchId, setReportBranchId] = useState<string>(selectedBranchId);

  const filtered = transactions.filter((t) => {
    if (reportBranchId !== 'b-all' && t.branchId !== reportBranchId && t.branchId !== 'b-all') return false;
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;
    return true;
  });

  const totalIncomeUSD = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);

  const totalExpenseUSD = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);

  const netProfitUSD = totalIncomeUSD - totalExpenseUSD;

  // Export PDF Function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Beyond Finance Manager - Financial Statement', 14, 20);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Branch: ${branches.find((b) => b.id === reportBranchId)?.name || 'All Branches'}`, 14, 34);

    doc.setFontSize(12);
    doc.text(`Total Income: ${formatAmount(totalIncomeUSD)}`, 14, 44);
    doc.text(`Total Expense: ${formatAmount(totalExpenseUSD)}`, 14, 52);
    doc.text(`Net Profit: ${formatAmount(netProfitUSD)}`, 14, 60);

    const tableRows = filtered.map((tx) => [
      tx.date,
      tx.type.toUpperCase(),
      tx.category,
      tx.description,
      tx.paymentMethod,
      tx.createdByName,
      formatAmount(convertToUSD(tx.amount, tx.currency))
    ]);

    autoTable(doc, {
      startY: 68,
      head: [['Date', 'Type', 'Category', 'Description', 'Method', 'Recorded By', 'Amount']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`Beyond_Finance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export Excel Function
  const exportExcel = () => {
    const rows = filtered.map((tx) => ({
      Date: tx.date,
      Type: tx.type,
      Category: tx.category,
      Description: tx.description,
      PaymentMethod: tx.paymentMethod,
      RecordedBy: tx.createdByName,
      AmountUSD: convertToUSD(tx.amount, tx.currency)
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Report');

    XLSX.writeFile(workbook, `Beyond_Finance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              Financial Reports & Exports
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Generate printable PDF reports and Excel spreadsheets filtered by date and branch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export to PDF</span>
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Branch Location</label>
          <select
            value={reportBranchId}
            onChange={(e) => setReportBranchId(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 font-semibold">Report Revenue</p>
          <p className="mt-1 text-xl font-black text-emerald-600">{formatAmount(totalIncomeUSD)}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 font-semibold">Report Expenses</p>
          <p className="mt-1 text-xl font-black text-rose-600">{formatAmount(totalExpenseUSD)}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 font-semibold">Report Net Profit</p>
          <p className={`mt-1 text-xl font-black ${netProfitUSD >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatAmount(netProfitUSD)}
          </p>
        </div>
      </div>

      {/* Report Records Preview */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">
          Report Preview ({filtered.length} Entries)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Method</th>
                <th className="p-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((tx) => (
                <tr key={tx.id}>
                  <td className="p-3">{tx.date}</td>
                  <td className="p-3 uppercase font-bold text-[10px]">{tx.type}</td>
                  <td className="p-3 font-semibold">{tx.category}</td>
                  <td className="p-3">{tx.description}</td>
                  <td className="p-3">{tx.paymentMethod}</td>
                  <td className={`p-3 text-right font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatAmount(convertToUSD(tx.amount, tx.currency))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
