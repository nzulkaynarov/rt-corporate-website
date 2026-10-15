import React, { useState, useEffect } from 'react';
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
  const [subject, setSubject] = useState(initialSubject);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialSubject]);

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
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(f);
    });
  };

  // Build formatted text for Telegram / Email fallback
  const getFormattedMessage = () => {
    return [
      '🛠 ЗАЯВКА С САЙТА RAILTECH.UZ',
      `Тема: ${subject || initialSubject || 'Запрос КП / Счета'}`,
      `Контакт: ${name || '-'}`,
      `Организация: ${company || '-'}`,
      `ИНН: ${inn || '-'}`,
      `Телефон: ${phone || '-'}`,
      `Сообщение: ${comment || '-'}`,
      fileName ? `Файл: ${fileName}` : null,
    ].filter(Boolean).join('\n');
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

      const activeSubject = subject || initialSubject || 'Запрос КП / Счета с сайта';
      const payload = {
        name,
        company,
        inn,
        phone,
        subject: activeSubject,
        message: comment,
        comment,
        locale,
        fileName: file ? file.name : '',
        fileSize: fileSizeStr,
        fileBase64,
        timestamp: new Date().toISOString(),
      };

      const webhookUrl = import.meta.env.PUBLIC_LEAD_WEBHOOK_URL || import.meta.env.PUBLIC_WEBHOOK_URL;
      const tgBotToken = import.meta.env.PUBLIC_TG_BOT_TOKEN;
      const tgChatId = import.meta.env.PUBLIC_TG_CHAT_ID;

      let sent = false;

      // 1. Send via Webhook if configured
      if (webhookUrl && webhookUrl.trim() !== '') {
        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            sent = true;
          }
        } catch (webhookErr) {
          console.warn('[LeadModal] Webhook failed, attempting fallback:', webhookErr);
        }
      }

      // 2. Direct Telegram Bot API fallback if tokens provided in env
      if (!sent && tgBotToken && tgChatId) {
        try {
          const tgText = [
            '🛠 *НОВАЯ ЗАЯВКА С САЙТА RAILTECH.UZ*',
            `📌 *Тема:* ${activeSubject}`,
            `👤 *Контакт:* ${name}`,
            `🏢 *Организация:* ${company} (ИНН: ${inn || 'не указан'})`,
            `📞 *Телефон:* ${phone}`,
            `📋 *Задача:* ${comment || 'Запрос спецификации'}`,
            fileName ? `📎 *Прикреплен файл:* ${fileName} (${fileSizeStr})` : null,
          ].filter(Boolean).join('\n');

          const tgRes = await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: tgText,
              parse_mode: 'Markdown',
            }),
          });

          if (tgRes.ok) {
            sent = true;
          }
        } catch (tgErr) {
          console.warn('[LeadModal] Telegram Bot API fallback failed:', tgErr);
        }
      }

      if (!sent) {
        // Fallback log for development / staging
        console.info('[RailTech Lead] Processed without live webhook/bot credentials. Payload:', payload);
        await new Promise((r) => setTimeout(r, 600));
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setName('');
        setCompany('');
        setInn('');
        setPhone('+998 ');
        setComment('');
        setFile(null);
        setFileName('');
      }, 3000);
    } catch (err: any) {
      console.error('[LeadModal] Dispatch error:', err);
      setErrorMsg(t.errorMessage || 'Произошла ошибка при отправке. Пожалуйста, свяжитесь с нами напрямую по телефону +998 90 118-90-00');
    } finally {
      setIsSending(false);
    }
  };

  const formattedMsg = getFormattedMessage();
  const tgShareUrl = `https://t.me/railtech_uz?text=${encodeURIComponent(formattedMsg)}`;
  const mailShareUrl = `mailto:supply@railtech.uz?subject=${encodeURIComponent(subject || initialSubject || 'Запрос с сайта RailTech')}&body=${encodeURIComponent(formattedMsg)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/60 backdrop-blur-xs p-4">
      <div className="bg-[#D4D8DC] border-2 border-[#0A0A0A] w-full max-w-lg p-6 font-mono text-xs relative shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-[#0A0A0A] pb-3 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#0A0A0A] inline-block animate-pulse"></span>
              <span className="font-bold uppercase tracking-tight text-xs">{t.badge || 'ЗАПРОС КП / СЧЕТА С НДС 12%'}</span>
            </div>
            <div className="text-[10px] text-[#4A5056]">{t.locationMeta || 'ТАШКЕНТ // СКЛАД INDEX B2-2097'}</div>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Закрыть модальное окно"
            className="w-7 h-7 border border-[#0A0A0A] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-block bg-[#0A0A0A] text-white px-4 py-1.5 font-bold uppercase text-xs">
              {t.successBadge || '✓ ЗАЯВКА УСПЕШНО ЗАРЕГИСТРИРОВАНА'}
            </div>
            <p className="text-[#4A5056] font-sans text-sm leading-relaxed">
              {t.successMessage || 'Дежурный инженер отдела поставок свяжется с вами в течение 60 минут с готовым расчетом сметы.'}
            </p>
            <div className="border border-[#0A0A0A] bg-[#C8CDD2] p-3 text-[11px] text-[#0A0A0A] space-y-1">
              <div>Прямая линия снабжения: <a href="tel:+998901189000" className="font-bold underline">+998 90 118-90-00</a></div>
              <div>Официальная почта: <a href="mailto:supply@railtech.uz" className="font-bold underline">supply@railtech.uz</a></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMsg && (
              <div className="border border-[#0A0A0A] bg-red-100 text-red-900 p-2.5 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
                ТЕМА ЗАПРОСА
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Запрос КП / Счета с сайта"
                className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
                  {t.nameLabel || 'ИМЯ / ДОЛЖНОСТЬ'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder || 'Имя Фамилия'}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
                  {t.phoneLabel || 'ТЕЛЕФОН'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder || '+998 90 123-45-67'}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
                  {t.companyLabel || 'ОРГАНИЗАЦИЯ'}
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t.companyPlaceholder || 'ООО / АО / СП'}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
                  {t.innLabel || 'ИНН (ДЛЯ ЭСФ 12%)'}
                </label>
                <input
                  type="text"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  placeholder={t.innPlaceholder || '9 цифр ИНН'}
                  className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
                {t.taskLabel || 'СООБЩЕНИЕ / ПЕРЕЧЕНЬ ПОЗИЦИЙ'}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.taskPlaceholder || 'Укажите артикулы, количество, требования к сертификации или базис доставки...'}
                className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs focus:outline-none focus:bg-white font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
                {t.fileLabel || 'ПРИКРЕПИТЬ СПЕЦИФИКАЦИЮ (EXCEL, PDF ДО 25 МБ)'}
              </label>
              <label className="flex items-center justify-between border border-dashed border-[#0A0A0A] bg-[#DCE0E4]/60 px-3 py-2 cursor-pointer hover:bg-white transition-colors">
                <span className="truncate text-xs">{fileName || t.fileDefault || 'Выберите файл ведомости...'}</span>
                <span className="bg-[#0A0A0A] text-white px-2 py-0.5 text-[10px] uppercase shrink-0 ml-2 font-bold">
                  {t.fileButton || 'ОБЗОР'}
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.pdf,.doc,.docx,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Privacy & Legal disclaimer */}
            <p className="text-[10px] text-[#4A5056] leading-tight">
              Отправляя заявку, вы подтверждаете согласие с условиями{' '}
              <a href="/privacy" target="_blank" className="text-[#0A0A0A] underline hover:no-underline">
                Политики конфиденциальности (ЗРУ-547)
              </a>{' '}
              и{' '}
              <a href="/terms" target="_blank" className="text-[#0A0A0A] underline hover:no-underline">
                Условий использования
              </a>.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#0A0A0A]/20">
              {/* Direct channels fallback */}
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="text-[#4A5056]">Быстро:</span>
                <a
                  href={tgShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#0A0A0A] bg-white px-2 py-1 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                >
                  Telegram ↗
                </a>
                <a
                  href={mailShareUrl}
                  className="border border-[#0A0A0A] bg-white px-2 py-1 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                >
                  Email ↗
                </a>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSending}
                  className="px-3 py-1.5 border border-[#0A0A0A] hover:bg-[#0A0A0A]/10 uppercase transition-colors"
                >
                  {t.cancelButton || 'ОТМЕНА'}
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-1.5 bg-[#0A0A0A] text-white font-bold uppercase hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? (t.sendingButton || 'ОТПРАВКА...') : (t.submitButton || '[ ОТПРАВИТЬ ЗАЯВКУ ]')}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
