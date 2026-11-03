/**
 * Universal Locale & UI Types for RailTech Portal
 * (Cleaned of legacy hardcoded arrays in favor of Astro Content Collections & CMS JSON data)
 */

export type Locale = 'ru' | 'uz' | 'en';

import pagesData from '../data/cms/pages.json';
import globalData from '../data/cms/global.json';

const lm = pagesData.leadModal;

export const UI_STRINGS = {
  ru: {
    modal: {
      badge: lm.badge || 'ЗАПРОС КП / СЧЕТА С НДС 12%',
      locationMeta: lm.locationMeta || 'ТАШКЕНТ // СКЛАД INDEX B2-2097',
      subjectLabel: lm.subjectLabel || 'ТЕМА ЗАПРОСА',
      nameLabel: lm.nameLabel || 'ИМЯ / ДОЛЖНОСТЬ',
      namePlaceholder: 'Имя Фамилия / Должность',
      phoneLabel: lm.phoneLabel || 'ТЕЛЕФОН',
      phonePlaceholder: '+998 90 123-45-67',
      companyLabel: lm.companyLabel || 'ОРГАНИЗАЦИЯ',
      companyPlaceholder: 'ООО / АО / СП',
      innLabel: lm.innLabel || 'ИНН (ДЛЯ ЭСФ 12%)',
      innPlaceholder: '9 цифр ИНН предприятия',
      taskLabel: lm.messageLabel || 'СООБЩЕНИЕ / ПЕРЕЧЕНЬ ПОЗИЦИЙ',
      taskPlaceholder: 'Укажите артикулы, количество, требования к сертификации или базис доставки...',
      fileLabel: lm.fileLabel || 'ПРИКРЕПИТЬ СПЕЦИФИКАЦИЮ (EXCEL, PDF ДО 25 МБ)',
      fileDefault: 'Выберите файл ведомости...',
      fileButton: lm.fileBrowse || 'ОБЗОР',
      cancelButton: lm.cancelBtn || 'ОТМЕНА',
      submitButton: lm.submitBtn || '[ ОТПРАВИТЬ ЗАЯВКУ ]',
      sendingButton: lm.sendingBtn || 'ОТПРАВКА...',
      successBadge: '✓ ЗАЯВКА УСПЕШНО ЗАРЕГИСТРИРОВАНА',
      successMessage: 'Наш отдел снабжения и дежурные инженеры свяжутся с вами в течение 15 минут.',
      errorMessage: `Произошла ошибка при отправке. Пожалуйста, свяжитесь с нами напрямую по телефону ${globalData.phone}`,
    },
  },
  uz: {
    modal: {
      badge: lm.badge_uz || lm.badge || "TIJORAT TAKLIFI / 12% QQS BILAN HISOB SO'ROVI",
      locationMeta: lm.locationMeta_uz || lm.locationMeta || 'TOSHKENT // INDEX B2-2097 OMBORI',
      subjectLabel: lm.subjectLabel_uz || lm.subjectLabel || "SO'ROV MAVZUSI",
      nameLabel: lm.nameLabel_uz || lm.nameLabel || 'ISM / LAVOZIM',
      namePlaceholder: 'F.I.Sh. / Lavozim',
      phoneLabel: lm.phoneLabel_uz || lm.phoneLabel || 'TELEFON',
      phonePlaceholder: '+998 90 123-45-67',
      companyLabel: lm.companyLabel_uz || lm.companyLabel || 'TASHKILOT',
      companyPlaceholder: 'MChJ / AJ / QK',
      innLabel: lm.innLabel_uz || lm.innLabel || 'STIR (12% QQS UCHUN)',
      innPlaceholder: '9 xonali korxona STIR',
      taskLabel: lm.messageLabel_uz || lm.messageLabel || "XABAR / MAHSULOTLAR RO'YXATI",
      taskPlaceholder: "Artikullar, miqdor, sertifikatlash talablari yoki yetkazib berish bazisini ko'rsating...",
      fileLabel: lm.fileLabel_uz || lm.fileLabel || "SPETSIFIKATSIYANI BIRIKTIRISH (EXCEL, PDF 25 MB GACHA)",
      fileDefault: 'Hujjat faylini tanlang...',
      fileButton: lm.fileBrowse_uz || lm.fileBrowse || 'TANLASH',
      cancelButton: lm.cancelBtn_uz || lm.cancelBtn || 'BEKOR QILISH',
      submitButton: lm.submitBtn_uz || lm.submitBtn || "[ SO'ROVNI YUBORISH ]",
      sendingButton: lm.sendingBtn_uz || lm.sendingBtn || 'YUBORILMOQDA...',
      successBadge: '✓ ARIZA MUVAFFAQIYATLI QABUL QILINDI',
      successMessage: "Ta'minot bo'limimiz va navbatchi muhandislarimiz 15 daqiqa ichida siz bilan bog'lanadilar.",
      errorMessage: `Yuborishda xatolik yuz berdi. Iltimos, biz bilan to'g'ridan-to'g'ri bog'laning: ${globalData.phone}`,
    },
  },
  en: {
    modal: {
      badge: lm.badge_en || lm.badge || 'REQUEST FOR QUOTATION / INVOICE (12% VAT)',
      locationMeta: lm.locationMeta_en || lm.locationMeta || 'TASHKENT // INDEX B2-2097 HUB',
      subjectLabel: lm.subjectLabel_en || lm.subjectLabel || 'REQUEST SUBJECT',
      nameLabel: lm.nameLabel_en || lm.nameLabel || 'FULL NAME / TITLE',
      namePlaceholder: 'Full Name / Title',
      phoneLabel: lm.phoneLabel_en || lm.phoneLabel || 'PHONE NUMBER',
      phonePlaceholder: '+998 90 123-45-67',
      companyLabel: lm.companyLabel_en || lm.companyLabel || 'COMPANY / ENTITY',
      companyPlaceholder: 'Company / LLC / JSC',
      innLabel: lm.innLabel_en || lm.innLabel || 'TIN (FOR 12% TAX INVOICE)',
      innPlaceholder: '9-digit entity TIN',
      taskLabel: lm.messageLabel_en || lm.messageLabel || 'MESSAGE / BILL OF MATERIALS',
      taskPlaceholder: 'Specify SKU codes, quantity, compliance certificates or delivery terms...',
      fileLabel: lm.fileLabel_en || lm.fileLabel || 'ATTACH SPECIFICATION (EXCEL, PDF UP TO 25 MB)',
      fileDefault: 'Select specification file...',
      fileButton: lm.fileBrowse_en || lm.fileBrowse || 'BROWSE',
      cancelButton: lm.cancelBtn_en || lm.cancelBtn || 'CANCEL',
      submitButton: lm.submitBtn_en || lm.submitBtn || '[ SUBMIT REQUEST ]',
      sendingButton: lm.sendingBtn_en || lm.sendingBtn || 'SENDING...',
      successBadge: '✓ REQUEST SUCCESSFULLY RECORDED',
      successMessage: 'Our procurement desk and on-duty engineers will contact you within 15 minutes.',
      errorMessage: `An error occurred while submitting. Please contact us directly at ${globalData.phone}`,
    },
  },
};
