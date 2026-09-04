import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, parseInt(id)));

  if (!category) {
    return NextResponse.json({ error: "Категория не найдена" }, { status: 404 });
  }

  return NextResponse.json({ category });
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
  const categoryId = parseInt(id);
  const body = await request.json();

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "name и slug обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, body.slug))
    .limit(1);
  if (existing && existing.id !== categoryId) {
    return NextResponse.json(
      { error: "Категория с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const [category] = await db
      .update(categories)
      .set({
        name: body.name,
        slug: body.slug,
        parentId: body.parentId ? parseInt(String(body.parentId)) : null,
        description: body.description || null,
        image: body.image || null,
        order: body.order != null ? parseInt(String(body.order)) : 0,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      })
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { error: "Ошибка обновления категории" },
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
  await db.delete(categories).where(eq(categories.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
