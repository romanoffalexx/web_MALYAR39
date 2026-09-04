import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  solutions,
  solutionMaterials,
  solutionSteps,
} from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

interface MaterialInput {
  productId?: string | number | null;
  name?: string;
  image?: string;
  description?: string;
  price?: string;
}
interface StepInput {
  title: string;
  description?: string;
}

async function fetchSolutionWithRelations(solutionId: number) {
  const [item] = await db
    .select()
    .from(solutions)
    .where(eq(solutions.id, solutionId));
  if (!item) return null;

  const [materials, steps] = await Promise.all([
    db.select().from(solutionMaterials).where(eq(solutionMaterials.solutionId, solutionId)),
    db.select().from(solutionSteps).where(eq(solutionSteps.solutionId, solutionId)).orderBy(asc(solutionSteps.stepNumber)),
  ]);

  return { ...item, materials, steps };
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
  const item = await fetchSolutionWithRelations(parseInt(id));
  if (!item) {
    return NextResponse.json({ error: "Решение не найдено" }, { status: 404 });
  }

  return NextResponse.json({ solution: item });
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
  const solutionId = parseInt(id);
  const body = await request.json();

  if (!body.title || !body.slug || !body.segment) {
    return NextResponse.json(
      { error: "title, slug и segment обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: solutions.id })
    .from(solutions)
    .where(eq(solutions.slug, body.slug))
    .limit(1);
  if (existing && existing.id !== solutionId) {
    return NextResponse.json(
      { error: "Решение с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [item] = await tx
        .update(solutions)
        .set({
          title: body.title,
          slug: body.slug,
          segment: body.segment,
          description: body.description || null,
          features: body.features || null,
          task: body.task || null,
          taskPoints: body.taskPoints || null,
          advantages: body.advantages || null,
          image: body.image || null,
          seoTitle: body.seoTitle || null,
          seoDescription: body.seoDescription || null,
          published: body.published ?? true,
          order: body.order != null ? parseInt(String(body.order)) : 0,
        })
        .where(eq(solutions.id, solutionId))
        .returning();

      await tx.delete(solutionMaterials).where(eq(solutionMaterials.solutionId, solutionId));
      await tx.delete(solutionSteps).where(eq(solutionSteps.solutionId, solutionId));

      if (body.materials?.length > 0) {
        await tx.insert(solutionMaterials).values(
          body.materials
            .filter((m: MaterialInput) => m.name)
            .map((m: MaterialInput) => ({
              solutionId,
              productId: m.productId ? parseInt(String(m.productId)) : null,
              name: m.name || null,
              image: m.image || null,
              description: m.description || null,
              price: m.price || null,
            }))
        );
      }

      if (body.steps?.length > 0) {
        await tx.insert(solutionSteps).values(
          body.steps
            .filter((s: StepInput) => s.title)
            .map((s: StepInput, idx: number) => ({
              solutionId,
              stepNumber: idx + 1,
              title: s.title,
              description: s.description || null,
            }))
        );
      }

      return item;
    });

    return NextResponse.json({ solution: result });
  } catch (error) {
    console.error("Failed to update solution:", error);
    return NextResponse.json({ error: "Ошибка обновления решения" }, { status: 500 });
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
  await db.delete(solutions).where(eq(solutions.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
