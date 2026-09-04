export interface SeedVariant {
  volume: number;
  unit: string;
  price: number;
  oldPrice?: number;
  sku?: string;
  stock?: number;
}

export interface SeedCategory {
  slug: string;
  name: string;
  parentSlug?: string;
  description: string;
  image?: string;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SeedBrand {
  slug: string;
  name: string;
  description?: string;
  order: number;
}

export interface SeedProduct {
  slug: string;
  name: string;
  categorySlug: string;
  brandSlug?: string;
  shortDescription: string;
  description: string;
  applicationInstructions?: string;
  article?: string;
  coverageRate?: number;
  defaultLayers?: number;
  rating?: number;
  reviewsCount?: number;
  isPopular?: boolean;
  inStock?: boolean;
  images: string[];
  variants: SeedVariant[];
  characteristics?: [string, string][];
  compatibility?: string[];
  documents?: { name: string; url: string; size: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

export const seedCategories: SeedCategory[] = [
  {
    slug: "vodnye-kraski",
    name: "Водные краски",
    description: "Для стен, потолков, фасадов и влажных помещений",
    image: "/images/categories/water-paints.jpg",
    order: 1,
    seoTitle: "Водные краски для стен, потолков и фасадов — Маляр",
    seoDescription:
      "Интерьерные и фасадные краски на водной основе: проверенные бренды, расчёт расхода, доставка по всей России.",
  },
  {
    slug: "kraski-po-metallu",
    name: "Краски по металлу",
    description: "Защита от коррозии и декоративная отделка металлических поверхностей",
    image: "/images/categories/metal-paints.jpg",
    order: 2,
  },
  {
    slug: "dekorativnye-shtukaturki",
    name: "Декоративные штукатурки",
    description: "Фактурные покрытия для стильных интерьеров и фасадов",
    image: "/images/categories/plaster.jpg",
    order: 3,
  },
  {
    slug: "malyarnyy-instrument",
    name: "Малярный инструмент",
    description: "Всё для удобной и качественной работы",
    image: "/images/categories/tools.jpg",
    order: 4,
  },
  {
    slug: "grunty-i-laki",
    name: "Грунты и лаки",
    description: "Подготовка оснований и финишная защита покрытий",
    image: "/images/products/can-yellow.jpg",
    order: 5,
  },
  {
    slug: "dlya-sten-i-potolkov",
    name: "Для стен и потолков",
    parentSlug: "vodnye-kraski",
    description: "Интерьерные краски для жилых и офисных помещений",
    order: 1,
  },
  {
    slug: "dlya-vlazhnyh-pomescheniy",
    name: "Для влажных помещений",
    parentSlug: "vodnye-kraski",
    description: "Влагостойкие краски для ванных, кухонь и санузлов",
    order: 2,
  },
  {
    slug: "dlya-detskih-i-med-uchrezhdeniy",
    name: "Для детских и мед. учреждений",
    parentSlug: "vodnye-kraski",
    description: "Сертифицированные краски без запаха для детских и медицинских помещений",
    order: 3,
  },
  {
    slug: "fasadnye",
    name: "Фасадные",
    parentSlug: "vodnye-kraski",
    description: "Атмосферостойкие краски для минеральных фасадов",
    order: 4,
  },
];

export const seedBrands: SeedBrand[] = [
  { slug: "mipa", name: "MIPA", description: "Немецкие лакокрасочные материалы профессионального класса", order: 1 },
  { slug: "vika", name: "VIKA", description: "Краски для интерьеров и фасадов", order: 2 },
  { slug: "brulex", name: "BRÜLEX", description: "Профессиональные покрытия и грунты", order: 3 },
  { slug: "feidal", name: "FEIDAL", description: "Европейские краски для стен и потолков", order: 4 },
  { slug: "luxens", name: "LUXENS", description: "Доступные интерьерные краски", order: 5 },
  { slug: "dulux", name: "DULUX", description: "Мировой бренд интерьерных красок", order: 6 },
  { slug: "tikkurila", name: "TIKKURILA", description: "Финские краски с высокой износостойкостью", order: 7 },
  { slug: "marshall", name: "MARSHALL", description: "Краски для дома и ремонта", order: 8 },
  { slug: "jobi", name: "JOBI", description: "Немецкое качество для интерьеров", order: 9 },
  { slug: "parade", name: "PARADE", description: "Профессиональные интерьерные краски", order: 10 },
  { slug: "mirka", name: "MIRKA", description: "Абразивные материалы для подготовки поверхностей", order: 11 },
  { slug: "novakryl", name: "NOVAKRYL", description: "Грунтовочные составы", order: 12 },
];

const facadeProps = ["Моющаяся", "Влагостойкая", "Стойкая к УФ", "Без запаха"];

const waterCompatibility = [
  "Бетон, штукатурка, шпаклевка",
  "Гипсокартон, гипсовые поверхности",
  "Кирпич, газобетон",
  "Обои под покраску",
  "Дерево (загрунтованное)",
];

function waterChars(
  binder: string,
  wash: string,
  gloss: string,
  base = "База A (белая)",
  properties?: string[],
): [string, string][] {
  const props =
    properties ??
    ([
      wash.startsWith("1-й") || wash.startsWith("2-й") ? "Моющаяся" : null,
      wash.startsWith("1-й") ? "Влагостойкая" : null,
      "Без запаха",
    ].filter(Boolean) as string[]);

  return [
    ["Тип связующего", binder],
    ["Класс стойкости к мытью", wash],
    ["Степень блеска", gloss],
    ["База колеровки", base],
    ["Свойства", props.join(", ")],
    ["Плотность", "≈ 1.45 кг/л"],
    ["Время высыхания", "1–2 часа"],
    ["Разбавитель", "Вода"],
    ["Температура нанесения", "от +5 °C до +30 °C"],
    ["Хранение", "от +5 °C до +30 °C"],
    ["Срок годности", "24 месяца"],
  ];
}

const paintDocs = (name: string) => [
  { name: `Техническая карта ${name}`, url: "#", size: "PDF, 420 КБ" },
  { name: "Сертификат соответствия", url: "#", size: "PDF, 180 КБ" },
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "mipa-innenlatex",
    name: "MIPA Innenlatex",
    categorySlug: "dlya-sten-i-potolkov",
    brandSlug: "mipa",
    shortDescription: "Краска интерьерная акриловая матовая",
    description:
      "MIPA Innenlatex — водно-дисперсионная акриловая краска для стен и потолков в помещениях с нормальной и повышенной эксплуатационной нагрузкой. Образует глубоко матовое, устойчивое к мытью покрытие с высокой укрывистостью.\nНе содержит растворителей, почти без запаха, подходит для окраски обоев под покраску, штукатурки, гипсокартона и ранее окрашенных поверхностей. Колеруется в светлые и средние тона по каталогам RAL и NCS.",
    applicationInstructions:
      "Наносить кистью, валиком или распылителем при температуре от +5 °C до +30 °C. Межслойная сушка 1–2 часа. Основание предварительно загрунтовать.",
    article: "314527",
    coverageRate: 11,
    defaultLayers: 2,
    rating: 4.8,
    reviewsCount: 24,
    inStock: true,
    images: [
      "/images/products/bucket-green.jpg",
      "/images/categories/plaster.jpg",
      "/images/categories/tools.jpg",
      "/images/products/can-yellow.jpg",
    ],
    variants: [
      { volume: 0.9, unit: "л", price: 1250, sku: "MIP-IN-09", stock: 48 },
      { volume: 2.7, unit: "л", price: 1980, sku: "MIP-IN-27", stock: 36 },
      { volume: 9, unit: "л", price: 3980, sku: "MIP-IN-90", stock: 12 },
    ],
    characteristics: waterChars("Акриловое", "2-й класс (влажная уборка)", "Матовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("MIPA Innenlatex"),
    seoTitle: "MIPA Innenlatex — интерьерная акриловая краска | Маляр",
    seoDescription:
      "Краска MIPA Innenlatex для стен и потолков: матовое моющееся покрытие, расход 10–12 м²/л, фасовки 0.9, 2.7 и 9 л.",
  },
  {
    slug: "vika-interernaya",
    name: "VIKA Интерьерная",
    categorySlug: "dlya-sten-i-potolkov",
    brandSlug: "vika",
    shortDescription: "Краска акриловая для стен и потолков",
    description:
      "Универсальная акриловая краска для сухих помещений с нормальной нагрузкой. Ровное матовое покрытие, хорошая укрывистость в два слоя, быстро сохнет и не оставляет запаха.",
    applicationInstructions: "Наносить валиком или кистью в 2 слоя по загрунтованному основанию.",
    article: "VK-1102",
    coverageRate: 12,
    rating: 4.7,
    reviewsCount: 31,
    inStock: true,
    images: ["/images/products/can-red.jpg", "/images/categories/water-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 980, stock: 60 },
      { volume: 2.7, unit: "л", price: 2450, stock: 40 },
      { volume: 9, unit: "л", price: 6900, stock: 15 },
    ],
    characteristics: waterChars("Акриловое", "2-й класс (влажная уборка)", "Матовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("VIKA Интерьерная"),
  },
  {
    slug: "brulex-extra-matt",
    name: "BRÜLEX Extra Matt",
    categorySlug: "dlya-sten-i-potolkov",
    brandSlug: "brulex",
    shortDescription: "Краска латексная матовая",
    description:
      "Глубокоматовая латексная краска премиум-класса для стен и потолков. Скрывает мелкие дефекты основания, не бликует даже при боковом освещении, выдерживает влажную уборку.",
    applicationInstructions: "Наносить валиком с коротким ворсом в 2 слоя; не наносить при температуре ниже +5 °C.",
    article: "BRX-EM-77",
    coverageRate: 10,
    rating: 4.9,
    reviewsCount: 18,
    inStock: true,
    images: ["/images/products/bucket-teal.jpg", "/images/categories/water-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1850, stock: 25 },
      { volume: 2.7, unit: "л", price: 4600, stock: 18 },
      { volume: 9, unit: "л", price: 12800, stock: 6 },
    ],
    characteristics: waterChars("Латексное", "1-й класс (можно тереть щеткой)", "Глубокоматовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("BRÜLEX Extra Matt"),
  },
  {
    slug: "feidal-innenlatex-matt",
    name: "FEIDAL Innenlatex Matt",
    categorySlug: "dlya-vlazhnyh-pomescheniy",
    brandSlug: "feidal",
    shortDescription: "Краска для стен и потолков",
    description:
      "Влагостойкая интерьерная краска для помещений с повышенной влажностью: ванные, кухни, санузлы. Образует паропроницаемое покрытие, устойчивое к конденсату и частой уборке.",
    applicationInstructions: "Наносить в 2 слоя по загрунтованному основанию; в зонах конденсата — 3 слоя.",
    article: "FD-ILM-40",
    coverageRate: 11,
    rating: 4.6,
    reviewsCount: 16,
    inStock: true,
    images: ["/images/products/bucket-dark.jpg", "/images/categories/water-splash.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1420, stock: 30 },
      { volume: 2.7, unit: "л", price: 3600, stock: 22 },
      { volume: 9, unit: "л", price: 10200, stock: 8 },
    ],
    characteristics: waterChars("Акриловое", "1-й класс (можно тереть щеткой)", "Матовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("FEIDAL Innenlatex Matt"),
  },
  {
    slug: "luxens-interernaya",
    name: "LUXENS Интерьерная",
    categorySlug: "dlya-detskih-i-med-uchrezhdeniy",
    brandSlug: "luxens",
    shortDescription: "Краска водно-дисперсионная",
    description:
      "Безопасная водно-дисперсионная краска без запаха для детских комнат и учреждений. Сертифицирована для применения в детских и медицинских помещениях.",
    applicationInstructions: "Наносить валиком в 2 слоя; помещение можно эксплуатировать сразу после высыхания.",
    article: "LX-INT-15",
    coverageRate: 12,
    rating: 4.5,
    reviewsCount: 22,
    inStock: true,
    images: ["/images/products/bucket-blue.jpg", "/images/categories/water-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 890, stock: 70 },
      { volume: 2.7, unit: "л", price: 2200, stock: 45 },
      { volume: 9, unit: "л", price: 6100, stock: 20 },
    ],
    characteristics: waterChars("Акриловое", "2-й класс (влажная уборка)", "Матовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("LUXENS Интерьерная"),
  },
  {
    slug: "dulux-3d-white",
    name: "DULUX 3D White",
    categorySlug: "dlya-detskih-i-med-uchrezhdeniy",
    brandSlug: "dulux",
    shortDescription: "Краска для стен и потолков",
    description:
      "Белоснежная краска для стен и потолков с высокой укрывистостью. Не желтеет со временем, подходит для детских и медицинских учреждений, не содержит растворителей.",
    applicationInstructions: "Наносить в 2 слоя; для потолков использовать валик с средним ворсом.",
    article: "DX-3DW-88",
    coverageRate: 13,
    rating: 4.7,
    reviewsCount: 27,
    inStock: true,
    images: ["/images/products/bucket-blue.jpg", "/images/categories/tools.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1690, stock: 28 },
      { volume: 2.7, unit: "л", price: 4200, stock: 20 },
      { volume: 9, unit: "л", price: 11700, stock: 7 },
    ],
    characteristics: waterChars("Акриловое", "2-й класс (влажная уборка)", "Глубокоматовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("DULUX 3D White"),
  },
  {
    slug: "tikkurila-euro-power-7",
    name: "TIKKURILA Euro Power 7",
    categorySlug: "dlya-vlazhnyh-pomescheniy",
    brandSlug: "tikkurila",
    shortDescription: "Износостойкая краска",
    description:
      "Износостойкая моющаяся краска для помещений с высокой эксплуатационной нагрузкой: коридоры, лестницы, влажные помещения. Выдерживает интенсивную уборку с моющими средствами.",
    applicationInstructions: "Наносить в 2 слоя; полную стойкость к мытью покрытие набирает через 28 дней.",
    article: "TK-EP7-07",
    coverageRate: 10,
    rating: 4.9,
    reviewsCount: 35,
    inStock: true,
    images: ["/images/products/bucket-teal.jpg", "/images/categories/water-splash.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 2480, stock: 22 },
      { volume: 2.7, unit: "л", price: 6200, stock: 16 },
      { volume: 9, unit: "л", price: 17300, stock: 5 },
    ],
    characteristics: waterChars("Латексное", "1-й класс (можно тереть щеткой)", "Полуматовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("TIKKURILA Euro Power 7"),
  },
  {
    slug: "marshall-export-7",
    name: "MARSHALL Export 7",
    categorySlug: "dlya-sten-i-potolkov",
    brandSlug: "marshall",
    shortDescription: "Краска для стен и потолков",
    description:
      "Надёжная интерьерная краска для ремонта своими руками: легко наносится, не оставляет разводов, быстро сохнет. Оптимальна для больших площадей.",
    applicationInstructions: "Наносить валиком в 2 слоя с межслойной сушкой 1 час.",
    article: "MS-EX7-12",
    coverageRate: 12,
    rating: 4.6,
    reviewsCount: 21,
    inStock: true,
    images: ["/images/products/can-yellow.jpg", "/images/categories/water-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1180, stock: 44 },
      { volume: 2.7, unit: "л", price: 2950, stock: 30 },
      { volume: 9, unit: "л", price: 8200, stock: 10 },
    ],
    characteristics: waterChars("Акриловое", "2-й класс (влажная уборка)", "Матовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("MARSHALL Export 7"),
  },
  {
    slug: "jobi-mattlatex",
    name: "JOBI Mattlatex",
    categorySlug: "dlya-sten-i-potolkov",
    brandSlug: "jobi",
    shortDescription: "Краска интерьерная матовая",
    description:
      "Классическая матовая интерьерная краска для сухих помещений. Ровное покрытие без бликов, хорошая укрывистость и экономичный расход.",
    applicationInstructions: "Наносить валиком или кистью в 2 слоя по подготовленному основанию.",
    article: "JB-ML-33",
    coverageRate: 11,
    rating: 4.5,
    reviewsCount: 15,
    inStock: true,
    images: ["/images/products/bucket-green.jpg", "/images/categories/water-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1050, stock: 50 },
      { volume: 2.7, unit: "л", price: 2600, stock: 34 },
      { volume: 9, unit: "л", price: 7300, stock: 12 },
    ],
    characteristics: waterChars("Акриловое", "3-й класс (сухая протирка)", "Матовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("JOBI Mattlatex"),
  },
  {
    slug: "parade-professional",
    name: "PARADE Professional",
    categorySlug: "dlya-sten-i-potolkov",
    brandSlug: "parade",
    shortDescription: "Краска акриловая матовая",
    description:
      "Профессиональная акриловая краска для отделочных бригад: предсказуемое поведение при нанесении, минимальные брызги, стойкий матовый финиш.",
    applicationInstructions: "Наносить в 2 слоя; допускается безвоздушное распыление.",
    article: "PR-PRO-51",
    coverageRate: 11,
    rating: 4.6,
    reviewsCount: 19,
    inStock: true,
    images: ["/images/products/can-red.jpg", "/images/categories/tools.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1620, stock: 26 },
      { volume: 2.7, unit: "л", price: 4050, stock: 19 },
      { volume: 9, unit: "л", price: 11300, stock: 6 },
    ],
    characteristics: waterChars("Акриловое", "2-й класс (влажная уборка)", "Матовая"),
    compatibility: waterCompatibility,
    documents: paintDocs("PARADE Professional"),
  },
  {
    slug: "mipa-siliconharz-fassadenfarbe",
    name: "MIPA Siliconharz Fassadenfarbe",
    categorySlug: "fasadnye",
    brandSlug: "mipa",
    shortDescription: "Силиконовая фасадная краска",
    description:
      "Силиконовая фасадная краска для минеральных оснований: гидрофобная, паропроницаемая, стойкая к трещинам и высолам. Защищает фасад до 10 лет.",
    applicationInstructions: "Наносить в 2 слоя при температуре от +5 °C; основание обработать силиконовой грунтовкой.",
    article: "MIP-SHF-21",
    coverageRate: 10,
    rating: 4.8,
    reviewsCount: 14,
    inStock: true,
    images: ["/images/products/bucket-green.jpg", "/images/categories/metal-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 2150, stock: 18 },
      { volume: 2.7, unit: "л", price: 5400, stock: 12 },
      { volume: 9, unit: "л", price: 15100, stock: 4 },
    ],
    characteristics: waterChars("Силиконовое", "1-й класс (можно тереть щеткой)", "Матовая", "База A (белая)", facadeProps),
    compatibility: ["Бетон, штукатурка", "Кирпич, газобетон", "Силикатные основания", "Ранее окрашенные фасады"],
    documents: paintDocs("MIPA Siliconharz Fassadenfarbe"),
  },
  {
    slug: "mipa-fassaden-silikat",
    name: "MIPA Fassaden Silikat",
    categorySlug: "fasadnye",
    brandSlug: "mipa",
    shortDescription: "Силикатная фасадная краска",
    description:
      "Силикатная фасадная краска для минеральных оснований: химически связывается с основанием, не шелушится, обладает максимальной паропроницаемостью.",
    applicationInstructions: "Наносить в 2 слоя; не наносить на старые акриловые покрытия без удаления.",
    article: "MIP-FS-19",
    coverageRate: 9,
    rating: 4.7,
    reviewsCount: 11,
    inStock: true,
    images: ["/images/products/bucket-teal.jpg", "/images/categories/metal-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1890, stock: 16 },
      { volume: 2.7, unit: "л", price: 4700, stock: 10 },
      { volume: 9, unit: "л", price: 13200, stock: 3 },
    ],
    characteristics: waterChars("Силикатное", "2-й класс (влажная уборка)", "Матовая", "База A (белая)", facadeProps),
    compatibility: ["Бетон, штукатурка", "Кирпич, газобетон", "Силикатные основания"],
    documents: paintDocs("MIPA Fassaden Silikat"),
  },
  {
    slug: "vika-facade",
    name: "VIKA Facade",
    categorySlug: "fasadnye",
    brandSlug: "vika",
    shortDescription: "Фасадная акриловая краска",
    description:
      "Акриловая фасадная краска для бюджетных и капитальных фасадных работ: атмосферостойкая, стойкая к УФ, легко наносится.",
    applicationInstructions: "Наносить в 2 слоя по загрунтованному основанию при температуре от +5 °C.",
    article: "VK-FAC-08",
    coverageRate: 10,
    rating: 4.6,
    reviewsCount: 17,
    inStock: true,
    images: ["/images/products/can-red.jpg", "/images/categories/metal-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 1350, stock: 24 },
      { volume: 2.7, unit: "л", price: 3300, stock: 17 },
      { volume: 9, unit: "л", price: 9400, stock: 6 },
    ],
    characteristics: waterChars("Акриловое", "2-й класс (влажная уборка)", "Матовая", "База A (белая)", facadeProps),
    compatibility: ["Бетон, штукатурка", "Кирпич, газобетон", "Ранее окрашенные фасады"],
    documents: paintDocs("VIKA Facade"),
  },
  {
    slug: "mipa-silikonharzputz",
    name: "MIPA Silikonharzputz",
    categorySlug: "dekorativnye-shtukaturki",
    brandSlug: "mipa",
    shortDescription: "Декоративная силиконовая штукатурка",
    description:
      "Фактурная силиконовая штукатурка «короед» для интерьеров и фасадов. Гидрофобная, стойкая к истиранию и УФ, скрывает мелкие неровности основания.",
    applicationInstructions: "Наносить кельмой, структурировать тёркой через 15–20 минут. Расход зависит от фракции зерна.",
    article: "MIP-SHP-25",
    coverageRate: 2.5,
    defaultLayers: 1,
    rating: 4.8,
    reviewsCount: 12,
    inStock: true,
    images: ["/images/categories/plaster.jpg", "/images/products/bucket-dark.jpg"],
    variants: [
      { volume: 16, unit: "кг", price: 3900, stock: 40 },
      { volume: 25, unit: "кг", price: 5600, stock: 26 },
    ],
    characteristics: [
      ["Тип", "Силиконовая декоративная штукатурка"],
      ["Фактура", "Короед, зерно 2 мм"],
      ["Расход", "2.5–3 кг/м²"],
      ["Время высыхания", "24 часа"],
      ["Температура нанесения", "от +5 °C до +25 °C"],
    ],
    compatibility: ["Бетон, штукатурка", "Пенополистирол (мокрый фасад)", "Минеральные основания"],
    documents: paintDocs("MIPA Silikonharzputz"),
  },
  {
    slug: "grunt-emal-3v1",
    name: "Грунт-эмаль 3 в 1",
    categorySlug: "kraski-po-metallu",
    shortDescription: "Антикоррозийная по металлу",
    description:
      "Грунт-эмаль по металлу «3 в 1»: преобразователь ржавчины, грунт и финишное покрытие в одном составе. Наносится прямо на ржавчину до 100 мкм.",
    applicationInstructions: "Наносить в 2–3 слоя кистью, валиком или распылением по зачищенной поверхности.",
    article: "GE-3V1-05",
    coverageRate: 8,
    rating: 4.7,
    reviewsCount: 23,
    inStock: true,
    images: ["/images/products/can-yellow.jpg", "/images/categories/metal-paints.jpg"],
    variants: [
      { volume: 0.9, unit: "л", price: 690, stock: 55 },
      { volume: 2.7, unit: "л", price: 1750, stock: 32 },
      { volume: 9, unit: "л", price: 5200, stock: 9 },
    ],
    characteristics: [
      ["Назначение", "Чёрные металлы, ржавчина"],
      ["Степень блеска", "Полуглянцевая"],
      ["Время высыхания", "2 часа"],
      ["Разбавитель", "Ксилол, сольвент"],
    ],
    compatibility: ["Сталь чёрная и ржавая", "Чугун", "Грунтованные металлы"],
    documents: paintDocs("Грунт-эмаль 3 в 1"),
  },
  {
    slug: "brulex-2k-grunt",
    name: "BRÜLEX 2K Грунт",
    categorySlug: "kraski-po-metallu",
    brandSlug: "brulex",
    shortDescription: "акриловый",
    description:
      "Двухкомпонентный акриловый грунт для металлических поверхностей: высокая адгезия, быстрая сушка, отличная основа под эмали.",
    applicationInstructions: "Смешать с отвердителем 2:1, наносить в 1–2 слоя, межслойная сушка 15 минут.",
    article: "BRX-2KG-14",
    rating: 4.7,
    reviewsCount: 9,
    isPopular: true,
    inStock: true,
    images: ["/images/products/can-yellow.jpg", "/images/categories/metal-paints.jpg"],
    variants: [
      { volume: 1, unit: "л", price: 1450, stock: 30 },
      { volume: 5, unit: "л", price: 6400, stock: 8 },
    ],
    characteristics: [
      ["Тип", "Двухкомпонентный акриловый грунт"],
      ["Соотношение смешивания", "2:1 с отвердителем"],
      ["Время высыхания", "30 минут"],
    ],
    compatibility: ["Сталь", "Алюминий, оцинковка", "Старые ЛКП"],
  },
  {
    slug: "vika-2k-akrilovaya",
    name: "VIKA 2K АКРИЛОВАЯ",
    categorySlug: "kraski-po-metallu",
    brandSlug: "vika",
    shortDescription: "эмаль",
    description:
      "Двухкомпонентная акриловая эмаль для металла и техники: стойкая к сколам, бензостойкая, даёт глянцевое покрытие профессионального качества.",
    applicationInstructions: "Смешать с отвердителем, наносить распылением в 2 слоя.",
    article: "VK-2KA-20",
    rating: 4.6,
    reviewsCount: 13,
    isPopular: true,
    inStock: true,
    images: ["/images/products/can-red.jpg", "/images/categories/metal-paints.jpg"],
    variants: [
      { volume: 1, unit: "л", price: 1250, stock: 34 },
      { volume: 5, unit: "л", price: 5500, stock: 10 },
    ],
    characteristics: [
      ["Тип", "Двухкомпонентная акриловая эмаль"],
      ["Степень блеска", "Глянцевая"],
      ["Время высыхания", "40 минут"],
    ],
    compatibility: ["Сталь", "Алюминий, оцинковка", "Грунтованные металлы"],
  },
  {
    slug: "mipa-2k-hs-klarlack",
    name: "MIPA 2K-HS Klarlack",
    categorySlug: "grunty-i-laki",
    brandSlug: "mipa",
    shortDescription: "лак акриловый 2:1",
    description:
      "Двухкомпонентный HS-лак для финишной отделки: высокий сухой остаток, отличная розлив и стойкость к УФ и царапинам.",
    applicationInstructions: "Смешать с отвердителем 2:1, наносить в 1.5–2 слоя распылением.",
    article: "MIP-2KHS-30",
    rating: 4.8,
    reviewsCount: 8,
    isPopular: true,
    inStock: true,
    images: ["/images/products/bucket-green.jpg", "/images/products/can-yellow.jpg"],
    variants: [
      { volume: 1, unit: "л", price: 1980, stock: 20 },
      { volume: 5, unit: "л", price: 8900, stock: 6 },
    ],
    characteristics: [
      ["Тип", "Двухкомпонентный HS-лак"],
      ["Соотношение смешивания", "2:1 с отвердителем"],
      ["Степень блеска", "Глянцевая"],
    ],
  },
  {
    slug: "novakryl-590",
    name: "NOVAKRYL 590",
    categorySlug: "grunty-i-laki",
    brandSlug: "novakryl",
    shortDescription: "грунт акриловый 4:1",
    description:
      "Акриловый грунт глубокого проникновения для подготовки минеральных и деревянных оснований под окраску.",
    applicationInstructions: "Наносить в 1 слой кистью или валиком; время высыхания 2 часа.",
    article: "NV-590-41",
    rating: 4.5,
    reviewsCount: 7,
    isPopular: true,
    inStock: true,
    images: ["/images/products/bucket-teal.jpg", "/images/categories/water-paints.jpg"],
    variants: [
      { volume: 1, unit: "л", price: 950, stock: 42 },
      { volume: 5, unit: "л", price: 4200, stock: 14 },
    ],
    characteristics: [
      ["Тип", "Акриловый грунт 4:1"],
      ["Расход", "8–10 м²/л"],
      ["Время высыхания", "2 часа"],
    ],
  },
  {
    slug: "valik-poliamidnyy",
    name: "Валик полиамидный для водных красок",
    categorySlug: "malyarnyy-instrument",
    shortDescription: "Ворс 12 мм, ширина 180 мм",
    description:
      "Полиамидный валик с ворсом 12 мм для нанесения водно-дисперсионных красок на ровные и слегка фактурные поверхности. Не оставляет ворсинок.",
    article: "INST-VP-18",
    rating: 4.6,
    reviewsCount: 19,
    inStock: true,
    images: ["/images/categories/tools.jpg"],
    variants: [{ volume: 1, unit: "шт", price: 320, stock: 120 }],
    characteristics: [
      ["Материал шубки", "Полиамид"],
      ["Длина ворса", "12 мм"],
      ["Ширина", "180 мм"],
      ["Бюгель", "6 мм"],
    ],
  },
  {
    slug: "mirka-abranet-p120",
    name: "MIRKA ABRANET P120",
    categorySlug: "malyarnyy-instrument",
    brandSlug: "mirka",
    shortDescription: "абразивная сетка",
    description:
      "Сетчатый абразив для беспыльного шлифования шпаклёвки и грунтов перед окраской. Ресурс в 3–4 раза выше обычной наждачной бумаги.",
    article: "MIR-AB-120",
    rating: 4.9,
    reviewsCount: 26,
    isPopular: true,
    inStock: true,
    images: ["/images/products/abrasive-disc.jpg", "/images/categories/tools.jpg"],
    variants: [{ volume: 1, unit: "шт", price: 75, stock: 400 }],
    characteristics: [
      ["Зерно", "P120"],
      ["Форма", "Сетка 180×260 мм"],
      ["Назначение", "Шпаклёвка, грунт, дерево"],
    ],
  },
];
