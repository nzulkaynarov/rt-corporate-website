---
name: add-service
description: Update one of the four RailTech service pages (supply, engineering for customers; representation, localization for partners) in src/content/services — lead, highlights, steps, benefits, requirements, FAQ and SEO — in Russian, Uzbek and English, industry-neutral, then validate. Use when asked to rewrite or extend a service.
---

# Обновить услугу

Бриф: $ARGUMENTS. Сначала прочитай `docs/ARCHITECTURE.md` §2–3, затем `docs/content/STYLE_GUIDE.md` (§1–3, §5) и `docs/content/SEO.md`.

1. **Какая услуга.** Услуг ровно четыре: `supply`, `engineering` (`audience: customers`), `representation`,
   `localization` (`audience: partners`). Тест `tests/data.test.ts` проверяет этот список.
   Новая услуга или смена slug возможны только после правки ARCHITECTURE.md владельцем (в том же PR) и обновления теста.
   Если такого решения нет, остановись и спроси.
2. **Поля** по `docs/content/templates/service.md` и `src/content/config.ts → services`: `summary` (одно предложение,
   70–160 знаков), `lead`, `highlights` («Коротко»), `steps` (3–5 реальных шагов), `benefits`, `requirements`
   (для партнёров), `faq` (3–7 вопросов). Тело необязательно.
3. **Позиционирование.** Тексты без отрасли: нет «ж/д», серий техники, отраслевых каталогов. `check-content`
   (правило `positioning`) это ловит. Цен нет, цена указывается в КП. Обещания (срок ответа, приглашение в Кабинет) не дублируй,
   если они уже есть в другом поле (STYLE_GUIDE §1).
4. **Факты.** Сроки, условия, документы пишутся только подтверждённые (бриф, `company.json`, опубликованные факты).
5. **Ссылки.** 1–3 ссылки маршрутами на проекты или статьи в `/news/…`, которые подтверждают услугу.
6. **Три языка.** Услуги переведены (`src/data/content-stage.json → ruOnly: false`). Каждое новое или изменённое поле
   правь в том же изменении на RU, UZ (латиница) и EN: `<поле>_uz`/`<поле>_en`, тело `body_uz`/`body_en`, у списков
   (`highlights`, `steps`, `faq` и др.) у каждого элемента, по GLOSSARY.md и STYLE_GUIDE §6. Пропуск — ошибка `check-content`.
7. **Проверка.** `node scripts/check-content.mjs --files src/content/services/<slug>.md`, затем `make check`.
   Дальше `content-qa` → `content-pr`.
