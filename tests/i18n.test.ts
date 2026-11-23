import { describe, expect, it } from 'vitest';
import { alternateHrefs, getLangFromPath, getRouteFromPath, localeHref, localize, pick, tField } from '../src/i18n';
import { toSuffixed } from '../src/i18n/blocks.mjs';
import { fillFacts } from '../src/i18n/facts.mjs';
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
    expect(tField({ title: 'Новости', uz: { title: 'Yangiliklar' } }, 'title', 'uz')).toBe('Yangiliklar');
    expect(tField({ title: 'Новости', uz: { title: '' } }, 'title', 'uz')).toBe('Новости');
    expect(tField({ title: 'Новости' }, 'title', 'en')).toBe('Новости');
  });
});

// Locale blocks (src/i18n/blocks.mjs): RU at the root, translations in uz/en, as Sveltia CMS stores them.
describe('localize / toSuffixed', () => {
  const data = {
    lang: ['ru', 'uz'],
    title: 'Поставки',
    order: 1,
    steps: [{ title: 'Запрос', link: '/a/' }, { title: 'КП', link: '/b/' }],
    tags: ['один', 'два'],
    bank: { name: 'Банк', mfo: '00421' },
    uz: { title: 'Yetkazib berish', steps: [{ title: "So'rov", link: '/a/' }, { title: '' }], tags: ['bir', 'ikki'], bank: { name: 'Bank' }, body: 'UZ matn' },
  };
  it('overlays the block with RU fallback and drops the locale keys', () => {
    expect(localize(data, 'uz')).toEqual({
      title: 'Yetkazib berish',
      order: 1,
      steps: [{ title: "So'rov", link: '/a/' }, { title: 'КП', link: '/b/' }],
      tags: ['bir', 'ikki'],
      bank: { name: 'Bank', mfo: '00421' },
      body: 'UZ matn',
    });
    expect(localize(data, 'en').title).toBe('Поставки');
    expect(localize(data, 'ru')).not.toHaveProperty('uz');
  });
  it('gives the content rules a flat view with _uz/_en suffixes', () => {
    const flat = toSuffixed(data);
    expect(flat.title_uz).toBe('Yetkazib berish');
    expect(flat.steps[0].title_uz).toBe("So'rov");
    expect(flat.tags_uz).toEqual(['bir', 'ikki']);
    expect(flat.bank.name_uz).toBe('Bank');
    expect(flat.body_uz).toBe('UZ matn');
    expect(flat).not.toHaveProperty('uz');
    expect(data.steps[0]).not.toHaveProperty('title_uz'); // the source is not mutated
  });
});

describe('makeT', () => {
  const t = makeT([{ strings: [{ key: 'a.b', ru: 'Привет, {name}', uz: '', en: 'Hi, {name}' }] }]);
  it('fills placeholders and falls back to RU', () => {
    expect(t('en', 'a.b', { name: 'A' })).toBe('Hi, A');
    expect(t('uz', 'a.b', { name: 'A' })).toBe('Привет, A');
  });
});

// Company facts in texts (src/i18n/facts.mjs): one value in company.json, {tokens} everywhere else.
describe('facts', () => {
  it('fills known tokens in nested values and keeps unknown braces', () => {
    const facts = { phone: '+998 90 118-90-00', email: 'info@railtech.uz' };
    expect(fillFacts({ a: 'Телефон: {phone}', b: ['{email}', '{unknown}'] }, facts)).toEqual({ a: 'Телефон: +998 90 118-90-00', b: ['info@railtech.uz', '{unknown}'] });
  });
  it('localize() fills facts in the page language', () => {
    const data = { text: 'Офис: {officeAddress}', uz: { text: 'Ofis: {officeAddress}' } };
    expect(localize(data, 'ru').text).toMatch(/^Офис: г\. Ташкент/);
    expect(localize(data, 'uz').text).toMatch(/^Ofis: Toshkent sh\./);
    expect(tField({ title: 'ИНН {inn}' }, 'title', 'en')).toBe('ИНН 308346339');
  });
});
