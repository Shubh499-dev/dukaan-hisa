import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ActiveTab,
  Customer,
  CustomerTransaction,
  Product,
  Sale,
  Expense,
  Invoice,
  ShopProfile,
  AppSettings,
  Language,
  ThemeMode,
} from '../types';
import { db } from '../services/db';
import { translations } from '../i18n/translations';
import { playSound } from '../utils/audio';

export type QuickModalType = 'sale' | 'expense' | 'udhar' | 'payment' | 'customer' | 'product' | null;

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  shopProfile: ShopProfile;
  settings: AppSettings;
  updateShopProfile: (updates: Partial<ShopProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  
  // Data
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  invoices: Invoice[];
  transactions: CustomerTransaction[];
  metrics: ReturnType<typeof db.getDashboardMetrics>;
  
  // Actions
  refreshData: () => void;
  addSale: (sale: Parameters<typeof db.addSale>[0]) => Sale;
  addExpense: (expense: Parameters<typeof db.addExpense>[0]) => Expense;
  addCustomer: (customer: Parameters<typeof db.addCustomer>[0]) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => boolean;
  addCustomerTransaction: (txn: Parameters<typeof db.addCustomerTransaction>[0]) => CustomerTransaction;
  deleteCustomerTransaction: (id: string) => boolean;
  addProduct: (product: Parameters<typeof db.addProduct>[0]) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustStock: (id: string, delta: number) => void;
  deleteProduct: (id: string) => boolean;
  saveInvoice: (invoice: Parameters<typeof db.saveInvoice>[0] | any) => Invoice;
  createInvoice: (invoice: Parameters<typeof db.saveInvoice>[0] | any) => Invoice;
  deleteInvoice: (id: string) => boolean;
  exportBackup: () => void;
  importBackup: (jsonString: string) => { success: boolean; error?: string };
  resetToDemoData: () => void;
  clearAllData: () => void;
  
  // UI Controls
  quickModal: QuickModalType;
  quickModalPayload?: unknown;
  openQuickModal: (type: QuickModalType, payload?: unknown) => void;
  closeQuickModal: () => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // AdMob simulator
  showInterstitial: (onClosed?: () => void) => void;
  isAdShowing: boolean;
  closeInterstitial: () => void;
  
  // Localization
  t: (key: keyof typeof translations['hi']) => string;
  lang: Language;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [shopProfile, setShopProfile] = useState<ShopProfile>(() => db.getShopProfile());
  const [settings, setSettings] = useState<AppSettings>(() => db.getSettings());
  
  const [customers, setCustomers] = useState<Customer[]>(() => db.getCustomers());
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [sales, setSales] = useState<Sale[]>(() => db.getSales());
  const [expenses, setExpenses] = useState<Expense[]>(() => db.getExpenses());
  const [invoices, setInvoices] = useState<Invoice[]>(() => db.getInvoices());
  const [transactions, setTransactions] = useState<CustomerTransaction[]>(() => db.getCustomerTransactions());
  const [metrics, setMetrics] = useState(() => db.getDashboardMetrics());

  const [quickModal, setQuickModal] = useState<QuickModalType>(null);
  const [quickModalPayload, setQuickModalPayload] = useState<unknown>(undefined);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [adCallback, setAdCallback] = useState<(() => void) | null>(null);
  const [lastAdTime, setLastAdTime] = useState(Date.now());

  const refreshData = useCallback(() => {
    setShopProfile(db.getShopProfile());
    setSettings(db.getSettings());
    setCustomers(db.getCustomers());
    setProducts(db.getProducts());
    setSales(db.getSales());
    setExpenses(db.getExpenses());
    setInvoices(db.getInvoices());
    setTransactions(db.getCustomerTransactions());
    setMetrics(db.getDashboardMetrics());
  }, []);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateShopProfile = useCallback((updates: Partial<ShopProfile>) => {
    const updated = db.saveShopProfile(updates);
    setShopProfile(updated);
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    const updated = db.saveSettings(updates);
    setSettings(updated);
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    updateSettings({ language: newLang });
  }, [updateSettings]);

  const toggleLanguage = useCallback(() => {
    const newLang: Language = settings.language === 'hi' ? 'en' : 'hi';
    updateSettings({ language: newLang });
  }, [settings.language, updateSettings]);

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode =
      settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'system' : 'light';
    updateSettings({ theme: nextTheme });
  }, [settings.theme, updateSettings]);

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = 'toast-' + Date.now() + '-' + Math.random();
      setToasts((prev) => [...prev, { id, title, message, type }]);

      if (settings.soundEnabled) {
        if (type === 'success') playSound('success');
        else if (type === 'error') playSound('alert');
      }

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [settings.soundEnabled]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openQuickModal = useCallback((type: QuickModalType, payload?: unknown) => {
    setQuickModal(type);
    setQuickModalPayload(payload);
  }, []);

  const closeQuickModal = useCallback(() => {
    setQuickModal(null);
    setQuickModalPayload(undefined);
  }, []);

  // Interstitial ad simulation with natural frequency cap (at least 60 seconds between ads)
  const showInterstitial = useCallback((onClosed?: () => void) => {
    const now = Date.now();
    if (now - lastAdTime < 60000) {
      if (onClosed) onClosed();
      return;
    }
    setLastAdTime(now);
    setAdCallback(() => onClosed || null);
    setIsAdShowing(true);
  }, [lastAdTime]);

  const closeInterstitial = useCallback(() => {
    setIsAdShowing(false);
    if (adCallback) {
      adCallback();
      setAdCallback(null);
    }
  }, [adCallback]);

  // Data mutation wrappers
  const handleAddSale = useCallback(
    (saleData: Parameters<typeof db.addSale>[0]) => {
      const res = db.addSale(saleData);
      refreshData();
      if (settings.soundEnabled) playSound('cash');
      showToast(translations[settings.language].saleRecordedSuccess, `₹${res.totalAmount}`);
      return res;
    },
    [refreshData, settings.language, settings.soundEnabled, showToast]
  );

  const handleAddExpense = useCallback(
    (expenseData: Parameters<typeof db.addExpense>[0]) => {
      const res = db.addExpense(expenseData);
      refreshData();
      showToast(translations[settings.language].expenseRecordedSuccess, `₹${res.amount}`);
      return res;
    },
    [refreshData, settings.language, showToast]
  );

  const handleAddCustomer = useCallback(
    (custData: Parameters<typeof db.addCustomer>[0]) => {
      const res = db.addCustomer(custData);
      refreshData();
      showToast(translations[settings.language].saveCustomer, res.name);
      return res;
    },
    [refreshData, settings.language, showToast]
  );

  const handleUpdateCustomer = useCallback(
    (id: string, updates: Partial<Customer>) => {
      db.updateCustomer(id, updates);
      refreshData();
    },
    [refreshData]
  );

  const handleDeleteCustomer = useCallback(
    (id: string) => {
      const res = db.deleteCustomer(id);
      refreshData();
      showToast(translations[settings.language].success, 'ग्राहक हटा दिया गया');
      return res;
    },
    [refreshData, settings.language, showToast]
  );

  const handleAddCustomerTransaction = useCallback(
    (txnData: Parameters<typeof db.addCustomerTransaction>[0]) => {
      const res = db.addCustomerTransaction(txnData);
      refreshData();
      if (settings.soundEnabled && (res.type === 'payment_received' || res.type === 'udhar_given')) {
        playSound('cash');
      }
      showToast(
        res.type === 'udhar_given' ? 'उधार दर्ज हुआ' : 'पेमेंट जमा हुई',
        `${res.customerName}: ₹${res.amount}`
      );
      return res;
    },
    [refreshData, settings.language, settings.soundEnabled, showToast]
  );

  const handleDeleteCustomerTransaction = useCallback(
    (id: string) => {
      const res = db.deleteCustomerTransaction(id);
      refreshData();
      showToast(translations[settings.language].success, 'लेन-देन रद्द किया गया');
      return res;
    },
    [refreshData, settings.language, showToast]
  );

  const handleAddProduct = useCallback(
    (productData: Parameters<typeof db.addProduct>[0]) => {
      const res = db.addProduct(productData);
      refreshData();
      showToast(translations[settings.language].productSavedSuccess, res.name);
      return res;
    },
    [refreshData, settings.language, showToast]
  );

  const handleUpdateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      db.updateProduct(id, updates);
      refreshData();
      showToast(translations[settings.language].productSavedSuccess);
    },
    [refreshData, settings.language, showToast]
  );

  const handleAdjustStock = useCallback(
    (id: string, delta: number) => {
      db.adjustStock(id, delta);
      refreshData();
    },
    [refreshData]
  );

  const handleDeleteProduct = useCallback(
    (id: string) => {
      const res = db.deleteProduct(id);
      refreshData();
      showToast(translations[settings.language].success, 'प्रोडक्ट हटा दिया गया');
      return res;
    },
    [refreshData, settings.language, showToast]
  );

  const handleSaveInvoice = useCallback(
    (invoiceData: any) => {
      const invNumber = invoiceData.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`;
      const payload = {
        ...invoiceData,
        invoiceNumber: invNumber,
        date: invoiceData.date || new Date().toISOString().split('T')[0],
      };
      const res = db.saveInvoice(payload);
      refreshData();
      showToast(translations[settings.language]?.success || 'सफल', `बिल #${res.invoiceNumber} सेव हुआ`);
      return res;
    },
    [refreshData, settings.language, showToast]
  );

  const handleDeleteInvoice = useCallback(
    (id: string) => {
      const res = db.deleteInvoice(id);
      refreshData();
      return res;
    },
    [refreshData]
  );

  const exportBackup = useCallback(() => {
    try {
      const jsonStr = db.exportAllDataJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `khata-saathi-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('बैकअप डाउनलोड हो गया!', undefined, 'success');
    } catch {
      showToast('बैकअप निर्यात में त्रुटि हुई', undefined, 'error');
    }
  }, [showToast]);

  const importBackup = useCallback(
    (jsonString: string) => {
      try {
        const success = db.importAllDataJson(jsonString);
        if (success) {
          refreshData();
          return { success: true };
        }
        return { success: false, error: 'अमान्य बैकअप डेटा' };
      } catch (err: any) {
        return { success: false, error: err?.message || 'अमान्य फाइल' };
      }
    },
    [refreshData]
  );

  const resetToDemoData = useCallback(() => {
    db.resetToSampleData();
    refreshData();
    showToast('डेमो सैंपल डेटा लोड हो गया!', undefined, 'success');
  }, [refreshData, showToast]);

  const clearAllData = useCallback(() => {
    db.resetAllData();
    refreshData();
    showToast('सारा डेटा साफ़ कर दिया गया है', undefined, 'info');
  }, [refreshData, showToast]);

  const t = useCallback(
    (key: keyof typeof translations['hi']): string => {
      const lang = settings.language || 'hi';
      return (translations[lang] && translations[lang][key]) || (translations.hi[key] as string) || (key as string);
    },
    [settings.language]
  );

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        shopProfile,
        settings,
        updateShopProfile,
        updateSettings,
        setLanguage,
        toggleLanguage,
        toggleTheme,
        customers,
        products,
        sales,
        expenses,
        invoices,
        transactions,
        metrics,
        refreshData,
        addSale: handleAddSale,
        addExpense: handleAddExpense,
        addCustomer: handleAddCustomer,
        updateCustomer: handleUpdateCustomer,
        deleteCustomer: handleDeleteCustomer,
        addCustomerTransaction: handleAddCustomerTransaction,
        deleteCustomerTransaction: handleDeleteCustomerTransaction,
        addProduct: handleAddProduct,
        updateProduct: handleUpdateProduct,
        adjustStock: handleAdjustStock,
        deleteProduct: handleDeleteProduct,
        saveInvoice: handleSaveInvoice,
        createInvoice: handleSaveInvoice,
        deleteInvoice: handleDeleteInvoice,
        exportBackup,
        importBackup,
        resetToDemoData,
        clearAllData,
        quickModal,
        quickModalPayload,
        openQuickModal,
        closeQuickModal,
        selectedCustomerId,
        setSelectedCustomerId,
        toasts,
        showToast,
        dismissToast,
        showInterstitial,
        isAdShowing,
        closeInterstitial,
        t,
        lang: settings.language,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
