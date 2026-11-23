# Переезд на railtech.uz (production cutover)

Перевод сайта с `https://nzulkaynarov.github.io/rt-corporate-website/` на **`https://railtech.uz`**.
**Выполнен 2026-11-23** (PR #34, #35; домен перенесён с `nzulkaynarov/rt`, тот архивирован). Документ остаётся как
описание устройства и порядок отката. Изменения в репозитории делаются через PR в `main`; мёрж PR публикует сайт.

Проверено после переезда: страницы на трёх языках (компьютер и телефон) без ошибок, canonical на `https://railtech.uz`,
`/pages/privacy.html` → `/privacy/`, `http://` и старый адрес github.io → `https://railtech.uz`, HTTPS принудительный,
форма получает токен CRM со страницы, админка `/admin/` открывается.

**`www` (2026-11-24):** `https://www.railtech.uz` переадресует на `https://railtech.uz`. В DNS (Яндекс) запись `www` —
CNAME `nzulkaynarov.github.io.`, сертификат GitHub выпущен на оба имени. Как это чинилось — на случай повторения:

- GitHub хранит сертификат по имени домена и переиспользует его: снять и снова привязать `railtech.uz` недостаточно.
  Новый сертификат на оба имени выпускается, если в Settings → Pages → Custom domain временно поставить
  `www.railtech.uz`, дождаться сертификата и вернуть `railtech.uz` (затем включить «Enforce HTTPS»).
- После возврата основного имени главная может уйти в петлю переадресаций (`railtech.uz` ↔ `www`): в кэше GitHub
  остаётся старый ответ. Кэш сбрасывает повторная публикация: Actions → «Deploy RailTech Portal to GitHub Pages» →
  Run workflow (`gh workflow run deploy.yml --ref main`).
- Пока основным стоит `www`, форма заявок не работает: CRM принимает запросы только с `https://railtech.uz`.

## 0. Что было перед переездом

- **Домен уже смотрит на GitHub Pages.** `railtech.uz` → A-записи GitHub (`185.199.108–111.153`), `www` → CNAME на
  `railtech.uz`, DNS у Яндекса. Менять DNS не нужно.
- **Домен занят старым сайтом.** `railtech.uz` привязан к репозиторию `nzulkaynarov/rt` («Static website for
  railtech.uz», файл `site/CNAME`, публикация через `pages.yml`). У него три страницы: `/`, `/pages/privacy.html`,
  `/pages/terms.html` и языки через `?lang=`. Переезд = перенос домена с `rt` на `rt-corporate-website`.
- **CRM уже принимает заявки с `https://railtech.uz`** (заголовок `access-control-allow-origin` есть). С
  `https://nzulkaynarov.github.io` и `https://www.railtech.uz` — нет: до переезда форма показывает запасные каналы, а
  `www` GitHub сам переадресует на основной домен.
- Сайт собирается под домен: `CUSTOM_DOMAIN=1 npm run build` проходит, canonical, sitemap и `robots.txt` указывают на
  `https://railtech.uz`.
- Адреса старого сайта не потеряются: `/pages/privacy.html` и `/pages/terms.html` перенаправляются на `/privacy/` и
  `/terms/` (`src/data/legacy-redirects.json`), `?lang=uz|en` — на `/uz/` и `/en/` (BaseLayout).

## 1. Порядок переезда

Шаги 2–4 идут подряд: между ними сайт по одному из адресов недоступен (обычно несколько минут; сертификат HTTPS
GitHub выпускает до часа).

1. **Подготовка (без изменений для посетителей).** Смёржить перенаправления старых адресов. Заменить тестовый
   Telegram-бот (§3), если рабочий бот готов.
2. **Сборка под домен.** PR: в `.github/workflows/deploy.yml` шагу сборки добавить переменную:

   ```diff
          - name: Build static site with Astro (includes CMS schema check and dist audit)
            run: npm run build
   +        env:
   +          CUSTOM_DOMAIN: "1"
   ```

   После мёржа адрес `nzulkaynarov.github.io/rt-corporate-website/` перестаёт работать (ссылки строятся от корня
   домена) — поэтому сразу шаг 3.
3. **Перенос домена.**
   - репозиторий `rt` → Settings → Pages → Custom domain: очистить (и убрать `site/CNAME`, иначе следующая публикация
     вернёт домен; проще всего отключить `pages.yml` или архивировать репозиторий);
   - репозиторий `rt-corporate-website` → Settings → Pages → Custom domain: `railtech.uz`. Публикация идёт через
     GitHub Actions, файл `public/CNAME` не нужен.
4. **HTTPS.** Дождаться проверки домена и сертификата, включить «Enforce HTTPS».
5. **Проверка на railtech.uz:** главная на трёх языках, `/pages/privacy.html` → `/privacy/`, `https://www.railtech.uz`
   → основной домен, форма получает токен и отправляет заявку (`202`), заявка появляется в очереди CRM с источником
   «сайт», админка `/admin/` открывается и сохраняет.
6. **Откат**, если что-то пошло не так: вернуть домен репозиторию `rt` (шаг 3 в обратную сторону) и откатить PR из шага 2.

Тесты Playwright (`make e2e`) рассчитаны на базу `/rt-corporate-website/`, поэтому идут без `CUSTOM_DOMAIN` — CI для
PR не меняется.

## 2. Админка после переезда

`/admin/` входит через GitHub. В настройках OAuth-приложения (или сервиса авторизации Sveltia), если он используется,
адрес сайта должен быть `https://railtech.uz`. Вход токеном доступа и работа с локальным репозиторием от домена не зависят.

## 3. Telegram-бот

В `src/data/cms/company.json → telegramBot` стоит рабочий бот CRM (`uzrailtech_bot`, с 2026-11-23). Имя меняется без
`@`: админка → «Компания», или PR через скил `edit-site-texts`. После замены проверьте ссылку `t.me/<бот>?start=web` — она
стоит в форме, футере и панели связи на телефоне.

## 4. Поисковые системы

1. Google Search Console и Яндекс Вебмастер: подтвердить `https://railtech.uz` (если ещё не подтверждён для старого
   сайта) и отправить `https://railtech.uz/sitemap-index.xml`.
2. Через 1–2 недели проверить индексацию страниц на трёх языках и отчёт hreflang. Материал «Новостей», ещё не
   переведённый на язык, закрыт `noindex` на этом языке — это ожидаемо.

## 5. После переезда

- `docs/STATUS.md`: записать дату переезда; убрать из «Ждём от владельца» выполненное.
- Репозиторий `rt` архивировать, чтобы он случайно не забрал домен обратно.
- Обложки материалов и проверка UZ/EN носителем — по `docs/STATUS.md`.
