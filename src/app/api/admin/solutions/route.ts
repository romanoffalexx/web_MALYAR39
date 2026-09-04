import { NextRequest, NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
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

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(solutions)
    .orderBy(asc(solutions.order), desc(solutions.createdAt));

  return NextResponse.json({ solutions: items });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, segment } = body;

  if (!title || !slug || !segment) {
    return NextResponse.json(
      { error: "title, slug и segment обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: solutions.id })
    .from(solutions)
    .where(eq(solutions.slug, slug))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "Решение с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [item] = await tx
        .insert(solutions)
        .values({
          title,
          slug,
          segment,
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
        .returning();

      if (body.materials?.length > 0) {
        await tx.insert(solutionMaterials).values(
          body.materials
            .filter((m: MaterialInput) => m.name)
            .map((m: MaterialInput) => ({
              solutionId: item.id,
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
              solutionId: item.id,
              stepNumber: idx + 1,
              title: s.title,
              description: s.description || null,
            }))
        );
      }

      return item;
    });

    return NextResponse.json({ solution: result }, { status: 201 });
  } catch (error) {
    console.error("Failed to create solution:", error);
    return NextResponse.json({ error: "Ошибка создания решения" }, { status: 500 });
  }
}
