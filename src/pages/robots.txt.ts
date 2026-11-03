import type { APIRoute } from 'astro';

/** robots.txt generated from the configured site + base, so the sitemap URL is always correct. */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const sitemapUrl = new URL(`${base}sitemap-index.xml`, site).href;
  const body = ['User-agent: *', 'Allow: /', `Disallow: ${base}admin/`, '', `Sitemap: ${sitemapUrl}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
