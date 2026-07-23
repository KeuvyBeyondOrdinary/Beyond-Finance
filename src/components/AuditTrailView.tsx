import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { History, Search, ShieldCheck, UserCheck } from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = auditLogs.filter((log) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.performedBy.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.userEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              System Activity & Audit Trail
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Immutable audit record of all partner transactions, capital withdrawals, and system events
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          />
        </div>
      </div>

      {/* Audit Trail List */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-neutral-50/50 text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
              <tr>
                <th className="p-3 font-semibold">Timestamp</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">Performed By</th>
                <th className="p-3 font-semibold">User Email</th>
                <th className="p-3 font-semibold">Activity Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    No matching audit log records found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50">
                    <td className="p-3 font-medium text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.action === 'WITHDRAWAL'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : log.action === 'DELETE'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-neutral-900 dark:text-white">
                      {log.performedBy}
                    </td>
                    <td className="p-3 text-neutral-500">{log.userEmail}</td>
                    <td className="p-3 text-neutral-700 dark:text-neutral-300">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
