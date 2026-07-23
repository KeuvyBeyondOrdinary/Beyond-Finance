import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users2,
  Calculator,
  PieChart,
  Tag,
  FileSpreadsheet,
  LineChart,
  Building2,
  Bot,
  History,
  Settings
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'transactions'
  | 'partnership'
  | 'profit_accounting'
  | 'budget'
  | 'categories'
  | 'reports'
  | 'analytics'
  | 'branches'
  | 'ai_advisor'
  | 'audit_trail'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Income & Expenses', icon: Receipt },
    { id: 'partnership', label: 'Partnership Hub', icon: Users2 },
    { id: 'profit_accounting', label: 'Profit & Accounting', icon: Calculator },
    { id: 'budget', label: 'Budget Planner', icon: PieChart },
    { id: 'categories', label: 'Manage Categories', icon: Tag },
    { id: 'reports', label: 'Reports & Exports', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'branches', label: 'Branch Manager', icon: Building2 },
    { id: 'ai_advisor', label: 'AI Advisor', icon: Bot, badge: 'Gemini AI' },
    { id: 'audit_trail', label: 'Audit Trail', icon: History },
    { id: 'settings', label: 'Preferences & Security', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 dark:bg-emerald-600'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
