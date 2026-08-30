export type Language =
  | 'hi'
  | 'en'
  | 'hinglish'
  | 'gu'
  | 'mr'
  | 'bn'
  | 'pa'
  | 'ta'
  | 'te'
  | 'kn';
export type ThemeMode = 'light' | 'dark' | 'system';

export type PaymentMethod = 'cash' | 'upi' | 'udhar';
export type TransactionType = 'udhar_given' | 'payment_received' | 'udhar_taken' | 'payment_made';

export type ExpenseCategory =
  | 'rent'
  | 'electricity'
  | 'transport'
  | 'salary'
  | 'purchase'
  | 'maintenance'
  | 'food'
  | 'other';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address?: string;
  notes?: string;
  photoUrl?: string;
  openingBalance: number; // positive = customer owes us (udhar), negative = we owe customer
  currentBalance: number; // positive = customer owes us (udhar), negative = we owe customer
  createdAt: string;
  updatedAt: string;
}

export interface CustomerTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  amount: number;
  paymentMethod?: 'cash' | 'upi';
  note?: string;
  date: string;
  billNumber?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  category: string;
  sku?: string;
  unit: string; // e.g. Pcs, Kg, Litre, Packet, Box
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId?: string;
  productName: string;
  quantity: number;
  purchasePrice: number; // for profit calculation
  sellingPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber?: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  gstAmount: number;
  totalAmount: number;
  costAmount: number; // total purchase cost
  profitAmount: number; // totalAmount - costAmount
  paymentMethod: PaymentMethod;
  date: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  paymentMethod: 'cash' | 'upi';
  date: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  name?: string;
  productName: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  gstPercent?: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  customerName: string;
  customerMobile?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount?: number;
  discount?: number;
  gstAmount?: number;
  tax?: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod?: 'cash' | 'upi' | 'udhar';
  paymentStatus?: 'paid' | 'partial' | 'unpaid';
  notes?: string;
  createdAt: string;
}

export interface ShopProfile {
  name: string;
  tagline: string;
  ownerName: string;
  mobile: string;
  phone?: string;
  address: string;
  shopType: string;
  gstNumber?: string;
  gstin?: string;
  upiId?: string;
  currency: string;
  isFirstLaunchDone: boolean;
}

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  soundEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // "21:00"
  lowStockAlertEnabled: boolean;
  showAdBanners: boolean;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalCost: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  cashBalance: number;
  upiBalance: number;
  udharGiven: number;
  udharReceived: number;
}

export type ActiveTab = 'home' | 'khata' | 'stock' | 'invoice' | 'reports' | 'settings';
