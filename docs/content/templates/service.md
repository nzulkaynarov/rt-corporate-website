---
# Шаблон услуги. Услуг ровно четыре: supply, engineering (customers), representation, localization (partners).
# Новая услуга — только после правки docs/ARCHITECTURE.md владельцем (тест tests/data.test.ts проверяет список).
# Файл: src/content/services/<slug>.md. Схема: src/content/config.ts → services.
# Три языка: русские поля в корне, переводы — те же поля в блоках uz: (латиница) и en: в том же изменении (GLOSSARY.md,
# формат — docs/content/README.md §2). Тело на UZ/EN — поле body в блоке.
# Тексты без привязки к отрасли (правило positioning в scripts/check-content.mjs).

lang: [ru, uz, en]
audience: "customers"     # customers — заказчикам, partners — партнёрам
order: 1                  # место в списке своей аудитории
title: "<Название услуги, 1–3 слова>"
summary: "<Одно предложение для карточки и meta description, 70–160 знаков.>"
lead: "<Лид под заголовком: 2–3 коротких предложения — что делаем, для кого, за что отвечаем.>"
highlights:               # блок «Коротко»: 3–4 пары
  - label: "<Метка>"
    value: "<Значение>"
steps:                    # «Как работаем»: 3–5 реальных шагов по порядку
  - title: "<Шаг>"
    text: "<Что происходит, одна строка>"
benefits:                 # «Что вы получаете» / «Что получает партнёр»
  - title: "<Польза>"
    text: "<Конкретно, без эпитетов>"
requirements: []          # «Что нужно от партнёра» — необязательно, формат как у benefits
faq:                      # 3–7 вопросов клиента
  - q: "<Вопрос?>"
    a: "<Ответ: коротко, с фактами; цен нет — цена в КП.>"
# seoTitle: "<≤ 60 знаков, если автовариант не подходит>"
# seoDescription: "<70–160 знаков>"
uz:
  title: "<Nomi>"
  summary: "<…>"
  lead: "<…>"
  highlights:             # те же элементы, что выше, в том же порядке
    - label: "<…>"
      value: "<…>"
  steps: [ … ]            # и так для steps, benefits, requirements, faq
  body: |-
    <Тело услуги на узбекском, если есть русское тело>
en:
  title: "<Name>"
  # … те же поля, что в uz:
---

<Необязательное тело услуги в Markdown (разделы с ###). Можно оставить пустым — страница строится из полей выше.>
