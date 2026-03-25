# Руководство по развертыванию Hugo на GitHub Pages

## Оглавление
1. [Требования](#требования)
2. [Создание репозитория](#создание-репозитория)
3. [GitHub Actions Workflow](#github-actions-workflow)
4. [Настройка GitHub Pages](#настройка-github-pages)
5. [Пользовательский домен](#пользовательский-домен)
6. [Обработка baseURL](#обработка-baseurl)
7. [Переменные окружения](#переменные-окружения)
8. [Решение проблем](#решение-проблем)

---

## Требования

Перед началом развертывания убедитесь, что у вас есть:

### 1. Hugo установлена локально
```bash
# Проверка установки Hugo
hugo version

# Если Hugo не установлена:
# macOS (Homebrew)
brew install hugo

# Ubuntu/Debian
sudo apt-get install hugo

# Windows (Chocolatey)
choco install hugo-extended
```

**Важно:** Для RailTech используется Hugo Extended версия 0.145.0. Убедитесь, что установлена расширенная версия для поддержки SCSS/SASS.

### 2. Git установлен и настроен
```bash
# Проверка установки Git
git version

# Первичная настройка (если требуется)
git config --global user.name "Ваше имя"
git config --global user.email "ваш@email.com"
```

### 3. Учетная запись GitHub
- Зарегистрироваться на https://github.com (если еще нет)
- Сгенерировать Personal Access Token (PAT) для безопасного доступа

---

## Создание репозитория

### Шаг 1: Создание репозитория на GitHub

1. Перейти на https://github.com/new
2. Заполнить параметры:
   - **Repository name:** `rt-corporate-website` (или другое название)
   - **Description:** "RailTech Corporate Website - Hugo"
   - **Visibility:** Public (для GitHub Pages)
   - **Initialize:** Оставить пустым (клонируем локальный проект)

3. Нажать "Create repository"

### Шаг 2: Инициализация локального Git репозитория

```bash
cd /path/to/rt-corporate-website

# Инициализация репозитория
git init

# Добавление remote
git remote add origin https://github.com/yourusername/rt-corporate-website.git

# Переименование ветки (если требуется)
git branch -M main

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: RailTech Hugo website setup"

# Отправка на GitHub
git push -u origin main
```

### Шаг 3: Структура репозитория

После отправки репозиторий должен содержать:

```
rt-corporate-website/
├── .github/
│   └── workflows/
│       └── hugo.yml          # GitHub Actions workflow
├── content/
│   ├── en/
│   ├── ru/
│   └── uz/
├── static/
│   ├── img/
│   ├── css/
│   └── js/
├── themes/
│   └── railtech/
├── archetypes/
├── config.toml               # Основная конфигурация Hugo
├── hugo.toml                 # Альтернативный формат конфига
├── .gitignore               # Git ignore file
└── README.md
```

---

## GitHub Actions Workflow

### Шаг 1: Создание директории для workflow

```bash
mkdir -p .github/workflows
```

### Шаг 2: Создание файла `hugo.yml`

Создать файл `.github/workflows/hugo.yml` с точным содержимым:

```yaml
name: Deploy Hugo to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.145.0
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb
          sudo dpkg -i ${{ runner.temp }}/hugo.deb

      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_ENVIRONMENT: production
          TZ: Asia/Tashkent
        run: |
          hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Шаг 3: Отправка workflow в репозиторий

```bash
git add .github/workflows/hugo.yml
git commit -m "Add GitHub Actions workflow for Hugo deployment"
git push origin main
```

### Как работает Workflow

1. **Триггеры:**
   - Автоматический запуск при `push` в ветку `main`
   - Ручной запуск через кнопку "Run workflow" на GitHub

2. **Job "build":**
   - Устанавливает Hugo 0.145.0
   - Выполняет `git checkout` с поддержкой подмодулей
   - Конфигурирует GitHub Pages
   - Собирает сайт с минификацией
   - Загружает артефакт в GitHub Pages

3. **Job "deploy":**
   - Развертывает собранный сайт на GitHub Pages
   - Зависит от успешного завершения job "build"

---

## Настройка GitHub Pages

### Шаг 1: Включение GitHub Pages

1. Перейти в **Settings** репозитория
2. В левом меню выбрать **Pages**
3. Под "Build and deployment":
   - **Source:** Выбрать "GitHub Actions"
   - Остальное настроится автоматически

### Шаг 2: Проверка развертывания

1. Перейти на вкладку **Actions** в репозитории
2. Выбрать последний workflow run
3. Убедиться, что оба job завершены успешно (зеленая галочка)
4. Сайт будет доступен по адресу: `https://yourusername.github.io/rt-corporate-website/`

### Шаг 3: Проверка статуса Pages

В **Settings → Pages** должно быть сообщение:
```
Your site is live at https://yourusername.github.io/rt-corporate-website/
```

---

## Пользовательский домен

### Для домена railtech.uz

#### Шаг 1: Подготовка в GitHub

1. Перейти в **Settings → Pages**
2. Под "Custom domain" ввести: `railtech.uz`
3. Нажать "Save"
4. Убедиться, что включена опция "Enforce HTTPS"

#### Шаг 2: Настройка DNS (у провайдера)

Добавить CNAME запись:

```
Хост:  www
Тип:   CNAME
Значение: yourusername.github.io
```

Или для apex домена (без www):

```
Тип:   A
Значения:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
```

#### Шаг 3: Обновление config.toml

```toml
# config.toml
baseURL = "https://railtech.uz/"
```

#### Шаг 4: Проверка

```bash
# Проверить DNS propagation
nslookup railtech.uz
dig railtech.uz CNAME
```

Может потребоваться до 24 часов для полной пропаганды DNS.

---

## Обработка baseURL

### Как GitHub Actions управляет baseURL

В workflow файле используется динамическое значение baseURL:

```yaml
- name: Build with Hugo
  run: |
    hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
```

Переменная `steps.pages.outputs.base_url` автоматически содержит:
- Для стандартного GitHub Pages: `https://yourusername.github.io/rt-corporate-website`
- Для пользовательского домена: `https://railtech.uz`

### Локальная разработка

Для локального тестирования:

```bash
# Без baseURL (для проверки внутренних ссылок)
hugo server

# С определенным baseURL
hugo server --baseURL "http://localhost:1313/" --bind "0.0.0.0"
```

### Проблемы с baseURL

**Проблема:** Изображения и стили не загружаются после развертывания

**Решение:** Убедитесь, что в шаблонах используются функции Hugo для генерации URL:

```html
<!-- Правильно: относительный путь -->
<img src="{{ .RelPermalink }}" alt="Description">

<!-- Правильно: абсолютный путь с baseURL -->
<img src="{{ relURL "/img/logo.png" }}" alt="Logo">

<!-- Неправильно: hardcoded пути -->
<img src="/img/logo.png" alt="Logo">
```

---

## Переменные окружения

### Web3Forms API Key

Для формы обратной связи требуется Web3Forms API ключ:

#### Шаг 1: Получение ключа

1. Перейти на https://web3forms.com
2. Зарегистрироваться или войти
3. Получить API ключ

#### Шаг 2: Добавление в GitHub Secrets

1. Перейти в **Settings → Secrets and variables → Actions**
2. Нажать "New repository secret"
3. Добавить:
   - **Name:** `WEB3FORMS_API_KEY`
   - **Value:** [Скопировать ключ с Web3Forms]

#### Шаг 3: Использование в workflow (опционально)

Если требуется передать переменную окружения при сборке:

```yaml
- name: Build with Hugo
  env:
    HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
    HUGO_ENVIRONMENT: production
    TZ: Asia/Tashkent
    WEB3FORMS_API_KEY: ${{ secrets.WEB3FORMS_API_KEY }}
  run: |
    hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
```

#### Шаг 4: Использование в контенте

В config.toml или params:

```toml
[params]
web3FormsKey = "your_api_key_here"
```

Или в HTML форме:

```html
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="your_api_key_here">
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Отправить</button>
</form>
```

---

## Решение проблем

### 1. Workflow не запускается

**Проблема:** Actions не запускаются при push

**Решение:**
- Проверить, что файл находится в `.github/workflows/hugo.yml`
- Убедиться, что branch назван `main` (не `master`)
- Включить Actions в Settings → Actions → General

### 2. Build fails: Hugo not found

**Проблема:** `hugo: command not found`

**Решение:** Workflow должен скачать Hugo. Проверить:

```bash
# В лог workflow должно быть
"Install Hugo CLI" с успешной установкой
```

Если не устанавливается, попробовать другой способ:

```yaml
- name: Install Hugo CLI
  run: |
    sudo apt-get update
    sudo apt-get install hugo
```

### 3. Сайт пуст или не загружается

**Проблема:** GitHub Pages возвращает 404 или пустую страницу

**Решение:**
- Проверить наличие файла `index.html` в папке `public/`
- Проверить в Actions, что job "upload artifact" завершился успешно
- Убедиться, что в Settings → Pages выбран source "GitHub Actions"

### 4. Стили и изображения не грузятся

**Проблема:** Сайт загружается, но без CSS и картинок

**Решение:**
- Проверить baseURL в config.toml
- Убедиться, что пути к ресурсам использят {{ relURL }} функции
- В DevTools (F12) смотреть вкладку Network и пути к файлам

### 5. Ошибка: CNAME уже используется

**Проблема:** При сохранении пользовательского домена получается ошибка

**Решение:**
- Убедиться, что домен не привязан к другому GitHub Pages проекту
- Проверить, что CNAME запись в GitHub указана правильно
- Удалить старую CNAME запись из DNS провайдера

### 6. Слишком долгое развертывание

**Проблема:** Workflow выполняется дольше 10 минут

**Решение:**
- Уменьшить размер изображений
- Удалить тяжелые зависимости
- Проверить, не загружаются ли подмодули (они замедляют процесс)
- Оптимизировать сборку Hugo: `hugo --minify --gc`

### 7. Работа с подмодулями Git

Если тема добавлена как подмодуль:

```bash
# Клонирование с подмодулями
git clone --recurse-submodules https://github.com/yourusername/rt-corporate-website.git

# Обновление подмодулей
git submodule update --init --recursive

# После изменения подмодулей
git submodule foreach git pull origin main
git add . && git commit -m "Update submodules"
```

### 8. Отладка локально

Перед push проверить локально:

```bash
# Полная симуляция production сборки
hugo --minify --baseURL "https://railtech.uz/" -D -E -F

# Проверить артефакты
ls -la public/

# Запустить локальный сервер
cd public && python3 -m http.server 8000
# Открыть http://localhost:8000
```

---

## Чеклист развертывания

- [ ] Hugo установлена версии 0.145.0+
- [ ] Git инициализирован и настроен
- [ ] Репозиторий создан на GitHub
- [ ] Файл `.github/workflows/hugo.yml` добавлен
- [ ] Основной workflow запущен успешно
- [ ] GitHub Pages включена в Settings
- [ ] Сайт доступен по адресу `yourusername.github.io/rt-corporate-website`
- [ ] (Опционально) Пользовательский домен настроен
- [ ] (Опционально) HTTPS включена
- [ ] (Опционально) Web3Forms API ключ добавлен в Secrets

---

## Полезные команды

```bash
# Проверить конфигурацию Hugo
hugo config

# Построить сайт с отладкой
hugo --debug

# Очистить кеш
rm -rf resources

# Проверить все внутренние ссылки
hugo --logFile debug.log -v

# Сравнить две версии сборки
hugo && tar czf build-old.tar.gz public/
# [внесите изменения]
hugo && tar czf build-new.tar.gz public/
diff <(tar tzf build-old.tar.gz | sort) <(tar tzf build-new.tar.gz | sort)
```

---

## Дополнительные ресурсы

- [Hugo Official Documentation](https://gohugo.io/documentation/)
- [GitHub Pages Guide](https://pages.github.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Web3Forms Documentation](https://web3forms.com/docs)

---

**Последнее обновление:** 2026-03-25
**Версия:** 1.0
