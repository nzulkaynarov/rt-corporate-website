import { useState, useEffect } from 'react';
import type { Lang } from '../i18n/ui';
import { getCurrentLang } from '../i18n/utils';

/**
 * Universal React hook for reactive language changes across all React islands.
 * Listens to 'rt-lang-change' CustomEvent, storage sync, and [data-lang-switch] clicks.
 */
export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return getCurrentLang();
    }
    return 'ru';
  });

  useEffect(() => {
    const sync = () => {
      const cur = getCurrentLang();
      setLang(cur);
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Lang>;
      if (customEvent.detail && (customEvent.detail === 'ru' || customEvent.detail === 'uz' || customEvent.detail === 'en')) {
        setLang(customEvent.detail);
      } else {
        sync();
      }
    };

    window.addEventListener('rt-lang-change', handleCustomEvent);
    window.addEventListener('storage', sync);

    const handleDomClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-lang-switch]');
      if (target) {
        const newLang = target.getAttribute('data-lang-switch') as Lang;
        if (newLang && (newLang === 'ru' || newLang === 'uz' || newLang === 'en')) {
          setLang(newLang);
        }
      }
    };
    document.addEventListener('click', handleDomClick);

    sync();

    return () => {
      window.removeEventListener('rt-lang-change', handleCustomEvent);
      window.removeEventListener('storage', sync);
      document.removeEventListener('click', handleDomClick);
    };
  }, []);

  return lang;
}

export default useLang;
