// src/db/drizzle/connection.ts
import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { postsTable } from "./schemas";

export function getDrizzleDb() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "A variável de ambiente TURSO_DATABASE_URL não está definida. Verifique seu .env",
    );
  }

  if (!authToken) {
    throw new Error(
      "A variável de ambiente TURSO_AUTH_TOKEN não está definida. Verifique seu .env",
    );
  }

  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client, {
    schema: {
      posts: postsTable,
    },
    logger: false,
  });
}
