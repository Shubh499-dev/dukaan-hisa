import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Home, Users, Package, Receipt, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, metrics } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'home', label: t('navHome'), icon: Home },
    {
      id: 'khata',
      label: t('navKhata'),
      icon: Users,
      badge: metrics.totalUdharReceivable > 0 ? `₹${Math.round(metrics.totalUdharReceivable / 1000)}k` : undefined,
    },
    {
      id: 'stock',
      label: t('navStock'),
      icon: Package,
      badge: metrics.lowStockCount > 0 ? metrics.lowStockCount : undefined,
    },
    { id: 'invoice', label: t('navInvoice'), icon: Receipt },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] transition-colors shadow-lg">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2.5 px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-amber-500 text-[9px] font-extrabold text-white ring-2 ring-white dark:ring-slate-900">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-5 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
