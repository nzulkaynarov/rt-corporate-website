import type { Lang } from '../i18n';

/**
 * '2026-11-04' → '4 ноября 2026 г.' / '2026-yil 4-noyabr' / 'November 4, 2026' — the same forms as the legal pages.
 * Uzbek is built by hand: ICU data for uz-Latn differs between runtimes and does not give the literary «yil» form.
 * Invalid input is returned as is.
 */
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

export function formatDate(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  if (lang === 'uz') return `${date.getUTCFullYear()}-yil ${date.getUTCDate()}-${UZ_MONTHS[date.getUTCMonth()]}`;
  const locale = lang === 'en' ? 'en-US' : 'ru-RU';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
