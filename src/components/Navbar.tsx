import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance, EXCHANGE_RATES } from '../context/FinanceContext';
import { CurrencyCode, UserRole } from '../types';
import {
  Building2,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  TrendingUp
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, partners, switchUserRole, isDarkMode, toggleDarkMode } = useAuth();
  const {
    currency,
    setCurrency,
    selectedBranchId,
    setSelectedBranchId,
    branches,
    notifications,
    markNotificationAsRead
  } = useFinance();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 sm:px-6">
      {/* Brand & Branch Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20 text-white">
            <TrendingUp className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
              Beyond<span className="text-emerald-600 dark:text-emerald-400">Finance</span>
            </h1>
            <p className="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:block">
              Partnership & Real-Time ERP
            </p>
          </div>
        </div>

        {/* Branch Selector Dropdown */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-1.5 dark:border-neutral-800 dark:bg-neutral-800/80">
          <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-neutral-800 outline-none dark:text-neutral-200 cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="dark:bg-neutral-900 dark:text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher */}
        <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 dark:border-neutral-800 dark:bg-neutral-800">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-transparent text-xs font-bold text-neutral-800 outline-none dark:text-neutral-200 cursor-pointer"
          >
            {Object.keys(EXCHANGE_RATES).map((code) => (
              <option key={code} value={code} className="dark:bg-neutral-900 dark:text-white">
                {code} ({EXCHANGE_RATES[code as CurrencyCode].symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          title="Toggle Dark / Light Mode"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Real-Time Activity Feed
                </h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="mt-3 max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-neutral-500">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`flex gap-3 py-3 px-2 rounded-xl transition-colors cursor-pointer ${
                        n.read ? 'opacity-60' : 'bg-emerald-50/50 dark:bg-emerald-950/20'
                      }`}
                    >
                      <div className="mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{n.title}</p>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User & Role Switcher Popover */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-1.5 text-left hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
              {currentUser.displayName.charAt(0)}
            </div>
            <div className="hidden text-xs sm:block">
              <p className="font-semibold leading-none text-neutral-900 dark:text-white">
                {currentUser.displayName}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 z-50">
              <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-bold text-neutral-900 dark:text-white">{currentUser.displayName}</p>
                <p className="text-[11px] text-neutral-500">{currentUser.email}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>2FA Security Active</span>
                </div>
              </div>

              <div className="mt-2">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Switch Active Partner Role (Demo)
                </p>
                {partners.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchUserRole(p.id);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                      p.id === currentUser.partnerId
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">{p.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
