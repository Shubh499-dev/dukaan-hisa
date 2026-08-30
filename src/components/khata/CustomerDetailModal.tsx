import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerTransaction } from '../../types';
import { formatCurrency, formatDate, formatDateTime, generateWhatsAppLink } from '../../utils/formatters';
import {
  X,
  Phone,
  MessageCircle,
  Share2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  AlertCircle,
  Clock,
  Send,
  FileText,
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, onClose }) => {
  const {
    transactions,
    addCustomerTransaction,
    deleteCustomerTransaction,
    deleteCustomer,
    shopProfile,
    t,
    lang,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ledger' | 'reminder'>('ledger');
  const [showUdharForm, setShowUdharForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('cash');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter transactions for this customer
  const customerTxns = transactions.filter((t) => t.customerId === customer.id);

  // Auto-generate professional Hindi WhatsApp Reminder message (Section 6 Requirement)
  const defaultReminderMessage =
    customer.currentBalance > 0
      ? `नमस्ते ${customer.name} जी, आपकी दुकान "${shopProfile.name || 'दुकान'}" में ₹${customer.currentBalance.toLocaleString('en-IN')} बाकी हैं। कृपया सुविधानुसार भुगतान कर दें। धन्यवाद।`
      : `नमस्ते ${customer.name} जी, आपकी दुकान "${shopProfile.name || 'दुकान'}" का हिसाब चुकता है। धन्यवाद।`;

  const [customReminderMsg, setCustomReminderMsg] = useState(defaultReminderMessage);

  const handleAddUdhar = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val <= 0) {
      showToast('कृपया सही राशि दर्ज करें', undefined, 'error');
      return;
    }

    addCustomerTransaction({
      customerId: customer.id,
      customerName: customer.name,
      type: 'udhar_given',
      amount: val,
      note: note.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });

    setAmount('');
    setNote('');
    setShowUdharForm(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val <= 0) {
      showToast('कृपया सही राशि दर्ज करें', undefined, 'error');
      return;
    }

    addCustomerTransaction({
      customerId: customer.id,
      customerName: customer.name,
      type: 'payment_received',
      amount: val,
      paymentMethod: paymentMode,
      note: note.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });

    setAmount('');
    setNote('');
    setShowPaymentForm(false);
  };

  const handleDeleteCust = () => {
    deleteCustomer(customer.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleSendWhatsApp = () => {
    if (!customer.mobile) {
      showToast('ग्राहक का मोबाइल नंबर मौजूद नहीं है', undefined, 'error');
      return;
    }
    const link = generateWhatsAppLink(customer.mobile, customReminderMsg);
    window.open(link, '_blank');
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `खाता विवरण - ${customer.name}`,
          text: customReminderMsg,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(customReminderMsg);
      showToast('मैसेज कॉपी हो गया है!', undefined, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg shrink-0 border border-amber-500/30">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                {customer.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {customer.mobile ? `📞 ${customer.mobile}` : 'कोई फोन नंबर नहीं'} {customer.address ? `• 📍 ${customer.address}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {customer.mobile && (
              <a
                href={`tel:${customer.mobile}`}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                title={t('callCustomer')}
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title={t('deleteCustomer')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance Highlight Banner */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-300 block">
              {customer.currentBalance > 0
                ? t('youWillGet')
                : customer.currentBalance < 0
                ? t('youWillGive')
                : t('zeroBalance')}
            </span>
            <div
              className={`text-2xl sm:text-3xl font-black mt-0.5 ${
                customer.currentBalance > 0
                  ? 'text-amber-400'
                  : customer.currentBalance < 0
                  ? 'text-emerald-400'
                  : 'text-slate-200'
              }`}
            >
              {formatCurrency(Math.abs(customer.currentBalance))}
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ledger'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              खाता इतिहास
            </button>
            <button
              onClick={() => setActiveTab('reminder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'reminder'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>तकादा (Reminder)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons for Giving Udhar / Receiving Payment */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setShowUdharForm(true);
              setShowPaymentForm(false);
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t('giveUdhar')}</span>
          </button>
          <button
            onClick={() => {
              setShowPaymentForm(true);
              setShowUdharForm(false);
            }}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{t('receivePayment')}</span>
          </button>
        </div>

        {/* Inline Udhar Form */}
        {showUdharForm && (
          <form onSubmit={handleAddUdhar} className="p-4 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                + नया उधार दर्ज करें ({customer.name})
              </h4>
              <button
                type="button"
                onClick={() => setShowUdharForm(false)}
                className="text-amber-800 dark:text-amber-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="number"
                required
                autoFocus
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="राशि (₹) *"
                className="w-full px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="सामान / विवरण (उदा. राशन सामान)"
                className="w-full px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all"
            >
              उधार सेव करें
            </button>
          </form>
        )}

        {/* Inline Payment Form */}
        {showPaymentForm && (
          <form onSubmit={handleAddPayment} className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                + पेमेंट जमा दर्ज करें ({customer.name})
              </h4>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="text-emerald-800 dark:text-emerald-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="number"
                required
                autoFocus
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="जमा राशि (₹) *"
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                    paymentMode === 'cash'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  नकद (Cash)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                    paymentMode === 'upi'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  UPI
                </button>
              </div>
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="नोट (उदा. GPay से मिला)"
              className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all"
            >
              पेमेंट जमा सेव करें
            </button>
          </form>
        )}

        {/* Tab 1: Ledger Statement */}
        {activeTab === 'ledger' && (
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('history')} ({customerTxns.length} प्रविष्टियां)
              </h4>
              {customer.openingBalance !== 0 && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Opening: {formatCurrency(customer.openingBalance)}
                </span>
              )}
            </div>

            {customerTxns.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
                इस ग्राहक का कोई लेन-देन इतिहास नहीं है। ऊपर दिए गए बटन से उधार या पेमेंट दर्ज करें।
              </div>
            ) : (
              <div className="space-y-2">
                {customerTxns.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          txn.type === 'udhar_given'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {txn.type === 'udhar_given' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {txn.type === 'udhar_given' ? 'उधार दिया' : 'पेमेंट मिली'}
                          </span>
                          {txn.paymentMethod && (
                            <span className="text-[10px] uppercase font-semibold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                              {txn.paymentMethod}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {txn.note || 'कोई नोट नहीं'} • {formatDate(txn.date || txn.createdAt, lang)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className={`text-sm font-black ${
                          txn.type === 'udhar_given'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {txn.type === 'udhar_given' ? '+' : '-'}
                        {formatCurrency(txn.amount)}
                      </div>
                      <button
                        onClick={() => deleteCustomerTransaction(txn.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        title="हटाएं"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: WhatsApp Reminder Generator (Section 6 Requirement) */}
        {activeTab === 'reminder' && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                व्हाट्सएप तकादा मैसेज (Payment Reminder)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ग्राहक को बिना किसी API के सीधे व्हाट्सएप से पेमेंट रिमाइंडर भेजें
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                मैसेज टेक्स्ट:
              </label>
              <textarea
                rows={4}
                value={customReminderMsg}
                onChange={(e) => setCustomReminderMsg(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>सीधे WhatsApp पर भेजें</span>
              </button>

              <button
                type="button"
                onClick={handleShareNative}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-98"
              >
                <Share2 className="w-4 h-4" />
                <span>शेयर / कॉपी करें</span>
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title={t('deleteConfirmTitle')}
          description={t('deleteConfirmDesc')}
          confirmLabel={t('delete')}
          onConfirm={handleDeleteCust}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </div>
  );
};
