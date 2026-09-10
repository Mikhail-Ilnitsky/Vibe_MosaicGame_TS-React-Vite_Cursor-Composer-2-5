import { useLanguage } from '../i18n/LanguageContext';
import type { Locale } from '../types';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const buttonClass = (lang: Locale) =>
    `px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
      locale === lang
        ? 'bg-neutral-900 text-white'
        : 'text-neutral-500 hover:text-neutral-800'
    }`;

  return (
    <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
      <button type="button" className={buttonClass('ru')} onClick={() => setLocale('ru')}>
        RU
      </button>
      <button type="button" className={buttonClass('en')} onClick={() => setLocale('en')}>
        EN
      </button>
    </div>
  );
}
