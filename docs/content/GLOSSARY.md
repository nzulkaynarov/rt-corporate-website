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
| ул. Абдуллы Каххара, 46 | Abdulla Qahhor ko'chasi, 46 | 46 Abdulla Qahhor Street | — | Адрес офиса — только из `global.json` (`officeAddress`) |
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
| Подвижной состав | harakatlanuvchi tarkib | rolling stock | `harakatdagi tarkib` | |
| СЦБ (сигнализация, централизация, блокировка) | SMB (signallashtirish, markazlashtirish va blokirovkalash) | railway signalling (signalling & interlocking) | `ISB` | «СЦБ и автоматика» → `SMB va avtomatika` / `Signaling & Interlocking` |
| Путевое хозяйство | yo'l xo'jaligi | track infrastructure | — | |
| КИП и диагностика | O'TK va diagnostika | instrumentation & testing | — | |
| Энергетика / электроснабжение | energetika | electrification & power | — | |
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

## Электроника и системы безопасности движения

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| Локомотивные устройства безопасности | lokomotiv xavfsizlik qurilmalari | locomotive safety equipment | — | Категория каталога (SKU RT-SAF-NNN) |
| Сервисная и испытательная аппаратура | servis va sinov uskunalari | service & test equipment | — | Категория каталога (SKU RT-TST-NNN) |
| Системы обеспечения безопасности движения поездов | poezdlar harakati xavfsizligini ta'minlash tizimlari | train safety systems | — | |
| Датчик угла поворота (ДПС) | burilish burchagi datchigi (DPS) | angle-of-rotation sensor (DPS) | — | Обозначения изделий не переводятся: ДПС-01, БС-ДПС |
| Блок связи с ДПС (БС-ДПС) | DPS bilan aloqa bloki (BS-DPS) | DPS interface unit (BS-DPS) | — | |
| Стенд для проверки | tekshirish stendi | test bench | — | |
| Блок КОН (контроль несанкционированного отключения ЭПК) | КОН bloki | КОН unit | — | |
| ЭПК (электропневматический клапан автостопа) | EPK (avtostop elektropnevmatik klapani) | EPK (autostop electro-pneumatic valve) | — | |
| Гибкий вал | egiluvchan val | flexible shaft | — | |
| Официальный дилер и представитель | rasmiy diler va vakil | official dealer and representative | — | Только для производителей, с которыми есть дилерский документ (сейчас — НПО САУТ, свидетельство № 1 от 26.02.2026) |
| ООО «НПО САУТ» | «НПО САУТ» MChJ | NPO SAUT LLC | — | В UZ допускается кириллическое название в кавычках, как в официальных новостях |
| Локализация производства | ishlab chiqarishni mahalliylashtirish | production localization | — | |
| Кабинет клиента и партнёра | mijoz va hamkor kabineti | client & partner cabinet | — | cabinet.railtech.uz |
| АО «Узбекистон темир йуллари» (УТЙ) | «O'zbekiston temir yo'llari» AJ | JSC Uzbekistan Railways | — | |
| Ташкентский государственный транспортный университет (ТГТУ) | Toshkent davlat transport universiteti (TDTU) | Tashkent State Transport University (TSTU) | — | |

## Единицы и обозначения

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| мм, т, кг, кВ, км/ч | mm, t, kg, kV, km/soat | mm, t, kg, kV, km/h | — | Пробел между числом и единицей: `1850 мм` |
| тс (тонна-сила) | ts | tf | — | |
| до 120 км/ч | 120 km/soatgacha | up to 120 km/h | — | |
| 1 200+ SKU | 1 200+ SKU | 1,200+ SKUs | — | Разделитель тысяч: RU/UZ — пробел, EN — запятая |
| 12 месяцев | 12 oy | 12 months | — | |
