export type Lang = 'ru' | 'uz' | 'en';

export interface UiDictionary {
  nav: {
    home: string;
    catalog: string;
    contract: string;
    digital: string;
    projects: string;
    blog: string;
    about: string;
    contacts: string;
  };
  telemetry: {
    country: string;
    warehouse: string;
    vat: string;
    phone: string;
    b2bPortal: string;
    statusProduction: string;
    securityTls: string;
    copyright: string;
  };
  buttons: {
    rfq: string;
    specs: string;
    allPosts: string;
    submit: string;
    uploadSpecs: string;
    passport: string;
    allSystems: string;
    openCatalog: string;
    contractCalc: string;
    demoSmartMatch: string;
    projectsArt: string;
    send: string;
    cancel: string;
    sending: string;
  };
  catalog: {
    title: string;
    subtitle: string;
    filterAll: string;
    searchPlaceholder: string;
    foundCount: string;
    dispatchWarehouse: string;
    colSku: string;
    colTitleSpecs: string;
    colSubsystem: string;
    colGost: string;
    colTnved: string;
    colStatus: string;
    colAction: string;
    statusInStock: string;
    statusReserved: string;
    statusOnOrder: string;
    orderBtn: string;
    subsystems: {
      rollingStock: string;
      scb: string;
      track: string;
      kip: string;
      energy: string;
    };
  };
  calculator: {
    title: string;
    badge: string;
    cbRate: string;
    invoiceLabel: string;
    invoiceHint: string;
    freightLabel: string;
    freightHint: string;
    dutyLabel: string;
    dutyHint: string;
    vatLabel: string;
    vatHint: string;
    breakdownTitle: string;
    baseInvoice: string;
    freightCost: string;
    customsBase: string;
    importDuty: string;
    vatAmount: string;
    totalDdpUsd: string;
    totalDdpUzs: string;
    fixedPriceNote: string;
    actionBtn: string;
  };
  smartMatch: {
    badge: string;
    title: string;
    subtitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    sampleQueries: string;
    btnAnalyze: string;
    btnReset: string;
    telemetryTitle: string;
    matchAccuracy: string;
    detectedSku: string;
    standard: string;
    hsCode: string;
    warehouseStatus: string;
    latency: string;
    inStockValue: string;
    requestQuoteBtn: string;
    sample1: string;
    sample2: string;
    sample3: string;
    sample4: string;
  };
  modal: {
    badge: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    innLabel: string;
    innPlaceholder: string;
    phoneLabel: string;
    subjectLabel: string;
    commentLabel: string;
    commentPlaceholder: string;
    fileLabel: string;
    fileHint: string;
    fileSelect: string;
    privacyNotice: string;
    submitBtn: string;
    sendingBtn: string;
    successBadge: string;
    successTitle: string;
    successText: string;
    successDetails: string;
    closeBtn: string;
  };
  footer: {
    companyDesc: string;
    requisitesTitle: string;
    innLabel: string;
    vatStatus: string;
    okedLabel: string;
    esfLabel: string;
    privacyLink: string;
    termsLink: string;
    navTitle: string;
    groupsCount: string;
    stepsCount: string;
    cmsAdmin: string;
    warehouseTitle: string;
    warehouseDesc: string;
    gpsLabel: string;
    trackGauge: string;
    scheduleHours: string;
    dispatchRoundTheClock: string;
    nodeTitle: string;
    directLine: string;
    emailLabel: string;
    requestsLabel: string;
    legalDept: string;
    statusProduction: string;
    securityTls: string;
    copyright: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    officialReglament: string;
  };
}

export const UI_DICTIONARY: Record<Lang, UiDictionary> = {
  ru: {
    nav: {
      home: 'ГЛАВНАЯ',
      catalog: 'КАТАЛОГ ЖД ОБОРУДОВАНИЯ',
      contract: 'КОНТРАКТНЫЙ ВЭД DDP',
      digital: 'DIGITAL & ПО',
      projects: 'СПЕЦПРОЕКТЫ & АРТ',
      blog: 'БЛОГ / НОВОСТИ',
      about: 'О КОМПАНИИ',
      contacts: 'КОНТАКТЫ & РЕКВИЗИТЫ',
    },
    telemetry: {
      country: 'РЕСПУБЛИКА УЗБЕКИСТАН',
      warehouse: 'СКЛАД: ТАШКЕНТ, INDEX B2-2097',
      vat: 'НДС 12% ВКЛЮЧЕН',
      phone: 'ТЕЛ:',
      b2bPortal: 'B2B.RAILTECH.UZ ↗',
      statusProduction: 'STATUS: PRODUCTION // NODE: TASHKENT',
      securityTls: 'SECURITY: TLS 1.3 / E-SIGN VERIFIED',
      copyright: 'ООО «RailTech». РЕСПУБЛИКА УЗБЕКИСТАН.',
    },
    buttons: {
      rfq: '[ ЗАПРОС КП / СЧЕТА ]',
      specs: 'Спецификация →',
      allPosts: 'Все публикации →',
      submit: 'Отправить запрос',
      uploadSpecs: '[ ЗАГРУЗИТЬ СПЕЦИФИКАЦИЮ ]',
      passport: 'ПАСПОРТ ↗',
      allSystems: 'ВСЕ СИСТЕМЫ',
      openCatalog: 'КАТАЛОГ СО СКЛАДА (10+ ГРУПП) →',
      contractCalc: 'РАСЧЕТ ВЭД DDP ТАШКЕНТ ↗',
      demoSmartMatch: 'ДЕМО SMART MATCH И IT-УСЛУГИ →',
      projectsArt: 'СПЕЦПРОЕКТЫ И АРТ-ЛАБОРАТОРИЯ →',
      send: 'ОТПРАВИТЬ ЗАЯВКУ',
      cancel: 'ОТМЕНА',
      sending: 'РЕГИСТРАЦИЯ ЗАЯВКИ...',
    },
    catalog: {
      title: 'СКЛАДСКАЯ НОМЕНКЛАТУРА ПРОМЫШЛЕННОГО ОБОРУДОВАНИЯ',
      subtitle: 'Неснижаемый запас сертифицированного оборудования и комплектующих в Ташкенте (ТПК Index B2-2097). Отгрузка за 24 часа с полным пакетом технической документации и паспортов заводов.',
      filterAll: 'ВСЕ СИСТЕМЫ',
      searchPlaceholder: 'Поиск по артикулу, параметрам, категории...',
      foundCount: 'НАЙДЕНО ПОЗИЦИЙ:',
      dispatchWarehouse: 'СКЛАД ОТГРУЗКИ: ТАШКЕНТ / ТПК INDEX B2-2097',
      colSku: 'АРТИКУЛ (SKU)',
      colTitleSpecs: 'НАИМЕНОВАНИЕ И ТЕХ. ХАРАКТЕРИСТИКИ',
      colSubsystem: 'КАТЕГОРИЯ',
      colGost: 'СТАНДАРТ',
      colTnved: 'ТН ВЭД',
      colStatus: 'СТАТУС СКЛАДА',
      colAction: 'ДЕЙСТВИЕ',
      statusInStock: 'В наличии',
      statusReserved: 'Резерв',
      statusOnOrder: 'Под заказ',
      orderBtn: 'ЗАПРОС КП',
      subsystems: {
        rollingStock: 'Промышленное оборудование',
        scb: 'Автоматика и управление',
        track: 'Узлы и комплектующие',
        kip: 'КИП и диагностика',
        energy: 'Энергетика и электротехника',
      },
    },
    calculator: {
      title: 'КАЛЬКУЛЯТОР LANDED COST DDP ТАШКЕНТ',
      badge: 'CALC.DDP-UZ',
      cbRate: 'КУРС ЦБ РУЗ: 1 USD = 12 850 UZS',
      invoiceLabel: '[1] СТОИМОСТЬ ОБОРУДОВАНИЯ ПО ИНВОЙСУ ЗАВОДА (USD, FOB/FCA)',
      invoiceHint: 'Сумма инвойса завода-изготовителя Китая, РФ, Беларуси или стран ЕС',
      freightLabel: '[2] МЕЖДУНАРОДНАЯ Ж/Д И АВТО ЛОГИСТИКА ДО ТАШКЕНТА (%):',
      freightHint: 'Включает ж/д тариф, охрану груза, перегруз на погранпереходах',
      dutyLabel: '[3] ТАМОЖЕННАЯ ПОШЛИНА РУЗ (% ПО ТН ВЭД):',
      dutyHint: 'Ставка импортной пошлины согласно таможенному тарифу РУз',
      vatLabel: '[4] НАЛОГ НА ДОБАВЛЕННУЮ СТОИМОСТЬ (НДС 12% РУЗ):',
      vatHint: 'Ставка НДС 12% с выпиской ЭСФ через Didox / Soliq для зачета',
      breakdownTitle: 'КАЛЬКУЛЯЦИЯ ИТОГОВОЙ СТОИМОСТИ (LANDED COST DDP ТАШКЕНТ):',
      baseInvoice: 'Базовая цена завода (FOB/FCA):',
      freightCost: 'Транспорт и страхование логистики:',
      customsBase: 'Таможенная стоимость (CIF Ташкент):',
      importDuty: 'Таможенная пошлина РУз:',
      vatAmount: 'НДС 12% (подлежащий зачету):',
      totalDdpUsd: 'ИТОГО LANDED COST (USD):',
      totalDdpUzs: 'ИТОГО К ОПЛАТЕ В СУМАХ С НДС 12%:',
      fixedPriceNote: 'Фиксация цены в сумах на дату договора. Никаких валютных доплат.',
      actionBtn: '[ ЗАФИКСИРОВАТЬ РАСЧЕТ И ЗАПРОСИТЬ КП ]',
    },
    smartMatch: {
      badge: 'AI DEMO // SMART MATCH V2.4',
      title: 'ИНТЕРАКТИВНЫЙ ТЕСТЕР NLP-РАСПОЗНАВАНИЯ ТЗ',
      subtitle: 'Введите свободное описание промышленной детали, артикул или фрагмент дефектной ведомости на русском, узбекском или английском языке:',
      inputLabel: 'ТЕКСТ ТЕХНИЧЕСКОГО ЗАПРОСА / ДЕФЕКТНОЙ ВЕДОМОСТИ:',
      inputPlaceholder: 'Например: шкаф управления ША-01 или электропривод СП-6М...',
      sampleQueries: 'БЫСТРЫЕ ТЕСТОВЫЕ ЗАПРОСЫ:',
      btnAnalyze: 'РАСПОЗНАТЬ ПОЗИЦИЮ (NLP INFERENCE)',
      btnReset: 'ОЧИСТИТЬ',
      telemetryTitle: 'РЕЗУЛЬТАТ НЕЙРОСЕТЕВОГО СОПОСТАВЛЕНИЯ (MATCH RESULT):',
      matchAccuracy: 'ТОЧНОСТЬ СООТВЕТСТВИЯ (CONFIDENCE SCORE):',
      detectedSku: 'ОПРЕДЕЛЕННЫЙ АРТИКУЛ SKU:',
      standard: 'СТАНДАРТ / ТУ:',
      hsCode: 'КОД ТН ВЭД РУЗ:',
      warehouseStatus: 'ДОСТУПНОСТЬ НА СКЛАДЕ:',
      latency: 'ЗАДЕРЖКА ОБРАБОТКИ (LATENCY):',
      inStockValue: 'В наличии (Ташкент, Index B2-2097)',
      requestQuoteBtn: '[ ВЫПИСАТЬ СЧЕТ НА ДАННУЮ ДЕТАЛЬ ]',
      sample1: 'Тормозные колодки 25610-Н для подвижного состава',
      sample2: 'Электропривод СП-6М левый с ходом 160мм',
      sample3: 'Шкаф автоматизации ША-01 для подстанции',
      sample4: 'Автосцепка СА-3 корпус 106.01.000',
    },
    modal: {
      badge: 'ОФИЦИАЛЬНАЯ ЗАЯВКА // ЭСФ НДС 12%',
      title: 'ЗАПРОС КОММЕРЧЕСКОГО ПРЕДЛОЖЕНИЯ И СЧЕТА',
      subtitle: 'Регистрация запроса в центральном реестре снабжения ООО «RailTech» (Ташкент, ТПК Index B2-2097).',
      nameLabel: '[1] Ф.И.О. ОТВЕТСТВЕННОГО ЛИЦА *',
      namePlaceholder: 'Иванов Алексей Петрович',
      companyLabel: '[2] НАИМЕНОВАНИЕ ОРГАНИЗАЦИИ / ЗАВОДА *',
      companyPlaceholder: 'АО «Алмалыкский ГМК» / СП ООО...',
      innLabel: '[3] ИНН ПРЕДПРИЯТИЯ (9 ЦИФР ДЛЯ ЭСФ) *',
      innPlaceholder: '308912445',
      phoneLabel: '[4] КОНТАКТНЫЙ ТЕЛЕФОН *',
      subjectLabel: '[5] ПРЕДМЕТ ЗАПРОСА / АРТИКУЛ',
      commentLabel: '[6] ТЕХНИЧЕСКИЕ ДЕТАЛИ / ОБЪЕМ ПАРТИИ',
      commentPlaceholder: 'Укажите требуемое количество, требования к сертификатам или особые условия доставки...',
      fileLabel: '[7] ПРИКРЕПИТЬ СПЕЦИФИКАЦИЮ / ТЗ / РЕКВИЗИТЫ (ДО 25 МБ)',
      fileHint: 'PDF, Excel, Word, DWG или ZIP архив',
      fileSelect: 'ВЫБРАТЬ ФАЙЛ',
      privacyNotice: 'Отправляя заявку, вы подтверждаете согласие на обработку данных согласно Закону РУз № ЗРУ-547.',
      submitBtn: '[ ЗАРЕГИСТРИРОВАТЬ ЗАЯВКУ И ВЫПИСАТЬ КП ]',
      sendingBtn: 'ОТПРАВКА ДАННЫХ В РЕЕСТР...',
      successBadge: 'РЕГИСТРАЦИЯ УСПЕШНА',
      successTitle: 'ЗАЯВКА ЗАРЕГИСТРИРОВАНА В СИСТЕМЕ',
      successText: 'Спецификация направлена в инженерный отдел ООО «RailTech». Ответственный менеджер свяжется с вами и направит официальное КП с НДС 12% в течение 30 минут.',
      successDetails: 'Номер запроса зафиксирован в журнале ЭДО Didox / Telegram Bot.',
      closeBtn: '[ ЗАКРЫТЬ ОКНО ]',
    },
    footer: {
      companyDesc: 'Инженерный поставщик оборудования, систем автоматизации и инфраструктурных решений в Центральной Азии.',
      requisitesTitle: 'РЕКВИЗИТЫ ПРЕДПРИЯТИЯ:',
      innLabel: 'ИНН:',
      vatStatus: 'НДС: 12% (ПЛАТЕЛЬЩИК)',
      okedLabel: 'ОКЭД: 46.69.0',
      esfLabel: 'ЭСФ: Didox / Soliq / Factura.uz',
      privacyLink: 'Политика конфиденциальности',
      termsLink: 'Условия использования',
      navTitle: 'НАВИГАЦИЯ ПО ПОРТАЛУ',
      groupsCount: '10 групп',
      stepsCount: '4 этапа',
      cmsAdmin: '[CMS] Панель управления',
      warehouseTitle: 'СКЛАДСКОЙ ХАБ В ТАШКЕНТЕ',
      warehouseDesc: 'Собственный складской комплекс в г. Ташкент, ТПК Index B2-2097. Постоянный неснижаемый запас критических позиций оборудования и комплектующих.',
      gpsLabel: 'GPS: 41.2214° N, 69.1852° E',
      trackGauge: 'Логистика: прямой подъездной путь и автотерминал',
      scheduleHours: 'Режим: Пн-Пт 09:00 - 18:00',
      dispatchRoundTheClock: 'Отгрузка ЖД платформ: 24/7',
      nodeTitle: 'ОПЕРАТИВНЫЙ СВЯЗНОЙ УЗЕЛ',
      directLine: 'Прямая линия снабжения:',
      emailLabel: 'Электронная почта:',
      requestsLabel: 'supply@railtech.uz (Заявки)',
      legalDept: 'Юротдел: legal@railtech.uz',
      statusProduction: 'STATUS: PRODUCTION // NODE: TASHKENT',
      securityTls: 'SECURITY: TLS 1.3 / E-SIGN VERIFIED',
      copyright: 'ООО «RailTech». РЕСПУБЛИКА УЗБЕКИСТАН.',
    },
    faq: {
      badge: 'РЕГЛАМЕНТ & ОТВЕТЫ',
      title: 'ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ (FAQ)',
      subtitle: 'Регламент поставок, юридические гарантии, сертификация и доступ к платформе b2b.railtech.uz',
      officialReglament: 'ОФИЦИАЛЬНЫЙ РЕГЛАМЕНТ ООО «RAILTECH»',
    },
  },
  uz: {
    nav: {
      home: 'BOSH SAHIFA',
      catalog: 'TEMIR YO\'L USKUNALARI KATALOGI',
      contract: 'DDP SHARTNOMA TIF',
      digital: 'DIGITAL & DASTURIY TA\'MINOT',
      projects: 'MAXSUS LOYIHALAR & ART',
      blog: 'BLOG / YANGILIKLAR',
      about: 'KOMPANIYA HAQIDA',
      contacts: 'ALOQA & REKVIZITLAR',
    },
    telemetry: {
      country: 'O\'ZBEKISTON RESPUBLIKASI',
      warehouse: 'OMBOR: TOSHKENT, INDEX B2-2097',
      vat: 'QQS 12% KIRITILGAN',
      phone: 'TEL:',
      b2bPortal: 'B2B.RAILTECH.UZ ↗',
      statusProduction: 'STATUS: PRODUCTION // TUGUN: TOSHKENT',
      securityTls: 'XAVFSIZLIK: TLS 1.3 / E-IMZO TASDIQLANGAN',
      copyright: '«RailTech» MCHJ. O\'ZBEKISTON RESPUBLIKASI.',
    },
    buttons: {
      rfq: '[ TIJORAT TAKLIFI / HISOB SO\'ROVI ]',
      specs: 'Spetsifikatsiya →',
      allPosts: 'Barcha maqolalar →',
      submit: 'So\'rov yuborish',
      uploadSpecs: '[ SPETSIFIKATSIYANI YUKLASH ]',
      passport: 'PASPORT ↗',
      allSystems: 'BARCHA TIZIMLAR',
      openCatalog: 'OMBOR KATALOGINI OCHISH (10+ GURUHLAR) →',
      contractCalc: 'TIF DDP TOSHKENT HISOBI ↗',
      demoSmartMatch: 'SMART MATCH DEMO VA IT-XIZMATLAR →',
      projectsArt: 'MAXSUS LOYIHALAR VA ART-LABORATORIYA →',
      send: 'SO\'ROVNI YUBORISH',
      cancel: 'BEKOR QILISH',
      sending: 'BUYURTMA RO\'YXATGA OLINMOQDA...',
    },
    catalog: {
      title: 'SANOAT USKUNALARI VA BUTLOVCHI QISMLAR OMBOR NOMENKLATURASI',
      subtitle: 'Toshkentda (Index B2-2097 SIChK) sertifikatlangan uskunalar va butlovchi qismlarning kamaymaydigan zaxirasi. Zavod pasportlari va texnik hujjatlar bilan 24 soat ichida yuklash.',
      filterAll: 'BARCHA TIZIMLAR',
      searchPlaceholder: 'Artikul, parametrlar yoki kategoriya bo\'yicha qidirish...',
      foundCount: 'TOPILGAN MAHSULOTLAR:',
      dispatchWarehouse: 'YUKLASH OMBORI: TOSHKENT / INDEX B2-2097',
      colSku: 'ARTIKUL (SKU)',
      colTitleSpecs: 'NOMI VA TEXNIK XUSUSIYATLARI',
      colSubsystem: 'KATEGORIYA',
      colGost: 'STANDART',
      colTnved: 'TIF TN KODI',
      colStatus: 'OMBOR MAQOMI',
      colAction: 'AMAL',
      statusInStock: 'Mavjud',
      statusReserved: 'Zaxirada',
      statusOnOrder: 'Buyurtma asosida',
      orderBtn: 'TAKLIF SO\'ROVI',
      subsystems: {
        rollingStock: 'Sanoat uskunalari',
        scb: 'Avtomatika va boshqaruv',
        track: 'Uzellar va butlovchi qismlar',
        kip: 'O\'TK va diagnostika',
        energy: 'Energetika va elektrotexnika',
      },
    },
    calculator: {
      title: 'DDP TOSHKENT LANDED COST KALKULYATORI',
      badge: 'CALC.DDP-UZ',
      cbRate: 'O\'ZBEKISTON MARKAZIY BANKI KURSI: 1 USD = 12 850 SO\'M',
      invoiceLabel: '[1] ZAVOD INVOYSI BO\'YICHA USKUNA QIYMATI (USD, FOB/FCA)',
      invoiceHint: 'Xitoy, RF, Belarus yoki Yevropa Ittifoqi ishlab chiqaruvchisining invoys summasi',
      freightLabel: '[2] TOSHKENTGACHA XALQARO T/Y VA AVTO LOGISTIKA (%):',
      freightHint: 'Temir yo\'l tarifi, yuk qo\'riqlash va chegara o\'tish punktlarida yuk ortishni o\'z ichiga oladi',
      dutyLabel: '[3] O\'ZBEKISTON BOJXONA BOJI (TIF TN BO\'YICHA %):',
      dutyHint: 'O\'zbekiston Respublikasi bojxona tarifiga muvofiq import boji stavkasi',
      vatLabel: '[4] QO\'SHILGAN QIYMAT SOLIG\'I (QQS 12%):',
      vatHint: 'Didox / Soliq tizimida hisobga olish uchun elektron hisob-faktura rasmiylashtiriladi',
      breakdownTitle: 'YAKUNIY TANNARX HISOBI (LANDED COST DDP TOSHKENT):',
      baseInvoice: 'Zavodning bazaviy narxi (FOB/FCA):',
      freightCost: 'Transport va logistika sug\'urtasi:',
      customsBase: 'Bojxona qiymati (CIF Toshkent):',
      importDuty: 'O\'zbekiston bojxona boji:',
      vatAmount: 'QQS 12% (hisobga olinadigan):',
      totalDdpUsd: 'JAMI LANDED COST (USD):',
      totalDdpUzs: 'QQS 12% BILAN SO\'MDA TO\'LOVNING YAKUNIY MIQDORI:',
      fixedPriceNote: 'Shartnoma tuzilgan sanada so\'mda narx qat\'iy belgilanadi. Valyuta tebranishlari ta\'sir qilmaydi.',
      actionBtn: '[ HISOB-KITOBNI SAQLASH VA TAKLIF SO\'RASH ]',
    },
    smartMatch: {
      badge: 'AI DEMO // SMART MATCH V2.4',
      title: 'TEXNIK TOPSHIRIQNI NLP ORQALI TANIYDIGAN INTERAKTIV TESTER',
      subtitle: 'Sanoat detali, artikul yoki nosozlik dalolatnomasini rus, o\'zbek yoki ingliz tillarida erkin matn shaklida kiriting:',
      inputLabel: 'TEXNIK SO\'ROV / DEFEKT DALOLATNOMASI MATNI:',
      inputPlaceholder: 'Masalan: ShA-01 avtomatlashtirish shkafi yoki SP-6M elektr uzatmasi...',
      sampleQueries: 'TEZKOR TEST SO\'ROVLARI:',
      btnAnalyze: 'DETALNI ANIQLASH (NLP INFERENCE)',
      btnReset: 'TOZALASH',
      telemetryTitle: 'NEYROTIZIM TAHLILI NATIJASI (MATCH RESULT):',
      matchAccuracy: 'MOSLIK DARAJASI (CONFIDENCE SCORE):',
      detectedSku: 'ANIQLANGAN ARTIKUL (SKU):',
      standard: 'STANDART / TU:',
      hsCode: 'O\'ZBEKISTON TIF TN KODI:',
      warehouseStatus: 'OMBORDAGI MAVJUDLIK:',
      latency: 'ISHLASH TEZLIGI (LATENCY):',
      inStockValue: 'Omborda mavjud (Toshkent, Index B2-2097)',
      requestQuoteBtn: '[ USHBU DETAL UCHUN HISOB CHIQARISH ]',
      sample1: 'Yuk vagonlari uchun 25610-N kompozitsion tormoz kolodkasi',
      sample2: 'SP-6M chap tomonlama elektr uzatmasi shiber yurishi 160mm',
      sample3: 'Nimstansiya uchun ShA-01 avtomatlashtirish shkafi',
      sample4: 'SA-3 avtobirlashmasi korpus 106.01.000',
    },
    modal: {
      badge: 'RASMIY BUYURTMA // QQS 12% EHF',
      title: 'TIJORAT TAKLIFI VA HISOB-FAKTURA SO\'ROVI',
      subtitle: '«RailTech» MCHJ markaziy ta\'minot reestrida buyurtmani ro\'yxatga olish (Toshkent, Index SIChK B2-2097).',
      nameLabel: '[1] MAS\'UL SHAXSNING F.I.SH. *',
      namePlaceholder: 'Karimov Jasur Alisherovich',
      companyLabel: '[2] TASHKILOT / ZAVOD NOMI *',
      companyPlaceholder: '«Olmaliq KMK» AJ / «O\'zmetkombinat» AJ...',
      innLabel: '[3] KORXONA STIR / INN (EHF UCHUN 9 TA RAQAM) *',
      innPlaceholder: '308912445',
      phoneLabel: '[4] BOG\'LANISH TELEFONI *',
      subjectLabel: '[5] SO\'ROV MAVZUSI / MAHSULOT ARTIKULI',
      commentLabel: '[6] TEXNIK TAFSILOTLAR / BUYURTMA HAJMI',
      commentPlaceholder: 'Kerakli miqdor, sertifikatlar talabi yoki yetkazib berish shartlarini kiriting...',
      fileLabel: '[7] SPETSIFIKATSIYA / TEXNIK TOPSHIRIQ / REKVIZITLAR (25 MB GACHA)',
      fileHint: 'PDF, Excel, Word, DWG yoki ZIP arxiv',
      fileSelect: 'FAYLNI TANLASH',
      privacyNotice: 'So\'rov yuborish orqali O\'zbekiston Respublikasining O\'RQ-547-sonli Qonuniga muvofiq ma\'lumotlar qayta ishlanishiga rozilik bildirasiz.',
      submitBtn: '[ BUYURTMANI RO\'YXATGA OLISH VA HISOB SO\'RASH ]',
      sendingBtn: 'MA\'LUMOTLAR REESTRGA YUBORILMOQDA...',
      successBadge: 'RO\'YXATGA OLINDI',
      successTitle: 'SO\'ROV TIZIMDA MUVAFFAQIYATLI SAQLANDI',
      successText: 'Spetsifikatsiya «RailTech» MCHJ muhandislik bo\'limiga yuborildi. Mas\'ul menejer 30 daqiqa ichida siz bilan bog\'lanadi va 12% QQS bilan rasmiy tijorat taklifini yuboradi.',
      successDetails: 'So\'rov raqami Didox / Telegram tizimida qayd etildi.',
      closeBtn: '[ OYNANI YOPISH ]',
    },
    footer: {
      companyDesc: 'Markaziy Osiyoda sanoat uskunalari, avtomatlashtirish tizimlari va infratuzilma yechimlarining muhandislik yetkazib beruvchisi.',
      requisitesTitle: 'KORXONA REKVIZITLARI:',
      innLabel: 'STIR (INN):',
      vatStatus: 'QQS: 12% (TO\'LOVCHI)',
      okedLabel: 'IFUT (OKED): 46.69.0',
      esfLabel: 'EHF: Didox / Soliq / Factura.uz',
      privacyLink: 'Maxfiylik siyosati',
      termsLink: 'Foydalanish shartlari',
      navTitle: 'PORTAL BO\'YICHA NAVIGATSIYA',
      groupsCount: '10 ta guruh',
      stepsCount: '4 ta bosqich',
      cmsAdmin: '[CMS] Boshqaruv paneli',
      warehouseTitle: 'TOSHKENTDAGI OMBOR HUBI',
      warehouseDesc: 'Toshkent shahridagi shaxsiy ombor majmuasi, Index SIChK B2-2097. Sanoat uskunalari va butlovchi qismlarining doimiy zaxirasi.',
      gpsLabel: 'GPS: 41.2214° N, 69.1852° E',
      trackGauge: 'Logistika: to‘g‘ridan-to‘g‘ri kirish yo‘li va avtoterminal',
      scheduleHours: 'Ish tartibi: Dsh-Juma 09:00 - 18:00',
      dispatchRoundTheClock: 'Platformalarni yuklash: 24/7',
      nodeTitle: 'TEZKOR ALOQA TUGUNI',
      directLine: 'To\'g\'ridan-to\'g\'ri ta\'minot liniyasi:',
      emailLabel: 'Elektron pochta:',
      requestsLabel: 'supply@railtech.uz (Buyurtmalar)',
      legalDept: 'Yuridik bo\'lim: legal@railtech.uz',
      statusProduction: 'STATUS: PRODUCTION // TUGUN: TOSHKENT',
      securityTls: 'XAVFSIZLIK: TLS 1.3 / E-IMZO TASDIQLANGAN',
      copyright: '«RailTech» MCHJ. O\'ZBEKISTON RESPUBLIKASI.',
    },
    faq: {
      badge: 'REGLAMENT & JAVOBLAR',
      title: 'KO\'P SO\'RALADIGAN SAVOLLAR (FAQ)',
      subtitle: 'Yetkazib berish tartibi, yuridik kafolatlar, sertifikatlash va b2b.railtech.uz platformasiga kirish',
      officialReglament: '«RAILTECH» MCHJ RASMIY REGLAMENTI',
    },
  },
  en: {
    nav: {
      home: 'HOME',
      catalog: 'RAILWAY EQUIPMENT CATALOG',
      contract: 'CONTRACT IMPORT DDP',
      digital: 'DIGITAL & SOFTWARE',
      projects: 'SPECIAL PROJECTS & ART',
      blog: 'BLOG / NEWS',
      about: 'ABOUT US',
      contacts: 'CONTACTS & REQUISITES',
    },
    telemetry: {
      country: 'REPUBLIC OF UZBEKISTAN',
      warehouse: 'WAREHOUSE: TASHKENT, INDEX B2-2097',
      vat: 'VAT 12% INCLUDED',
      phone: 'TEL:',
      b2bPortal: 'B2B.RAILTECH.UZ ↗',
      statusProduction: 'STATUS: PRODUCTION // NODE: TASHKENT',
      securityTls: 'SECURITY: TLS 1.3 / E-SIGN VERIFIED',
      copyright: 'RAILTECH LLC. REPUBLIC OF UZBEKISTAN.',
    },
    buttons: {
      rfq: '[ RFQ / INVOICE REQUEST ]',
      specs: 'Specification →',
      allPosts: 'All publications →',
      submit: 'Submit Request',
      uploadSpecs: '[ UPLOAD SPECIFICATION ]',
      passport: 'DATASHEET ↗',
      allSystems: 'ALL SYSTEMS',
      openCatalog: 'OPEN WAREHOUSE CATALOG (10+ GROUPS) →',
      contractCalc: 'CALCULATE DDP TASHKENT ↗',
      demoSmartMatch: 'SMART MATCH DEMO & IT SERVICES →',
      projectsArt: 'SPECIAL PROJECTS & ART LAB →',
      send: 'SUBMIT RFQ',
      cancel: 'CANCEL',
      sending: 'REGISTERING INQUIRY...',
    },
    catalog: {
      title: 'WAREHOUSE INVENTORY OF INDUSTRIAL EQUIPMENT & COMPONENTS',
      subtitle: 'Safety stock of certified industrial equipment and components in Tashkent (Index B2-2097). 24-hour dispatch with factory quality passports and technical documentation.',
      filterAll: 'ALL SYSTEMS',
      searchPlaceholder: 'Search by SKU, parameters, category...',
      foundCount: 'ITEMS FOUND:',
      dispatchWarehouse: 'DISPATCH HUB: TASHKENT / INDEX B2-2097',
      colSku: 'SKU CODE',
      colTitleSpecs: 'PART NAME & SPECIFICATIONS',
      colSubsystem: 'CATEGORY',
      colGost: 'STANDARD',
      colTnved: 'HS CODE',
      colStatus: 'STOCK STATUS',
      colAction: 'ACTION',
      statusInStock: 'In Stock',
      statusReserved: 'Reserved',
      statusOnOrder: 'On Order',
      orderBtn: 'REQUEST RFQ',
      subsystems: {
        rollingStock: 'Industrial Equipment',
        scb: 'Automation & Control',
        track: 'Units & Components',
        kip: 'Instrumentation & Testing',
        energy: 'Electrification & Power',
      },
    },
    calculator: {
      title: 'LANDED COST DDP TASHKENT CALCULATOR',
      badge: 'CALC.DDP-UZ',
      cbRate: 'CENTRAL BANK OF UZBEKISTAN RATE: 1 USD = 12,850 UZS',
      invoiceLabel: '[1] FACTORY INVOICE EQUIPMENT VALUE (USD, FOB/FCA)',
      invoiceHint: 'Invoice amount from manufacturer in China, CIS, or European Union',
      freightLabel: '[2] INTERNATIONAL RAIL & ROAD FREIGHT TO TASHKENT (%):',
      freightHint: 'Includes rail tariffs, armed transit security, and border transshipment',
      dutyLabel: '[3] UZBEKISTAN CUSTOMS TARIFF (% BY HS CODE):',
      dutyHint: 'Customs duty rate according to Uzbekistan foreign economic activity tariffs',
      vatLabel: '[4] VALUE ADDED TAX (VAT 12% IN UZBEKISTAN):',
      vatHint: '12% VAT with official e-invoicing through Didox / Soliq for tax deduction',
      breakdownTitle: 'FINAL LANDED COST BREAKDOWN (DDP TASHKENT):',
      baseInvoice: 'Base Factory Price (FOB/FCA):',
      freightCost: 'Freight & Transit Insurance:',
      customsBase: 'Customs Value (CIF Tashkent):',
      importDuty: 'Uzbekistan Import Duty:',
      vatAmount: 'VAT 12% (Tax Deductible):',
      totalDdpUsd: 'TOTAL LANDED COST (USD):',
      totalDdpUzs: 'TOTAL INVOICE PAYABLE IN UZS (INCL. 12% VAT):',
      fixedPriceNote: 'Price fixed in Uzbek Sums upon contract signing. Full hedge against currency fluctuations.',
      actionBtn: '[ LOCK ESTIMATE AND REQUEST COMMERCIAL OFFER ]',
    },
    smartMatch: {
      badge: 'AI DEMO // SMART MATCH V2.4',
      title: 'INTERACTIVE NLP TECHNICAL SPECIFICATION PARSER',
      subtitle: 'Enter a freeform industrial component description, part number, or bill-of-materials snippet in Russian, Uzbek, or English:',
      inputLabel: 'TECHNICAL SPECIFICATION / REPAIR NOTE TEXT:',
      inputPlaceholder: 'For example: SA-01 automation cabinet or SP-6M switch machine...',
      sampleQueries: 'QUICK TEST QUERIES:',
      btnAnalyze: 'IDENTIFY COMPONENT (NLP INFERENCE)',
      btnReset: 'RESET',
      telemetryTitle: 'NEURAL CLASSIFIER OUTPUT (MATCH RESULT):',
      matchAccuracy: 'CONFIDENCE SCORE:',
      detectedSku: 'IDENTIFIED SKU CODE:',
      standard: 'STANDARD / SPEC:',
      hsCode: 'UZBEKISTAN HS CODE:',
      warehouseStatus: 'WAREHOUSE AVAILABILITY:',
      latency: 'PROCESSING LATENCY:',
      inStockValue: 'In Stock (Tashkent, Index B2-2097)',
      requestQuoteBtn: '[ GENERATE INVOICE FOR THIS PART ]',
      sample1: 'Composite brake shoe 25610-N for rolling stock',
      sample2: 'Switch machine SP-6M left hand stroke 160mm',
      sample3: 'Automation cabinet SA-01 for substation',
      sample4: 'Coupler SA-3 body drawing 106.01.000',
    },
    modal: {
      badge: 'OFFICIAL RFQ // 12% VAT E-INVOICE',
      title: 'REQUEST COMMERCIAL OFFER & INVOICE',
      subtitle: 'Registration in RailTech LLC procurement registry (Tashkent, Index Complex B2-2097).',
      nameLabel: '[1] FULL NAME OF RESPONSIBLE PERSON *',
      namePlaceholder: 'John Doe / Procurement Officer',
      companyLabel: '[2] ORGANIZATION / PLANT NAME *',
      companyPlaceholder: 'Navoi Mining & Metallurgical Combinat...',
      innLabel: '[3] TAX ID / INN (9 DIGITS FOR E-INVOICING) *',
      innPlaceholder: '308912445',
      phoneLabel: '[4] CONTACT PHONE NUMBER *',
      subjectLabel: '[5] SUBJECT / SKU CODE',
      commentLabel: '[6] SPECIFICATIONS / ORDER VOLUME',
      commentPlaceholder: 'Indicate required quantity, standard requirements or special delivery terms...',
      fileLabel: '[7] ATTACH SPECIFICATION / RFQ / DETAILS (UP TO 25 MB)',
      fileHint: 'PDF, Excel, Word, DWG or ZIP archive',
      fileSelect: 'SELECT FILE',
      privacyNotice: 'By submitting this inquiry, you agree to personal data processing pursuant to Uzbekistan Law No. ZRU-547.',
      submitBtn: '[ REGISTER INQUIRY & GENERATE RFQ ]',
      sendingBtn: 'TRANSMITTING TO REGISTRY...',
      successBadge: 'REGISTRATION SUCCESSFUL',
      successTitle: 'INQUIRY SUCCESSFULLY REGISTERED',
      successText: 'Your specification has been forwarded to the RailTech LLC engineering department. An account manager will reach out with an official quotation including 12% VAT within 30 minutes.',
      successDetails: 'Request ID recorded in Didox / Telegram bot audit log.',
      closeBtn: '[ CLOSE WINDOW ]',
    },
    footer: {
      companyDesc: 'Engineering supplier of industrial equipment, automation systems, and infrastructure solutions in Central Asia.',
      requisitesTitle: 'COMPANY REQUISITES:',
      innLabel: 'TIN / INN:',
      vatStatus: 'VAT: 12% (ACCREDITED)',
      okedLabel: 'NACE / OKED: 46.69.0',
      esfLabel: 'E-INVOICE: Didox / Soliq / Factura.uz',
      privacyLink: 'Privacy Policy',
      termsLink: 'Terms of Service',
      navTitle: 'PORTAL NAVIGATION',
      groupsCount: '10 groups',
      stepsCount: '4 steps',
      cmsAdmin: '[CMS] Admin Panel',
      warehouseTitle: 'WAREHOUSE HUB IN TASHKENT',
      warehouseDesc: 'Company-owned logistics terminal in Tashkent, Index Complex B2-2097. Continuous buffer stock of critical industrial equipment and components.',
      gpsLabel: 'GPS: 41.2214° N, 69.1852° E',
      trackGauge: 'Logistics: direct rail spur and road freight terminal',
      scheduleHours: 'Hours: Mon-Fri 09:00 - 18:00',
      dispatchRoundTheClock: 'Railcar Loading: 24/7',
      nodeTitle: 'OPERATIONAL COMMUNICATIONS HUB',
      directLine: 'Direct Supply Line:',
      emailLabel: 'Email:',
      requestsLabel: 'supply@railtech.uz (Inquiries)',
      legalDept: 'Legal: legal@railtech.uz',
      statusProduction: 'STATUS: PRODUCTION // NODE: TASHKENT',
      securityTls: 'SECURITY: TLS 1.3 / E-SIGN VERIFIED',
      copyright: 'RAILTECH LLC. REPUBLIC OF UZBEKISTAN.',
    },
    faq: {
      badge: 'REGULATIONS & ANSWERS',
      title: 'FREQUENTLY ASKED QUESTIONS (FAQ)',
      subtitle: 'Supply regulations, legal guarantees, certification and platform b2b.railtech.uz access',
      officialReglament: 'OFFICIAL RAILTECH LLC REGULATIONS',
    },
  },
};

/**
 * Safe translation getter with fallback to Russian
 */
export function getUiTranslation(lang: Lang = 'ru'): UiDictionary {
  return UI_DICTIONARY[lang] || UI_DICTIONARY.ru;
}
