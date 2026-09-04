import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { sendTelegramMessage, formatLeadNotification } from "@/lib/telegram";
import { sendEmail, leadEmailHtml } from "@/lib/email";
import { z } from "zod";
import { eq } from "drizzle-orm";

const leadSchema = z.object({
  paintObject: z.string().optional(),
  surfaceType: z.string().optional(),
  comment: z.string().max(300).optional(),
  name: z.string().min(1),
  contact: z.string().min(1),
  messenger: z.enum(["whatsapp", "telegram", "viber", "email"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = leadSchema.parse(body);

    const [lead] = await db
      .insert(leads)
      .values({
        paintObject: data.paintObject || null,
        surfaceType: data.surfaceType || null,
        comment: data.comment || null,
        name: data.name,
        contact: data.contact,
        messenger: data.messenger || "telegram",
      })
      .returning();

    const notificationText = formatLeadNotification(lead);

    const results = await Promise.allSettled([
      sendTelegramMessage(notificationText),
      sendEmail(
        process.env.SMTP_TO || "",
        `Новая заявка на консультацию №${lead.id} — Маляр`,
        leadEmailHtml(lead)
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
      .update(leads)
      .set({ notified })
      .where(eq(leads.id, lead.id));

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error("Lead creation error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
