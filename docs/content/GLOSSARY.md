# Глоссарий RU / UZ / EN

Обязательная терминология сайта. На этапе RU-first (`src/data/content-stage.json → ruOnly: true`) глоссарий нужен,
чтобы русские тексты называли одно и то же одинаково. Переводы UZ/EN из таблиц используются в проходе перевода
после одобрения RU. Если термина нет, посмотрите, как он уже употреблён на сайте (`grep -ri "<термин>" src/content src/data`),
и добавьте строку в том же PR.

- Узбекский пишется **латиницей**, апостроф обычный `'` (U+0027): `o'`, `g'`, `ma'lumot`. Не используйте `ʻ ’ ‘` и кириллицу в `_uz`.
- Английский: международный деловой, US spelling.
- Колонку «Запрещено (UZ/EN)» читает `scripts/check-content.mjs`: варианты из неё в полях UZ/EN считаются ошибкой.
  Варианты перечисляются через запятую в обратных кавычках, `—` означает «нет». Форму таблиц (5 колонок) не меняйте.
- Строки с пометкой «проверить» содержат предложенный перевод. Носитель подтверждает его в проходе перевода.

## Компания, сайт и Кабинет

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| ООО «RailTech» | «RailTech» MChJ | RailTech LLC | `OOO RailTech` | Бренд всегда `RailTech`, без перевода |
| Кабинет клиента и партнёра | mijoz va hamkor kabineti | client & partner cabinet | — | cabinet.railtech.uz; в тексте можно просто «Кабинет» / kabinet / Cabinet |
| Войти в Кабинет | Kabinetga kirish | Sign in to the Cabinet | — | Подпись кнопки; проверить |
| Начать работу | Ishni boshlash | Get started | — | Подпись кнопки, ведёт к форме заявки; проверить |
| Заявка | ariza | request | — | Форма на сайте → CRM |
| Отправить заявку | Ariza yuborish | Send request | — | Подпись кнопки формы; проверить |
| Заказчикам | buyurtmachilarga | for customers | — | Раздел услуг (`audience: customers`) |
| Партнёрам | hamkorlarga | for partners | — | Раздел услуг (`audience: partners`) |
| Единая точка ответственности | yagona mas'uliyat nuqtasi | single point of responsibility | — | Позиционирование; проверить |
| Производитель | ishlab chiqaruvchi | manufacturer | — | |
| Официальный дилер | rasmiy diler | official dealer | — | Только `status: dealer`, при документе производителя; основание не публикуется |
| Официальный дилер и представитель | rasmiy diler va vakil | official dealer and representative | — | То же условие |
| Прямые поставки | to'g'ridan-to'g'ri yetkazib berish | direct supply | — | `status: direct` |
| Новость / статья / проект | yangilik / maqola / loyiha | news / article / project | — | Типы материалов (`type`) |
| Статья о партнёре | hamkor haqida maqola | partner profile | — | `type: partner`; проверить |

## Услуги

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| Поставки | yetkazib berish | supply | — | `/services/supply/` |
| Инжиниринг | injiniring | engineering | — | `/services/engineering/` |
| Представительство международных производителей | xalqaro ishlab chiqaruvchilar vakilligi | representation of international manufacturers | — | `/services/representation/` |
| Локализация производства | ishlab chiqarishni mahalliylashtirish | production localization | — | `/services/localization/` |
| Поставка под ключ | kalit topshirish sharti bilan yetkazib berish | turnkey supply | — | |
| Сорсинг / поиск поставщика | sorsing / yetkazib beruvchini izlash | sourcing | — | |
| Склад (до вашего склада) | ombor (omboringizgacha) | warehouse (to your warehouse) | — | |

## Коммерция и таможня

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| ВЭД (внешнеэкономическая деятельность) | TIF (tashqi iqtisodiy faoliyat) | foreign trade | `TQI`, `VQD` | |
| ТН ВЭД (код) | TIF TN kodi | HS code (TN VED) | — | |
| НДС 12% | 12% QQS | 12% VAT | `NDS` | |
| ИНН | STIR | TIN | — | |
| ЭСФ (электронный счёт-фактура) | EHF (elektron hisob-faktura) | electronic tax invoice (ESF) | — | |
| Коммерческое предложение (КП) | tijorat taklifi | quotation | — | |
| Запрос КП | tijorat taklifi so'rovi | request for quotation (RFQ) | — | |
| Договор | shartnoma | contract | — | |
| Счёт на оплату | to'lov uchun hisob | invoice | — | |
| Акт (выполненных работ, приёмки) | dalolatnoma | acceptance act | — | |
| DDP / CIP Ташкент | DDP / CIP Toshkent | DDP / CIP Tashkent | — | Инкотермс не переводится |
| Полная стоимость до склада (Landed Cost) | omborgacha to'liq qiymat (Landed Cost) | landed cost | — | |
| Таможенное оформление | bojxona rasmiylashtiruvi | customs clearance | — | |
| ул. Абдуллы Каххара, 46 | Abdulla Qahhor ko'chasi, 46 | 46 Abdulla Qahhor Street | — | Адрес офиса берётся только из `company.json` (`officeAddress`) |
| Ташкент | Toshkent | Tashkent | — | |
| Республика Узбекистан (РУз) | O'zbekiston Respublikasi (O'zR) | the Republic of Uzbekistan | `Uzbekistan Republic` | |

## Стандарты и документы

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| ГОСТ | GOST | GOST | — | Номер не переводится: `ГОСТ 9246-2013` → `GOST 9246-2013` |
| ТУ (технические условия) | TSh (texnik shartlar) | TU (technical specifications) | — | |
| ТР ТС | TR TS (Bojxona ittifoqi texnik reglamenti) | TR CU (Customs Union technical regulation) | — | |
| O'zDSt | O'zDSt | O'zDSt (Uzbekistan state standard) | — | |
| Сертификат соответствия | muvofiqlik sertifikati | certificate of conformity | — | |
| Технический паспорт изделия | mahsulot texnik pasporti | technical datasheet / product passport | — | |
| Инструкция по эксплуатации | foydalanish yo'riqnomasi | operation manual | — | |

## Термины из статей о партнёрах и новостей

Отраслевые термины употребляются только в фактах о партнёре или событии. В общих текстах их нет (STYLE_GUIDE §2).

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| Подвижной состав | harakatlanuvchi tarkib | rolling stock | `harakatdagi tarkib` | |
| СЦБ (сигнализация, централизация, блокировка) | SMB (signallashtirish, markazlashtirish va blokirovkalash) | railway signalling (signalling & interlocking) | `ISB` | |
| Системы обеспечения безопасности движения поездов | poezdlar harakati xavfsizligini ta'minlash tizimlari | train safety systems | — | |
| Локомотив | lokomotiv | locomotive | — | |
| ООО «НПО САУТ» | «НПО САУТ» MChJ | NPO SAUT LLC | — | В UZ допустимо кириллическое название в «ёлочках» |
| АО «Узбекистон темир йуллари» (УТЙ) | «O'zbekiston temir yo'llari» AJ | JSC Uzbekistan Railways | — | |
| Ташкентский государственный транспортный университет (ТГТУ) | Toshkent davlat transport universiteti (TDTU) | Tashkent State Transport University (TSTU) | — | |

## Единицы и обозначения

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| мм, т, кг, кВ, км/ч | mm, t, kg, kV, km/soat | mm, t, kg, kV, km/h | — | Пробел между числом и единицей: `20 мм` |
| 12 месяцев | 12 oy | 12 months | — | |
| 1 200 (разделитель тысяч) | 1 200 | 1,200 | — | RU/UZ: пробел, EN: запятая |
