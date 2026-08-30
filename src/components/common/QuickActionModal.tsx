import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory, PaymentMethod, Product } from '../../types';
import {
  X,
  Plus,
  ShoppingCart,
  Receipt,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  Check,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const QuickActionModal: React.FC = () => {
  const {
    quickModal,
    quickModalPayload,
    closeQuickModal,
    customers,
    products,
    addSale,
    addExpense,
    addCustomer,
    addCustomerTransaction,
    addProduct,
    t,
    lang,
    showToast,
  } = useApp();

  // Common Form States
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    typeof quickModalPayload === 'string' ? quickModalPayload : ''
  );

  // Sale specific
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customItemName, setCustomItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [discount, setDiscount] = useState('0');

  // Expense specific
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('food');

  // Customer specific
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custOpening, setCustOpening] = useState('0');

  // Product specific
  const [prodName, setProdName] = useState('');
  const [prodPurchasePrice, setProdPurchasePrice] = useState('');
  const [prodSellingPrice, setProdSellingPrice] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodMinStock, setProdMinStock] = useState('3');
  const [prodUnit, setProdUnit] = useState('Pcs');
  const [prodCategory, setProdCategory] = useState('General');

  if (!quickModal) return null;

  // Handle product selection in sale modal
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (prodId === 'custom') {
      setCustomItemName('');
      setSellingPrice('');
      setPurchasePrice('');
    } else {
      const prod = products.find((p) => p.id === prodId);
      if (prod) {
        setCustomItemName(prod.name);
        setSellingPrice(String(prod.sellingPrice));
        setPurchasePrice(String(prod.purchasePrice));
      }
    }
  };

  // Submit Handlers
  const handleSaveSale = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity) || 1;
    const sPrice = Number(sellingPrice);
    const pPrice = Number(purchasePrice) || 0;
    const disc = Number(discount) || 0;

    if (!sPrice || sPrice <= 0) {
      showToast('कृपया सही बिक्री मूल्य दर्ज करें', undefined, 'error');
      return;
    }

    const itemName =
      selectedProductId && selectedProductId !== 'custom'
        ? products.find((p) => p.id === selectedProductId)?.name || 'सामान'
        : customItemName.trim() || 'खुला सामान';

    const subtotal = qty * sPrice;
    const totalAmount = Math.max(0, subtotal - disc);
    const totalCost = qty * pPrice;
    const profitAmount = totalAmount - totalCost;

    const matchedCust = customers.find((c) => c.id === selectedCustomerId);

    addSale({
      customerId: selectedCustomerId || undefined,
      customerName: matchedCust ? matchedCust.name : undefined,
      items: [
        {
          productId: selectedProductId !== 'custom' ? selectedProductId : undefined,
          productName: itemName,
          quantity: qty,
          purchasePrice: pPrice,
          sellingPrice: sPrice,
          total: subtotal,
        },
      ],
      subtotal,
      discount: disc,
      gstAmount: 0,
      totalAmount,
      costAmount: totalCost,
      profitAmount,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
    });

    closeQuickModal();
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expAmount = Number(amount);
    if (!expAmount || expAmount <= 0) {
      showToast('कृपया सही खर्च राशि दर्ज करें', undefined, 'error');
      return;
    }

    addExpense({
      amount: expAmount,
      category: expenseCategory,
      note: note.trim() || undefined,
      paymentMethod: paymentMethod === 'upi' ? 'upi' : 'cash',
      date: new Date().toISOString().split('T')[0],
    });

    closeQuickModal();
  };

  const handleSaveUdhar = (e: React.FormEvent) => {
    e.preventDefault();
    const udharAmount = Number(amount);
    if (!udharAmount || udharAmount <= 0) {
      showToast('कृपया सही उधार राशि दर्ज करें', undefined, 'error');
      return;
    }

    if (!selectedCustomerId) {
      showToast('कृपया ग्राहक चुनें', undefined, 'error');
      return;
    }

    const cust = customers.find((c) => c.id === selectedCustomerId);
    if (!cust) return;

    addCustomerTransaction({
      customerId: cust.id,
      customerName: cust.name,
      type: 'udhar_given',
      amount: udharAmount,
      note: note.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });

    closeQuickModal();
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      showToast('कृपया सही पेमेंट राशि दर्ज करें', undefined, 'error');
      return;
    }

    if (!selectedCustomerId) {
      showToast('कृपया ग्राहक चुनें', undefined, 'error');
      return;
    }

    const cust = customers.find((c) => c.id === selectedCustomerId);
    if (!cust) return;

    addCustomerTransaction({
      customerId: cust.id,
      customerName: cust.name,
      type: 'payment_received',
      amount: payAmount,
      paymentMethod: paymentMethod === 'upi' ? 'upi' : 'cash',
      note: note.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });

    closeQuickModal();
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      showToast(t('nameRequired'), undefined, 'error');
      return;
    }

    addCustomer({
      name: custName.trim(),
      mobile: custMobile.trim(),
      address: custAddress.trim() || undefined,
      notes: note.trim() || undefined,
      openingBalance: Number(custOpening) || 0,
    });

    closeQuickModal();
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast(t('nameRequired'), undefined, 'error');
      return;
    }
    const sPrice = Number(prodSellingPrice) || 0;
    const pPrice = Number(prodPurchasePrice) || 0;

    addProduct({
      name: prodName.trim(),
      sellingPrice: sPrice,
      purchasePrice: pPrice,
      stockQuantity: Number(prodStock) || 0,
      minStockLevel: Number(prodMinStock) || 3,
      unit: prodUnit || 'Pcs',
      category: prodCategory || 'General',
    });

    closeQuickModal();
  };

  const expenseCategories: { id: ExpenseCategory; label: string }[] = [
    { id: 'food', label: t('catFood') },
    { id: 'transport', label: t('catTransport') },
    { id: 'electricity', label: t('catElectricity') },
    { id: 'rent', label: t('catRent') },
    { id: 'salary', label: t('catSalary') },
    { id: 'purchase', label: t('catPurchase') },
    { id: 'maintenance', label: t('catMaintenance') },
    { id: 'other', label: t('catOther') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {quickModal === 'sale' && <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {quickModal === 'expense' && <Receipt className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            {quickModal === 'udhar' && <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            {quickModal === 'payment' && <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {quickModal === 'customer' && <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            {quickModal === 'product' && <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />}

            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {quickModal === 'sale' && t('salesTitle')}
              {quickModal === 'expense' && t('expenseTitle')}
              {quickModal === 'udhar' && '+ नया उधार दें'}
              {quickModal === 'payment' && '+ पेमेंट प्राप्त करें (जमा)'}
              {quickModal === 'customer' && t('addNewCustomer')}
              {quickModal === 'product' && t('addNewProduct')}
            </h3>
          </div>

          <button
            onClick={closeQuickModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {/* SALE FORM */}
          {quickModal === 'sale' && (
            <form onSubmit={handleSaveSale} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('selectProduct')}
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="">-- सामान चुनें (Select Product) --</option>
                  <option value="custom">✍️ {t('customItem')}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (स्टॉक: {p.stockQuantity} {p.unit}) - ₹{p.sellingPrice}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedProductId === 'custom' || !selectedProductId) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('productName')}
                  </label>
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="उदा. खुला राशन / कोल्ड ड्रिंक / पान"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('quantity')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('sellingPrice')} (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('purchasePrice')} (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('discount')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('paymentMethod')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['cash', 'upi', 'udhar'] as PaymentMethod[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        paymentMethod === mode
                          ? mode === 'cash'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : mode === 'upi'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mode === 'cash' && t('cash')}
                      {mode === 'upi' && t('upi')}
                      {mode === 'udhar' && t('udhar')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('selectCustomer')} {paymentMethod === 'udhar' && <span className="text-rose-500">*</span>}
                </label>
                <select
                  value={selectedCustomerId}
                  required={paymentMethod === 'udhar'}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="">{t('walkInCustomer')}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile || 'No mobile'}) - बकाया: ₹{c.currentBalance}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bill & Profit Total Preview Card */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    {t('totalBillAmount')}:
                  </span>
                  <div className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                    {formatCurrency(
                      Math.max(0, (Number(quantity) || 1) * (Number(sellingPrice) || 0) - (Number(discount) || 0))
                    )}
                  </div>
                </div>
                {Number(purchasePrice) > 0 && (
                  <div className="text-right">
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {t('estimatedProfit')}:
                    </span>
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      +{formatCurrency(
                        Math.max(
                          0,
                          (Number(quantity) || 1) * (Number(sellingPrice) || 0) - (Number(discount) || 0)
                        ) - (Number(quantity) || 1) * (Number(purchasePrice) || 0)
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                {t('saveSale')}
              </button>
            </form>
          )}

          {/* EXPENSE FORM */}
          {quickModal === 'expense' && (
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('enterAmount')} *
                </label>
                <input
                  type="number"
                  required
                  autoFocus
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹ 0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('expenseCategory')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {expenseCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setExpenseCategory(cat.id)}
                      className={`p-2 rounded-xl border text-xs font-medium text-center transition-all ${
                        expenseCategory === cat.id
                          ? 'bg-rose-600 text-white border-rose-600 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('reasonNote')}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="उदा. चाय नाश्ता / बिजली का बिल"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('paidVia')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['cash', 'upi'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === mode
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mode === 'cash' ? t('cash') : t('upi')}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                {t('saveExpense')}
              </button>
            </form>
          )}

          {/* UDHAR FORM */}
          {quickModal === 'udhar' && (
            <form onSubmit={handleSaveUdhar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('customerName')} *
                </label>
                <select
                  value={selectedCustomerId}
                  required
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="">-- ग्राहक चुनें (Select Customer) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.mobile ? `(${c.mobile})` : ''} - बकाया: ₹{c.currentBalance}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('enterAmount')} (उधार दिया) *
                </label>
                <input
                  type="number"
                  required
                  autoFocus
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹ 0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-2xl text-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('reasonNote')}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="उदा. राशन सामान / तेल, आटा, बिस्कुट"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                + उधार खाते में जोड़ें
              </button>
            </form>
          )}

          {/* PAYMENT RECEIVED FORM */}
          {quickModal === 'payment' && (
            <form onSubmit={handleSavePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('customerName')} *
                </label>
                <select
                  value={selectedCustomerId}
                  required
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="">-- ग्राहक चुनें (Select Customer) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.mobile ? `(${c.mobile})` : ''} - बकाया: ₹{c.currentBalance}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('enterAmount')} (पेमेंट मिली) *
                </label>
                <input
                  type="number"
                  required
                  autoFocus
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹ 0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-2xl text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('paidVia')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['cash', 'upi'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === mode
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mode === 'cash' ? t('cash') : t('upi')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('reasonNote')}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="उदा. GPay / नकद भुगतान"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                + पेमेंट जमा दर्ज करें
              </button>
            </form>
          )}

          {/* CUSTOMER FORM */}
          {quickModal === 'customer' && (
            <form onSubmit={handleSaveCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('customerName')} *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="उदा. रमेश कुमार / वर्मा जी"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('mobileNumber')}
                </label>
                <input
                  type="tel"
                  value={custMobile}
                  onChange={(e) => setCustMobile(e.target.value)}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('address')}
                </label>
                <input
                  type="text"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  placeholder="मकान नं, गली, इलाका"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('openingBalance')} (₹)
                </label>
                <input
                  type="number"
                  value={custOpening}
                  onChange={(e) => setCustOpening(e.target.value)}
                  placeholder="0 (धनात्मक = ग्राहक पर बकाया)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('notes')}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="उदा. हर महीने 1 तारीख को हिसाब"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                {t('saveCustomer')}
              </button>
            </form>
          )}

          {/* PRODUCT FORM */}
          {quickModal === 'product' && (
            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('productName')} *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="उदा. फॉर्च्यून तेल 1L / मैगी 70g"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('purchasePrice')} (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={prodPurchasePrice}
                    onChange={(e) => setProdPurchasePrice(e.target.value)}
                    placeholder="खरीद भाव"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('sellingPrice')} (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={prodSellingPrice}
                    onChange={(e) => setProdSellingPrice(e.target.value)}
                    placeholder="बिक्री भाव"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    स्टॉक मात्रा
                  </label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    चेतावनी सीमा
                  </label>
                  <input
                    type="number"
                    value={prodMinStock}
                    onChange={(e) => setProdMinStock(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    इकाई (Unit)
                  </label>
                  <select
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="Pcs">Pcs (नग)</option>
                    <option value="Kg">Kg (किलो)</option>
                    <option value="Gram">Gram (ग्राम)</option>
                    <option value="Litre">Litre (लीटर)</option>
                    <option value="Packet">Packet (पैकेट)</option>
                    <option value="Box">Box (डिब्बा)</option>
                    <option value="Bottle">Bottle (बोतल)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                + प्रोडक्ट सेव करें
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
