import type { Lang } from './ui';

export function tField<T extends Record<string, any>>(
  item: T,
  field: string,
  lang: Lang = 'ru'
): any {
  if (!item) return '';
  if (lang === 'uz') {
    const uzVal = item[`${field}_uz`];
    if (uzVal !== undefined && uzVal !== null && uzVal !== '') return uzVal;
  }
  if (lang === 'en') {
    const enVal = item[`${field}_en`];
    if (enVal !== undefined && enVal !== null && enVal !== '') return enVal;
  }
  return item[field] || '';
}

export function getCurrentLang(): Lang {
  if (typeof window === 'undefined') return 'ru';
  const param = new URLSearchParams(window.location.search).get('lang') as Lang | null;
  if (param && (param === 'ru' || param === 'uz' || param === 'en')) {
    return param;
  }
  const stored = localStorage.getItem('rt_lang') as Lang | null;
  if (stored && (stored === 'ru' || stored === 'uz' || stored === 'en')) {
    return stored;
  }
  return 'ru';
}

export function setLanguage(lang: Lang) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rt_lang', lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent('rt-lang-change', { detail: lang }));
}
