import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Globe,
  Moon,
  Sun,
  Laptop,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  QrCode,
  Sparkles,
  Check,
} from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '../../i18n/translations';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { AdBanner } from '../common/AdBanner';

export const SettingsView: React.FC = () => {
  const {
    shopProfile,
    updateShopProfile,
    settings,
    updateSettings,
    setLanguage,
    exportBackup,
    importBackup,
    resetToDemoData,
    clearAllData,
    t,
    lang,
    showToast,
  } = useApp();

  // Local state for editing shop profile
  const [name, setName] = useState(shopProfile.name);
  const [ownerName, setOwnerName] = useState(shopProfile.ownerName);
  const [phone, setPhone] = useState(shopProfile.phone);
  const [address, setAddress] = useState(shopProfile.address);
  const [gstin, setGstin] = useState(shopProfile.gstin);
  const [upiId, setUpiId] = useState(shopProfile.upiId);
  const [tagline, setTagline] = useState(shopProfile.tagline);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopProfile({
      name: name.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      gstin: gstin.trim(),
      upiId: upiId.trim(),
      tagline: tagline.trim(),
    });
    showToast('दुकान प्रोफाइल अपडेट हो गया!', undefined, 'success');
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = importBackup(text);
        if (res.success) {
          showToast('डेटा सफलतापूर्वक रिस्टोर हो गया!', undefined, 'success');
        } else {
          showToast('रिस्टोर असफल: ' + (res.error || 'अमान्य फाइल'), undefined, 'error');
        }
      } catch {
        showToast('फाइल पढ़ने में त्रुटि हुई', undefined, 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-6 max-w-5xl mx-auto space-y-4">
      {/* 1. 100% Free Guarantee Banner (Section 1 Core Rule) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="font-extrabold text-sm sm:text-base">{t('noProGuaranteeTitle')}</h3>
          <p className="text-xs text-emerald-100 mt-0.5">{t('noProGuaranteeDesc')}</p>
        </div>
      </div>

      {/* 2. Shop Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>{t('shopProfile')}</span>
          </h3>
          <button
            type="submit"
            className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            {t('save')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('shopName')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('ownerName')}
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('mobileNumber')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('upiId')} (QR कोड पेमेंट के लिए)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="उदा. yourname@upi"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('gstin')}
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="उदा. 07AAAAA0000A1Z5"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              दुकान का पता
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>
      </form>

      {/* 3. Language Selection Section (10 Indian Languages) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{t('language')} (10 भारतीय भाषाएं)</span>
          </h3>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            {AVAILABLE_LANGUAGES.find((l) => l.id === lang)?.nativeName || 'हिन्दी'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
          {AVAILABLE_LANGUAGES.map((item) => {
            const isSelected = lang === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setLanguage(item.id);
                  showToast(`भाषा बदली: ${item.nativeName}`, undefined, 'success');
                }}
                className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm block leading-tight">{item.nativeName}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Theme & Sound Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
          थीम व ऑडियो प्राथमिकताएं (Theme & Display)
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* Theme Selector (Light / Dark / System) */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {settings.theme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {t('theme')} (डार्क / लाइट मोड)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {settings.theme === 'dark'
                    ? 'डार्क मोड सक्रिय (आँखों के लिए आरामदायक)'
                    : settings.theme === 'light'
                    ? 'लाइट मोड सक्रिय'
                    : 'सिस्टम डिफॉल्ट थीम'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  updateSettings({ theme: 'light' });
                  showToast('लाइट थीम सक्रिय', undefined, 'info');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>लाइट</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateSettings({ theme: 'dark' });
                  showToast('डार्क थीम सक्रिय', undefined, 'info');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span>डार्क</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateSettings({ theme: 'system' });
                  showToast('सिस्टम थीम सक्रिय', undefined, 'info');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  settings.theme === 'system'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                <span>सिस्टम</span>
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {settings.soundEffects ? (
                <Volume2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {t('soundEffects')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  बिक्री, खर्च व पेमेंट एंट्री पर कैश रजिस्टर ध्वनि
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                settings.soundEffects
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {settings.soundEffects ? 'ON (चालू)' : 'OFF (बंद)'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Backup & Data Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {t('backupRestore')} (100% Offline Data)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportBackup}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{t('backupExport')}</span>
          </button>

          {/* Import JSON */}
          <label className="cursor-pointer py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>{t('backupRestore')}</span>
            <input type="file" accept=".json" onChange={handleFileRestore} className="hidden" />
          </label>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDemoConfirm(true)}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>डेमो सैंपल डेटा लोड करें</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>पूरा डेटा रीसेट करें</span>
          </button>
        </div>
      </div>

      <AdBanner placement="inline" />

      {/* Clear Data Confirmation */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title={t('clearData')}
        description="क्या आप वाकई सारा डेटा मिटाना चाहते हैं? इसे वापस नहीं लाया जा सकता।"
        confirmLabel="हाँ, रीसेट करें"
        onConfirm={() => {
          clearAllData();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />

      {/* Demo Data Confirmation */}
      <ConfirmDialog
        isOpen={showDemoConfirm}
        title="डेमो डेटा लोड करें?"
        description="यह आपके वर्तमान डेटा की जगह शुरुआत के लिए सैंपल ग्राहक और स्टॉक लोड करेगा।"
        confirmLabel="लोड करें"
        onConfirm={() => {
          resetToDemoData();
          setShowDemoConfirm(false);
        }}
        onCancel={() => setShowDemoConfirm(false)}
      />
    </div>
  );
};
