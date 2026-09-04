const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeMd(text: string): string {
  return text
    .replace(/_/g, "\\_")
    .replace(/\*/g, "\\*")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/~/g, "\\~")
    .replace(/`/g, "\\`")
    .replace(/>/g, "\\>")
    .replace(/#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/-/g, "\\-")
    .replace(/=/g, "\\=")
    .replace(/\|/g, "\\|")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\./g, "\\.")
    .replace(/!/g, "\\!");
}

export async function sendTelegramMessage(
  text: string,
  chatIds?: string[]
): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.warn("TELEGRAM_BOT_TOKEN not set, skipping notification");
    return false;
  }

  const ids = chatIds ||
    (DEFAULT_CHAT_ID ? DEFAULT_CHAT_ID.split(",").map((id) => id.trim()) : []);

  if (ids.length === 0) {
    console.warn("No Telegram chat IDs configured");
    return false;
  }

  const escapedText = escapeMd(text);

  let delivered = false;

  for (const chatId of ids) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: escapedText,
            parse_mode: "MarkdownV2",
            disable_web_page_preview: true,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`Telegram send failed for ${chatId}: ${error}`);
        continue;
      }

      const result = (await response.json()) as { ok?: boolean };
      if (result.ok) {
        delivered = true;
      } else {
        console.error(`Telegram rejected message for ${chatId}`);
      }
    } catch (err) {
      console.error(`Telegram send error for ${chatId}:`, err);
    }
  }

  return delivered;
}

export function formatOrderNotification(order: {
  id: number;
  name: string;
  organization?: string | null;
  phone: string;
  email?: string | null;
  comment?: string | null;
  totalAmount: number;
  items: { productName: string; variantName?: string | null; quantity: number; price: number; sum: number }[];
}): string {
  const itemsText = order.items
    .map(
      (item) =>
        `  • ${item.productName}${item.variantName ? ` (${item.variantName})` : ""} — ${item.quantity} шт. = ${item.sum.toLocaleString("ru-RU")} ₽`
    )
    .join("\n");

  return `🛒 *НОВАЯ ЗАЯВКА №${order.id}*

👤 Клиент: ${order.name}
🏢 Организация: ${order.organization || "—"}
📞 Телефон: ${order.phone}
📧 E\\-mail: ${order.email || "—"}

📦 Товары:
${itemsText}

💰 Итого: ${order.totalAmount.toLocaleString("ru-RU")} ₽

💬 Комментарий: ${order.comment || "—"}

🔗 Админ\\-панель: ${process.env.DOMAIN || ""}/admin/orders`;
}

export function formatLeadNotification(lead: {
  id: number;
  name: string;
  contact: string;
  paintObject?: string | null;
  surfaceType?: string | null;
  comment?: string | null;
  messenger?: string | null;
}): string {
  return `📋 *НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ №${lead.id}*

👤 Имя: ${lead.name}
📞 Контакт: ${lead.contact}
💬 Мессенджер: ${lead.messenger || "—"}

🎨 Что покрасить: ${lead.paintObject || "—"}
🧱 Тип поверхности: ${lead.surfaceType || "—"}
💬 Комментарий: ${lead.comment || "—"}

🔗 Админ\\-панель: ${process.env.DOMAIN || ""}/admin/leads`;
}
