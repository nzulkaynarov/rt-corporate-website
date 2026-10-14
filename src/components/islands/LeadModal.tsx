import React, { useState } from 'react';
import type { Locale } from '../../store/modeStore';
import { UI_STRINGS } from '../../store/modeStore';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
  locale?: Locale;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  initialSubject = '',
  locale = 'ru',
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [inn, setInn] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [comment, setComment] = useState(initialSubject);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const t = UI_STRINGS[locale]?.modal || UI_STRINGS.ru.modal;

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 25 * 1024 * 1024) {
        alert(locale === 'uz' ? 'Fayl hajmi 25 MB dan oshmasligi kerak' : locale === 'en' ? 'File size must be under 25 MB' : 'Размер файла не должен превышать 25 МБ');
        return;
      }
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data:application/...;base64, prefix
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(f);
    });
  };

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

      const payload = {
        name,
        company,
        inn,
        phone,
        comment,
        locale,
        fileName: file ? file.name : '',
        fileSize: fileSizeStr,
        fileBase64,
        timestamp: new Date().toISOString(),
      };

      const webhookUrl = import.meta.env.PUBLIC_WEBHOOK_URL;

      if (webhookUrl && webhookUrl.trim() !== '') {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
      } else {
        // Fallback / local development simulation:
        console.info('[RailTech Lead] PUBLIC_WEBHOOK_URL not configured. Form payload prepared:', payload);
        await new Promise((r) => setTimeout(r, 600));
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        // Reset form
        setName('');
        setCompany('');
        setInn('');
        setPhone('+998 ');
        setComment('');
        setFile(null);
        setFileName('');
      }, 2400);
    } catch (err: any) {
      console.error('[LeadModal] Dispatch error:', err);
      setErrorMsg(t.errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/60 backdrop-blur-xs p-4">
      <div className="bg-[#D4D8DC] border border-[#0A0A0A] w-full max-w-lg p-6 font-mono text-xs relative shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-[#0A0A0A] pb-3 mb-5">
          <div>
            <span className="font-bold uppercase tracking-tight">{t.badge}</span>
            <div className="text-[10px] text-[#4A5056]">{t.locationMeta}</div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 border border-[#0A0A0A] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="inline-block bg-[#0A0A0A] text-white px-4 py-1.5 font-bold uppercase">
              {t.successBadge}
            </div>
            <p className="text-[#4A5056] font-sans text-sm">
              {t.successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="border border-[#0A0A0A] bg-red-100 text-red-900 p-2.5 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1">
                  {t.companyLabel}
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t.companyPlaceholder}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1">
                  {t.innLabel}
                </label>
                <input
                  type="text"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  placeholder={t.innPlaceholder}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#4A5056] mb-1">
                {t.taskLabel}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.taskPlaceholder}
                className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#4A5056] mb-1">
                {t.fileLabel}
              </label>
              <label className="flex items-center justify-between border border-dashed border-[#0A0A0A] bg-[#DCE0E4]/60 px-3 py-2.5 cursor-pointer hover:bg-white transition-colors">
                <span className="truncate">{fileName || t.fileDefault}</span>
                <span className="bg-[#0A0A0A] text-white px-2 py-0.5 text-[10px] uppercase shrink-0 ml-2">
                  {t.fileButton}
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.pdf,.doc,.docx,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="px-4 py-2 border border-[#0A0A0A] hover:bg-[#0A0A0A]/10 uppercase transition-colors"
              >
                {t.cancelButton}
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2 bg-[#0A0A0A] text-white font-bold uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSending ? t.sendingButton : t.submitButton}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
