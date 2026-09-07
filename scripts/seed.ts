import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema.ts";
import { seedBrands, seedCategories, seedProducts } from "../src/data/products.ts";
import { casesData, featuredCases } from "../src/data/cases.ts";
import { seedReviews as reviewsData } from "../src/data/reviews.ts";
import { solutionAudiences, solutionsData } from "../src/data/solutions.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL не задан. Запускайте seed через: npm run db:seed");
}

const client = postgres(connectionString, { max: 1 });
const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

const {
  categories,
  brands,
  products,
  productVariants,
  productImages,
  productCharacteristics,
  categoryFilters,
  cases,
  caseImages,
  caseMaterials,
  caseSteps,
  reviews,
  solutions,
  solutionMaterials,
  solutionSteps,
  solutionAudiences: solutionAudiencesTable,
} = schema;

const filterGroups: {
  name: string;
  key: string;
  type: string;
  values: string[];
}[] = [
  {
    name: "Тип связующего",
    key: "binder",
    type: "checkbox",
    values: ["Акриловые", "Латексные", "Силиконовые", "Силикатные"],
  },
  {
    name: "Класс стойкости к мытью",
    key: "wash",
    type: "checkbox",
    values: [
      "1-й класс (можно тереть щеткой)",
      "2-й класс (влажная уборка)",
      "3-й класс (сухая протирка)",
    ],
  },
  {
    name: "Степень блеска",
    key: "gloss",
    type: "checkbox",
    values: ["Глубокоматовая", "Матовая", "Полуматовая", "Полуглянцевая"],
  },
  {
    name: "Свойства",
    key: "properties",
    type: "checkbox",
    values: ["Моющаяся", "Влагостойкая", "Стойкая к УФ", "Без запаха"],
  },
  {
    name: "База колеровки",
    key: "colorBase",
    type: "checkbox",
    values: ["Белая (база A)", "Прозрачная (база C)"],
  },
  {
    name: "Объем / Вес тары",
    key: "volume",
    type: "checkbox",
    values: ["0.9 л", "2.7 л", "9 л", "25 кг"],
  },
];

async function seedCatalog(tx: PostgresJsDatabase<typeof schema>) {
  const categoryIdBySlug = new Map<string, number>();

  for (const c of seedCategories.filter((x) => !x.parentSlug)) {
    const [row] = await tx
      .insert(categories)
      .values({
        slug: c.slug,
        name: c.name,
        parentId: null,
        description: c.description,
        image: c.image ?? null,
        order: c.order,
        seoTitle: c.seoTitle ?? null,
        seoDescription: c.seoDescription ?? null,
      })
      .returning({ id: categories.id });
    categoryIdBySlug.set(c.slug, row.id);
  }

  for (const c of seedCategories.filter((x) => x.parentSlug)) {
    const [row] = await tx
      .insert(categories)
      .values({
        slug: c.slug,
        name: c.name,
        parentId: categoryIdBySlug.get(c.parentSlug!) ?? null,
        description: c.description,
        image: c.image ?? null,
        order: c.order,
        seoTitle: c.seoTitle ?? null,
        seoDescription: c.seoDescription ?? null,
      })
      .returning({ id: categories.id });
    categoryIdBySlug.set(c.slug, row.id);
  }

  const brandIdBySlug = new Map<string, number>();
  for (const b of seedBrands) {
    const [row] = await tx
      .insert(brands)
      .values({
        slug: b.slug,
        name: b.name,
        description: b.description ?? null,
        order: b.order,
      })
      .returning({ id: brands.id });
    brandIdBySlug.set(b.slug, row.id);
  }

  const productIdBySlug = new Map<string, number>();
  const productIdByName = new Map<string, number>();

  for (const p of seedProducts) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Категория не найдена: ${p.categorySlug}`);

    const [row] = await tx
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        categoryId,
        brandId: p.brandSlug ? (brandIdBySlug.get(p.brandSlug) ?? null) : null,
        description: p.description,
        shortDescription: p.shortDescription,
        article: p.article ?? null,
        applicationInstructions: p.applicationInstructions ?? null,
        compatibility: p.compatibility ? p.compatibility.join("\n") : null,
        videoUrl: null,
        documents: p.documents ?? null,
        coverageRate: p.coverageRate ?? null,
        defaultLayers: p.defaultLayers ?? 2,
        seoTitle: p.seoTitle ?? `${p.name} — купить в Москве | Маляр`,
        seoDescription: p.seoDescription ?? p.shortDescription,
        inStock: p.inStock ?? true,
        isPopular: p.isPopular ?? false,
        rating: p.rating ?? 0,
        reviewsCount: p.reviewsCount ?? 0,
      })
      .returning({ id: products.id });

    productIdBySlug.set(p.slug, row.id);
    productIdByName.set(p.name.toLowerCase(), row.id);

    for (const v of p.variants) {
      await tx.insert(productVariants).values({
        productId: row.id,
        packagingVolume: v.volume,
        packagingUnit: v.unit,
        price: v.price,
        oldPrice: v.oldPrice ?? null,
        sku: v.sku ?? null,
        stock: v.stock ?? 0,
      });
    }

    for (let i = 0; i < p.images.length; i++) {
      await tx.insert(productImages).values({
        productId: row.id,
        url: p.images[i],
        alt: `${p.name} — фото ${i + 1}`,
        order: i,
        isMain: i === 0,
      });
    }

    for (let i = 0; i < (p.characteristics?.length ?? 0); i++) {
      const [key, value] = p.characteristics![i];
      await tx.insert(productCharacteristics).values({
        productId: row.id,
        key,
        value,
        order: i,
      });
    }
  }

  const waterCategoryId = categoryIdBySlug.get("vodnye-kraski");
  if (waterCategoryId) {
    for (let i = 0; i < filterGroups.length; i++) {
      const g = filterGroups[i];
      await tx.insert(categoryFilters).values({
        categoryId: waterCategoryId,
        filterName: g.name,
        filterKey: g.key,
        filterType: g.type,
        filterValues: g.values,
        order: i,
      });
    }
  }

  return { categoryIdBySlug, productIdBySlug, productIdByName };
}

async function seedCases(
  tx: PostgresJsDatabase<typeof schema>,
  productIdByName: Map<string, number>,
) {
  const allCases = [...casesData, ...featuredCases];

  for (let i = 0; i < allCases.length; i++) {
    const c = allCases[i];
    const [row] = await tx
      .insert(cases)
      .values({
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        category: c.category,
        description: c.task,
        task: c.task,
        results: c.results,
        area: c.area,
        duration: c.duration,
        year: c.year,
        workType: c.workType,
        tag: c.tag ?? c.categoryName,
        savings: c.savings,
        savingsNote: c.savingsNote,
        serviceLife: c.serviceLife,
        serviceLifeNote: c.serviceLifeNote,
        mainImage: c.image,
        seoTitle: `${c.title} — кейс | Маляр`,
        seoDescription: `${c.subtitle}. Площадь ${c.area}, срок ${c.duration}.`,
        published: true,
        featured: c.featured ?? false,
        order: i,
      })
      .returning({ id: cases.id });

    for (const m of c.materials) {
      await tx.insert(caseMaterials).values({
        caseId: row.id,
        productId: productIdByName.get(m.name.toLowerCase()) ?? null,
        name: m.name,
        description: m.description,
        volume: m.volume,
        image: m.image,
      });
    }

    for (let s = 0; s < c.steps.length; s++) {
      await tx.insert(caseSteps).values({
        caseId: row.id,
        stepNumber: s + 1,
        title: c.steps[s].title,
        description: c.steps[s].description,
      });
    }

    await tx.insert(caseImages).values({
      caseId: row.id,
      url: c.image,
      type: "result",
      caption: c.title,
      order: 0,
    });
  }
}

async function seedReviews(tx: PostgresJsDatabase<typeof schema>) {
  for (let i = 0; i < reviewsData.length; i++) {
    const r = reviewsData[i];
    await tx.insert(reviews).values({
      slug: r.slug,
      title: r.title,
      type: r.type,
      embedUrl: r.embedUrl ?? null,
      thumbnail: r.thumbnail,
      description: r.description,
      duration: r.duration ?? null,
      views: r.views,
      date: new Date(r.dateIso),
      category: r.category ?? null,
      published: true,
      featured: r.featured ?? false,
      order: i,
    });
  }
}

async function seedSolutions(
  tx: PostgresJsDatabase<typeof schema>,
  productIdByName: Map<string, number>,
) {
  for (let i = 0; i < solutionAudiences.length; i++) {
    const a = solutionAudiences[i];
    await tx.insert(solutionAudiencesTable).values({
      slug: a.id,
      title: a.title,
      description: a.description,
      image: a.image,
      icon: a.icon,
      order: i,
    });
  }

  for (let i = 0; i < solutionsData.length; i++) {
    const s = solutionsData[i];
    const [row] = await tx
      .insert(solutions)
      .values({
        slug: s.slug,
        title: s.title,
        segment: s.audienceId,
        description: s.description,
        features: s.features,
        task: s.task,
        taskPoints: s.taskPoints,
        advantages: s.advantages,
        image: s.image,
        seoTitle: `${s.title} — готовое решение | Маляр`,
        seoDescription: s.description.slice(0, 200),
        published: true,
        order: i,
      })
      .returning({ id: solutions.id });

    for (const m of s.materials) {
      await tx.insert(solutionMaterials).values({
        solutionId: row.id,
        productId: productIdByName.get(m.name.toLowerCase()) ?? null,
        name: m.name,
        image: m.image,
        description: m.description,
        price: m.price,
      });
    }

    for (let n = 0; n < s.steps.length; n++) {
      await tx.insert(solutionSteps).values({
        solutionId: row.id,
        stepNumber: n + 1,
        title: s.steps[n].title,
        description: s.steps[n].description,
      });
    }
  }
}

async function seedContentBlocks(tx: PostgresJsDatabase<typeof schema>) {
  await tx
    .insert(schema.contentBlocks)
    .values([
      {
        key: "home_banner",
        title: "Скидка 15% на первый заказ",
        text: "Используйте промокод МАЛЯР15 при оформлении заказа. Акция действует на весь ассортимент каталога.",
        published: true,
        order: 0,
      },
    ])
    .onConflictDoNothing();
}

async function wipe(tx: PostgresJsDatabase<typeof schema>) {
  await tx.delete(solutionSteps);
  await tx.delete(solutionMaterials);
  await tx.delete(solutions);
  await tx.delete(solutionAudiencesTable);
  await tx.delete(caseSteps);
  await tx.delete(caseMaterials);
  await tx.delete(caseImages);
  await tx.delete(cases);
  await tx.delete(reviews);
  await tx.delete(productCharacteristics);
  await tx.delete(productImages);
  await tx.delete(productVariants);
  await tx.delete(products);
  await tx.delete(categoryFilters);
  await tx.delete(brands);
  await tx.delete(categories);
}

async function main() {
  console.log("Очистка контентных таблиц…");
  await db.transaction(wipe);

  console.log("Каталог: категории, бренды, товары…");
  const { productIdByName } = await db.transaction(seedCatalog);

  console.log("Кейсы…");
  await db.transaction((tx) => seedCases(tx, productIdByName));

  console.log("Отзывы и видеообзоры…");
  await db.transaction(seedReviews);

  console.log("Решения по сегментам…");
  await db.transaction((tx) => seedSolutions(tx, productIdByName));

  console.log("Контент-блоки…");
  await db.transaction(seedContentBlocks);

  console.log("Готово.");
  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  await client.end();
  process.exit(1);
});
