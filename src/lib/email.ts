import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured, skipping email");
    return false;
  }

  try {
    const transport = getTransporter();
    await transport.sendMail({
      from: process.env.SMTP_FROM || "Маляр <noreply@malyar.ru>",
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

export function orderEmailHtml(order: {
  id: number;
  name: string;
  organization?: string | null;
  phone: string;
  email?: string | null;
  comment?: string | null;
  totalAmount: number;
  items: { productName: string; variantName?: string | null; quantity: number; price: number; sum: number }[];
}): string {
  const itemsRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.productName}${item.variantName ? ` (${item.variantName})` : ""}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.price.toLocaleString("ru-RU")} ₽</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:bold">${item.sum.toLocaleString("ru-RU")} ₽</td>
    </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#1a3a2a">🛒 Новая заявка №${order.id}</h2>
    <table style="width:100%;margin-bottom:20px">
      <tr><td style="padding:4px 0;color:#666">Клиент:</td><td style="padding:4px 0;font-weight:bold">${order.name}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Организация:</td><td style="padding:4px 0">${order.organization || "—"}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Телефон:</td><td style="padding:4px 0;font-weight:bold">${order.phone}</td></tr>
      <tr><td style="padding:4px 0;color:#666">E-mail:</td><td style="padding:4px 0">${order.email || "—"}</td></tr>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <thead>
        <tr style="background:#1a3a2a;color:white">
          <th style="padding:10px;text-align:left">Товар</th>
          <th style="padding:10px;text-align:center">Кол-во</th>
          <th style="padding:10px;text-align:right">Цена</th>
          <th style="padding:10px;text-align:right">Сумма</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
      <tfoot>
        <tr style="background:#f5f5f5">
          <td colspan="3" style="padding:12px;text-align:right;font-weight:bold">Итого:</td>
          <td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;color:#1a3a2a">${order.totalAmount.toLocaleString("ru-RU")} ₽</td>
        </tr>
      </tfoot>
    </table>
    ${order.comment ? `<p style="color:#666"><strong>Комментарий:</strong> ${order.comment}</p>` : ""}
  </div>`;
}

export function leadEmailHtml(lead: {
  id: number;
  name: string;
  contact: string;
  paintObject?: string | null;
  surfaceType?: string | null;
  comment?: string | null;
  messenger?: string | null;
}): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <h2 style="color:#1a3a2a">📋 Новая заявка на консультацию №${lead.id}</h2>
    <table style="width:100%">
      <tr><td style="padding:6px 0;color:#666">Имя:</td><td style="padding:6px 0;font-weight:bold">${lead.name}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Контакт:</td><td style="padding:6px 0;font-weight:bold">${lead.contact}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Мессенджер:</td><td style="padding:6px 0">${lead.messenger || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Что покрасить:</td><td style="padding:6px 0">${lead.paintObject || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Тип поверхности:</td><td style="padding:6px 0">${lead.surfaceType || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Комментарий:</td><td style="padding:6px 0">${lead.comment || "—"}</td></tr>
    </table>
  </div>`;
}
