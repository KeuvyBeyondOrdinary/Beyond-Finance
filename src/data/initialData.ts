import { Transaction, Partner, Branch, Budget, AuditLog, NotificationItem, CategoryItem, UserPreferences } from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'b-all', name: 'All Branches & Operations', location: 'Global HQ', manager: 'Alex Vance', isOnline: true },
  { id: 'b-colombo', name: 'Colombo HQ & Main Store', location: 'Galle Road, Colombo 03', manager: 'Alex Vance', isOnline: false },
  { id: 'b-hatton', name: 'Hatton Tea & Produce Branch', location: 'Main Street, Hatton', manager: 'Sarah Jenkins', isOnline: false },
  { id: 'b-online', name: 'Online Sales & Export Branch', location: 'Cloud E-Store', manager: 'Liam Patel', isOnline: true },
];

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p-1',
    name: 'Alex Vance',
    email: 'alex.vance@beyondfinance.com',
    role: 'owner',
    ownershipPercentage: 50,
    capitalContribution: 100000,
    totalDrawings: 12000,
    status: 'active',
    joinedAt: '2025-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 555-0192'
  },
  {
    id: 'p-2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@beyondfinance.com',
    role: 'partner',
    ownershipPercentage: 35,
    capitalContribution: 70000,
    totalDrawings: 8500,
    status: 'active',
    joinedAt: '2025-02-15',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 555-0144'
  },
  {
    id: 'p-3',
    name: 'Liam Patel',
    email: 'liam.patel@beyondfinance.com',
    role: 'accountant',
    ownershipPercentage: 15,
    capitalContribution: 30000,
    totalDrawings: 3000,
    status: 'active',
    joinedAt: '2025-03-01',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 555-0831'
  },
  {
    id: 'p-4',
    name: 'Marcus Wright',
    email: 'marcus.wright@beyondfinance.com',
    role: 'employee',
    ownershipPercentage: 0,
    capitalContribution: 0,
    totalDrawings: 0,
    status: 'active',
    joinedAt: '2025-04-12',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    phone: '+1 555-0219'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'bud-1', category: 'Rent', monthlyLimit: 5000, currency: 'USD', month: '2026-07', branchId: 'b-colombo' },
  { id: 'bud-2', category: 'Utilities', monthlyLimit: 1200, currency: 'USD', month: '2026-07', branchId: 'b-colombo' },
  { id: 'bud-3', category: 'Business', monthlyLimit: 8000, currency: 'USD', month: '2026-07', branchId: 'b-all' },
  { id: 'bud-4', category: 'Food', monthlyLimit: 1500, currency: 'USD', month: '2026-07', branchId: 'b-hatton' },
  { id: 'bud-5', category: 'Transport', monthlyLimit: 2000, currency: 'USD', month: '2026-07', branchId: 'b-all' },
  { id: 'bud-6', category: 'Shopping', monthlyLimit: 3000, currency: 'USD', month: '2026-07', branchId: 'b-online' },
  { id: 'bud-7', category: 'Entertainment', monthlyLimit: 800, currency: 'USD', month: '2026-07', branchId: 'b-all' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    type: 'income',
    amount: 18500,
    currency: 'USD',
    category: 'Business',
    date: '2026-07-22',
    description: 'B2B Wholesale Tea & Spices Export Contract',
    paymentMethod: 'Bank Transfer',
    branchId: 'b-colombo',
    partnerId: 'p-1',
    createdBy: 'p-1',
    createdByName: 'Alex Vance',
    createdAt: '2026-07-22T10:30:00Z'
  },
  {
    id: 'tx-102',
    type: 'income',
    amount: 9400,
    currency: 'USD',
    category: 'Investments',
    date: '2026-07-21',
    description: 'Dividend Payout from Agricultural Tech Portfolio',
    paymentMethod: 'Bank Transfer',
    branchId: 'b-all',
    partnerId: 'p-2',
    createdBy: 'p-2',
    createdByName: 'Sarah Jenkins',
    createdAt: '2026-07-21T14:15:00Z'
  },
  {
    id: 'tx-103',
    type: 'income',
    amount: 6200,
    currency: 'USD',
    category: 'Freelancing',
    date: '2026-07-20',
    description: 'E-commerce Store Online Sales Settlement',
    paymentMethod: 'Online Wallet',
    branchId: 'b-online',
    partnerId: 'p-3',
    createdBy: 'p-3',
    createdByName: 'Liam Patel',
    createdAt: '2026-07-20T18:00:00Z'
  },
  {
    id: 'tx-104',
    type: 'expense',
    amount: 4200,
    currency: 'USD',
    category: 'Rent',
    date: '2026-07-19',
    description: 'Colombo Main Outlet Monthly Lease Payment',
    paymentMethod: 'Bank Transfer',
    branchId: 'b-colombo',
    createdBy: 'p-1',
    createdByName: 'Alex Vance',
    createdAt: '2026-07-19T09:00:00Z'
  },
  {
    id: 'tx-105',
    type: 'expense',
    amount: 1150,
    currency: 'USD',
    category: 'Utilities',
    date: '2026-07-18',
    description: 'Electricity & Solar Microgrid Bill - Hatton',
    paymentMethod: 'Credit Card',
    branchId: 'b-hatton',
    createdBy: 'p-2',
    createdByName: 'Sarah Jenkins',
    createdAt: '2026-07-18T11:20:00Z'
  },
  {
    id: 'tx-106',
    type: 'expense',
    amount: 2800,
    currency: 'USD',
    category: 'Business',
    date: '2026-07-17',
    description: 'Logistics & International Cold-Chain Shipping',
    paymentMethod: 'Cheque',
    branchId: 'b-all',
    createdBy: 'p-3',
    createdByName: 'Liam Patel',
    createdAt: '2026-07-17T16:45:00Z'
  },
  {
    id: 'tx-107',
    type: 'income',
    amount: 14200,
    currency: 'USD',
    category: 'Business',
    date: '2026-07-15',
    description: 'Hatton Store Retail Produce & Tea Bulk Sales',
    paymentMethod: 'Cash',
    branchId: 'b-hatton',
    partnerId: 'p-2',
    createdBy: 'p-2',
    createdByName: 'Sarah Jenkins',
    createdAt: '2026-07-15T12:10:00Z'
  },
  {
    id: 'tx-108',
    type: 'expense',
    amount: 850,
    currency: 'USD',
    category: 'Food',
    date: '2026-07-14',
    description: 'Quarterly Executive Partner Summit & Catering',
    paymentMethod: 'Credit Card',
    branchId: 'b-all',
    createdBy: 'p-1',
    createdByName: 'Alex Vance',
    createdAt: '2026-07-14T20:00:00Z'
  },
  {
    id: 'tx-109',
    type: 'expense',
    amount: 1650,
    currency: 'USD',
    category: 'Shopping',
    date: '2026-07-12',
    description: 'POS Hardware & Barcode Scanners Upgrade',
    paymentMethod: 'Bank Transfer',
    branchId: 'b-colombo',
    createdBy: 'p-1',
    createdByName: 'Alex Vance',
    createdAt: '2026-07-12T15:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'CREATE',
    entityType: 'transaction',
    entityId: 'tx-101',
    performedBy: 'Alex Vance',
    userEmail: 'alex.vance@beyondfinance.com',
    timestamp: '2026-07-22T10:30:00Z',
    details: 'Added income entry of $18,500 under Business category'
  },
  {
    id: 'log-2',
    action: 'WITHDRAWAL',
    entityType: 'partner',
    entityId: 'p-2',
    performedBy: 'Sarah Jenkins',
    userEmail: 'sarah.jenkins@beyondfinance.com',
    timestamp: '2026-07-21T16:00:00Z',
    details: 'Recorded partner drawing withdrawal of $2,500 from capital balance'
  },
  {
    id: 'log-3',
    action: 'BUDGET_CHANGE',
    entityType: 'budget',
    entityId: 'bud-1',
    performedBy: 'Liam Patel',
    userEmail: 'liam.patel@beyondfinance.com',
    timestamp: '2026-07-01T09:00:00Z',
    details: 'Updated Colombo Rent budget limit to $5,000/mo'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New High-Value Income Recorded',
    message: 'Alex Vance recorded $18,500 income for Colombo HQ.',
    type: 'income',
    read: false,
    createdAt: '2026-07-22T10:30:00Z'
  },
  {
    id: 'notif-2',
    title: 'Budget Alert (95% Reached)',
    message: 'Colombo Rent spending is near monthly ceiling threshold.',
    type: 'budget',
    read: false,
    createdAt: '2026-07-19T09:05:00Z'
  },
  {
    id: 'notif-3',
    title: 'Partner Drawing Recorded',
    message: 'Sarah Jenkins withdrew $2,500 partner capital drawings.',
    type: 'withdrawal',
    read: true,
    createdAt: '2026-07-21T16:00:00Z'
  }
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-inc-1',
    name: 'Salary',
    type: 'income',
    icon: 'Briefcase',
    color: '#10b981',
    order: 1,
    subCategories: [
      { id: 'sub-1', name: 'Base Salary' },
      { id: 'sub-2', name: 'Performance Bonus' },
      { id: 'sub-3', name: 'Commission' }
    ]
  },
  {
    id: 'cat-inc-2',
    name: 'Business',
    type: 'income',
    icon: 'Building2',
    color: '#059669',
    order: 2,
    subCategories: [
      { id: 'sub-4', name: 'Wholesale Sales' },
      { id: 'sub-5', name: 'Retail Store' },
      { id: 'sub-6', name: 'E-commerce' }
    ]
  },
  {
    id: 'cat-inc-3',
    name: 'Investments',
    type: 'income',
    icon: 'TrendingUp',
    color: '#3b82f6',
    order: 3,
    subCategories: [
      { id: 'sub-7', name: 'Stock Dividends' },
      { id: 'sub-8', name: 'Crypto & Forex' },
      { id: 'sub-9', name: 'Fixed Deposits' }
    ]
  },
  {
    id: 'cat-inc-4',
    name: 'Rental Income',
    type: 'income',
    icon: 'Home',
    color: '#8b5cf6',
    order: 4,
    subCategories: [
      { id: 'sub-10', name: 'Commercial Property' },
      { id: 'sub-11', name: 'Residential Apartments' }
    ]
  },
  {
    id: 'cat-inc-5',
    name: 'Freelancing',
    type: 'income',
    icon: 'Laptop',
    color: '#06b6d4',
    order: 5,
    subCategories: [
      { id: 'sub-12', name: 'Consulting' },
      { id: 'sub-13', name: 'Design Services' }
    ]
  },
  {
    id: 'cat-inc-6',
    name: 'Other',
    type: 'income',
    icon: 'DollarSign',
    color: '#6b7280',
    order: 6,
    subCategories: [
      { id: 'sub-14', name: 'Gifts & Grants' }
    ]
  },
  {
    id: 'cat-exp-1',
    name: 'Rent',
    type: 'expense',
    icon: 'Building',
    color: '#f43f5e',
    order: 1,
    subCategories: [
      { id: 'sub-15', name: 'Store Lease' },
      { id: 'sub-16', name: 'Warehouse Storage' }
    ]
  },
  {
    id: 'cat-exp-2',
    name: 'Utilities',
    type: 'expense',
    icon: 'Zap',
    color: '#f59e0b',
    order: 2,
    subCategories: [
      { id: 'sub-17', name: 'Electricity' },
      { id: 'sub-18', name: 'Water' },
      { id: 'sub-19', name: 'High-speed Internet' }
    ]
  },
  {
    id: 'cat-exp-3',
    name: 'Marketing',
    type: 'expense',
    icon: 'Megaphone',
    color: '#ec4899',
    order: 3,
    subCategories: [
      { id: 'sub-20', name: 'Social Media Ads' },
      { id: 'sub-21', name: 'SEO & Content' },
      { id: 'sub-22', name: 'Print & Banners' }
    ]
  },
  {
    id: 'cat-exp-4',
    name: 'Employee Salaries',
    type: 'expense',
    icon: 'Users',
    color: '#6366f1',
    order: 4,
    subCategories: [
      { id: 'sub-23', name: 'Staff Wages' },
      { id: 'sub-24', name: 'Overtime Pay' },
      { id: 'sub-25', name: 'Employee Health & EPF' }
    ]
  },
  {
    id: 'cat-exp-5',
    name: 'Transportation',
    type: 'expense',
    icon: 'Truck',
    color: '#14b8a6',
    order: 5,
    subCategories: [
      { id: 'sub-26', name: 'Freight & Logistics' },
      { id: 'sub-27', name: 'Vehicle Fuel' },
      { id: 'sub-28', name: 'Vehicle Maintenance' }
    ]
  },
  {
    id: 'cat-exp-6',
    name: 'Food',
    type: 'expense',
    icon: 'Utensils',
    color: '#ef4444',
    order: 6,
    subCategories: [
      { id: 'sub-29', name: 'Office Snacks' },
      { id: 'sub-30', name: 'Client Dinners' }
    ]
  },
  {
    id: 'cat-exp-7',
    name: 'Shopping',
    type: 'expense',
    icon: 'ShoppingBag',
    color: '#d97706',
    order: 7,
    subCategories: [
      { id: 'sub-31', name: 'Office Supplies' },
      { id: 'sub-32', name: 'Hardware & Tech' }
    ]
  },
  {
    id: 'cat-exp-8',
    name: 'Business',
    type: 'expense',
    icon: 'Briefcase',
    color: '#0284c7',
    order: 8,
    subCategories: [
      { id: 'sub-33', name: 'Legal & Audit Fees' },
      { id: 'sub-34', name: 'SaaS Subscriptions' }
    ]
  },
  {
    id: 'cat-exp-9',
    name: 'Entertainment',
    type: 'expense',
    icon: 'Film',
    color: '#a855f7',
    order: 9,
    subCategories: [
      { id: 'sub-35', name: 'Team Retreats' }
    ]
  },
  {
    id: 'cat-exp-10',
    name: 'Other',
    type: 'expense',
    icon: 'HelpCircle',
    color: '#9ca3af',
    order: 10,
    subCategories: [
      { id: 'sub-36', name: 'Miscellaneous Expenses' }
    ]
  }
];

export const INITIAL_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  currency: 'USD',
  dateFormat: 'YYYY-MM-DD',
  notificationsEnabled: {
    budgetAlerts: true,
    withdrawalAlerts: true,
    highValueTransactions: true,
    monthlyReportReminders: true
  },
  dashboardLayout: {
    showQuickStats: true,
    showRecentTransactions: true,
    showBranchBreakdown: true,
    showBudgetHealth: true,
    showProfitDistribution: true,
    compactMode: false
  },
  defaultLandingPage: 'dashboard',
  timeZone: 'Asia/Colombo'
};
