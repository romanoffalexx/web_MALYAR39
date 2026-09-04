import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({ key: siteSettings.key, value: siteSettings.value })
    .from(siteSettings);

  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value ?? "";

  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const incoming = (body.settings ?? {}) as Record<string, unknown>;

  const rows = Object.entries(incoming)
    .filter(([key]) => typeof key === "string" && key.length > 0)
    .map(([key, value]) => ({
      key,
      value: value == null ? "" : String(value),
      updatedAt: new Date(),
    }));

  if (rows.length === 0) {
    return NextResponse.json({ success: true, updated: 0 });
  }

  try {
    await db
      .insert(siteSettings)
      .values(rows)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value: sql`excluded.value`,
          updatedAt: sql`excluded.updated_at`,
        },
      });

    return NextResponse.json({ success: true, updated: rows.length });
  } catch (error) {
    console.error("Failed to save site settings:", error);
    return NextResponse.json(
      { error: "Ошибка сохранения настроек" },
      { status: 500 }
    );
  }
}
