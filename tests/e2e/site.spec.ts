/**
 * What a visitor must always be able to do (docs/ARCHITECTURE.md §2, §5). Runs on desktop and phone projects.
 * The CRM is mocked: no real leads are sent from tests.
 */
import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import yaml from 'js-yaml';

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8'));
const company = readJson('src/data/cms/company.json');
/** Partners (src/content/partners: tile + article) in tile order; `article` is the route slug once the text exists. */
const partners = fs
  .readdirSync('src/content/partners')
  .filter((n) => n.endsWith('.md'))
  .map((n) => {
    const [, front, ...rest] = fs.readFileSync(`src/content/partners/${n}`, 'utf8').split('---');
    const d = yaml.load(front) as { order?: number; title?: string };
    const id = n.replace(/\.md$/, '');
    return { id, order: d.order ?? 99, article: rest.join('---').trim() && d.title ? `partner-${id}` : '' };
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
const partnerArticles = partners.filter((p) => p.article);

const PAGES = ['', 'services/', 'services/supply/', 'services/engineering/', 'services/representation/', 'services/localization/', 'news/', 'contacts/', 'privacy/', 'terms/', 'cookies/'];
const CRM = company.leadEndpoint;

/**
 * How far the page is wider than the screen. `window.innerWidth` is useless here: in mobile emulation the layout
 * viewport grows with the content, so the page width is compared with the configured screen width.
 */
async function pageOverflow(page: Page): Promise<number> {
  const screen = page.viewportSize()?.width ?? 0;
  return (await page.evaluate(() => document.documentElement.scrollWidth)) - screen;
}

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|crm\.railtech\.uz|CORS/i.test(m.text())) errors.push(m.text());
  });
  return errors;
}

async function mockCrm(page: Page, post: { status: number; body: unknown }) {
  await page.route(`${CRM}/token`, (route) => route.fulfill({ json: { token: 'test-token', expires_at: '2099-01-01T00:00:00Z', min_fill_seconds: 0 } }));
  await page.route(CRM, (route) => route.fulfill({ status: post.status, json: post.body }));
}

test.describe('every page', () => {
  for (const path of PAGES) {
    test(`/${path} renders with one h1, no errors and no horizontal scroll`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }
});

// Every material: a long URL or designation in the text must wrap, not widen the page (phones scroll sideways otherwise).
test.describe('every material', () => {
  const news = fs.readdirSync('src/content/news').filter((n) => n.endsWith('.md')).map((n) => n.replace(/\.md$/, ''));
  for (const slug of [...news, ...partnerArticles.map((p) => p.article)]) {
    test(`/news/${slug}/ fits the screen`, async ({ page }) => {
      await page.goto(`news/${slug}/`);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});

test('single pages use the side column on wide screens and one column on phones', async ({ page, isMobile }) => {
  await page.goto(`news/${partnerArticles[0].article}/`);
  const text = await page.locator('.prose').boundingBox();
  const card = await page.locator('.art__aside .card').boundingBox();
  expect(text && card).toBeTruthy();
  if (isMobile) expect(card!.y).toBeLessThan(text!.y); // partner card above the text, same column
  else expect(card!.x).toBeGreaterThan(text!.x + text!.width); // to the right of the text
});

test('header offers «Начать работу» and «Войти в Кабинет»', async ({ page, isMobile }) => {
  await page.goto('');
  if (isMobile) await page.locator('.mmenu summary').click();
  const scope = isMobile ? page.locator('.mmenu__panel') : page.locator('.hdr__cta');
  await expect(scope.locator(`a[href="${company.cabinet.url}/login"]`)).toBeVisible();
  const start = scope.locator('a[href$="/contacts/#request"]');
  await expect(start).toBeVisible();
  await start.click();
  await expect(page).toHaveURL(/\/contacts\/#request$/);
  await expect(page.locator('#request form')).toBeVisible();
});

test('the lead form validates, sends to the CRM and confirms', async ({ page }) => {
  await mockCrm(page, { status: 202, body: { lead_id: 42 } });
  await page.goto('contacts/');
  // The form is a React island: wait until it is hydrated (Astro removes the `ssr` attribute), then type.
  await page.locator('#request astro-island:not([ssr])').waitFor();
  const form = page.locator('#request form');
  await form.getByRole('button').click();
  await expect(form.locator('.lf__err').first()).toBeVisible();

  let sent: Record<string, unknown> | null = null;
  page.on('request', (req) => {
    if (req.method() === 'POST' && req.url() === CRM) sent = req.postDataJSON();
  });
  await form.locator('input[name="name"]').fill('Тест Тестов');
  await form.locator('input[name="contact"]').fill('+998 90 000-00-00');
  await form.locator('textarea[name="text"]').fill('Проверка формы');
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button').click();
  await expect(page.getByRole('status')).toBeVisible();
  expect(sent).toMatchObject({ name: 'Тест Тестов', phone: '+998900000000', text: 'Проверка формы', language: 'ru', form_token: 'test-token', consent: true, website: '' });
});

test('when the CRM is unreachable the form shows other channels', async ({ page }) => {
  await page.route(`${CRM}/token`, (route) => route.abort());
  await page.route(CRM, (route) => route.abort());
  await page.goto('contacts/');
  // The form is a React island: wait until it is hydrated (Astro removes the `ssr` attribute), then type.
  await page.locator('#request astro-island:not([ssr])').waitFor();
  const form = page.locator('#request form');
  await form.locator('input[name="name"]').fill('Тест');
  await form.locator('input[name="contact"]').fill('test@example.com');
  await form.locator('textarea[name="text"]').fill('Проверка');
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button').click();
  await expect(form.locator('.lf__alt a[href*="cabinet.railtech.uz"]')).toBeVisible();
});

test('partner tiles lead to the partner articles', async ({ page }) => {
  await page.goto('');
  const first = partnerArticles[0];
  await page.locator(`#partners a[href$="/news/${first.article}/"]`).click();
  await expect(page).toHaveURL(new RegExp(`/news/${first.article}/$`));
  await expect(page.locator('h1')).toBeVisible();
});

test('news filter shows only the chosen type', async ({ page }) => {
  await page.goto('news/');
  await page.locator('[data-news-filter] button[data-type="partner"]').click();
  const visible = page.locator('[data-news-list] li:not([hidden])');
  expect(await visible.count()).toBe(partnerArticles.length);
  for (const li of await visible.all()) await expect(li).toHaveAttribute('data-type', 'partner');
});

test('old v1 URLs redirect to the new sections', async ({ page }) => {
  await page.goto('catalog/');
  await expect(page).toHaveURL(/\/services\/supply\/$/);
  await page.goto('blog/railtech-official-dealer-npo-saut/');
  await expect(page).toHaveURL(/\/news\/railtech-official-dealer-npo-saut\/$/);
});

test.describe('languages (src/data/content-stage.json)', () => {
  const stage = readJson('src/data/content-stage.json') as { ruOnly?: boolean; ruOnlySections?: string[] };
  test.skip(stage.ruOnly === true, 'RU-first stage: UZ/EN are not published yet');

  for (const lang of ['uz', 'en']) {
    // «Новости» too once the section is translated (titles without Cyrillic designations, so the h1 check holds)
    const news = (stage.ruOnlySections || []).includes('news') ? [] : ['news/', 'news/railtech-platform/', 'news/partner-gersys/'];
    for (const path of ['', 'services/supply/', 'contacts/', 'privacy/', ...news]) {
      test(`/${lang}/${path} is translated and indexable`, async ({ page }) => {
        await page.goto(`${lang}/${path}`);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index/);
        const h1 = (await page.locator('h1').textContent()) || '';
        expect(h1).not.toMatch(/[А-Яа-яЁё]/);
      });
    }
  }

  test('the language switcher keeps the page', async ({ page }) => {
    await page.goto('services/supply/');
    await page.locator('.langs a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/en\/services\/supply\/$/);
  });

  test('a Russian-only section is shown in Russian on /uz/ and kept out of search', async ({ page }) => {
    test.skip(!(stage.ruOnlySections || []).includes('news'), 'news is translated');
    await page.goto(`uz/news/${partnerArticles[0].article}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('article')).toHaveAttribute('lang', 'ru');
  });
});
