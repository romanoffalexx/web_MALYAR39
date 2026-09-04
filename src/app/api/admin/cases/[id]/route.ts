import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  cases,
  caseImages,
  caseMaterials,
  caseSteps,
} from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

type CaseImageType = "before" | "after" | "process" | "result";

interface CaseImageInput {
  url: string;
  type?: string;
  caption?: string;
  order?: number;
}
interface CaseMaterialInput {
  productId?: string | number | null;
  name?: string;
  description?: string;
  volume?: string;
  image?: string;
}
interface CaseStepInput {
  title: string;
  description?: string;
}

async function fetchCaseWithRelations(caseId: number) {
  const [item] = await db.select().from(cases).where(eq(cases.id, caseId));
  if (!item) return null;

  const [images, materials, steps] = await Promise.all([
    db.select().from(caseImages).where(eq(caseImages.caseId, caseId)).orderBy(asc(caseImages.order)),
    db.select().from(caseMaterials).where(eq(caseMaterials.caseId, caseId)),
    db.select().from(caseSteps).where(eq(caseSteps.caseId, caseId)).orderBy(asc(caseSteps.stepNumber)),
  ]);

  return { ...item, images, materials, steps };
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
  const item = await fetchCaseWithRelations(parseInt(id));
  if (!item) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  return NextResponse.json({ case: item });
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
  const caseId = parseInt(id);
  const body = await request.json();

  if (!body.title || !body.slug || !body.category) {
    return NextResponse.json(
      { error: "title, slug и category обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: cases.id })
    .from(cases)
    .where(eq(cases.slug, body.slug))
    .limit(1);
  if (existing && existing.id !== caseId) {
    return NextResponse.json(
      { error: "Кейс с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [item] = await tx
        .update(cases)
        .set({
          title: body.title,
          slug: body.slug,
          category: body.category,
          subtitle: body.subtitle || null,
          description: body.description || null,
          task: body.task || null,
          result: body.result || null,
          results: body.results || null,
          area: body.area || null,
          duration: body.duration || null,
          year: body.year ? parseInt(String(body.year)) : null,
          workType: body.workType || null,
          tag: body.tag || null,
          savings: body.savings || null,
          savingsNote: body.savingsNote || null,
          serviceLife: body.serviceLife || null,
          serviceLifeNote: body.serviceLifeNote || null,
          mainImage: body.mainImage || null,
          seoTitle: body.seoTitle || null,
          seoDescription: body.seoDescription || null,
          published: body.published ?? true,
          featured: body.featured ?? false,
          order: body.order != null ? parseInt(String(body.order)) : 0,
        })
        .where(eq(cases.id, caseId))
        .returning();

      await tx.delete(caseImages).where(eq(caseImages.caseId, caseId));
      await tx.delete(caseMaterials).where(eq(caseMaterials.caseId, caseId));
      await tx.delete(caseSteps).where(eq(caseSteps.caseId, caseId));

      if (body.images?.length > 0) {
        await tx.insert(caseImages).values(
          body.images
            .filter((img: CaseImageInput) => img.url)
            .map((img: CaseImageInput, idx: number) => ({
              caseId,
              url: img.url,
              type: (img.type || "process") as CaseImageType,
              caption: img.caption || null,
              order: img.order ?? idx,
            }))
        );
      }

      if (body.materials?.length > 0) {
        await tx.insert(caseMaterials).values(
          body.materials
            .filter((m: CaseMaterialInput) => m.name)
            .map((m: CaseMaterialInput) => ({
              caseId,
              productId: m.productId ? parseInt(String(m.productId)) : null,
              name: m.name || null,
              description: m.description || null,
              volume: m.volume || null,
              image: m.image || null,
            }))
        );
      }

      if (body.steps?.length > 0) {
        await tx.insert(caseSteps).values(
          body.steps
            .filter((s: CaseStepInput) => s.title)
            .map((s: CaseStepInput, idx: number) => ({
              caseId,
              stepNumber: idx + 1,
              title: s.title,
              description: s.description || null,
            }))
        );
      }

      return item;
    });

    return NextResponse.json({ case: result });
  } catch (error) {
    console.error("Failed to update case:", error);
    return NextResponse.json({ error: "Ошибка обновления кейса" }, { status: 500 });
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
  await db.delete(cases).where(eq(cases.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
