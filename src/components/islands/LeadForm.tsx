/**
 * Lead form → RailTech CRM (docs/ARCHITECTURE.md §5). The only React island of the site.
 * Logic lives in src/utils/lead.ts (unit-tested); this file is the UI.
 * Without JavaScript the form is not interactive, so the alternatives (Telegram, phone, e-mail) are always rendered.
 */
import React, { useEffect, useRef, useState } from 'react';
import { makeT, type Lang } from '../../i18n';
import formUi from '../../data/cms/ui/form.json';
import { buildPayload, outcomeFromResponse, validateLead, type FieldErrors, type LeadInput, type SubmitOutcome } from '../../utils/lead';

const t = makeT([formUi]);

interface Props {
  lang: Lang;
  endpoint: string;
  privacyHref: string;
  newClientUrl: string;
  telegramUrl?: string;
  phone?: string;
  phoneHref?: string;
  email?: string;
  /** id prefix — two forms on one page must not share ids */
  idPrefix?: string;
}

type Status = 'idle' | 'sending' | SubmitOutcome;

const EMPTY: LeadInput = { name: '', company: '', contact: '', text: '', consent: false, website: '' };

export default function LeadForm(props: Props) {
  const { lang, endpoint, privacyHref, newClientUrl, telegramUrl, phone, phoneHref, email, idPrefix = 'lead' } = props;
  const tr = (key: string) => t(lang, key);
  const [values, setValues] = useState<LeadInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const token = useRef<{ token: string; minFill: number; at: number } | null>(null);

  async function loadToken() {
    try {
      const res = await fetch(`${endpoint.replace(/\/$/, '')}/token`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      token.current = { token: data.token, minFill: Number(data.min_fill_seconds || 0), at: Date.now() };
    } catch {
      token.current = null;
    }
  }

  useEffect(() => {
    loadToken();
  }, []);

  const id = (name: string) => `${idPrefix}-${name}`;
  const set = (name: keyof LeadInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = name === 'consent' ? (e.target as HTMLInputElement).checked : e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name as keyof FieldErrors]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateLead(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = (['name', 'contact', 'text', 'consent'] as const).find((k) => found[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setStatus('sending');
    if (!token.current) await loadToken();
    if (!token.current) {
      setStatus('network');
      return;
    }
    const wait = token.current.minFill * 1000 - (Date.now() - token.current.at);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload(values, lang, token.current.token)),
      });
      const body = await res.json().catch(() => null);
      const outcome = outcomeFromResponse(res.status, body);
      setStatus(outcome);
      if (outcome === 'success') setValues(EMPTY);
      if (outcome === 'expired' || outcome === 'tooFast') await loadToken();
    } catch {
      setStatus('network');
    }
  }

  const err = (name: keyof FieldErrors) =>
    errors[name] ? (
      <span className="lf__err" id={id(`${name}-err`)}>
        {tr(`form.error.${errors[name]}`)}
      </span>
    ) : null;
  const described = (name: keyof FieldErrors) => (errors[name] ? id(`${name}-err`) : undefined);

  if (status === 'success') {
    return (
      <div className="lf lf--done" role="status" aria-live="polite">
        <p className="lf__done-title">{tr('form.success.title')}</p>
        <p>{tr('form.success.text')}</p>
      </div>
    );
  }

  const alternatives = (
    <ul className="lf__alt">
      {telegramUrl && (
        <li>
          <a href={telegramUrl} rel="noopener">{tr('form.alt.telegram')}</a>
        </li>
      )}
      {phone && (
        <li>
          <a href={phoneHref}>{phone}</a>
        </li>
      )}
      {email && (
        <li>
          <a href={`mailto:${email}`}>{email}</a>
        </li>
      )}
      <li>
        <a href={newClientUrl}>{tr('form.alt.newClient')}</a>
      </li>
    </ul>
  );

  return (
    <form className="lf" onSubmit={onSubmit} noValidate aria-label={tr('form.aria')}>
      <div className="lf__two">
        <label htmlFor={id('name')}>
          {tr('form.name')}
          <input id={id('name')} name="name" type="text" autoComplete="name" placeholder={tr('form.namePh')} value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={described('name')} />
          {err('name')}
        </label>
        <label htmlFor={id('company')}>
          {tr('form.company')}
          <input id={id('company')} name="company" type="text" autoComplete="organization" placeholder={tr('form.companyPh')} value={values.company} onChange={set('company')} />
        </label>
      </div>
      <label htmlFor={id('contact')}>
        {tr('form.contact')}
        <input id={id('contact')} name="contact" type="text" inputMode="email" autoComplete="tel" placeholder={tr('form.contactPh')} value={values.contact} onChange={set('contact')} aria-invalid={!!errors.contact} aria-describedby={described('contact')} />
        {err('contact')}
      </label>
      <label htmlFor={id('text')}>
        {tr('form.text')}
        <textarea id={id('text')} name="text" rows={4} placeholder={tr('form.textPh')} value={values.text} onChange={set('text')} aria-invalid={!!errors.text} aria-describedby={described('text')} />
        {err('text')}
      </label>
      <div className="lf__trap" aria-hidden="true">
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>
      <label className="lf__chk" htmlFor={id('consent')}>
        <input id={id('consent')} name="consent" type="checkbox" checked={values.consent} onChange={set('consent')} aria-invalid={!!errors.consent} aria-describedby={described('consent')} />
        <span>
          {tr('form.consent')} <a href={privacyHref}>{tr('form.privacy')}</a>
        </span>
      </label>
      {err('consent')}
      <button className="btn btn--primary lf__submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? tr('form.sending') : tr('form.submit')}
      </button>
      <div aria-live="polite">
        {status !== 'idle' && status !== 'sending' && (
          <div className="lf__fail" role="alert">
            <p>{tr(`form.error.${status === 'invalid' ? 'network' : status}`)}</p>
            {(status === 'network' || status === 'invalid' || status === 'rate') && alternatives}
          </div>
        )}
      </div>
    </form>
  );
}
