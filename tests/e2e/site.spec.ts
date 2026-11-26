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

test('phones keep the request, Telegram and a call one tap away in the bottom bar', async ({ page, isMobile }) => {
  await page.goto('services/supply/');
  const bar = page.locator('.mbar');
  if (!isMobile) return void (await expect(bar).toBeHidden());
  await expect(bar).toBeVisible();
  await expect(bar.locator('a[href$="/contacts/#request"]')).toBeVisible();
  await expect(bar.locator('a[href^="https://t.me/"]')).toBeVisible();
  await expect(bar.locator('a[href^="tel:"]')).toBeVisible();
  for (const a of await bar.locator('a').all()) expect((await a.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  // the page ends above the bar: at the very bottom the last line of the footer is not covered
  const room = await page.evaluate(() => {
    const spans = document.querySelectorAll('footer span');
    const last = spans[spans.length - 1].getBoundingClientRect();
    return document.documentElement.scrollHeight - (last.bottom + window.scrollY);
  });
  expect(room).toBeGreaterThanOrEqual((await bar.boundingBox())!.height);
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
  expect(sent).toMatchObject({ name: 'Тест Тестов', phone: '+998900000000', text: 'Проверка формы', language: 'ru', form_token: 'test-token', consent: true, website: '', form: 'site' });
  expect((sent as unknown as { page: string }).page).toMatch(/\/contacts\/$/);
});

test('a number the CRM refuses is shown at the field, the request number at success', async ({ page }) => {
  await mockCrm(page, { status: 422, body: { code: 'validation_failed', details: { reason: 'invalid_phone', field: 'phone' } } });
  await page.goto('contacts/');
  await page.locator('#request astro-island:not([ssr])').waitFor();
  const form = page.locator('#request form');
  await form.locator('input[name="name"]').fill('Тест Тестов');
  await form.locator('input[name="contact"]').fill('+998 90 000-00-00');
  await form.locator('textarea[name="text"]').fill('Проверка формы');
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button').click();
  await expect(form.locator('#contacts-lead-contact-err')).toBeVisible();
  await expect(form.locator('.lf__fail')).toHaveCount(0);
  await expect(form.locator('input[name="contact"]')).toHaveCSS('border-top-color', 'rgb(160, 49, 47)');
  await page.unroute(CRM);
  await page.route(CRM, (route) => route.fulfill({ status: 202, json: { lead_id: 42, request_number: 'L-0042' } }));
  await form.getByRole('button').click();
  await expect(page.getByRole('status')).toContainText('L-0042');
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
  const type = 'project';
  const total = await page.locator(`[data-news-list] li[data-type="${type}"]`).count();
  expect(total).toBeGreaterThan(0);
  await page.locator(`[data-news-filter] button[data-type="${type}"]`).click();
  const visible = page.locator('[data-news-list] li:not([hidden])');
  expect(await visible.count()).toBe(total);
  for (const li of await visible.all()) await expect(li).toHaveAttribute('data-type', type);
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

test('«Производители» lists every partner, links to the articles and owns them in the menu', async ({ page }) => {
  await page.goto('partners/');
  await expect(page.locator('h1')).toBeVisible();
  for (const p of partnerArticles) await expect(page.locator(`.tiles a[href$="/news/${p.article}/"]`)).toHaveCount(1);
  await page.goto(`news/${partnerArticles[0].article}/`);
  await expect(page.locator('nav.crumbs a[href$="/partners/"]')).toBeVisible();
  await page.goto('news/');
  await expect(page.locator('[data-news-list] li[data-type="partner"]')).toHaveCount(0);
});

test('a service page preselects the role in the request form and the lead carries it', async ({ page }) => {
  await mockCrm(page, { status: 202, body: { lead_id: 7 } });
  await page.goto('services/representation/?utm_source=test');
  const cta = page.locator('section.cta a.btn--light');
  await expect(cta).toHaveAttribute('href', /\/contacts\/\?role=partner#request$/);
  await cta.click();
  await page.locator('#request astro-island:not([ssr])').waitFor();
  const form = page.locator('#request form');
  await expect(form.locator('input[name="role"][value="partner"]')).toBeChecked();
  let sent: Record<string, unknown> | null = null;
  page.on('request', (req) => {
    if (req.method() === 'POST' && req.url() === CRM) sent = req.postDataJSON();
  });
  await form.locator('input[name="name"]').fill('Тест');
  await form.locator('input[name="contact"]').fill('test@example.com');
  await form.locator('textarea[name="text"]').fill('Проверка роли');
  await form.locator('input[name="consent"]').check();
  await form.getByRole('button', { name: /./ }).last().click();
  await expect(page.getByRole('status')).toBeVisible();
  expect(sent).toMatchObject({ form: 'site-partner', utm: { utm_source: 'test' } });
  expect((sent as unknown as { page: string }).page).toMatch(/\/services\/representation\/$/);
});

test('pages work under the Content Security Policy (no violations)', async ({ page }) => {
  // Record every CSP violation the browser reports (src/layouts/BaseLayout.astro → csp).
  await page.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener('securitypolicyviolation', (e) =>
      (window as unknown as { __csp: string[] }).__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  await mockCrm(page, { status: 202, body: { lead_id: 1 } });
  for (const path of ['', 'contacts/', 'news/', 'news/partner-gersys/', 'en/services/supply/']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp), path).toEqual([]);
  }
});

test('the full header fits without overlaps in every language; narrower windows fold the menu', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop widths only');
  for (const lang of ['', 'uz/', 'en/']) {
    for (const width of [1240, 1280, 1366, 1920]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(lang);
      await expect(page.locator('.hdr .nav')).toBeVisible();
      const boxes = await page.locator('.hdr__in > *:visible').evaluateAll((els) =>
        els.map((e) => ({ left: e.getBoundingClientRect().left, right: e.getBoundingClientRect().right, h: e.getBoundingClientRect().height, squeezed: e.scrollWidth > e.clientWidth + 1 })),
      );
      for (let i = 1; i < boxes.length; i++) expect(boxes[i].left, `${lang || 'ru/'} at ${width}px`).toBeGreaterThanOrEqual(boxes[i - 1].right);
      expect(boxes.at(-1)!.right).toBeLessThanOrEqual(width);
      expect(boxes.some((b) => b.squeezed), 'no part is narrower than its text (logo under «Услуги»)').toBe(false);
      expect(Math.max(...boxes.map((b) => b.h)), 'menu items stay on one line').toBeLessThan(50);
    }
    await page.setViewportSize({ width: 1239, height: 800 });
    await page.goto(lang);
    await expect(page.locator('.hdr .nav')).toBeHidden();
    await expect(page.locator('.mmenu summary')).toBeVisible();
  }
});
