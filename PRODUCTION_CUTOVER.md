# Инструкция по финальному переключению на боевой домен (PRODUCTION CUTOVER)

Данный документ — чек-лист для команды инженеров и контент-менеджеров по переводу сайта с технического подпути (`https://nzulkaynarov.github.io/rt-corporate-website/`) на официальный домен **`https://railtech.uz`**.

Выполняйте эти шаги в день релиза, когда контент в админке `/admin/` проверен и утвержден.

---

## ШАГ 1. Включить боевой домен в сборке

`astro.config.mjs` уже переключается переменной окружения `CUSTOM_DOMAIN`: при её наличии `site = https://railtech.uz`, `base = /`. Добавьте её в шаг сборки `.github/workflows/deploy.yml`:

```diff
       - name: Build static site with Astro
         run: npm run build
+        env:
+          CUSTOM_DOMAIN: "1"
```

> Все внутренние ссылки строятся через `localeHref()` (страницы, с языковым префиксом `/uz/`, `/en/`) и `withBase()` (файлы), а canonical, hreflang, sitemap, `robots.txt` и schema.org — из `site`/`base`, поэтому при переключении всё перестроится автоматически. Проверка `npm run build` (postbuild `scripts/check-build.mjs`) подтвердит, что ссылки и мета-теги корректны.

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
   * В сгенерированном `dist/sitemap-0.xml` все URL начинаются с `https://railtech.uz/`, у каждой страницы есть альтернативы `hreflang` ru / uz / en, а `dist/robots.txt` указывает на `https://railtech.uz/sitemap-index.xml`.
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
