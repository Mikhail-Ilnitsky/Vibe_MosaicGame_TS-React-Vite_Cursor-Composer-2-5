import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Locale } from '../types';
import { t, type TranslationKey } from './translations';

function detectLocale(): Locale {
  return navigator.language.toLowerCase().includes('ru') ? 'ru' : 'en';
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  tr: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  const tr = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      t(locale, key, params),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, tr }),
    [locale, tr],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
