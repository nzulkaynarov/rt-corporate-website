/**
 * Lead form logic (pure, unit-tested in tests/lead.test.ts). The form sends leads to the RailTech CRM:
 *   GET  {endpoint}/token → { token, expires_at, min_fill_seconds }
 *   POST {endpoint}       → 202 { lead_id }  |  422 { error: 'validation_failed', details: { reason } }  |  429
 * Contract: RailTech_Platform packages/contracts/openapi/crm.yaml (docs/ARCHITECTURE.md §5).
 */
import type { Lang } from '../i18n';

export interface LeadInput {
  name: string;
  company: string;
  contact: string;
  text: string;
  consent: boolean;
  /** Honeypot: hidden field that people never fill. */
  website: string;
}

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
}

export type FieldError = 'required' | 'contact' | 'phone' | 'email' | 'consent';
export type FieldErrors = Partial<Record<'name' | 'contact' | 'text' | 'consent', FieldError>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Splits «Телефон или e-mail» into phone / email. Phone keeps + and digits (7–15 digits). */
export function parseContact(raw: string): { phone?: string; email?: string; error?: FieldError } {
  const value = raw.trim();
  if (!value) return { error: 'contact' };
  if (value.includes('@')) return EMAIL.test(value) ? { email: value } : { error: 'email' };
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return { error: 'phone' };
  return { phone: (value.trim().startsWith('+') ? '+' : '') + digits };
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

export function buildPayload(input: LeadInput, lang: Lang, formToken: string): LeadPayload {
  const { phone, email } = parseContact(input.contact);
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
  };
}

/** Outcome of the POST, mapped to a UI message key in src/data/cms/ui/form.json. */
export type SubmitOutcome = 'success' | 'tooFast' | 'expired' | 'rate' | 'invalid' | 'network';

export function outcomeFromResponse(status: number, body: unknown): SubmitOutcome {
  if (status === 202 || status === 200 || status === 201) return 'success';
  if (status === 429) return 'rate';
  const reason = (body as { details?: { reason?: string } } | null)?.details?.reason;
  if (status === 422) {
    if (reason === 'form_too_fast') return 'tooFast';
    if (reason === 'form_token_expired' || reason === 'form_token_invalid') return 'expired';
    return 'invalid';
  }
  return 'network';
}
