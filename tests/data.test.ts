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
import partners from '../src/data/cms/partners.json';
import legacy from '../src/data/legacy-redirects.json';
import seo from '../src/data/cms/seo.json';
import legal from '../src/data/cms/legal.json';

const slugs = (dir: string) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const front = (file: string) => yaml.load(fs.readFileSync(file, 'utf8').split('---')[1]) as Record<string, any>;
const services = slugs('src/content/services');
const news = slugs('src/content/news');
const ROUTES = new Set(['/', '/services/', '/news/', '/contacts/', '/privacy/', '/terms/', '/cookies/', ...services.map((s) => `/services/${s}/`), ...news.map((s) => `/news/${s}/`)]);
const routeExists = (href: string) => ROUTES.has(href.split('#')[0]);

describe('company.json', () => {
  it('has the contacts and links the site depends on', () => {
    expect(company.inn).toMatch(/^\d{9}$/);
    expect(company.phone).toMatch(/^\+998/);
    expect(company.email).toMatch(/@/);
    expect(company.cabinet.loginUrl).toMatch(/^https:\/\/cabinet\.railtech\.uz\//);
    expect(company.cabinet.newClientUrl).toMatch(/^https:\/\/cabinet\.railtech\.uz\//);
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

describe('partners.json', () => {
  it('every tile points to an existing partner article that names the partner', () => {
    for (const p of partners.partners) {
      expect(['dealer', 'direct']).toContain(p.status);
      expect(news, `article for ${p.id}`).toContain(p.article);
      const d = front(`src/content/news/${p.article}.md`);
      expect(d.type).toBe('partner');
      expect(d.partners).toContain(p.id);
    }
  });
  it('ids are unique', () => {
    const ids = partners.partners.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('news collection', () => {
  it('references only known partners and valid types', () => {
    const ids = new Set(partners.partners.map((p) => p.id));
    for (const s of news) {
      const d = front(`src/content/news/${s}.md`);
      expect(['news', 'article', 'project', 'partner']).toContain(d.type);
      for (const id of d.partners || []) expect(ids.has(id), `${s}: ${id}`).toBe(true);
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
