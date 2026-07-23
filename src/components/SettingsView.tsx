import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  ShieldCheck,
  Download,
  Upload,
  Moon,
  Sun,
  Globe,
  DollarSign,
  Calendar,
  Bell,
  Layout,
  Clock,
  User,
  CheckCircle2,
  Lock,
  Smartphone,
  Save,
  Check
} from 'lucide-react';

const TIMEZONES = [
  'Asia/Colombo (UTC +05:30)',
  'UTC (Coordinated Universal Time)',
  'America/New_York (EST/EDT)',
  'America/Los_Angeles (PST/PDT)',
  'Europe/London (GMT/BST)',
  'Europe/Paris (CET/CEST)',
  'Asia/Singapore (SGT)',
  'Asia/Tokyo (JST)',
  'Australia/Sydney (AEST)'
];

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'si', name: 'Sinhala (සිංහල)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' }
];

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, exportDataJSON, importDataJSON, currency, setCurrency } = useFinance();
  const { currentUser, enable2FA, disable2FA } = useAuth();

  const [activeTab, setActiveTab] = useState<'preferences' | 'security' | 'backup'>('preferences');

  // Local Form state for preferences
  const [theme, setTheme] = useState(preferences.theme);
  const [language, setLanguage] = useState(preferences.language || 'en');
  const [prefCurrency, setPrefCurrency] = useState(currency);
  const [dateFormat, setDateFormat] = useState(preferences.dateFormat || 'YYYY-MM-DD');
  const [timeZone, setTimeZone] = useState(preferences.timeZone || 'Asia/Colombo (UTC +05:30)');
  const [landingPage, setLandingPage] = useState(preferences.defaultLandingPage || 'dashboard');

  // Notification toggles
  const [notifBudget, setNotifBudget] = useState(preferences.notificationsEnabled?.budgetAlerts ?? true);
  const [notifWithdrawal, setNotifWithdrawal] = useState(preferences.notificationsEnabled?.withdrawalAlerts ?? true);
  const [notifHighValue, setNotifHighValue] = useState(preferences.notificationsEnabled?.highValueTransactions ?? true);
  const [notifMonthly, setNotifMonthly] = useState(preferences.notificationsEnabled?.monthlyReportReminders ?? true);

  // Layout toggles
  const [showStats, setShowStats] = useState(preferences.dashboardLayout?.showQuickStats ?? true);
  const [showRecent, setShowRecent] = useState(preferences.dashboardLayout?.showRecentTransactions ?? true);
  const [showBranch, setShowBranch] = useState(preferences.dashboardLayout?.showBranchBreakdown ?? true);
  const [showBudget, setShowBudget] = useState(preferences.dashboardLayout?.showBudgetHealth ?? true);
  const [compactMode, setCompactMode] = useState(preferences.dashboardLayout?.compactMode ?? false);

  // Security 2FA state
  const [pinInput, setPinInput] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  // Backup state
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrency(prefCurrency);

    await updatePreferences({
      theme,
      language,
      currency: prefCurrency,
      dateFormat: dateFormat as any,
      timeZone,
      defaultLandingPage: landingPage,
      notificationsEnabled: {
        budgetAlerts: notifBudget,
        withdrawalAlerts: notifWithdrawal,
        highValueTransactions: notifHighValue,
        monthlyReportReminders: notifMonthly
      },
      dashboardLayout: {
        showQuickStats: showStats,
        showRecentTransactions: showRecent,
        showBranchBreakdown: showBranch,
        showBudgetHealth: showBudget,
        showProfitDistribution: true,
        compactMode
      }
    });

    setSavedSuccessMsg('Preferences saved and synchronized successfully!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handleSet2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) {
      setPinMsg('PIN must be at least 4 digits');
      return;
    }
    enable2FA(pinInput);
    setPinMsg('2FA PIN configured successfully!');
    setPinInput('');
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonText) return;

    const ok = await importDataJSON(jsonText);
    if (ok) {
      setImportStatus('Data successfully restored!');
      setJsonText('');
    } else {
      setImportStatus('Invalid JSON backup file format');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
            Settings & User Preferences
          </h2>
        </div>
        <p className="text-xs text-neutral-500">
          Customize application theme, localization, currency defaults, notification alerts, and security
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all mr-6 ${
            activeTab === 'preferences'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          General Preferences
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all mr-6 ${
            activeTab === 'security'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Profile & 2FA Security
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'backup'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Data Backup & Import
        </button>
      </div>

      {savedSuccessMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-100 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* PREFERENCES TAB */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSavePreferences} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme & Look */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Theme & Appearance</h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                    theme === 'light'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Sun className="h-5 w-5 mb-1 text-amber-500" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Moon className="h-5 w-5 mb-1 text-indigo-400" />
                  <span>Dark Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                    theme === 'system'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Settings className="h-5 w-5 mb-1 text-neutral-500" />
                  <span>System Default</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Default Landing View</label>
                <select
                  value={landingPage}
                  onChange={(e) => setLandingPage(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="dashboard">Executive Dashboard</option>
                  <option value="transactions">Transactions Ledger</option>
                  <option value="partnership">Partnership & Capital Hub</option>
                  <option value="profit_accounting">Profit & Dividend Accounting</option>
                  <option value="analytics">Advanced Financial Analytics</option>
                  <option value="categories">Custom Categories</option>
                </select>
              </div>
            </div>

            {/* Localization & Currency */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Localization & Base Currency</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Display Currency</label>
                  <select
                    value={prefCurrency}
                    onChange={(e) => setPrefCurrency(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="LKR">LKR (Rs. - Sri Lankan Rupee)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-22)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (22/07/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (07/22/2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Time Zone</label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Rules */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Notification Alert Settings</h3>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Budget Warning Alerts (&gt;80% Limit)</span>
                  <input
                    type="checkbox"
                    checked={notifBudget}
                    onChange={(e) => setNotifBudget(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Partner Drawing & Withdrawal Alerts</span>
                  <input
                    type="checkbox"
                    checked={notifWithdrawal}
                    onChange={(e) => setNotifWithdrawal(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">High-Value Transaction Alerts (&gt;$5,000)</span>
                  <input
                    type="checkbox"
                    checked={notifHighValue}
                    onChange={(e) => setNotifHighValue(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Monthly Financial Statement Reminders</span>
                  <input
                    type="checkbox"
                    checked={notifMonthly}
                    onChange={(e) => setNotifMonthly(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>

            {/* Dashboard Layout Preferences */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Dashboard Layout & Density</h3>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Show Quick KPI Summary Cards</span>
                  <input
                    type="checkbox"
                    checked={showStats}
                    onChange={(e) => setShowStats(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Show Recent Activity Timeline</span>
                  <input
                    type="checkbox"
                    checked={showRecent}
                    onChange={(e) => setShowRecent(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Show Branch Performance Breakdown</span>
                  <input
                    type="checkbox"
                    checked={showBranch}
                    onChange={(e) => setShowBranch(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Show Monthly Budget Health Monitor</span>
                  <input
                    type="checkbox"
                    checked={showBudget}
                    onChange={(e) => setShowBudget(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer">
                  <span className="text-xs font-semibold dark:text-neutral-300">Compact Table Mode (Higher Row Density)</span>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save & Apply Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Profile Info */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Current User Profile</h3>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 space-y-3 text-xs">
              <div>
                <p className="text-neutral-400">Display Name</p>
                <p className="font-bold text-neutral-900 dark:text-white text-sm">{currentUser.displayName}</p>
              </div>
              <div>
                <p className="text-neutral-400">Email Address</p>
                <p className="font-bold text-neutral-900 dark:text-white">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-neutral-400">System Access Role</p>
                <span className="inline-block uppercase font-black text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full mt-1">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* 2FA Section */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Two-Factor Security PIN (2FA)
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Require a security PIN when withdrawing partner capital or modifying equity allocations.
            </p>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-xs">
              <p className="font-bold text-neutral-800 dark:text-neutral-200">
                Status: {currentUser.twoFactorEnabled ? '2FA Enabled & Active' : '2FA Disabled'}
              </p>
              <p className="text-neutral-500 text-[11px]">Default Security PIN: 1234</p>
            </div>

            <form onSubmit={handleSet2FA} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-neutral-300">Configure Security PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Enter 4-6 digit PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              {pinMsg && <p className="text-xs font-bold text-emerald-600">{pinMsg}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Update Security PIN
                </button>
                {currentUser.twoFactorEnabled && (
                  <button
                    type="button"
                    onClick={disable2FA}
                    className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    Disable 2FA
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BACKUP TAB */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Export Database Snapshot</h3>
            </div>
            <p className="text-xs text-neutral-500">
              Download complete transaction ledgers, partner equity records, custom categories, and budgets in JSON format.
            </p>

            <button
              onClick={exportDataJSON}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Complete JSON Backup</span>
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Restore Database</h3>
            </div>
            <p className="text-xs text-neutral-500">
              Paste previously exported JSON backup data to restore financial state.
            </p>

            <form onSubmit={handleImport} className="space-y-3">
              <textarea
                rows={4}
                placeholder="Paste JSON backup file content here..."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white p-2.5 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
              {importStatus && <p className="text-xs font-bold text-emerald-600">{importStatus}</p>}
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2 text-xs font-bold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <Upload className="h-4 w-4" />
                <span>Restore Database</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
