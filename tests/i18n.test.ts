import { describe, expect, it } from 'vitest';
import { alternateHrefs, getLangFromPath, getRouteFromPath, localeHref, pick, tField } from '../src/i18n';
import { makeT } from '../src/i18n/dictionary';

// In tests BASE_URL is '/', so BASE = '' (on GitHub Pages it is '/rt-corporate-website').
describe('localeHref', () => {
  it('keeps RU routes without a prefix and adds a trailing slash', () => {
    expect(localeHref('/services/supply', 'ru')).toBe('/services/supply/');
  });
  it('prefixes UZ/EN routes', () => {
    expect(localeHref('/news/', 'uz')).toBe('/uz/news/');
    expect(localeHref('/', 'en')).toBe('/en/');
  });
  it('keeps anchors after the trailing slash', () => {
    expect(localeHref('/contacts/#request', 'en')).toBe('/en/contacts/#request');
  });
  it('does not touch external links, tel: and mailto:', () => {
    for (const href of ['https://cabinet.railtech.uz/login', 'tel:+998901189000', 'mailto:info@railtech.uz', '#main']) {
      expect(localeHref(href, 'uz')).toBe(href);
    }
  });
  it('never puts a language prefix on files', () => {
    expect(localeHref('/brand/rt-mark.svg', 'uz')).toBe('/brand/rt-mark.svg');
  });
  it('is idempotent for already localized routes', () => {
    expect(localeHref('/uz/news/', 'en')).toBe('/en/news/');
  });
});

describe('route helpers', () => {
  it('reads the language and the neutral route from a path', () => {
    expect(getLangFromPath('/en/services/')).toBe('en');
    expect(getLangFromPath('/services/')).toBe('ru');
    expect(getRouteFromPath('/uz/news/partner-gersys/')).toBe('/news/partner-gersys/');
  });
  it('builds the same page in every language', () => {
    expect(alternateHrefs('/uz/contacts/')).toEqual({ ru: '/contacts/', uz: '/uz/contacts/', en: '/en/contacts/' });
  });
});

describe('pick / tField', () => {
  it('falls back to RU when a translation is empty', () => {
    expect(pick('uz', 'Услуги', '', 'Services')).toBe('Услуги');
    expect(pick('en', 'Услуги', '', 'Services')).toBe('Services');
    expect(tField({ title: 'Новости', title_uz: 'Yangiliklar' }, 'title', 'uz')).toBe('Yangiliklar');
    expect(tField({ title: 'Новости' }, 'title', 'en')).toBe('Новости');
  });
});

describe('makeT', () => {
  const t = makeT([{ strings: [{ key: 'a.b', ru: 'Привет, {name}', uz: '', en: 'Hi, {name}' }] }]);
  it('fills placeholders and falls back to RU', () => {
    expect(t('en', 'a.b', { name: 'A' })).toBe('Hi, A');
    expect(t('uz', 'a.b', { name: 'A' })).toBe('Привет, A');
  });
});
