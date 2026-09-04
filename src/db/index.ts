import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as {
  __dbClient: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.__dbClient ?? postgres(connectionString, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__dbClient = client;
}

export const db = drizzle(client, { schema });

export * from "./schema";
