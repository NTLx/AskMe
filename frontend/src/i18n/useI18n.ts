import { useMemo } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { en, zh } from './dictionaries';

export type TranslationDict = typeof en;

function detectSystemLanguage(): 'en' | 'zh' {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
}

export function useI18n() {
  const language = useSettingsStore((s) => s.language);

  const dict: TranslationDict = useMemo(() => {
    if (language === 'system') {
      return detectSystemLanguage() === 'zh' ? zh : en;
    }
    return language === 'zh' ? zh : en;
  }, [language]);

  const t = (key: keyof TranslationDict): string => {
    return dict[key] ?? key;
  };

  return { t, language, dict };
}
