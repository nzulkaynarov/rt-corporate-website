import React, { useState, useEffect } from 'react';
import { LeadModal } from './LeadModal';
import type { Locale } from '../../store/modeStore';

export const GlobalLeadManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [locale, setLocale] = useState<Locale>('ru');

  useEffect(() => {
    // Read current language on mount
    const currentLang = (document.documentElement.lang as Locale) || 
      ((typeof localStorage !== 'undefined' ? localStorage.getItem('rt_lang') : null) as Locale) || 
      'ru';
    if (currentLang === 'ru' || currentLang === 'uz' || currentLang === 'en') {
      setLocale(currentLang);
    }

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<Locale>;
      if (customEvent.detail && (customEvent.detail === 'ru' || customEvent.detail === 'uz' || customEvent.detail === 'en')) {
        setLocale(customEvent.detail);
      }
    };

    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ subject?: string }>;
      setSubject(customEvent.detail?.subject || 'Запрос КП / Счета с сайта');
      setIsOpen(true);
    };

    const handleDocClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement | null)?.closest('[data-lead-modal]');
      if (trigger) {
        e.preventDefault();
        const subj = trigger.getAttribute('data-lead-subject') || 'Запрос КП / Счета с сайта';
        setSubject(subj);
        setIsOpen(true);
      }
    };

    window.addEventListener('rt-lang-change', handleLangChange);
    window.addEventListener('open-lead-modal', handleOpen);
    document.addEventListener('click', handleDocClick);

    return () => {
      window.removeEventListener('rt-lang-change', handleLangChange);
      window.removeEventListener('open-lead-modal', handleOpen);
      document.removeEventListener('click', handleDocClick);
    };
  }, []);

  return (
    <LeadModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialSubject={subject}
      locale={locale}
    />
  );
};
