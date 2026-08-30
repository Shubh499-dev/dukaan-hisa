import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Info } from 'lucide-react';

interface AdBannerProps {
  placement?: 'bottom' | 'inline' | 'calculator';
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement = 'inline' }) => {
  const { settings, t } = useApp();
  const [closed, setClosed] = useState(false);

  if (!settings.showAdBanners || closed) return null;

  const ads = [
    {
      title: 'Bharat QR & SoundBox',
      desc: 'दुकान पर लगाएं 0% कमीशन साउंडबॉक्स। तुरंत पेमेंट अलर्ट!',
      action: 'Learn More',
      badge: 'Ad',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      title: 'Kirana Wholesale Hub',
      desc: 'सीधे फैक्ट्री से तेल, आटा, दाल थोक भाव में मंगाएं।',
      action: 'Order Stock',
      badge: 'Sponsored',
      color: 'from-amber-600 to-orange-700',
    },
    {
      title: 'GST & Bill Printer',
      desc: '3-इंच ब्लूटूथ थर्मल प्रिंटर सिर्फ ₹1,999 में। कैश ऑन डिलीवरी!',
      action: 'Check Price',
      badge: 'Ad',
      color: 'from-emerald-700 to-teal-800',
    },
  ];

  // Pick ad based on timestamp modulo
  const ad = ads[Math.floor(Date.now() / 30000) % ads.length];

  return (
    <div className={`w-full max-w-2xl mx-auto my-3 px-3`}>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3 shadow-md border border-slate-700/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded leading-none">
                {ad.badge}
              </span>
              <h4 className="text-xs font-bold text-slate-100 truncate">{ad.title}</h4>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">{ad.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => window.open('https://google.com', '_blank')}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            {ad.action}
          </button>
          <button
            onClick={() => setClosed(true)}
            title="Close ad"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
