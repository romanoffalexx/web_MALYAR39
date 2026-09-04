import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contentBlocks } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(contentBlocks)
    .orderBy(asc(contentBlocks.order), asc(contentBlocks.key));

  return NextResponse.json({ contentBlocks: items });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { key, title } = body;

  if (!key || !title) {
    return NextResponse.json(
      { error: "key и title обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: contentBlocks.id })
    .from(contentBlocks)
    .where(eq(contentBlocks.key, key))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "Блок с таким key уже существует" },
      { status: 409 }
    );
  }

  try {
    const [block] = await db
      .insert(contentBlocks)
      .values({
        key,
        title,
        text: body.text || null,
        image: body.image || null,
        order: body.order != null ? parseInt(String(body.order)) : 0,
        published: body.published != null ? Boolean(body.published) : true,
      })
      .returning();

    return NextResponse.json({ contentBlock: block }, { status: 201 });
  } catch (error) {
    console.error("Failed to create content block:", error);
    return NextResponse.json(
      { error: "Ошибка создания контент-блока" },
      { status: 500 }
    );
  }
}
