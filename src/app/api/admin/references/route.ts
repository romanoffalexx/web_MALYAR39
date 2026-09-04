import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, brands } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [allCategories, allBrands] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.name)),
    db.select().from(brands).orderBy(asc(brands.name)),
  ]);

  return NextResponse.json({ categories: allCategories, brands: allBrands });
}
