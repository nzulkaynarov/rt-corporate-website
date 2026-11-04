/**
 * What a visitor must always be able to do (docs/ARCHITECTURE.md §2, §5). Runs on desktop and phone projects.
 * The CRM is mocked: no real leads are sent from tests.
 */
import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8'));
const company = readJson('src/data/cms/company.json');
const partners = readJson('src/data/cms/partners.json') as { partners: { id: string; article: string }[] };

const PAGES = ['', 'services/', 'services/supply/', 'services/engineering/', 'services/representation/', 'services/localization/', 'news/', 'contacts/', 'privacy/', 'terms/', 'cookies/'];
const CRM = company.leadEndpoint;

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
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }
});

test('header offers «Начать работу» and «Войти в Кабинет»', async ({ page, isMobile }) => {
  await page.goto('');
  if (isMobile) await page.locator('.mmenu summary').click();
  const scope = isMobile ? page.locator('.mmenu__panel') : page.locator('.hdr__cta');
  await expect(scope.locator(`a[href="${company.cabinet.loginUrl}"]`)).toBeVisible();
  const start = scope.locator('a[href$="/contacts/#request"]');
  await expect(start).toBeVisible();
  await start.click();
  await expect(page).toHaveURL(/\/contacts\/#request$/);
  await expect(page.locator('#request form')).toBeVisible();
});

test('the lead form validates, sends to the CRM and confirms', async ({ page }) => {
  await mockCrm(page, { status: 202, body: { lead_id: 42 } });
  await page.goto('contacts/');
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
  const first = partners.partners[0];
  await page.locator(`#partners a[href$="/news/${first.article}/"]`).click();
  await expect(page).toHaveURL(new RegExp(`/news/${first.article}/$`));
  await expect(page.locator('h1')).toBeVisible();
});

test('news filter shows only the chosen type', async ({ page }) => {
  await page.goto('news/');
  await page.locator('[data-news-filter] button[data-type="partner"]').click();
  const visible = page.locator('[data-news-list] li:not([hidden])');
  expect(await visible.count()).toBe(partners.partners.length);
  for (const li of await visible.all()) await expect(li).toHaveAttribute('data-type', 'partner');
});

test('old v1 URLs redirect to the new sections', async ({ page }) => {
  await page.goto('catalog/');
  await expect(page).toHaveURL(/\/services\/supply\/$/);
  await page.goto('blog/railtech-official-dealer-npo-saut/');
  await expect(page).toHaveURL(/\/news\/railtech-official-dealer-npo-saut\/$/);
});
