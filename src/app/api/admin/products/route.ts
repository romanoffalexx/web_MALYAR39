import { NextRequest, NextResponse } from "next/server";
import { eq, ilike, sql, and, desc } from "drizzle-orm";
import { db } from "@/db";
import {
  products,
  categories,
  brands,
  productVariants,
  productImages,
  productCharacteristics,
} from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const conditions = [];
  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }
  if (categoryId) {
    conditions.push(eq(products.categoryId, parseInt(categoryId)));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const items = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      categoryId: products.categoryId,
      brandId: products.brandId,
      shortDescription: products.shortDescription,
      article: products.article,
      coverageRate: products.coverageRate,
      defaultLayers: products.defaultLayers,
      inStock: products.inStock,
      isPopular: products.isPopular,
      rating: products.rating,
      reviewsCount: products.reviewsCount,
      createdAt: products.createdAt,
      categoryName: categories.name,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(where)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  const [countRow] = await db
    .select({ value: sql<number>`count(*)` })
    .from(products)
    .where(where);
  const total = Number(countRow?.value ?? 0);

  const productIds = items.map((p) => p.id);
  const [variantsList, imagesList, charsList] =
    productIds.length > 0
      ? await Promise.all([
          db
            .select()
            .from(productVariants)
            .where(sql`${productVariants.productId} IN (${sql.join(productIds.map((id) => sql`${id}`), sql`, `)})`),
          db
            .select()
            .from(productImages)
            .where(sql`${productImages.productId} IN (${sql.join(productIds.map((id) => sql`${id}`), sql`, `)})`)
            .orderBy(productImages.order),
          db
            .select()
            .from(productCharacteristics)
            .where(sql`${productCharacteristics.productId} IN (${sql.join(productIds.map((id) => sql`${id}`), sql`, `)})`)
            .orderBy(productCharacteristics.order),
        ])
      : [[], [], []];

  const productsWithRelations = items.map((p) => ({
    ...p,
    variants: variantsList.filter((v) => v.productId === p.id),
    images: imagesList.filter((i) => i.productId === p.id),
    characteristics: charsList.filter((c) => c.productId === p.id),
  }));

  return NextResponse.json({ products: productsWithRelations, total });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, categoryId } = body;

  if (!name || !slug || !categoryId) {
    return NextResponse.json(
      { error: "name, slug и categoryId обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "Товар с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          name,
          slug,
          categoryId: parseInt(categoryId),
          brandId: body.brandId ? parseInt(body.brandId) : null,
          description: body.description || null,
          shortDescription: body.shortDescription || null,
          article: body.article || null,
          applicationInstructions: body.applicationInstructions || null,
          compatibility: body.compatibility || null,
          videoUrl: body.videoUrl || null,
          documents: body.documents || null,
          coverageRate: body.coverageRate != null ? parseFloat(body.coverageRate) : null,
          defaultLayers: body.defaultLayers != null ? parseInt(body.defaultLayers) : 2,
          seoTitle: body.seoTitle || null,
          seoDescription: body.seoDescription || null,
          inStock: body.inStock ?? true,
          isPopular: body.isPopular ?? false,
          rating: body.rating != null ? parseFloat(body.rating) : 0,
        })
        .returning();

      if (body.variants?.length > 0) {
        await tx.insert(productVariants).values(
          body.variants.map((v: { volume: string; unit: string; price: string; oldPrice?: string; sku?: string; stock?: string }) => ({
            productId: product.id,
            packagingVolume: parseFloat(String(v.volume)),
            packagingUnit: v.unit || "л",
            price: parseInt(String(v.price)),
            oldPrice: v.oldPrice ? parseInt(String(v.oldPrice)) : null,
            sku: v.sku || null,
            stock: v.stock != null ? parseInt(String(v.stock)) : 0,
          }))
        );
      }

      if (body.images?.length > 0) {
        await tx.insert(productImages).values(
          body.images.map((img: { url: string; alt?: string; order?: number; isMain?: boolean }, idx: number) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt || null,
            order: img.order ?? idx,
            isMain: img.isMain ?? (idx === 0),
          }))
        );
      }

      if (body.characteristics?.length > 0) {
        await tx.insert(productCharacteristics).values(
          body.characteristics.map((c: { key: string; value: string; order?: number }, idx: number) => ({
            productId: product.id,
            key: c.key,
            value: c.value,
            order: c.order ?? idx,
          }))
        );
      }

      return product;
    });

    return NextResponse.json({ product: result }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Ошибка создания товара" },
      { status: 500 }
    );
  }
}
