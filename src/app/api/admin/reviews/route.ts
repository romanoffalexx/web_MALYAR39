import { NextRequest, NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

type ReviewType = "video" | "photo";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(reviews)
    .orderBy(asc(reviews.order), desc(reviews.date));

  return NextResponse.json({ reviews: items });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug } = body;

  if (!title || !slug) {
    return NextResponse.json(
      { error: "title и slug обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(eq(reviews.slug, slug))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "Обзор с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const [review] = await db
      .insert(reviews)
      .values({
        title,
        slug,
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
      .returning();

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Ошибка создания обзора" }, { status: 500 });
  }
}
