import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Branch } from '../types';
import { Building2, Plus, Store, Globe, MapPin, X, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';

export const BranchManagerView: React.FC = () => {
  const { branches, transactions, addBranch, updateBranch, deleteBranch, formatAmount, convertToUSD } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Delete confirmation modal state
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setName('');
    setLocation('');
    setManager('');
    setIsOnline(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setName(branch.name);
    setLocation(branch.location);
    setManager(branch.manager);
    setIsOnline(branch.isOnline);
    setIsModalOpen(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBranch) {
      await updateBranch(editingBranch.id, {
        name: name.trim(),
        location: location.trim() || 'Headquarters',
        manager: manager.trim() || 'Branch Manager',
        isOnline
      });
    } else {
      await addBranch({
        name: name.trim(),
        location: location.trim() || 'Headquarters',
        manager: manager.trim() || 'Branch Manager',
        isOnline
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBranchId) return;
    await deleteBranch(deletingBranchId);
    setDeletingBranchId(null);
  };

  const filteredBranches = branches
    .filter((b) => b.id !== 'b-all')
    .filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const deletingBranchObj = branches.find((b) => b.id === deletingBranchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              Multi-Branch Store Management
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Create, edit, or remove store locations and track performance across Hatton, Colombo, and Online channels
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search branches by name, location, manager..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2 text-xs outline-none focus:border-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBranches.map((b) => {
          const branchTxs = transactions.filter((t) => t.branchId === b.id);
          const incUSD = branchTxs
            .filter((t) => t.type === 'income')
            .reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);
          const expUSD = branchTxs
            .filter((t) => t.type === 'expense')
            .reduce((s, t) => s + convertToUSD(t.amount, t.currency), 0);
          const profitUSD = incUSD - expUSD;

          return (
            <div
              key={b.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {b.isOnline ? (
                      <Globe className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Store className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">{b.name}</h3>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{b.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    title="Edit Branch"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingBranchId(b.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                    title="Remove Branch"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-xs space-y-1">
                <p className="text-neutral-500">Branch Manager: <span className="font-bold text-neutral-900 dark:text-white">{b.manager}</span></p>
                <p className="text-neutral-500">Total Recorded Entries: <span className="font-bold text-neutral-900 dark:text-white">{branchTxs.length}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Revenue</span>
                  <p className="text-sm font-black text-emerald-600">{formatAmount(incUSD)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Net Profit</span>
                  <p className={`text-sm font-black ${profitUSD >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {formatAmount(profitUSD)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredBranches.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
            <Building2 className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">No branches found</p>
            <p className="text-xs text-neutral-400">Try adjusting your search query or add a new branch location.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {editingBranch ? 'Edit Branch Location' : 'Add New Branch Location'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kandy Outlet Branch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Location Address</label>
                <input
                  type="text"
                  placeholder="e.g. Main Street, Kandy"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Branch Manager</label>
                <input
                  type="text"
                  placeholder="e.g. Nimal Perera"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="onlineCheck"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="onlineCheck" className="text-xs font-semibold dark:text-neutral-300">
                  Is E-Commerce / Online Store Channel
                </label>
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
                  {editingBranch ? 'Save Changes' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBranchId && deletingBranchObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold">Remove Branch</h3>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Are you sure you want to remove <span className="font-bold text-neutral-900 dark:text-white">{deletingBranchObj.name}</span>? Existing transactions will remain recorded under their respective IDs.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBranchId(null)}
                className="rounded-xl border px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Delete Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
