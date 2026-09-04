import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contentBlocks } from "@/db/schema";
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
  const [block] = await db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.id, parseInt(id)));

  if (!block) {
    return NextResponse.json(
      { error: "Контент-блок не найден" },
      { status: 404 }
    );
  }

  return NextResponse.json({ contentBlock: block });
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
  const blockId = parseInt(id);
  const body = await request.json();

  if (!body.key || !body.title) {
    return NextResponse.json(
      { error: "key и title обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: contentBlocks.id })
    .from(contentBlocks)
    .where(eq(contentBlocks.key, body.key))
    .limit(1);
  if (existing && existing.id !== blockId) {
    return NextResponse.json(
      { error: "Блок с таким key уже существует" },
      { status: 409 }
    );
  }

  try {
    const [block] = await db
      .update(contentBlocks)
      .set({
        key: body.key,
        title: body.title,
        text: body.text || null,
        image: body.image || null,
        order: body.order != null ? parseInt(String(body.order)) : 0,
        published: body.published != null ? Boolean(body.published) : true,
      })
      .where(eq(contentBlocks.id, blockId))
      .returning();

    return NextResponse.json({ contentBlock: block });
  } catch (error) {
    console.error("Failed to update content block:", error);
    return NextResponse.json(
      { error: "Ошибка обновления контент-блока" },
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
  await db.delete(contentBlocks).where(eq(contentBlocks.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
