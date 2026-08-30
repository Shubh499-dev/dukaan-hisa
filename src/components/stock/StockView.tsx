import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Edit2,
  Trash2,
  TrendingUp,
  Tag,
  Boxes,
  Check,
  X,
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { AdBanner } from '../common/AdBanner';

export const StockView: React.FC = () => {
  const { products, openQuickModal, adjustStock, updateProduct, deleteProduct, t, lang, showToast } =
    useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPurchasePrice, setEditPurchasePrice] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editMinStock, setEditMinStock] = useState('');
  const [editUnit, setEditUnit] = useState('Pcs');
  const [editCategory, setEditCategory] = useState('');

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditPurchasePrice(String(prod.purchasePrice));
    setEditSellingPrice(String(prod.sellingPrice));
    setEditStock(String(prod.stockQuantity));
    setEditMinStock(String(prod.minStockLevel));
    setEditUnit(prod.unit);
    setEditCategory(prod.category);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editName.trim() || editingProduct.name,
      purchasePrice: Number(editPurchasePrice) || 0,
      sellingPrice: Number(editSellingPrice) || 0,
      stockQuantity: Number(editStock) || 0,
      minStockLevel: Number(editMinStock) || 0,
      unit: editUnit,
      category: editCategory,
    });

    setEditingProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteProduct(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  // Filtered List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'low') return p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0;
    if (filterMode === 'out') return p.stockQuantity === 0;
    return true;
  });

  const totalStockValuation = products.reduce(
    (acc, p) => acc + (Number(p.purchasePrice) || 0) * (Number(p.stockQuantity) || 0),
    0
  );

  const totalPotentialProfit = products.reduce(
    (acc, p) =>
      acc +
      Math.max(0, (Number(p.sellingPrice) || 0) - (Number(p.purchasePrice) || 0)) *
        (Number(p.stockQuantity) || 0),
    0
  );

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockLevel).length;

  return (
    <div className="pb-24 pt-2 px-3 sm:px-6 max-w-5xl mx-auto space-y-4">
      {/* 1. Header Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Valuation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            {t('stockValue')}
          </span>
          <div className="text-xl sm:text-2xl font-black text-purple-700 dark:text-purple-300 mt-1">
            {formatCurrency(totalStockValuation)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            खरीद मूल्य के आधार पर कुल लागत
          </span>
        </div>

        {/* Potential Profit */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            {t('potentialProfit')}
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            +{formatCurrency(totalPotentialProfit)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            पूरा स्टॉक बिकने पर संभावित मुनाफा
          </span>
        </div>

        {/* Low Stock Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            {t('lowStockCount')}
          </span>
          <div
            className={`text-xl sm:text-2xl font-black mt-1 ${
              lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {lowStockCount} सामान
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            कुल {products.length} प्रोडक्ट्स में से
          </span>
        </div>
      </div>

      {/* 2. Search & Add Product Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchProduct')}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-medium shadow-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
          />
        </div>

        <button
          onClick={() => openQuickModal('product')}
          className="py-2.5 px-3 sm:px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t('addNewProduct')}</span>
          <span className="sm:hidden">+ प्रोडक्ट</span>
        </button>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterMode === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          सभी सामान ({products.length})
        </button>
        <button
          onClick={() => setFilterMode('low')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            filterMode === 'low'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>कम स्टॉक ({lowStockCount})</span>
        </button>
        <button
          onClick={() => setFilterMode('out')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterMode === 'out'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          स्टॉक खत्म ({products.filter((p) => p.stockQuantity === 0).length})
        </button>
      </div>

      {/* 4. Products List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {searchQuery ? 'कोई प्रोडक्ट नहीं मिला' : 'अभी तक कोई प्रोडक्ट नहीं जोड़ा गया है।'}
            </p>
            <button
              onClick={() => openQuickModal('product')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addNewProduct')}</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const isLow = prod.stockQuantity <= prod.minStockLevel;
            const isOut = prod.stockQuantity === 0;

            return (
              <div
                key={prod.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Product Name & Category Info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                      isOut
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                        : isLow
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                        : 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {prod.name}
                      </h4>
                      {isOut ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          {t('outOfStock')}
                        </span>
                      ) : isLow ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          {t('lowStock')}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span>बिक्री: <strong className="text-slate-800 dark:text-slate-200">₹{prod.sellingPrice}</strong></span>
                      {prod.purchasePrice > 0 && (
                        <span>• खरीद: ₹{prod.purchasePrice}</span>
                      )}
                      {prod.category && (
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[11px]">
                          {prod.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stock Controls (+ / -) & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Stock counter with instant + / - buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => adjustStock(prod.id, -1)}
                      disabled={prod.stockQuantity <= 0}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 active:scale-90 transition-all shadow-xs"
                      title="स्टॉक घटाएं (-1)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="px-2 text-center min-w-[48px]">
                      <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">
                        {prod.stockQuantity}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold leading-none block">
                        {prod.unit}
                      </span>
                    </div>

                    <button
                      onClick={() => adjustStock(prod.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 active:scale-90 transition-all shadow-xs"
                      title="स्टॉक बढ़ाएं (+1)"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-2 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t('editProduct')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(prod.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t('deleteProduct')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdBanner placement="inline" />

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t('editProduct')}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('productName')}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    खरीद भाव (₹)
                  </label>
                  <input
                    type="number"
                    value={editPurchasePrice}
                    onChange={(e) => setEditPurchasePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    बिक्री भाव (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editSellingPrice}
                    onChange={(e) => setEditSellingPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    स्टॉक
                  </label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    चेतावनी सीमा
                  </label>
                  <input
                    type="number"
                    value={editMinStock}
                    onChange={(e) => setEditMinStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    इकाई
                  </label>
                  <select
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Kg">Kg</option>
                    <option value="Gram">Gram</option>
                    <option value="Litre">Litre</option>
                    <option value="Packet">Packet</option>
                    <option value="Box">Box</option>
                    <option value="Bottle">Bottle</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow transition-all mt-2"
              >
                सेव करें
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title={t('deleteProduct')}
        description="क्या आप सचमुच इस प्रोडक्ट को स्टॉक सूची से हटाना चाहते हैं?"
        confirmLabel={t('delete')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
