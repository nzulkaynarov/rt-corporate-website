import type { APIRoute } from 'astro';
import { company } from '../../utils/company';

/**
 * /.well-known/security.txt (RFC 9116): where to report a vulnerability. The contact is the company e-mail
 * (company.json → email, owner's decision 2026-11-27); «Expires» is one year after the build, so every publication renews it.
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000);
  expires.setUTCHours(0, 0, 0, 0);
  const body = [
    `Contact: mailto:${company.email}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: ru, en, uz',
    `Canonical: ${new URL(`${base}.well-known/security.txt`, site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
