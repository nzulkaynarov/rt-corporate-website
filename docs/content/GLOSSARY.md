# Глоссарий RU / UZ / EN

Обязательная терминология сайта. Глоссарий нужен, чтобы тексты на всех языках называли одно и то же одинаково.
Переводы UZ/EN из таблиц обязательны для любого нового или изменённого текста вне новостей (он пишется сразу на трёх
языках) и для прохода перевода; новости пока только на русском (`src/data/content-stage.json → ruOnlySections`).
Если термина нет, посмотрите, как он уже употреблён на сайте (`grep -ri "<термин>" src/content src/data`),
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
| Кабинет клиента и партнёра | mijoz va hamkor Kabineti | Client & Partner Cabinet | — | cabinet.railtech.uz; название продукта, всегда с заглавной: «Кабинет» / Kabinet (Kabinetda, Kabinetga, RailTech Kabineti, hamkor Kabineti) / Cabinet (RailTech Cabinet, partner Cabinet) |
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

## Переводческий проход 2026-11-04 (на проверку носителю)

Термины, которые переводчики применили при первом переводе сайта. Пока носитель языка их не подтвердил, используем их
единообразно; после проверки строку переносим в нужный раздел и убираем пометку.

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| сделка | bitim | deal | — | на проверку носителю |
| комплектующие | butlovchi qismlar | components | — | на проверку носителю |
| реквизиты | rekvizitlar | company details | — | на проверку носителю |
| приглашение в Кабинет | Kabinetga taklifnoma | invitation to the Cabinet | — | на проверку носителю |
| счёт (документ) | hisob | invoice | — | на проверку носителю |
| персональные данные | shaxsga doir ma'lumotlar | personal data | — | на проверку носителю |
| позиции заявки | pozitsiyalar | line items | — | на проверку носителю |
| дилерское / партнёрское соглашение | diler / hamkorlik shartnomasi | dealer / partnership agreement | — | на проверку носителю |
| совместное предприятие (СП) | qo'shma korxona (QK) | joint venture (JV) | — | на проверку носителю |
| специальная экономическая зона (СЭЗ) | maxsus iqtisodiy zona (MIZ) | special economic zone (SEZ) | — | на проверку носителю |
| подтверждение местного происхождения | mahalliy kelib chiqishni tasdiqlash | confirmation of local origin | — | на проверку носителю |
| декларация о соответствии | muvofiqlik deklaratsiyasi | declaration of conformity | — | на проверку носителю |
| пилотный проект / опытная эксплуатация | pilot loyiha / tajriba-sinov ekspluatatsiyasi | pilot project / trial operation | — | на проверку носителю |
| техническое задание | texnik topshiriq | terms of reference | — | на проверку носителю |
| обозначение изделия | belgilanish | part designation | — | на проверку носителю |
| шильдик | zavod yorlig'i (shildik) | nameplate | — | на проверку носителю |
| контрактное производство | kontrakt asosida ishlab chiqarish | contract manufacturing | — | на проверку носителю |
| протоколы испытаний | sinov bayonnomalari | test reports | — | на проверку носителю |
| промышленная кооперация | sanoat kooperatsiyasi | industrial cooperation | — | на проверку носителю |
| ЭЦП (электронная цифровая подпись) | ERI (elektron raqamli imzo) | EDS (electronic digital signature) | — | на проверку носителю |
| хранилище браузера | brauzer xotirasi | browser storage | — | на проверку носителю |
| расчётный счёт | hisob-kitob raqami | bank account | — | на проверку носителю |
| МФО банка | MFO | bank code (MFO) | — | на проверку носителю |
| Исполнение (стадия сделки) | Ijro | Fulfillment | — | Стадия после договора: оплата, поставка, акт. Не путать с «исполнением изделия»; на проверку носителю |
| исполнение изделия (вариант, модификация) | mahsulot modifikatsiyasi | product version | `mahsulot ijrosi` | на проверку носителю |
| пошлины | boj to'lovlari | duties | `bojlar` | на проверку носителю |
| одно окно (интерфейс Кабинета: всё на одном экране) | bitta oyna | one workspace | — | Метафора интерфейса: «Вся сделка — в одном окне», «1 окно»; на проверку носителю |
| одно окно (единая точка обращения) | yagona darcha | one-stop shop | — | «Одно окно для технических вопросов», Кабинет как одно окно для клиента и партнёра; на проверку носителю |
| ООО «РАТЕП-ИННОВАЦИЯ» | «RATEP-INNOVATSIYA» MChJ | RATEP-INNOVATSIYA LLC | — | В UZ латиницей; на проверку носителю |

## Единицы и обозначения

| RU | UZ | EN | Запрещено (UZ/EN) | Примечание |
|---|---|---|---|---|
| мм, т, кг, кВ, км/ч | mm, t, kg, kV, km/soat | mm, t, kg, kV, km/h | — | Пробел между числом и единицей: `20 мм` |
| 12 месяцев | 12 oy | 12 months | — | |
| 1 200 (разделитель тысяч) | 1 200 | 1,200 | — | RU/UZ: пробел, EN: запятая |
