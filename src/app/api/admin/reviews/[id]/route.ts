import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

type ReviewType = "video" | "photo";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, parseInt(id)));

  if (!review) {
    return NextResponse.json({ error: "Обзор не найден" }, { status: 404 });
  }

  return NextResponse.json({ review });
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
  const reviewId = parseInt(id);
  const body = await request.json();

  if (!body.title || !body.slug) {
    return NextResponse.json(
      { error: "title и slug обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(eq(reviews.slug, body.slug))
    .limit(1);
  if (existing && existing.id !== reviewId) {
    return NextResponse.json(
      { error: "Обзор с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const [review] = await db
      .update(reviews)
      .set({
        title: body.title,
        slug: body.slug,
        type: (body.type || "video") as ReviewType,
        embedUrl: body.embedUrl || null,
        thumbnail: body.thumbnail || null,
        description: body.description || null,
        duration: body.duration || null,
        views: body.views != null ? parseInt(String(body.views)) : 0,
        date: body.date ? new Date(body.date) : new Date(),
        category: body.category || null,
        published: body.published ?? true,
        featured: body.featured ?? false,
        order: body.order != null ? parseInt(String(body.order)) : 0,
      })
      .where(eq(reviews.id, reviewId))
      .returning();

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json({ error: "Ошибка обновления обзора" }, { status: 500 });
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
  await db.delete(reviews).where(eq(reviews.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
