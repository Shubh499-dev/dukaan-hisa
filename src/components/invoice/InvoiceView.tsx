import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceItem } from '../../types';
import { formatCurrency, formatDate, generateWhatsAppLink } from '../../utils/formatters';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Share2,
  MessageCircle,
  CheckCircle,
  Download,
  Calendar,
  User,
  Phone,
  DollarSign,
  Building,
  Check,
} from 'lucide-react';
import { AdBanner } from '../common/AdBanner';

export const InvoiceView: React.FC = () => {
  const { invoices, products, customers, createInvoice, shopProfile, t, lang, showToast } = useApp();

  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form State for new bill
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', productName: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);
  const [discountAmount, setDiscountAmount] = useState('0');
  const [gstPercent, setGstPercent] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>('paid');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('हमारे यहाँ खरीदारी करने के लिए धन्यवाद!');

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
  const discountVal = Number(discountAmount) || 0;
  const taxable = Math.max(0, subtotal - discountVal);
  const gstRate = Number(gstPercent) || 0;
  const taxAmount = (taxable * gstRate) / 100;
  const grandTotal = Math.round(taxable + taxAmount);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), productName: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      const current = { ...next[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? Number(value) : Number(current.quantity);
        const rate = field === 'unitPrice' ? Number(value) : Number(current.unitPrice);
        current.total = (qty || 0) * (rate || 0);
      }
      next[index] = current;
      return next;
    });
  };

  const handleProductSelect = (index: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        productId: prod.id,
        productName: prod.name,
        unitPrice: prod.sellingPrice,
        total: (next[index].quantity || 1) * prod.sellingPrice,
      };
      return next;
    });
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !items[0].productName) {
      showToast('कृपया कम से कम एक सामान बिल में जोड़ें', undefined, 'error');
      return;
    }

    const paidVal =
      paymentStatus === 'paid'
        ? grandTotal
        : paymentStatus === 'unpaid'
        ? 0
        : Number(paidAmount) || 0;

    const newInv = createInvoice({
      customerName: customerName.trim() || 'ग्राहक (Cash Sale)',
      customerMobile: customerPhone.trim() || undefined,
      items,
      subtotal,
      discount: discountVal,
      tax: taxAmount,
      totalAmount: grandTotal,
      paidAmount: paidVal,
      balanceAmount: Math.max(0, grandTotal - paidVal),
      paymentStatus,
      notes,
    });

    setSelectedInvoice(newInv);
    showToast('बिल सफलतापूर्वक बन गया!', undefined, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppInvoice = (inv: Invoice) => {
    if (!inv.customerMobile) {
      showToast('कृपया पहले ग्राहक का मोबाइल नंबर दर्ज करें', undefined, 'error');
      return;
    }
    const msg = `🧾 *${shopProfile.name || 'दुकान बिल'}*\nबिल नं: ${inv.invoiceNumber}\nतारीख: ${formatDate(
      inv.createdAt,
      lang
    )}\nग्राहक: ${inv.customerName}\n\n*सामान सूची:*\n${inv.items
      .map((i) => `• ${i.productName} (x${i.quantity}) = ₹${i.total}`)
      .join('\n')}\n\n*कुल योग: ₹${inv.totalAmount.toLocaleString('en-IN')}*\nभुगतान स्थिति: ${
      inv.paymentStatus === 'paid' ? 'Paid (चुकता)' : `बाकी: ₹${inv.balanceAmount}`
    }\n\nधन्यवाद!`;

    window.open(generateWhatsAppLink(inv.customerMobile, msg), '_blank');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-6 max-w-5xl mx-auto space-y-4">
      {/* 1. Header Navigation Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveTab('create');
              setSelectedInvoice(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'create' && !selectedInvoice
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ नया बिल बनाएं</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('list');
              setSelectedInvoice(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>सभी बिल ({invoices.length})</span>
          </button>
        </div>
      </div>

      {/* 2. TAB: CREATE NEW INVOICE */}
      {activeTab === 'create' && !selectedInvoice && (
        <form onSubmit={handleSaveInvoice} className="space-y-4">
          {/* Shop & Customer Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>ग्राहक की जानकारी</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ग्राहक का नाम
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="उदा. राहुल शर्मा"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  मोबाइल नंबर (व्हाट्सएप बिल के लिए)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="उदा. 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>सामान की सूची (Bill Items)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ लाइन जोड़ें</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                    {/* Quick Pick from Inventory */}
                    {products.length > 0 && (
                      <select
                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                        defaultValue=""
                        className="text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
                      >
                        <option value="" disabled>
                          📦 स्टॉक से चुनें...
                        </option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (₹{p.sellingPrice})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-12 sm:col-span-5">
                      <input
                        type="text"
                        required
                        value={item.productName}
                        onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                        placeholder="सामान का नाम *"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        placeholder="मात्रा"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-center text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        placeholder="दर (₹)"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-right text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="col-span-3 sm:col-span-2 text-right font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      ₹{item.total.toLocaleString('en-IN')}
                    </div>

                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                        className="text-slate-400 hover:text-rose-500 disabled:opacity-20 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ और सामान जोड़ें</span>
            </button>
          </div>

          {/* Discounts, Taxes & Payment Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  छूट / डिस्काउंट (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GST (%)
                </label>
                <select
                  value={gstPercent}
                  onChange={(e) => setGstPercent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="0">0% (None)</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  भुगतान स्थिति
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e: any) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="paid">Paid (पूरा जमा)</option>
                  <option value="unpaid">Unpaid (उधार)</option>
                  <option value="partial">Partial (आंशिक)</option>
                </select>
              </div>

              {paymentStatus === 'partial' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    जमा राशि (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={grandTotal}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Total Highlight */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  कुल बिल योग (Grand Total):
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-100">
                  {formatCurrency(grandTotal)}
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all"
              >
                🧾 बिल बनाएं व प्रिंट करें
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3. PRINTABLE INVOICE PREVIEW (if an invoice is selected) */}
      {selectedInvoice && (
        <div className="space-y-4">
          <div className="flex items-center justify-between print:hidden">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline"
            >
              ← वापस जाएं
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-2 px-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट / PDF सेव</span>
              </button>

              {selectedInvoice.customerMobile && (
                <button
                  onClick={() => handleWhatsAppInvoice(selectedInvoice)}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp भेजें</span>
                </button>
              )}
            </div>
          </div>

          {/* Thermal / Professional Invoice Canvas */}
          <div
            ref={printRef}
            className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-lg max-w-2xl mx-auto font-sans"
          >
            {/* Shop Header */}
            <div className="text-center pb-4 border-b border-slate-300">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                {shopProfile.name || 'दुकान हिसाब'}
              </h2>
              {shopProfile.tagline && (
                <p className="text-xs italic text-slate-600 mt-0.5">{shopProfile.tagline}</p>
              )}
              <p className="text-xs text-slate-700 mt-1">
                {shopProfile.address ? `📍 ${shopProfile.address}` : ''}
                {shopProfile.phone ? ` • 📞 ${shopProfile.phone}` : ''}
              </p>
              {shopProfile.gstin && (
                <p className="text-xs font-bold text-slate-800 mt-0.5">GSTIN: {shopProfile.gstin}</p>
              )}
            </div>

            {/* Bill Details */}
            <div className="flex justify-between py-3 text-xs border-b border-slate-200">
              <div>
                <p>
                  <strong>बिल नं:</strong> {selectedInvoice.invoiceNumber}
                </p>
                <p>
                  <strong>ग्राहक:</strong> {selectedInvoice.customerName}
                </p>
                {selectedInvoice.customerMobile && (
                  <p>
                    <strong>फोन:</strong> {selectedInvoice.customerMobile}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p>
                  <strong>तारीख:</strong> {formatDate(selectedInvoice.createdAt, 'hi')}
                </p>
                <p>
                  <strong>स्थिति:</strong>{' '}
                  <span className="uppercase font-bold">{selectedInvoice.paymentStatus}</span>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full my-4 text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-left">
                  <th className="py-2">क्र.</th>
                  <th className="py-2">विवरण</th>
                  <th className="py-2 text-center">मात्रा</th>
                  <th className="py-2 text-right">दर</th>
                  <th className="py-2 text-right">कुल</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoice.items.map((it, idx) => (
                  <tr key={it.id}>
                    <td className="py-1.5">{idx + 1}</td>
                    <td className="py-1.5 font-bold">{it.productName}</td>
                    <td className="py-1.5 text-center">{it.quantity}</td>
                    <td className="py-1.5 text-right">₹{it.unitPrice}</td>
                    <td className="py-1.5 text-right font-bold">₹{it.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Breakdown */}
            <div className="border-t-2 border-slate-800 pt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>कुल योग (Subtotal):</span>
                <span>₹{selectedInvoice.subtotal}</span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>छूट (Discount):</span>
                  <span>-₹{selectedInvoice.discount}</span>
                </div>
              )}
              {selectedInvoice.tax > 0 && (
                <div className="flex justify-between">
                  <span>GST कर:</span>
                  <span>+₹{selectedInvoice.tax}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-black border-t border-slate-300 pt-1">
                <span>अंतिम राशि (Grand Total):</span>
                <span>₹{selectedInvoice.totalAmount}</span>
              </div>
              {selectedInvoice.balanceAmount > 0 && (
                <div className="flex justify-between text-xs font-bold text-rose-600">
                  <span>बाकी उधार (Balance Due):</span>
                  <span>₹{selectedInvoice.balanceAmount}</span>
                </div>
              )}
            </div>

            {/* Footer Greeting */}
            <div className="text-center pt-6 mt-4 border-t border-dashed border-slate-300 text-xs text-slate-600">
              <p className="font-semibold">{selectedInvoice.notes || 'दुकान में पधारने के लिए धन्यवाद!'}</p>
              <p className="text-[10px] text-slate-400 mt-1">Khata Saathi App द्वारा जनरेटेड बिल</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: INVOICES HISTORY */}
      {activeTab === 'list' && !selectedInvoice && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs sm:text-sm">
              अभी तक कोई बिल नहीं बना है।
            </div>
          ) : (
            invoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber} • {inv.customerName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {inv.items.length} आइटम • {formatDate(inv.createdAt, lang)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(inv.totalAmount)}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      inv.paymentStatus === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <AdBanner placement="inline" />
    </div>
  );
};
