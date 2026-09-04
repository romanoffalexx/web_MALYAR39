import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  const allItems = await db.select().from(orderItems).orderBy(orderItems.id);

  const itemsByOrder = new Map<number, typeof allItems>();
  for (const item of allItems) {
    const list = itemsByOrder.get(item.orderId);
    if (list) list.push(item);
    else itemsByOrder.set(item.orderId, [item]);
  }

  const ordersWithItems = allOrders.map((order) => ({
    ...order,
    items: itemsByOrder.get(order.id) ?? [],
  }));

  return NextResponse.json({ orders: ordersWithItems });
}
