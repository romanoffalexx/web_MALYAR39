import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
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

async function fetchProductWithRelations(productId: number) {
  const [product] = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      categoryId: products.categoryId,
      brandId: products.brandId,
      description: products.description,
      shortDescription: products.shortDescription,
      article: products.article,
      applicationInstructions: products.applicationInstructions,
      compatibility: products.compatibility,
      videoUrl: products.videoUrl,
      documents: products.documents,
      coverageRate: products.coverageRate,
      defaultLayers: products.defaultLayers,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      inStock: products.inStock,
      isPopular: products.isPopular,
      rating: products.rating,
      reviewsCount: products.reviewsCount,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.id, productId));

  if (!product) return null;

  const [variants, images, characteristics] = await Promise.all([
    db.select().from(productVariants).where(eq(productVariants.productId, productId)),
    db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.order),
    db.select().from(productCharacteristics).where(eq(productCharacteristics.productId, productId)).orderBy(productCharacteristics.order),
  ]);

  return { ...product, variants, images, characteristics };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await fetchProductWithRelations(parseInt(id));
  if (!product) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  const body = await request.json();

  if (!body.name || !body.slug || !body.categoryId) {
    return NextResponse.json(
      { error: "name, slug и categoryId обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, body.slug))
    .limit(1);
  if (existing && existing.id !== productId) {
    return NextResponse.json(
      { error: "Товар с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [product] = await tx
        .update(products)
        .set({
          name: body.name,
          slug: body.slug,
          categoryId: parseInt(body.categoryId),
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
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId))
        .returning();

      await tx.delete(productVariants).where(eq(productVariants.productId, productId));
      await tx.delete(productImages).where(eq(productImages.productId, productId));
      await tx.delete(productCharacteristics).where(eq(productCharacteristics.productId, productId));

      if (body.variants?.length > 0) {
        await tx.insert(productVariants).values(
          body.variants.map((v: { volume: string; unit: string; price: string; oldPrice?: string; sku?: string; stock?: string }) => ({
            productId,
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
            productId,
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
            productId,
            key: c.key,
            value: c.value,
            order: c.order ?? idx,
          }))
        );
      }

      return product;
    });

    return NextResponse.json({ product: result });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Ошибка обновления товара" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(products).where(eq(products.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
