import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.order), asc(categories.name));

  return NextResponse.json({ categories: items });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "name и slug обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "Категория с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const [category] = await db
      .insert(categories)
      .values({
        name,
        slug,
        parentId: body.parentId ? parseInt(String(body.parentId)) : null,
        description: body.description || null,
        image: body.image || null,
        order: body.order != null ? parseInt(String(body.order)) : 0,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      })
      .returning();

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Ошибка создания категории" },
      { status: 500 }
    );
  }
}
