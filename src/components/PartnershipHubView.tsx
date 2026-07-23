import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { UserRole, Partner } from '../types';
import {
  Users2,
  DollarSign,
  UserPlus,
  ArrowDownRight,
  PlusCircle,
  Percent,
  X,
  UserCheck
} from 'lucide-react';

export const PartnershipHubView: React.FC = () => {
  const {
    partners,
    transactions,
    recordPartnerDrawing,
    addPartnerCapital,
    invitePartner,
    formatAmount,
    convertToUSD
  } = useFinance();

  const { currentUser, hasPermission } = useAuth();

  // Modals state
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [isCapitalModalOpen, setIsCapitalModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Drawing Form State
  const [selectedPartnerForDrawing, setSelectedPartnerForDrawing] = useState(partners[0]?.id || '');
  const [drawingAmount, setDrawingAmount] = useState('');
  const [drawingNote, setDrawingNote] = useState('');

  // Capital Form State
  const [selectedPartnerForCapital, setSelectedPartnerForCapital] = useState(partners[0]?.id || '');
  const [capitalAmount, setCapitalAmount] = useState('');
  const [capitalNote, setCapitalNote] = useState('');

  // Invite Form State
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerRole, setNewPartnerRole] = useState<UserRole>('partner');
  const [newPartnerOwnership, setNewPartnerOwnership] = useState('10');
  const [newPartnerCapital, setNewPartnerCapital] = useState('10000');

  // Business Totals
  const totalIncomeUSD = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  const totalExpenseUSD = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  const totalBusinessProfitUSD = totalIncomeUSD - totalExpenseUSD;

  const totalCapitalContributedUSD = partners.reduce((sum, p) => sum + p.capitalContribution, 0);
  const totalPartnerDrawingsUSD = partners.reduce((sum, p) => sum + p.totalDrawings, 0);

  // Submit Drawing
  const handleDrawingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(drawingAmount);
    if (!val || val <= 0) return;

    await recordPartnerDrawing(selectedPartnerForDrawing, val, drawingNote || 'Monthly partner drawing');
    setIsDrawingModalOpen(false);
    setDrawingAmount('');
    setDrawingNote('');
  };

  // Submit Capital Injection
  const handleCapitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(capitalAmount);
    if (!val || val <= 0) return;

    await addPartnerCapital(selectedPartnerForCapital, val, capitalNote || 'Equity capital injection');
    setIsCapitalModalOpen(false);
    setCapitalAmount('');
    setCapitalNote('');
  };

  // Submit Invite
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName || !newPartnerEmail) return;

    await invitePartner({
      name: newPartnerName,
      email: newPartnerEmail,
      role: newPartnerRole,
      ownershipPercentage: parseFloat(newPartnerOwnership) || 0,
      capitalContribution: parseFloat(newPartnerCapital) || 0,
      status: 'active'
    });

    setIsInviteModalOpen(false);
    setNewPartnerName('');
    setNewPartnerEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              Partnership Accounting Hub
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Multi-partner equity management, drawings tracking, and profit distribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsDrawingModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
          >
            <ArrowDownRight className="h-4 w-4" />
            <span>Record Partner Drawing</span>
          </button>
          <button
            onClick={() => setIsCapitalModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Inject Partner Capital</span>
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Partner</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold text-neutral-500">Total Business Profit</p>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatAmount(totalBusinessProfitUSD)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Available for profit distribution</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold text-neutral-500">Total Capital Contributed</p>
          <p className="mt-2 text-2xl font-black text-neutral-900 dark:text-white">
            {formatAmount(totalCapitalContributedUSD)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Aggregated equity pool</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold text-neutral-500">Total Partner Drawings</p>
          <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatAmount(totalPartnerDrawingsUSD)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Total withdrawals to date</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold text-neutral-500">Net Retained Equity</p>
          <p className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
            {formatAmount(totalCapitalContributedUSD + totalBusinessProfitUSD - totalPartnerDrawingsUSD)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Current business net worth</p>
        </div>
      </div>

      {/* Partner Capital & Equity Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {partners.map((p) => {
          // Profit share amount
          const partnerProfitShareUSD = (totalBusinessProfitUSD * p.ownershipPercentage) / 100;
          const netPartnerEquityUSD = p.capitalContribution + partnerProfitShareUSD - p.totalDrawings;

          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-6 shadow-sm transition-all ${
                p.id === currentUser.partnerId
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">{p.name}</h3>
                      {p.id === currentUser.partnerId && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Active User
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">{p.email}</p>
                  </div>
                </div>

                <span className="rounded-xl bg-neutral-100 px-3 py-1 text-xs font-extrabold uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {p.role}
                </span>
              </div>

              {/* Accounting Breakdown */}
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400">Equity Share</span>
                  <div className="mt-1 flex items-center gap-1 text-base font-black text-neutral-900 dark:text-white">
                    <Percent className="h-4 w-4 text-emerald-500" />
                    <span>{p.ownershipPercentage}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-neutral-400">Capital Contributed</span>
                  <p className="mt-1 text-base font-black text-neutral-900 dark:text-white">
                    {formatAmount(p.capitalContribution)}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-neutral-400">Profit Share Allocation</span>
                  <p className="mt-1 text-base font-black text-emerald-600 dark:text-emerald-400">
                    {formatAmount(partnerProfitShareUSD)}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-neutral-400">Cumulative Drawings</span>
                  <p className="mt-1 text-base font-black text-amber-600 dark:text-amber-400">
                    {formatAmount(p.totalDrawings)}
                  </p>
                </div>
              </div>

              {/* Net Partner Capital Balance */}
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <div>
                  <p className="text-xs font-semibold text-neutral-500">Net Partner Worth</p>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                    {formatAmount(netPartnerEquityUSD)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPartnerForDrawing(p.id);
                    setIsDrawingModalOpen(true);
                  }}
                  className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  Withdraw Drawings
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Drawing Modal */}
      {isDrawingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Record Partner Drawing Withdrawal</h3>
              <button onClick={() => setIsDrawingModalOpen(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleDrawingSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Select Partner</label>
                <select
                  value={selectedPartnerForDrawing}
                  onChange={(e) => setSelectedPartnerForDrawing(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Amount (USD)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={drawingAmount}
                  onChange={(e) => setDrawingAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Note / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly partner dividend withdrawal"
                  value={drawingNote}
                  onChange={(e) => setDrawingNote(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDrawingModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white hover:bg-amber-700"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Capital Injection Modal */}
      {isCapitalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Inject Capital Contribution</h3>
              <button onClick={() => setIsCapitalModalOpen(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleCapitalSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Select Partner</label>
                <select
                  value={selectedPartnerForCapital}
                  onChange={(e) => setSelectedPartnerForCapital(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Capital Amount (USD)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={capitalAmount}
                  onChange={(e) => setCapitalAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Note / Source</label>
                <input
                  type="text"
                  placeholder="e.g. Hatton Branch Expansion Seed Capital"
                  value={capitalNote}
                  onChange={(e) => setCapitalNote(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCapitalModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Inject Capital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Partner Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Invite Partner / Team Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="david@beyondfinance.com"
                  value={newPartnerEmail}
                  onChange={(e) => setNewPartnerEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Role</label>
                  <select
                    value={newPartnerRole}
                    onChange={(e) => setNewPartnerRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="owner">Owner</option>
                    <option value="partner">Partner</option>
                    <option value="accountant">Accountant</option>
                    <option value="employee">Employee</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Ownership %</label>
                  <input
                    type="number"
                    value={newPartnerOwnership}
                    onChange={(e) => setNewPartnerOwnership(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Initial Capital Contribution (USD)</label>
                <input
                  type="number"
                  value={newPartnerCapital}
                  onChange={(e) => setNewPartnerCapital(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
