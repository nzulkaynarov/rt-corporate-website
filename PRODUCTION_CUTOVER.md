# Инструкция по финальному переключению на боевой домен (PRODUCTION CUTOVER)

Данный документ — чек-лист для команды инженеров и контент-менеджеров по переводу сайта с технического подпути (`https://nzulkaynarov.github.io/rt-corporate-website/`) на официальный домен **`https://railtech.uz`**.

Выполняйте эти шаги в день релиза, когда контент в админке `/admin/` проверен и утвержден.

---

## ШАГ 1. Корректировка конфигурации в `astro.config.mjs`

В файле [`astro.config.mjs`](./astro.config.mjs) переключите `site` и `base` на боевой домен без подпапки:

```diff
- const isGHPages = Boolean(process.env.GITHUB_ACTIONS && !process.env.CUSTOM_DOMAIN);
-
  export default defineConfig({
-   site: isGHPages ? 'https://nzulkaynarov.github.io' : 'https://railtech.uz',
-   base: isGHPages ? '/rt-corporate-website' : '/',
+   site: 'https://railtech.uz',
+   base: '/',
    output: 'static',
    integrations: [
      tailwind({ applyBaseStyles: false }),
      react(),
      sitemap(),
    ],
  });
```

> **Важно:** Все внутренние ссылки в компонентах и страницах проекта уже построены через универсальный хелпер `withBase()` и `import.meta.env.BASE_URL`, поэтому при `base: '/'` все URL автоматически перестроятся на корень домена (например, `/catalog/`, `/blog/`, `/images/uploads/...`).

---

## ШАГ 2. Создание файла `public/CNAME`

В директории `public/` создайте файл `CNAME` (без расширения) с именем боевого домена:

```text
railtech.uz
```

Команда в терминале:

```bash
echo "railtech.uz" > public/CNAME
```

---

## ШАГ 3. Настройка DNS и валидация сборки

1. **DNS-записи у регистратора домена (`railtech.uz`):**
   Если хостинг осуществляется через GitHub Pages, пропишите А-записи для apex-домена:
   * `A` `@` → `185.199.108.153`
   * `A` `@` → `185.199.109.153`
   * `A` `@` → `185.199.110.153`
   * `A` `@` → `185.199.111.153`
   * `CNAME` `www` → `nzulkaynarov.github.io.`

   *(Если используется Cloudflare DNS / Прокси — включите «Proxied» (оранжевое облако) и настройте SSL в режим «Full»)*.

2. **Проверка переменных окружения для лидогенерации (GitHub Secrets / Cloudflare):**
   Убедитесь, что в GitHub Repository Secrets добавлены:
   * `PUBLIC_LEAD_WEBHOOK_URL` — URL вебхука Cloudflare Worker или CRM
   * `PUBLIC_TG_BOT_TOKEN` — токен Telegram-бота для уведомлений отдела продаж
   * `PUBLIC_TG_CHAT_ID` — ID корпоративного чата заявок

3. **Локальная проверка сборки перед пушем:**

   ```bash
   npm run build
   ```

   Убедитесь, что:
   * Сборка завершается с кодом `0` (0 errors, 0 warnings).
   * В сгенерированном `dist/sitemap-0.xml` все URL начинаются с `https://railtech.uz/`.
   * В `dist/index.html` канонический URL и OpenGraph обложка указывают на:
     * `<link rel="canonical" href="https://railtech.uz/" />`
     * `<meta property="og:image" content="https://railtech.uz/og-cover.png" />`

4. **Пуш в ветку `main`:**

   ```bash
   git add astro.config.mjs public/CNAME
   git commit -m "chore(release): switch domain to https://railtech.uz"
   git push origin main
   ```

   GitHub Actions автоматически соберет проект и активирует SSL-сертификат Let's Encrypt для `railtech.uz`.
