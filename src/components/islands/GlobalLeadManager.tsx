import React, { useState, useEffect } from 'react';
import { LeadModal } from './LeadModal';

export const GlobalLeadManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ subject?: string }>;
      setSubject(customEvent.detail?.subject || '');
      setIsOpen(true);
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-lead-modal]');
      if (target) {
        e.preventDefault();
        const customSubject = target.getAttribute('data-lead-subject') || '';
        setSubject(customSubject);
        setIsOpen(true);
      }
    };

    window.addEventListener('open-lead-modal', handleOpen);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('open-lead-modal', handleOpen);
      document.removeEventListener('click', handleClick);
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
