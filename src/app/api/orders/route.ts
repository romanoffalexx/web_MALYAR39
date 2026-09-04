import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products, productVariants } from "@/db/schema";
import { sendTelegramMessage, formatOrderNotification } from "@/lib/telegram";
import { sendEmail, orderEmailHtml } from "@/lib/email";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";

const orderSchema = z.object({
  name: z.string().min(1),
  organization: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  comment: z.string().optional(),
  totalAmount: z.number().int().positive(),
  items: z
    .array(
      z.object({
        productId: z.number().int().optional(),
        variantId: z.number().int().optional(),
        productName: z.string(),
        variantName: z.string().optional(),
        quantity: z.number().int().positive(),
        price: z.number().int(),
        sum: z.number().int(),
      })
    )
    .min(1),
});

async function resolveExistingIds(
  ids: (number | undefined)[],
  table: typeof products | typeof productVariants
): Promise<Set<number>> {
  const candidates = ids.filter((id): id is number => typeof id === "number");
  if (candidates.length === 0) return new Set();

  const rows = await db
    .select({ id: table.id })
    .from(table)
    .where(inArray(table.id, candidates));

  return new Set(rows.map((row) => row.id));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const [validProductIds, validVariantIds] = await Promise.all([
      resolveExistingIds(
        data.items.map((item) => item.productId),
        products
      ),
      resolveExistingIds(
        data.items.map((item) => item.variantId),
        productVariants
      ),
    ]);

    const [order] = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(orders)
        .values({
          name: data.name,
          organization: data.organization || null,
          phone: data.phone,
          email: data.email || null,
          comment: data.comment || null,
          totalAmount: data.totalAmount,
        })
        .returning();

      await tx.insert(orderItems).values(
        data.items.map((item) => ({
          orderId: created.id,
          productId:
            item.productId && validProductIds.has(item.productId)
              ? item.productId
              : null,
          variantId:
            item.variantId && validVariantIds.has(item.variantId)
              ? item.variantId
              : null,
          productName: item.productName,
          variantName: item.variantName || null,
          quantity: item.quantity,
          price: item.price,
          sum: item.sum,
        }))
      );

      return [created];
    });

    // Notifications (non-blocking)
    const notificationText = formatOrderNotification({
      ...order,
      items: data.items,
    });

    const results = await Promise.allSettled([
      sendTelegramMessage(notificationText),
      sendEmail(
        process.env.SMTP_TO || "",
        `Новая заявка №${order.id} — Маляр`,
        orderEmailHtml({ ...order, items: data.items })
      ),
    ]);

    const notified = results.some(
      (result) => result.status === "fulfilled" && result.value === true
    );

    results
      .filter(
        (result): result is PromiseRejectedResult => result.status === "rejected"
      )
      .forEach((result) => console.error("Notification error:", result.reason));

    await db
      .update(orders)
      .set({ notified })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
