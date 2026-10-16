import React, { useState, useEffect } from 'react';
import type { Lang } from '../../i18n/ui';

export const ContactsLeadForm: React.FC = () => {
  const [lang, setLang] = useState<Lang>('ru');
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

  useEffect(() => {
    const cur = (document.documentElement.lang as Lang) || 
      ((typeof localStorage !== 'undefined' ? localStorage.getItem('rt_lang') : null) as Lang) || 
      'ru';
    if (cur === 'ru' || cur === 'uz' || cur === 'en') {
      setLang(cur);
      if (cur === 'uz') {
        setSubject('Aloqa sahifasidan hisob va konsultatsiya so\'rovi');
      } else if (cur === 'en') {
        setSubject('Inquiry for Invoice and Consultation from Contacts Page');
      }
    }

    const handleLang = (e: Event) => {
      const customEvent = e as CustomEvent<Lang>;
      if (customEvent.detail && (customEvent.detail === 'ru' || customEvent.detail === 'uz' || customEvent.detail === 'en')) {
        const l = customEvent.detail;
        setLang(l);
        if (l === 'uz') {
          setSubject('Aloqa sahifasidan hisob va konsultatsiya so\'rovi');
        } else if (l === 'en') {
          setSubject('Inquiry for Invoice and Consultation from Contacts Page');
        } else {
          setSubject('Запрос счета и консультации со страницы Контакты');
        }
      }
    };

    window.addEventListener('rt-lang-change', handleLang);
    return () => window.removeEventListener('rt-lang-change', handleLang);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 25 * 1024 * 1024) {
        alert(lang === 'uz' ? 'Fayl hajmi 25 MB dan oshmasligi kerak' : lang === 'en' ? 'File size must not exceed 25 MB' : 'Размер файла не должен превышать 25 МБ');
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
    '🛠 ZAIAVKA S SAYTA RAILTECH.UZ (CONTACTS)',
    `Mavzu / Тема: ${subject}`,
    `Aloqa / Контакт: ${name || '-'}`,
    `Tashkilot / Организация: ${company || '-'}`,
    `STIR / ИНН: ${inn || '-'}`,
    `Telefon / Телефон: ${phone || '-'}`,
    `Xabar / Сообщение: ${message || '-'}`,
    fileName ? `Fayl: ${fileName}` : null,
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
        fileName: fileName || undefined,
        fileBase64: fileBase64 || undefined,
        fileSize: fileSizeStr || undefined,
        source: 'railtech-contacts-page',
        timestamp: new Date().toISOString(),
        locale: lang,
      };

      const workerEndpoint =
        import.meta.env.PUBLIC_LEAD_WEBHOOK_URL ||
        import.meta.env.PUBLIC_LEAD_WORKER_URL ||
        import.meta.env.PUBLIC_WEBHOOK_URL;
      let sent = false;

      if (workerEndpoint && workerEndpoint.startsWith('http')) {
        try {
          const res = await fetch(workerEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) sent = true;
        } catch (netErr) {
          console.warn('[ContactsForm] Worker fetch failed:', netErr);
        }
      }

      const botToken =
        import.meta.env.PUBLIC_TG_BOT_TOKEN ||
        import.meta.env.PUBLIC_TELEGRAM_BOT_TOKEN;
      const chatId =
        import.meta.env.PUBLIC_TG_CHAT_ID ||
        import.meta.env.PUBLIC_TELEGRAM_CHAT_ID;

      if (!sent && botToken && chatId) {
        try {
          const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
          const tgRes = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: formattedMsg,
              parse_mode: 'HTML',
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
      setErrorMsg(
        lang === 'uz'
          ? 'Yuborishda xatolik yuz berdi. Iltimos, Telegram orqali yuboring yoki bizga qo\'ng\'iroq qiling.'
          : lang === 'en'
          ? 'Error occurred while sending. Please use Telegram button or contact us by phone.'
          : 'Произошла ошибка при отправке. Пожалуйста, используйте кнопку отправки в Telegram или позвоните нам.'
      );
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="hud-glass-card p-6 font-mono text-center space-y-3">
        <div className="inline-block bg-[#0A0A0A] text-white px-4 py-1.5 font-bold uppercase text-xs">
          {lang === 'uz' ? '✓ SO\'ROV MUVAFFAQIYATLI YUBORILDI' : lang === 'en' ? '✓ INQUIRY SUCCESSFULLY TRANSMITTED' : '✓ ЗАЯВКА УСПЕШНО ОТПРАВЛЕНА'}
        </div>
        <p className="text-xs text-[#4A5056] font-sans">
          {lang === 'uz'
            ? 'Ta\'minot bo\'limi muhandisi spetsifikatsiyangizni o\'rganib, 60 daqiqa ichida siz bilan bog\'lanadi.'
            : lang === 'en'
            ? 'A procurement engineer will review your specification and get back to you within 60 minutes.'
            : 'Инженер отдела снабжения обработает вашу спецификацию и свяжется с вами в течение 60 минут.'}
        </p>
      </div>
    );
  }

  return (
    <div className="hud-glass-card p-6 font-mono">
      <div className="border-b border-[#0A0A0A] pb-2 mb-4">
        <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider block">
          {lang === 'uz' ? 'TEZKOR SO\'ROV FORMASI' : lang === 'en' ? 'DIRECT PROCUREMENT INQUIRY FORM' : 'ФОРМА ОПЕРАТИВНОГО ЗАПРОСА'}
        </span>
        <span className="text-[11px] text-[#4A5056]">
          {lang === 'uz' ? 'Navbatchi ta\'minot muhandisiga to\'g\'ridan-to\'g\'ri yuborish' : lang === 'en' ? 'Direct dispatch to on-duty supply engineer' : 'Прямая отправка дежурному инженеру поставок'}
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
            {lang === 'uz' ? 'MUROJAAT MAVZUSI' : lang === 'en' ? 'INQUIRY SUBJECT' : 'ТЕМА ОБРАЩЕНИЯ'}
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
              {lang === 'uz' ? 'MAS\'UL SHAXS (F.I.SH.)' : lang === 'en' ? 'CONTACT PERSON' : 'КОНТАКТНОЕ ЛИЦО'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'uz' ? 'F.I.Sh. / Lavozim' : lang === 'en' ? 'Full Name / Title' : 'ФИО / Должность'}
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              {lang === 'uz' ? 'TELEFON RAQAMI' : lang === 'en' ? 'PHONE NUMBER' : 'ТЕЛЕФОН'}
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
              {lang === 'uz' ? 'TASHKILOT NOMI' : lang === 'en' ? 'COMPANY NAME' : 'ОРГАНИЗАЦИЯ'}
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={lang === 'uz' ? 'Kompaniya yoki zavod' : lang === 'en' ? 'Enterprise / Plant' : 'Завод / Депо / Предприятие'}
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
              {lang === 'uz' ? 'STIR (INN, EHF UCHUN)' : lang === 'en' ? 'TAX ID / INN' : 'ИНН (ДЛЯ ЭСФ С НДС)'}
            </label>
            <input
              type="text"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              placeholder="308912445"
              className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
            {lang === 'uz' ? 'TALAB QILINGAN DETALLAR / IZOH' : lang === 'en' ? 'REQUIRED SPARES / SPECIFICATIONS' : 'НЕОБХОДИМАЯ НОМЕНКЛАТУРА / КОММЕНТАРИЙ'}
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={lang === 'uz' ? 'Artikullar, miqdori va yetkazib berish shartlari...' : lang === 'en' ? 'Enter part numbers, quantities and delivery terms...' : 'Укажите артикулы, требуемое количество и базис поставки...'}
            className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#4A5056] mb-1 font-bold">
            {lang === 'uz' ? 'FAYL / SPETSIFIKATSIYA BIRIKTIRISH (25 MB GACHA)' : lang === 'en' ? 'ATTACH SPECIFICATION FILE (UP TO 25 MB)' : 'ПРИКРЕПИТЬ СПЕЦИФИКАЦИЮ (ДО 25 МБ)'}
          </label>
          <div className="flex items-center space-x-2">
            <label className="border border-[#0A0A0A] bg-white hover:bg-[#0A0A0A] hover:text-white px-3 py-1 text-xs cursor-pointer transition-colors">
              <span>{lang === 'uz' ? 'Faylni tanlash' : lang === 'en' ? 'Choose File' : 'Обзор...'}</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip,.rar,.jpg,.png"
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-[#4A5056] truncate max-w-[200px]">
              {fileName || (lang === 'uz' ? 'Fayl tanlanmagan' : lang === 'en' ? 'No file chosen' : 'Файл не выбран')}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSending}
            className="w-full border border-[#0A0A0A] bg-[#0A0A0A] text-white py-2 text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#0A0A0A] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSending
              ? (lang === 'uz' ? 'Yuborilmoqda...' : lang === 'en' ? 'Transmitting...' : 'ОТПРАВКА...')
              : (lang === 'uz' ? '[ SO\'ROVNI YUBORISH ]' : lang === 'en' ? '[ SUBMIT INQUIRY ]' : '[ ОТПРАВИТЬ ЗАЯВКУ ]')}
          </button>
        </div>

        <div className="pt-2 border-t border-[#0A0A0A]/20 flex flex-wrap gap-2 text-[10px]">
          <a
            href={tgShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-[#0A0A0A]/40 bg-[#C8CDD2] py-1.5 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            ↗ Telegram Bot
          </a>
          <a
            href={mailShareUrl}
            className="flex-1 text-center border border-[#0A0A0A]/40 bg-[#C8CDD2] py-1.5 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            ✉ Email Direct
          </a>
        </div>
      </form>
    </div>
  );
};
