import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { businessTypes } from '../../i18n/translations';
import { Store, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingModal: React.FC = () => {
  const { shopProfile, updateShopProfile, t, lang } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shopName, setShopName] = useState(shopProfile.name || '');
  const [ownerName, setOwnerName] = useState(shopProfile.ownerName || '');
  const [shopType, setShopType] = useState(shopProfile.shopType || 'kirana');

  if (shopProfile.isFirstLaunchDone) return null;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) return;
    setStep(2);
  };

  const handleNextStep2 = (selectedType: string) => {
    setShopType(selectedType);
    setStep(3);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleFinish = () => {
    updateShopProfile({
      name: shopName.trim() || 'मेरी दुकान',
      ownerName: ownerName.trim() || 'दुकानदार',
      shopType,
      isFirstLaunchDone: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-emerald-600 dark:bg-emerald-500'
                    : s < step
                    ? 'w-5 bg-emerald-400 dark:bg-emerald-700'
                    : 'w-5 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Step {step} of 3
          </span>
        </div>

        {/* Step 1: Shop Name */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {t('step1Title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('appTagline')}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('shopName')} *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder={t('step1Placeholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-semibold text-base focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('ownerName')}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="उदा. रमेश कुमार"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!shopName.trim()}
              className="w-full mt-6 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
            >
              <span>{t('next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Shop Type */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {t('step2Title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                अपनी दुकान का प्रकार चुनें ताकि हिसाब आसान हो जाए
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {businessTypes.map((item) => {
                const isSelected = shopType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNextStep2(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 font-medium'
                    }`}
                  >
                    <span className="text-xs sm:text-sm truncate">
                      {lang === 'hi' ? item.labelHi : item.labelEn}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {t('freeBadge')}
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {t('step3Title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('shopName')}:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('noProVersionNotice')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
            >
              <span>{t('startUsingApp')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
