import { describe, expect, it } from 'vitest';
import { entrySeo, plainText, truncate } from '../src/utils/seo';
import { formatDate } from '../src/utils/format';
import { MAIN_NAV, isActive } from '../src/utils/nav';
import { mapUrl, telHref, telegramUrl } from '../src/utils/company';

describe('seo', () => {
  it('plainText strips markup but keeps the «|» title separator', () => {
    expect(plainText('**Поставки** | RailTech')).toBe('Поставки | RailTech');
    expect(plainText('[ссылка](/news/) и <b>текст</b>')).toBe('ссылка и текст');
  });
  it('truncate cuts at a word boundary with an ellipsis', () => {
    const out = truncate('Поставки оборудования и комплектующих до склада заказчика в Ташкенте', 40);
    expect(out.length).toBeLessThanOrEqual(40);
    expect(out.endsWith('…')).toBe(true);
  });
  it('entrySeo prefers seoTitle/seoDescription and falls back to title + suffix and summary', () => {
    expect(entrySeo({ title: 'Поставки', summary: 'Кратко о поставках' }, 'ru')).toEqual({ title: 'Поставки | RailTech', description: 'Кратко о поставках' });
    expect(entrySeo({ title: 'X', seoTitle: 'Свой заголовок', seoDescription: 'Своё описание' }, 'ru')).toEqual({ title: 'Свой заголовок', description: 'Своё описание' });
  });
});

describe('format', () => {
  it('formats ISO dates per language', () => {
    expect(formatDate('2026-11-04', 'ru')).toBe('4 ноября 2026 г.');
    expect(formatDate('2026-11-04', 'en')).toBe('November 4, 2026');
    expect(formatDate('2026-11-04', 'uz')).toBe('2026-yil 4-noyabr');
    expect(formatDate('not-a-date', 'ru')).toBe('not-a-date');
  });
});

describe('nav', () => {
  it('has exactly one menu: services, news, contacts', () => {
    expect(MAIN_NAV.map((i) => i.path)).toEqual(['/services/', '/news/', '/contacts/']);
  });
  it('marks the section of a nested page as active', () => {
    expect(isActive(MAIN_NAV[0], '/services/supply/')).toBe(true);
    expect(isActive(MAIN_NAV[1], '/services/supply/')).toBe(false);
  });
});

describe('company links', () => {
  it('builds Telegram, phone and map links', () => {
    expect(telegramUrl('@bot_name')).toBe('https://t.me/bot_name?start=web');
    expect(telHref('+998 90 118-90-00')).toBe('tel:+998901189000');
    expect(mapUrl('г. Ташкент')).toContain('yandex.uz/maps/?text=');
  });
});
