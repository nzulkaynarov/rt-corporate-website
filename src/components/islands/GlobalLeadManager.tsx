import React, { useState, useEffect } from 'react';
import { LeadModal } from './LeadModal';
import { makeT, type Lang } from '../../i18n';
import { useLang } from '../../utils/useLang';
import formsUi from '../../data/cms/ui/forms.json';

const t = makeT([formsUi]);

interface GlobalLeadManagerProps {
  lang: Lang;
}

/**
 * Single lead modal per page. Opened by any `[data-lead-modal]` element
 * (subject from `data-lead-subject`) or by
 * `window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { subject } }))`.
 */
export const GlobalLeadManager: React.FC<GlobalLeadManagerProps> = (props) => {
  const lang = useLang(props.lang);
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    // Internal subject for the sales team — always Russian.
    const defaultSubject = t(lang, 'lead.subject.siteDefault');

    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ subject?: string }>;
      setSubject(customEvent.detail?.subject || defaultSubject);
      setIsOpen(true);
    };

    const handleDocClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement | null)?.closest('[data-lead-modal]');
      if (trigger) {
        e.preventDefault();
        setSubject(trigger.getAttribute('data-lead-subject') || defaultSubject);
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
      lang={lang}
    />
  );
};

export default GlobalLeadManager;
