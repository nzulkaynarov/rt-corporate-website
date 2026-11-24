/**
 * Data contracts (docs/ARCHITECTURE.md §3): the CMS data and collections must stay consistent with each other,
 * so an agent or an editor cannot leave a dead tile, a broken home link or a redirect into nowhere.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';
import company from '../src/data/cms/company.json';
import home from '../src/data/cms/home.json';
import countries from '../src/data/cms/ui/countries.json';
import legacy from '../src/data/legacy-redirects.json';
import seo from '../src/data/cms/seo.json';
import legal from '../src/data/cms/legal.json';
import { cabinet } from '../src/utils/company';

const slugs = (dir: string) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const front = (file: string) => yaml.load(fs.readFileSync(file, 'utf8').split('---')[1]) as Record<string, any>;
const services = slugs('src/content/services');
const news = slugs('src/content/news');
const partners = slugs('src/content/partners');
const body = (file: string) => fs.readFileSync(file, 'utf8').split('---').slice(2).join('---').trim();
/** Partners whose article text is written: their page is /news/partner-<id>/ (src/utils/feed.ts). */
const partnerArticles = partners.filter((id) => body(`src/content/partners/${id}.md`) && front(`src/content/partners/${id}.md`).title);
const ROUTES = new Set(['/', '/services/', '/news/', '/contacts/', '/privacy/', '/terms/', '/cookies/', ...services.map((s) => `/services/${s}/`), ...news.map((s) => `/news/${s}/`), ...partnerArticles.map((id) => `/news/partner-${id}/`)]);
const routeExists = (href: string) => ROUTES.has(href.split('#')[0]);

describe('company.json', () => {
  it('has the contacts and links the site depends on', () => {
    expect(company.inn).toMatch(/^\d{9}$/);
    expect(company.phone).toMatch(/^\+998/);
    expect(company.email).toMatch(/@/);
    expect(company.cabinet.url).toMatch(/^https:\/\/cabinet\.railtech\.uz\/?$/);
    expect(cabinet.loginUrl).toBe('https://cabinet.railtech.uz/login');
    expect(cabinet.newClientUrl).toBe('https://cabinet.railtech.uz/new-client');
    expect(company.leadEndpoint).toMatch(/^https:\/\/.+\/api\/v1\/leads\/web$/);
    expect(company.metrics.length).toBeGreaterThan(0);
  });
});

describe('services collection', () => {
  it('has the four services of the architecture, each with an audience', () => {
    expect(services.sort()).toEqual(['engineering', 'localization', 'representation', 'supply']);
    for (const s of services) expect(['customers', 'partners']).toContain(front(`src/content/services/${s}.md`).audience);
  });
});

describe('partners collection (one record = tile + article)', () => {
  const countryCodes = new Set(countries.strings.map((s) => s.key.replace('country.', '')));
  it('every partner has a brand, a legal entity, a known country and a status', () => {
    expect(partners.length).toBeGreaterThan(0);
    for (const id of partners) {
      const d = front(`src/content/partners/${id}.md`);
      expect(d.name, id).toBeTruthy();
      expect(d.legalName, id).toBeTruthy();
      expect(countryCodes.has(d.country), `${id}: country ${d.country} has no country.<code> string`).toBe(true);
      expect(['dealer', 'direct']).toContain(d.status);
    }
  });
  it('a logo, when set, is an image file that exists under public/ (the admin uploads to /images/uploads/)', () => {
    for (const id of partners) {
      const logo = front(`src/content/partners/${id}.md`).logo;
      if (!logo) continue;
      expect(logo, id).toMatch(/^\/images\/.+\.(svg|png|jpe?g|webp)$/i);
      expect(fs.existsSync(path.join('public', logo)), `${id}: public${logo} is missing`).toBe(true);
    }
  });
  it('a written article has a title, a summary and a date', () => {
    for (const id of partnerArticles) {
      const d = front(`src/content/partners/${id}.md`);
      expect(d.summary, id).toBeTruthy();
      // The CMS writes the date unquoted, which YAML reads as a Date (the schema normalizes it the same way).
      const date = d.date instanceof Date ? d.date.toISOString().slice(0, 10) : String(d.date);
      expect(date, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it('partner article routes do not collide with news files', () => {
    for (const id of partners) expect(news, id).not.toContain(`partner-${id}`);
  });
});

describe('news collection', () => {
  it('references only known partners and services and valid types', () => {
    const ids = new Set(partners);
    for (const s of news) {
      const d = front(`src/content/news/${s}.md`);
      expect(['news', 'article', 'project']).toContain(d.type);
      for (const id of d.partners || []) expect(ids.has(id), `${s}: ${id}`).toBe(true);
      for (const slug of d.services || []) expect(services, `${s}: ${slug}`).toContain(slug);
    }
  });
});

describe('links in data', () => {
  it('home entries lead to existing pages', () => {
    for (const e of home.hero.entries) expect(routeExists(e.link), e.link).toBe(true);
  });
  it('legacy redirects lead to existing pages', () => {
    for (const [from, to] of Object.entries(legacy.redirects)) expect(routeExists(to), `${from} → ${to}`).toBe(true);
  });
});

describe('seo.json and legal.json', () => {
  it('every page key has a title ≤ 60 and a description of 50–160 characters', () => {
    for (const [key, page] of Object.entries(seo.pages)) {
      expect(page.title.length, key).toBeLessThanOrEqual(60);
      expect(page.description.length, key).toBeGreaterThanOrEqual(50);
      expect(page.description.length, key).toBeLessThanOrEqual(160);
    }
  });
  it('privacy, terms and cookies exist with sections', () => {
    for (const key of ['privacy', 'terms', 'cookies'] as const) expect(legal[key].sections.length).toBeGreaterThan(0);
  });
});

describe('no text in code', () => {
  it('components and pages contain no Cyrillic literals (texts live in src/data/cms)', () => {
    const files: string[] = [];
    const walk = (dir: string) =>
      fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) walk(p);
        else if (/\.(astro|tsx?)$/.test(d.name)) files.push(p);
      });
    ['src/components', 'src/pages', 'src/layouts', 'src/utils', 'src/i18n', 'src/scripts'].forEach(walk);
    const offenders = files.filter((f) => {
      const code = fs
        .readFileSync(f, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      return /[А-Яа-яЁё]/.test(code);
    });
    expect(offenders).toEqual([]);
  });
});
