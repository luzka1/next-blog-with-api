import { eq } from "drizzle-orm";
import { drizzleDb } from ".";
import { postsTable } from "./schemas";

(async () => {
  await drizzleDb
    .update(postsTable)
    .set({
      title: "Os desafios do trabalho remoto moderno",
    })
    .where(eq(postsTable.slug, "os-desafios-do-trabalho-remoto-moderno"));
})();
