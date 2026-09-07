import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { contentBlocks } from "../src/db/schema.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL не задан. Запускайте через: node --env-file=.env --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/seed-home-banner.ts");
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

await db
  .insert(contentBlocks)
  .values({
    key: "home_banner",
    title: "Скидка 15% на первый заказ",
    text: "Используйте промокод МАЛЯР15 при оформлении заказа. Акция действует на весь ассортимент каталога.",
    published: true,
    order: 0,
  })
  .onConflictDoNothing();

const rows = await db.select().from(contentBlocks);
console.log("Блоки в БД:", JSON.stringify(rows, null, 2));
await client.end();
