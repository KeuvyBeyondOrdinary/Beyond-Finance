export type TransactionType = 'income' | 'expense';

export type IncomeCategory = string;
export type ExpenseCategory = string;
export type TransactionCategory = string;

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Credit Card' | 'Cheque' | 'Online Wallet';

export type CurrencyCode = 'USD' | 'LKR' | 'GBP' | 'EUR';

export type UserRole = 'owner' | 'partner' | 'accountant' | 'employee' | 'viewer';

export interface SubCategoryItem {
  id: string;
  name: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  subCategories: SubCategoryItem[];
  order: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: CurrencyCode;
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  notificationsEnabled: {
    budgetAlerts: boolean;
    withdrawalAlerts: boolean;
    highValueTransactions: boolean;
    monthlyReportReminders: boolean;
  };
  dashboardLayout: {
    showQuickStats: boolean;
    showRecentTransactions: boolean;
    showBranchBreakdown: boolean;
    showBudgetHealth: boolean;
    showProfitDistribution: boolean;
    compactMode: boolean;
  };
  defaultLandingPage: string;
  timeZone: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod: PaymentMethod;
  branchId: string;
  partnerId?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ownershipPercentage: number;
  capitalContribution: number;
  totalDrawings: number;
  status: 'active' | 'invited' | 'inactive';
  joinedAt: string;
  avatarUrl?: string;
  phone?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  isOnline: boolean;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  monthlyLimit: number;
  currency: CurrencyCode;
  month: string; // YYYY-MM
  branchId?: string;
}

export interface AuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'WITHDRAWAL' | 'BUDGET_CHANGE' | 'PARTNER_INVITE';
  entityType: 'transaction' | 'partner' | 'budget' | 'branch' | 'system';
  entityId: string;
  performedBy: string;
  userEmail: string;
  timestamp: string;
  details: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'income' | 'expense' | 'withdrawal' | 'budget' | 'report' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AIAdvice {
  financialSummary: string;
  savingSuggestions: string[];
  expenseReductions: string[];
  futurePredictions: string[];
  answer?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  partnerId: string;
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
}
