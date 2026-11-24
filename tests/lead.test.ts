import { describe, expect, it } from 'vitest';
import { buildPayload, normalizePhone, outcomeFromResponse, parseContact, validateLead, type LeadInput } from '../src/utils/lead';
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

// Same table as the CRM (apps/crm/backend/tests/unit/domain/test_lead_sources.py): both sides must agree.
describe('normalizePhone', () => {
  it.each([
    ['+998 90 123-45-67', '+998901234567'],
    ['998901234567', '+998901234567'],
    ['00998901234567', '+998901234567'],
    ['0049 30 1234 5678', '+493012345678'],
    ['90 123 45 67', '+998901234567'],
    ['(90) 123-45-67', '+998901234567'],
    ['+998-(90)-123-45-67', '+998901234567'],
    ['+7 (999) 123-45-67', '+79991234567'],
    ['+380 44 123 45 67', '+380441234567'],
    ['+1 650 555 0100', '+16505550100'],
  ])('accepts %s', (raw, expected) => {
    expect(normalizePhone(raw)).toBe(expected);
  });
  it.each([
    '+998 90 118 90 0', // 11 digits: one missing
    '+998 90 123 45 678', // 13 digits: one extra
    '998 90 123 45',
    '8 90 123 45 67', // local trunk prefix 8
    '0 90 123 45 67',
    '12345',
    '+0998901234567',
    '00 90 123 45 67', // «00» + 9 digits: not an international number (was turned into +901234567)
    '00 12 345 678',
    '+٩٩٨ ٩٠ ١٢٣ ٤٥ ٦٧', // Arabic-Indic digits
    '+۹۹۸۹۰۱۲۳۴۵۶۷', // Extended Arabic-Indic (Persian) digits
    '+९९८९०१२३४५६७', // Devanagari digits
    '+998 90 123-45-67 доб. 12',
    'abc',
  ])('rejects %s', (raw) => {
    expect(normalizePhone(raw)).toBeNull();
    expect(parseContact(raw).error).toBe('phone');
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
    expect(outcomeFromResponse(202, { lead_id: 1 })).toEqual({ outcome: 'success' });
    expect(outcomeFromResponse(429, null)).toEqual({ outcome: 'rate' });
    expect(outcomeFromResponse(422, { details: { reason: 'form_too_fast' } })).toEqual({ outcome: 'tooFast' });
    expect(outcomeFromResponse(422, { details: { reason: 'form_token_expired' } })).toEqual({ outcome: 'expired' });
    expect(outcomeFromResponse(422, { details: {} })).toEqual({ outcome: 'invalid' });
    expect(outcomeFromResponse(500, null)).toEqual({ outcome: 'network' });
  });
  it('keeps the request number the CRM returns', () => {
    expect(outcomeFromResponse(202, { lead_id: 42, request_number: 'L-0042' })).toEqual({ outcome: 'success', requestNumber: 'L-0042' });
    expect(outcomeFromResponse(202, { lead_id: null })).toEqual({ outcome: 'success' });
  });
  it('shows a refused input at its field, not as a general failure', () => {
    expect(outcomeFromResponse(422, { details: { reason: 'invalid_phone', field: 'phone' } })).toEqual({ outcome: 'field', field: 'contact', error: 'phone' });
    expect(outcomeFromResponse(422, { details: { reason: 'invalid_email' } })).toEqual({ outcome: 'field', field: 'contact', error: 'email' });
    expect(outcomeFromResponse(422, { details: { reason: 'contact_required' } })).toEqual({ outcome: 'field', field: 'contact', error: 'contact' });
    expect(outcomeFromResponse(422, { details: { reason: 'consent_required' } })).toEqual({ outcome: 'field', field: 'consent', error: 'consent' });
    expect(outcomeFromResponse(422, { details: { field: 'name' } })).toEqual({ outcome: 'field', field: 'name', error: 'required' });
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
