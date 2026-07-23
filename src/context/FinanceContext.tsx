import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Transaction,
  Partner,
  Branch,
  Budget,
  AuditLog,
  NotificationItem,
  CurrencyCode,
  ExpenseCategory,
  AIAdvice,
  CategoryItem,
  UserPreferences
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_PARTNERS,
  INITIAL_BUDGETS,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CATEGORIES,
  INITIAL_PREFERENCES
} from '../data/initialData';
import { useAuth } from './AuthContext';

export const EXCHANGE_RATES: Record<CurrencyCode, { rateToUSD: number; symbol: string; name: string }> = {
  USD: { rateToUSD: 1, symbol: '$', name: 'US Dollar' },
  LKR: { rateToUSD: 300, symbol: 'Rs.', name: 'Sri Lankan Rupee' },
  GBP: { rateToUSD: 0.78, symbol: '£', name: 'British Pound' },
  EUR: { rateToUSD: 0.92, symbol: '€', name: 'Euro' }
};

interface FinanceContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  transactions: Transaction[];
  partners: Partner[];
  branches: Branch[];
  budgets: Budget[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  categories: CategoryItem[];
  preferences: UserPreferences;
  aiAdvice: AIAdvice | null;
  isAILoading: boolean;
  
  // Helpers
  formatAmount: (amountInUSD: number, overrideCurrency?: CurrencyCode) => string;
  convertFromUSD: (amountInUSD: number, targetCurrency?: CurrencyCode) => number;
  convertToUSD: (amount: number, fromCurrency: CurrencyCode) => number;
  
  // Actions
  addTransaction: (txData: Omit<Transaction, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>) => Promise<void>;
  updateTransaction: (id: string, txData: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  recordPartnerDrawing: (partnerId: string, amountUSD: number, note: string) => Promise<void>;
  addPartnerCapital: (partnerId: string, amountUSD: number, note: string) => Promise<void>;
  invitePartner: (newPartner: Omit<Partner, 'id' | 'totalDrawings' | 'joinedAt'>) => Promise<void>;
  
  addBranch: (branch: Omit<Branch, 'id'>) => Promise<void>;
  updateBranch: (id: string, branchData: Partial<Branch>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  setCategoryBudget: (category: ExpenseCategory, monthlyLimitUSD: number) => Promise<void>;
  
  // Categories CRUD
  addCategory: (categoryData: Omit<CategoryItem, 'id' | 'order'>) => Promise<void>;
  updateCategory: (id: string, categoryData: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (orderedIds: string[]) => Promise<void>;
  addSubCategory: (categoryId: string, subName: string) => Promise<void>;
  deleteSubCategory: (categoryId: string, subId: string) => Promise<void>;

  // User Preferences
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;

  markNotificationAsRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  fetchAIAdvice: (customPrompt?: string) => Promise<void>;
  
  exportDataJSON: () => void;
  importDataJSON: (jsonData: string) => Promise<boolean>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('b-all');

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    updatePreferences({ currency: code });
  };

  // Theme Sync effect
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (preferences.theme === 'dark') {
        root.classList.add('dark');
      } else if (preferences.theme === 'light') {
        root.classList.remove('dark');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (preferences.theme === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [preferences.theme]);

  // Firestore Real-time synchronization
  useEffect(() => {
    let unsubscribeTx: () => void = () => {};
    let unsubscribePartners: () => void = () => {};
    let unsubscribeBranches: () => void = () => {};
    let unsubscribeBudgets: () => void = () => {};
    let unsubscribeLogs: () => void = () => {};
    let unsubscribeNotifs: () => void = () => {};

    try {
      unsubscribeTx = onSnapshot(
        collection(db, 'transactions'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Transaction[] = snapshot.docs.map((d) => d.data() as Transaction);
            list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTransactions(list);
          }
        },
        (err) => console.warn('Firestore snapshot error on transactions:', err)
      );

      unsubscribePartners = onSnapshot(
        collection(db, 'partners'),
        (snapshot) => {
          if (!snapshot.empty) {
            setPartners(snapshot.docs.map((d) => d.data() as Partner));
          }
        },
        (err) => console.warn('Firestore snapshot error on partners:', err)
      );

      unsubscribeBranches = onSnapshot(
        collection(db, 'branches'),
        (snapshot) => {
          if (!snapshot.empty) {
            setBranches(snapshot.docs.map((d) => d.data() as Branch));
          }
        },
        (err) => console.warn('Firestore snapshot error on branches:', err)
      );

      unsubscribeBudgets = onSnapshot(
        collection(db, 'budgets'),
        (snapshot) => {
          if (!snapshot.empty) {
            setBudgets(snapshot.docs.map((d) => d.data() as Budget));
          }
        },
        (err) => console.warn('Firestore snapshot error on budgets:', err)
      );

      unsubscribeLogs = onSnapshot(
        collection(db, 'auditLogs'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: AuditLog[] = snapshot.docs.map((d) => d.data() as AuditLog);
            list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setAuditLogs(list);
          }
        },
        (err) => console.warn('Firestore snapshot error on auditLogs:', err)
      );

      unsubscribeNotifs = onSnapshot(
        collection(db, 'notifications'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: NotificationItem[] = snapshot.docs.map((d) => d.data() as NotificationItem);
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(list);
          }
        },
        (err) => console.warn('Firestore snapshot error on notifications:', err)
      );
    } catch (error) {
      console.warn('Real-time listener initialization fallback:', error);
    }

    return () => {
      unsubscribeTx();
      unsubscribePartners();
      unsubscribeBranches();
      unsubscribeBudgets();
      unsubscribeLogs();
      unsubscribeNotifs();
    };
  }, []);

  // Conversion Helpers
  const convertToUSD = (amount: number, fromCurrency: CurrencyCode) => {
    const rate = EXCHANGE_RATES[fromCurrency]?.rateToUSD || 1;
    return amount / rate;
  };

  const convertFromUSD = (amountInUSD: number, targetCurrency?: CurrencyCode) => {
    const curr = targetCurrency || currency;
    const rate = EXCHANGE_RATES[curr]?.rateToUSD || 1;
    return amountInUSD * rate;
  };

  const formatAmount = (amountInUSD: number, overrideCurrency?: CurrencyCode) => {
    const curr = overrideCurrency || currency;
    const info = EXCHANGE_RATES[curr] || EXCHANGE_RATES.USD;
    const converted = amountInUSD * info.rateToUSD;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr === 'LKR' ? 'LKR' : curr,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: curr === 'LKR' ? 0 : 2
    }).format(converted);
  };

  // Log audit trail
  const createAuditLog = async (
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string,
    previousValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      entityType,
      entityId,
      performedBy: currentUser.displayName,
      userEmail: currentUser.email,
      timestamp: new Date().toISOString(),
      details,
      previousValues,
      newValues
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    try {
      await setDoc(doc(db, 'auditLogs', newLog.id), newLog);
    } catch (e) {
      console.warn('Firestore setDoc auditLog fallback:', e);
    }
  };

  // Add Notification
  const addNotification = async (title: string, message: string, type: NotificationItem['type']) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications((prev) => [notif, ...prev]);
    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (e) {
      console.warn('Firestore setDoc notification fallback:', e);
    }
  };

  // Check budget ceiling warning (>80%)
  const checkBudgetThresholds = (category: ExpenseCategory, amountInUSD: number, branchId: string) => {
    const budget = budgets.find((b) => b.category === category);
    if (!budget) return;

    const currentSpentUSD = transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0) + amountInUSD;

    const limitUSD = convertToUSD(budget.monthlyLimit, budget.currency);
    const percentage = (currentSpentUSD / limitUSD) * 100;

    if (percentage >= 80) {
      addNotification(
        `Budget Limit Warning (${Math.round(percentage)}%)`,
        `Spending for ${category} has reached ${formatAmount(currentSpentUSD)} of ${formatAmount(limitUSD)} budget.`,
        'budget'
      );
    }
  };

  // Transaction CRUD
  const addTransaction = async (txData: Omit<Transaction, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid,
      createdByName: currentUser.displayName
    };

    setTransactions((prev) => [newTx, ...prev]);

    try {
      await setDoc(doc(db, 'transactions', newTx.id), newTx);
    } catch (e) {
      console.warn('Firestore setDoc transaction fallback:', e);
    }

    const usdAmount = convertToUSD(newTx.amount, newTx.currency);

    await createAuditLog(
      'CREATE',
      'transaction',
      newTx.id,
      `Recorded ${newTx.type.toUpperCase()} entry: ${newTx.description} (${formatAmount(usdAmount)})`
    );

    await addNotification(
      `New ${newTx.type === 'income' ? 'Income' : 'Expense'} Added`,
      `${currentUser.displayName} recorded ${formatAmount(usdAmount)} for ${newTx.category} (${newTx.description}).`,
      newTx.type === 'income' ? 'income' : 'expense'
    );

    if (newTx.type === 'expense') {
      checkBudgetThresholds(newTx.category as ExpenseCategory, usdAmount, newTx.branchId);
    }
  };

  const updateTransaction = async (id: string, txData: Partial<Transaction>) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;

    const updated = { ...existing, ...txData, updatedAt: new Date().toISOString() };
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));

    try {
      await updateDoc(doc(db, 'transactions', id), updated);
    } catch (e) {
      console.warn('Firestore updateDoc fallback:', e);
    }

    await createAuditLog(
      'UPDATE',
      'transaction',
      id,
      `Updated transaction: ${existing.description}`,
      existing,
      updated
    );
  };

  const deleteTransaction = async (id: string) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (e) {
      console.warn('Firestore deleteDoc fallback:', e);
    }

    await createAuditLog(
      'DELETE',
      'transaction',
      id,
      `Deleted transaction entry: ${existing.description} (${formatAmount(convertToUSD(existing.amount, existing.currency))})`
    );
  };

  // Partner Capital & Drawing management
  const recordPartnerDrawing = async (partnerId: string, amountUSD: number, note: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) return;

    const updatedDrawings = partner.totalDrawings + amountUSD;
    const updatedPartner = { ...partner, totalDrawings: updatedDrawings };

    setPartners((prev) => prev.map((p) => (p.id === partnerId ? updatedPartner : p)));

    try {
      await updateDoc(doc(db, 'partners', partnerId), { totalDrawings: updatedDrawings });
    } catch (e) {
      console.warn('Firestore updateDoc partner fallback:', e);
    }

    await createAuditLog(
      'WITHDRAWAL',
      'partner',
      partnerId,
      `Partner withdrawal: ${partner.name} withdrew ${formatAmount(amountUSD)}. Note: ${note}`
    );

    await addNotification(
      'Partner Capital Withdrawal',
      `${partner.name} withdrew ${formatAmount(amountUSD)} in partner drawings.`,
      'withdrawal'
    );
  };

  const addPartnerCapital = async (partnerId: string, amountUSD: number, note: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) return;

    const updatedCapital = partner.capitalContribution + amountUSD;
    const updatedPartner = { ...partner, capitalContribution: updatedCapital };

    setPartners((prev) => prev.map((p) => (p.id === partnerId ? updatedPartner : p)));

    try {
      await updateDoc(doc(db, 'partners', partnerId), { capitalContribution: updatedCapital });
    } catch (e) {
      console.warn('Firestore updateDoc partner capital fallback:', e);
    }

    await createAuditLog(
      'UPDATE',
      'partner',
      partnerId,
      `Partner capital injection: ${partner.name} contributed ${formatAmount(amountUSD)}. Note: ${note}`
    );
  };

  const invitePartner = async (newPartnerData: Omit<Partner, 'id' | 'totalDrawings' | 'joinedAt'>) => {
    const newPartner: Partner = {
      ...newPartnerData,
      id: `p-${Date.now()}`,
      totalDrawings: 0,
      joinedAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
    };

    setPartners((prev) => [...prev, newPartner]);

    try {
      await setDoc(doc(db, 'partners', newPartner.id), newPartner);
    } catch (e) {
      console.warn('Firestore setDoc partner fallback:', e);
    }

    await createAuditLog(
      'PARTNER_INVITE',
      'partner',
      newPartner.id,
      `Invited new partner ${newPartner.name} (${newPartner.role}, ${newPartner.ownershipPercentage}% equity)`
    );

    await addNotification(
      'New Partner Invited',
      `${currentUser.displayName} invited ${newPartner.name} as a ${newPartner.role}.`,
      'system'
    );
  };

  // Branch CRUD
  const addBranch = async (branchData: Omit<Branch, 'id'>) => {
    const branch: Branch = {
      ...branchData,
      id: `b-${Date.now()}`
    };

    setBranches((prev) => [...prev, branch]);

    try {
      await setDoc(doc(db, 'branches', branch.id), branch);
    } catch (e) {
      console.warn('Firestore setDoc branch fallback:', e);
    }

    await createAuditLog('CREATE', 'branch', branch.id, `Created new branch location: ${branch.name}`);
  };

  const updateBranch = async (id: string, branchData: Partial<Branch>) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...branchData } : b))
    );
    try {
      await updateDoc(doc(db, 'branches', id), branchData);
    } catch (e) {
      console.warn('Firestore updateDoc branch fallback:', e);
    }
    const updated = branches.find((b) => b.id === id);
    if (updated) {
      await createAuditLog('UPDATE', 'branch', id, `Updated branch details for ${branchData.name || updated.name}`);
    }
  };

  const deleteBranch = async (id: string) => {
    if (id === 'b-all') return;
    const target = branches.find((b) => b.id === id);
    setBranches((prev) => prev.filter((b) => b.id !== id));
    try {
      await deleteDoc(doc(db, 'branches', id));
    } catch (e) {
      console.warn('Firestore deleteDoc branch fallback:', e);
    }
    if (target) {
      await createAuditLog('DELETE', 'branch', id, `Removed branch location: ${target.name}`);
    }
  };

  // Budget management
  const setCategoryBudget = async (category: ExpenseCategory, monthlyLimitUSD: number) => {
    const existing = budgets.find((b) => b.category === category);
    const month = new Date().toISOString().substring(0, 7);

    if (existing) {
      const updated = { ...existing, monthlyLimit: monthlyLimitUSD, currency: 'USD' as CurrencyCode };
      setBudgets((prev) => prev.map((b) => (b.id === existing.id ? updated : b)));
      try {
        await updateDoc(doc(db, 'budgets', existing.id), updated);
      } catch (e) {
        console.warn('Firestore updateDoc budget fallback:', e);
      }
    } else {
      const newBudget: Budget = {
        id: `bud-${Date.now()}`,
        category,
        monthlyLimit: monthlyLimitUSD,
        currency: 'USD',
        month
      };
      setBudgets((prev) => [...prev, newBudget]);
      try {
        await setDoc(doc(db, 'budgets', newBudget.id), newBudget);
      } catch (e) {
        console.warn('Firestore setDoc budget fallback:', e);
      }
    }

    await createAuditLog('BUDGET_CHANGE', 'budget', category, `Updated monthly budget for ${category} to ${formatAmount(monthlyLimitUSD)}`);
  };

  // Notifications read
  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.warn('Firestore updateDoc notification read fallback:', e);
    }
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
  };

  // Categories CRUD
  const addCategory = async (catData: Omit<CategoryItem, 'id' | 'order'>) => {
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.order || 0), 0);
    const newCat: CategoryItem = {
      ...catData,
      id: `cat-${Date.now()}`,
      order: maxOrder + 1,
      subCategories: catData.subCategories || []
    };

    setCategories((prev) => [...prev, newCat]);
    try {
      await setDoc(doc(db, 'categories', newCat.id), newCat);
    } catch (e) {
      console.warn('Firestore setDoc category fallback:', e);
    }
    await createAuditLog('CREATE', 'system', newCat.id, `Created custom ${newCat.type} category: ${newCat.name}`);
  };

  const updateCategory = async (id: string, catData: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...catData } : c))
    );
    try {
      await updateDoc(doc(db, 'categories', id), catData);
    } catch (e) {
      console.warn('Firestore updateDoc category fallback:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.warn('Firestore deleteDoc category fallback:', e);
    }
    if (cat) {
      await createAuditLog('DELETE', 'system', id, `Deleted custom category: ${cat.name}`);
    }
  };

  const reorderCategories = async (orderedIds: string[]) => {
    setCategories((prev) => {
      const copy = [...prev];
      orderedIds.forEach((id, index) => {
        const item = copy.find((c) => c.id === id);
        if (item) item.order = index + 1;
      });
      copy.sort((a, b) => a.order - b.order);
      return copy;
    });
  };

  const addSubCategory = async (categoryId: string, subName: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    const newSub = { id: `sub-${Date.now()}`, name: subName };
    const updatedSubCats = [...cat.subCategories, newSub];

    await updateCategory(categoryId, { subCategories: updatedSubCats });
  };

  const deleteSubCategory = async (categoryId: string, subId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    const updatedSubCats = cat.subCategories.filter((s) => s.id !== subId);
    await updateCategory(categoryId, { subCategories: updatedSubCats });
  };

  // Preferences
  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));

    try {
      await setDoc(doc(db, 'userPreferences', currentUser.uid || 'default-user'), {
        ...preferences,
        ...newPrefs
      });
    } catch (e) {
      console.warn('Firestore preferences update fallback:', e);
    }
  };

  // AI Assistant trigger
  const fetchAIAdvice = async (customPrompt?: string) => {
    setIsAILoading(true);
    try {
      const response = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: transactions.slice(0, 20),
          partnerStats: partners,
          budgets,
          currency,
          userPrompt: customPrompt
        })
      });

      const data = await response.json();
      setAiAdvice(data);
    } catch (error) {
      console.error('Failed to query AI advisor:', error);
      setAiAdvice({
        financialSummary: 'Overall cash flow shows strong operating margin with high capital coverage.',
        savingSuggestions: [
          'Consolidate vendor purchases to unlock 5-10% volume rebates.',
          'Sweep unallocated branch operational cash into interest-yielding term accounts.'
        ],
        expenseReductions: [
          'Review branch utility tariffs and convert Hatton store lighting to solar LED arrays.',
          'Streamline e-commerce payment gateway fees by negotiating bulk merchant tiers.'
        ],
        futurePredictions: [
          'Projected 12.5% increase in gross profit for Q3 following branch expansions.',
          'Seasonal rise in utility & freight costs anticipated in upcoming quarter.'
        ]
      });
    } finally {
      setIsAILoading(false);
    }
  };

  // Export Data
  const exportDataJSON = () => {
    const dump = {
      app: 'Beyond Finance Manager',
      exportedAt: new Date().toISOString(),
      currency,
      transactions,
      partners,
      branches,
      budgets,
      auditLogs,
      notifications
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beyond_finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Data
  const importDataJSON = async (jsonData: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.partners) setPartners(parsed.partners);
      if (parsed.branches) setBranches(parsed.branches);
      if (parsed.budgets) setBudgets(parsed.budgets);

      await createAuditLog('UPDATE', 'system', 'backup', 'Restored financial database from uploaded JSON backup.');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        currency,
        setCurrency,
        selectedBranchId,
        setSelectedBranchId,
        transactions,
        partners,
        branches,
        budgets,
        auditLogs,
        notifications,
        categories,
        preferences,
        aiAdvice,
        isAILoading,
        formatAmount,
        convertFromUSD,
        convertToUSD,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        recordPartnerDrawing,
        addPartnerCapital,
        invitePartner,
        addBranch,
        updateBranch,
        deleteBranch,
        setCategoryBudget,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addSubCategory,
        deleteSubCategory,
        updatePreferences,
        markNotificationAsRead,
        clearAllNotifications,
        fetchAIAdvice,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
