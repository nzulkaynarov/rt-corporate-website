/** Company data (src/data/cms/company.json) and links derived from it. */
import company from '../data/cms/company.json';
import { localize } from '../i18n/blocks.mjs';

/** RU values at the root; top-level fields are localized with tField(company, field, lang). */
export { company };

/** Company data in one language (nested values such as bank.name and metrics[].label included). */
export const companyIn = (lang: string) => localize(company, lang);

/** Cabinet links, all built from company.json → cabinet.url (routes of the RailTech platform). */
const cabinetBase = String(company.cabinet.url).replace(/\/+$/, '');
export const cabinet = {
  url: cabinetBase,
  loginUrl: `${cabinetBase}/login`,
  newClientUrl: `${cabinetBase}/new-client`,
};

/** Telegram bot link with the «came from the website» start parameter (CRM source = web). */
export function telegramUrl(bot: string | undefined = company.telegramBot): string {
  return bot ? `https://t.me/${bot.replace(/^@/, '')}?start=web` : '';
}

/** `tel:` link from a human-formatted phone ('+998 90 118-90-00' → 'tel:+998901189000'). */
export function telHref(phone: string | undefined = company.phone): string {
  return phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';
}

export function mailHref(email: string | undefined = company.email): string {
  return email ? `mailto:${email}` : '';
}

/** Map search link for an address (no API key, opens the map site in a new tab). */
export function mapUrl(address: string): string {
  return `https://yandex.uz/maps/?text=${encodeURIComponent(address)}`;
}
