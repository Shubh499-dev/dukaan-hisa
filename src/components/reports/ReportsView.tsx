import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  PieChart,
  Users,
  Package,
  ArrowUpRight,
  Printer,
  Sparkles,
} from 'lucide-react';
import { AdBanner } from '../common/AdBanner';

export const ReportsView: React.FC = () => {
  const { sales, expenses, customers, products, metrics, t, lang, showToast } = useApp();

  const [dateRange, setDateRange] = useState<'today' | 'this_month' | 'all'>('this_month');

  // Filter datasets based on selected range
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filteredSales = sales.filter((s) => {
    if (dateRange === 'today') return s.date === todayStr;
    if (dateRange === 'this_month') return s.date.startsWith(currentMonthStr);
    return true;
  });

  const filteredExpenses = expenses.filter((e) => {
    if (dateRange === 'today') return e.date === todayStr;
    if (dateRange === 'this_month') return e.date.startsWith(currentMonthStr);
    return true;
  });

  // Calculate totals
  const totalSalesVal = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalExpenseVal = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  // COGS for filtered sales
  const totalCostVal = filteredSales.reduce((acc, s) => {
    return (
      acc +
      s.items.reduce((itAcc, item) => {
        const prod = products.find((p) => p.id === item.productId);
        return itAcc + (prod ? prod.purchasePrice * item.quantity : 0);
      }, 0)
    );
  }, 0);

  const grossProfit = totalSalesVal - totalCostVal;
  const netProfit = grossProfit - totalExpenseVal;

  // Expense by category breakdown
  const expenseByCategory: Record<string, number> = {};
  filteredExpenses.forEach((e) => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });

  // Top products sold
  const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  filteredSales.forEach((s) => {
    s.items.forEach((it) => {
      if (!productSalesMap[it.productName]) {
        productSalesMap[it.productName] = { name: it.productName, quantity: 0, revenue: 0 };
      }
      productSalesMap[it.productName].quantity += it.quantity;
      productSalesMap[it.productName].revenue += it.total;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // CSV Export
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Date,Title/Item,Customer,Payment,Amount\n';

    filteredSales.forEach((s) => {
      csvContent += `Sale,${s.date},"${s.items.map((i) => i.productName).join('; ')}",${
        s.customerName || 'Cash'
      },${s.paymentMethod},${s.totalAmount}\n`;
    });

    filteredExpenses.forEach((e) => {
      csvContent += `Expense,${e.date},${e.category},,"${e.note || ''}",${e.paymentMethod},${e.amount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dukaan_Hisab_Report_${dateRange}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('रिपोर्ट CSV फाइल डाउनलोड हो गई है!', undefined, 'success');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-6 max-w-5xl mx-auto space-y-4">
      {/* 1. Filter Range & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dateRange === 'today'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            आज (Today)
          </button>
          <button
            onClick={() => setDateRange('this_month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dateRange === 'this_month'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            इस महीने (This Month)
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dateRange === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            पूरा हिसाब (All Time)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="py-2 px-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV डाउनलोड</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="प्रिंट"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Profit & Loss Summary Card (Section 12 Requirement) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base sm:text-lg">
              {t('reportProfitLoss')} ({dateRange === 'today' ? 'आज' : dateRange === 'this_month' ? 'इस माह' : 'कुल'})
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            शुद्ध लाभ गणना
          </span>
        </div>

        {/* Formula breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block font-bold">1. कुल बिक्री (+)</span>
            <span className="text-base sm:text-xl font-black text-emerald-400 mt-1 block">
              {formatCurrency(totalSalesVal)}
            </span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block font-bold">2. माल लागत (-)</span>
            <span className="text-base sm:text-xl font-black text-amber-400 mt-1 block">
              {formatCurrency(totalCostVal)}
            </span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block font-bold">3. दुकान खर्च (-)</span>
            <span className="text-base sm:text-xl font-black text-rose-400 mt-1 block">
              {formatCurrency(totalExpenseVal)}
            </span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[11px] text-slate-400 block font-bold">= शुद्ध मुनाफा</span>
            <span
              className={`text-base sm:text-xl font-black mt-1 block ${
                netProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {netProfit >= 0 ? '+' : ''}
              {formatCurrency(netProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Expense Breakdown & Top Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expense by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-600" />
            <span>{t('reportExpenseCategory')}</span>
          </h3>

          {Object.keys(expenseByCategory).length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">कोई खर्च दर्ज नहीं है</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(expenseByCategory).map(([cat, amt]) => {
                const pct = totalExpenseVal > 0 ? (amt / totalExpenseVal) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="capitalize text-slate-700 dark:text-slate-300">
                        {t(`cat${cat.charAt(0).toUpperCase() + cat.slice(1)}` as any) || cat}
                      </span>
                      <span className="text-slate-900 dark:text-white">{formatCurrency(amt)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>{t('bestSellingProducts')}</span>
          </h3>

          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">अभी तक कोई बिक्री दर्ज नहीं है</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topProducts.map((p, idx) => (
                <div key={p.name} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                      {idx + 1}
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{p.name}</strong>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(p.revenue)}
                    </span>
                    <span className="text-[11px] text-slate-400 block">{p.quantity} बिके</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AdBanner placement="inline" />
    </div>
  );
};
