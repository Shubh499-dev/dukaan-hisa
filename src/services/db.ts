import {
  Customer,
  CustomerTransaction,
  Product,
  Sale,
  Expense,
  Invoice,
  ShopProfile,
  AppSettings,
} from '../types';

const DB_NAME = 'dukaan_hisab_db';
const DB_VERSION = 1;

// Default initial state
const defaultShopProfile: ShopProfile = {
  name: 'माँ लक्ष्मी किराना स्टोर',
  tagline: 'उधार से Profit तक, दुकान का पूरा हिसाब',
  ownerName: 'रमेश कुमार',
  mobile: '9876543210',
  address: 'दुकान नं. 14, मुख्य बाज़ार, भारत',
  shopType: 'kirana',
  gstNumber: '',
  upiId: 'shoppay@okaxis',
  currency: '₹',
  isFirstLaunchDone: false,
};

const defaultSettings: AppSettings = {
  language: 'hi',
  theme: 'system',
  soundEnabled: true,
  dailyReminderEnabled: true,
  dailyReminderTime: '21:00',
  lowStockAlertEnabled: true,
  showAdBanners: true,
};

const initialSampleProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'सरसों का तेल (Fortune 1L)',
    purchasePrice: 135,
    sellingPrice: 155,
    stockQuantity: 24,
    minStockLevel: 5,
    category: 'Groceries',
    unit: 'Litre',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'टाटा नमक (Tata Salt 1kg)',
    purchasePrice: 22,
    sellingPrice: 28,
    stockQuantity: 45,
    minStockLevel: 10,
    category: 'Groceries',
    unit: 'Packet',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'कोल्ड ड्रिंक (Coca Cola 750ml)',
    purchasePrice: 35,
    sellingPrice: 40,
    stockQuantity: 4, // low stock!
    minStockLevel: 8,
    category: 'Beverages',
    unit: 'Bottle',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'आशीर्वाद आटा (Aashirvaad 5kg)',
    purchasePrice: 210,
    sellingPrice: 245,
    stockQuantity: 15,
    minStockLevel: 4,
    category: 'Groceries',
    unit: 'Bag',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'मैगी नूडल्स (Maggi 70g)',
    purchasePrice: 12,
    sellingPrice: 14,
    stockQuantity: 2, // low stock!
    minStockLevel: 10,
    category: 'Packaged Food',
    unit: 'Packet',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialSampleCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'राजेश वर्मा (वर्मा जी)',
    mobile: '9812345678',
    address: 'मकान नं. 42, रेलवे रोड',
    openingBalance: 500,
    currentBalance: 1250, // owes us ₹1250
    notes: 'हर महीने 1 तारीख को भुगतान करते हैं',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cust-2',
    name: 'सुनील शर्मा',
    mobile: '9765432109',
    address: 'गली नं 3',
    openingBalance: 0,
    currentBalance: 420, // owes us ₹420
    notes: 'दैनिक दूध व किराना',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cust-3',
    name: 'अमित कुमार (टेलर)',
    mobile: '9988776655',
    address: 'दुकान के पास',
    openingBalance: 0,
    currentBalance: 0, // settled
    notes: 'पूरा हिसाब साफ',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialSampleTransactions: CustomerTransaction[] = [
  {
    id: 'txn-1',
    customerId: 'cust-1',
    customerName: 'राजेश वर्मा (वर्मा जी)',
    type: 'udhar_given',
    amount: 750,
    note: 'राशन सामान (आटा, तेल, दाल)',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'txn-2',
    customerId: 'cust-1',
    customerName: 'राजेश वर्मा (वर्मा जी)',
    type: 'payment_received',
    amount: 500,
    paymentMethod: 'upi',
    note: 'GPay से पेमेंट की',
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'txn-3',
    customerId: 'cust-2',
    customerName: 'सुनील शर्मा',
    type: 'udhar_given',
    amount: 420,
    note: 'कोल्ड ड्रिंक व बिस्कुट',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

const initialSampleSales: Sale[] = [
  {
    id: 'sale-1',
    invoiceNumber: 'INV-1001',
    items: [
      {
        productId: 'prod-1',
        productName: 'सरसों का तेल (Fortune 1L)',
        quantity: 2,
        purchasePrice: 135,
        sellingPrice: 155,
        total: 310,
      },
      {
        productId: 'prod-4',
        productName: 'आशीर्वाद आटा (Aashirvaad 5kg)',
        quantity: 1,
        purchasePrice: 210,
        sellingPrice: 245,
        total: 245,
      },
    ],
    subtotal: 555,
    discount: 15,
    gstAmount: 0,
    totalAmount: 540,
    costAmount: 480,
    profitAmount: 60,
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sale-2',
    invoiceNumber: 'INV-1002',
    items: [
      {
        productId: 'prod-2',
        productName: 'टाटा नमक (Tata Salt 1kg)',
        quantity: 2,
        purchasePrice: 22,
        sellingPrice: 28,
        total: 56,
      },
    ],
    subtotal: 56,
    discount: 0,
    gstAmount: 0,
    totalAmount: 56,
    costAmount: 44,
    profitAmount: 12,
    paymentMethod: 'upi',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

const initialSampleExpenses: Expense[] = [
  {
    id: 'exp-1',
    amount: 150,
    category: 'food',
    note: 'स्टाफ व ग्राहक चाय-नाश्ता',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    amount: 300,
    category: 'transport',
    note: 'मंडी से सामान ढुलाई भाड़ा',
    paymentMethod: 'upi',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

class DukaanDatabase {
  private memoryCache: {
    shopProfile: ShopProfile;
    settings: AppSettings;
    customers: Customer[];
    transactions: CustomerTransaction[];
    products: Product[];
    sales: Sale[];
    expenses: Expense[];
    invoices: Invoice[];
  };

  constructor() {
    this.memoryCache = {
      shopProfile: defaultShopProfile,
      settings: defaultSettings,
      customers: initialSampleCustomers,
      transactions: initialSampleTransactions,
      products: initialSampleProducts,
      sales: initialSampleSales,
      expenses: initialSampleExpenses,
      invoices: [],
    };
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedProfile = localStorage.getItem('dh_shopProfile');
      if (savedProfile) this.memoryCache.shopProfile = JSON.parse(savedProfile);

      const savedSettings = localStorage.getItem('dh_settings');
      if (savedSettings) this.memoryCache.settings = JSON.parse(savedSettings);

      const savedCustomers = localStorage.getItem('dh_customers');
      if (savedCustomers) this.memoryCache.customers = JSON.parse(savedCustomers);

      const savedTxns = localStorage.getItem('dh_transactions');
      if (savedTxns) this.memoryCache.transactions = JSON.parse(savedTxns);

      const savedProducts = localStorage.getItem('dh_products');
      if (savedProducts) this.memoryCache.products = JSON.parse(savedProducts);

      const savedSales = localStorage.getItem('dh_sales');
      if (savedSales) this.memoryCache.sales = JSON.parse(savedSales);

      const savedExpenses = localStorage.getItem('dh_expenses');
      if (savedExpenses) this.memoryCache.expenses = JSON.parse(savedExpenses);

      const savedInvoices = localStorage.getItem('dh_invoices');
      if (savedInvoices) this.memoryCache.invoices = JSON.parse(savedInvoices);
    } catch (e) {
      console.error('Error loading data from localStorage, using memory defaults', e);
    }
  }

  private saveKey(key: string, data: unknown) {
    try {
      localStorage.setItem(`dh_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage quota exceeded or private mode, state kept in memory', e);
    }
  }

  // --- Profile & Settings ---
  getShopProfile(): ShopProfile {
    return { ...this.memoryCache.shopProfile };
  }

  saveShopProfile(profile: Partial<ShopProfile>): ShopProfile {
    this.memoryCache.shopProfile = { ...this.memoryCache.shopProfile, ...profile };
    this.saveKey('shopProfile', this.memoryCache.shopProfile);
    return { ...this.memoryCache.shopProfile };
  }

  getSettings(): AppSettings {
    return { ...this.memoryCache.settings };
  }

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    this.memoryCache.settings = { ...this.memoryCache.settings, ...settings };
    this.saveKey('settings', this.memoryCache.settings);
    return { ...this.memoryCache.settings };
  }

  // --- Customers & Udhar Khata ---
  getCustomers(): Customer[] {
    return [...this.memoryCache.customers];
  }

  getCustomer(id: string): Customer | undefined {
    return this.memoryCache.customers.find((c) => c.id === id);
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'currentBalance'> & { openingBalance?: number }): Customer {
    const opening = Number(customer.openingBalance) || 0;
    const newCust: Customer = {
      ...customer,
      id: 'cust-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      openingBalance: opening,
      currentBalance: opening,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryCache.customers.unshift(newCust);
    this.saveKey('customers', this.memoryCache.customers);
    return newCust;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const index = this.memoryCache.customers.findIndex((c) => c.id === id);
    if (index === -1) return undefined;

    this.memoryCache.customers[index] = {
      ...this.memoryCache.customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveKey('customers', this.memoryCache.customers);
    return this.memoryCache.customers[index];
  }

  deleteCustomer(id: string): boolean {
    this.memoryCache.customers = this.memoryCache.customers.filter((c) => c.id !== id);
    this.memoryCache.transactions = this.memoryCache.transactions.filter((t) => t.customerId !== id);
    this.saveKey('customers', this.memoryCache.customers);
    this.saveKey('transactions', this.memoryCache.transactions);
    return true;
  }

  // --- Customer Transactions (Udhar / Payment) ---
  getCustomerTransactions(customerId?: string): CustomerTransaction[] {
    if (!customerId) return [...this.memoryCache.transactions];
    return this.memoryCache.transactions.filter((t) => t.customerId === customerId);
  }

  addCustomerTransaction(txn: Omit<CustomerTransaction, 'id' | 'createdAt'>): CustomerTransaction {
    const newTxn: CustomerTransaction = {
      ...txn,
      id: 'txn-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    };

    // Update customer balance atomically
    const cust = this.memoryCache.customers.find((c) => c.id === txn.customerId);
    if (cust) {
      const amount = Number(txn.amount) || 0;
      if (txn.type === 'udhar_given') {
        cust.currentBalance += amount;
      } else if (txn.type === 'payment_received') {
        cust.currentBalance -= amount;
      } else if (txn.type === 'udhar_taken') {
        cust.currentBalance -= amount;
      } else if (txn.type === 'payment_made') {
        cust.currentBalance += amount;
      }
      cust.updatedAt = new Date().toISOString();
      this.saveKey('customers', this.memoryCache.customers);
    }

    this.memoryCache.transactions.unshift(newTxn);
    this.saveKey('transactions', this.memoryCache.transactions);
    return newTxn;
  }

  deleteCustomerTransaction(id: string): boolean {
    const txnIndex = this.memoryCache.transactions.findIndex((t) => t.id === id);
    if (txnIndex === -1) return false;

    const txn = this.memoryCache.transactions[txnIndex];
    // Reverse balance effect
    const cust = this.memoryCache.customers.find((c) => c.id === txn.customerId);
    if (cust) {
      const amount = Number(txn.amount) || 0;
      if (txn.type === 'udhar_given') cust.currentBalance -= amount;
      else if (txn.type === 'payment_received') cust.currentBalance += amount;
      else if (txn.type === 'udhar_taken') cust.currentBalance += amount;
      else if (txn.type === 'payment_made') cust.currentBalance -= amount;
      cust.updatedAt = new Date().toISOString();
      this.saveKey('customers', this.memoryCache.customers);
    }

    this.memoryCache.transactions.splice(txnIndex, 1);
    this.saveKey('transactions', this.memoryCache.transactions);
    return true;
  }

  // --- Products & Inventory ---
  getProducts(): Product[] {
    return [...this.memoryCache.products];
  }

  getProduct(id: string): Product | undefined {
    return this.memoryCache.products.find((p) => p.id === id);
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProd: Product = {
      ...product,
      id: 'prod-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryCache.products.unshift(newProd);
    this.saveKey('products', this.memoryCache.products);
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.memoryCache.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.memoryCache.products[index] = {
      ...this.memoryCache.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveKey('products', this.memoryCache.products);
    return this.memoryCache.products[index];
  }

  adjustStock(productId: string, deltaQuantity: number): Product | undefined {
    const product = this.memoryCache.products.find((p) => p.id === productId);
    if (!product) return undefined;

    product.stockQuantity = Math.max(0, (product.stockQuantity || 0) + deltaQuantity);
    product.updatedAt = new Date().toISOString();
    this.saveKey('products', this.memoryCache.products);
    return product;
  }

  deleteProduct(id: string): boolean {
    this.memoryCache.products = this.memoryCache.products.filter((p) => p.id !== id);
    this.saveKey('products', this.memoryCache.products);
    return true;
  }

  // --- Sales ---
  getSales(): Sale[] {
    return [...this.memoryCache.sales];
  }

  addSale(sale: Omit<Sale, 'id' | 'createdAt'>): Sale {
    const newSale: Sale = {
      ...sale,
      id: 'sale-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    };

    // 1. Deduct stock for each item if matched to a product
    for (const item of sale.items) {
      if (item.productId) {
        this.adjustStock(item.productId, -item.quantity);
      }
    }

    // 2. If payment is Udhar and customer is provided, create Udhar Khata transaction
    if (sale.paymentMethod === 'udhar' && sale.customerId) {
      const cust = this.getCustomer(sale.customerId);
      if (cust) {
        this.addCustomerTransaction({
          customerId: cust.id,
          customerName: cust.name,
          type: 'udhar_given',
          amount: sale.totalAmount,
          note: `बिक्री #${newSale.invoiceNumber || newSale.id.slice(-4)} (${sale.items.map((i) => i.productName).join(', ')})`,
          date: sale.date,
          billNumber: newSale.invoiceNumber,
        });
      }
    }

    this.memoryCache.sales.unshift(newSale);
    this.saveKey('sales', this.memoryCache.sales);
    return newSale;
  }

  deleteSale(id: string): boolean {
    this.memoryCache.sales = this.memoryCache.sales.filter((s) => s.id !== id);
    this.saveKey('sales', this.memoryCache.sales);
    return true;
  }

  // --- Expenses ---
  getExpenses(): Expense[] {
    return [...this.memoryCache.expenses];
  }

  addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const newExp: Expense = {
      ...expense,
      id: 'exp-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    };
    this.memoryCache.expenses.unshift(newExp);
    this.saveKey('expenses', this.memoryCache.expenses);
    return newExp;
  }

  deleteExpense(id: string): boolean {
    this.memoryCache.expenses = this.memoryCache.expenses.filter((e) => e.id !== id);
    this.saveKey('expenses', this.memoryCache.expenses);
    return true;
  }

  // --- Invoices ---
  getInvoices(): Invoice[] {
    return [...this.memoryCache.invoices];
  }

  saveInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'> & { id?: string }): Invoice {
    const id = invoice.id || 'inv-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const fullInvoice: Invoice = {
      ...invoice,
      id,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = this.memoryCache.invoices.findIndex((inv) => inv.id === id);
    if (existingIndex >= 0) {
      this.memoryCache.invoices[existingIndex] = fullInvoice;
    } else {
      this.memoryCache.invoices.unshift(fullInvoice);
    }

    this.saveKey('invoices', this.memoryCache.invoices);
    return fullInvoice;
  }

  deleteInvoice(id: string): boolean {
    this.memoryCache.invoices = this.memoryCache.invoices.filter((inv) => inv.id !== id);
    this.saveKey('invoices', this.memoryCache.invoices);
    return true;
  }

  // --- Analytics & Aggregates ---
  getDashboardMetrics(targetDate?: string) {
    const todayStr = targetDate || new Date().toISOString().split('T')[0];

    // Today's Sales
    const todaySalesList = this.memoryCache.sales.filter((s) => s.date === todayStr);
    const todaySales = todaySalesList.reduce((acc, s) => acc + (Number(s.totalAmount) || 0), 0);
    const todayCost = todaySalesList.reduce((acc, s) => acc + (Number(s.costAmount) || 0), 0);
    const todayGrossProfit = todaySales - todayCost;

    // Today's Expenses
    const todayExpensesList = this.memoryCache.expenses.filter((e) => e.date === todayStr);
    const todayExpenses = todayExpensesList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    // Today's Net Profit
    const todayNetProfit = todayGrossProfit - todayExpenses;

    // Udhar Metrics
    let totalUdharReceivable = 0;
    let totalPayable = 0;
    for (const c of this.memoryCache.customers) {
      if (c.currentBalance > 0) {
        totalUdharReceivable += c.currentBalance;
      } else if (c.currentBalance < 0) {
        totalPayable += Math.abs(c.currentBalance);
      }
    }

    // Cash & UPI Balances
    // Cash = (Cash Sales + Cash Payments Received) - (Cash Expenses + Cash Payments Made)
    let cashBalance = 0;
    let upiBalance = 0;

    for (const s of this.memoryCache.sales) {
      if (s.paymentMethod === 'cash') cashBalance += s.totalAmount;
      if (s.paymentMethod === 'upi') upiBalance += s.totalAmount;
    }

    for (const t of this.memoryCache.transactions) {
      if (t.type === 'payment_received') {
        if (t.paymentMethod === 'upi') upiBalance += t.amount;
        else cashBalance += t.amount;
      } else if (t.type === 'payment_made') {
        if (t.paymentMethod === 'upi') upiBalance -= t.amount;
        else cashBalance -= t.amount;
      }
    }

    for (const e of this.memoryCache.expenses) {
      if (e.paymentMethod === 'upi') upiBalance -= e.amount;
      else cashBalance -= e.amount;
    }

    // Stock Valuation & Alerts
    let totalStockValue = 0;
    let lowStockCount = 0;
    const lowStockProducts: Product[] = [];

    for (const p of this.memoryCache.products) {
      totalStockValue += (Number(p.purchasePrice) || 0) * (Number(p.stockQuantity) || 0);
      if (p.stockQuantity <= (p.minStockLevel || 0)) {
        lowStockCount++;
        lowStockProducts.push(p);
      }
    }

    return {
      todaySales,
      todayExpenses,
      todayProfit: todayNetProfit,
      todayGrossProfit,
      totalUdharReceivable,
      totalPayable,
      cashBalance,
      upiBalance,
      totalStockValue,
      lowStockCount,
      lowStockProducts,
    };
  }

  // --- Export & Backup ---
  exportAllDataJson(): string {
    const backupObj = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      shopProfile: this.memoryCache.shopProfile,
      settings: this.memoryCache.settings,
      customers: this.memoryCache.customers,
      transactions: this.memoryCache.transactions,
      products: this.memoryCache.products,
      sales: this.memoryCache.sales,
      expenses: this.memoryCache.expenses,
      invoices: this.memoryCache.invoices,
    };
    return JSON.stringify(backupObj, null, 2);
  }

  importAllDataJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.shopProfile) this.saveShopProfile(data.shopProfile);
      if (data.settings) this.saveSettings(data.settings);
      if (Array.isArray(data.customers)) {
        this.memoryCache.customers = data.customers;
        this.saveKey('customers', data.customers);
      }
      if (Array.isArray(data.transactions)) {
        this.memoryCache.transactions = data.transactions;
        this.saveKey('transactions', data.transactions);
      }
      if (Array.isArray(data.products)) {
        this.memoryCache.products = data.products;
        this.saveKey('products', data.products);
      }
      if (Array.isArray(data.sales)) {
        this.memoryCache.sales = data.sales;
        this.saveKey('sales', data.sales);
      }
      if (Array.isArray(data.expenses)) {
        this.memoryCache.expenses = data.expenses;
        this.saveKey('expenses', data.expenses);
      }
      if (Array.isArray(data.invoices)) {
        this.memoryCache.invoices = data.invoices;
        this.saveKey('invoices', data.invoices);
      }
      return true;
    } catch (e) {
      console.error('Error importing backup JSON:', e);
      return false;
    }
  }

  resetToSampleData() {
    this.memoryCache = {
      shopProfile: defaultShopProfile,
      settings: defaultSettings,
      customers: [...initialSampleCustomers],
      transactions: [...initialSampleTransactions],
      products: [...initialSampleProducts],
      sales: [...initialSampleSales],
      expenses: [...initialSampleExpenses],
      invoices: [],
    };
    this.saveKey('shopProfile', this.memoryCache.shopProfile);
    this.saveKey('settings', this.memoryCache.settings);
    this.saveKey('customers', this.memoryCache.customers);
    this.saveKey('transactions', this.memoryCache.transactions);
    this.saveKey('products', this.memoryCache.products);
    this.saveKey('sales', this.memoryCache.sales);
    this.saveKey('expenses', this.memoryCache.expenses);
    this.saveKey('invoices', this.memoryCache.invoices);
  }

  resetAllData() {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    this.memoryCache = {
      shopProfile: { ...defaultShopProfile, isFirstLaunchDone: true },
      settings: defaultSettings,
      customers: [],
      transactions: [],
      products: [],
      sales: [],
      expenses: [],
      invoices: [],
    };
    this.saveKey('shopProfile', this.memoryCache.shopProfile);
    this.saveKey('settings', this.memoryCache.settings);
    this.saveKey('customers', []);
    this.saveKey('transactions', []);
    this.saveKey('products', []);
    this.saveKey('sales', []);
    this.saveKey('expenses', []);
    this.saveKey('invoices', []);
  }
}

export const db = new DukaanDatabase();
