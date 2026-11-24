/**
 * Lead form logic (pure, unit-tested in tests/lead.test.ts). The form sends leads to the RailTech CRM:
 *   GET  {endpoint}/token → { token, expires_at, min_fill_seconds }
 *   POST {endpoint}       → 202 { lead_id }  |  422 { error: 'validation_failed', details: { reason } }  |  429
 * Contract: RailTech_Platform packages/contracts/openapi/crm.yaml (docs/ARCHITECTURE.md §5).
 */
import type { Lang } from '../i18n';
import type { Visit } from './visit';

export interface LeadInput {
  name: string;
  company: string;
  contact: string;
  text: string;
  consent: boolean;
  /** Who writes: a customer (supply, engineering) or a manufacturer/partner; '' = not chosen. */
  role: LeadRole;
  /** Honeypot: hidden field that people never fill. */
  website: string;
}

export type LeadRole = '' | 'customer' | 'partner';

export interface LeadPayload {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  text: string;
  language: Lang;
  form_token: string;
  consent: true;
  website: string;
  /** Source facts the CRM keeps with the lead (optional in the contract). */
  form?: string;
  page?: string;
  referrer?: string;
  utm?: Record<string, string>;
  landing_language?: string;
}

export type FieldError = 'required' | 'contact' | 'phone' | 'email' | 'consent';
export type FieldErrors = Partial<Record<'name' | 'contact' | 'text' | 'consent', FieldError>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** What may stand in a phone number: digits, a leading +, spaces, dashes, dots and brackets. */
const PHONE_CHARS = /^\+?[\d\s().-]+$/;
const UZ_CODE = '998';
const UZ_LOCAL_DIGITS = 9;

/**
 * Normalises a phone number to E.164 (`+998901234567`) or returns null. Same rules as the CRM
 * (`normalize_phone_e164`): Uzbekistan = `+998` and exactly 9 digits (a bare 9-digit local number gets `+998`,
 * the local «8 90 …» form is rejected), other countries need a code and 8–15 digits. A leading «00» counts as the
 * international prefix only with 10+ digits after it. Only ASCII digits: `\d` without the `u` flag is [0-9], so Arabic-Indic
 * and other digits are refused.
 */
export function normalizePhone(raw: string): string | null {
  const value = raw.trim();
  if (!PHONE_CHARS.test(value)) return null;
  let digits = value.replace(/\D/g, '');
  if (!value.startsWith('+')) {
    // «00» is the international prefix only when a full number follows (10+ digits): «00 90 123 45 67» is not
    // «+90 123…», it is a mistyped local number — rejected, as in the CRM.
    if (digits.startsWith('00')) {
      if (digits.length - 2 < 10) return null;
      digits = digits.slice(2);
    } else if (digits.length === UZ_LOCAL_DIGITS) digits = UZ_CODE + digits;
    else if (digits.startsWith('8') && digits.length === UZ_LOCAL_DIGITS + 1) return null;
  }
  if (digits.startsWith(UZ_CODE) && digits.length !== UZ_CODE.length + UZ_LOCAL_DIGITS) return null;
  return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
}

/** Splits «Телефон или e-mail» into phone / email. */
export function parseContact(raw: string): { phone?: string; email?: string; error?: FieldError } {
  const value = raw.trim();
  if (!value) return { error: 'contact' };
  if (value.includes('@')) return EMAIL.test(value) ? { email: value } : { error: 'email' };
  const phone = normalizePhone(value);
  return phone ? { phone } : { error: 'phone' };
}

export function validateLead(input: LeadInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.name.trim()) errors.name = 'required';
  const contact = parseContact(input.contact);
  if (contact.error) errors.contact = contact.error;
  if (!input.text.trim()) errors.text = 'required';
  if (!input.consent) errors.consent = 'consent';
  return errors;
}

/**
 * The request body. `visit` (src/utils/visit.ts) adds where the visit came from: first page, external referrer, utm
 * marks; `currentPage` is used when the visit was not recorded. `form` names the form and the role chosen in it.
 */
export function buildPayload(input: LeadInput, lang: Lang, formToken: string, visit: Visit | null = null, currentPage = ''): LeadPayload {
  const { phone, email } = parseContact(input.contact);
  const page = (visit?.landing || currentPage).slice(0, 1024);
  const utm = visit && Object.keys(visit.utm).length ? visit.utm : undefined;
  return {
    name: input.name.trim().slice(0, 255),
    ...(input.company.trim() ? { company: input.company.trim().slice(0, 255) } : {}),
    ...(phone ? { phone } : {}),
    ...(email ? { email } : {}),
    text: input.text.trim().slice(0, 4000),
    language: lang,
    form_token: formToken,
    consent: true,
    website: input.website,
    form: input.role ? `site-${input.role}` : 'site',
    ...(page ? { page } : {}),
    ...(visit?.referrer ? { referrer: visit.referrer.slice(0, 1024) } : {}),
    ...(utm ? { utm } : {}),
    ...(visit?.lang ? { landing_language: visit.lang.slice(0, 8) } : {}),
  };
}

/** Outcome of the POST, mapped to a UI message key in src/data/cms/ui/form.json. */
export type SubmitOutcome = 'success' | 'tooFast' | 'expired' | 'rate' | 'invalid' | 'network' | 'field';

export interface SubmitResult {
  outcome: SubmitOutcome;
  /** `field`: the CRM refused one input — show the message at it, not a general failure. */
  field?: keyof FieldErrors;
  error?: FieldError;
  /** `success`: the number the CRM gave the request (e.g. L-0042). */
  requestNumber?: string;
}

/** CRM `details.reason` → the field and the message shown at it. */
const REASON_FIELD: Record<string, { field: keyof FieldErrors; error: FieldError }> = {
  invalid_phone: { field: 'contact', error: 'phone' },
  invalid_email: { field: 'contact', error: 'email' },
  contact_required: { field: 'contact', error: 'contact' },
  consent_required: { field: 'consent', error: 'consent' },
};
/** Schema errors (`details.field`) for fields the form has. */
const SCHEMA_FIELD: Record<string, { field: keyof FieldErrors; error: FieldError }> = {
  name: { field: 'name', error: 'required' },
  text: { field: 'text', error: 'required' },
  phone: { field: 'contact', error: 'phone' },
  email: { field: 'contact', error: 'email' },
  consent: { field: 'consent', error: 'consent' },
};

export function outcomeFromResponse(status: number, body: unknown): SubmitResult {
  const data = body as { request_number?: unknown; details?: { reason?: string; field?: string } } | null;
  if (status === 202 || status === 200 || status === 201) {
    const number = data?.request_number;
    return { outcome: 'success', ...(typeof number === 'string' && number ? { requestNumber: number.slice(0, 32) } : {}) };
  }
  if (status === 429) return { outcome: 'rate' };
  if (status === 422) {
    const reason = data?.details?.reason;
    if (reason === 'form_too_fast') return { outcome: 'tooFast' };
    if (reason === 'form_token_expired' || reason === 'form_token_invalid') return { outcome: 'expired' };
    const hit = (reason && REASON_FIELD[reason]) || (data?.details?.field && SCHEMA_FIELD[data.details.field]);
    if (hit) return { outcome: 'field', ...hit };
    return { outcome: 'invalid' };
  }
  return { outcome: 'network' };
}
