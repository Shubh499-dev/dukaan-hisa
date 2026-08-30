import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatCurrency, generateWhatsAppLink } from '../../utils/formatters';
import {
  Users,
  Search,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Phone,
  MessageCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CustomerDetailModal } from './CustomerDetailModal';
import { AdBanner } from '../common/AdBanner';

export const KhataView: React.FC = () => {
  const { customers, openQuickModal, selectedCustomerId, setSelectedCustomerId, shopProfile, t, lang } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'receive' | 'give' | 'settled'>('all');

  // Active customer modal target
  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || null;

  // Filter calculations
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.mobile?.includes(searchQuery) ||
      cust.address?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'receive') return cust.currentBalance > 0;
    if (filterTab === 'give') return cust.currentBalance < 0;
    if (filterTab === 'settled') return cust.currentBalance === 0;
    return true;
  });

  const totalReceivable = customers
    .filter((c) => c.currentBalance > 0)
    .reduce((acc, c) => acc + c.currentBalance, 0);

  const totalPayable = customers
    .filter((c) => c.currentBalance < 0)
    .reduce((acc, c) => acc + Math.abs(c.currentBalance), 0);

  const handleQuickWhatsApp = (e: React.MouseEvent, cust: Customer) => {
    e.stopPropagation();
    if (!cust.mobile) return;
    const msg = `नमस्ते ${cust.name} जी, आपकी दुकान "${shopProfile.name || 'दुकान'}" में ₹${cust.currentBalance.toLocaleString('en-IN')} बाकी हैं। कृपया सुविधानुसार भुगतान कर दें। धन्यवाद।`;
    window.open(generateWhatsAppLink(cust.mobile, msg), '_blank');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-6 max-w-5xl mx-auto space-y-4">
      {/* 1. Header Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total to receive */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 rounded-2xl p-4 border border-amber-200 dark:border-amber-900/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              {t('totalReceivable')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-200 mt-1.5">
            {formatCurrency(totalReceivable)}
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 block">
            {customers.filter((c) => c.currentBalance > 0).length} ग्राहकों से लेना है
          </span>
        </div>

        {/* Total to pay */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-950/40 dark:to-emerald-900/30 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-900/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {t('totalPayable')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1.5">
            {formatCurrency(totalPayable)}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 block">
            {customers.filter((c) => c.currentBalance < 0).length} ग्राहकों को देना है
          </span>
        </div>
      </div>

      {/* 2. Search & Add Customer Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchCustomer')}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-medium shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <button
          onClick={() => openQuickModal('customer')}
          className="py-2.5 px-3 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">{t('addNewCustomer')}</span>
          <span className="sm:hidden">+ ग्राहक</span>
        </button>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'all', label: `${t('allCustomers')} (${customers.length})` },
            { id: 'receive', label: `लेना बाकी (${customers.filter((c) => c.currentBalance > 0).length})` },
            { id: 'give', label: `देना बाकी (${customers.filter((c) => c.currentBalance < 0).length})` },
            { id: 'settled', label: `चुकता (${customers.filter((c) => c.currentBalance === 0).length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              filterTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Customer List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {searchQuery ? 'कोई ग्राहक नहीं मिला' : 'अभी तक कोई खाता नहीं जोड़ा गया है।'}
            </p>
            <button
              onClick={() => openQuickModal('customer')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('addNewCustomer')}</span>
            </button>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomerId(cust.id)}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                    cust.currentBalance > 0
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                      : cust.currentBalance < 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cust.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {cust.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {cust.mobile ? `📞 ${cust.mobile}` : 'कोई फोन नहीं'} {cust.address ? `• ${cust.address}` : ''}
                  </p>
                </div>
              </div>

              {/* Right: Balance & Quick Action */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div
                    className={`text-sm sm:text-base font-black ${
                      cust.currentBalance > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : cust.currentBalance < 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {formatCurrency(Math.abs(cust.currentBalance))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 dark:text-slate-500 block">
                    {cust.currentBalance > 0
                      ? 'लेना है'
                      : cust.currentBalance < 0
                      ? 'देना है'
                      : 'चुकता'}
                  </span>
                </div>

                {cust.currentBalance > 0 && cust.mobile && (
                  <button
                    onClick={(e) => handleQuickWhatsApp(e, cust)}
                    title="तकादा WhatsApp भेजें"
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}

                <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
              </div>
            </div>
          ))
        )}
      </div>

      <AdBanner placement="inline" />

      {/* Customer Detail & Statement Modal */}
      {activeCustomer && (
        <CustomerDetailModal
          customer={activeCustomer}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
};
