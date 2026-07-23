import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { PartnershipHubView } from './components/PartnershipHubView';
import { ProfitAccountingView } from './components/ProfitAccountingView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { ReportsView } from './components/ReportsView';
import { AnalyticsView } from './components/AnalyticsView';
import { BranchManagerView } from './components/BranchManagerView';
import { AIAdvisorView } from './components/AIAdvisorView';
import { CategoryManagerView } from './components/CategoryManagerView';
import { AuditTrailView } from './components/AuditTrailView';
import { SettingsView } from './components/SettingsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { TransactionType } from './types';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('income');

  const handleOpenAddModal = (type: TransactionType) => {
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'dashboard' && (
              <DashboardView onOpenAddModal={handleOpenAddModal} onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'transactions' && (
              <TransactionsView onOpenAddModal={handleOpenAddModal} />
            )}
            {activeTab === 'partnership' && <PartnershipHubView />}
            {activeTab === 'profit_accounting' && <ProfitAccountingView />}
            {activeTab === 'budget' && <BudgetPlannerView />}
            {activeTab === 'categories' && <CategoryManagerView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'branches' && <BranchManagerView />}
            {activeTab === 'ai_advisor' && <AIAdvisorView />}
            {activeTab === 'audit_trail' && <AuditTrailView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialType={addModalType}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <MainAppContent />
      </FinanceProvider>
    </AuthProvider>
  );
}
