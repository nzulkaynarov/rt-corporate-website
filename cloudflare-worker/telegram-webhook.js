/**
 * Бессерверный обработчик заявок с сайта railtech.uz для отправки в Telegram-группу отдела продаж.
 * Развертывается бесплатно на Cloudflare Workers.
 */
export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();
      const text = [
        '🛠 *НОВАЯ ЗАЯВКА С САЙТА RAILTECH.UZ*',
        `🌐 *Язык интерфейса:* ${(data.locale || 'ru').toUpperCase()}`,
        `👤 *Контакт:* ${data.name || '-'}`,
        `🏢 *Организация:* ${data.company || '-'} (ИНН: ${data.inn || '-'})`,
        `📞 *Телефон:* ${data.phone || '-'}`,
        `📋 *Задача:* ${data.comment || '-'}`,
        data.fileName ? `📎 *Прикрепленный файл:* ${data.fileName} (${data.fileSize || ''})` : null,
      ].filter(Boolean).join('\n');

      if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
        const tgUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        });

        // Отправка файла документа (.xlsx, .pdf, .docx), если передан в base64
        if (data.fileBase64 && data.fileName) {
          try {
            const binaryStr = atob(data.fileBase64);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }
            const blob = new Blob([bytes]);
            const formData = new FormData();
            formData.append('chat_id', env.TELEGRAM_CHAT_ID);
            formData.append('caption', `📎 Спецификация: ${data.fileName} (${data.company || data.name || 'Клиент'})`);
            formData.append('document', blob, data.fileName);

            await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
              method: 'POST',
              body: formData,
            });
          } catch (fileErr) {
            console.error('File dispatch error:', fileErr);
          }
        }
      } else {
        console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment variables.');
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};
