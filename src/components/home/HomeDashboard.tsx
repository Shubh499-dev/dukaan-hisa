import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  CreditCard,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Receipt,
  Users,
  ChevronRight,
  Sparkles,
  Wallet,
  Clock,
} from 'lucide-react';
import { AdBanner } from '../common/AdBanner';

export const HomeDashboard: React.FC = () => {
  const { metrics, sales, expenses, transactions, openQuickModal, setActiveTab, setSelectedCustomerId, t, lang } =
    useApp();

  // Combine latest activities
  const recentActivities = [
    ...sales.map((s) => ({
      id: s.id,
      title: `बिक्री: ${s.items.map((i) => i.productName).join(', ')}`,
      subtitle: s.customerName ? `ग्राहक: ${s.customerName}` : s.paymentMethod.toUpperCase(),
      amount: s.totalAmount,
      type: 'sale' as const,
      timestamp: s.createdAt,
      date: s.date,
      paymentMethod: s.paymentMethod,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      title: `खर्च: ${t(`cat${e.category.charAt(0).toUpperCase() + e.category.slice(1)}` as any) || e.category}`,
      subtitle: e.note || e.paymentMethod.toUpperCase(),
      amount: e.amount,
      type: 'expense' as const,
      timestamp: e.createdAt,
      date: e.date,
      paymentMethod: e.paymentMethod,
    })),
    ...transactions.map((txn) => ({
      id: txn.id,
      title: txn.type === 'udhar_given' ? `उधार दिया: ${txn.customerName}` : `पेमेंट मिली: ${txn.customerName}`,
      subtitle: txn.note || (txn.type === 'udhar_given' ? 'उधार खाता' : 'जमा खाता'),
      amount: txn.amount,
      type: txn.type === 'udhar_given' ? ('udhar' as const) : ('payment' as const),
      timestamp: txn.createdAt,
      date: txn.date,
      paymentMethod: txn.paymentMethod,
      customerId: txn.customerId,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 7);

  return (
    <div className="pb-24 pt-2 px-3 sm:px-6 max-w-5xl mx-auto space-y-4">
      {/* 1. Low Stock Warning Alert if any */}
      {metrics.lowStockCount > 0 && (
        <div
          onClick={() => setActiveTab('stock')}
          className="cursor-pointer bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-l-4 border-amber-500 rounded-xl p-3.5 flex items-center justify-between gap-3 text-amber-950 dark:text-amber-200 bg-white dark:bg-slate-900 shadow-sm hover:shadow transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold truncate">
                {metrics.lowStockCount} सामान का स्टॉक कम है (Low Stock Alert)
              </h4>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 truncate">
                {metrics.lowStockProducts.map((p) => `${p.name} (${p.stockQuantity})`).join(', ')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 shrink-0">
            {t('viewLowStock')}
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      )}

      {/* 2. Today's Core Highlights Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
              {t('todaySummary')} ({formatDate(new Date().toISOString(), lang)})
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            लाइव हिसाब
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Sales */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-2.5 sm:p-3 text-center sm:text-left">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 block truncate">
              {t('todaySales')}
            </span>
            <div className="text-base sm:text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1 truncate">
              {formatCurrency(metrics.todaySales)}
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 rounded-xl p-2.5 sm:p-3 text-center sm:text-left">
            <span className="text-[11px] sm:text-xs font-bold text-rose-700 dark:text-rose-400 block truncate">
              {t('todayExpense')}
            </span>
            <div className="text-base sm:text-2xl font-black text-rose-950 dark:text-rose-100 mt-1 truncate">
              {formatCurrency(metrics.todayExpenses)}
            </div>
          </div>

          {/* Profit */}
          <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 rounded-xl p-2.5 sm:p-3 text-center sm:text-left">
            <span className="text-[11px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 block truncate">
              {t('todayProfit')}
            </span>
            <div className="text-base sm:text-2xl font-black text-blue-950 dark:text-blue-100 mt-1 truncate">
              {metrics.todayProfit >= 0 ? `+` : ''}
              {formatCurrency(metrics.todayProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOUR LARGE QUICK ACTION BUTTONS (Section 4 Requirement) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 mb-2">
          {t('quickActions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* + बिक्री */}
          <button
            onClick={() => openQuickModal('sale')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-base shadow-md shadow-emerald-700/20 active:scale-95 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold block leading-tight">{t('addSale')}</span>
              <span className="text-[11px] font-normal text-emerald-100 block">Record Sale</span>
            </div>
          </button>

          {/* + खर्च */}
          <button
            onClick={() => openQuickModal('expense')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-base shadow-md shadow-rose-700/20 active:scale-95 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold block leading-tight">{t('addExpense')}</span>
              <span className="text-[11px] font-normal text-rose-100 block">Record Expense</span>
            </div>
          </button>

          {/* + उधार */}
          <button
            onClick={() => openQuickModal('udhar')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-base shadow-md shadow-amber-700/20 active:scale-95 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold block leading-tight">{t('addUdhar')}</span>
              <span className="text-[11px] font-normal text-amber-100 block">Give Credit</span>
            </div>
          </button>

          {/* + Payment (जमा) */}
          <button
            onClick={() => openQuickModal('payment')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-base shadow-md shadow-blue-700/20 active:scale-95 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold block leading-tight">{t('addPayment')}</span>
              <span className="text-[11px] font-normal text-blue-100 block">Receive Cash/UPI</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Financial Status & Udhar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Udhar to Receive */}
        <div
          onClick={() => setActiveTab('khata')}
          className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('totalReceivable')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {formatCurrency(metrics.totalUdharReceivable)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>खाता बही खोलें</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {/* Cash Balance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('cashBalance')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {formatCurrency(metrics.cashBalance)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">गल्ले में नकद राशि</span>
        </div>

        {/* UPI Balance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('upiBalance')}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {formatCurrency(metrics.upiBalance)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">बैंक / क्यूआर कोड</span>
        </div>

        {/* Stock Valuation */}
        <div
          onClick={() => setActiveTab('stock')}
          className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('stockValue')}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-300 mt-2">
            {formatCurrency(metrics.totalStockValue)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>स्टॉक सूची देखें</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {/* Ad Banner (Modular & non-intrusive) */}
      <AdBanner placement="inline" />

      {/* 5. Recent Transactions Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {t('recentTransactions')}
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            कुल: {recentActivities.length}
          </span>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
            {t('noTransactionsYet')}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => {
                  if (act.customerId) {
                    setSelectedCustomerId(act.customerId);
                    setActiveTab('khata');
                  }
                }}
                className={`py-3 flex items-center justify-between gap-3 ${
                  act.customerId ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl px-2 -mx-2' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      act.type === 'sale'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                        : act.type === 'expense'
                        ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'
                        : act.type === 'udhar'
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {act.type === 'sale' && <ShoppingCart className="w-4 h-4" />}
                    {act.type === 'expense' && <Receipt className="w-4 h-4" />}
                    {act.type === 'udhar' && <ArrowUpRight className="w-4 h-4" />}
                    {act.type === 'payment' && <ArrowDownLeft className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {act.subtitle} • {formatDateTime(act.timestamp, lang)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xs sm:text-sm font-black ${
                      act.type === 'sale' || act.type === 'payment'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : act.type === 'expense'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {act.type === 'sale' || act.type === 'payment' ? '+' : '-'}
                    {formatCurrency(act.amount)}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    {act.paymentMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
