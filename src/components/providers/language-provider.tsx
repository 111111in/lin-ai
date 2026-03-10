'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { STORAGE_KEYS } from '@/lib/constants';
import { DEFAULT_LOCALE, Locale, translate } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored =
        typeof window !== 'undefined'
          ? (window.localStorage.getItem(
              STORAGE_KEYS.LANGUAGE
            ) as Locale | null)
          : null;

      if (stored === 'zh') {
        setLocaleState(stored);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = 'zh-CN';
        }
        return;
      }

      if (typeof document !== 'undefined') {
        document.documentElement.lang = 'zh-CN';
      }
    } catch {
      // Ignore errors and fall back to default locale
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    // 现在仅支持中文，强制为 zh
    const finalLocale: Locale = 'zh';
    setLocaleState(finalLocale);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEYS.LANGUAGE, finalLocale);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = 'zh-CN';
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => translate(locale, key)
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
