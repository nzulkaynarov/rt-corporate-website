---
# ШАБЛОН ТОВАРА → копировать в src/content/catalog/<sku-в-нижнем-регистре>.md
# Все строки с TODO заменить; необязательные поля без данных — удалить целиком.
sku: "TODO: RT-SAF-006"                     # RT-<SAF|TST>-<NNN>, уникальный
image: "/images/catalog/TODO.jpg"           # реальное фото; нет фото — удалить строку
images:                                     # доп. ракурсы (необязательно)
  - "/images/catalog/TODO-2.jpg"
title: "TODO: Датчик угла поворота ДПС-У-0.1"  # официальное наименование + модель/обозначение
title_uz: "TODO"
title_en: "TODO"
category: "TODO: Локомотивные устройства безопасности"   # категория каталога (GLOSSARY: Электроника)
category_uz: "TODO: Lokomotiv xavfsizlik qurilmalari"
category_en: "TODO: Locomotive safety equipment"
gost: "TODO: ТУ / ГОСТ"                      # необязательно: только реальный ГОСТ/ТУ
tnved: "TODO: XXXX XX XXX X"                 # необязательно: только подтверждённый код
status: "В наличии"                          # В наличии | Резерв | Под заказ
statusKey: "in_stock"                        # in_stock | reserved | on_order — строго соответствует status
specs: "TODO: ключевые параметры одной строкой"
specs_uz: "TODO"
specs_en: "TODO"
# warehouse / warranty / priceNote (+ _uz/_en) — только если отличаются от стандартных (pages.json → catalogPage)
attributes:                                  # таблица характеристик, 3–10 строк
  - label: "TODO: Обозначение"
    label_uz: "TODO"
    label_en: "TODO"
    value: "TODO: ПЮЯИ.468179.001"
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

TODO: что это, в какой системе безопасности / на каком подвижном составе применяется.

### Конструкция и комплектность

TODO: состав изделия, комплект поставки, документы завода.
