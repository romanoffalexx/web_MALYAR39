import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import * as t from "@/db/schema";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings";

const CATEGORY_NAMES: Record<string, string> = {
  residential: "Жилые объекты",
  commercial: "Коммерческие объекты",
  industrial: "Промышленные объекты",
  municipal: "Муниципальные объекты",
};

const MONTHS_GEN = [
  "янв.", "февр.", "мар.", "апр.", "мая", "июня",
  "июля", "авг.", "сен.", "окт.", "ноя.", "дек.",
];

export interface VariantView {
  id: number;
  volume: number;
  unit: string;
  price: number;
  oldPrice: number | null;
  sku: string | null;
  stock: number;
}

export interface CardProduct {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  brand: string | null;
  image: string | null;
  priceFrom: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isPopular: boolean;
  variants: VariantView[];
}

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  brandName: string | null;
  image: string | null;
  priceFrom: number | null;
  rating: number | null;
  reviewsCount: number | null;
  inStock: boolean | null;
  isPopular: boolean | null;
}

const CARD_COLUMNS = {
  id: t.products.id,
  slug: t.products.slug,
  name: t.products.name,
  shortDescription: t.products.shortDescription,
  brandName: t.brands.name,
  image: sql<string | null>`(SELECT pi.url FROM product_images pi WHERE pi.product_id = ${t.products.id} AND pi.is_main ORDER BY pi."order" LIMIT 1)`,
  priceFrom: sql<number | null>`(SELECT min(pv.price) FROM product_variants pv WHERE pv.product_id = ${t.products.id})`,
  rating: t.products.rating,
  reviewsCount: t.products.reviewsCount,
  inStock: t.products.inStock,
  isPopular: t.products.isPopular,
};

async function loadVariants(productIds: number[]): Promise<Map<number, VariantView[]>> {
  const map = new Map<number, VariantView[]>();
  if (productIds.length === 0) return map;

  const rows = await db
    .select({
      productId: t.productVariants.productId,
      id: t.productVariants.id,
      volume: t.productVariants.packagingVolume,
      unit: t.productVariants.packagingUnit,
      price: t.productVariants.price,
      oldPrice: t.productVariants.oldPrice,
      sku: t.productVariants.sku,
      stock: t.productVariants.stock,
    })
    .from(t.productVariants)
    .where(inArray(t.productVariants.productId, productIds))
    .orderBy(asc(t.productVariants.packagingVolume));

  for (const r of rows) {
    const list = map.get(r.productId) ?? [];
    list.push({
      id: r.id,
      volume: r.volume,
      unit: r.unit,
      price: r.price,
      oldPrice: r.oldPrice,
      sku: r.sku,
      stock: r.stock ?? 0,
    });
    map.set(r.productId, list);
  }
  return map;
}

function toCardProduct(row: ProductRow, variants: VariantView[]): CardProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.shortDescription,
    brand: row.brandName,
    image: row.image,
    priceFrom: row.priceFrom ?? 0,
    rating: row.rating ?? 0,
    reviewsCount: row.reviewsCount ?? 0,
    inStock: row.inStock ?? false,
    isPopular: row.isPopular ?? false,
    variants,
  };
}

/* ─── Главная ─────────────────────────────────────────── */

export interface HomeCategory {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
}

export async function getHomeCategories(limit = 4): Promise<HomeCategory[]> {
  const rows = await db
    .select({
      slug: t.categories.slug,
      name: t.categories.name,
      description: t.categories.description,
      image: t.categories.image,
    })
    .from(t.categories)
    .where(sql`${t.categories.parentId} IS NULL`)
    .orderBy(asc(t.categories.order))
    .limit(limit);
  return rows;
}

export async function getPopularProducts(limit = 5): Promise<CardProduct[]> {
  const rows = await db
    .select(CARD_COLUMNS)
    .from(t.products)
    .leftJoin(t.brands, eq(t.products.brandId, t.brands.id))
    .where(eq(t.products.isPopular, true))
    .orderBy(desc(t.products.rating), asc(t.products.id))
    .limit(limit) as unknown as ProductRow[];

  const variants = await loadVariants(rows.map((r) => r.id));
  return rows.map((r) => toCardProduct(r, variants.get(r.id) ?? []));
}

export interface HomeCase {
  slug: string;
  title: string;
  description: string | null;
  materials: string | null;
  economy: string | null;
  image: string | null;
  tag: string | null;
}

export async function getFeaturedCases(limit = 3): Promise<HomeCase[]> {
  const rows = await db
    .select({
      slug: t.cases.slug,
      title: t.cases.title,
      description: t.cases.description,
      materials: t.cases.workType,
      economy: t.cases.savings,
      image: t.cases.mainImage,
      tag: t.cases.tag,
    })
    .from(t.cases)
    .where(and(eq(t.cases.published, true), eq(t.cases.featured, true)))
    .orderBy(asc(t.cases.order))
    .limit(limit);
  return rows;
}

export interface HomeVideo {
  slug: string;
  title: string;
  duration: string | null;
  image: string | null;
}

export async function getFeaturedVideos(limit = 5): Promise<HomeVideo[]> {
  const rows = await db
    .select({
      slug: t.reviews.slug,
      title: t.reviews.title,
      duration: t.reviews.duration,
      image: t.reviews.thumbnail,
    })
    .from(t.reviews)
    .where(
      and(
        eq(t.reviews.published, true),
        eq(t.reviews.featured, true),
        eq(t.reviews.type, "video"),
      ),
    )
    .orderBy(asc(t.reviews.order))
    .limit(limit);
  return rows;
}

/* ─── Каталог ─────────────────────────────────────────── */

export type CatalogSort = "popular" | "price-asc" | "price-desc" | "rating" | "new";

export interface CatalogFilterInput {
  categorySlug?: string;
  subcategory?: string;
  filters?: Record<string, string[]>;
  priceMin?: number;
  priceMax?: number;
  sort?: CatalogSort;
  page?: number;
  perPage?: number;
  search?: string;
}

export interface CatalogProduct extends CardProduct {}

export interface FacetValue {
  label: string;
  count: number;
}

export interface Facet {
  key: string;
  name: string;
  values: FacetValue[];
}

export interface SubcategoryTab {
  slug: string;
  name: string;
  count: number;
}

export interface CatalogCategory {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  parentId: number | null;
}

export interface CatalogData {
  category: CatalogCategory | null;
  subcategories: SubcategoryTab[];
  categoryTotal: number;
  products: CatalogProduct[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
  facets: Facet[];
  priceBounds: { min: number; max: number };
}

const FILTER_CHARACTERISTIC: Record<string, string> = {
  binder: "Тип связующего",
  wash: "Класс стойкости к мытью",
  gloss: "Степень блеска",
  colorBase: "База колеровки",
};

const BINDER_VALUES: Record<string, string> = {
  Акриловые: "Акриловое",
  Латексные: "Латексное",
  Силиконовые: "Силиконовое",
  Силикатные: "Силикатное",
};

const BASE_VALUES: Record<string, string> = {
  "Белая (база A)": "База A (белая)",
  "Прозрачная (база C)": "База C (прозрачная)",
};

function categoryScope(slug?: string) {
  if (!slug) return sql`TRUE`;
  return sql`(c.slug = ${slug} OR c.parent_id = (SELECT id FROM categories WHERE slug = ${slug}))`;
}

const CATALOG_FROM = sql`
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN brands b ON b.id = p.brand_id
  LEFT JOIN LATERAL (
    SELECT min(pv.price) AS min_price FROM product_variants pv WHERE pv.product_id = p.id
  ) pv_min ON TRUE
`;

function searchScope(query?: string) {
  if (!query) return sql`TRUE`;
  const like = `%${query}%`;
  return sql`(p.name ILIKE ${like} OR p.short_description ILIKE ${like} OR p.article ILIKE ${like})`;
}

/** Условия по характеристикам: каждая группа фильтров — отдельный EXISTS, значения внутри группы объединяются OR. */
function characteristicScopes(filters: Record<string, string[]> = {}) {
  const scopes: ReturnType<typeof sql>[] = [];

  for (const [key, labels] of Object.entries(filters)) {
    if (!labels.length) continue;

    if (key === "properties") {
      const patterns = labels.map((l) => `%${l}%`);
      scopes.push(
        sql`EXISTS (
          SELECT 1 FROM product_characteristics pc
          WHERE pc.product_id = p.id AND pc.key = 'Свойства'
            AND (${sql.join(
              patterns.map((pt) => sql`pc.value ILIKE ${pt}`),
              sql` OR `,
            )})
        )`,
      );
      continue;
    }

    if (key === "volume") {
      const parsed = labels
        .map((l) => {
          const m = l.match(/^([\d.,]+)\s*(.+)$/);
          return m ? { volume: Number(m[1].replace(",", ".")), unit: m[2].trim() } : null;
        })
        .filter(Boolean) as { volume: number; unit: string }[];
      if (!parsed.length) continue;
      scopes.push(
        sql`EXISTS (
          SELECT 1 FROM product_variants pv
          WHERE pv.product_id = p.id AND (${sql.join(
            parsed.map((v) => sql`(pv.packaging_volume = ${v.volume} AND pv.packaging_unit = ${v.unit})`),
            sql` OR `,
          )})
        )`,
      );
      continue;
    }

    const charKey = FILTER_CHARACTERISTIC[key];
    if (!charKey) continue;

    const map = key === "binder" ? BINDER_VALUES : key === "colorBase" ? BASE_VALUES : null;
    const values = labels.map((l) => (map && map[l] ? map[l] : l));
    scopes.push(
      sql`EXISTS (
        SELECT 1 FROM product_characteristics pc
        WHERE pc.product_id = p.id AND pc.key = ${charKey}
          AND pc.value IN (${sql.join(
            values.map((v) => sql`${v}`),
            sql`, `,
          )})
      )`,
    );
  }

  return scopes;
}

function sortClause(sort: CatalogSort) {
  switch (sort) {
    case "price-asc":
      return sql`pv_min.min_price ASC NULLS LAST`;
    case "price-desc":
      return sql`pv_min.min_price DESC NULLS LAST`;
    case "rating":
      return sql`p.rating DESC, p.reviews_count DESC`;
    case "new":
      return sql`p.created_at DESC`;
    default:
      return sql`p.is_popular DESC, p.rating DESC, p.id ASC`;
  }
}

export async function getCatalogData(input: CatalogFilterInput = {}): Promise<CatalogData> {
  const {
    categorySlug,
    subcategory,
    filters,
    priceMin,
    priceMax,
    sort = "popular",
    page = 1,
    perPage = 12,
    search,
  } = input;

  const activeCategory =
    subcategory && subcategory !== "all" ? subcategory : categorySlug;

  const conditions = [
    categoryScope(activeCategory),
    searchScope(search),
    ...characteristicScopes(filters),
  ];
  if (priceMin !== undefined) conditions.push(sql`pv_min.min_price >= ${priceMin}`);
  if (priceMax !== undefined) conditions.push(sql`pv_min.min_price <= ${priceMax}`);
  const where = sql`WHERE ${sql.join(conditions, sql` AND `)}`;

  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * perPage;

  const [totalRows, productRows, category, subcategoryData, facets, priceBounds] =
    await Promise.all([
      db.execute(sql`SELECT count(*)::int AS n ${CATALOG_FROM} ${where}`),
      db.execute(sql`
        SELECT p.id, p.slug, p.name, p.short_description AS "shortDescription",
               b.name AS "brandName",
               (SELECT pi.url FROM product_images pi
                 WHERE pi.product_id = p.id AND pi.is_main
                 ORDER BY pi."order" LIMIT 1) AS image,
               pv_min.min_price AS "priceFrom",
               p.rating, p.reviews_count AS "reviewsCount",
               p.in_stock AS "inStock", p.is_popular AS "isPopular"
        ${CATALOG_FROM} ${where}
        ORDER BY ${sortClause(sort)}
        LIMIT ${perPage} OFFSET ${offset}
      `),
      loadCategory(categorySlug),
      loadSubcategories(categorySlug),
      loadFacets(activeCategory, search),
      loadPriceBounds(activeCategory, search),
    ]);

  const rows = rowsOf<ProductRow>(productRows);
  const variants = await loadVariants(rows.map((r) => r.id));
  const products = rows.map((r) => toCardProduct(r, variants.get(r.id) ?? []));
  const total = Number(rowsOf<{ n: number }>(totalRows)[0]?.n ?? 0);

  return {
    category,
    subcategories: subcategoryData.items,
    categoryTotal: subcategoryData.total,
    products,
    total,
    page: currentPage,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
    facets,
    priceBounds,
  };
}

export interface CategoryNode extends CatalogCategory {
  parentSlug: string | null;
  parentName: string | null;
}

export async function getCategory(slug: string): Promise<CategoryNode | null> {
  const rows = await db
    .select({
      slug: t.categories.slug,
      name: t.categories.name,
      description: t.categories.description,
      image: t.categories.image,
      seoTitle: t.categories.seoTitle,
      seoDescription: t.categories.seoDescription,
      parentId: t.categories.parentId,
      parentSlug: sql<string | null>`(SELECT pc.slug FROM categories pc WHERE pc.id = ${t.categories.parentId})`,
      parentName: sql<string | null>`(SELECT pc.name FROM categories pc WHERE pc.id = ${t.categories.parentId})`,
    })
    .from(t.categories)
    .where(eq(t.categories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

async function loadCategory(slug?: string): Promise<CatalogCategory | null> {
  if (!slug) return null;
  const rows = await db
    .select({
      slug: t.categories.slug,
      name: t.categories.name,
      description: t.categories.description,
      image: t.categories.image,
      seoTitle: t.categories.seoTitle,
      seoDescription: t.categories.seoDescription,
      parentId: t.categories.parentId,
    })
    .from(t.categories)
    .where(eq(t.categories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

async function loadSubcategories(
  categorySlug?: string,
): Promise<{ total: number; items: SubcategoryTab[] }> {
  if (!categorySlug) return { total: 0, items: [] };

  const rows = await db.execute<{ slug: string; name: string; n: number }>(sql`
    SELECT 'all' AS slug, 'Все товары' AS name, -1 AS ord, count(p.id)::int AS n
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE ${categoryScope(categorySlug)}
    UNION ALL
    SELECT c.slug, c.name, c."order" AS ord, count(p.id)::int AS n
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    WHERE c.parent_id = (SELECT id FROM categories WHERE slug = ${categorySlug})
    GROUP BY c.slug, c.name, c."order"
    ORDER BY ord
  `);

  const all = rowsOf<{ slug: string; name: string; n: number }>(rows);
  return {
    total: Number(all[0]?.n ?? 0),
    items: all.slice(1).map((r) => ({ slug: r.slug, name: r.name, count: Number(r.n) })),
  };
}

async function loadFacets(categorySlug?: string, search?: string): Promise<Facet[]> {
  const scope = sql`${categoryScope(categorySlug)} AND ${searchScope(search)}`;
  const rows = await db.execute<{ kind: string; value: string; n: number }>(sql`
    SELECT pc.key AS kind, pc.value AS value, count(DISTINCT pc.product_id)::int AS n
    FROM product_characteristics pc
    JOIN products p ON p.id = pc.product_id
    JOIN categories c ON c.id = p.category_id
    WHERE ${scope}
      AND pc.key IN ('Тип связующего', 'Класс стойкости к мытью', 'Степень блеска', 'База колеровки')
    GROUP BY pc.key, pc.value
    UNION ALL
    SELECT 'Свойства' AS kind, btrim(prop.value) AS value, count(DISTINCT pc.product_id)::int AS n
    FROM product_characteristics pc
    JOIN products p ON p.id = pc.product_id
    JOIN categories c ON c.id = p.category_id
    CROSS JOIN LATERAL unnest(string_to_array(pc.value, ',')) AS prop(value)
    WHERE ${scope} AND pc.key = 'Свойства'
    GROUP BY btrim(prop.value)
    UNION ALL
    SELECT 'volume' AS kind, pv.packaging_volume || ' ' || pv.packaging_unit AS value,
           count(DISTINCT pv.product_id)::int AS n
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    JOIN categories c ON c.id = p.category_id
    WHERE ${scope}
    GROUP BY pv.packaging_volume, pv.packaging_unit
  `);

  const counts = new Map<string, Map<string, number>>();
  for (const r of rowsOf<{ kind: string; value: string; n: number }>(rows)) {
    const bucket = counts.get(r.kind) ?? new Map<string, number>();
    bucket.set(r.value, Number(r.n));
    counts.set(r.kind, bucket);
  }

  const defs = await db
    .select({
      categoryId: t.categoryFilters.categoryId,
      filterKey: t.categoryFilters.filterKey,
      filterName: t.categoryFilters.filterName,
      filterValues: t.categoryFilters.filterValues,
      order: t.categoryFilters.order,
    })
    .from(t.categoryFilters)
    .orderBy(asc(t.categoryFilters.order));

  const rootId = categorySlug
    ? await db
        .select({ id: t.categories.id, parentId: t.categories.parentId })
        .from(t.categories)
        .where(eq(t.categories.slug, categorySlug))
        .limit(1)
    : [];
  const filterCategoryId = rootId[0]?.parentId ?? rootId[0]?.id ?? null;

  return defs
    .filter((d) => !filterCategoryId || d.categoryId === filterCategoryId)
    .map((d) => {
      const kind =
        d.filterKey === "volume"
          ? "volume"
          : d.filterKey === "properties"
            ? "Свойства"
            : FILTER_CHARACTERISTIC[d.filterKey] ?? d.filterKey;
      const bucket = counts.get(kind) ?? new Map<string, number>();
      return {
        key: d.filterKey,
        name: d.filterName,
        values: (d.filterValues ?? []).map((label) => {
          const valueKey =
            d.filterKey === "binder"
              ? BINDER_VALUES[label] ?? label
              : d.filterKey === "colorBase"
                ? BASE_VALUES[label] ?? label
                : label;
          return { label, count: bucket.get(valueKey) ?? 0 };
        }),
      };
    });
}

async function loadPriceBounds(
  categorySlug?: string,
  search?: string,
): Promise<{ min: number; max: number }> {
  const rows = await db.execute<{ min: number | null; max: number | null }>(sql`
    SELECT min(x.min_price)::int AS min, max(x.min_price)::int AS max
    FROM (
      SELECT min(pv.price) AS min_price
      FROM products p
      JOIN categories c ON c.id = p.category_id
      JOIN product_variants pv ON pv.product_id = p.id
      WHERE ${categoryScope(categorySlug)} AND ${searchScope(search)}
      GROUP BY p.id
    ) x
  `);
  const r = rowsOf<{ min: number | null; max: number | null }>(rows)[0];
  return { min: Number(r?.min ?? 0), max: Number(r?.max ?? 0) };
}

/* ─── Карточка товара ─────────────────────────────────── */

export interface ProductView {
  id: number;
  slug: string;
  name: string;
  subtitle: string | null;
  brand: string | null;
  brandSlug: string | null;
  article: string | null;
  rating: number;
  reviewsCount: number;
  hit: boolean;
  inStock: boolean;
  coverageRate: number | null;
  defaultLayers: number;
  priceFrom: number;
  images: string[];
  variants: VariantView[];
  characteristics: { key: string; value: string }[];
  compatibility: string[];
  documents: { name: string; url: string; size?: string }[];
  description: string | null;
  applicationInstructions: string | null;
  videoUrl: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  parentCategorySlug: string | null;
  parentCategoryName: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export async function getProduct(slug: string): Promise<ProductView | null> {
  const rows = await db
    .select({
      id: t.products.id,
      slug: t.products.slug,
      name: t.products.name,
      subtitle: t.products.shortDescription,
      brand: t.brands.name,
      brandSlug: t.brands.slug,
      article: t.products.article,
      rating: t.products.rating,
      reviewsCount: t.products.reviewsCount,
      hit: t.products.isPopular,
      inStock: t.products.inStock,
      coverageRate: t.products.coverageRate,
      defaultLayers: t.products.defaultLayers,
      description: t.products.description,
      applicationInstructions: t.products.applicationInstructions,
      compatibility: t.products.compatibility,
      videoUrl: t.products.videoUrl,
      documents: t.products.documents,
      seoTitle: t.products.seoTitle,
      seoDescription: t.products.seoDescription,
      categorySlug: t.categories.slug,
      categoryName: t.categories.name,
      parentCategorySlug: sql<string | null>`(SELECT pc.slug FROM categories pc WHERE pc.id = ${t.categories.parentId})`,
      parentCategoryName: sql<string | null>`(SELECT pc.name FROM categories pc WHERE pc.id = ${t.categories.parentId})`,
    })
    .from(t.products)
    .leftJoin(t.brands, eq(t.products.brandId, t.brands.id))
    .innerJoin(t.categories, eq(t.products.categoryId, t.categories.id))
    .where(eq(t.products.slug, slug))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const [images, variants] = await Promise.all([
    db
      .select({ url: t.productImages.url })
      .from(t.productImages)
      .where(eq(t.productImages.productId, row.id))
      .orderBy(asc(t.productImages.order)),
    loadVariants([row.id]),
  ]);

  const chars = await db
    .select({ key: t.productCharacteristics.key, value: t.productCharacteristics.value })
    .from(t.productCharacteristics)
    .where(eq(t.productCharacteristics.productId, row.id))
    .orderBy(asc(t.productCharacteristics.order));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    brand: row.brand,
    brandSlug: row.brandSlug,
    article: row.article,
    rating: row.rating ?? 0,
    reviewsCount: row.reviewsCount ?? 0,
    hit: row.hit ?? false,
    inStock: row.inStock ?? false,
    coverageRate: row.coverageRate,
    defaultLayers: row.defaultLayers ?? 2,
    priceFrom: Math.min(...(variants.get(row.id) ?? []).map((v) => v.price), Infinity) || 0,
    images: images.map((i) => i.url),
    variants: variants.get(row.id) ?? [],
    characteristics: chars,
    compatibility: row.compatibility ? row.compatibility.split("\n").filter(Boolean) : [],
    documents: row.documents ?? [],
    description: row.description,
    applicationInstructions: row.applicationInstructions,
    videoUrl: row.videoUrl,
    categorySlug: row.categorySlug,
    categoryName: row.categoryName,
    parentCategorySlug: row.parentCategorySlug,
    parentCategoryName: row.parentCategoryName,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}

export async function getProductSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: t.products.slug }).from(t.products);
  return rows.map((r) => r.slug);
}

/* ─── Кейсы ───────────────────────────────────────────── */

export interface CaseListItem {
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  categoryName: string;
  area: string | null;
  duration: string | null;
  year: number | null;
  workType: string | null;
  image: string | null;
  tag: string | null;
}

export interface CaseDetail extends CaseListItem {
  task: string | null;
  materials: { name: string | null; description: string | null; volume: string | null; image: string | null; productId: number | null }[];
  steps: { title: string; description: string | null }[];
  results: string[];
  savings: string | null;
  savingsNote: string | null;
  serviceLife: string | null;
  serviceLifeNote: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

const CASE_LIST_COLUMNS = {
  slug: t.cases.slug,
  title: t.cases.title,
  subtitle: t.cases.subtitle,
  category: t.cases.category,
  area: t.cases.area,
  duration: t.cases.duration,
  year: t.cases.year,
  workType: t.cases.workType,
  image: t.cases.mainImage,
  tag: t.cases.tag,
};

function withCategoryName<T extends { category: string }>(row: T): T & { categoryName: string } {
  return { ...row, categoryName: CATEGORY_NAMES[row.category] ?? row.category };
}

export async function getCases(category?: string): Promise<CaseListItem[]> {
  const conditions = [eq(t.cases.published, true)];
  if (category && category !== "all") conditions.push(eq(t.cases.category, category));

  const rows = await db
    .select(CASE_LIST_COLUMNS)
    .from(t.cases)
    .where(and(...conditions))
    .orderBy(asc(t.cases.order));
  return rows.map(withCategoryName);
}

export async function getCaseCategories(): Promise<{ slug: string; name: string; count: number }[]> {
  const rows = await db
    .select({ category: t.cases.category, n: sql<number>`count(*)::int` })
    .from(t.cases)
    .where(eq(t.cases.published, true))
    .groupBy(t.cases.category);

  const counts = new Map(rows.map((r) => [r.category, Number(r.n)]));
  const total = rows.reduce((sum, r) => sum + Number(r.n), 0);

  return [
    { slug: "all", name: "Все кейсы", count: total },
    ...Object.entries(CATEGORY_NAMES).map(([slug, name]) => ({
      slug,
      name,
      count: counts.get(slug) ?? 0,
    })),
  ];
}

export async function getCase(slug: string): Promise<CaseDetail | null> {
  const rows = await db
    .select({
      ...CASE_LIST_COLUMNS,
      task: t.cases.task,
      results: t.cases.results,
      savings: t.cases.savings,
      savingsNote: t.cases.savingsNote,
      serviceLife: t.cases.serviceLife,
      serviceLifeNote: t.cases.serviceLifeNote,
      seoTitle: t.cases.seoTitle,
      seoDescription: t.cases.seoDescription,
      id: t.cases.id,
    })
    .from(t.cases)
    .where(and(eq(t.cases.slug, slug), eq(t.cases.published, true)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const [materials, steps] = await Promise.all([
    db
      .select({
        name: t.caseMaterials.name,
        description: t.caseMaterials.description,
        volume: t.caseMaterials.volume,
        image: t.caseMaterials.image,
        productId: t.caseMaterials.productId,
      })
      .from(t.caseMaterials)
      .where(eq(t.caseMaterials.caseId, row.id)),
    db
      .select({ title: t.caseSteps.title, description: t.caseSteps.description })
      .from(t.caseSteps)
      .where(eq(t.caseSteps.caseId, row.id))
      .orderBy(asc(t.caseSteps.stepNumber)),
  ]);

  return {
    ...withCategoryName(row),
    task: row.task,
    materials,
    steps,
    results: row.results ?? [],
    savings: row.savings,
    savingsNote: row.savingsNote,
    serviceLife: row.serviceLife,
    serviceLifeNote: row.serviceLifeNote,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}

export async function getCaseSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: t.cases.slug }).from(t.cases).where(eq(t.cases.published, true));
  return rows.map((r) => r.slug);
}

/* ─── Отзывы и видеообзоры ────────────────────────────── */

export interface ReviewItem {
  slug: string;
  title: string;
  type: "video" | "photo";
  thumbnail: string | null;
  description: string | null;
  views: number;
  date: string;
  dateIso: string;
  duration: string | null;
  embedUrl: string | null;
}

function formatReviewDate(d: Date): { date: string; dateIso: string } {
  const dateIso = d.toISOString().slice(0, 10);
  return {
    date: `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`,
    dateIso,
  };
}

export async function getReviews(type?: "video" | "photo"): Promise<ReviewItem[]> {
  const conditions = [eq(t.reviews.published, true)];
  if (type) conditions.push(eq(t.reviews.type, type));

  const rows = await db
    .select({
      slug: t.reviews.slug,
      title: t.reviews.title,
      type: t.reviews.type,
      thumbnail: t.reviews.thumbnail,
      description: t.reviews.description,
      views: t.reviews.views,
      duration: t.reviews.duration,
      embedUrl: t.reviews.embedUrl,
      date: t.reviews.date,
    })
    .from(t.reviews)
    .where(and(...conditions))
    .orderBy(desc(t.reviews.date));

  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    type: r.type as "video" | "photo",
    thumbnail: r.thumbnail,
    description: r.description,
    views: r.views ?? 0,
    duration: r.duration,
    embedUrl: r.embedUrl,
    ...formatReviewDate(r.date ?? new Date()),
  }));
}

/* ─── Решения ─────────────────────────────────────────── */

export interface AudienceView {
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  icon: string;
}

export interface SolutionListItem {
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  segment: string;
  features: string[];
}

export interface SolutionDetail extends SolutionListItem {
  task: string | null;
  taskPoints: string[];
  advantages: string[];
  materials: { name: string | null; description: string | null; price: string | null; image: string | null; productId: number | null }[];
  steps: { title: string; description: string | null }[];
  seoTitle: string | null;
  seoDescription: string | null;
}

export async function getAudiences(): Promise<AudienceView[]> {
  const rows = await db
    .select({
      slug: t.solutionAudiences.slug,
      title: t.solutionAudiences.title,
      description: t.solutionAudiences.description,
      image: t.solutionAudiences.image,
      icon: t.solutionAudiences.icon,
    })
    .from(t.solutionAudiences)
    .orderBy(asc(t.solutionAudiences.order));
  return rows;
}

export async function getSolutions(segment?: string): Promise<SolutionListItem[]> {
  const conditions = [eq(t.solutions.published, true)];
  if (segment && segment !== "all") conditions.push(eq(t.solutions.segment, segment));

  const rows = await db
    .select({
      slug: t.solutions.slug,
      title: t.solutions.title,
      description: t.solutions.description,
      image: t.solutions.image,
      segment: t.solutions.segment,
      features: t.solutions.features,
    })
    .from(t.solutions)
    .where(and(...conditions))
    .orderBy(asc(t.solutions.order));

  return rows.map((r) => ({ ...r, features: r.features ?? [] }));
}

export async function getSolution(slug: string): Promise<SolutionDetail | null> {
  const rows = await db
    .select({
      id: t.solutions.id,
      slug: t.solutions.slug,
      title: t.solutions.title,
      description: t.solutions.description,
      image: t.solutions.image,
      segment: t.solutions.segment,
      features: t.solutions.features,
      task: t.solutions.task,
      taskPoints: t.solutions.taskPoints,
      advantages: t.solutions.advantages,
      seoTitle: t.solutions.seoTitle,
      seoDescription: t.solutions.seoDescription,
    })
    .from(t.solutions)
    .where(and(eq(t.solutions.slug, slug), eq(t.solutions.published, true)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const [materials, steps] = await Promise.all([
    db
      .select({
        name: t.solutionMaterials.name,
        description: t.solutionMaterials.description,
        price: t.solutionMaterials.price,
        image: t.solutionMaterials.image,
        productId: t.solutionMaterials.productId,
      })
      .from(t.solutionMaterials)
      .where(eq(t.solutionMaterials.solutionId, row.id)),
    db
      .select({ title: t.solutionSteps.title, description: t.solutionSteps.description })
      .from(t.solutionSteps)
      .where(eq(t.solutionSteps.solutionId, row.id))
      .orderBy(asc(t.solutionSteps.stepNumber)),
  ]);

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image,
    segment: row.segment,
    features: row.features ?? [],
    task: row.task,
    taskPoints: row.taskPoints ?? [],
    advantages: row.advantages ?? [],
    materials,
    steps,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}

export async function getSolutionSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: t.solutions.slug })
    .from(t.solutions)
    .where(eq(t.solutions.published, true));
  return rows.map((r) => r.slug);
}

/* ─── Категории для хлебных крошек и меню ─────────────── */

export async function getTopCategories(): Promise<
  { slug: string; name: string; count: number }[]
> {
  const rows = await db.execute<{ slug: string; name: string; n: number }>(sql`
    SELECT c.slug, c.name, count(DISTINCT p.id)::int AS n
    FROM categories c
    LEFT JOIN categories sub ON sub.id = c.id OR sub.parent_id = c.id
    LEFT JOIN products p ON p.category_id = sub.id
    WHERE c.parent_id IS NULL
    GROUP BY c.slug, c.name, c."order"
    ORDER BY c."order"
  `);
  return rowsOf<{ slug: string; name: string; n: number }>(rows).map((r) => ({
    slug: r.slug,
    name: r.name,
    count: Number(r.n),
  }));
}

function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  const maybe = result as { rows?: T[] };
  return maybe?.rows ?? [];
}

/* ─── Контент-блоки ───────────────────────────────────── */

export interface ContentBlockView {
  id: number;
  key: string;
  title: string | null;
  text: string | null;
  image: string | null;
}

export async function getContentBlock(key: string): Promise<ContentBlockView | null> {
  const rows = await db
    .select({
      id: t.contentBlocks.id,
      key: t.contentBlocks.key,
      title: t.contentBlocks.title,
      text: t.contentBlocks.text,
      image: t.contentBlocks.image,
    })
    .from(t.contentBlocks)
    .where(and(eq(t.contentBlocks.key, key), eq(t.contentBlocks.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

/* ─── Настройки сайта (контакты) ──────────────────────── */

/**
 * Читает все строки site_settings и возвращает типизированный объект.
 * Каждое поле имеет фолбэк на текущее хардкод-значение, поэтому пустая
 * таблица (или ошибка БД) не ломает публичный сайт.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db
      .select({ key: t.siteSettings.key, value: t.siteSettings.value })
      .from(t.siteSettings);

    const map = new Map(rows.map((r) => [r.key, r.value]));
    const pick = (key: string, fallback: string) => {
      const v = map.get(key);
      return v != null && v !== "" ? v : fallback;
    };

    return {
      phone: pick("phone", DEFAULT_SITE_SETTINGS.phone),
      phoneTel: pick("phone_tel", DEFAULT_SITE_SETTINGS.phoneTel),
      email: pick("email", DEFAULT_SITE_SETTINGS.email),
      address: pick("address", DEFAULT_SITE_SETTINGS.address),
      workHours: pick("work_hours", DEFAULT_SITE_SETTINGS.workHours),
      whatsappUrl: pick("whatsapp_url", DEFAULT_SITE_SETTINGS.whatsappUrl),
      telegramUrl: pick("telegram_url", DEFAULT_SITE_SETTINGS.telegramUrl),
      viberUrl: pick("viber_url", DEFAULT_SITE_SETTINGS.viberUrl),
      vkUrl: pick("vk_url", DEFAULT_SITE_SETTINGS.vkUrl),
      rutubeUrl: pick("rutube_url", DEFAULT_SITE_SETTINGS.rutubeUrl),
      youtubeUrl: pick("youtube_url", DEFAULT_SITE_SETTINGS.youtubeUrl),
      copyright: pick("copyright", DEFAULT_SITE_SETTINGS.copyright),
    };
  } catch (error) {
    console.error("Failed to load site settings, using defaults:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}
