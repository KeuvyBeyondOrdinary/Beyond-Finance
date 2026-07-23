import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Bot,
  Sparkles,
  Send,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  BrainCircuit,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const AIAdvisorView: React.FC = () => {
  const { aiAdvice, isAILoading, fetchAIAdvice } = useFinance();
  const [promptInput, setPromptInput] = useState('');

  useEffect(() => {
    if (!aiAdvice) {
      fetchAIAdvice();
    }
  }, []);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    fetchAIAdvice(promptInput.trim());
    setPromptInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
                Beyond AI Financial Advisor
              </h2>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Gemini AI Engine
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Automated savings recommendations, cost reduction strategies, and predictive cash flow forecasts
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Bar */}
      <form onSubmit={handleAskAI} className="relative flex items-center">
        <input
          type="text"
          placeholder="Ask Beyond AI e.g. 'How can Hatton branch reduce utility overhead by 15%?' or 'Analyze Q3 profitability'..."
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          disabled={isAILoading}
          className="w-full rounded-2xl border border-neutral-300 bg-white py-3.5 pl-4 pr-28 text-xs text-neutral-900 shadow-md outline-none focus:border-purple-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={isAILoading || !promptInput.trim()}
          className="absolute right-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {isAILoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Ask AI</span>
            </>
          )}
        </button>
      </form>

      {/* AI Advisory Content */}
      {isAILoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          <p className="mt-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">
            Analyzing transaction ledgers and generating financial strategy...
          </p>
        </div>
      ) : aiAdvice ? (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/50 via-indigo-50/50 to-white p-6 dark:border-purple-900/50 dark:bg-neutral-900">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Monthly Financial Summary & Executive Audit
              </h3>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed dark:text-neutral-300">
              {aiAdvice.financialSummary}
            </p>
            {aiAdvice.answer && (
              <div className="mt-4 p-3 rounded-xl bg-white/80 dark:bg-neutral-800/80 border border-purple-100 dark:border-purple-900/30">
                <p className="text-[11px] font-bold text-purple-700 dark:text-purple-300 mb-1">Direct Answer / Strategy:</p>
                <p className="text-xs text-neutral-800 dark:text-neutral-200">{aiAdvice.answer}</p>
              </div>
            )}
          </div>

          {/* 3 Grid Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Saving Suggestions */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <PiggyBank className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Saving Suggestions</h4>
              </div>
              <ul className="space-y-3">
                {aiAdvice.savingSuggestions?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expense Reduction Recommendations */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Expense Reduction Tips</h4>
              </div>
              <ul className="space-y-3">
                {aiAdvice.expenseReductions?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Future Predictions */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Future Expense Predictions</h4>
              </div>
              <ul className="space-y-3">
                {aiAdvice.futurePredictions?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
