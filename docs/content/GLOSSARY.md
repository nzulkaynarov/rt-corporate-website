# Глоссарий RU / UZ / EN

Обязательная терминология для всех текстов сайта. Если термина нет в таблице — посмотрите, как он
уже переведён на сайте (`grep -ri "<термин>" src/content src/data`), и добавьте строку сюда в том же PR.

* Узбекский — **латиница** (официальный алфавит), апостроф — обычный `'` (U+0027): `o'`, `g'`, `ma'lumot`.
  Не используйте `ʻ ’ ‘` и кириллицу в `_uz` полях.
* Английский — международный деловой (US spelling: *catalog*, *center*).
* Колонка «Запрещено» читается скриптом `scripts/check-content.mjs`: эти варианты в UZ/EN полях —
  ошибка проверки. Перечисляйте через запятую в обратных кавычках.

## Компания и коммерция

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| ООО «RailTech» | «RailTech» MChJ | RailTech LLC | — | Бренд всегда `RailTech`, без перевода |
| ВЭД (внешнеэкономическая деятельность) | TIF (tashqi iqtisodiy faoliyat) | foreign trade | `TQI`, `VQD` | |
| ТН ВЭД (код) | TIF TN kodi | HS code (TN VED) | — | Формат кода: `8607 12 000 0` |
| НДС 12% | 12% QQS | 12% VAT | `NDS` | |
| с НДС 12% | 12% QQS bilan | incl. 12% VAT | — | |
| ИНН | STIR | TIN | — | |
| ЭСФ (электронный счёт-фактура) | EHF (elektron hisob-faktura) | electronic tax invoice (ESF) | — | Операторы: Didox, Soliq, Factura.uz |
| Коммерческое предложение (КП) | tijorat taklifi | quotation | — | |
| Запрос КП | tijorat taklifi so'rovi | request for quotation (RFQ) | — | |
| Счёт на оплату | to'lov uchun hisob | invoice | — | |
| Поставка под ключ | kalit topshirish sharti bilan yetkazib berish | turnkey supply | — | |
| DDP Ташкент | DDP Toshkent | DDP Tashkent | — | Инкотермс не переводится |
| Landed Cost (полная стоимость поставки) | Landed Cost (yetkazib berishning to'liq qiymati) | landed cost | — | |
| Склад | ombor | warehouse | — | |
| ТПК Index, блок B2-2097 | Index SICHM, B2-2097 bloki | Index Complex, Unit B2-2097 | — | Адрес — только из `global.json` |
| Отдел снабжения | ta'minot bo'limi | procurement desk | — | |
| Завод-изготовитель | ishlab chiqaruvchi zavod | manufacturer | — | |
| Сорсинг / поиск поставщика | sorsing / yetkazib beruvchini izlash | sourcing | — | |
| Представительство бренда | brend vakolatxonasi | brand representation | — | |
| Ташкент | Toshkent | Tashkent | — | |
| Республика Узбекистан (РУз) | O'zbekiston Respublikasi (O'zR) | Republic of Uzbekistan | — | |

## Стандарты и документы

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| ГОСТ | GOST | GOST | — | Номер стандарта не переводится: `ГОСТ 9246-2013` → `GOST 9246-2013` |
| ТУ (технические условия) | TSh (texnik shartlar) | TU (technical specifications) | — | |
| ТР ТС | TR TS (Bojxona ittifoqi texnik reglamenti) | TR CU (Customs Union technical regulation) | — | |
| O'zDSt | O'zDSt | O'zDSt (Uzbekistan state standard) | — | |
| Технический паспорт изделия | mahsulot texnik pasporti | technical datasheet / product passport | — | |
| Сертификат соответствия | muvofiqlik sertifikati | certificate of conformity | — | |
| Инструкция по эксплуатации | foydalanish yo'riqnomasi | operation manual | — | |
| Гарантия 12 месяцев | 12 oylik kafolat | 12-month warranty | — | |

## Железнодорожная техника

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| Подвижной состав | harakatlanuvchi tarkib | rolling stock | `harakatdagi tarkib` | Категория каталога |
| СЦБ (сигнализация, централизация, блокировка) | SMB (signallashtirish, markazlashtirish va blokirovkalash) | railway signalling (signalling & interlocking) | `ISB` | Категория «СЦБ и автоматика» → `SMB va avtomatika` / `Signaling & Interlocking` |
| Путевое хозяйство | yo'l xo'jaligi | track infrastructure | — | Категория каталога |
| КИП и диагностика | O'TK va diagnostika | instrumentation & testing | — | Категория каталога |
| Энергетика / электроснабжение | energetika | electrification & power | — | Категория каталога |
| Контактная сеть | kontakt tarmog'i | overhead catenary | — | |
| Грузовой вагон | yuk vagoni | freight car | — | |
| Локомотив | lokomotiv | locomotive | — | |
| Колёсная пара | g'ildirak juftligi | wheelset | — | |
| Тележка (вагона) | aravacha | bogie | — | |
| Букса | buksa | axle box | — | |
| Автосцепка | avtoulagich | automatic coupler | — | Модель не переводится: `СА-3` → `SA-3` |
| Тормозная колодка | tormoz kolodkasi | brake block | — | |
| Стрелочный электропривод | strelka elektr yuritmasi | point machine | — | |
| Рельсовое скрепление | rels mahkamlagichi | rail fastening | — | |
| Дефектоскоп | defektoskop | flaw detector | — | |
| Ультразвуковой контроль | ultratovushli nazorat | ultrasonic testing (NDT) | — | |
| Путевой инструмент | yo'l asboblari | track tools | — | |

## Единицы и обозначения

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| мм, т, кг, кВ, км/ч | mm, t, kg, kV, km/soat | mm, t, kg, kV, km/h | — | Пробел между числом и единицей: `1850 мм` |
| тс (тонна-сила) | ts | tf | — | |
| до 120 км/ч | 120 km/soatgacha | up to 120 km/h | — | |
| 1 200+ SKU | 1 200+ SKU | 1,200+ SKUs | — | Разделитель тысяч: RU/UZ — пробел, EN — запятая |
| 12 месяцев | 12 oy | 12 months | — | |
