import { NextResponse } from "next/server";
import { count, desc, eq, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { leads, orders, products } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

async function countRows(table: PgTable, where?: SQL) {
  const [row] = await db.select({ value: count() }).from(table).where(where);
  return row?.value ?? 0;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalProducts,
    totalOrders,
    newOrders,
    totalLeads,
    newLeads,
    recentOrders,
  ] = await Promise.all([
    countRows(products),
    countRows(orders),
    countRows(orders, eq(orders.status, "new")),
    countRows(leads),
    countRows(leads, eq(leads.status, "new")),
    db
      .select({
        id: orders.id,
        name: orders.name,
        organization: orders.organization,
        phone: orders.phone,
        totalAmount: orders.totalAmount,
        status: orders.status,
        notified: orders.notified,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5),
  ]);

  return NextResponse.json({
    totalProducts,
    totalOrders,
    newOrders,
    totalLeads,
    newLeads,
    recentOrders,
  });
}
