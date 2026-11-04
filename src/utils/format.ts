import type { Lang } from '../i18n';

const LOCALE: Record<Lang, string> = { ru: 'ru-RU', uz: 'uz-Latn-UZ', en: 'en-GB' };

/** '2026-11-03' → '3 ноября 2026' / '3-noyabr, 2026' / '3 November 2026'. Invalid input is returned as is. */
export function formatDate(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
