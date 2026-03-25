# Руководство по управлению контентом RailTech Hugo

## Оглавление
1. [Структура контента](#структура-контента)
2. [Создание блог-постов](#создание-блог-постов)
3. [Создание проектов](#создание-проектов)
4. [Создание услуг](#создание-услуг)
5. [Создание страниц платформы](#создание-страниц-платформы)
6. [Работа с изображениями](#работа-с-изображениями)
7. [Мультиязычность](#мультиязычность)
8. [FrontMatter CMS](#frontmatter-cms)
9. [FAQ на главной](#faq-на-главной)
10. [Markdown синтаксис](#markdown-синтаксис)
11. [i18n - переводы UI](#i18n---переводы-ui)
12. [Чеклист публикации](#чеклист-публикации)

---

## Структура контента

### Директория структура

```
content/
├── en/                    # Английский контент
│   ├── _index.md         # Главная страница (EN)
│   ├── blog/             # Блог посты
│   │   ├── _index.md     # Страница со списком постов
│   │   └── post-slug/
│   │       └── index.md  # Отдельный пост
│   ├── services/         # Услуги
│   │   ├── _index.md     # Страница со списком услуг
│   │   └── service-slug/
│   │       └── index.md
│   ├── projects/         # Проекты
│   │   ├── _index.md
│   │   └── project-slug/
│   │       └── index.md
│   └── platform/         # Страницы платформы
│       ├── _index.md
│       ├── features/
│       │   └── index.md
│       └── pricing/
│           └── index.md
├── ru/                    # Русский контент
│   └── [аналогичная структура]
└── uz/                    # Узбекский контент
    └── [аналогичная структура]
```

### Иерархия типов контента

- **_index.md** - Главная страница раздела или список элементов
- **index.md** - Отдельный элемент (пост, проект, услуга)
- **Page bundle** - Папка с index.md + локальные ресурсы (изображения, файлы)

### Преимущества Page Bundles

```
content/
└── ru/
    └── blog/
        └── golang-optimization/  # Page Bundle
            ├── index.md          # Содержимое поста
            ├── hero.jpg          # Локальные изображения
            ├── code-example.png
            └── resources/
                └── sample.go     # Загружаемые файлы
```

**Преимущества:**
- Изображения хранятся рядом с постом
- Относительные ссылки работают надежнее
- Легче управлять ресурсами одного поста

---

## Создание блог-постов

### Быстрое создание

```bash
# Через архетип Hugo
hugo new --kind blog content/ru/blog/my-post-title/index.md

# Через архетип для другого языка
hugo new --kind blog content/en/blog/my-post-title/index.md
```

### Структура файла поста

```markdown
+++
title = "Заголовок поста"
description = "Краткое описание для мета-тегов"
date = 2026-03-25T10:30:00+05:00
lastmod = 2026-03-25T10:30:00+05:00
draft = false
images = ["/img/posts/cover.jpg"]
authors = ["Иван Иванов"]
categories = ["Технология"]
tags = ["golang", "optimization", "performance"]
slug = "my-post-slug"
toc = true
+++

Основной текст поста...
```

### Детальное описание полей

| Поле | Тип | Обязательно | Описание |
|------|-----|-----------|---------|
| `title` | string | Да | Заголовок поста (будет в браузере) |
| `description` | string | Да | Описание для мета-тега `description` (155-160 символов) |
| `date` | datetime | Да | Дата публикации в RFC3339 формате |
| `lastmod` | datetime | Нет | Дата последнего изменения |
| `draft` | bool | Нет | `true` = скрыт от публикации, `false` = опубликован |
| `images` | array | Нет | Массив путей к изображениям (для соцсетей) |
| `authors` | array | Нет | Авторы поста |
| `categories` | array | Нет | Категории (для группировки) |
| `tags` | array | Нет | Теги для поиска |
| `slug` | string | Нет | Пользовательский URL slug (иначе используется название папки) |
| `toc` | bool | Нет | Показать оглавление (Table of Contents) |
| `weight` | number | Нет | Вес для сортировки (меньше = выше в списке) |

### Примеры frontmatter

**Простой пост:**
```yaml
+++
title = "Введение в Go"
description = "Разбираемся с основами языка программирования Go"
date = 2026-03-20T14:00:00+05:00
draft = false
tags = ["golang", "programming"]
+++
```

**Полный пост:**
```yaml
+++
title = "Оптимизация GoLang приложений"
description = "Практические способы улучшить производительность Go сервисов"
date = 2026-03-25T10:30:00+05:00
lastmod = 2026-03-25T15:45:00+05:00
draft = false
images = ["/img/posts/golang-perf.jpg", "/img/posts/benchmarks.png"]
authors = ["Александр Петров", "Мария Сидорова"]
categories = ["Backend", "Performance"]
tags = ["golang", "optimization", "concurrency", "benchmarks"]
slug = "golang-optimization-guide"
toc = true
weight = 10
+++
```

### Параметры языка в frontmatter

```yaml
+++
# Русский контент - language в конфиге обнаруживается автоматически по пути content/ru/
# Поэтому явно указывать не требуется
# Но можно для явности:
languageCode = "ru-RU"
+++
```

---

## Создание проектов

### Новый проект

```bash
hugo new --kind project content/ru/projects/project-name/index.md
```

### Frontmatter проекта

```yaml
+++
title = "Название проекта"
description = "Описание проекта для списка проектов"
date = 2026-03-01T12:00:00+05:00
draft = false

# Специфичные для проектов поля:
client = "Название клиента"
industry = "Индустрия (Транспорт, Логистика и т.д.)"
technologies = ["golang", "kubernetes", "postgresql"]
projectUrl = "https://example.com"
githubUrl = "https://github.com/user/project"
images = ["/img/projects/project-cover.jpg"]
authors = ["Иван Иванов"]
categories = ["Web Application", "Cloud Infrastructure"]
tags = ["golang", "k8s", "devops"]
toc = true
weight = 5
+++
```

### Структура проекта с ресурсами

```
content/ru/projects/railway-management/
├── index.md                    # Основное содержимое
├── cover.jpg                   # Обложка проекта
├── architecture.png            # Диаграмма архитектуры
├── screenshot-1.png
├── screenshot-2.png
└── resources/
    ├── case-study.pdf
    └── technical-specs.md
```

### Пример содержимого проекта

```markdown
+++
title = "Система управления железнодорожным парком"
description = "Облачное решение для мониторинга и управления локомотивами"
date = 2026-02-15T10:00:00+05:00
client = "ОАО РЖД"
industry = "Транспорт и логистика"
technologies = ["Golang", "Kubernetes", "PostgreSQL", "Redis"]
projectUrl = "https://railway-system.example.com"
images = ["/img/projects/railway-cover.jpg"]
weight = 1
+++

## Обзор проекта

Разработали комплексную систему для управления парком локомотивов...

## Технические решения

- Микросервисная архитектура на Go
- Развертывание на Kubernetes
- Real-time мониторинг через WebSocket

## Результаты

- Снижение простоев на 35%
- Улучшение эффективности на 28%
```

---

## Создание услуг

### Новая услуга

```bash
hugo new --kind service content/ru/services/service-name/index.md
```

### Frontmatter услуги

```yaml
+++
title = "Консультирование по облачной архитектуре"
description = "Помогаем спроектировать масштабируемую облачную инфраструктуру"
date = 2026-01-01T09:00:00+05:00
draft = false

# Специфичные для услуг поля:
serviceType = "Consulting"  # Consulting, Development, Infrastructure, Support
icon = "cloud"             # Иконка для отображения
price = "От $5000"         # Стартовая цена
features = [
  "Анализ текущей архитектуры",
  "Рекомендации по масштабированию",
  "План миграции в облако",
  "Тестирование и валидация"
]
duration = "4-8 недель"
deliverables = [
  "Архитектурный документ",
  "План внедрения",
  "Рекомендации по инструментам"
]
weight = 10
+++
```

### Структура услуги

```
content/ru/services/cloud-consulting/
├── index.md
├── hero-image.jpg
├── benefits.jpg
└── process-diagram.png
```

### Пример услуги

```markdown
+++
title = "DevOps консультирование"
description = "Оптимизация CI/CD процессов и инфраструктуры"
date = 2026-01-10T10:00:00+05:00
serviceType = "Consulting"
icon = "rocket"
price = "От $3000"
features = [
  "Аудит текущих DevOps практик",
  "Дизайн CI/CD pipeline",
  "Стратегия контейнеризации",
  "Документирование процессов"
]
duration = "3-6 недель"
weight = 5
+++

## Что такое DevOps консультирование

Помогаем командам внедрить современные практики...

## Наш подход

1. **Анализ** - изучим вашу текущую инфраструктуру
2. **Планирование** - разработаем стратегию улучшений
3. **Внедрение** - поддержим команду при внедрении
4. **Оптимизация** - постоянный мониторинг и улучшения

## Результаты клиентов

- Время развертывания сокращено с 2 часов до 15 минут
- Автоматизировано 80% ручных операций
```

---

## Создание страниц платформы

### Структура страниц платформы

```
content/ru/platform/
├── _index.md               # Главная платформы
├── features/
│   └── index.md           # Страница функций
├── pricing/
│   └── index.md           # Страница тарифов
├── integrations/
│   └── index.md           # Страница интеграций
├── api-documentation/
│   └── index.md           # Документация API
└── faq/
    └── index.md           # FAQ
```

### Frontmatter страницы платформы

```yaml
+++
title = "Платформа RailTech"
description = "Полное описание платформы RailTech"
date = 2026-01-01T09:00:00+05:00
draft = false

# Специфичные для платформы:
section = "platform"       # Идентификатор секции
weight = 10               # Вес в навигации
hideFromSitemap = false   # Исключить из sitemap
noindex = false          # Запретить индексирование поисковикам
+++
```

### Пример: Страница функций

```markdown
+++
title = "Функции платформы RailTech"
description = "Полный набор функций для управления железнодорожным парком"
date = 2026-02-01T10:00:00+05:00
section = "platform"
weight = 20
+++

## Основные функции

### Мониторинг в реальном времени
- Отслеживание местоположения локомотивов
- Мониторинг состояния техники
- Алерты при аномалиях

### Управление расписанием
- Автоматическое планирование маршрутов
- Оптимизация использования ресурсов
- Интеграция с диспетчерской

### Аналитика и отчеты
- Пользовательские дашборды
- Экспорт данных в PDF/Excel
- Исторические данные и тренды
```

---

## Работа с изображениями

### Структура папки для изображений

```
static/
└── img/
    ├── logo/
    │   ├── logo.svg           # Основной логотип
    │   ├── logo-white.svg     # Логотип на темном фоне
    │   └── favicon.ico        # Фавиконка
    ├── icons/
    │   ├── service-1.svg
    │   ├── service-2.svg
    │   └── [другие иконки]
    ├── hero/
    │   ├── hero-main.jpg      # Главный баннер (1920x600)
    │   ├── hero-main.webp
    │   └── hero-services.jpg
    ├── posts/                 # Обложки блог-постов
    │   ├── golang-optimization.jpg
    │   └── kubernetes-guide.jpg
    ├── projects/              # Изображения проектов
    │   ├── railway-system/
    │   │   ├── cover.jpg
    │   │   ├── architecture.png
    │   │   └── screenshot-1.png
    │   └── [другие проекты]
    ├── services/              # Визуалы услуг
    │   ├── consulting.jpg
    │   └── development.jpg
    ├── team/                  # Фото команды
    │   ├── ivan-ivanov.jpg
    │   └── maria-sidorova.jpg
    ├── testimonials/          # Фото клиентов
    │   ├── client-1.jpg
    │   └── client-2.jpg
    └── screenshots/           # Скриншоты продукта
        ├── dashboard.png
        ├── analytics.png
        └── settings.png
```

### Рекомендуемые размеры

| Назначение | Ширина | Высота | Формат | Размер |
|-----------|--------|--------|--------|--------|
| Hero баннер | 1920 | 600 | JPG/WebP | < 200KB |
| Обложка поста | 1200 | 600 | JPG/WebP | < 150KB |
| Проект обложка | 800 | 600 | JPG/WebP | < 100KB |
| Иконка услуги | 100 | 100 | SVG | < 10KB |
| Логотип | 200 | 60 | SVG | < 20KB |
| Фото команды | 300 | 400 | JPG | < 50KB |
| Скриншот | 1200 | 800 | PNG/WebP | < 150KB |
| Фавиконка | 32 | 32 | ICO | < 5KB |

### Оптимизация изображений

```bash
# Конвертация JPG в WebP (требует imagemagick)
convert image.jpg -quality 80 image.webp

# Или используя cwebp (требует libwebp)
cwebp -q 80 image.jpg -o image.webp

# Сжатие PNG
pngquant 256 image.png --ext .png --force

# Сжатие SVG (требует svgo)
npm install -g svgo
svgo image.svg
```

### Использование изображений в контенте

**Локальные изображения в Page Bundle:**

```markdown
![Описание изображения](/images/my-image.jpg)

<!-- Или с явной папкой -->
![Архитектура приложения](./architecture.png)
```

**Глобальные изображения:**

```markdown
![Логотип](/img/logo/logo.svg)
![Обложка поста](/img/posts/golang-optimization.jpg)
```

**HTML для более гибкого управления:**

```html
<!-- С responsive картинками -->
<picture>
  <source srcset="/img/posts/post-small.webp" media="(max-width: 768px)">
  <source srcset="/img/posts/post-large.webp" media="(min-width: 769px)">
  <img src="/img/posts/post-fallback.jpg" alt="Описание">
</picture>

<!-- С lazy loading -->
<img
  src="/img/posts/post.jpg"
  alt="Описание"
  loading="lazy"
  width="800"
  height="600"
>
```

### Лучшие практики

1. **Используйте WebP** для основных изображений (меньший размер, лучше качество)
2. **Сжимайте перед загрузкой** (не полагайтесь на браузер)
3. **Указывайте alt текст** (для доступности и SEO)
4. **Используйте SVG для иконок** (масштабируется, меньший размер)
5. **Оптимизируйте размеры** под разные экраны
6. **Нет горячих ссылок** - все изображения должны быть в проекте

---

## Мультиязычность

### Принципы Hugo i18n

Hugo поддерживает мультиязычность через структуру папок:

```
content/
├── en/      # Английский контент (англ. URL)
├── ru/      # Русский контент (доп. язык)
└── uz/      # Узбекский контент (доп. язык)
```

### Конфигурация в config.toml

```toml
defaultContentLanguage = "ru"
defaultContentLanguageInSubdir = false

[languages]

[languages.ru]
languageName = "Русский"
languageCode = "ru-RU"
weight = 1
contentDir = "content/ru"
baseURL = "https://railtech.uz/"

[languages.en]
languageName = "English"
languageCode = "en-US"
weight = 2
contentDir = "content/en"
baseURL = "https://railtech.uz/en/"

[languages.uz]
languageName = "O'zbek"
languageCode = "uz-UZ"
weight = 3
contentDir = "content/uz"
baseURL = "https://railtech.uz/uz/"
```

### Структура папок контента

```
content/
├── ru/
│   ├── _index.md           # Главная на русском
│   ├── blog/
│   │   ├── _index.md
│   │   └── post-slug/
│   │       └── index.md
│   └── services/
│       ├── _index.md
│       └── service-slug/
│           └── index.md
├── en/                     # Аналогичная структура
│   ├── _index.md
│   ├── blog/
│   │   └── ...
│   └── services/
│       └── ...
└── uz/                     # Узбекская версия
    └── ...
```

### Как переводить контент

#### Способ 1: Перевод существующего поста

```bash
# 1. Скопировать пост на другой язык
cp -r content/ru/blog/my-post content/en/blog/my-post

# 2. Отредактировать перевод
vim content/en/blog/my-post/index.md

# 3. Обновить frontmatter
# - Перевести title, description
# - Обновить date если необходимо
# - Обновить authors если другие
```

#### Способ 2: Создание нового поста сразу на нескольких языках

```bash
# Русский пост
hugo new --kind blog content/ru/blog/new-post/index.md

# Английский пост
hugo new --kind blog content/en/blog/new-post/index.md

# Узбекский пост
hugo new --kind blog content/uz/blog/new-post/index.md
```

#### Способ 3: Использование скрипта для синхронизации

```bash
#!/bin/bash
# sync-translations.sh

SOURCE_LANG=$1
TARGET_LANG=$2
CONTENT_TYPE=$3  # blog, services, projects

SOURCE_DIR="content/$SOURCE_LANG/$CONTENT_TYPE"
TARGET_DIR="content/$TARGET_LANG/$CONTENT_TYPE"

for post_dir in "$SOURCE_DIR"/*; do
    if [ -d "$post_dir" ] && [ -f "$post_dir/index.md" ]; then
        post_name=$(basename "$post_dir")
        target_post="$TARGET_DIR/$post_name"

        if [ ! -d "$target_post" ]; then
            cp -r "$post_dir" "$target_post"
            echo "Created: $target_post (remember to translate!)"
        fi
    fi
done
```

Использование:
```bash
chmod +x sync-translations.sh
./sync-translations.sh ru en blog
./sync-translations.sh ru uz services
```

### Управление переводами в шаблонах

В шаблонах используется функция `i18n`:

```html
<!-- content/ru/blog/_index.md использует -->
<h1>{{ i18n "blog_title" }}</h1>

<!-- content/en/blog/_index.md использует то же самое, но перевод из en.toml -->
<h1>{{ i18n "blog_title" }}</h1>
```

### Проверка полноты переводов

```bash
#!/bin/bash
# check-translations.sh

LANGS=("ru" "en" "uz")

for lang in "${LANGS[@]}"; do
    echo "=== Checking $lang ==="
    find "content/$lang" -name "index.md" | wc -l
done

# Должны быть одинаковые числа для каждого языка
```

---

## FrontMatter CMS

### Что такое FrontMatter CMS

FrontMatter CMS - это визуальный редактор для Hugo контента, работающий в VS Code.

### Установка

1. В VS Code, перейти в Extensions (Ctrl+Shift+X / Cmd+Shift+X)
2. Поиск: "FrontMatter CMS"
3. Установить официальное расширение Elio Struyf

### Конфигурация в frontmatter.json

```json
{
  "frontMatter.content.basePath": "[[root]]",
  "frontMatter.content.publicPath": "/img",
  "frontMatter.content.pageFolders": [
    {
      "title": "Blog Posts",
      "path": "[[root]]/content/ru/blog"
    },
    {
      "title": "Services",
      "path": "[[root]]/content/ru/services"
    },
    {
      "title": "Projects",
      "path": "[[root]]/content/ru/projects"
    }
  ],
  "frontMatter.taxonomy.categories": [
    "Technology",
    "Backend",
    "Performance",
    "Cloud Infrastructure"
  ],
  "frontMatter.taxonomy.tags": [
    "golang",
    "kubernetes",
    "postgresql",
    "docker",
    "devops"
  ],
  "frontMatter.content.snippets": {
    "image": {
      "description": "Add image with alt text",
      "body": "![${1:alt text}](${2:image_path})"
    },
    "codeblock": {
      "description": "Add code block",
      "body": "```${1:language}\n${2:code}\n```"
    }
  }
}
```

### Использование FrontMatter CMS

1. **Открыть панель:** Ctrl+K Ctrl+P -> "FrontMatter"
2. **Создать контент:** Кнопка "+" в панели
3. **Редактировать:** Выбрать файл в панели -> редактировать в интерфейсе
4. **Управлять метаданными:** Автоматическая форма для frontmatter полей
5. **Загружать изображения:** Drag & drop в редактор

### Ярлыки в FrontMatter CMS

- **Ctrl+Alt+N** - Создать новый пост
- **Ctrl+Alt+P** - Предпросмотр
- **Ctrl+S** - Сохранить

---

## FAQ на главной

### Структура FAQ раздела

```
content/ru/
└── _index.md          # Главная страница с FAQ секцией
```

### Как добавить FAQ в frontmatter главной

```toml
+++
title = "RailTech - Решения для железнодорожной логистики"
description = "Платформа для управления парком локомотивов"
...

[params.faq]
enable = true
title = "Часто задаваемые вопросы"
faqs = [
  {
    question = "Какие операционные системы поддерживаются?",
    answer = "Платформа RailTech работает на Linux, Windows и macOS. Рекомендуется Ubuntu 20.04+ для production."
  },
  {
    question = "Какова стоимость лицензии?",
    answer = "Лицензирование гибкое: можно выбрать облачный SaaS или on-premise установку. Свяжитесь с нашей командой продаж для получения точной цены."
  },
  {
    question = "Предоставляется ли техническая поддержка?",
    answer = "Да, мы предоставляем 24/7 техническую поддержку для всех клиентов. Включена в основную лицензию для enterprise планов."
  },
  {
    question = "Возможна ли интеграция с существующими системами?",
    answer = "Да, имеется REST API и возможность создания custom интеграций. Более подробно в документации API."
  }
]
+++
```

### Альтернативный формат: YAML

```yaml
---
title: RailTech - Решения для железнодорожной логистики
description: Платформа для управления парком локомотивов

params:
  faq:
    enable: true
    title: Часто задаваемые вопросы
    faqs:
      - question: Какая стоимость?
        answer: Свяжитесь с нами для коммерческого предложения
      - question: Поддержка?
        answer: 24/7 поддержка для всех клиентов
---
```

### Отображение FAQ в шаблоне

```html
<!-- layouts/partials/faq.html -->
{{ if .Site.Params.faq.enable }}
<section class="faq-section">
  <h2>{{ .Site.Params.faq.title }}</h2>

  <div class="faq-list">
    {{ range .Site.Params.faq.faqs }}
    <div class="faq-item">
      <h3>{{ .question }}</h3>
      <p>{{ .answer }}</p>
    </div>
    {{ end }}
  </div>
</section>
{{ end }}
```

### Скрипт для добавления FAQ

```bash
#!/bin/bash
# add-faq.sh

LANG=${1:-ru}
QUESTION=$2
ANSWER=$3

if [ -z "$QUESTION" ] || [ -z "$ANSWER" ]; then
  echo "Usage: ./add-faq.sh [ru|en|uz] \"Question?\" \"Answer text\""
  exit 1
fi

FILE="content/$LANG/_index.md"

# Добавить в конец массива faqs
# (требует предварительной обработки)
echo "Added FAQ: $QUESTION"
```

---

## Markdown синтаксис

### Заголовки

```markdown
# H1 - Главный заголовок
## H2 - Подзаголовок
### H3 - Под-подзаголовок
#### H4 - Субзаголовок
##### H5 - Маленький заголовок
###### H6 - Самый маленький
```

### Текстовое форматирование

```markdown
**Жирный текст** или __Жирный текст__
*Курсив* или _курсив_
***Жирный и курсив***
~~Зачеркнутый текст~~
`Инлайн код`

Линия разделения:
---
или
***
или
___
```

### Списки

```markdown
# Неупорядоченный список
- Первый элемент
- Второй элемент
  - Вложенный элемент
  - Еще вложенный
- Третий элемент

# Упорядоченный список
1. Первый пункт
2. Второй пункт
   1. Вложенный пункт
   2. Еще вложенный
3. Третий пункт

# Список задач
- [x] Выполненная задача
- [ ] Невыполненная задача
- [ ] Еще задача
```

### Цитаты

```markdown
> Это цитата первого уровня

> Это цитата
> со строчками

> Это цитата с вложенной цитатой
>> Вложенная цитата
```

### Ссылки

```markdown
# Простая ссылка
[Текст ссылки](https://example.com)

# Ссылка с title
[Текст](https://example.com "Title при наведении")

# Ссылка на якорь
[Перейти к FAQ](#faq-на-главной)

# Автоссылка
<https://example.com>
<email@example.com>

# Ссылка с использованием переменных
[Ссылка][reference]
[reference]: https://example.com "Title"
```

### Изображения

```markdown
# Простое изображение
![Alt text](/img/image.jpg)

# Изображение со ссылкой
[![Alt text](/img/image.jpg)](https://example.com)

# Изображение с размерами (HTML)
<img src="/img/image.jpg" alt="Alt text" width="300" height="200">
```

### Таблицы

```markdown
| Заголовок 1 | Заголовок 2 | Заголовок 3 |
|-------------|-------------|-------------|
| Ячейка 1-1  | Ячейка 1-2  | Ячейка 1-3  |
| Ячейка 2-1  | Ячейка 2-2  | Ячейка 2-3  |

# Выравнивание
| Влево | По центру | Вправо |
|:-----|:----------|-------:|
| L    | C         | R      |
```

### Код

```markdown
# Инлайн код
Используйте функцию `print()` в Python

# Код блок с синтаксисом
​```python
def hello():
    print("Hello, World!")
    return True
​```

# Код блок без подсветки
​```
Plain text
No highlighting
​```
```

### Сноски

```markdown
Это текст со сноской[^1].

[^1]: Вот определение сноски.

Еще текст со сноской[^2].
[^2]: Вторая сноска.
```

### HTML блоки

```markdown
<div class="custom-class">
  <p>HTML блок в Markdown</p>
</div>

<!-- HTML комментарии -->

<iframe src="https://example.com" width="100%" height="600"></iframe>
```

### Shortcodes (специфично для Hugo)

```markdown
{{< youtube dQw4w9WgXcQ >}}

{{< vimeo 123456 >}}

{{< gist username gistid >}}

{{< highlight go >}}
package main
import "fmt"
func main() {
    fmt.Println("Hello")
}
{{< /highlight >}}
```

---

## i18n - переводы UI

### Структура файлов переводов

```
i18n/
├── ru.toml       # Русские переводы
├── en.toml       # Английские переводы
└── uz.toml       # Узбекские переводы
```

### Содержимое i18n файла

```toml
# i18n/ru.toml
[home]
other = "Главная"

[about]
other = "О компании"

[services]
other = "Услуги"

[blog]
other = "Блог"

[contact]
other = "Контакты"

[blog_title]
other = "Все статьи"

[back_to_blog]
other = "Вернуться в блог"

[read_more]
other = "Читать далее"

[share_article]
other = "Поделиться"

[author]
other = "Автор"

[date]
other = "Дата"

[tags]
other = "Теги"

[categories]
other = "Категории"

[search_placeholder]
other = "Поиск..."

[no_results]
other = "Результатов не найдено"

[subscribe_newsletter]
other = "Подписаться на рассылку"

[subscribe_button]
other = "Подписаться"

[form_email]
other = "Email"

[form_message]
other = "Сообщение"

[form_send]
other = "Отправить"

[form_success]
other = "Спасибо! Мы получили ваше сообщение."

[form_error]
other = "Произошла ошибка. Пожалуйста, попробуйте снова."
```

### Использование в шаблонах

```html
<!-- В layouts шаблонах -->
<nav>
  <a href="{{ .Site.BaseURL }}">{{ i18n "home" }}</a>
  <a href="{{ .Site.BaseURL }}about/">{{ i18n "about" }}</a>
  <a href="{{ .Site.BaseURL }}services/">{{ i18n "services" }}</a>
</nav>

<!-- С параметрами (pluralization) -->
{{ i18n "items_count" .Count }}

<!-- В контенте (Markdown) -->
Можно использовать shortcode:
{{< i18n key="read_more" >}}
```

### Файлы переводов на других языках

```toml
# i18n/en.toml
[home]
other = "Home"

[about]
other = "About"

[services]
other = "Services"

[blog]
other = "Blog"

[read_more]
other = "Read More"
```

```toml
# i18n/uz.toml
[home]
other = "Asosiy"

[about]
other = "Biz Haqida"

[services]
other = "Xizmatlar"

[blog]
other = "Blog"

[read_more]
other = "Batafsil O'qish"
```

### Pluralization (множественные числа)

```toml
# i18n/ru.toml
[items_count]
one = "Один элемент"
other = "{{ .Count }} элементов"
```

Использование:
```html
{{ i18n "items_count" .Count }}
<!-- Если Count = 1: "Один элемент" -->
<!-- Если Count = 5: "5 элементов" -->
```

### Скрипт для проверки переводов

```bash
#!/bin/bash
# check-i18n.sh

echo "=== Checking i18n completeness ==="

KEYS=$(grep "^\[" i18n/ru.toml | sed 's/\[//;s/\].*//' | sort)
LANGS=("en" "uz")

for lang in "${LANGS[@]}"; do
    echo ""
    echo "Checking $lang.toml..."
    MISSING=0

    for key in $KEYS; do
        if ! grep -q "^\[$key\]" "i18n/$lang.toml"; then
            echo "  Missing: $key"
            ((MISSING++))
        fi
    done

    if [ $MISSING -eq 0 ]; then
        echo "  ✓ All keys present"
    else
        echo "  ✗ Missing $MISSING keys"
    fi
done
```

---

## Чеклист публикации

Перед публикацией контента проверить:

### Frontmatter
- [ ] Поле `title` заполнено и не пусто
- [ ] Поле `description` заполнено (155-160 символов)
- [ ] Дата `date` указана в корректном формате
- [ ] `draft = false` (контент опубликован)
- [ ] Указаны `tags` и `categories` (минимум 2-3)
- [ ] Для постов указаны `authors`
- [ ] Для проектов указаны `client`, `technologies`

### Содержимое
- [ ] Заголовок (H1) в начале статьи
- [ ] Минимум 300 слов в посте
- [ ] Изображения имеют alt text
- [ ] Ссылки работают и открываются
- [ ] Нет опечаток (проверить spell-checker)
- [ ] Абзацы разделены с правильными интервалами
- [ ] Код (если есть) имеет правильную подсветку синтаксиса
- [ ] Таблицы отформатированы корректно

### Изображения
- [ ] Все изображения присутствуют в проекте
- [ ] Размеры оптимизированы (< 200KB для больших)
- [ ] Используются WebP где возможно
- [ ] Изображения не горячие ссылки
- [ ] Alt текст описывает изображение
- [ ] Обложка указана в `images` в frontmatter

### Мультиязычность
- [ ] Если контент на русском - проверить наличие переводов
- [ ] Если это перевод - проверить корректность перевода
- [ ] Ссылки между языками работают
- [ ] Дата одинакова для всех версий (или близка)

### SEO
- [ ] Meta description уникален и содержит ключевые слова
- [ ] H1 заголовок использован один раз
- [ ] Ключевые слова естественно включены
- [ ] Внутренние ссылки добавлены где уместно
- [ ] URL slug понятен (не с ID или случайными символами)

### Технически
- [ ] Hugo собирает проект без ошибок: `hugo`
- [ ] Локально просмотрено в браузере: `hugo server`
- [ ] Нет мертвых ссылок (проверить инструментом)
- [ ] Контент корректно отображается на мобильных
- [ ] FrontMatter CMS не выдает ошибок

### Финальное
- [ ] Файл сохранен (Ctrl+S в редакторе)
- [ ] Git коммит создан с описательным сообщением
- [ ] Коммит отправлен в main ветку
- [ ] GitHub Actions workflow запущен
- [ ] Сайт обновился на GitHub Pages (через 1-2 мин)
- [ ] На боевом сайте контент виден правильно

### Пример git workflow

```bash
# 1. Создание и редактирование контента
hugo new --kind blog content/ru/blog/new-post/index.md
# [редактирование в редакторе]

# 2. Локальная проверка
hugo server
# [открыть http://localhost:1313 и проверить]

# 3. Сборка для production
hugo --minify

# 4. Git коммит
git add content/ru/blog/new-post/
git commit -m "Add blog post: Заголовок поста"

# 5. Отправка в GitHub
git push origin main

# 6. Проверка GitHub Actions
# (открыть https://github.com/user/repo/actions)
```

### Команда для проверки перед публикацией

```bash
#!/bin/bash
# pre-publish-check.sh

echo "=== Hugo Pre-publish Checklist ==="

# Проверка синтаксиса Hugo
echo "1. Checking Hugo syntax..."
hugo --debug > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Hugo builds successfully"
else
    echo "   ✗ Hugo build failed!"
    exit 1
fi

# Проверка на draft статьях
echo "2. Checking for draft posts..."
DRAFTS=$(grep -r "draft = true" content/ru/blog/ 2>/dev/null | wc -l)
if [ $DRAFTS -eq 0 ]; then
    echo "   ✓ No draft posts found"
else
    echo "   ⚠ Found $DRAFTS draft posts"
fi

# Проверка на missing descriptions
echo "3. Checking frontmatter completeness..."
MISSING=$(grep -L "description =" content/ru/blog/*/index.md 2>/dev/null | wc -l)
if [ $MISSING -eq 0 ]; then
    echo "   ✓ All posts have descriptions"
else
    echo "   ✗ $MISSING posts missing descriptions"
    exit 1
fi

echo ""
echo "=== All checks passed! Ready to publish. ==="
```

---

## Быстрые команды

```bash
# Создать новый пост на русском
hugo new --kind blog content/ru/blog/post-title/index.md

# Создать проект
hugo new --kind project content/ru/projects/project-name/index.md

# Создать услугу
hugo new --kind service content/ru/services/service-name/index.md

# Запустить локальный сервер с черновиками
hugo server -D

# Собрать для production
hugo --minify

# Проверить без сборки
hugo --debug

# Очистить кеш
rm -rf resources/_gen/

# Сравнить языковые версии
diff -r content/ru/blog content/en/blog --brief

# Найти все черновики
find content -name "index.md" -exec grep -l "draft = true" {} \;
```

---

## Дополнительные ресурсы

- [Hugo Content Management](https://gohugo.io/content-management/)
- [Hugo Multilingual](https://gohugo.io/content-management/multilingual-mode/)
- [Markdown Guide](https://www.markdownguide.org/)
- [FrontMatter CMS Docs](https://frontmatter.codes/)
- [Web3Forms Documentation](https://web3forms.com/docs)

---

**Последнее обновление:** 2026-03-25
**Версия:** 1.0
