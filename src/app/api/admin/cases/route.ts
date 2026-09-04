import { NextRequest, NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
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

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(cases)
    .orderBy(asc(cases.order), desc(cases.createdAt));

  return NextResponse.json({ cases: items });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, category } = body;

  if (!title || !slug || !category) {
    return NextResponse.json(
      { error: "title, slug и category обязательны" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: cases.id })
    .from(cases)
    .where(eq(cases.slug, slug))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "Кейс с таким slug уже существует" },
      { status: 409 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [item] = await tx
        .insert(cases)
        .values({
          title,
          slug,
          category,
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
        .returning();

      if (body.images?.length > 0) {
        await tx.insert(caseImages).values(
          body.images
            .filter((img: CaseImageInput) => img.url)
            .map((img: CaseImageInput, idx: number) => ({
              caseId: item.id,
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
              caseId: item.id,
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
              caseId: item.id,
              stepNumber: idx + 1,
              title: s.title,
              description: s.description || null,
            }))
        );
      }

      return item;
    });

    return NextResponse.json({ case: result }, { status: 201 });
  } catch (error) {
    console.error("Failed to create case:", error);
    return NextResponse.json({ error: "Ошибка создания кейса" }, { status: 500 });
  }
}
