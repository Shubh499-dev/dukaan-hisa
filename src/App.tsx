import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { QuickActionModal } from './components/common/QuickActionModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

// Screens
import { HomeDashboard } from './components/home/HomeDashboard';
import { KhataView } from './components/khata/KhataView';
import { StockView } from './components/stock/StockView';
import { InvoiceView } from './components/invoice/InvoiceView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Top App Header */}
      <Header />

      {/* Main Screen Router */}
      <main className="flex-1 w-full overflow-y-auto">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'khata' && <KhataView />}
        {activeTab === 'stock' && <StockView />}
        {activeTab === 'invoice' && <InvoiceView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Persistent Bottom Tab Bar */}
      <BottomNav />

      {/* Global Quick Action Add Modal (+ Sale, + Expense, + Udhar, + Payment, etc.) */}
      <QuickActionModal />

      {/* First Run Onboarding Modal */}
      <OnboardingModal />

      {/* Unified Toast Notifier */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
