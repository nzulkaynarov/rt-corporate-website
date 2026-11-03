import React, { useState } from 'react';
import { makeT, type Lang } from '../../i18n';
import { useLang } from '../../utils/useLang';
import formsUi from '../../data/cms/ui/forms.json';
import { buildLeadMessage, fileToBase64, leadContacts, MAX_LEAD_FILE_BYTES, sendLead } from './LeadModal';

const t = makeT([formsUi]);

interface ContactsLeadFormProps {
  lang: Lang;
}

export const ContactsLeadForm: React.FC<ContactsLeadFormProps> = (props) => {
  const lang = useLang(props.lang);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [inn, setInn] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [subject, setSubject] = useState(() => t(lang, 'form.contacts.defaultSubject'));
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > MAX_LEAD_FILE_BYTES) {
        alert(t(lang, 'form.fileTooLarge'));
        return;
      }
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const formattedMsg = buildLeadMessage('lead.message.titleContacts', {
    subject,
    lang,
    name,
    company,
    inn,
    phone,
    message,
    fileName,
  });

  const tgShareUrl = `${leadContacts.telegramUrl}?text=${encodeURIComponent(formattedMsg)}`;
  const mailShareUrl = `mailto:${leadContacts.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedMsg)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setErrorMsg(null);

    try {
      let fileBase64 = '';
      let fileSizeStr = '';
      if (file) {
        fileBase64 = await fileToBase64(file);
        fileSizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      }

      const sent = await sendLead({
        name,
        company,
        inn,
        phone,
        subject,
        message,
        comment: message,
        fileName: fileName || undefined,
        fileBase64: fileBase64 || undefined,
        fileSize: fileSizeStr || undefined,
        source: 'railtech-contacts-page',
        timestamp: new Date().toISOString(),
        locale: lang,
      });

      // Never show a fake success: if the lead was not delivered, surface the error
      // so the user can resend via Telegram / phone buttons below the form.
      if (!sent) {
        throw new Error('Lead webhook is not configured or returned an error');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setCompany('');
        setInn('');
        setPhone('+998 ');
        setMessage('');
        setFile(null);
        setFileName('');
      }, 4000);
    } catch (err: any) {
      console.error('[ContactsForm] Error:', err);
      setErrorMsg(t(lang, 'form.contacts.errorMessage'));
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="hud-glass-card p-6 font-mono text-center space-y-3">
        <div className="inline-block bg-[#0A0A0A] text-white px-4 py-1.5 font-bold uppercase text-xs">
          {t(lang, 'form.contacts.successBadge')}
        </div>
        <p className="text-xs text-[#4A5056] font-sans">
          {t(lang, 'form.contacts.successMessage')}
        </p>
      </div>
    );
  }

  return (
    <div className="hud-glass-card p-6 font-mono">
      <div className="border-b border-[#0A0A0A] pb-2 mb-4">
        <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block">
          {t(lang, 'form.contacts.title')}
        </span>
        <span className="text-[11px] text-[#4A5056]">
          {t(lang, 'form.contacts.subtitle')}
        </span>
      </div>

      {errorMsg && (
        <div className="border border-[#0A0A0A] bg-red-100 text-red-900 p-2.5 text-xs font-mono mb-3">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
            {t(lang, 'form.contacts.subjectLabel')}
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              {t(lang, 'form.contacts.nameLabel')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(lang, 'form.contacts.namePlaceholder')}
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              {t(lang, 'form.contacts.phoneLabel')}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              {t(lang, 'form.contacts.companyLabel')}
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t(lang, 'form.contacts.companyPlaceholder')}
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              {t(lang, 'form.contacts.innLabel')}
            </label>
            <input
              type="text"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              placeholder={t(lang, 'form.contacts.innPlaceholder')}
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
            {t(lang, 'form.contacts.messageLabel')}
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t(lang, 'form.contacts.messagePlaceholder')}
            className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
            {t(lang, 'form.contacts.fileLabel')}
          </label>
          <div className="flex items-center space-x-2">
            <label className="border border-[#0A0A0A] bg-white hover:bg-[#0A0A0A] hover:text-white px-3 py-1 text-xs cursor-pointer transition-colors">
              <span>{t(lang, 'form.contacts.fileButton')}</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip,.rar,.jpg,.png"
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-[#4A5056] truncate max-w-[200px]">
              {fileName || t(lang, 'form.contacts.fileNone')}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSending}
            className="w-full border border-[#0A0A0A] bg-[#0A0A0A] text-white py-2 text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#0A0A0A] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSending ? t(lang, 'form.contacts.sending') : t(lang, 'form.contacts.submit')}
          </button>
        </div>

        <div className="pt-2 border-t border-[#0A0A0A]/20 flex flex-wrap gap-2 text-[10px]">
          <a
            href={tgShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-[#0A0A0A]/40 bg-[#C8CDD2] py-1.5 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            {t(lang, 'form.contacts.telegramLink')}
          </a>
          <a
            href={mailShareUrl}
            className="flex-1 text-center border border-[#0A0A0A]/40 bg-[#C8CDD2] py-1.5 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            {t(lang, 'form.contacts.emailLink')}
          </a>
        </div>
      </form>
    </div>
  );
};

export default ContactsLeadForm;
