import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CategoryItem, TransactionType } from '../types';
import {
  Tag,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  Check,
  FolderTree,
  Briefcase,
  Building,
  Building2,
  Home,
  Utensils,
  Zap,
  Truck,
  ShoppingBag,
  Megaphone,
  Users,
  DollarSign,
  Laptop,
  TrendingUp,
  HelpCircle,
  Film,
  Heart,
  Gift,
  Coffee,
  Smartphone
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Briefcase,
  Building,
  Building2,
  Home,
  Utensils,
  Zap,
  Truck,
  ShoppingBag,
  Megaphone,
  Users,
  DollarSign,
  Laptop,
  TrendingUp,
  HelpCircle,
  Film,
  Heart,
  Gift,
  Coffee,
  Smartphone
};

const COLOR_PALETTE = [
  '#10b981', // Emerald
  '#059669', // Dark Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#d97706', // Warm Amber
  '#6b7280'  // Gray
];

export const CategoryManagerView: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addSubCategory,
    deleteSubCategory
  } = useFinance();

  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [formIcon, setFormIcon] = useState('Briefcase');
  const [formColor, setFormColor] = useState('#10b981');

  // Inline Subcategory State
  const [newSubName, setNewSubName] = useState<Record<string, string>>({});

  const filteredCategories = categories
    .filter((c) => c.type === activeTab)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormType(activeTab);
    setFormIcon('Briefcase');
    setFormColor('#10b981');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormType(cat.type);
    setFormIcon(cat.icon || 'Briefcase');
    setFormColor(cat.color || '#10b981');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: formName.trim(),
        type: formType,
        icon: formIcon,
        color: formColor
      });
    } else {
      await addCategory({
        name: formName.trim(),
        type: formType,
        icon: formIcon,
        color: formColor,
        subCategories: []
      });
    }

    setIsModalOpen(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const list = [...filteredCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const orderedIds = list.map((c) => c.id);
    reorderCategories(orderedIds);
  };

  const handleAddSub = async (catId: string) => {
    const val = newSubName[catId]?.trim();
    if (!val) return;

    await addSubCategory(catId, val);
    setNewSubName((prev) => ({ ...prev, [catId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              Custom Categories & Sub-Categories
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Customize income and expense classifications, reorder priority, and set color-coded icons
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('expense')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all mr-6 ${
            activeTab === 'expense'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Expense Categories ({categories.filter((c) => c.type === 'expense').length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'income'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Income Categories ({categories.filter((c) => c.type === 'income').length})
        </button>
      </div>

      {/* Categories Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((cat, idx) => {
          const IconComp = ICON_MAP[cat.icon] || Tag;

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ backgroundColor: cat.color || '#10b981' }}
                  >
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-bold uppercase text-neutral-400">
                      {cat.type} • Priority #{idx + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-800 dark:hover:bg-neutral-800"
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={idx === filteredCategories.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-800 dark:hover:bg-neutral-800"
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    title="Edit Category"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-categories */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 mb-2">
                  <FolderTree className="h-3.5 w-3.5" />
                  <span>Sub-categories ({cat.subCategories?.length || 0})</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cat.subCategories && cat.subCategories.length > 0 ? (
                    cat.subCategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                      >
                        {sub.name}
                        <button
                          onClick={() => deleteSubCategory(cat.id, sub.id)}
                          className="text-neutral-400 hover:text-rose-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400 italic">No sub-categories defined.</span>
                  )}
                </div>

                {/* Inline Add Sub-category */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add sub-category (e.g. Solar Electric)"
                    value={newSubName[cat.id] || ''}
                    onChange={(e) =>
                      setNewSubName((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSub(cat.id);
                      }
                    }}
                    className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                  />
                  <button
                    onClick={() => handleAddSub(cat.id)}
                    className="rounded-xl bg-neutral-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-black dark:bg-neutral-700 dark:hover:bg-neutral-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'Create Custom Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Category Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as TransactionType)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="expense">Expense Category</option>
                  <option value="income">Income Category</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal & Compliance"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Select Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1 border rounded-xl dark:border-neutral-800">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const Icon = ICON_MAP[iconKey];
                    const isSelected = formIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setFormIcon(iconKey)}
                        className={`flex items-center justify-center p-2 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Category Color Accent</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`h-7 w-7 rounded-full transition-all flex items-center justify-center ${
                        formColor === c ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {formColor === c && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                  ))}
                </div>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
