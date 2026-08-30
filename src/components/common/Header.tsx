import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_LANGUAGES } from '../../i18n/translations';
import { Store, Globe, Moon, Sun, ShieldCheck, Settings, X, Check } from 'lucide-react';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenReminders?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { shopProfile, settings, setLanguage, toggleTheme, setActiveTab, t, lang, showToast } = useApp();
  const [showLangModal, setShowLangModal] = useState(false);

  const currentLangObj = AVAILABLE_LANGUAGES.find((l) => l.id === lang) || AVAILABLE_LANGUAGES[0];

  return (
    <>
      <header className="sticky top-0 z-30 bg-emerald-700 dark:bg-emerald-900 text-white shadow-md border-b border-emerald-800 dark:border-emerald-950 transition-colors">
        {/* Top Banner / Branding */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Shop Logo & Name */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Store className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg truncate leading-tight tracking-tight">
                  {shopProfile.name || t('appName')}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-800/80 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-600/50">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  {t('offlineBadge')}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 truncate font-normal">
                {shopProfile.tagline || t('appTagline')}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language Switcher Modal Trigger */}
            <button
              onClick={() => setShowLangModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-900 text-xs font-bold text-emerald-50 border border-emerald-600/60 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="भाषा चुनें / Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>{currentLangObj.nativeName}</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors cursor-pointer"
              title={settings.theme === 'dark' ? 'लाइट मोड चालू करें' : 'डार्क मोड चालू करें'}
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-200" />
              )}
            </button>

            {/* Settings Link */}
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors cursor-pointer"
              title={t('navSettings')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Language Selector Modal (10 Indian Languages) */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    {t('language')} चुनें / Choose Language
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    10 भारतीय भाषाओं में पूरा हिसाब उपलब्ध है
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLangModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {AVAILABLE_LANGUAGES.map((item) => {
                const isSelected = lang === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setLanguage(item.id);
                      setShowLangModal(false);
                      showToast(`भाषा बदली: ${item.nativeName}`, undefined, 'success');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-sm block leading-tight">{item.nativeName}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowLangModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
