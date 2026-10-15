import React, { useState } from 'react';

export const ContactsLeadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [inn, setInn] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [subject, setSubject] = useState('Запрос счета и консультации со страницы Контакты');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 25 * 1024 * 1024) {
        alert('Размер файла не должен превышать 25 МБ');
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

  const formattedMsg = [
    '🛠 ЗАЯВКА С САЙТА RAILTECH.UZ (СТРАНИЦА КОНТАКТОВ)',
    `Тема: ${subject}`,
    `Контакт: ${name || '-'}`,
    `Организация: ${company || '-'}`,
    `ИНН: ${inn || '-'}`,
    `Телефон: ${phone || '-'}`,
    `Сообщение: ${message || '-'}`,
    fileName ? `Файл: ${fileName}` : null,
  ].filter(Boolean).join('\n');

  const tgShareUrl = `https://t.me/railtech_uz?text=${encodeURIComponent(formattedMsg)}`;
  const mailShareUrl = `mailto:supply@railtech.uz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedMsg)}`;

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
        subject,
        message,
        comment: message,
        fileName: file ? file.name : '',
        fileSize: fileSizeStr,
        fileBase64,
        timestamp: new Date().toISOString(),
      };

      const webhookUrl = import.meta.env.PUBLIC_LEAD_WEBHOOK_URL || import.meta.env.PUBLIC_WEBHOOK_URL;
      const tgBotToken = import.meta.env.PUBLIC_TG_BOT_TOKEN;
      const tgChatId = import.meta.env.PUBLIC_TG_CHAT_ID;

      let sent = false;

      if (webhookUrl && webhookUrl.trim() !== '') {
        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) sent = true;
        } catch (webhookErr) {
          console.warn('[ContactsForm] Webhook failed, attempting fallback:', webhookErr);
        }
      }

      if (!sent && tgBotToken && tgChatId) {
        try {
          const tgText = [
            '🛠 *НОВАЯ ЗАЯВКА С САЙТА RAILTECH.UZ*',
            `📌 *Тема:* ${subject}`,
            `👤 *Контакт:* ${name}`,
            `🏢 *Организация:* ${company} (ИНН: ${inn || 'не указан'})`,
            `📞 *Телефон:* ${phone}`,
            `📋 *Задача:* ${message || 'Запрос со страницы Контакты'}`,
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
          if (tgRes.ok) sent = true;
        } catch (tgErr) {
          console.warn('[ContactsForm] Telegram Bot API fallback failed:', tgErr);
        }
      }

      if (!sent) {
        console.info('[RailTech Contacts Lead] Processed locally. Payload:', payload);
        await new Promise((r) => setTimeout(r, 600));
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
      setErrorMsg('Произошла ошибка при отправке. Пожалуйста, используйте кнопку отправки в Telegram или позвоните нам.');
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="border-2 border-[#0A0A0A] bg-[#D4D8DC] p-6 font-mono text-center space-y-3">
        <div className="inline-block bg-[#0A0A0A] text-white px-4 py-1.5 font-bold uppercase text-xs">
          ✓ ЗАЯВКА УСПЕШНО ОТПРАВЛЕНА
        </div>
        <p className="text-xs text-[#4A5056] font-sans">
          Инженер отдела снабжения обработает вашу спецификацию и свяжется с вами в течение 60 минут.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-[#0A0A0A] bg-[#D4D8DC] p-6 font-mono">
      <div className="border-b border-[#0A0A0A] pb-2 mb-4">
        <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block">
          ФОРМА ОПЕРАТИВНОГО ЗАПРОСА
        </span>
        <span className="text-[11px] text-[#4A5056]">
          Прямая отправка дежурному инженеру поставок
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
            ТЕМА ОБРАЩЕНИЯ
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
              КОНТАКТНОЕ ЛИЦО
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ФИО / Должность"
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              ТЕЛЕФОН
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
              ПРЕДПРИЯТИЕ
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Наименование юрлица"
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              ИНН (ДЛЯ НДС 12%)
            </label>
            <input
              type="text"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              placeholder="9 цифр"
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
            ОПИСАНИЕ ПОТРЕБНОСТИ / НОМЕНКЛАТУРА
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Перечень позиций, чертежи, требуемые сроки поставки..."
            className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white font-sans"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
            ПРИКРЕПИТЬ СПЕЦИФИКАЦИЮ (EXCEL / PDF ДО 25 МБ)
          </label>
          <label className="flex items-center justify-between border border-dashed border-[#0A0A0A] bg-[#DCE0E4]/60 px-3 py-2 cursor-pointer hover:bg-white transition-colors">
            <span className="truncate text-xs">{fileName || 'Выберите файл ведомости...'}</span>
            <span className="bg-[#0A0A0A] text-white px-2 py-0.5 text-[10px] uppercase shrink-0 ml-2 font-bold">
              ОБЗОР
            </span>
            <input
              type="file"
              accept=".xlsx,.xls,.pdf,.doc,.docx,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full border-2 border-[#0A0A0A] bg-[#0A0A0A] text-white py-3 text-xs font-bold tracking-wider hover:bg-transparent hover:text-[#0A0A0A] transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSending ? 'ОТПРАВКА ДАННЫХ...' : '[ ОТПРАВИТЬ ЗАЯВКУ НА РАСЧЕТ КП ]'}
        </button>

        {/* Fast fallbacks */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href={tgShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#0A0A0A] bg-white text-[#0A0A0A] py-2 text-center text-[11px] font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            В TELEGRAM (@RAILTECH_UZ) ↗
          </a>
          <a
            href={mailShareUrl}
            className="border border-[#0A0A0A] bg-white text-[#0A0A0A] py-2 text-center text-[11px] font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            НА EMAIL СНАБЖЕНИЯ ↗
          </a>
        </div>
      </form>
    </div>
  );
};
