import React, { useState, useEffect } from 'react';
import { LeadModal } from './LeadModal';

export const GlobalLeadManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');

  useEffect(() => {
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

    window.addEventListener('open-lead-modal', handleOpen);
    document.addEventListener('click', handleDocClick);

    return () => {
      window.removeEventListener('open-lead-modal', handleOpen);
      document.removeEventListener('click', handleDocClick);
    };
  }, []);

  return (
    <LeadModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialSubject={subject}
    />
  );
};
