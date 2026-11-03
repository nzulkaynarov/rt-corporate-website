---
# ШАБЛОН ТОВАРА → копировать в src/content/catalog/<sku-в-нижнем-регистре>.md
# Все строки с TODO заменить; необязательные поля без данных — удалить целиком.
sku: "TODO: RT-RS-120"                      # RT-<RS|SCB|TRK|ELC|KIP>-<NNN>, уникальный
image: "/images/catalog/TODO.jpg"           # реальное фото; нет фото — удалить строку
images:                                     # доп. ракурсы (необязательно)
  - "/images/catalog/TODO-2.jpg"
title: "TODO: Колесная пара РУ1Ш-957-Г"      # официальное наименование + модель
title_uz: "TODO"
title_en: "TODO"
category: "TODO: Подвижной состав"           # одна из категорий каталога (см. GLOSSARY: Ж/д техника)
category_uz: "TODO: Harakatlanuvchi tarkib"
category_en: "TODO: Rolling Stock"
gost: "TODO: ГОСТ 4835-2013"                 # необязательно
tnved: "TODO: 8607 19 100 0"                 # необязательно, формат XXXX XX XXX X
price: ""                                    # только число из брифа (сум с НДС), иначе пусто
status: "В наличии"                          # В наличии | Резерв | Под заказ
statusKey: "in_stock"                        # in_stock | reserved | on_order — строго соответствует status
specs: "TODO: ключевые параметры одной строкой"
specs_uz: "TODO"
specs_en: "TODO"
# warehouse / warranty / priceNote (+ _uz/_en) — только если отличаются от стандартных (pages.json → catalogPage)
attributes:                                  # таблица характеристик, 3–10 строк
  - label: "TODO: Нагрузка на ось"
    label_uz: "TODO"
    label_en: "TODO"
    value: "TODO: 23,5 тс"
    value_uz: "TODO"
    value_en: "TODO"
documents:                                   # только реальные файлы (public/docs/… или https://…)
  - title: "TODO: Технический паспорт изделия"
    title_uz: "Mahsulot texnik pasporti"
    title_en: "Product Technical Datasheet"
    file: "/docs/TODO.pdf"
    type: "PDF • 1.2 MB"
order: 10                                    # порядок в каталоге
# seoTitle / seoDescription (+ _uz/_en) — только если автозаголовок длиннее 60 знаков (SEO.md §2)
body_uz: |
  TODO: перевод основного текста на узбекский (Markdown)
body_en: |
  TODO: English translation of the main text (Markdown)
---

### Назначение

TODO: что это, для какого подвижного состава / объекта, где применяется.

### Конструкция и комплектность

TODO: состав изделия, комплект поставки, документы завода.
