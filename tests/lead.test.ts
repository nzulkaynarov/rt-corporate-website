import { describe, expect, it } from 'vitest';
import { buildPayload, outcomeFromResponse, parseContact, validateLead, type LeadInput } from '../src/utils/lead';
import { readVisit, recordVisit, visitFrom, VISIT_KEY } from '../src/utils/visit';

const filled: LeadInput = { name: 'Алишер', company: 'Завод', contact: '+998 90 118-90-00', text: 'Нужны датчики', consent: true, role: '', website: '' };

describe('parseContact', () => {
  it('detects e-mail and phone', () => {
    expect(parseContact('name@company.uz')).toEqual({ email: 'name@company.uz' });
    expect(parseContact('+998 (90) 118-90-00')).toEqual({ phone: '+998901189000' });
  });
  it('rejects empty, short and malformed values', () => {
    expect(parseContact('').error).toBe('contact');
    expect(parseContact('12-34').error).toBe('phone');
    expect(parseContact('name@').error).toBe('email');
  });
});

describe('validateLead', () => {
  it('passes a complete form', () => {
    expect(validateLead(filled)).toEqual({});
  });
  it('requires name, contact, text and consent', () => {
    expect(validateLead({ ...filled, name: ' ', contact: '', text: '', consent: false })).toEqual({
      name: 'required',
      contact: 'contact',
      text: 'required',
      consent: 'consent',
    });
  });
  it('does not require the company', () => {
    expect(validateLead({ ...filled, company: '' })).toEqual({});
  });
});

describe('buildPayload', () => {
  it('matches the CRM contract (crm.yaml: leads/web)', () => {
    expect(buildPayload(filled, 'ru', 'tok')).toEqual({
      name: 'Алишер',
      company: 'Завод',
      phone: '+998901189000',
      text: 'Нужны датчики',
      language: 'ru',
      form_token: 'tok',
      consent: true,
      website: '',
      form: 'site',
    });
  });
  it('adds the role and where the visit came from (CRM source fields)', () => {
    const visit = { landing: '/news/partner-grabba/', referrer: 'https://www.google.com', utm: { utm_source: 'telegram' }, lang: 'uz' };
    expect(buildPayload({ ...filled, role: 'partner' }, 'ru', 't', visit, '/contacts/')).toMatchObject({
      form: 'site-partner',
      page: '/news/partner-grabba/',
      referrer: 'https://www.google.com',
      utm: { utm_source: 'telegram' },
      landing_language: 'uz',
    });
  });
  it('without a recorded visit sends the current page and no empty source fields', () => {
    const p = buildPayload(filled, 'ru', 't', null, '/contacts/');
    expect(p.page).toBe('/contacts/');
    expect(p).not.toHaveProperty('referrer');
    expect(p).not.toHaveProperty('utm');
  });
  it('omits empty optional fields and passes the honeypot through', () => {
    const p = buildPayload({ ...filled, company: '', contact: 'a@b.uz', website: 'spam' }, 'en', 't');
    expect(p).not.toHaveProperty('company');
    expect(p).not.toHaveProperty('phone');
    expect(p.email).toBe('a@b.uz');
    expect(p.website).toBe('spam');
  });
  it('trims text to the CRM limit', () => {
    expect(buildPayload({ ...filled, text: 'x'.repeat(5000) }, 'ru', 't').text).toHaveLength(4000);
  });
});

describe('outcomeFromResponse', () => {
  it('maps CRM answers to UI messages', () => {
    expect(outcomeFromResponse(202, { lead_id: 1 })).toBe('success');
    expect(outcomeFromResponse(429, null)).toBe('rate');
    expect(outcomeFromResponse(422, { details: { reason: 'form_too_fast' } })).toBe('tooFast');
    expect(outcomeFromResponse(422, { details: { reason: 'form_token_expired' } })).toBe('expired');
    expect(outcomeFromResponse(422, { details: { reason: 'invalid_phone' } })).toBe('invalid');
    expect(outcomeFromResponse(500, null)).toBe('network');
  });
});

describe('visit source (src/utils/visit.ts)', () => {
  it('keeps the first page, an external referrer as origin only and only utm_* marks', () => {
    const v = visitFrom('https://railtech.uz/en/services/supply/?utm_source=tg&utm_campaign=nov&gclid=x&role=partner', 'https://www.google.com/search?q=secret', 'en');
    expect(v).toEqual({ landing: '/en/services/supply/', referrer: 'https://www.google.com', utm: { utm_source: 'tg', utm_campaign: 'nov' }, lang: 'en' });
  });
  it('ignores the site itself as a referrer', () => {
    expect(visitFrom('https://railtech.uz/contacts/', 'https://railtech.uz/', 'ru').referrer).toBe('');
  });
  it('records once per tab and reads back safely', () => {
    const m = new Map<string, string>();
    const store = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
    recordVisit(store, visitFrom('https://railtech.uz/news/', '', 'ru'));
    recordVisit(store, visitFrom('https://railtech.uz/contacts/', '', 'ru'));
    expect(readVisit(store)?.landing).toBe('/news/');
    m.set(VISIT_KEY, '{broken');
    expect(readVisit(store)).toBeNull();
    expect(readVisit(undefined)).toBeNull();
  });
});
