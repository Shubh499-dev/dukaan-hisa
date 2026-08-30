import { Language } from '../types';

export const formatCurrency = (amount: number | undefined | null, showSymbol = true): string => {
  const val = Number(amount) || 0;
  // Indian number system formatting (lakhs, crores)
  const formatted = val.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(val) ? 0 : 2,
  });
  return showSymbol ? `₹${formatted}` : formatted;
};

export const formatDate = (dateString: string, lang: Language = 'hi'): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };

    if (lang === 'hi') {
      return date.toLocaleDateString('hi-IN', options);
    }
    return date.toLocaleDateString('en-IN', options);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string, lang: Language = 'hi'): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dateFormatted = formatDate(dateString, lang);
    const timeFormatted = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${dateFormatted}, ${timeFormatted}`;
  } catch {
    return dateString;
  }
};

export const generateWhatsAppLink = (mobile: string, message: string): string => {
  // Clean phone number (strip spaces, dashes, +91)
  let cleanNumber = mobile.replace(/[^0-9]/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber;
  }
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

export const generateDirectWhatsAppShare = (message: string): string => {
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?text=${encodedText}`;
};
