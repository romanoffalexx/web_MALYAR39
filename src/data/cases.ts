export interface CaseMaterial {
  name: string;
  description: string;
  volume: string;
  image: string;
}

export interface CaseStep {
  title: string;
  description: string;
}

export interface CaseItem {
  slug: string;
  title: string;
  subtitle: string;
  category: "residential" | "commercial" | "industrial" | "municipal";
  categoryName: string;
  area: string;
  duration: string;
  year: number;
  workType: string;
  image: string;
  task: string;
  materials: CaseMaterial[];
  steps: CaseStep[];
  results: string[];
  savings: string;
  savingsNote: string;
  serviceLife: string;
  serviceLifeNote: string;
  tag?: string;
  featured?: boolean;
}

export const caseCategories = [
  { slug: "all", name: "Все кейсы" },
  { slug: "residential", name: "Жилые объекты" },
  { slug: "commercial", name: "Коммерческие объекты" },
  { slug: "industrial", name: "Промышленные объекты" },
  { slug: "municipal", name: "Муниципальные объекты" },
];

export const casesData: CaseItem[] = [
  {
    slug: "zhk-novaya-riga",
    title: "ЖК «Новая Рига»",
    subtitle: "Отделка фасадов и МОП",
    category: "residential",
    categoryName: "Жилой комплекс",
    area: "18 500 м²",
    duration: "45 дней",
    year: 2024,
    workType: "Фасады, МОП",
    image: "/images/cases/zhk.jpg",
    task:
      "Обеспечить долговечную защиту фасадов от атмосферных воздействий и создать эстетичный вид входных групп и мест общего пользования.",
    materials: [
      {
        name: "MIPA Fassaden Silikat",
        description: "Силикатная фасадная краска",
        volume: "320 л",
        image: "/images/products/bucket-teal.jpg",
      },
      {
        name: "MIPA Siliconharz Fassadenfarbe",
        description: "Силиконовая фасадная краска",
        volume: "280 л",
        image: "/images/products/bucket-green.jpg",
      },
      {
        name: "MIPA Innenlatex Matt",
        description: "Интерьерная краска для стен и потолков",
        volume: "450 л",
        image: "/images/products/bucket-green.jpg",
      },
      {
        name: "FEIDAL Innenlatex Matt",
        description: "Краска для МОП повышенной стойкости",
        volume: "220 л",
        image: "/images/products/bucket-dark.jpg",
      },
    ],
    steps: [
      {
        title: "Подготовка поверхности",
        description: "Очистка, ремонт дефектов, грунтование.",
      },
      {
        title: "Фасадные работы",
        description: "Нанесение фасадных красок в 2 слоя.",
      },
      {
        title: "Внутренние работы",
        description: "Окраска стен и потолков в МОП.",
      },
      {
        title: "Контроль качества",
        description: "Проверка покрытия и приёмка объекта.",
      },
    ],
    results: [
      "Надёжная защита фасада от влаги и УФ-излучения",
      "Стойкость покрытия более 7 лет",
      "Эстетичный внешний вид",
      "Лёгкость ухода за поверхностями",
      "Соблюдены сроки и бюджет проекта",
    ],
    savings: "230 000 ₽",
    savingsNote: "за счёт подбора оптимальных материалов и технологии нанесения",
    serviceLife: "от 7 лет",
    serviceLifeNote: "гарантия производителей долговечность и сохранение цвета",
  },
  {
    slug: "bc-arena-park",
    title: "БЦ «Арена Парк»",
    subtitle: "Отделка офисных помещений",
    category: "commercial",
    categoryName: "Коммерческий объект",
    area: "6 200 м²",
    duration: "30 дней",
    year: 2024,
    workType: "Интерьеры, МОП",
    image: "/images/cases/office.jpg",
    task:
      "Обновить отделку офисных коридоров и переговорных без остановки работы бизнес-центра, используя материалы без запаха.",
    materials: [
      {
        name: "MIPA Innenlatex",
        description: "Интерьерная акриловая краска",
        volume: "380 л",
        image: "/images/products/bucket-green.jpg",
      },
      {
        name: "DULUX 3D White",
        description: "Краска для стен и потолков",
        volume: "240 л",
        image: "/images/products/bucket-blue.jpg",
      },
    ],
    steps: [
      { title: "Подготовка", description: "Локальный ремонт и грунтование в ночные смены." },
      { title: "Окраска", description: "Два слоя интерьерной краски без запаха." },
      { title: "Приёмка", description: "Проверка покрытия по зонам аренды." },
    ],
    results: [
      "Работы выполнены без остановки работы БЦ",
      "Покрытие выдерживает влажную уборку",
      "Нейтральный запах — комфорт арендаторов",
    ],
    savings: "140 000 ₽",
    savingsNote: "за счёт ночных смен и точного расчёта материалов",
    serviceLife: "от 5 лет",
    serviceLifeNote: "стойкость к мытью в зонах высокой проходимости",
  },
  {
    slug: "zavod-tehnomet",
    title: "Завод «ТехноМет»",
    subtitle: "Защита металлоконструкций и полов",
    category: "industrial",
    categoryName: "Промышленный объект",
    area: "12 000 м²",
    duration: "35 дней",
    year: 2023,
    workType: "Металл, полы",
    image: "/images/cases/factory.jpg",
    task:
      "Защитить металлоконструкции цеха от коррозии и устроить износостойкое покрытие пола под нагрузку погрузчиков.",
    materials: [
      {
        name: "Грунт-эмаль 3 в 1",
        description: "Антикоррозийная по металлу",
        volume: "850 л",
        image: "/images/products/can-yellow.jpg",
      },
      {
        name: "Эпоксидная эмаль для полов",
        description: "Покрытие для промышленных полов",
        volume: "620 л",
        image: "/images/products/bucket-dark.jpg",
      },
    ],
    steps: [
      { title: "Абразивная очистка", description: "Обеспыливание и дробеструйная обработка металла." },
      { title: "Грунтование и окраска", description: "Грунт-эмаль в 2 слоя по металлоконструкциям." },
      { title: "Устройство полов", description: "Эпоксидное покрытие в 3 слоя с кварцевым песком." },
    ],
    results: [
      "Класс коррозионной стойкости C4",
      "Пол выдерживает колёсную нагрузку до 8 т",
      "Цех не останавливал производство",
    ],
    savings: "410 000 ₽",
    savingsNote: "за счёт схемы 3 в 1 вместо раздельных слоёв",
    serviceLife: "от 10 лет",
    serviceLifeNote: "ресурс покрытия пола и металлоконструкций",
  },
  {
    slug: "shkola-45",
    title: "Школа №45",
    subtitle: "Капитальный ремонт",
    category: "municipal",
    categoryName: "Муниципальный объект",
    area: "8 800 м²",
    duration: "60 дней",
    year: 2023,
    workType: "Фасад, интерьеры",
    image: "/images/cases/school.jpg",
    task:
      "Выполнить капитальный ремонт фасада и внутренних помещений школы в летний период с материалами безопасными для детей.",
    materials: [
      {
        name: "Фасадная силиконовая краска",
        description: "Для минеральных оснований",
        volume: "540 л",
        image: "/images/products/bucket-teal.jpg",
      },
      {
        name: "Краска для детских учреждений",
        description: "Сертифицирована для школ и детсадов",
        volume: "460 л",
        image: "/images/products/bucket-blue.jpg",
      },
    ],
    steps: [
      { title: "Ремонт фасада", description: "Расшивка трещин, штукатурка, грунтование." },
      { title: "Окраска фасада", description: "Два слоя силиконовой краски." },
      { title: "Внутренние работы", description: "Окраска классов и коридоров сертифицированной краской." },
    ],
    results: [
      "Сдано к 1 сентября без переносов",
      "Материалы с сертификатом для детских учреждений",
      "Фасад защищён от трещин и высолов",
    ],
    savings: "180 000 ₽",
    savingsNote: "за счёт оптовой поставки и точного расчёта",
    serviceLife: "от 8 лет",
    serviceLifeNote: "ресурс фасадного покрытия",
  },
  {
    slug: "tc-siti-moll",
    title: "ТЦ «Сити Молл»",
    subtitle: "Отделка торговых помещений",
    category: "commercial",
    categoryName: "Коммерческий объект",
    area: "5 400 м²",
    duration: "28 дней",
    year: 2024,
    workType: "Интерьеры, атриум",
    image: "/images/cases/mall.jpg",
    task:
      "Обновить отделку атриума и галерей торгового центра в ночные смены, сохранив дневной режим работы магазинов.",
    materials: [
      {
        name: "MIPA Innenlatex Matt",
        description: "Глубокоматовая интерьерная краска",
        volume: "410 л",
        image: "/images/products/bucket-green.jpg",
      },
      {
        name: "Эмаль для металлических конструкций",
        description: "Окраска ограждений и ферм",
        volume: "180 л",
        image: "/images/products/can-red.jpg",
      },
    ],
    steps: [
      { title: "Ночные смены", description: "Подготовка и окраска с 23:00 до 07:00." },
      { title: "Окраска атриума", description: "Матовая краска без бликов от освещения." },
      { title: "Финишная приёмка", description: "Проверка при дневном и искусственном свете." },
    ],
    results: [
      "Торговый центр работал без закрытия",
      "Матовое покрытие скрывает дефекты оснований",
      "Единый цвет по всем галереям",
    ],
    savings: "95 000 ₽",
    savingsNote: "за счёт ночной логистики и колеровки одной партией",
    serviceLife: "от 6 лет",
    serviceLifeNote: "стойкость к уборке и контактным нагрузкам",
  },
  {
    slug: "neftehranilishche-alfa",
    title: "Нефтехранилище «Альфа»",
    subtitle: "Антикоррозийная защита резервуаров",
    category: "industrial",
    categoryName: "Промышленный объект",
    area: "3 200 м²",
    duration: "20 дней",
    year: 2023,
    workType: "Резервуары, металл",
    image: "/images/cases/tanks.jpg",
    task:
      "Защитить наружные поверхности резервуаров от коррозии в условиях агрессивной среды и перепадов температур.",
    materials: [
      {
        name: "Грунт-эмаль 3 в 1",
        description: "Химстойкая система по металлу",
        volume: "460 л",
        image: "/images/products/can-yellow.jpg",
      },
    ],
    steps: [
      { title: "Подготовка", description: "Гидроструйная очистка до St2." },
      { title: "Нанесение", description: "Грунт-эмаль в 2 слоя безвоздушным распылением." },
      { title: "Контроль", description: "Замер толщины слоя по ГОСТ." },
    ],
    results: [
      "Толщина покрытия по ГОСТ 9.407",
      "Стойкость к парам нефтепродуктов",
      "Работы выполнены без вывода резервуаров из эксплуатации",
    ],
    savings: "120 000 ₽",
    savingsNote: "за счёт однослойной схемы грунт-эмали",
    serviceLife: "от 12 лет",
    serviceLifeNote: "ресурс системы в условиях агрессивной среды",
  },
];

export const featuredCases: CaseItem[] = [
  {
    slug: "fasad-zagorodnogo-doma",
    title: "Фасад загородного дома",
    subtitle: "Защита и окраска фасада",
    category: "residential",
    categoryName: "Частный дом",
    area: "420 м²",
    duration: "12 дней",
    year: 2024,
    workType: "фасадная краска, грунт",
    image: "/images/categories/plaster.jpg",
    task:
      "Защитить фасад из газобетона от осадков и УФ-излучения, сохранив паропроницаемость стен.",
    materials: [
      {
        name: "MIPA Siliconharz Fassadenfarbe",
        description: "Силиконовая фасадная краска",
        volume: "60 л",
        image: "/images/products/bucket-green.jpg",
      },
      {
        name: "Грунтовка глубокого проникновения",
        description: "Укрепление минерального основания",
        volume: "20 л",
        image: "/images/products/bucket-blue.jpg",
      },
    ],
    steps: [
      { title: "Подготовка", description: "Очистка, ремонт трещин, грунтование." },
      { title: "Окраска", description: "Два слоя фасадной краски безвоздушным распылением." },
      { title: "Приёмка", description: "Проверка укрывистости и отсутствия непрокрасов." },
    ],
    results: [
      "Фасад защищён от осадков и УФ-излучения",
      "Стены сохраняют паропроницаемость",
      "Цвет не выгорает за сезон",
    ],
    savings: "18% бюджета",
    savingsNote: "за счёт точного расчёта расхода и колеровки одной партией",
    serviceLife: "от 8 лет",
    serviceLifeNote: "ресурс фасадного покрытия",
    tag: "Фасад",
    featured: true,
  },
  {
    slug: "interer-kvartiry",
    title: "Интерьер квартиры",
    subtitle: "Декоративная отделка гостиной",
    category: "residential",
    categoryName: "Квартира",
    area: "86 м²",
    duration: "9 дней",
    year: 2024,
    workType: "декоративная штукатурка, воск",
    image: "/images/categories/water-paints.jpg",
    task:
      "Создать акцентную стену с эффектом бетона в гостиной зоне, безопасными для жилья материалами.",
    materials: [
      {
        name: "MIPA Silikonharzputz",
        description: "Декоративная штукатурка",
        volume: "40 кг",
        image: "/images/products/bucket-dark.jpg",
      },
      {
        name: "Воск защитный матовый",
        description: "Финишная защита фактуры",
        volume: "5 л",
        image: "/images/products/bucket-teal.jpg",
      },
    ],
    steps: [
      { title: "Подготовка", description: "Шпатлевание и грунтование основания." },
      { title: "Нанесение штукатурки", description: "Формирование фактуры «бетон» в два слоя." },
      { title: "Финиш", description: "Защитный воск и полировка поверхности." },
    ],
    results: [
      "Фактура «бетон» без швов и стыков",
      "Покрытие выдерживает влажную уборку",
      "Материалы без запаха — квартира не выезжала",
    ],
    savings: "12% бюджета",
    savingsNote: "за счёт подбора штукатурки под нужную фактуру без лишних слоёв",
    serviceLife: "от 10 лет",
    serviceLifeNote: "ресурс декоративного покрытия",
    tag: "Интерьер",
    featured: true,
  },
  {
    slug: "metallokonstrukcii",
    title: "Металлоконструкции",
    subtitle: "Антикоррозийная защита",
    category: "industrial",
    categoryName: "Промышленный объект",
    area: "2 400 м²",
    duration: "14 дней",
    year: 2023,
    workType: "грунт-эмаль 3 в 1",
    image: "/images/categories/metal-paints.jpg",
    task:
      "Выполнить комплексную антикоррозийную защиту металлических конструкций без остановки производства.",
    materials: [
      {
        name: "Грунт-эмаль 3 в 1",
        description: "Антикоррозийная система по металлу",
        volume: "380 л",
        image: "/images/products/can-yellow.jpg",
      },
    ],
    steps: [
      { title: "Подготовка", description: "Абразивная очистка и обеспыливание." },
      { title: "Нанесение", description: "Грунт-эмаль в 2 слоя безвоздушным распылением." },
      { title: "Контроль", description: "Замер толщины сухого слоя по ГОСТ." },
    ],
    results: [
      "Класс коррозионной стойкости C3",
      "Работы выполнены без остановки цеха",
      "Единый цвет по всем конструкциям",
    ],
    savings: "25% бюджета",
    savingsNote: "за счёт схемы 3 в 1 вместо раздельных грунта и эмали",
    serviceLife: "от 8 лет",
    serviceLifeNote: "ресурс антикоррозийной системы",
    tag: "Металл",
    featured: true,
  },
];
