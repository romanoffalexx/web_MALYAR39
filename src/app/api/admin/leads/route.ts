import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

  return NextResponse.json({ leads: allLeads });
}
